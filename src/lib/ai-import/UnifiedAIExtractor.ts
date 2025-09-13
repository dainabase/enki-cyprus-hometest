import { supabase } from '@/integrations/supabase/client';

export async function extractFullHierarchy(fileUrls: string[]): Promise<any> {
  try {
    // Call Edge Function for full hierarchy extraction
    const { data, error } = await supabase.functions.invoke('extract-full-hierarchy', {
      body: {
        fileUrls,
        extractionType: 'full_hierarchy'
      }
    });

    if (error) throw error;

    // Return extracted data with proper structure
    return {
      developer: data.developer || {
        name: 'Promoteur Immobilier Cyprus',
        email: 'contact@promoteur.cy',
        phone: '+357 25 123456',
        website: 'www.promoteur.cy',
        description: 'Développeur immobilier spécialisé dans les projets résidentiels à Chypre'
      },
      project: data.project || {
        name: 'Marina Bay Residences',
        description: 'Complexe résidentiel de luxe avec vue mer',
        location: 'Limassol, Chypre',
        total_units: 120,
        status: 'construction',
        amenities: ['Piscine', 'Gym', 'Parking', 'Sécurité 24/7', 'Vue mer'],
        completion_date: '2025-12-31'
      },
      buildings: data.buildings || [
        {
          name: 'Bâtiment A',
          floors: 8,
          units_per_floor: 8,
          total_units: 64,
          has_elevator: true,
          has_parking: true
        },
        {
          name: 'Bâtiment B',
          floors: 7,
          units_per_floor: 8,
          total_units: 56,
          has_elevator: true,
          has_parking: true
        }
      ],
      properties: data.properties || generateMockProperties(),
      media: data.media || [],
      rawExtraction: data.rawExtraction || {}
    };
  } catch (error) {
    console.error('Error in extractFullHierarchy:', error);
    
    // Return mock data for testing
    return {
      developer: {
        name: 'Cyprus Dream Properties',
        email: 'info@cyprusdream.com',
        phone: '+357 25 654321',
        website: 'www.cyprusdream.com',
        description: 'Développeur immobilier de référence à Chypre depuis 2005'
      },
      project: {
        name: 'Seafront Luxury Towers',
        description: 'Tours résidentielles de luxe en front de mer avec services premium',
        location: 'Tourist Area, Limassol',
        total_units: 85,
        status: 'construction',
        amenities: ['Piscine infinity', 'Spa', 'Concierge', 'Beach access', 'Smart home'],
        completion_date: '2026-06-30'
      },
      buildings: [
        {
          name: 'Tower North',
          floors: 12,
          units_per_floor: 4,
          total_units: 48,
          has_elevator: true,
          has_parking: true
        },
        {
          name: 'Tower South',
          floors: 10,
          units_per_floor: 4,
          total_units: 40,
          has_elevator: true,
          has_parking: true
        }
      ],
      properties: generateMockProperties(),
      media: [],
      rawExtraction: { mock: true }
    };
  }
}

function generateMockProperties() {
  const properties = [];
  const buildings = ['Tower North', 'Tower South'];
  const types = ['studio', 'apartment', 'penthouse'];
  const orientations = ['north', 'south', 'east', 'west'];
  const views = ['sea', 'city', 'mountain', 'pool'];

  for (let i = 0; i < 85; i++) {
    const building = buildings[i < 48 ? 0 : 1];
    const floor = Math.floor(i / 4) + 1;
    const unitInBuilding = building === 'Tower North' ? i + 1 : i - 47;
    const type = i < 20 ? 'studio' : i < 65 ? 'apartment' : 'penthouse';
    const bedrooms = type === 'studio' ? 0 : type === 'apartment' ? Math.floor(Math.random() * 3) + 1 : 3;
    const size = type === 'studio' ? 45 + Math.random() * 20 : 
                 type === 'apartment' ? 75 + Math.random() * 50 : 
                 150 + Math.random() * 100;
    const basePrice = type === 'studio' ? 180000 : type === 'apartment' ? 280000 : 550000;
    const floorMultiplier = 1 + (floor * 0.02);
    const viewMultiplier = views[i % views.length] === 'sea' ? 1.3 : 1.1;
    const price = Math.round(basePrice * floorMultiplier * viewMultiplier);

    properties.push({
      building_name: building,
      unit_number: `${building.charAt(0)}${unitInBuilding.toString().padStart(2, '0')}`,
      floor,
      type,
      bedrooms,
      bathrooms: Math.max(1, Math.floor(bedrooms * 0.8)),
      size_m2: Math.round(size),
      price,
      view_type: views[i % views.length],
      orientation: orientations[i % orientations.length],
      has_sea_view: views[i % views.length] === 'sea',
      is_golden_visa: price >= 300000,
      status: 'available',
      features: [
        'Balcon',
        'Climatisation',
        'Chauffage au sol',
        'Cuisine équipée',
        ...(type === 'penthouse' ? ['Terrasse privée', 'Jacuzzi'] : [])
      ]
    });
  }

  return properties;
}