import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PropertyFormSteps } from '@/components/admin/properties/PropertyFormSteps';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Save, CheckCircle, ChevronLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const PropertyForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const queryClient = useQueryClient();
  
  const [currentStep, setCurrentStep] = useState('identification');
  const [sessionId] = useState(() => `property_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  
  const steps = [
    { id: 'identification', label: 'Identification', icon: '🏠' },
    { id: 'configuration', label: 'Configuration', icon: '🔧' },
    { id: 'equipment', label: 'Équipements', icon: '⚡' },
    { id: 'outdoor', label: 'Extérieur', icon: '🌳' },
    { id: 'financial', label: 'Financier', icon: '💰' },
    { id: 'documentation', label: 'Documentation', icon: '📄' }
  ];

  const form = useForm<any>({
    mode: 'onSubmit',
    defaultValues: {
      project_id: '',
      building_id: '',
      unit_number: '',
      floor_number: 1,
      surface_area: 0,
      bedrooms: 1,
      bathrooms: 1,
      price: 0,
      status: 'available',
      property_type: 'apartment',
      furnished: false,
      balcony: false,
      terrace: false,
      parking: false,
      storage: false,
      air_conditioning: false,
      heating: false,
      sea_view: false,
      mountain_view: false,
      city_view: false,
      garden_view: false,
      pool_view: false,
      elevator: false,
      fireplace: false,
      garden: false,
      swimming_pool: false,
      gym: false,
      spa: false,
      concierge: false,
      security: false,
      gated_community: false,
      golf_course: false,
      tennis_court: false,
      marina: false,
      shopping_center: false,
      restaurants: false,
      schools: false,
      hospitals: false,
      public_transport: false,
      highway_access: false,
      airport_proximity: false,
      finance_available: false,
      title_deed_status: 'pending',
      has_office: false,
      has_maid_room: false,
      has_dressing_room: false,
      has_playroom: false,
      has_wine_cellar: false,
      has_pantry: false,
      has_laundry_room: false,
      has_private_garden: false,
      has_private_pool: false,
      balcony_count: 0,
      terrace_count: 0,
      parking_spaces: 0,
      storage_spaces: 0,
      appliances_list: [],
      smart_home_features: [],
      security_features: [],
      view_type: []
    },
  });

  // Fetch property data for editing
  const { data: property, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      if (!id) return null;
      console.log('🔍 Fetching property with ID:', id);
      const { data, error } = await supabase
        .from('properties_test')
        .select('*')
        .eq('id', id)
        .single();
      
      console.log('🔍 Property query result:', { data, error });
      if (error) {
        console.error('❌ Error fetching property:', error);
        throw error;
      }
      return data;
    },
    enabled: Boolean(id)
  });

  // Autosave for drafts
  const saveDraftMutation = useMutation({
    mutationFn: async (formData: any) => {
      setIsAutoSaving(true);
      const { error } = await supabase
        .from('property_drafts')
        .upsert({
          session_id: sessionId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          property_id: id || null,
          form_data: formData,
          current_step: currentStep,
          auto_save_enabled: true,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'session_id'
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      setIsAutoSaving(false);
    },
    onError: (error) => {
      console.error('❌ Autosave error:', error);
      setIsAutoSaving(false);
    }
  });

  // Load draft on component mount
  useEffect(() => {
    const loadDraft = async () => {
      if (!isEdit && sessionId) {
        try {
          const { data: drafts } = await supabase
            .from('property_drafts')
            .select('form_data, current_step')
            .eq('session_id', sessionId)
            .order('updated_at', { ascending: false })
            .limit(1);
          
          if (drafts && drafts[0]) {
            form.reset(drafts[0].form_data);
            setCurrentStep(drafts[0].current_step || 'identification');
            toast.info('Brouillon restauré');
          }
        } catch (error) {
          console.error('Erreur lors du chargement du brouillon:', error);
        }
      }
    };
    
    loadDraft();
  }, [sessionId, isEdit, form]);

  // Autosave when form data changes
  useEffect(() => {
    if (!isEdit) {
      const subscription = form.watch((data) => {
        const timer = setTimeout(() => {
          if (Object.values(data).some(value => value !== '' && value !== null && value !== false && value !== 0)) {
            saveDraftMutation.mutate(data);
          }
        }, 2000);
        
        return () => clearTimeout(timer);
      });
      
      return subscription.unsubscribe;
    }
  }, [form.watch, isEdit, saveDraftMutation]);

  // Form data loading effect
  useEffect(() => {
    console.log('🔄 useEffect triggered:', { 
      property: { _type: typeof property, value: property === undefined ? 'undefined' : 'defined' }, 
      isEdit,
      propertyLoaded: Boolean(property) 
    });
    
    if (property && isEdit) {
      console.log('📝 Loading property data into form:', property);
      
      // Map database fields to form fields, using defaults for missing properties
      const mappedData = {
        project_id: property.project_id || '',
        building_id: property.building_id || '',
        unit_number: property.unit_number || '',
        floor_number: property.floor || 1, // DB field: floor -> form field: floor_number
        surface_area: property.surface_area || 0,
        bedrooms: property.bedrooms || 1,
        bathrooms: property.bathrooms || 1,
        price: property.price || 0,
        status: property.status || 'available',
        property_type: property.property_type || 'apartment',
        // Set defaults for form fields that don't exist in the simplified DB
        furnished: false,
        balcony: false,
        terrace: false,
        parking: false,
        storage: false,
        air_conditioning: false,
        heating: false,
        sea_view: false,
        mountain_view: false,
        city_view: false,
        garden_view: false,
        pool_view: false,
        elevator: false,
        fireplace: false,
        garden: false,
        swimming_pool: false,
        gym: false,
        spa: false,
        concierge: false,
        security: false,
        gated_community: false,
        golf_course: false,
        tennis_court: false,
        marina: false,
        shopping_center: false,
        restaurants: false,
        schools: false,
        hospitals: false,
        public_transport: false,
        highway_access: false,
        airport_proximity: false,
        finance_available: false,
        title_deed_status: 'pending',
        has_office: false,
        has_maid_room: false,
        has_dressing_room: false,
        has_playroom: false,
        has_wine_cellar: false,
        has_pantry: false,
        has_laundry_room: false,
        has_private_garden: false,
        has_private_pool: false,
        balcony_count: 0,
        terrace_count: 0,
        parking_spaces: 0,
        storage_spaces: 0,
        appliances_list: [],
        smart_home_features: [],
        security_features: [],
        view_type: []
      };
      
      form.reset(mappedData);
    }
  }, [property, isEdit, form]);

  const handleSave = async (data: any) => {
    try {
      console.log('💾 Saving property data:', data);
      
      // Validate project_id and building_id
      if (!data.project_id) {
        toast.error('Veuillez sélectionner un projet');
        return;
      }
      
      if (!data.building_id) {
        toast.error('Veuillez sélectionner un bâtiment');
        return;
      }

      // Map form fields to database fields (only save fields that exist in properties_test)
      const cleanedData = {
        project_id: data.project_id,
        building_id: data.building_id,
        property_type: data.property_type,
        unit_number: data.unit_number,
        floor: data.floor_number, // form field: floor_number -> DB field: floor
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        surface_area: data.surface_area,
        price: data.price,
        status: data.status
      };

      if (isEdit && id) {
        // Update existing property
        const { error } = await supabase
          .from('properties_test')
          .update(cleanedData)
          .eq('id', id);

        if (error) {
          console.error('❌ Error updating property:', error);
          toast.error('Erreur lors de la modification de la propriété');
          return;
        }

        toast.success('Propriété modifiée avec succès');
      } else {
        // Create new property using RPC function
        const { data: result, error } = await supabase.rpc('insert_property_test', {
          p_project_id: data.project_id,
          p_building_id: data.building_id,
          p_property_type: data.property_type,
          p_unit_number: data.unit_number
        });

        if (error) {
          console.error('❌ Error creating property:', error);
          toast.error('Erreur lors de la création de la propriété');
          return;
        }

        // Update the newly created property with all data
        const { error: updateError } = await supabase
          .from('properties_test')
          .update(cleanedData)
          .eq('id', result);

        if (updateError) {
          console.error('❌ Error updating created property:', updateError);
          toast.error('Erreur lors de la finalisation de la propriété');
          return;
        }

        toast.success('Propriété créée avec succès');

        // Clear draft
        if (sessionId) {
          await supabase
            .from('property_drafts')
            .delete()
            .eq('session_id', sessionId);
        }
      }

      // Invalidate queries and navigate back
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', id] });
      navigate('/admin/units');
    } catch (error) {
      console.error('❌ Save error:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleSaveDraft = async () => {
    try {
      const formData = form.getValues();
      const { error } = await supabase
        .from('property_drafts')
        .upsert({
          session_id: sessionId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          property_id: id || null,
          form_data: formData,
          current_step: currentStep,
          auto_save_enabled: true,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'session_id'
        });

      if (error) {
        console.error('❌ Draft save error:', error);
        toast.error('Erreur lors de la sauvegarde du brouillon');
        return;
      }

      toast.success('Brouillon sauvegardé');
    } catch (error) {
      console.error('❌ Draft save error:', error);
      toast.error('Erreur lors de la sauvegarde du brouillon');
    }
  };

  const handleNext = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const handleStepClick = (stepId: string) => {
    setCurrentStep(stepId);
  };

  const getCurrentStepFields = () => {
    switch (currentStep) {
      case 'identification':
        return ['project_id', 'building_id', 'unit_number', 'floor_number', 'property_type'];
      case 'configuration':
        return ['surface_area', 'bedrooms', 'bathrooms', 'furnished'];
      case 'equipment':
        return ['air_conditioning', 'heating', 'elevator', 'fireplace'];
      case 'outdoor':
        return ['balcony', 'terrace', 'garden', 'parking'];
      case 'financial':
        return ['price', 'status', 'finance_available'];
      case 'documentation':
        return ['title_deed_status'];
      default:
        return [];
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/admin/units')}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Retour Propriétés
              </Button>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  {isEdit ? 'Modifier la propriété' : 'Nouvelle propriété'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {isEdit ? 'Modifier les informations de la propriété' : 'Créer une nouvelle propriété'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {form.watch('price') >= 300000 && (
                <Badge variant="default" className="bg-amber-100 text-amber-800 border-amber-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Golden Visa Eligible
                </Badge>
              )}
              {isAutoSaving && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-muted-foreground"></div>
                  Sauvegarde automatique...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Étapes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {steps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(step.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-3 ${
                      currentStep === step.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <span className="text-base">{step.icon}</span>
                    <div>
                      <div className="font-medium">{step.label}</div>
                      <div className="text-xs opacity-60">Étape {index + 1}</div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-3">
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-8">
              <PropertyFormSteps form={form} currentStep={currentStep} />
              
              {/* Navigation Buttons */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={steps.findIndex(step => step.id === currentStep) === 0}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Précédent
                    </Button>

                    <div className="flex items-center gap-3">
                      {!isEdit && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleSaveDraft}
                          className="flex items-center gap-2"
                        >
                          <Save className="h-4 w-4" />
                          Sauvegarder le brouillon
                        </Button>
                      )}

                      {steps.findIndex(step => step.id === currentStep) === steps.length - 1 ? (
                        <Button type="submit" className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          {isEdit ? 'Modifier' : 'Créer'} la propriété
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          onClick={handleNext}
                          className="flex items-center gap-2"
                        >
                          Suivant
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyForm;