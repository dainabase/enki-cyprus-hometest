import { z } from 'zod';

export const propertySchema = z.object({
  // STEP 1: IDENTIFICATION
  project_id: z.string().uuid("Sélectionnez un projet"),
  building_id: z.string().uuid().nullable().optional(),
  unit_number: z.string().min(1, "Numéro d'unité requis"),
  property_code: z.string().optional(),
  property_type: z.enum(['apartment', 'villa', 'penthouse', 'studio', 'townhouse', 'duplex', 'triplex', 'maisonette']),
  property_sub_type: z.string().optional(),
  property_status: z.enum(['available', 'reserved', 'sold', 'rented', 'unavailable']).default('available'),
  sale_type: z.enum(['sale', 'rent', 'both']).default('sale'),
  ownership_type: z.enum(['freehold', 'leasehold', 'shared_ownership']).default('freehold'),

  // STEP 2: CONFIGURATION & SURFACES
  bedrooms_count: z.number().min(0).max(20),
  bathrooms_count: z.number().min(0).max(20),
  wc_count: z.number().min(0).max(10).default(0),
  internal_area: z.number().min(1, "Surface interne requise"),
  covered_verandas: z.number().min(0).optional(),
  uncovered_verandas: z.number().min(0).optional(),
  private_garden_area: z.number().min(0).optional(),
  roof_garden_area: z.number().min(0).optional(),
  floor_number: z.number().min(-5).max(50).optional(),
  position_in_floor: z.string().optional(),
  orientation: z.enum(['north', 'south', 'east', 'west', 'north_east', 'north_west', 'south_east', 'south_west']).optional(),
  
  // Pièces additionnelles
  has_office: z.boolean().default(false),
  has_maid_room: z.boolean().default(false),
  has_dressing_room: z.boolean().default(false),
  has_playroom: z.boolean().default(false),
  has_wine_cellar: z.boolean().default(false),
  has_pantry: z.boolean().default(false),
  has_laundry_room: z.boolean().default(false),
  total_rooms: z.number().min(0).optional(),

  // STEP 3: ÉQUIPEMENTS & FINITIONS
  kitchen_type: z.enum(['separate', 'open', 'semi_open', 'kitchen_corner']).optional(),
  kitchen_brand: z.string().optional(),
  has_kitchen_appliances: z.boolean().default(false),
  appliances_list: z.array(z.string()).default([]),
  hvac_type: z.enum(['central_ac', 'split_units', 'vrf_system', 'underfloor_heating']).optional(),
  heating_type: z.enum(['electric', 'gas', 'solar', 'heat_pump', 'none']).optional(),
  flooring_type: z.enum(['tiles', 'marble', 'parquet', 'laminate', 'vinyl']).optional(),
  windows_type: z.enum(['aluminum', 'upvc', 'wooden']).optional(),
  doors_type: z.enum(['wooden', 'security', 'glass']).optional(),
  smart_home_features: z.array(z.string()).default([]),
  security_features: z.array(z.string()).default([]),
  
  // STEP 4: ESPACES EXTÉRIEURS
  balcony_count: z.number().min(0).default(0),
  balcony_area: z.number().min(0).optional(),
  terrace_count: z.number().min(0).default(0),
  terrace_area: z.number().min(0).optional(),
  has_private_garden: z.boolean().default(false),
  has_private_pool: z.boolean().default(false),
  pool_type: z.enum(['private', 'shared', 'communal']).optional(),
  parking_spaces: z.number().min(0).default(0),
  parking_type: z.enum(['garage', 'covered', 'uncovered']).optional(),
  storage_spaces: z.number().min(0).default(0),
  storage_area: z.number().min(0).optional(),
  view_type: z.array(z.enum(['sea', 'mountain', 'city', 'garden', 'pool', 'street'])).default([]),

  // STEP 5: PRIX & FINANCIER
  price_excluding_vat: z.number().min(1, "Prix requis"),
  vat_rate: z.number().min(0).max(100).default(5),
  commission_rate: z.number().min(0).max(100).default(5),
  original_price: z.number().min(0).optional(),
  current_price: z.number().min(0).optional(),
  deposit_percentage: z.number().min(0).max(100).default(30),
  reservation_fee: z.number().min(0).default(5000),
  payment_plan_available: z.boolean().default(false),
  payment_plan_details: z.record(z.any()).optional(),
  finance_available: z.boolean().default(false),
  minimum_cash_required: z.number().min(0).optional(),
  annual_property_tax: z.number().min(0).optional(),
  communal_fees_monthly: z.number().min(0).optional(),
  maintenance_fee_monthly: z.number().min(0).optional(),

  // STEP 6: DOCUMENTATION
  title_deed_status: z.enum(['available', 'pending', 'in_process', 'transferred']).default('pending'),
  planning_permit_number: z.string().optional(),
  building_permit_number: z.string().optional(),
  occupancy_certificate: z.string().optional(),
  energy_certificate_number: z.string().optional(),
  energy_rating: z.enum(['A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G']).optional(),
  cadastral_reference: z.string().optional(),
  internal_notes: z.string().optional(),
  public_description: z.string().optional()
}).refine(
  (data) => {
    // Validation Golden Visa automatique
    const priceIncludingVat = data.price_excluding_vat + (data.price_excluding_vat * data.vat_rate / 100);
    return priceIncludingVat >= 0;
  },
  {
    message: "Erreur dans le calcul du prix",
    path: ["price_excluding_vat"],
  }
);

export type PropertyFormData = z.infer<typeof propertySchema>;

export const propertyFormSteps = [
  {
    id: 'identification',
    title: 'Identification',
    icon: 'FileText',
    description: 'Projet, bâtiment, type de propriété'
  },
  {
    id: 'configuration',
    title: 'Configuration',
    icon: 'Home',
    description: 'Chambres, surfaces, pièces'
  },
  {
    id: 'equipment',
    title: 'Équipements',
    icon: 'Settings',
    description: 'Cuisine, finitions, smart home'
  },
  {
    id: 'outdoor',
    title: 'Espaces extérieurs',
    icon: 'Trees',
    description: 'Balcons, jardin, parking, vues'
  },
  {
    id: 'financial',
    title: 'Financier',
    icon: 'Euro',
    description: 'Prix, TVA, commissions, paiement'
  },
  {
    id: 'documentation',
    title: 'Documentation',
    icon: 'FileCheck',
    description: 'Titre de propriété, certificats'
  }
];