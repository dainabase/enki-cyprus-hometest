import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Form } from '@/components/ui/form';
import { ArrowLeft, ArrowRight, Check, Save, ChevronLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BuildingFormData } from '@/types/building';
import { BuildingFormSteps } from './BuildingFormSteps';

// Définition des étapes du formulaire
export const buildingFormSteps = [
  { id: 'general', title: 'Informations générales', icon: '🏢' },
  { id: 'structure', title: 'Structure', icon: '🏗️' },
  { id: 'infrastructure', title: 'Infrastructure', icon: '⚡' },
  { id: 'security', title: 'Sécurité', icon: '🔒' },
  { id: 'amenities', title: 'Équipements', icon: '🏊' },
  { id: 'services', title: 'Services', icon: '☕' },
  { id: 'accessibility', title: 'Accessibilité', icon: '♿' },
  { id: 'leisure', title: 'Loisirs', icon: '🎾' },
  { id: 'documents', title: 'Documents', icon: '📄' },
  { id: 'advanced', title: 'Avancé', icon: '⚙️' }
];

export default function BuildingFormWithSidebar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);
  
  // Get URL search params for project
  const [searchParams] = useSearchParams();
  const projectFromUrl = searchParams.get('project');

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = buildingFormSteps[currentStepIndex];
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);

  const form = useForm<BuildingFormData>({
    defaultValues: {
      // Section 1 : Informations de base
      project_id: projectFromUrl || '',
      building_name: '',
      building_code: '',
      display_order: 0,
      building_type: 'residential',
      building_class: 'A',
      
      // Section 2 : Structure
      total_floors: 1,
      total_units: 1,
      units_available: 0,
      construction_status: 'planning',
      expected_completion: '',
      actual_completion: '',
      energy_rating: '',
      energy_certificate: 'B',
      elevator_count: 0,
      has_elevator: false,
      
      // Section 3 : Infrastructure technique
      has_generator: false,
      has_solar_panels: false,
      central_vacuum_system: false,
      water_softener_system: false,
      water_purification_system: false,
      smart_building_system: false,
      intercom_system: false,
      has_intercom: false,
      package_room: false,
      bike_storage: false,
      pet_washing_station: false,
      car_wash_area: false,
      
      // Section 4 : Sécurité
      has_security_system: false,
      has_security_24_7: false,
      has_cctv: false,
      has_concierge: false,
      has_security_door: false,
      concierge_service: false,
      
      // Section 5 : Équipements
      has_pool: false,
      has_gym: false,
      has_spa: false,
      has_playground: false,
      has_garden: false,
      has_parking: false,
      parking_type: 'outdoor',
      disabled_parking_spaces: 0,
      shuttle_service: false,
      
      // Section 6 : Services
      restaurant: false,
      cafe: false,
      mini_market: false,
      business_center: false,
      kids_club: false,
      coworking_space: false,
      club_house: false,
      
      // Section 7 : Accessibilité
      wheelchair_accessible: false,
      braille_signage: false,
      audio_assistance: false,
      accessible_bathrooms: 0,
      ramp_access: false,
      wide_doorways: false,
      accessible_elevator: false,
      
      // Section 8 : Loisirs
      has_tennis_court: false,
      beach_access: false,
      marina_access: false,
      golf_course: false,
      sports_facilities: false,
      wellness_center: false,
      
      // Section 9 : Documents
      typical_floor_plan_url: '',
      model_3d_url: '',
      building_brochure_url: '',
      
      // Section 10 : JSONB
      building_amenities: {},
      common_areas: {},
      security_features: {},
      wellness_facilities: {},
      infrastructure: {},
      outdoor_facilities: {},
      floor_plans: {}
    }
  });

  // Fetch projects for dropdown
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('id, title, cyprus_zone')
      .order('title');
    
    if (data) {
      setProjects(data);
    }
  };

  // Fetch building data for editing
  const { data: building, isLoading } = useQuery({
    queryKey: ['building', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('buildings')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  // Load building data into form
  useEffect(() => {
    if (building && isEdit) {
      form.reset(building);
    }
  }, [building, isEdit, form]);

  const handleSave = async (data: BuildingFormData) => {
    try {
      if (!data.project_id) {
        toast.error("Veuillez sélectionner un projet");
        return;
      }

      if (isEdit) {
        const { error } = await supabase
          .from('buildings')
          .update(data)
          .eq('id', id);
        
        if (error) throw error;
        toast.success("Bâtiment mis à jour avec succès");
      } else {
        const { data: userData } = await supabase.auth.getUser();
        const { error } = await supabase
          .from('buildings')
          .insert([{
            ...data,
            created_by: userData?.user?.id
          }]);
        
        if (error) throw error;
        toast.success("Bâtiment créé avec succès");
      }
      
      queryClient.invalidateQueries({ queryKey: ['buildings'] });
      navigate('/admin/buildings');
    } catch (error) {
      console.error('Error saving building:', error);
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const handleNext = async () => {
    const currentStepFields = getCurrentStepFields();
    const isValid = await form.trigger(currentStepFields as any);
    
    if (isValid && currentStepIndex < buildingFormSteps.length - 1) {
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

  const getCurrentStepFields = (): string[] => {
    switch (currentStep.id) {
      case 'general':
        return ['project_id', 'building_name', 'building_code', 'building_type', 'building_class'];
      case 'structure':
        return ['total_floors', 'total_units', 'construction_status'];
      default:
        return [];
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  // Calcul pour Golden Visa (basé sur les unités et prix moyen estimé)
  const estimatedValue = (form.watch('total_units') || 0) * 300000;
  const isGoldenVisa = estimatedValue >= 300000;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header fixe avec design moderne */}
      <div className="h-32 bg-white border-b-2 border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="h-full px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/admin/buildings')}
              className="flex items-center gap-2 hover:bg-slate-100 rounded-lg px-3 py-2 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="font-medium">Retour bâtiments</span>
            </Button>
            <span className="text-slate-300">|</span>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {isEdit ? 'Modifier le bâtiment' : 'Nouveau bâtiment'}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Complétez les informations du bâtiment en suivant les étapes
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Badge Golden Visa si applicable */}
            {isGoldenVisa && (
              <Badge className="bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 border-yellow-300 px-4 py-2">
                ✨ Golden Visa Potentiel
              </Badge>
            )}
            {/* Badge statut */}
            <Badge variant="outline" className="px-4 py-2">
              {currentStepIndex + 1}/{buildingFormSteps.length} étapes
            </Badge>
            <Button
              variant="outline"
              onClick={() => navigate('/admin')}
              className="text-slate-600 hover:text-slate-900"
            >
              Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar fixe avec design moderne */}
        <div className="w-80 bg-white border-r-2 border-slate-200 sticky top-32 h-[calc(100vh-128px)] overflow-y-auto">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">Configuration du bâtiment</h2>
              <p className="text-sm text-slate-500 mt-1">Complétez toutes les sections</p>
            </div>
            
            <nav className="space-y-2">
              {buildingFormSteps.map((step, index) => {
                const isActive = currentStepIndex === index;
                const isCompleted = index < currentStepIndex;
                
                return (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(index)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                        : isCompleted
                        ? 'bg-green-50 text-green-700 hover:bg-green-100'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center justify-center text-lg ${
                        isActive ? 'animate-pulse' : ''
                      }`}>
                        {step.icon}
                      </span>
                      <div className="flex-1">
                        <div className="font-medium">{step.title}</div>
                        <div className={`text-xs ${
                          isActive ? 'text-blue-100' : 'text-slate-400'
                        }`}>
                          Étape {index + 1}
                        </div>
                      </div>
                      {isCompleted && (
                        <Check className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* Progress bar */}
            <div className="mt-8 px-4">
              <div className="text-sm text-slate-600 mb-2">Progression globale</div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStepIndex + 1) / buildingFormSteps.length) * 100}%` }}
                />
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {Math.round(((currentStepIndex + 1) / buildingFormSteps.length) * 100)}% complété
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal avec padding et background */}
        <div className="flex-1 bg-gradient-to-br from-slate-50 to-blue-50/20">
          <div className="p-8 max-w-5xl">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSave)} className="space-y-8">
                {/* Contenu de l'étape actuelle */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                  <BuildingFormSteps
                    form={form}
                    currentStep={currentStep.id}
                    projects={projects}
                  />
                </div>

                {/* Navigation controls avec style moderne */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex justify-between items-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentStepIndex === 0}
                      className="flex items-center gap-2 hover:bg-slate-50"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Précédent
                    </Button>

                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      {buildingFormSteps.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentStepIndex
                              ? 'w-8 bg-blue-500'
                              : index < currentStepIndex
                              ? 'bg-green-500'
                              : 'bg-slate-300'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      {currentStepIndex === buildingFormSteps.length - 1 ? (
                        <>
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => toast.info('Brouillon sauvegardé')}
                            className="flex items-center gap-2"
                          >
                            <Save className="h-4 w-4" />
                            Brouillon
                          </Button>
                          <Button 
                            type="submit" 
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30"
                          >
                            <Check className="h-4 w-4" />
                            {isEdit ? 'Mettre à jour' : 'Créer le bâtiment'}
                          </Button>
                        </>
                      ) : (
                        <Button
                          type="button"
                          onClick={handleNext}
                          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30"
                        >
                          Suivant
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}