import React, { useState, useEffect } from 'react';
import { useSupabaseQuery, getPaginationRange } from '@/hooks/useSupabaseQuery';
import { Pagination } from '@/components/Pagination';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminLeads() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [developers, setDevelopers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 25,
  });
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    budget_min: '',
    budget_max: '',
    urgency: 'exploring',
    property_type: 'apartment',
    source: 'website',
    golden_visa_interest: false,
    notes: ''
  });

  // Fetch leads with pagination
  const { data: leadsResponse, refetch } = useSupabaseQuery(
    ['admin-leads', pagination],
    async () => {
      const { from, to } = getPaginationRange(pagination);
      
      const { data, error, count } = await supabase
        .from('leads')
        .select('id, first_name, last_name, email, phone, status, score, budget_min, budget_max, urgency, created_at, golden_visa_interest, assigned_to, notes', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (error) throw error;
      return { data, count };
    }
  );

  const leads = leadsResponse?.data || [];
  const totalCount = leadsResponse?.count || 0;

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const fetchDevelopers = async () => {
    const { data, error } = await supabase
      .from('developers')
      .select('id, name')
      .eq('status', 'active')
      .order('name');
    
    if (error) {
      toast({
        title: t('messages.error'),
        description: error.message,
        variant: 'destructive'
      });
    } else if (data) {
      setDevelopers(data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert string values to proper types
    const leadData = {
      ...formData,
      budget_min: formData.budget_min ? parseFloat(formData.budget_min) : null,
      budget_max: formData.budget_max ? parseFloat(formData.budget_max) : null,
    };
    
    const { error } = await supabase
      .from('leads')
      .insert([leadData]);
    
    if (error) {
      toast({
        title: t('messages.error'),
        description: error.message,
        variant: 'destructive'
      });
    } else {
      setIsOpen(false);
      refetch();
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        budget_min: '',
        budget_max: '',
        urgency: 'exploring',
        property_type: 'apartment',
        source: 'website',
        golden_visa_interest: false,
        notes: ''
      });
      toast({
        title: t('messages.success'),
        description: t('leads.leadCreated')
      });
    }
  };

  const updateStatus = async (leadId, newStatus) => {
    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', leadId);
    
    if (!error) {
      // Log activity
      await supabase
        .from('lead_activities')
        .insert({
          lead_id: leadId,
          activity_type: 'status_change',
          description: `Status changed to ${newStatus}`
        });
      
      refetch();
      toast({
        title: t('messages.success'),
        description: t('leads.statusUpdated')
      });
    }
  };

  const assignLead = async (leadId, developerId) => {
    const { error } = await supabase
      .from('leads')
      .update({ assigned_to: developerId })
      .eq('id', leadId);
    
    if (!error) {
      refetch();
      toast({
        title: t('messages.success'),
        description: t('leads.leadAssigned')
      });
    }
  };

  const renderStars = (score) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < score ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}
      />
    ));
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-500',
      contacted: 'bg-yellow-500',
      qualified: 'bg-green-500',
      opportunity: 'bg-purple-500',
      converted: 'bg-emerald-500',
      lost: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('leads.title')}</CardTitle>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>{t('leads.addLead')}</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{t('leads.newLead')}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder={t('leads.firstName')}
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                    required
                  />
                  <Input
                    placeholder={t('leads.lastName')}
                    value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    required
                  />
                  <Input
                    type="email"
                    placeholder={t('leads.email')}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                  <Input
                    placeholder={t('leads.phone')}
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                  <Input
                    type="number"
                    placeholder={t('leads.budgetMin')}
                    value={formData.budget_min}
                    onChange={(e) => setFormData({...formData, budget_min: e.target.value})}
                  />
                  <Input
                    type="number"
                    placeholder={t('leads.budgetMax')}
                    value={formData.budget_max}
                    onChange={(e) => setFormData({...formData, budget_max: e.target.value})}
                  />
                  <Select value={formData.urgency} onValueChange={(v) => setFormData({...formData, urgency: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">{t('leads.urgency.immediate')}</SelectItem>
                      <SelectItem value="3_months">{t('leads.urgency.3months')}</SelectItem>
                      <SelectItem value="6_months">{t('leads.urgency.6months')}</SelectItem>
                      <SelectItem value="1_year">{t('leads.urgency.1year')}</SelectItem>
                      <SelectItem value="exploring">{t('leads.urgency.exploring')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={formData.source} onValueChange={(v) => setFormData({...formData, source: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">{t('leads.source.website')}</SelectItem>
                      <SelectItem value="referral">{t('leads.source.referral')}</SelectItem>
                      <SelectItem value="agent">{t('leads.source.agent')}</SelectItem>
                      <SelectItem value="social_media">{t('leads.source.social')}</SelectItem>
                      <SelectItem value="other">{t('leads.source.other')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="golden_visa"
                    checked={formData.golden_visa_interest}
                    onChange={(e) => setFormData({...formData, golden_visa_interest: e.target.checked})}
                  />
                  <label htmlFor="golden_visa">{t('leads.goldenVisaInterest')}</label>
                </div>
                
                <Textarea
                  placeholder={t('leads.notes')}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                />
                
                <Button type="submit" className="w-full">{t('form.save')}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">{t('leads.name')}</th>
                  <th className="text-left p-2">{t('leads.contact')}</th>
                  <th className="text-left p-2">{t('leads.budget')}</th>
                  <th className="text-left p-2">{t('leads.score')}</th>
                  <th className="text-left p-2">{t('status')}</th>
                  <th className="text-left p-2">{t('leads.assigned')}</th>
                  <th className="text-left p-2">{t('leads.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => (
                  <tr key={lead.id} className="border-b">
                    <td className="p-2">
                      {lead.first_name} {lead.last_name}
                      {lead.golden_visa_interest && (
                        <span className="ml-2 text-xs bg-yellow-500 text-black px-1 rounded">GV</span>
                      )}
                    </td>
                    <td className="p-2">
                      <div className="text-sm">{lead.email}</div>
                      <div className="text-xs text-gray-500">{lead.phone}</div>
                    </td>
                    <td className="p-2">
                      {lead.budget_min && lead.budget_max && 
                        `€${Number(lead.budget_min).toLocaleString()} - €${Number(lead.budget_max).toLocaleString()}`
                      }
                    </td>
                    <td className="p-2">
                      <div className="flex">{renderStars(lead.score)}</div>
                    </td>
                    <td className="p-2">
                      <Select value={lead.status} onValueChange={(v) => updateStatus(lead.id, v)}>
                        <SelectTrigger className="w-32">
                          <div className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(lead.status)}`}>
                            {t(`leads.status.${lead.status}`)}
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">{t('leads.status.new')}</SelectItem>
                          <SelectItem value="contacted">{t('leads.status.contacted')}</SelectItem>
                          <SelectItem value="qualified">{t('leads.status.qualified')}</SelectItem>
                          <SelectItem value="opportunity">{t('leads.status.opportunity')}</SelectItem>
                          <SelectItem value="converted">{t('leads.status.converted')}</SelectItem>
                          <SelectItem value="lost">{t('leads.status.lost')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-2">
                      <Select value={lead.assigned_to || ''} onValueChange={(v) => assignLead(lead.id, v)}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder={t('leads.unassigned')} />
                        </SelectTrigger>
                        <SelectContent>
                          {developers.map(dev => (
                            <SelectItem key={dev.id} value={dev.id}>{dev.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-2">
                      {lead.notes && (
                        <span className="text-xs text-gray-500" title={lead.notes}>
                          {lead.notes.length > 20 ? lead.notes.substring(0, 20) + '...' : lead.notes}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {leads.length > 0 && (
            <Pagination
              pageIndex={pagination.pageIndex}
              pageSize={pagination.pageSize}
              totalCount={totalCount}
              onPageChange={(pageIndex) => setPagination(prev => ({ ...prev, pageIndex }))}
              onPageSizeChange={(pageSize) => setPagination({ pageIndex: 0, pageSize })}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}