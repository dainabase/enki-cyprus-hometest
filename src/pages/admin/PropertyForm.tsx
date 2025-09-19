import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Check, Save, CheckCircle, ChevronLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PropertyFormSteps } from '@/components/admin/properties/PropertyFormSteps';
import { propertySchema, PropertyFormData, propertyFormSteps } from '@/schemas/property.schema';
import { toast } from 'sonner';

export default function PropertyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);
  
  // Get URL search params for project and building
  const [searchParams] = useSearchParams();
  const projectFromUrl = searchParams.get('project');
  const buildingFromUrl = searchParams.get('building');

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = propertyFormSteps[currentStepIndex];

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      project_id: projectFromUrl || null, // UUID ou null
      building_id: buildingFromUrl || null, // UUID ou null
      property_status: 'available',
      ownership_type: 'freehold',
      bedrooms_count: 1,
      bathrooms_count: 1,
      wc_count: 0,
      vat_rate: 5,
      commission_rate: 5,
      deposit_percentage: 30,
      reservation_fee: 5000,
      payment_plan_available: false,
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

  // Simple autosave state without complex hook to avoid typecheck issues
  const [sessionId] = useState(() => `property_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

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
    enabled: !!id
  });

  // Load property data into form
  useEffect(() => {
    console.log('🔄 useEffect triggered:', { property, isEdit, propertyLoaded: !!property });
    if (property && isEdit) {
      console.log('📝 Loading property data into form:', property);
      
      // Reset form with data from properties_test table
      form.reset({
        project_id: property.project_id || '',
        building_id: property.building_id || null,
        unit_number: property.unit_number || '',
        property_type: property.property_type as any || 'apartment',
        property_status: (property.status as any) || 'available',
        bedrooms_count: property.bedrooms ?? 1,
        bathrooms_count: property.bathrooms ?? 1,
        internal_area: property.surface_area ?? undefined,
        price_excluding_vat: property.price ?? undefined,
        floor_number: property.floor ?? undefined,
        // Set default values for other required fields
        ownership_type: 'freehold',
        wc_count: 0,
        vat_rate: 5,
        commission_rate: 5,
        deposit_percentage: 30,
        reservation_fee: 5000,
        payment_plan_available: false,
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
      });
    }
  }, [property, isEdit, form]);

  // SUPPRIMÉ: Ancienne mutation qui utilisait .insert()
  // Maintenant on utilise uniquement la fonction RPC

  const handleSave = async (data: PropertyFormData) => {
    try {
      console.log('=== SAVING PROPERTY DATA ===');
      console.log('Form data:', data);
      
      // Nettoyer les IDs
      const cleanProjectId = data.project_id || projectFromUrl || null;
      const cleanBuildingId = (() => {
        const buildingFromForm = data.building_id && data.building_id !== 'none' ? data.building_id : null;
        const buildingFromURL = buildingFromUrl && buildingFromUrl !== 'none' ? buildingFromUrl : null;
        return buildingFromForm || buildingFromURL || null;
      })();
      
      // Validation
      if (!cleanProjectId) {
        toast.error("Project ID est requis");
        return;
      }
      
      if (isEdit) {
        // Mode modification - utiliser UPDATE directement
        const { error } = await supabase
          .from('properties_test')
          .update({
            project_id: cleanProjectId,
            building_id: cleanBuildingId,
            unit_number: data.unit_number,
            property_type: data.property_type,
            status: data.property_status,
            bedrooms: data.bedrooms_count,
            bathrooms: data.bathrooms_count,
            surface_area: data.internal_area,
            price: data.price_excluding_vat,
            floor: data.floor_number
          })
          .eq('id', id);
        
        if (error) {
          console.error('Update error:', error);
          toast.error("Erreur lors de la mise à jour: " + error.message);
          return;
        }
        
        toast.success("Propriété mise à jour avec succès!");
      } else {
        // Mode création - utiliser INSERT directement
        const { data: result, error } = await supabase
          .from('properties_test')
          .insert({
            project_id: cleanProjectId,
            building_id: cleanBuildingId,
            unit_number: data.unit_number || 'UNIT-' + Date.now(),
            property_type: data.property_type || 'apartment',
            status: data.property_status || 'available',
            bedrooms: data.bedrooms_count,
            bathrooms: data.bathrooms_count,
            surface_area: data.internal_area,
            price: data.price_excluding_vat,
            floor: data.floor_number
          })
          .select()
          .single();
        
        if (error) {
          console.error('Insert error:', error);
          toast.error("Erreur lors de la création: " + error.message);
          return;
        }
        
        console.log('✅ Property created:', result);
        toast.success("Propriété créée avec succès!");
      }
      
      // Invalider le cache et rediriger proprement
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', id] });
      
      // Redirection correcte
      navigate('/admin/properties');
      
    } catch (error) {
      console.error('Save error:', error);
      toast.error("Erreur: " + (error as any).message);
    }
  };

  const handleSaveDraft = async () => {
    const formData = form.getValues();
    setIsAutoSaving(true);
    
    try {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id || null;

      const draftData: any = {
        form_data: formData,
        session_id: sessionId,
        current_step: currentStep.id,
        step_index: currentStepIndex,
        updated_at: new Date().toISOString()
      };

      if (userId) {
        draftData.user_id = userId;
      }

      if (id) {
        draftData.project_id = id;
      }

      const { error } = await supabase
        .from('project_drafts')
        .upsert(draftData, {
          onConflict: id && userId ? 'user_id,project_id' : 'session_id'
        });

      if (error) {
        toast.error('Erreur lors de la sauvegarde du brouillon');
      } else {
        toast.success('Brouillon sauvegardé avec succès');
      }
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde du brouillon');
    } finally {
      setIsAutoSaving(false);
    }
  };

  const handleNext = async () => {
    const currentStepFields = getCurrentStepFields();
    const isValid = await form.trigger(currentStepFields);
    
    if (isValid && currentStepIndex < propertyFormSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStepIndex(stepIndex);
  };

  const getCurrentStepFields = (): (keyof PropertyFormData)[] => {
    switch (currentStep.id) {
      case 'identification':
        return ['project_id', 'unit_number', 'property_type', 'property_status'];
      case 'configuration':
        return ['bedrooms_count', 'bathrooms_count', 'internal_area'];
      case 'equipment':
        return [];
      case 'outdoor':
        return [];
      case 'financial':
        return ['price_excluding_vat', 'vat_rate'];
      case 'documentation':
        return [];
      default:
        return [];
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  const priceExcludingVat = form.watch('price_excluding_vat') || 0;
  const vatRate = form.watch('vat_rate') || 5;
  const priceIncludingVat = priceExcludingVat + (priceExcludingVat * vatRate / 100);
  const isGoldenVisa = priceIncludingVat >= 300000;


  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header fixe */}
      <div className="h-32 bg-white border-b-2 border-slate-200 sticky top-0 z-10">
        <div className="h-full px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/admin/properties')}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Retour propriétés
            </Button>
            <span className="text-slate-400">|</span>
            <h1 className="text-2xl font-bold text-slate-900">
              {isEdit ? 'Modifier la propriété' : 'Créer une nouvelle propriété'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Golden Visa Badge */}
            {isGoldenVisa && (
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                ✨ Golden Visa Éligible
              </Badge>
            )}
            <a href="/admin" className="text-base text-slate-600 hover:text-slate-900 transition-colors">
              Retour au dashboard
            </a>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar fixe */}
        <div className="w-80 bg-white border-r-2 border-slate-200 sticky top-[128px] h-[calc(100vh-128px)] overflow-y-auto">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Étapes de la propriété</h2>
            <nav className="space-y-2">
              {propertyFormSteps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(index)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    currentStepIndex === index
                      ? 'bg-primary text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      currentStepIndex === index
                        ? 'bg-white text-primary'
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="font-medium">{step.title}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex-1 p-8 bg-slate-50">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-8">
              <PropertyFormSteps
                form={form}
                currentStep={currentStep.id}
              />

              {/* Navigation controls */}
              <div className="flex justify-between items-center pt-8 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStepIndex === 0}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Précédent
                </Button>

                <div className="flex items-center gap-4">
                  {currentStepIndex === propertyFormSteps.length - 1 ? (
                    <>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={handleSaveDraft}
                        disabled={isAutoSaving}
                        className="flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        {isAutoSaving ? 'Sauvegarde...' : 'Sauvegarder le brouillon'}
                      </Button>
                      <Button 
                        type="submit" 
                        className="flex items-center gap-2"
                      >
                        <Check className="h-4 w-4" />
                        {isEdit ? 'Mettre à jour' : 'Créer la propriété'}
                      </Button>
                    </>
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
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}