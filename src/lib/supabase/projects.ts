import { supabase } from '@/integrations/supabase/client';

export interface ProjectFilters {
  developerId?: string;
  zone?: string;
  status?: string;
  goldenVisaOnly?: boolean;
}

export interface ProjectFormData {
  title: string;
  subtitle?: string;
  description: string;
  detailed_description?: string;
  developer_id?: string;
  cyprus_zone: string;
  status: string;
  status_project?: string;
  statut_commercial?: string;
  type: string;
  price: number;
  price_from?: string;
  vat_rate: number;
  completion_date?: string;
  golden_visa_eligible: boolean;
  units_available: number;
  total_units: number;
  location: {
    city: string;
    address?: string;
    lat: number;
    lng: number;
  };
  features?: string[];
  photos?: string[];
  [key: string]: unknown;
}

// Fetch projects with optional filters
export const fetchProjects = async (filters: ProjectFilters = {}) => {
  let query = supabase
    .from('projects')
    .select(`
      *,
      developer:developers(id, name, contact_info),
      buildings!fk_buildings_project_id(count)
    `)
    .order('developer_id', { ascending: true })
    .order('title', { ascending: true });

  // Apply filters
  if (filters.developerId) {
    query = query.eq('developer_id', filters.developerId);
  }
  if (filters.zone) {
    query = query.eq('cyprus_zone', filters.zone);
  }
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  if (filters.goldenVisaOnly) {
    query = query.eq('golden_visa_eligible', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

// Fetch single project with full details
export const fetchProject = async (id: string) => {
  console.log('🔍 Fetching project with ID:', id);
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')  // Sélectionne TOUT au lieu de champs spécifiques
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('❌ Error fetching project:', error);
    throw error;
  }
  
  console.log('✅ Project fetched successfully:', data);
  return data;
};

// Create new project
export const createProject = async (projectData: ProjectFormData) => {
  const { data, error } = await supabase
    .from('projects')
    .insert([{
      title: projectData.title,
      subtitle: projectData.subtitle,
      description: projectData.description,
      detailed_description: projectData.detailed_description,
      developer_id: projectData.developer_id,
      city: projectData.location?.city || 'Limassol',
      cyprus_zone: projectData.cyprus_zone,
      status: projectData.status,
      status_project: projectData.status_project,
      statut_commercial: projectData.statut_commercial,
      type: projectData.type,
      price_from: typeof projectData.price_from === 'string' ? parseFloat(projectData.price_from) : projectData.price_from,
      vat_rate: projectData.vat_rate,
      completion_date: projectData.completion_date,
      golden_visa_eligible: projectData.golden_visa_eligible,
      units_available: projectData.units_available,
      total_units: projectData.total_units,
      location: projectData.location,
      features: projectData.features || [],
      photos: projectData.photos || []
    }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Update existing project
export const updateProject = async (id: string, projectData: Partial<ProjectFormData>) => {
  console.log('🔄 UPDATE PROJECT - Données envoyées à Supabase:', {
    id,
    status_project: projectData.status_project,
    statut_commercial: projectData.statut_commercial,
    title: projectData.title
  });
  
  // Prepare update data with proper type conversion
  const updateData = {
    ...projectData,
    price_from: typeof projectData.price_from === 'string' ? parseFloat(projectData.price_from) : projectData.price_from
  };

  const { data, error } = await supabase
    .from('projects')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('❌ ERREUR UPDATE PROJECT:', error);
    throw error;
  }
  
  console.log('✅ UPDATE PROJECT RÉUSSI - Données retournées:', {
    id: data.id,
    title: data.title
  });
  
  return data;
};

// Delete project with cascade validation
export const deleteProject = async (id: string) => {
  // Check for dependent buildings first
  const { data: buildings, error: checkError } = await supabase
    .from('buildings')
    .select('id, building_name')
    .eq('project_id', id);

  if (checkError) throw checkError;

  if (buildings && buildings.length > 0) {
    const buildingNames = buildings.map(b => b.building_name || `Building ${b.id}`).join(', ');
    throw new Error(`Impossible de supprimer : ${buildings.length} bâtiment(s) associé(s) (${buildingNames})`);
  }

  // Proceed with deletion if no dependencies
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Fetch developers for dropdowns
export const fetchDevelopers = async () => {
  const { data, error } = await supabase
    .from('developers')
    .select('id, name')
    .eq('status', 'active')
    .order('name');
  
  if (error) throw error;
  return data;
};

type ProjectRecord = {
  id: string;
  status?: string | null;
  golden_visa_eligible?: boolean | null;
  developer_id?: string | null;
  developer?: { name?: string | null } | null;
  buildings?: unknown[] | null;
  [key: string]: unknown;
};

export const calculateProjectStats = (projects: ProjectRecord[]) => {
  return {
    total: projects.length,
    available: projects.filter(p => p.status === 'available').length,
    construction: projects.filter(p => p.status === 'under_construction').length,
    delivered: projects.filter(p => p.status === 'delivered').length,
    goldenVisa: projects.filter(p => p.golden_visa_eligible).length,
    totalBuildings: projects.reduce((sum, p) => {
      return sum + (Array.isArray(p.buildings) ? p.buildings.length : 0);
    }, 0)
  };
};

export const groupProjectsByDeveloper = (projects: ProjectRecord[]) => {
  return projects.reduce<Record<string, { developerName: string; projects: ProjectRecord[] }>>((acc, project) => {
    const developerId = project.developer_id || 'no-developer';
    const developerName = project.developer?.name || 'Sans developpeur';

    if (!acc[developerId]) {
      acc[developerId] = {
        developerName,
        projects: []
      };
    }
    acc[developerId].projects.push(project);
    return acc;
  }, {});
};