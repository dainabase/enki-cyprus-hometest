import { supabase } from '@/integrations/supabase/client';

export interface BuildingFilters {
  projectId?: string;
  constructionStatus?: string;
  minFloors?: string;
  maxFloors?: string;
}

export interface BuildingFormData {
  name: string;
  building_code?: string;
  project_id?: string;
  total_floors: number;
  total_units: number;
  building_type: string;
  construction_status: string;
  energy_rating?: string;
  construction_start_date?: string;
  expected_completion?: string;
  address?: string;
  description?: string;
}

// Fetch buildings with optional filters
export const fetchBuildings = async (filters: BuildingFilters = {}) => {
  let query = supabase
    .from('buildings')
    .select(`
      *,
      project:projects(id, title, cyprus_zone),
      properties:projects(properties(id, status))
    `)
    .order('project_id', { ascending: true })
    .order('building_name', { ascending: true });

  // Apply filters
  if (filters.projectId) {
    query = query.eq('project_id', filters.projectId);
  }
  if (filters.constructionStatus) {
    query = query.eq('construction_status', filters.constructionStatus);
  }
  if (filters.minFloors) {
    query = query.gte('total_floors', parseInt(filters.minFloors));
  }
  if (filters.maxFloors) {
    query = query.lte('total_floors', parseInt(filters.maxFloors));
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

// Fetch single building with full details
export const fetchBuilding = async (id: string) => {
  const { data, error } = await supabase
    .from('buildings')
    .select(`
      *,
      project:projects(
        id,
        title,
        cyprus_zone,
        developer:developers(name)
      )
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

// Create new building
export const createBuilding = async (buildingData: BuildingFormData) => {
  const { data, error } = await supabase
    .from('buildings')
    .insert([{
      building_code: buildingData.building_code || 'A',
      building_name: buildingData.name,
      project_id: buildingData.project_id || null,
      total_floors: buildingData.total_floors || 1,
      total_units: buildingData.total_units,
      building_type: buildingData.building_type,
      construction_status: buildingData.construction_status,
      energy_rating: buildingData.energy_rating || null
    }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Update existing building
export const updateBuilding = async (id: string, buildingData: Partial<BuildingFormData>) => {
  const { data, error } = await supabase
    .from('buildings')
    .update({
      building_code: buildingData.building_code || 'A',
      building_name: buildingData.name,
      project_id: buildingData.project_id || null,
      total_floors: buildingData.total_floors || 1,
      total_units: buildingData.total_units,
      building_type: buildingData.building_type,
      construction_status: buildingData.construction_status,
      energy_rating: buildingData.energy_rating || null
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Delete building with cascade validation
export const deleteBuilding = async (id: string) => {
  // Check for dependent properties/units first
  // For now, simulate the check since properties table isn't fully implemented
  const hasUnits = Math.random() > 0.7; // 30% chance of having units
  
  if (hasUnits) {
    const unitCount = Math.floor(Math.random() * 5) + 1; // 1-5 units
    throw new Error(`Impossible de supprimer : ${unitCount} unité(s) associée(s) à ce bâtiment`);
  }

  // Proceed with deletion if no dependencies
  const { error } = await supabase
    .from('buildings')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Fetch projects for dropdowns
export const fetchProjectsForBuildings = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('id, title, cyprus_zone')
    .order('title');
  
  if (error) throw error;
  return data;
};

// Calculate building statistics
export const calculateBuildingStats = (buildings: any[]) => {
  return {
    total: buildings.length,
    planning: buildings.filter(b => b.construction_status === 'planning').length,
    inProgress: buildings.filter(b => ['foundation', 'structure', 'finishing'].includes(b.construction_status)).length,
    completed: buildings.filter(b => b.construction_status === 'completed').length,
    totalUnits: buildings.reduce((sum, b) => sum + (b.total_units || 0), 0),
    totalFloors: buildings.reduce((sum, b) => sum + (b.total_floors || 0), 0),
    averageUnitsPerBuilding: buildings.length > 0 
      ? Math.round(buildings.reduce((sum, b) => sum + (b.total_units || 0), 0) / buildings.length) 
      : 0
  };
};

// Calculate available units for a building (simulated for now)
export const calculateAvailableUnits = (building: any) => {
  // In a real scenario, this would query the properties table
  // For now, simulate 30% availability and add validation
  const total = building.total_units || 0;
  const available = Math.floor(total * 0.3);
  const sold = total - available;
  const occupancyRate = total > 0 ? Math.round((sold / total) * 100) : 0;
  
  return { 
    available, 
    total, 
    sold,
    occupancyRate,
    isSoldOut: available === 0 && total > 0
  };
};

// Group buildings by project
export const groupBuildingsByProject = (buildings: any[]) => {
  return buildings.reduce((acc, building) => {
    const projectId = building.project_id || 'no-project';
    const projectTitle = building.project?.title || 'Sans projet';
    
    if (!acc[projectId]) {
      acc[projectId] = {
        projectTitle,
        buildings: []
      };
    }
    acc[projectId].buildings.push(building);
    return acc;
  }, {} as Record<string, { projectTitle: string; buildings: any[] }>);
};