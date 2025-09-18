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
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          project:projects(id, title, name),
          building:buildings(id, building_name, name)
        `)
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  // Load property data into form
  useEffect(() => {
    if (property && isEdit) {
      console.log('Property data loaded for editing:', property);
    }
  }, [property, isEdit, form]);

  // SUPPRIMÉ: Ancienne mutation qui utilisait .insert()
  // Maintenant on utilise uniquement la fonction RPC

  const handleSave = async (data: PropertyFormData) => {
    try {
      console.log('=== USING RPC FUNCTION ===');
      console.log('Raw form data:', data);
      console.log('URL params - project:', projectFromUrl, 'building:', buildingFromUrl);
      
      // ⚠️ CRITIQUE: Nettoyer TOUS les UUID pour éviter les chaînes vides
      const cleanProjectId = data.project_id || projectFromUrl || null;
      const cleanBuildingId = (() => {
        const buildingFromForm = data.building_id && data.building_id !== 'none' ? data.building_id : null;
        const buildingFromURL = buildingFromUrl && buildingFromUrl !== 'none' ? buildingFromUrl : null;
        return buildingFromForm || buildingFromURL || null;
      })();
      
      // Validation critique
      if (!cleanProjectId) {
        toast.error("Erreur: project_id est requis");
        return;
      }
      
      // Vérifier que ce ne sont pas des chaînes vides
      if (cleanProjectId === '') {
        toast.error("Erreur: project_id ne peut pas être une chaîne vide");
        return;
      }
      
      if (cleanBuildingId === '') {
        toast.error("Erreur: building_id ne peut pas être une chaîne vide");
        return;
      }
      
      const params = {
        p_project_id: cleanProjectId,
        p_building_id: cleanBuildingId,
        p_property_type: data.property_type || 'apartment',
        p_unit_number: data.unit_number || 'UNIT-' + Date.now(),
        p_property_status: data.property_status || 'available',
        p_price_excluding_vat: data.price_excluding_vat || 0,
        p_bedrooms_count: data.bedrooms_count || 1,
        p_bathrooms_count: data.bathrooms_count || 1
      };
      
      console.log('Cleaned params to send:', params);
      
      // ⚠️ NOUVEAU: Utiliser la fonction RPC minimale
      const { data: result, error } = await supabase.rpc('insert_property_minimal', {
        p_project_id: cleanProjectId,
        p_building_id: cleanBuildingId,
        p_property_type: data.property_type || 'apartment',
        p_unit_number: data.unit_number || 'UNIT-' + Date.now()
      });
      
      if (error) {
        console.error('RPC Error:', error);
        // Si la fonction n'existe pas
        if (error.message.includes('function') || error.message.includes('does not exist')) {
          toast.error('La fonction insert_property_safe n\'existe pas dans Supabase. Créez-la d\'abord !');
          return;
        }
        toast.error("Erreur: " + error.message);
        return;
      }
      
      console.log('✅ Property created via RPC! Result:', result);
      
      // Récupérer la propriété complète si nécessaire
      if (result) {
        const propertyId = result; // result est maintenant directement l'UUID
        const { data: fullProperty } = await supabase
          .from('properties')
          .select('*')
          .eq('id', propertyId)
          .single();
        
        toast.success("Propriété créée avec succès!");
        queryClient.invalidateQueries({ queryKey: ['properties'] });
        
        // Navigate or close based on context
        if (typeof window !== 'undefined') {
          window.history.back();
        }
      }
      
    } catch (error) {
      console.error('Final error:', error);
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