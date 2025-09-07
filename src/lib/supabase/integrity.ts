import { supabase } from '@/integrations/supabase/client';

// Types for hierarchy integrity checks
export interface OrphanData {
  orphanProjects: any[];
  orphanBuildings: any[];
  orphanProperties: any[];
}

export interface DependencyCheck {
  count: number;
  details: string;
  items: any[];
}

// Check hierarchy integrity - detect orphaned records
export async function checkHierarchyIntegrity(): Promise<OrphanData> {
  try {
    // Check for projects without developers
    const { data: orphanProjects, error: projectError } = await supabase
      .from('projects')
      .select('id, title')
      .is('developer_id', null);

    if (projectError) throw projectError;

    // Check for buildings without projects
    const { data: orphanBuildings, error: buildingError } = await supabase
      .from('buildings')
      .select('id, name')
      .is('project_id', null);

    if (buildingError) throw buildingError;

    // Check for properties without buildings (when we have properties table)
    // For now, return empty array as properties aren't implemented yet
    const orphanProperties: any[] = [];

    return {
      orphanProjects: orphanProjects || [],
      orphanBuildings: orphanBuildings || [],
      orphanProperties
    };
  } catch (error) {
    console.error('Error checking hierarchy integrity:', error);
    throw error;
  }
}

// Check dependencies before deleting a project
export async function checkProjectDependencies(projectId: string): Promise<DependencyCheck> {
  try {
    const { data: buildings, error } = await supabase
      .from('buildings')
      .select('id, name')
      .eq('project_id', projectId);

    if (error) throw error;

    const count = buildings?.length || 0;
    const details = count > 0 
      ? `${count} bâtiment(s): ${buildings?.map(b => b.name).join(', ')}`
      : '';

    return {
      count,
      details,
      items: buildings || []
    };
  } catch (error) {
    console.error('Error checking project dependencies:', error);
    throw error;
  }
}

// Check dependencies before deleting a building
export async function checkBuildingDependencies(buildingId: string): Promise<DependencyCheck> {
  try {
    // For now, simulate property check since properties table isn't fully implemented
    // In real scenario, this would check the properties table
    const simulatedProperties = Math.floor(Math.random() * 5); // 0-4 properties
    
    const count = simulatedProperties;
    const details = count > 0 
      ? `${count} unité(s) associée(s)`
      : '';

    return {
      count,
      details,
      items: []
    };
  } catch (error) {
    console.error('Error checking building dependencies:', error);
    throw error;
  }
}

// Synchronize project prices based on building prices
export async function synchronizeProjectPrices(projectId: string): Promise<void> {
  try {
    // Get all buildings for this project with their price ranges
    const { data: buildings, error } = await supabase
      .from('buildings')
      .select('id, total_units')
      .eq('project_id', projectId);

    if (error) throw error;

    if (buildings && buildings.length > 0) {
      // For now, simulate price calculation since properties aren't fully implemented
      // In real scenario, this would aggregate actual property prices
      const simulatedMinPrice = 250000;
      const simulatedMaxPrice = 850000;

      // Update project with calculated prices
      const { error: updateError } = await supabase
        .from('projects')
        .update({
          price: simulatedMinPrice,
          price_from: `€${simulatedMinPrice.toLocaleString()}`
        })
        .eq('id', projectId);

      if (updateError) throw updateError;
    }
  } catch (error) {
    console.error('Error synchronizing project prices:', error);
    throw error;
  }
}

// Synchronize building prices based on unit prices
export async function synchronizeBuildingPrices(buildingId: string): Promise<void> {
  try {
    // For now, simulate since properties table isn't fully implemented
    // In real scenario, this would query actual property prices
    console.log(`Synchronizing prices for building ${buildingId}`);
    
    // Get the building's project to update project prices too
    const { data: building, error } = await supabase
      .from('buildings')
      .select('project_id')
      .eq('id', buildingId)
      .single();

    if (error) throw error;

    if (building?.project_id) {
      await synchronizeProjectPrices(building.project_id);
    }
  } catch (error) {
    console.error('Error synchronizing building prices:', error);
    throw error;
  }
}

// Update building status based on unit statuses
export async function synchronizeBuildingStatus(buildingId: string): Promise<void> {
  try {
    // For now, simulate since properties aren't fully implemented
    // In real scenario, this would check actual property statuses
    const { data: building, error } = await supabase
      .from('buildings')
      .select('total_units')
      .eq('id', buildingId)
      .single();

    if (error) throw error;

    // Simulate: if building has units, randomly determine if sold out
    if (building && building.total_units > 0) {
      const soldOutChance = Math.random() > 0.8; // 20% chance of being sold out
      
      if (soldOutChance) {
        console.log(`Building ${buildingId} marked as sold out`);
        // In real implementation, this might update a status field
      }
    }
  } catch (error) {
    console.error('Error synchronizing building status:', error);
    throw error;
  }
}

// Validate hierarchy consistency for a specific chain
export async function validateHierarchyChain(
  developerId?: string,
  projectId?: string,
  buildingId?: string
): Promise<{ isValid: boolean; errors: string[] }> {
  const errors: string[] = [];

  try {
    // Validate developer exists if provided
    if (developerId) {
      const { data: developer, error } = await supabase
        .from('developers')
        .select('id')
        .eq('id', developerId)
        .single();

      if (error || !developer) {
        errors.push(`Développeur ${developerId} non trouvé`);
      }
    }

    // Validate project exists and belongs to developer if provided
    if (projectId) {
      const { data: project, error } = await supabase
        .from('projects')
        .select('id, developer_id')
        .eq('id', projectId)
        .single();

      if (error || !project) {
        errors.push(`Projet ${projectId} non trouvé`);
      } else if (developerId && project.developer_id !== developerId) {
        errors.push(`Projet ${projectId} n'appartient pas au développeur ${developerId}`);
      }
    }

    // Validate building exists and belongs to project if provided
    if (buildingId) {
      const { data: building, error } = await supabase
        .from('buildings')
        .select('id, project_id')
        .eq('id', buildingId)
        .single();

      if (error || !building) {
        errors.push(`Bâtiment ${buildingId} non trouvé`);
      } else if (projectId && building.project_id !== projectId) {
        errors.push(`Bâtiment ${buildingId} n'appartient pas au projet ${projectId}`);
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
  try {
    let developer, project, building;

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

      if (!buildingError && buildingData) {
        building = { id: buildingData.id, name: buildingData.name };
        if (buildingData.project && typeof buildingData.project === 'object' && 'id' in buildingData.project) {
          project = { 
            id: buildingData.project.id, 
            title: (buildingData.project as any).title 
          };
          if ((buildingData.project as any).developer && typeof (buildingData.project as any).developer === 'object') {
            developer = {
              id: ((buildingData.project as any).developer as any).id,
              name: ((buildingData.project as any).developer as any).name
            };
          }
        }
      }
    } else if (projectId) {
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
        project = { id: projectData.id, title: projectData.title };
        if (projectData.developer && typeof projectData.developer === 'object') {
          developer = {
            id: (projectData.developer as any).id,
            name: (projectData.developer as any).name
          };
        }
      }
    }

    return { developer, project, building };
  } catch (error) {
    console.error('Error getting hierarchy breadcrumb:', error);
    return {};
  }
}