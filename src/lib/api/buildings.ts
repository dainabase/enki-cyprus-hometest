import { supabase } from '@/integrations/supabase/client';
import { Building, BuildingFormData } from '@/types/building';

// Fetch all buildings (for admin buildings page)
export const fetchAllBuildings = async (): Promise<Building[]> => {
  const { data, error } = await supabase
    .from('buildings')
    .select(`
      *,
      project:projects(id, title, cyprus_zone)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all buildings:', error);
    throw error;
  }

  return (data || []) as Building[];
};

// Fetch all projects (for building modal dropdown)
export const fetchAllProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('id, title, city')
    .order('title');
  
  if (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
  
  return data || [];
};

// Create a new building (global version) with ALL 77 fields
export const createBuildingGlobal = async (buildingData: BuildingFormData): Promise<Building> => {
  if (!buildingData.project_id) {
    throw new Error('Project ID is required');
  }

  const { data: userData } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('buildings')
    .insert([{
      // Section 1: Informations de base (9 champs)
      project_id: buildingData.project_id,
      building_name: buildingData.building_name,
      building_code: buildingData.building_code || '',
      display_order: buildingData.display_order || 0,
      building_type: buildingData.building_type || 'residential',
      building_class: buildingData.building_class || 'A',
      
      // Section 2: Structure (11 champs)
      total_floors: buildingData.total_floors || 1,
      total_units: buildingData.total_units || 0,
      units_available: buildingData.units_available || 0,
      construction_status: buildingData.construction_status || 'planning',
      expected_completion: buildingData.expected_completion || null,
      actual_completion: buildingData.actual_completion || null,
      energy_rating: buildingData.energy_rating || '',
      energy_certificate: buildingData.energy_certificate || 'B',
      elevator_count: buildingData.elevator_count || 0,
      has_elevator: buildingData.has_elevator || false,
      created_by: userData?.user?.id,
      
      // Section 3: Infrastructure technique (12 champs)
      has_generator: buildingData.has_generator || false,
      has_solar_panels: buildingData.has_solar_panels || false,
      central_vacuum_system: buildingData.central_vacuum_system || false,
      water_softener_system: buildingData.water_softener_system || false,
      water_purification_system: buildingData.water_purification_system || false,
      smart_building_system: buildingData.smart_building_system || false,
      intercom_system: buildingData.intercom_system || false,
      has_intercom: buildingData.has_intercom || false,
      package_room: buildingData.package_room || false,
      bike_storage: buildingData.bike_storage || false,
      pet_washing_station: buildingData.pet_washing_station || false,
      car_wash_area: buildingData.car_wash_area || false,
      
      // Section 4: Sécurité (6 champs)
      has_security_system: buildingData.has_security_system || false,
      has_security_24_7: buildingData.has_security_24_7 || false,
      has_cctv: buildingData.has_cctv || false,
      has_concierge: buildingData.has_concierge || false,
      has_security_door: buildingData.has_security_door || false,
      concierge_service: buildingData.concierge_service || false,
      
      // Section 5: Équipements communs (9 champs)
      has_pool: buildingData.has_pool || false,
      has_gym: buildingData.has_gym || false,
      has_spa: buildingData.has_spa || false,
      has_playground: buildingData.has_playground || false,
      has_garden: buildingData.has_garden || false,
      has_parking: buildingData.has_parking || false,
      parking_type: buildingData.parking_type || 'outdoor',
      disabled_parking_spaces: buildingData.disabled_parking_spaces || 0,
      shuttle_service: buildingData.shuttle_service || false,
      
      // Section 6: Services & Commerce (7 champs)
      restaurant: buildingData.restaurant || false,
      cafe: buildingData.cafe || false,
      mini_market: buildingData.mini_market || false,
      business_center: buildingData.business_center || false,
      kids_club: buildingData.kids_club || false,
      coworking_space: buildingData.coworking_space || false,
      club_house: buildingData.club_house || false,
      
      // Section 7: Accessibilité (8 champs - manque 1)
      wheelchair_accessible: buildingData.wheelchair_accessible || false,
      braille_signage: buildingData.braille_signage || false,
      audio_assistance: buildingData.audio_assistance || false,
      accessible_bathrooms: buildingData.accessible_bathrooms || 0,
      ramp_access: buildingData.ramp_access || false,
      wide_doorways: buildingData.wide_doorways || false,
      accessible_elevator: buildingData.accessible_elevator || false,
      
      // Section 8: Loisirs & Sports (6 champs - manque 1)
      has_tennis_court: buildingData.has_tennis_court || false,
      beach_access: buildingData.beach_access || false,
      marina_access: buildingData.marina_access || false,
      golf_course: buildingData.golf_course || false,
      sports_facilities: buildingData.sports_facilities || false,
      wellness_center: buildingData.wellness_center || false,
      
      // Section 9: Documents (3 champs)
      typical_floor_plan_url: buildingData.typical_floor_plan_url || '',
      model_3d_url: buildingData.model_3d_url || '',
      building_brochure_url: buildingData.building_brochure_url || '',
      
      // Section 10: Données avancées JSONB (7 champs)
      building_amenities: buildingData.building_amenities || {},
      common_areas: buildingData.common_areas || {},
      security_features: buildingData.security_features || {},
      wellness_facilities: buildingData.wellness_facilities || {},
      infrastructure: buildingData.infrastructure || {},
      outdoor_facilities: buildingData.outdoor_facilities || {},
      floor_plans: buildingData.floor_plans || {}
    }])
    .select(`
      *,
      project:projects(id, title, cyprus_zone)
    `)
    .single();

  if (error) {
    console.error('Error creating building:', error);
    throw error;
  }

  return data as Building;
};

// Fetch all buildings for a project
export const fetchBuildingsByProject = async (projectId: string): Promise<Building[]> => {
  const { data, error } = await supabase
    .from('buildings')
    .select('*')
    .eq('project_id', projectId)
    .order('display_order', { ascending: true })
    .order('building_name', { ascending: true });

  if (error) {
    console.error('Error fetching buildings:', error);
    throw error;
  }

  return (data || []) as Building[];
};

// Create a new building (project-specific) with ALL fields
export const createBuilding = async (projectId: string, buildingData: BuildingFormData): Promise<Building> => {
  const { data: userData } = await supabase.auth.getUser();
  
  // Use createBuildingGlobal with the projectId set
  return createBuildingGlobal({ ...buildingData, project_id: projectId });
};

// Update an existing building with ALL 77 fields
export const updateBuilding = async (id: string, buildingData: Partial<BuildingFormData>): Promise<Building> => {
  // Prepare all fields for update
  const updateData = {
    // Section 1: Informations de base
    ...(buildingData.building_name !== undefined && { building_name: buildingData.building_name }),
    ...(buildingData.building_code !== undefined && { building_code: buildingData.building_code }),
    ...(buildingData.display_order !== undefined && { display_order: buildingData.display_order }),
    ...(buildingData.building_type !== undefined && { building_type: buildingData.building_type }),
    ...(buildingData.building_class !== undefined && { building_class: buildingData.building_class }),
    
    // Section 2: Structure
    ...(buildingData.total_floors !== undefined && { total_floors: buildingData.total_floors }),
    ...(buildingData.total_units !== undefined && { total_units: buildingData.total_units }),
    ...(buildingData.units_available !== undefined && { units_available: buildingData.units_available }),
    ...(buildingData.construction_status !== undefined && { construction_status: buildingData.construction_status }),
    ...(buildingData.expected_completion !== undefined && { expected_completion: buildingData.expected_completion }),
    ...(buildingData.actual_completion !== undefined && { actual_completion: buildingData.actual_completion }),
    ...(buildingData.energy_rating !== undefined && { energy_rating: buildingData.energy_rating }),
    ...(buildingData.energy_certificate !== undefined && { energy_certificate: buildingData.energy_certificate }),
    ...(buildingData.elevator_count !== undefined && { elevator_count: buildingData.elevator_count }),
    ...(buildingData.has_elevator !== undefined && { has_elevator: buildingData.has_elevator }),
    
    // Section 3: Infrastructure technique
    ...(buildingData.has_generator !== undefined && { has_generator: buildingData.has_generator }),
    ...(buildingData.has_solar_panels !== undefined && { has_solar_panels: buildingData.has_solar_panels }),
    ...(buildingData.central_vacuum_system !== undefined && { central_vacuum_system: buildingData.central_vacuum_system }),
    ...(buildingData.water_softener_system !== undefined && { water_softener_system: buildingData.water_softener_system }),
    ...(buildingData.water_purification_system !== undefined && { water_purification_system: buildingData.water_purification_system }),
    ...(buildingData.smart_building_system !== undefined && { smart_building_system: buildingData.smart_building_system }),
    ...(buildingData.intercom_system !== undefined && { intercom_system: buildingData.intercom_system }),
    ...(buildingData.has_intercom !== undefined && { has_intercom: buildingData.has_intercom }),
    ...(buildingData.package_room !== undefined && { package_room: buildingData.package_room }),
    ...(buildingData.bike_storage !== undefined && { bike_storage: buildingData.bike_storage }),
    ...(buildingData.pet_washing_station !== undefined && { pet_washing_station: buildingData.pet_washing_station }),
    ...(buildingData.car_wash_area !== undefined && { car_wash_area: buildingData.car_wash_area }),
    
    // Section 4: Sécurité
    ...(buildingData.has_security_system !== undefined && { has_security_system: buildingData.has_security_system }),
    ...(buildingData.has_security_24_7 !== undefined && { has_security_24_7: buildingData.has_security_24_7 }),
    ...(buildingData.has_cctv !== undefined && { has_cctv: buildingData.has_cctv }),
    ...(buildingData.has_concierge !== undefined && { has_concierge: buildingData.has_concierge }),
    ...(buildingData.has_security_door !== undefined && { has_security_door: buildingData.has_security_door }),
    ...(buildingData.concierge_service !== undefined && { concierge_service: buildingData.concierge_service }),
    
    // Section 5: Équipements
    ...(buildingData.has_pool !== undefined && { has_pool: buildingData.has_pool }),
    ...(buildingData.has_gym !== undefined && { has_gym: buildingData.has_gym }),
    ...(buildingData.has_spa !== undefined && { has_spa: buildingData.has_spa }),
    ...(buildingData.has_playground !== undefined && { has_playground: buildingData.has_playground }),
    ...(buildingData.has_garden !== undefined && { has_garden: buildingData.has_garden }),
    ...(buildingData.has_parking !== undefined && { has_parking: buildingData.has_parking }),
    ...(buildingData.parking_type !== undefined && { parking_type: buildingData.parking_type }),
    ...(buildingData.disabled_parking_spaces !== undefined && { disabled_parking_spaces: buildingData.disabled_parking_spaces }),
    ...(buildingData.shuttle_service !== undefined && { shuttle_service: buildingData.shuttle_service }),
    
    // Section 6: Services
    ...(buildingData.restaurant !== undefined && { restaurant: buildingData.restaurant }),
    ...(buildingData.cafe !== undefined && { cafe: buildingData.cafe }),
    ...(buildingData.mini_market !== undefined && { mini_market: buildingData.mini_market }),
    ...(buildingData.business_center !== undefined && { business_center: buildingData.business_center }),
    ...(buildingData.kids_club !== undefined && { kids_club: buildingData.kids_club }),
    ...(buildingData.coworking_space !== undefined && { coworking_space: buildingData.coworking_space }),
    ...(buildingData.club_house !== undefined && { club_house: buildingData.club_house }),
    
    // Section 7: Accessibilité
    ...(buildingData.wheelchair_accessible !== undefined && { wheelchair_accessible: buildingData.wheelchair_accessible }),
    ...(buildingData.braille_signage !== undefined && { braille_signage: buildingData.braille_signage }),
    ...(buildingData.audio_assistance !== undefined && { audio_assistance: buildingData.audio_assistance }),
    ...(buildingData.accessible_bathrooms !== undefined && { accessible_bathrooms: buildingData.accessible_bathrooms }),
    ...(buildingData.ramp_access !== undefined && { ramp_access: buildingData.ramp_access }),
    ...(buildingData.wide_doorways !== undefined && { wide_doorways: buildingData.wide_doorways }),
    ...(buildingData.accessible_elevator !== undefined && { accessible_elevator: buildingData.accessible_elevator }),
    
    // Section 8: Loisirs
    ...(buildingData.has_tennis_court !== undefined && { has_tennis_court: buildingData.has_tennis_court }),
    ...(buildingData.beach_access !== undefined && { beach_access: buildingData.beach_access }),
    ...(buildingData.marina_access !== undefined && { marina_access: buildingData.marina_access }),
    ...(buildingData.golf_course !== undefined && { golf_course: buildingData.golf_course }),
    ...(buildingData.sports_facilities !== undefined && { sports_facilities: buildingData.sports_facilities }),
    ...(buildingData.wellness_center !== undefined && { wellness_center: buildingData.wellness_center }),
    
    // Section 9: Documents
    ...(buildingData.typical_floor_plan_url !== undefined && { typical_floor_plan_url: buildingData.typical_floor_plan_url }),
    ...(buildingData.model_3d_url !== undefined && { model_3d_url: buildingData.model_3d_url }),
    ...(buildingData.building_brochure_url !== undefined && { building_brochure_url: buildingData.building_brochure_url }),
    
    // Section 10: Données JSONB
    ...(buildingData.building_amenities !== undefined && { building_amenities: buildingData.building_amenities }),
    ...(buildingData.common_areas !== undefined && { common_areas: buildingData.common_areas }),
    ...(buildingData.security_features !== undefined && { security_features: buildingData.security_features }),
    ...(buildingData.wellness_facilities !== undefined && { wellness_facilities: buildingData.wellness_facilities }),
    ...(buildingData.infrastructure !== undefined && { infrastructure: buildingData.infrastructure }),
    ...(buildingData.outdoor_facilities !== undefined && { outdoor_facilities: buildingData.outdoor_facilities }),
    ...(buildingData.floor_plans !== undefined && { floor_plans: buildingData.floor_plans })
  };

  const { data, error } = await supabase
    .from('buildings')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating building:', error);
    throw error;
  }

  return data as Building;
};

// Delete a building
export const deleteBuilding = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('buildings')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting building:', error);
    throw error;
  }
};

// Get building by ID
export const fetchBuildingById = async (id: string): Promise<Building | null> => {
  const { data, error } = await supabase
    .from('buildings')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching building:', error);
    throw error;
  }

  if (!data) return null;

  return data as Building;
};