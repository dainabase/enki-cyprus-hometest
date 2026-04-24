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
import { BuildingFormData, Building as BuildingType } from '@/types/building';
import { BuildingFormSteps } from './BuildingFormSteps';
import { logger } from '@/lib/logger';

// 🎯 DÉFINITION DES ÉTAPES OPTIMISÉES (8 étapes au lieu de 12)
export const buildingFormSteps = [
  { id: 'general', title: 'Informations générales' },
  { id: 'structure', title: 'Structure' },
  { id: 'dimensions', title: 'Dimensions & Orientation' },
  { id: 'commercialization', title: 'Commercialisation' },
  { id: 'technical', title: 'Détails techniques' },
  { id: 'infrastructure-security', title: 'Infrastructure & Sécurité' }, // ✅ FUSIONNÉ
  { id: 'amenities-services', title: 'Équipements & Services' }, // ✅ FUSIONNÉ
  { id: 'accessibility', title: 'Accessibilité' },
  { id: 'documents', title: 'Documents' }
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
      energy_efficiency_class: null,
      energy_certificate: 'B',
      elevator_count: 0,
      has_elevator: false,
      
      // Section 3 : Dimensions & Orientation
      surface_totale_batiment: 0,
      hauteur_batiment: 0,
      position_dans_projet: '',
      orientation_principale: '',
      vues_principales: [],
      
      // Section 4 : Commercialisation
      prix_moyen_m2: 0,
      fourchette_prix_min: 0,
      fourchette_prix_max: 0,
      taux_occupation: 0,
      date_mise_en_vente: '',
      nombre_logements_type: {},
      configuration_etages: {},
      
      // Section 5 : Détails techniques
      type_chauffage: '',
      type_climatisation: '',
      annee_construction: undefined,
      annee_renovation: undefined,
      norme_construction: '',
      nombre_caves: 0,
      surface_caves: 0,
      nombre_lots: 0,
      
      // Section 6 : Infrastructure & Sécurité (FUSIONNÉ)
      has_generator: false,
      has_solar_panels: false,
      central_vacuum_system: false,
      water_softener_system: false,
      water_purification_system: false,
      smart_building_system: false,
      has_intercom: false, // ✅ GARDÉ (supprimé intercom_system)
      package_room: false,
      local_velos: false, // ✅ GARDÉ (supprimé bike_storage)
      local_poussettes: false,
      pet_washing_station: false,
      car_wash_area: false,
      has_security_system: false,
      has_security_24_7: false,
      has_cctv: false,
      has_security_door: false,
      concierge_service: false, // ✅ GARDÉ (supprimé has_concierge)
      
      // Section 7 : Équipements & Services (FUSIONNÉ: Parking + Amenities + Services + Leisure)
      // Parking
      has_parking: false,
      parking_type: 'outdoor',
      nombre_places_parking: 0,
      parking_visiteurs: 0,
      disabled_parking_spaces: 0,
      nombre_box_fermes: 0,
      // Équipements
      has_pool: false,
      has_gym: false,
      has_spa: false,
      has_playground: false,
      has_garden: false,
      shuttle_service: false,
      // Services
      restaurant: false,
      cafe: false,
      mini_market: false,
      business_center: false,
      kids_club: false,
      coworking_space: false,
      club_house: false,
      // Loisirs
      has_tennis_court: false,
      beach_access: false,
      marina_access: false,
      golf_course: false,
      sports_facilities: false,
      wellness_center: false,
      
      // Section 8 : Accessibilité
      wheelchair_accessible: false,
      braille_signage: false,
      audio_assistance: false,
      accessible_bathrooms: 0,
      ramp_access: false,
      wide_doorways: false,
      accessible_elevator: false,
      
      // Section 9 : Documents
      typical_floor_plan_url: '',
      model_3d_url: '',
      building_brochure_url: '',
      
      // JSONB
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
      return data as BuildingType;
    },
    enabled: !!id
  });

  // Load building data into form
  useEffect(() => {
    if (building && isEdit) {
      const formData: BuildingFormData = {
        // Champs existants
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
        
        // Nouveaux champs critiques
        surface_totale_batiment: building.surface_totale_batiment || 0,
        hauteur_batiment: building.hauteur_batiment || 0,
        position_dans_projet: building.position_dans_projet || '',
        orientation_principale: building.orientation_principale || '',
        vues_principales: building.vues_principales || [],
        nombre_places_parking: building.nombre_places_parking || 0,
        parking_visiteurs: building.parking_visiteurs || 0,
        prix_moyen_m2: building.prix_moyen_m2 || 0,
        fourchette_prix_min: building.fourchette_prix_min || 0,
        fourchette_prix_max: building.fourchette_prix_max || 0,
        taux_occupation: building.taux_occupation || 0,
        date_mise_en_vente: building.date_mise_en_vente || '',
        nombre_logements_type: building.nombre_logements_type || {},
        configuration_etages: building.configuration_etages || {},
        type_chauffage: building.type_chauffage || '',
        type_climatisation: building.type_climatisation || '',
        annee_construction: building.annee_construction || undefined,
        annee_renovation: building.annee_renovation || undefined,
        norme_construction: building.norme_construction || '',
        nombre_caves: building.nombre_caves || 0,
        surface_caves: building.surface_caves || 0,
        local_velos: building.local_velos || false,
        local_poussettes: building.local_poussettes || false,
        nombre_box_fermes: building.nombre_box_fermes || 0,
        nombre_lots: building.nombre_lots || 0,
        
        // Reste des champs existants
        has_generator: building.has_generator || false,
        has_solar_panels: building.has_solar_panels || false,
        energy_efficiency_class: building.energy_efficiency_class || null,
        energy_certificate: building.energy_certificate as any || 'B',
        central_vacuum_system: building.central_vacuum_system || false,
        water_softener_system: building.water_softener_system || false,
        water_purification_system: building.water_purification_system || false,
        smart_building_system: building.smart_building_system || false,
        intercom_system: building.intercom_system || false,
        has_intercom: building.has_intercom || false,
        bike_storage: building.bike_storage || false,
        has_security_system: building.has_security_system || false,
        has_security_24_7: building.has_security_24_7 || false,
        has_cctv: building.has_cctv || false,
        has_concierge: building.has_concierge || false,
        has_security_door: building.has_security_door || false,
        concierge_service: building.concierge_service || false,
        package_room: building.package_room || false,
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
      logger.info('Saving data:', data);
      
      if (!data.project_id) {
        toast.error("Veuillez sélectionner un projet");
        return;
      }

      // Nettoyer et formater les données avant l'envoi
      const cleanedData: any = {
        // Champs requis
        project_id: data.project_id,
        total_floors: parseInt(String(data.total_floors)) || 1,
        
        // Champs texte
        building_name: data.building_name || null,
        building_code: data.building_code || null,
        building_type: data.building_type || 'residential',
        building_class: data.building_class || null,
        construction_status: data.construction_status || 'planned',
        energy_efficiency_class: data.energy_efficiency_class || null,
        energy_certificate: data.energy_certificate || null,
        parking_type: data.parking_type || null,
        position_dans_projet: data.position_dans_projet || null,
        orientation_principale: data.orientation_principale || null,
        type_chauffage: data.type_chauffage || null,
        type_climatisation: data.type_climatisation || null,
        norme_construction: data.norme_construction || null,
        
        // Champs entiers
        total_units: parseInt(String(data.total_units)) || 0,
        units_available: parseInt(String(data.units_available)) || 0,
        elevator_count: parseInt(String(data.elevator_count)) || 0,
        disabled_parking_spaces: parseInt(String(data.disabled_parking_spaces)) || 0,
        accessible_bathrooms: parseInt(String(data.accessible_bathrooms)) || 0,
        display_order: parseInt(String(data.display_order)) || 0,
        nombre_places_parking: parseInt(String(data.nombre_places_parking)) || 0,
        parking_visiteurs: parseInt(String(data.parking_visiteurs)) || 0,
        nombre_caves: parseInt(String(data.nombre_caves)) || 0,
        nombre_box_fermes: parseInt(String(data.nombre_box_fermes)) || 0,
        nombre_lots: data.nombre_lots ? parseInt(String(data.nombre_lots)) : null,
        annee_construction: data.annee_construction ? parseInt(String(data.annee_construction)) : null,
        annee_renovation: data.annee_renovation ? parseInt(String(data.annee_renovation)) : null,
        
        // Champs décimaux
        surface_totale_batiment: data.surface_totale_batiment ? parseFloat(String(data.surface_totale_batiment)) : null,
        hauteur_batiment: data.hauteur_batiment ? parseFloat(String(data.hauteur_batiment)) : null,
        prix_moyen_m2: data.prix_moyen_m2 ? parseFloat(String(data.prix_moyen_m2)) : null,
        fourchette_prix_min: data.fourchette_prix_min ? parseFloat(String(data.fourchette_prix_min)) : null,
        fourchette_prix_max: data.fourchette_prix_max ? parseFloat(String(data.fourchette_prix_max)) : null,
        taux_occupation: parseFloat(String(data.taux_occupation)) || 0,
        surface_caves: data.surface_caves ? parseFloat(String(data.surface_caves)) : null,
        
        // Champs booléens
        has_elevator: Boolean(data.has_elevator),
        has_generator: Boolean(data.has_generator),
        has_solar_panels: Boolean(data.has_solar_panels),
        central_vacuum_system: Boolean(data.central_vacuum_system),
        water_softener_system: Boolean(data.water_softener_system),
        water_purification_system: Boolean(data.water_purification_system),
        smart_building_system: Boolean(data.smart_building_system),
        has_intercom: Boolean(data.has_intercom),
        package_room: Boolean(data.package_room),
        pet_washing_station: Boolean(data.pet_washing_station),
        car_wash_area: Boolean(data.car_wash_area),
        has_security_system: Boolean(data.has_security_system),
        has_security_24_7: Boolean(data.has_security_24_7),
        has_cctv: Boolean(data.has_cctv),
        has_security_door: Boolean(data.has_security_door),
        concierge_service: Boolean(data.concierge_service),
        has_pool: Boolean(data.has_pool),
        has_gym: Boolean(data.has_gym),
        has_spa: Boolean(data.has_spa),
        has_playground: Boolean(data.has_playground),
        has_garden: Boolean(data.has_garden),
        has_parking: Boolean(data.has_parking),
        shuttle_service: Boolean(data.shuttle_service),
        restaurant: Boolean(data.restaurant),
        cafe: Boolean(data.cafe),
        mini_market: Boolean(data.mini_market),
        business_center: Boolean(data.business_center),
        kids_club: Boolean(data.kids_club),
        coworking_space: Boolean(data.coworking_space),
        club_house: Boolean(data.club_house),
        wheelchair_accessible: Boolean(data.wheelchair_accessible),
        braille_signage: Boolean(data.braille_signage),
        audio_assistance: Boolean(data.audio_assistance),
        ramp_access: Boolean(data.ramp_access),
        wide_doorways: Boolean(data.wide_doorways),
        accessible_elevator: Boolean(data.accessible_elevator),
        has_tennis_court: Boolean(data.has_tennis_court),
        beach_access: Boolean(data.beach_access),
        marina_access: Boolean(data.marina_access),
        golf_course: Boolean(data.golf_course),
        sports_facilities: Boolean(data.sports_facilities),
        wellness_center: Boolean(data.wellness_center),
        local_velos: Boolean(data.local_velos),
        local_poussettes: Boolean(data.local_poussettes),
        
        // Dates
        expected_completion: data.expected_completion && data.expected_completion !== '' ? data.expected_completion : null,
        actual_completion: data.actual_completion && data.actual_completion !== '' ? data.actual_completion : null,
        date_mise_en_vente: data.date_mise_en_vente && data.date_mise_en_vente !== '' ? data.date_mise_en_vente : null,
        
        // URLs
        typical_floor_plan_url: data.typical_floor_plan_url || null,
        model_3d_url: data.model_3d_url || null,
        building_brochure_url: data.building_brochure_url || null,
        
        // Arrays
        vues_principales: Array.isArray(data.vues_principales) ? data.vues_principales : [],
        
        // JSONB
        nombre_logements_type: data.nombre_logements_type && typeof data.nombre_logements_type === 'object' ? data.nombre_logements_type : {},
        configuration_etages: data.configuration_etages && typeof data.configuration_etages === 'object' ? data.configuration_etages : {},
        building_amenities: data.building_amenities && typeof data.building_amenities === 'object' ? data.building_amenities : {},
        common_areas: data.common_areas && typeof data.common_areas === 'object' ? data.common_areas : {},
        security_features: data.security_features && typeof data.security_features === 'object' ? data.security_features : {},
        wellness_facilities: data.wellness_facilities && typeof data.wellness_facilities === 'object' ? data.wellness_facilities : {},
        infrastructure: data.infrastructure && typeof data.infrastructure === 'object' ? data.infrastructure : {},
        outdoor_facilities: data.outdoor_facilities && typeof data.outdoor_facilities === 'object' ? data.outdoor_facilities : {},
        floor_plans: data.floor_plans && typeof data.floor_plans === 'object' ? data.floor_plans : {}
      };

      logger.info('Cleaned data to save:', cleanedData);

      if (isEdit) {
        const { error } = await supabase
          .from('buildings')
          .update(cleanedData)
          .eq('id', id);
        
        if (error) {
          console.error('Error updating building:', error);
          toast.error(`Erreur lors de la mise à jour : ${error.message}`);
          return;
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
          toast.error(`Erreur lors de la création : ${error.message}`);
          return;
        }
        
        logger.info('Building created successfully:', newBuilding);
        toast.success("Bâtiment créé avec succès");
      }
      
      // Invalider TOUTES les clés de cache liées aux bâtiments
      await queryClient.invalidateQueries({ queryKey: ['buildings'] });
      await queryClient.invalidateQueries({ queryKey: ['all-buildings'] });
      
      // Forcer un refetch immédiat
      await queryClient.refetchQueries({ queryKey: ['all-buildings'] });
      
      navigate('/admin/buildings');
    } catch (error: any) {
      console.error('Error saving building:', error);
      toast.error(`Erreur lors de l'enregistrement : ${error.message || 'Erreur inconnue'}`);
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
      case 'dimensions':
        return ['surface_totale_batiment', 'hauteur_batiment', 'position_dans_projet', 'orientation_principale'];
      case 'commercialization':
        return ['prix_moyen_m2', 'fourchette_prix_min', 'fourchette_prix_max'];
      case 'technical':
        return ['type_chauffage', 'type_climatisation'];
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
      {/* Header fixe */}
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
        {/* Sidebar fixe */}
        <div className="w-80 bg-white border-r-2 border-slate-200 sticky top-[128px] h-[calc(100vh-128px)] overflow-y-auto">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">
              Étapes du bâtiment
              <span className="text-sm font-normal text-slate-500 ml-2">
                ({currentStepIndex + 1}/{buildingFormSteps.length})
              </span>
            </h2>
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

        {/* Contenu principal */}
        <div className="flex-1 p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-8">
              <BuildingFormSteps
                form={form}
                currentStep={currentStep.id}
                projects={projects}
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
