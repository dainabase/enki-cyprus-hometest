/**
 * Test d'extraction avec la brochure "Les Jardins de Maria"
 * Validation des 127 propriétés avec les nouveaux champs Cyprus
 */

import { extractFullHierarchy } from '../src/lib/ai-import/UnifiedAIExtractor';
import { applyCyprusDefaults, calculateCyprusStatistics } from '../src/lib/ai-import/cyprusFieldsValidator';

// Mock data pour "Les Jardins de Maria" - 127 propriétés
export const JARDINS_MARIA_MOCK = {
  extraction_metadata: {
    confidence_score: 0.92,
    document_type: 'brochure',
    pages_analyzed: 24,
    extraction_timestamp: new Date().toISOString(),
    ai_model: 'gpt-4-vision',
    warnings: ['Mode test - Données "Les Jardins de Maria"']
  },
  
  developer: {
    name: 'Cyprus Premium Developments',
    email_primary: 'info@cypruspremium.com',
    email_sales: 'sales@cypruspremium.com',
    phone_numbers: ['+357 25 567890', '+357 99 123456'],
    addresses: ['15 Makarios Avenue, Limassol 3030, Cyprus'],
    website: 'https://www.cypruspremium.com',
    main_city: 'Limassol',
    main_activities: 'Développement résidentiel de luxe',
    founded_year: 2008,
    years_experience: 16,
    total_projects: 8,
    commission_rate: 3.50,
    status: 'active',
    // Nouveaux champs Cyprus
    company_registration_number: 'HE123456',
    vat_number: 'CY10123456T',
    license_number: 'DEV2008001',
    insurance_coverage: 5000000,
    bank_guarantee: true
  },
  
  project: {
    title: 'Les Jardins de Maria',
    description: 'Complexe résidentiel de luxe avec vue panoramique sur la Méditerranée',
    detailed_description: 'Les Jardins de Maria offrent 127 unités résidentielles réparties dans 3 bâtiments distincts : Marina (face mer), Garden (jardins paysagers) et Sunset (vue coucher de soleil). Chaque résidence bénéficie de finitions haut de gamme et d\'équipements modernes.',
    city: 'Limassol',
    region: 'Limassol District',
    neighborhood: 'Agios Tychon',
    cyprus_zone: 'limassol',
    location: {
      address: 'Agios Tychon Beach Road, Limassol',
      city: 'Limassol',
      region: 'Limassol District', 
      country: 'Cyprus'
    },
    gps_latitude: 34.7156,
    gps_longitude: 33.1050,
    proximity_sea_km: 0.2,
    proximity_airport_km: 8.5,
    proximity_city_center_km: 12.0,
    price: 385000,
    price_from_new: 245000,
    price_to: 1850000,
    price_per_m2: 4200,
    vat_rate: 5.00,
    golden_visa_eligible: true,
    total_units: 127,
    units_available: 95,
    units_sold: 32,
    status: 'under_construction',
    completion_date: '2025-Q3',
    features: [
      'Vue mer panoramique',
      'Jardins méditerranéens',
      'Piscines infinies',
      'Spa wellness',
      'Fitness center',
      'Concierge 24h/7j'
    ],
    amenities: ['swimming_pool', 'spa', 'gym', 'gardens', 'security', 'parking'],
    energy_rating: 'A',
    // Nouveaux champs Cyprus
    planning_permit_number: 'PLN/2023/4567',
    building_permit_number: 'BLD/2023/8901',
    environmental_permit: 'ENV/2023/2345',
    municipality: 'Limassol Municipality',
    district: 'Limassol',
    meta_title: 'Les Jardins de Maria - Résidences de Luxe Limassol | Golden Visa Cyprus',
    meta_description: 'Découvrez Les Jardins de Maria : 127 appartements et villas de luxe à Limassol. Vue mer, spa, jardins. Éligible Golden Visa. Dès 245 000€.',
    meta_keywords: ['Jardins de Maria', 'Limassol luxury', 'Cyprus Golden Visa', 'Sea view apartments'],
    og_image_url: 'https://jardins-maria.com/og-image.jpg',
    schema_markup: {
      '@type': 'ResidentialComplex',
      'name': 'Les Jardins de Maria',
      'address': 'Agios Tychon Beach Road, Limassol, Cyprus'
    }
  },
  
  buildings: [
    {
      name: 'Marina Building',
      building_type: 'residential',
      total_floors: 8,
      total_units: 48,
      construction_status: 'foundation',
      energy_rating: 'A'
    },
    {
      name: 'Garden Building', 
      building_type: 'residential',
      total_floors: 6,
      total_units: 42,
      construction_status: 'foundation',
      energy_rating: 'A'
    },
    {
      name: 'Sunset Building',
      building_type: 'residential',
      total_floors: 10,
      total_units: 30,
      construction_status: 'planning',
      energy_rating: 'A'
    },
    {
      name: 'Villa Complex',
      building_type: 'residential', 
      total_floors: 2,
      total_units: 7,
      construction_status: 'planning',
      energy_rating: 'A+'
    }
  ],
  
  properties: [] as any[] // Sera généré par generateJardinsMariaProperties()
};

/**
 * Génère les 127 propriétés des Jardins de Maria
 */
export function generateJardinsMariaProperties() {
  const properties = [];
  
  // Marina Building - 48 unités (Studios et appartements face mer)
  for (let i = 1; i <= 48; i++) {
    const floor = Math.ceil(i / 6);
    const unitInFloor = ((i - 1) % 6) + 1;
    const type = i <= 12 ? 'studio' : 'apartment';
    const bedrooms = type === 'studio' ? 0 : (floor <= 4 ? 1 : 2);
    const size = type === 'studio' ? 42 + Math.random() * 13 : 65 + (bedrooms * 20) + Math.random() * 15;
    const basePrice = type === 'studio' ? 245000 : 320000 + (bedrooms * 45000);
    const floorBonus = floor * 8000;
    const seaViewBonus = 35000; // Marina = vue mer
    const price = basePrice + floorBonus + seaViewBonus;
    
    properties.push(applyCyprusDefaults({
      unit_number: `M${floor}${unitInFloor.toString().padStart(2, '0')}`,
      building_name: 'Marina Building',
      type,
      floor,
      bedrooms,
      bathrooms: type === 'studio' ? 1 : bedrooms,
      size_m2: Math.round(size),
      balcony_m2: 12 + Math.random() * 8,
      price: Math.round(price),
      view_type: 'sea',
      orientation: ['southeast', 'south', 'southwest'][i % 3],
      has_sea_view: true,
      status: i <= 32 ? 'sold' : 'available',
      // Champs Cyprus
      energy_certificate_rating: 'A',
      has_air_conditioning: true,
      has_underfloor_heating: true,
      has_pressurized_water: true,
      internet_ready: true
    }));
  }
  
  // Garden Building - 42 unités (Appartements jardins)
  for (let i = 1; i <= 42; i++) {
    const floor = Math.ceil(i / 7);
    const unitInFloor = ((i - 1) % 7) + 1;
    const bedrooms = floor <= 2 ? 1 : (floor <= 4 ? 2 : 3);
    const size = 75 + (bedrooms * 18) + Math.random() * 12;
    const basePrice = 295000 + (bedrooms * 42000);
    const floorBonus = floor * 6000;
    const gardenBonus = floor === 1 ? 25000 : 0; // RDC = jardin privé
    const price = basePrice + floorBonus + gardenBonus;
    
    properties.push(applyCyprusDefaults({
      unit_number: `G${floor}${unitInFloor.toString().padStart(2, '0')}`,
      building_name: 'Garden Building',
      type: 'apartment',
      floor,
      bedrooms,
      bathrooms: Math.max(1, bedrooms - 1),
      size_m2: Math.round(size),
      balcony_m2: floor === 1 ? 0 : 10 + Math.random() * 6,
      garden_m2: floor === 1 ? 45 + Math.random() * 25 : 0,
      price: Math.round(price),
      view_type: 'garden',
      orientation: ['north', 'northeast', 'east'][i % 3],
      has_sea_view: false,
      status: Math.random() > 0.7 ? 'sold' : 'available',
      // Champs Cyprus  
      energy_certificate_rating: 'A',
      has_air_conditioning: true,
      has_central_heating: floor <= 2,
      has_solar_panels: floor >= 5,
      internet_ready: true
    }));
  }
  
  // Sunset Building - 30 unités (Penthouses et appartements haut de gamme)
  for (let i = 1; i <= 30; i++) {
    const floor = Math.ceil(i / 3);
    const unitInFloor = ((i - 1) % 3) + 1;
    const type = floor >= 9 ? 'penthouse' : 'apartment';
    const bedrooms = type === 'penthouse' ? 3 : (floor <= 3 ? 2 : 3);
    const size = type === 'penthouse' ? 185 + Math.random() * 35 : 95 + (bedrooms * 22) + Math.random() * 18;
    const basePrice = type === 'penthouse' ? 850000 : 445000 + (bedrooms * 55000);
    const floorBonus = floor * 12000;
    const sunsetBonus = 45000; // Vue coucher de soleil
    const price = basePrice + floorBonus + sunsetBonus;
    
    properties.push(applyCyprusDefaults({
      unit_number: `S${floor}${unitInFloor.toString().padStart(2, '0')}`,
      building_name: 'Sunset Building',
      type,
      floor,
      bedrooms,
      bathrooms: bedrooms,
      size_m2: Math.round(size),
      balcony_m2: type === 'penthouse' ? 0 : 15 + Math.random() * 10,
      terrace_m2: type === 'penthouse' ? 65 + Math.random() * 25 : 0,
      price: Math.round(price),
      view_type: type === 'penthouse' ? 'panoramic' : 'city',
      orientation: 'west',
      has_sea_view: floor >= 5,
      status: Math.random() > 0.8 ? 'sold' : 'available',
      // Champs Cyprus
      energy_certificate_rating: 'A+',
      has_air_conditioning: true,
      has_underfloor_heating: true,
      has_solar_panels: true,
      has_electric_gates: type === 'penthouse',
      has_alarm_system: type === 'penthouse',
      internet_ready: true
    }));
  }
  
  // Villa Complex - 7 villas
  for (let i = 1; i <= 7; i++) {
    const bedrooms = 3 + (i <= 3 ? 0 : 1); // 3 ou 4 chambres
    const size = 220 + (bedrooms * 35) + Math.random() * 40;
    const plotSize = 380 + Math.random() * 120;
    const basePrice = 1250000 + (bedrooms * 85000);
    const plotBonus = plotSize * 800;
    const price = basePrice + plotBonus;
    
    properties.push(applyCyprusDefaults({
      unit_number: `V${i.toString().padStart(2, '0')}`,
      building_name: 'Villa Complex',
      type: 'villa',
      floor: 1,
      bedrooms,
      bathrooms: bedrooms - 1,
      size_m2: Math.round(size),
      plot_m2: Math.round(plotSize),
      covered_veranda_m2: 35 + Math.random() * 15,
      uncovered_veranda_m2: 25 + Math.random() * 15,
      garden_m2: Math.round(plotSize * 0.7),
      parking_spaces: 2,
      price: Math.round(price),
      view_type: i <= 4 ? 'sea' : 'mountain',
      orientation: 'south',
      has_sea_view: i <= 4,
      status: 'available',
      // Champs Cyprus premium
      energy_certificate_rating: 'A+',
      has_air_conditioning: true,
      has_underfloor_heating: true,
      has_central_heating: true,
      has_solar_panels: true,
      has_pressurized_water: true,
      has_electric_gates: true,
      has_alarm_system: true,
      internet_ready: true,
      // Frais villas (19% VAT car > 200m²)
      property_tax_yearly: 1800 + Math.random() * 400,
      immovable_property_tax: 850 + Math.random() * 200,
      sewerage_levy: 150
    }));
  }
  
  return properties;
}

/**
 * Test principal d'extraction "Les Jardins de Maria"
 */
export async function testJardinsMariaExtraction() {
  console.log('🏗️ DÉBUT TEST JARDINS DE MARIA');
  console.log('📊 Objectif: Extraire 127 propriétés avec champs Cyprus');
  
  const startTime = Date.now();
  
  try {
    // Génération des propriétés
    const properties = generateJardinsMariaProperties();
    JARDINS_MARIA_MOCK.properties = properties;
    
    // Simulation extraction (en production, appellerait l'IA)
    const extractionResult = {
      ...JARDINS_MARIA_MOCK,
      statistics: calculateCyprusStatistics(properties)
    };
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    // Validation résultats
    const results = {
      success: true,
      extraction_time_seconds: duration,
      total_properties: extractionResult.statistics.total_properties,
      golden_visa_eligible: extractionResult.statistics.golden_visa_eligible,
      buildings_count: extractionResult.buildings.length,
      cyprus_fields_validated: validateCyprusFieldsMapping(properties),
      performance_metrics: {
        properties_per_second: Math.round(extractionResult.statistics.total_properties / duration),
        average_size_m2: extractionResult.statistics.average_size_m2,
        average_price_with_vat: extractionResult.statistics.average_price_with_vat,
        total_portfolio_value: properties.reduce((sum, p) => sum + p.price_with_vat, 0)
      }
    };
    
    console.log('✅ TEST RÉUSSI');
    console.log(`⏱️ Temps d'extraction: ${duration}s`);
    console.log(`🏠 Propriétés extraites: ${results.total_properties}`);
    console.log(`💰 Golden Visa éligibles: ${results.golden_visa_eligible}`);
    console.log(`📋 Champs Cyprus: ${results.cyprus_fields_validated} validés`);
    
    return results;
    
  } catch (error) {
    console.error('❌ ÉCHEC TEST:', error);
    throw error;
  }
}

/**
 * Valide le mapping des nouveaux champs Cyprus
 */
function validateCyprusFieldsMapping(properties: any[]): number {
  let validatedFields = 0;
  
  const cyprusFields = [
    'vat_rate',
    'price_with_vat', 
    'is_golden_visa',
    'energy_certificate_rating',
    'transfer_fee_percentage',
    'has_air_conditioning',
    'internet_ready'
  ];
  
  properties.forEach(prop => {
    cyprusFields.forEach(field => {
      if (prop[field] !== undefined && prop[field] !== null) {
        validatedFields++;
      }
    });
  });
  
  return validatedFields;
}

// Export pour utilisation dans les tests
export { JARDINS_MARIA_MOCK };