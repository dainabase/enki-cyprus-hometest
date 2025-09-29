import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Form } from '@/components/ui/form';
import { ArrowLeft, ArrowRight, Check, Save, ChevronLeft, Building } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BuildingFormData } from '@/types/building';
import { BuildingFormSteps } from './BuildingFormSteps';

// Définition des étapes du formulaire - exactement comme le projet
export const buildingFormSteps = [
  { id: 'general', title: 'Informations générales' },
  { id: 'structure', title: 'Structure' },
  { id: 'infrastructure', title: 'Infrastructure' },
  { id: 'security', title: 'Sécurité' },
  { id: 'amenities', title: 'Équipements' },
  { id: 'services', title: 'Services' },
  { id: 'accessibility', title: 'Accessibilité' },
  { id: 'leisure', title: 'Loisirs' },
  { id: 'documents', title: 'Documents' },
  { id: 'advanced', title: 'Avancé' }
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
      construction_status: 'planned',
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
      const formData: BuildingFormData = {
        project_id: building.project_id || '',
        building_name: building.building_name || '',
        building_type: building.building_type as any || 'residential',
        building_code: building.building_code || '',
        display_order: building.display_order || 0,
        construction_status: building.construction_status as any || 'planned',
        total_floors: building.total_floors || 1,
        total_units: building.total_units || 1,
        units_available: building.units_available || 0,
        expected_completion: building.expected_completion || '',
        actual_completion: building.actual_completion || '',
        building_class: building.building_class as any || 'A',
        elevator_count: building.elevator_count || 0,
        has_elevator: building.has_elevator || false,
        has_generator: building.has_generator || false,
        has_solar_panels: building.has_solar_panels || false,
        energy_rating: building.energy_rating || '',
        energy_certificate: building.energy_certificate as any || 'B',
        central_vacuum_system: building.central_vacuum_system || false,
        water_softener_system: building.water_softener_system || false,
        water_purification_system: building.water_purification_system || false,
        smart_building_system: building.smart_building_system || false,
        intercom_system: building.intercom_system || false,
        has_intercom: building.has_intercom || false,
        has_security_system: building.has_security_system || false,
        has_security_24_7: building.has_security_24_7 || false,
        has_cctv: building.has_cctv || false,
        has_concierge: building.has_concierge || false,
        has_security_door: building.has_security_door || false,
        concierge_service: building.concierge_service || false,
        package_room: building.package_room || false,
        bike_storage: building.bike_storage || false,
        pet_washing_station: building.pet_washing_station || false,
        car_wash_area: building.car_wash_area || false,
        has_pool: building.has_pool || false,
        has_gym: building.has_gym || false,
        has_spa: building.has_spa || false,
        has_playground: building.has_playground || false,
        has_garden: building.has_garden || false,
        has_parking: building.has_parking || false,
        parking_type: building.parking_type as any || 'outdoor',
        disabled_parking_spaces: building.disabled_parking_spaces || 0,
        shuttle_service: building.shuttle_service || false,
        restaurant: building.restaurant || false,
        cafe: building.cafe || false,
        mini_market: building.mini_market || false,
        business_center: building.business_center || false,
        kids_club: building.kids_club || false,
        coworking_space: building.coworking_space || false,
        club_house: building.club_house || false,
        wheelchair_accessible: building.wheelchair_accessible || false,
        braille_signage: building.braille_signage || false,
        audio_assistance: building.audio_assistance || false,
        accessible_bathrooms: building.accessible_bathrooms || 0,
        ramp_access: building.ramp_access || false,
        wide_doorways: building.wide_doorways || false,
        accessible_elevator: building.accessible_elevator || false,
        has_tennis_court: building.has_tennis_court || false,
        beach_access: building.beach_access || false,
        marina_access: building.marina_access || false,
        golf_course: building.golf_course || false,
        sports_facilities: building.sports_facilities || false,
        wellness_center: building.wellness_center || false,
        typical_floor_plan_url: building.typical_floor_plan_url || '',
        model_3d_url: building.model_3d_url || '',
        building_brochure_url: building.building_brochure_url || '',
        floor_plans: building.floor_plans || {},
        building_amenities: building.building_amenities || {},
        common_areas: building.common_areas || {},
        security_features: building.security_features || {},
        wellness_facilities: building.wellness_facilities || {},
        infrastructure: building.infrastructure || {},
        outdoor_facilities: building.outdoor_facilities || {}
      };
      form.reset(formData);
    }
  }, [building, isEdit, form]);

  const handleSave = async (data: BuildingFormData) => {
    try {
      if (!data.project_id) {
        toast.error("Veuillez sélectionner un projet");
        return;
      }

      // Nettoyer les données avant l'envoi
      const cleanedData = {
        ...data,
        // Convertir les chaînes vides en null pour les dates
        expected_completion: data.expected_completion && data.expected_completion !== '' ? data.expected_completion : null,
        actual_completion: data.actual_completion && data.actual_completion !== '' ? data.actual_completion : null,
        // Convertir les chaînes vides en null pour les URLs
        typical_floor_plan_url: data.typical_floor_plan_url && data.typical_floor_plan_url !== '' ? data.typical_floor_plan_url : null,
        model_3d_url: data.model_3d_url && data.model_3d_url !== '' ? data.model_3d_url : null,
        building_brochure_url: data.building_brochure_url && data.building_brochure_url !== '' ? data.building_brochure_url : null,
        // S'assurer que les champs string ne sont pas null
        building_code: data.building_code || null,
        energy_rating: data.energy_rating || null,
        // S'assurer que les nombres sont corrects
        total_floors: data.total_floors || 1,
        total_units: data.total_units || 1,
        units_available: data.units_available || 0,
        elevator_count: data.elevator_count || 0,
        disabled_parking_spaces: data.disabled_parking_spaces || 0,
        accessible_bathrooms: data.accessible_bathrooms || 0,
        display_order: data.display_order || 0
      };

      if (isEdit) {
        const { error } = await supabase
          .from('buildings')
          .update(cleanedData)
          .eq('id', id);
        
        if (error) {
          console.error('Error updating building:', error);
          throw error;
        }
        toast.success("Bâtiment mis à jour avec succès");
      } else {
        const { data: userData } = await supabase.auth.getUser();
        const { data: newBuilding, error } = await supabase
          .from('buildings')
          .insert([{
            ...cleanedData,
            created_by: userData?.user?.id
          }])
          .select()
          .single();
        
        if (error) {
          console.error('Error creating building:', error);
          throw error;
        }
        
        console.log('Building created successfully:', newBuilding);
        toast.success("Bâtiment créé avec succès");
      }
      
      // Invalider TOUTES les clés de cache liées aux bâtiments
      await queryClient.invalidateQueries({ queryKey: ['buildings'] });
      await queryClient.invalidateQueries({ queryKey: ['all-buildings'] });
      
      // Forcer un refetch immédiat
      await queryClient.refetchQueries({ queryKey: ['all-buildings'] });
      
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
      {/* Header fixe - exactement comme le projet */}
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
            {isGoldenVisa && (
              <Badge className="bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 border-yellow-300 px-4 py-2">
                ✨ Golden Visa Potentiel
              </Badge>
            )}
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
        {/* Sidebar fixe - exactement comme le projet */}
        <div className="w-80 bg-white border-r-2 border-slate-200 sticky top-[128px] h-[calc(100vh-128px)] overflow-y-auto">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Étapes du bâtiment</h2>
            <nav className="space-y-2">
              {buildingFormSteps.map((step, index) => (
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

        {/* Contenu principal - exactement comme le projet */}
        <div className="flex-1 p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-8">
              <BuildingFormSteps
                form={form}
                currentStep={currentStep.id}
                projects={projects}
              />

              {/* Navigation controls - exactement comme le projet */}
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
                  {currentStepIndex === buildingFormSteps.length - 1 ? (
                    <Button type="submit" className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      {isEdit ? 'Mettre à jour' : 'Créer le bâtiment'}
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
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}