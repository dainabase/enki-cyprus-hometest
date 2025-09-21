import { supabase } from '@/integrations/supabase/client';

export interface TestDataResult {
  developer?: any;
  project?: any;
  buildings?: any[];
  success: boolean;
  message: string;
  details?: {
    totalUnits: number;
    apartments: number;
    houses: number;
  };
}

export const createCronaGroupTestData = async (): Promise<TestDataResult> => {
  console.log('🏗️ Création des données test Crona Groupe...');

  try {
    // 1. Créer le développeur Crona Groupe
    console.log('📝 Création du développeur Crona Groupe...');
    const { data: developer, error: devError } = await supabase
      .from('developers')
      .insert([{
        name: 'Crona Groupe',
        contact_info: {
          email: 'contact@crona-groupe.com',
          phone: '+357-25-123456',
          address: 'Limassol Marina, Limassol, Cyprus',
          website: 'https://crona-groupe.com'
        },
        status: 'active',
        commission_rate: 3.5,
        website: 'https://crona-groupe.com',
        logo: null
      }])
      .select()
      .single();

    if (devError) {
      console.error('❌ Erreur création développeur:', devError);
      throw devError;
    }
    console.log('✅ Développeur créé:', developer.name);

    // 2. Créer le projet Square Garden
    console.log('🏢 Création du projet Square Garden...');
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert([{
        title: 'Square Garden',
        subtitle: 'Luxury Residential Complex',
        description: 'Un complexe résidentiel de luxe au cœur de Limassol, offrant appartements modernes et maisons familiales avec jardins privés.',
        detailed_description: 'Square Garden représente l\'excellence de l\'immobilier chypriote. Ce projet exclusif combine architecture contemporaine et espaces verts, créant un environnement de vie exceptionnel. Chaque unité est conçue avec des matériaux haut de gamme et des finitions luxueuses.',
        price_from: 280000,
        golden_visa_eligible: true, // Will be auto-set by trigger
        developer_id: developer.id,
        cyprus_zone: 'limassol',
        city: 'Limassol',
        region: 'Limassol',
        neighborhood: 'Marina',
        full_address: 'Limassol Marina District',
        gps_latitude: 34.6851,
        gps_longitude: 33.0439,
        status: 'under_construction',
        completion_date: '2025-06-30',
        units_available: 24, // 20 appartements + 4 maisons
        total_units: 24,
        units_sold: 0,
        features: [
          'Jardins privés',
          'Piscine commune',
          'Salle de sport',
          'Parking souterrain',
          'Sécurité 24h/24',
          'Concierge'
        ],
        amenities: [
          'Swimming Pool',
          'Gym & Fitness',
          'Private Gardens',
          'Underground Parking',
          'Security System',
          'Concierge Service'
        ],
        photos: [],
        plans: [],
        vat_rate: 5.00,
        project_status: 'under_construction',
        construction_phase: 'structure',
        title_deed_status: 'pending'
      }])
      .select()
      .single();

    if (projectError) {
      console.error('❌ Erreur création projet:', projectError);
      throw projectError;
    }
    console.log('✅ Projet créé:', project.title);

    // 3. Créer les bâtiments
    console.log('🏠 Création des bâtiments...');
    
    // Bâtiment A: 20 Appartements
    const apartmentBuilding = {
      building_name: 'Square Garden - Building A (Apartments)',
      building_code: 'SQG-A',
      project_id: project.id,
      building_type: 'residential',
      construction_status: 'structure',
      total_floors: 5,
      total_units: 20,
      energy_rating: 'A'
    };

    // Bâtiment B: 4 Maisons
    const houseBuilding = {
      building_name: 'Square Garden - Building B (Houses)',
      building_code: 'SQG-B',
      project_id: project.id,
      building_type: 'residential',
      construction_status: 'structure',
      total_floors: 2,
      total_units: 4,
      energy_rating: 'A'
    };

    const { data: buildings, error: buildingError } = await supabase
      .from('buildings')
      .insert([apartmentBuilding, houseBuilding])
      .select();

    if (buildingError) {
      console.error('❌ Erreur création bâtiments:', buildingError);
      throw buildingError;
    }
    console.log('✅ Bâtiments créés:', buildings.length);

    const totalUnits = buildings.reduce((sum, b) => sum + b.total_units, 0);
    
    console.log('🎉 Données test Crona Groupe créées avec succès!');
    console.log(`📊 Résumé:
    - Développeur: ${developer.name}
    - Projet: ${project.title}
    - Bâtiments: ${buildings.length}
    - Total unités: ${totalUnits} (20 appartements + 4 maisons)
    - Golden Visa: ${project.golden_visa_eligible ? 'Oui' : 'Non'}
    - Statut: ${project.status}
    `);

    return {
      developer,
      project,
      buildings,
      success: true,
      message: 'Données test Crona Groupe créées avec succès',
      details: {
        totalUnits,
        apartments: 20,
        houses: 4
      }
    };

  } catch (error) {
    console.error('💥 Erreur lors de la création des données test:', error);
    return {
      success: false,
      message: `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
    };
  }
};

// Test de validation des données créées
export const validateCronaGroupData = async () => {
  console.log('🔍 Validation des données Crona Groupe...');

  try {
    // Vérifier le développeur
    const { data: developer } = await supabase
      .from('developers')
      .select('*')
      .eq('name', 'Crona Groupe')
      .single();

    if (!developer) {
      throw new Error('Développeur Crona Groupe non trouvé');
    }

    // Vérifier le projet
    const { data: project } = await supabase
      .from('projects')
      .select('*')
      .eq('title', 'Square Garden')
      .eq('developer_id', developer.id)
      .single();

    if (!project) {
      throw new Error('Projet Square Garden non trouvé');
    }

    // Vérifier les bâtiments
    const { data: buildings } = await supabase
      .from('buildings')
      .select('*')
      .eq('project_id', project.id);

    if (!buildings || buildings.length !== 2) {
      throw new Error(`Nombre de bâtiments incorrect: ${buildings?.length || 0} au lieu de 2`);
    }

    // Vérifier le total des unités
    const totalUnits = buildings.reduce((sum, b) => sum + b.total_units, 0);
    if (totalUnits !== 24) {
      throw new Error(`Total unités incorrect: ${totalUnits} au lieu de 24`);
    }

    // Vérifier Golden Visa
    if (!project.golden_visa_eligible) {
      console.warn('⚠️ Golden Visa non activé (prix >= 300k mais flag false)');
    }

    console.log('✅ Validation réussie - Toutes les données sont correctes');
    return {
      success: true,
      developer,
      project,
      buildings,
      details: {
        totalUnits,
        apartments: buildings.find(b => b.building_name.includes('Apartments'))?.total_units || 0,
        houses: buildings.find(b => b.building_name.includes('Houses'))?.total_units || 0
      }
    };

  } catch (error) {
    console.error('❌ Erreur de validation:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erreur de validation'
    };
  }
};

// Fonction pour nettoyer les données test
export const cleanupCronaGroupData = async () => {
  console.log('🧹 Nettoyage des données test Crona Groupe...');

  try {
    // Supprimer le développeur (cascade supprimera projets et bâtiments)
    const { error } = await supabase
      .from('developers')
      .delete()
      .eq('name', 'Crona Groupe');

    if (error) throw error;

    console.log('✅ Données test nettoyées');
    return { success: true };

  } catch (error) {
    console.error('❌ Erreur nettoyage:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Erreur' };
  }
};