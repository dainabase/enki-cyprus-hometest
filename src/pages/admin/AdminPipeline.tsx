import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Star, Clock, Euro } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useToast } from '@/hooks/use-toast';

export default function AdminPipeline() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [leads, setLeads] = useState([]);
  const [stages, setStages] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    fetchStages();
    fetchLeads();
  }, []);

  useEffect(() => {
    if (leads.length > 0 && stages.length > 0) {
      calculateMetrics(leads);
    }
  }, [leads, stages]);

  const fetchStages = async () => {
    const { data, error } = await supabase
      .from('pipeline_stages')
      .select('*')
      .eq('is_active', true)
      .order('display_order');
    
    if (error) {
      toast({
        title: t('messages.error'),
        description: error.message,
        variant: 'destructive'
      });
    } else if (data) {
      setStages(data);
    }
  };

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from('leads')
      .select('*, developers(name)')
      .order('score', { ascending: false });
    
    if (error) {
      toast({
        title: t('messages.error'),
        description: error.message,
        variant: 'destructive'
      });
    } else if (data) {
      setLeads(data);
    }
  };

  const calculateMetrics = (leadsData) => {
    const newMetrics = {};
    stages.forEach(stage => {
      const stageLeads = leadsData.filter(lead => lead.status === stage.stage_key);
      newMetrics[stage.stage_key] = {
        count: stageLeads.length,
        value: stageLeads.reduce((sum, lead) => sum + (lead.budget_max || 0), 0)
      };
    });
    setMetrics(newMetrics);
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    
    const leadId = result.draggableId;
    const newStatus = result.destination.droppableId;
    
    // Mettre à jour localement
    const updatedLeads = leads.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus, status_changed_at: new Date().toISOString() } : lead
    );
    setLeads(updatedLeads);
    
    // Mettre à jour dans la base
    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', leadId);
    
    if (error) {
      toast({
        title: t('messages.error'),
        description: error.message,
        variant: 'destructive'
      });
      // Revert local change on error
      fetchLeads();
    } else {
      // Log activity
      await supabase
        .from('lead_activities')
        .insert({
          lead_id: leadId,
          activity_type: 'status_change',
          description: `Moved to ${newStatus}`
        });
      
      toast({
        title: t('messages.success'),
        description: t('pipeline.leadMoved')
      });
    }
  };

  const getDaysInStage = (statusChangedAt) => {
    if (!statusChangedAt) return 0;
    const days = Math.floor((Date.now() - new Date(statusChangedAt).getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const renderStars = (score) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={12}
        className={i < score ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}
      />
    ));
  };

  const LeadCard = ({ lead, index }) => (
    <Draggable draggableId={lead.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-card border p-3 rounded mb-2 cursor-move hover:bg-muted/50 ${
            snapshot.isDragging ? 'opacity-75' : ''
          }`}
          onClick={() => setSelectedLead(lead)}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="font-medium text-sm text-card-foreground">
              {lead.first_name} {lead.last_name}
            </div>
            {lead.golden_visa_interest && (
              <span className="text-xs bg-yellow-500 text-black px-1 rounded">GV</span>
            )}
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="flex">{renderStars(lead.score)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock size={12} className="mr-1" />
              {getDaysInStage(lead.status_changed_at)}d
            </div>
          </div>
          
          {lead.budget_max && (
            <div className="flex items-center text-sm text-card-foreground">
              <Euro size={12} className="mr-1" />
              €{Number(lead.budget_max).toLocaleString()}
            </div>
          )}
          
          {lead.developers?.name && (
            <div className="text-xs text-muted-foreground mt-1">
              {lead.developers.name}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );

  if (stages.length === 0) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <p>{t('form.loading')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('pipeline.title')}</CardTitle>
          <div className="grid grid-cols-6 gap-4 mt-4">
            {stages.map(stage => (
              <div key={stage.stage_key} className="text-center">
                <div className="text-2xl font-bold">{metrics[stage.stage_key]?.count || 0}</div>
                <div className="text-sm text-muted-foreground">
                  €{(metrics[stage.stage_key]?.value || 0).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {t(`leads.status.${stage.stage_key}`)}
                </div>
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-6 gap-4">
              {stages.map(stage => (
                <div key={stage.stage_key}>
                  <div 
                    className="font-medium mb-2 p-2 rounded text-center text-white"
                    style={{ backgroundColor: stage.color }}
                  >
                    {t(`leads.status.${stage.stage_key}`)}
                  </div>
                  
                  <Droppable droppableId={stage.stage_key}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[400px] bg-muted/30 rounded p-2 ${
                          snapshot.isDraggingOver ? 'bg-muted/50' : ''
                        }`}
                      >
                        {leads
                          .filter(lead => lead.status === stage.stage_key)
                          .map((lead, index) => (
                            <LeadCard key={lead.id} lead={lead} index={index} />
                          ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        </CardContent>
      </Card>

      {/* Modal détails du lead */}
      {selectedLead && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedLead(null)}
        >
          <div 
            className="bg-card border p-6 rounded-lg max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4 text-card-foreground">
              {selectedLead.first_name} {selectedLead.last_name}
            </h3>
            <div className="space-y-2 text-card-foreground">
              <p><strong>{t('leads.email')}:</strong> {selectedLead.email}</p>
              <p><strong>{t('leads.phone')}:</strong> {selectedLead.phone || '-'}</p>
              <p><strong>{t('leads.budget')}:</strong> 
                {selectedLead.budget_min && selectedLead.budget_max && (
                  ` €${Number(selectedLead.budget_min).toLocaleString()} - €${Number(selectedLead.budget_max).toLocaleString()}`
                )}
              </p>
              <p><strong>{t('pipeline.urgency')}:</strong> {t(`leads.urgency.${selectedLead.urgency}`)}</p>
              <p><strong>{t('pipeline.source')}:</strong> {t(`leads.source.${selectedLead.source}`)}</p>
              <p><strong>{t('leads.score')}:</strong> 
                <span className="flex items-center gap-1 mt-1">
                  {renderStars(selectedLead.score)}
                </span>
              </p>
              {selectedLead.notes && (
                <p><strong>{t('leads.notes')}:</strong> {selectedLead.notes}</p>
              )}
              <p><strong>{t('pipeline.timeInStage')}:</strong> {getDaysInStage(selectedLead.status_changed_at)} {t('pipeline.days')}</p>
            </div>
            <button 
              className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
              onClick={() => setSelectedLead(null)}
            >
              {t('form.cancel')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}