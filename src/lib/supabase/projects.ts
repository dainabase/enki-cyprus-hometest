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
  [key: string]: any; // Pour permettre tous les autres champs du formulaire
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
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      developer:developers(id, name, contact_info, logo, website),
      buildings!fk_buildings_project_id(
        id,
        name,
        total_floors,
        total_units,
        building_type,
        construction_status,
        energy_rating
      )
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

// Create new project
export const createProject = async (projectData: ProjectFormData) => {
  const { data, error } = await supabase
    .from('projects')
    .insert([{
      ...projectData,
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
  
  const { data, error } = await supabase
    .from('projects')
    .update(projectData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('❌ ERREUR UPDATE PROJECT:', error);
    throw error;
  }
  
  console.log('✅ UPDATE PROJECT RÉUSSI - Données retournées:', {
    id: data.id,
    status_project: data.status_project,
    statut_commercial: data.statut_commercial,
    title: data.title
  });
  
  return data;
};

// Delete project with cascade validation
export const deleteProject = async (id: string) => {
  // Check for dependent buildings first
  const { data: buildings, error: checkError } = await supabase
    .from('buildings')
    .select('id, name')
    .eq('project_id', id);

  if (checkError) throw checkError;

  if (buildings && buildings.length > 0) {
    const buildingNames = buildings.map(b => b.name).join(', ');
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

// Calculate project statistics
export const calculateProjectStats = (projects: any[]) => {
  return {
    total: projects.length,
    available: projects.filter(p => p.status === 'available').length,
    construction: projects.filter(p => p.status === 'under_construction').length,
    delivered: projects.filter(p => p.status === 'delivered').length,
    goldenVisa: projects.filter(p => p.golden_visa_eligible).length,
    totalBuildings: projects.reduce((sum, p) => {
      // Count buildings associated with this project
      return sum + (Array.isArray(p.buildings) ? p.buildings.length : 0);
    }, 0)
  };
};

// Group projects by developer
export const groupProjectsByDeveloper = (projects: any[]) => {
  return projects.reduce((acc, project) => {
    const developerId = project.developer_id || 'no-developer';
    const developerName = project.developer?.name || 'Sans développeur';
    
    if (!acc[developerId]) {
      acc[developerId] = {
        developerName,
        projects: []
      };
    }
    acc[developerId].projects.push(project);
    return acc;
  }, {} as Record<string, { developerName: string; projects: any[] }>);
};