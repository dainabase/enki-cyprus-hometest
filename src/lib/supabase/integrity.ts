import { supabase } from '@/integrations/supabase/client';

interface OrphanedProject {
  id: string;
  title: string | null;
  developer_id: string | null;
}

interface OrphanedBuilding {
  id: string;
  name: string | null;
  project_id: string | null;
}

interface OrphanData {
  orphanedProjects: OrphanedProject[];
  orphanedBuildings: OrphanedBuilding[];
  orphanedProperties: unknown[];
}

interface DependencyItem {
  id: string;
  name?: string | null;
  title?: string | null;
}

interface DependencyCheck {
  hasItems: boolean;
  count: number;
  details: string;
  items: DependencyItem[];
}

// Integrity checks
export async function checkHierarchyIntegrity(): Promise<OrphanData> {
  try {
    // Check for orphaned projects (projects without developers)
    const { data: orphanedProjects, error: projectError } = await supabase
      .from('projects')
      .select('id, title, developer_id')
      .is('developer_id', null);

    if (projectError) throw projectError;

    // Check for orphaned buildings (buildings without projects)
    const { data: orphanedBuildings, error: buildingError } = await supabase
      .from('buildings')
      .select('id, name, project_id')
      .is('project_id', null);

    if (buildingError) throw buildingError;

    const orphanedProperties: unknown[] = [];

    return {
      orphanedProjects: orphanedProjects || [],
      orphanedBuildings: orphanedBuildings || [],
      orphanedProperties
    };

  } catch (error) {
    console.error('Error checking hierarchy integrity:', error);
    return {
      orphanedProjects: [],
      orphanedBuildings: [],
      orphanedProperties: []
    };
  }
}

// Dependency checks for deletion
export async function checkProjectDependencies(projectId: string): Promise<DependencyCheck> {
  try {
    const { data: buildings, error } = await supabase
      .from('buildings')
      .select('id, name')
      .eq('project_id', projectId);

    if (error) throw error;

    const count = buildings?.length || 0;
    
    return {
      hasItems: count > 0,
      count,
      details: count > 0 ? `${count} bâtiment(s) associé(s)` : 'Aucune dépendance',
      items: buildings || []
    };

  } catch (error) {
    console.error('Error checking project dependencies:', error);
    return {
      hasItems: false,
      count: 0,
      details: 'Erreur lors de la vérification',
      items: []
    };
  }
}

export async function checkBuildingDependencies(buildingId: string): Promise<DependencyCheck> {
  try {
    const simulatedProperties: DependencyItem[] = [];
    
    return {
      hasItems: simulatedProperties.length > 0,
      count: simulatedProperties.length,
      details: simulatedProperties.length > 0 ? `${simulatedProperties.length} propriété(s) associée(s)` : 'Aucune dépendance',
      items: simulatedProperties
    };

  } catch (error) {
    console.error('Error checking building dependencies:', error);
    return {
      hasItems: false,
      count: 0,
      details: 'Erreur lors de la vérification',
      items: []
    };
  }
}

// Data synchronization functions
export async function synchronizeProjectPrices(projectId: string): Promise<void> {
  try {
    // Get all buildings for this project
    const { data: buildings, error: buildingsError } = await supabase
      .from('buildings')
      .select('*')
      .eq('project_id', projectId);

    if (buildingsError) throw buildingsError;

    // In a real implementation, this would calculate prices based on building data
    // For now, we'll simulate the price calculation
    
    console.log(`Synchronizing prices for project ${projectId} with ${buildings?.length || 0} buildings`);
    
    // Update project with calculated price
    // const calculatedPrice = calculatePriceFromBuildings(buildings);
    // await supabase
    //   .from('projects')
    //   .update({ price: calculatedPrice })
    //   .eq('id', projectId);

  } catch (error) {
    console.error('Error synchronizing project prices:', error);
    throw error;
  }
}

export async function synchronizeBuildingPrices(buildingId: string): Promise<void> {
  try {
    // Get the building and its project
    const { data: building, error: buildingError } = await supabase
      .from('buildings')
      .select('*, project:projects(*)')
      .eq('id', buildingId)
      .single();

    if (buildingError) throw buildingError;

    if (building && building.project) {
      const projectRef = building.project as { id?: string } | null;
      if (projectRef?.id) {
        await synchronizeProjectPrices(projectRef.id);
      }
    }

  } catch (error) {
    console.error('Error synchronizing building prices:', error);
    throw error;
  }
}

// Status synchronization
export async function synchronizeBuildingStatus(buildingId: string): Promise<void> {
  try {
    // Get the building
    const { data: building, error: buildingError } = await supabase
      .from('buildings')
      .select('*')
      .eq('id', buildingId)
      .single();

    if (buildingError) throw buildingError;

    // In a real implementation, this would check unit availability
    // and update building status accordingly (e.g., "sold_out" if all units are sold)
    
    console.log(`Synchronizing status for building ${buildingId}`);

  } catch (error) {
    console.error('Error synchronizing building status:', error);
    throw error;
  }
}

// Hierarchy validation
export async function validateHierarchyChain(
  developerId?: string,
  projectId?: string,
  buildingId?: string
): Promise<{ isValid: boolean; errors: string[] }> {
  const errors: string[] = [];

  try {
    // Validate developer exists if provided
    if (developerId) {
      const { data: developer, error: devError } = await supabase
        .from('developers')
        .select('id')
        .eq('id', developerId)
        .single();

      if (devError || !developer) {
        errors.push(`Développeur ${developerId} n'existe pas`);
      }
    }

    // Validate project exists and is linked to developer if provided
    if (projectId) {
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('id, developer_id')
        .eq('id', projectId)
        .single();

      if (projectError || !project) {
        errors.push(`Projet ${projectId} n'existe pas`);
      } else if (developerId && project.developer_id !== developerId) {
        errors.push(`Projet ${projectId} n'est pas lié au développeur ${developerId}`);
      }
    }

    // Validate building exists and is linked to project if provided
    if (buildingId) {
      const { data: building, error: buildingError } = await supabase
        .from('buildings')
        .select('id, project_id')
        .eq('id', buildingId)
        .single();

      if (buildingError || !building) {
        errors.push(`Bâtiment ${buildingId} n'existe pas`);
      } else if (projectId && building.project_id !== projectId) {
        errors.push(`Bâtiment ${buildingId} n'est pas lié au projet ${projectId}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };

  } catch (error) {
    console.error('Error validating hierarchy chain:', error);
    return {
      isValid: false,
      errors: ['Erreur lors de la validation de la hiérarchie']
    };
  }
}

// Get hierarchy breadcrumb data
export async function getHierarchyBreadcrumb(
  projectId?: string,
  buildingId?: string
): Promise<{
  developer?: { id: string; name: string };
  project?: { id: string; title: string };
  building?: { id: string; name: string };
}> {
  let developer: { id: string; name: string } | undefined;
  let project: { id: string; title: string } | undefined;
  let building: { id: string; name: string } | undefined;

  try {
    // If building ID is provided, get building and its project with developer
    if (buildingId) {
      const { data: buildingData, error: buildingError } = await supabase
        .from('buildings')
        .select(`
          id,
          name,
          project:projects(
            id,
            title,
            developer:developers(id, name)
          )
        `)
        .eq('id', buildingId)
        .single();

      if (!buildingError && buildingData && !Array.isArray(buildingData) && typeof buildingData === 'object') {
        const bData = buildingData as {
          id: string;
          name?: string;
          building_name?: string;
          project?: {
            id?: string;
            title?: string;
            developer?: { id?: string; name?: string };
          };
        };
        building = { id: bData.id, name: bData.building_name || bData.name || 'Unknown Building' };
        const typedProjectData = bData.project;
        if (typedProjectData && typeof typedProjectData === 'object' && typedProjectData.id) {
          project = {
            id: typedProjectData.id,
            title: typedProjectData.title ?? ''
          };
          if (typedProjectData.developer && typeof typedProjectData.developer === 'object') {
            const developerData = typedProjectData.developer;
            if (developerData.id) {
              developer = {
                id: developerData.id,
                name: developerData.name ?? ''
              };
            }
          }
        }
      }
    }
    // If only project ID is provided, get project with developer
    else if (projectId) {
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select(`
          id,
          title,
          developer:developers(id, name)
        `)
        .eq('id', projectId)
        .single();

      if (!projectError && projectData) {
        project = { id: projectData.id, title: projectData.title ?? '' };
        if (projectData.developer && typeof projectData.developer === 'object') {
          const typedDeveloper = projectData.developer as { id?: string; name?: string };
          if (typedDeveloper.id) {
            developer = {
              id: typedDeveloper.id,
              name: typedDeveloper.name ?? ''
            };
          }
        }
      }
    }

    return { developer, project, building };

  } catch (error) {
    console.error('Error getting hierarchy breadcrumb:', error);
    return {};
  }
}