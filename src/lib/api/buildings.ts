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

// Create a new building (global version)
export const createBuildingGlobal = async (buildingData: BuildingFormData): Promise<Building> => {
  if (!buildingData.project_id) {
    throw new Error('Project ID is required');
  }

  const { data, error } = await supabase
    .from('buildings')
    .insert([{
      project_id: buildingData.project_id,
      building_code: buildingData.building_code || 'A',
      building_name: buildingData.building_name,
      building_type: buildingData.building_type,
      total_floors: buildingData.total_floors || 1,
      construction_status: buildingData.construction_status,
      expected_completion: buildingData.expected_completion,
      elevator_count: buildingData.elevator_count || 0,
      has_generator: buildingData.has_generator,
      has_solar_panels: buildingData.has_solar_panels,
      has_security_system: buildingData.has_security_system,
      has_cctv: buildingData.has_cctv,
      has_concierge: buildingData.has_concierge,
      has_pool: buildingData.has_pool,
      has_gym: buildingData.has_gym,
      has_spa: buildingData.has_spa,
      has_playground: buildingData.has_playground,
      has_garden: buildingData.has_garden,
      has_parking: buildingData.has_parking,
      parking_type: buildingData.parking_type,
      created_by: (await supabase.auth.getUser()).data.user?.id
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
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching buildings:', error);
    throw error;
  }

  // Map database fields to Building interface
  return (data || []) as Building[];
};

// Create a new building
export const createBuilding = async (projectId: string, buildingData: BuildingFormData): Promise<Building> => {
  const { data, error } = await supabase
    .from('buildings')
    .insert([{
      project_id: projectId,
      building_code: buildingData.building_code || 'A',
      building_name: buildingData.building_name,
      building_type: buildingData.building_type,
      total_floors: buildingData.total_floors || 1,
      total_units: buildingData.total_units || 0,
      construction_status: buildingData.construction_status,
      created_by: (await supabase.auth.getUser()).data.user?.id
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating building:', error);
    throw error;
  }

  return data as Building;
};

// Update an existing building
export const updateBuilding = async (id: string, buildingData: Partial<BuildingFormData>): Promise<Building> => {
  const updateData = {
    ...buildingData,
    // Map building_name to name for database compatibility
    ...(buildingData.building_name && { name: buildingData.building_name })
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