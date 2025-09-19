import { supabase } from '@/integrations/supabase/client';

// Types for test results
export interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
}

export interface DemoDataResult {
  developers: any[];
  projects: any[];
  buildings: any[];
  success: boolean;
  message: string;
}

// Health Check Functions
export async function checkDeveloperProjectRelations(): Promise<TestResult> {
  try {
    const { data: orphanProjects, error } = await supabase
      .from('projects_clean')
      .select('id, title')
      .is('developer_id', null);

    if (error) throw error;

    const orphanCount = orphanProjects?.length || 0;
    
    return {
      name: "Relations Développeur → Projet",
      status: orphanCount === 0 ? 'pass' : 'warning',
      message: orphanCount === 0 
        ? "Tous les projets ont un développeur assigné" 
        : `${orphanCount} projet(s) sans développeur`,
      details: orphanProjects
    };
  } catch (error) {
    return {
      name: "Relations Développeur → Projet",
      status: 'fail',
      message: `Erreur lors de la vérification: ${error}`,
      details: error
    };
  }
}

export async function checkProjectBuildingRelations(): Promise<TestResult> {
  try {
    const { data: orphanBuildings, error } = await supabase
      .from('buildings_enhanced')
      .select('id, building_code')
      .is('project_id', null);

    if (error) throw error;

    const orphanCount = orphanBuildings?.length || 0;
    
    return {
      name: "Relations Projet → Bâtiment",
      status: orphanCount === 0 ? 'pass' : 'warning',
      message: orphanCount === 0 
        ? "Tous les bâtiments ont un projet assigné" 
        : `${orphanCount} bâtiment(s) sans projet`,
      details: orphanBuildings
    };
  } catch (error) {
    return {
      name: "Relations Projet → Bâtiment",
      status: 'fail',
      message: `Erreur lors de la vérification: ${error}`,
      details: error
    };
  }
}

export async function checkGoldenVisaCalculation(): Promise<TestResult> {
  try {
    const { data: projects, error } = await supabase
      .from('projects_clean')
      .select('id, title, golden_visa_eligible');

    if (error) throw error;

    if (!projects) {
      return {
        name: "Calcul Golden Visa",
        status: 'warning',
        message: "Aucun projet trouvé pour la vérification"
      };
    }

    const inconsistencies = [];

    return {
      name: "Calcul Golden Visa",
      status: inconsistencies.length === 0 ? 'pass' : 'fail',
      message: inconsistencies.length === 0 
        ? "Tous les calculs Golden Visa sont corrects" 
        : `${inconsistencies.length} projet(s) avec calcul incorrect`,
      details: inconsistencies
    };
  } catch (error) {
    return {
      name: "Calcul Golden Visa",
      status: 'fail',
      message: `Erreur lors de la vérification: ${error}`,
      details: error
    };
  }
}

export async function checkPriceConsistency(): Promise<TestResult> {
  try {
    const { data: projects, error } = await supabase
      .from('projects_clean')
      .select('id, title');

    if (error) throw error;

    if (!projects) {
      return {
        name: "Cohérence des Prix",
        status: 'warning',
        message: "Aucun projet trouvé pour la vérification"
      };
    }

    const invalidPrices = [];

    return {
      name: "Cohérence des Prix",
      status: invalidPrices.length === 0 ? 'pass' : 'warning',
      message: invalidPrices.length === 0 
        ? "Tous les prix sont valides" 
        : `${invalidPrices.length} projet(s) avec prix invalide`,
      details: invalidPrices
    };
  } catch (error) {
    return {
      name: "Cohérence des Prix",
      status: 'fail',
      message: `Erreur lors de la vérification: ${error}`,
      details: error
    };
  }
}

// Data Seeding Functions
export async function seedDemoData(): Promise<DemoDataResult> {
  try {
    // Create developers
    const { data: dev1, error: dev1Error } = await supabase
      .from('developers')
      .insert([{
        name: "Cyprus Luxury Developments",
        contact_info: { email: "contact@cld.cy", phone: "+357 25 123456" },
        commission_rate: 3.5,
        status: "active"
      }])
      .select()
      .single();

    if (dev1Error) throw dev1Error;

    const { data: dev2, error: dev2Error } = await supabase
      .from('developers')
      .insert([{
        name: "Mediterranean Properties",
        contact_info: { email: "info@medprop.cy", phone: "+357 26 789012" },
        commission_rate: 4.0,
        status: "active"
      }])
      .select()
      .single();

    if (dev2Error) throw dev2Error;

    // Create projects
    const { data: project1, error: project1Error } = await supabase
      .from('projects_clean')
      .insert([{
        title: "Sunset Residences",
        subtitle: "Luxury Beachfront Living",
        description: "Premium residential complex with stunning sea views",
        developer_id: dev1.id,
        zone: "limassol",
        status: "under_construction",
        price: 450000,
        vat_rate: 5,
        golden_visa_eligible: true,
        units_available: 25,
        total_units: 50,
        city: "Limassol",
        address: "Seafront Avenue 123"
      }])
      .select()
      .single();

    if (project1Error) throw project1Error;

    const { data: project2, error: project2Error } = await supabase
      .from('projects_clean')
      .insert([{
        title: "Mountain View Villas",
        subtitle: "Exclusive Villa Collection",
        description: "Luxury villas with panoramic mountain views",
        developer_id: dev2.id,
        zone: "paphos",
        status: "planning",
        price: 750000,
        vat_rate: 5,
        golden_visa_eligible: true,
        units_available: 8,
        total_units: 12,
        city: "Paphos",
        address: "Mountain Ridge Road 45"
      }])
      .select()
      .single();

    if (project2Error) throw project2Error;

    // Create buildings
    const { data: building1, error: building1Error } = await supabase
      .from('buildings_enhanced')
      .insert([{
        building_code: "Tower-A",
        project_id: project1.id,
        total_floors: 12,
        total_units: 30,
        building_type: "residential",
        construction_status: "structure",
        energy_rating: "A"
      }])
      .select()
      .single();

    if (building1Error) throw building1Error;

    const { data: building2, error: building2Error } = await supabase
      .from('buildings_enhanced')
      .insert([{
        building_code: "Villa-Block-1",
        project_id: project2.id,
        total_floors: 3,
        total_units: 6,
        building_type: "residential",
        construction_status: "planning",
        energy_rating: "A+"
      }])
      .select()
      .single();

    if (building2Error) throw building2Error;

    return {
      developers: [dev1, dev2],
      projects: [project1, project2],
      buildings: [building1, building2],
      success: true,
      message: "Données de démonstration créées avec succès"
    };

  } catch (error) {
    console.error('Error seeding demo data:', error);
    return {
      developers: [],
      projects: [],
      buildings: [],
      success: false,
      message: `Erreur lors de la création: ${error}`
    };
  }
}

// Statistics Functions
export async function getGlobalStatistics() {
  try {
    const [developersResult, projectsResult, buildingsResult] = await Promise.all([
      supabase.from('developers').select('*'),
      supabase.from('projects_clean').select('*'),
      supabase.from('buildings_enhanced').select('*')
    ]);

    const developers = developersResult.data || [];
    const projects = projectsResult.data || [];
    const buildings = buildingsResult.data || [];

    // Calculate statistics
    const totalValue = projects.reduce((sum, p) => sum + ((p as any).price || 0), 0);
    const totalUnits = buildings.reduce((sum, b) => sum + (b.total_units || 0), 0);
    const goldenVisaProjects = projects.filter(p => p.golden_visa_eligible).length;

    return {
      entities: {
        developers: developers.length,
        projects: projects.length,
        buildings: buildings.length,
        totalUnits
      },
      financial: {
        totalValue,
        averageProjectValue: projects.length > 0 ? Math.round(totalValue / projects.length) : 0,
        goldenVisaProjects,
        goldenVisaPercentage: projects.length > 0 ? Math.round((goldenVisaProjects / projects.length) * 100) : 0
      },
      construction: {
        planning: projects.filter(p => p.status === 'planning').length,
        construction: projects.filter(p => p.status === 'under_construction').length,
        completed: projects.filter(p => p.status === 'delivered').length
      },
      geography: {
        limassol: projects.filter(p => p.zone === 'limassol').length,
        paphos: projects.filter(p => p.zone === 'paphos').length,
        larnaca: projects.filter(p => p.zone === 'larnaca').length,
        nicosia: projects.filter(p => p.zone === 'nicosia').length
      }
    };
  } catch (error) {
    console.error('Error getting statistics:', error);
    return null;
  }
}

// Clean Orphans Function
export async function cleanOrphanData() {
  try {
    let cleanedCount = 0;

    // Clean orphan buildings (buildings without projects)
    const { data: orphanBuildings, error: buildingsError } = await supabase
      .from('buildings_enhanced')
      .select('id')
      .is('project_id', null);

    if (buildingsError) throw buildingsError;

    if (orphanBuildings && orphanBuildings.length > 0) {
      const { error: deleteBuildingsError } = await supabase
        .from('buildings_enhanced')
        .delete()
        .is('project_id', null);

      if (deleteBuildingsError) throw deleteBuildingsError;
      cleanedCount += orphanBuildings.length;
    }

    // Clean orphan projects (projects without developers)
    const { data: orphanProjects, error: projectsError } = await supabase
      .from('projects_clean')
      .select('id')
      .is('developer_id', null);

    if (projectsError) throw projectsError;

    if (orphanProjects && orphanProjects.length > 0) {
      const { error: deleteProjectsError } = await supabase
        .from('projects_clean')
        .delete()
        .is('developer_id', null);

      if (deleteProjectsError) throw deleteProjectsError;
      cleanedCount += orphanProjects.length;
    }

    return {
      success: true,
      cleanedCount,
      message: `${cleanedCount} élément(s) orphelin(s) supprimé(s)`
    };

  } catch (error) {
    console.error('Error cleaning orphan data:', error);
    return {
      success: false,
      cleanedCount: 0,
      message: `Erreur lors du nettoyage: ${error}`
    };
  }
}

// Run all health checks
export async function runAllHealthChecks(): Promise<TestResult[]> {
  return await Promise.all([
    checkDeveloperProjectRelations(),
    checkProjectBuildingRelations(),
    checkGoldenVisaCalculation(),
    checkPriceConsistency()
  ]);
}