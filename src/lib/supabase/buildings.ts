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
  // Utilisation de la vue buildings_with_project_info pour avoir accès à construction_year
  let query = supabase
    .from('buildings_with_project_info')
    .select(`
      *,
      project_title,
      project_construction_year,
      project_zone,
      project_city,
      project_energy_rating
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
  
  // Si erreur avec la vue, fallback sur la table buildings
  if (error) {
    console.warn('Erreur avec la vue, utilisation de la table buildings:', error);
    let fallbackQuery = supabase
      .from('buildings')
      .select(`
        *,
        project:projects(id, title, cyprus_zone, construction_year)
      `)
      .order('project_id', { ascending: true })
      .order('building_name', { ascending: true });

    if (filters.projectId) {
      fallbackQuery = fallbackQuery.eq('project_id', filters.projectId);
    }
    if (filters.constructionStatus) {
      fallbackQuery = fallbackQuery.eq('construction_status', filters.constructionStatus);
    }
    if (filters.minFloors) {
      fallbackQuery = fallbackQuery.gte('total_floors', parseInt(filters.minFloors));
    }
    if (filters.maxFloors) {
      fallbackQuery = fallbackQuery.lte('total_floors', parseInt(filters.maxFloors));
    }

    const fallbackResult = await fallbackQuery;
    if (fallbackResult.error) throw fallbackResult.error;
    return fallbackResult.data;
  }
  
  return data;
};

// Fetch single building with full details
export const fetchBuilding = async (id: string) => {
  // Utilisation de la fonction optimisée créée dans la migration
  const { data: functionData, error: functionError } = await supabase
    .rpc('get_buildings_with_project_data', { p_project_id: id });
  
  if (!functionError && functionData && functionData.length > 0) {
    return functionData[0];
  }

  // Fallback sur la vue
  const { data, error } = await supabase
    .from('buildings_with_project_info')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    // Dernier fallback sur la table buildings avec join
    const fallbackResult = await supabase
      .from('buildings')
      .select(`
        *,
        project:projects(
          id,
          title,
          cyprus_zone,
          construction_year,
          developer:developers(name)
        )
      `)
      .eq('id', id)
      .single();
    
    if (fallbackResult.error) throw fallbackResult.error;
    return fallbackResult.data;
  }
  
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
  const { data: properties, error: propError } = await supabase
    .from('properties')
    .select('id')
    .eq('building_id', id)
    .limit(1);
  
  if (!propError && properties && properties.length > 0) {
    throw new Error(`Impossible de supprimer : des propriétés sont associées à ce bâtiment`);
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
    .select('id, title, cyprus_zone, construction_year')
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

// Calculate available units for a building
export const calculateAvailableUnits = async (buildingId: string) => {
  // Requête réelle sur la table properties
  const { data: properties, error } = await supabase
    .from('properties')
    .select('id, status')
    .eq('building_id', buildingId);
  
  if (error) {
    console.error('Erreur lors du calcul des unités disponibles:', error);
    return { available: 0, total: 0, sold: 0, occupancyRate: 0, isSoldOut: false };
  }
  
  const total = properties?.length || 0;
  const available = properties?.filter(p => p.status === 'available').length || 0;
  const sold = properties?.filter(p => p.status === 'sold').length || 0;
  const reserved = properties?.filter(p => p.status === 'reserved').length || 0;
  const occupancyRate = total > 0 ? Math.round(((sold + reserved) / total) * 100) : 0;
  
  return { 
    available, 
    total, 
    sold,
    reserved,
    occupancyRate,
    isSoldOut: available === 0 && total > 0
  };
};

// Group buildings by project
export const groupBuildingsByProject = (buildings: any[]) => {
  return buildings.reduce((acc, building) => {
    const projectId = building.project_id || 'no-project';
    const projectTitle = building.project_title || building.project?.title || 'Sans projet';
    const projectConstructionYear = building.project_construction_year || building.project?.construction_year || null;
    
    if (!acc[projectId]) {
      acc[projectId] = {
        projectTitle,
        projectConstructionYear,
        buildings: []
      };
    }
    acc[projectId].buildings.push(building);
    return acc;
  }, {} as Record<string, { projectTitle: string; projectConstructionYear: number | null; buildings: any[] }>);
};
