import { supabase } from '@/integrations/supabase/client';
import { Building, BuildingFormData } from '@/types/building';

// Fetch all buildings for a project
export const fetchBuildingsByProject = async (projectId: string): Promise<Building[]> => {
  const { data, error } = await supabase
    .from('buildings_enhanced')
    .select('*')
    .eq('project_id', projectId)
    .order('display_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching buildings:', error);
    throw error;
  }

  return (data || []).map(item => ({
    ...item,
    displayName: item.building_code || item.building_code, // Use building_code field
  })) as any[]; // Simplified type conversion
};

// Create a new building
export const createBuilding = async (projectId: string, buildingData: BuildingFormData): Promise<Building> => {
  const { data, error } = await supabase
    .from('buildings_enhanced')
    .insert([{
      project_id: projectId,
      building_code: buildingData.building_name || `BUILD-${Date.now()}`, // Map to building_code (required)
      building_type: buildingData.building_type,
      total_floors: buildingData.total_floors,
      total_units: buildingData.total_units,
      construction_status: buildingData.construction_status
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating building:', error);
    throw error;
  }

  return data as any; // Simplified type conversion
};

// Update an existing building
export const updateBuilding = async (id: string, buildingData: Partial<BuildingFormData>): Promise<Building> => {
  const updateData = {
    ...buildingData,
    // Map building_name to name for database compatibility
    ...(buildingData.building_name && { name: buildingData.building_name })
  };

  const { data, error } = await supabase
    .from('buildings_enhanced')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating building:', error);
    throw error;
  }

  return data as any; // Simplified type conversion
};

// Delete a building
export const deleteBuilding = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('buildings_enhanced')
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
    .from('buildings_enhanced')
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
    displayName: data.building_code || data.building_code,
  } as any; // Simplified type conversion
};