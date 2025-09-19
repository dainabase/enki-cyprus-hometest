import { supabase } from '@/integrations/supabase/client';
import { Building, BuildingFormData } from '@/types/building';

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
  return (data || []).map(item => ({
    ...item,
    building_name: item.building_name || item.name,
  })) as Building[];
};

// Create a new building
export const createBuilding = async (projectId: string, buildingData: BuildingFormData): Promise<Building> => {
  const { data, error } = await supabase
    .from('buildings')
    .insert([{
      project_id: projectId,
      name: buildingData.building_name, // Map building_name to name for database compatibility
      ...buildingData,
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

  return {
    ...data,
    building_name: data.building_name || data.name,
  } as Building;
};