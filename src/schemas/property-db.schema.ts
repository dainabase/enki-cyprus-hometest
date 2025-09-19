import { z } from 'zod';

// Schéma exact basé sur la vraie table properties_final
export const propertyDBSchema = z.object({
  // IDs et relations
  id: z.string().uuid().optional(),
  project_id: z.string().uuid().optional(),
  building_id: z.string().uuid().optional(),
  
  // Identification de base
  unit_code: z.string().min(1, "Code unité requis"),
  property_type: z.string().optional(),
  floor_number: z.number().int().optional(),
  
  // Configuration principale
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  wc_separate: z.boolean().default(false),
  
  // Surfaces (tous en m²)
  internal_area_m2: z.number().min(0).optional(),
  covered_veranda_m2: z.number().min(0).optional(),
  uncovered_veranda_m2: z.number().min(0).optional(),
  garden_area_m2: z.number().min(0).optional(),
  roof_terrace_m2: z.number().min(0).optional(),
  storage_area_m2: z.number().min(0).optional(),
  total_covered_area_m2: z.number().min(0).optional(),
  
  // Prix et finances
  price: z.number().min(0).optional(),
  currency: z.string().default('EUR'),
  vat_rate: z.number().default(5),
  vat_amount: z.number().min(0).optional(),
  price_with_vat: z.number().min(0).optional(),
  price_per_m2: z.number().min(0).optional(),
  golden_visa_eligible: z.boolean().optional(),
  payment_plan: z.record(z.any()).optional(),
  reservation_fee: z.number().min(0).optional(),
  down_payment_percent: z.number().min(0).max(100).optional(),
  financing_available: z.boolean().default(false),
  bank_loan_eligible: z.boolean().default(false),
  special_offer: z.string().optional(),
  discount_percentage: z.number().min(0).max(100).optional(),
  
  // Caractéristiques
  view_type: z.string().optional(),
  orientation: z.string().optional(),
  has_balcony: z.boolean().default(false),
  has_terrace: z.boolean().default(false),
  has_garden: z.boolean().default(false),
  has_private_pool: z.boolean().default(false),
  has_jacuzzi: z.boolean().default(false),
  has_fireplace: z.boolean().default(false),
  has_parking_space: z.boolean().default(false),
  parking_spaces_count: z.number().int().min(0).default(0),
  has_storage_room: z.boolean().default(false),
  has_maid_room: z.boolean().default(false),
  
  // Cuisine et équipements
  kitchen_type: z.string().optional(),
  furniture_status: z.string().optional(),
  property_features: z.array(z.string()).default([]),
  
  // Statut et disponibilité
  status: z.string().default('available'),
  availability_date: z.string().optional(),
  reservation_expires: z.string().optional(),
  
  // Titre de propriété
  title_deed_status: z.string().optional(),
  title_deed_number: z.string().optional(),
  ownership_type: z.string().optional(),
  is_resale: z.boolean().default(false),
  previous_owners_count: z.number().int().min(0).default(0),
  title_deed_ready: z.boolean().default(false),
  planning_permit_number: z.string().optional(),
  building_permit_number: z.string().optional(),
  occupancy_certificate_number: z.string().optional(),
  
  // Champs manquants des anciens components (pour compatibilité temporaire)
  wc_count: z.number().int().optional(),
  internal_area: z.number().optional(), // alias pour internal_area_m2
  covered_verandas: z.number().optional(), // alias pour covered_veranda_m2
  uncovered_verandas: z.number().optional(), // alias pour uncovered_veranda_m2
  private_garden_area: z.number().optional(), // alias pour garden_area_m2
  position_in_floor: z.string().optional(),
  has_office: z.boolean().optional(),
  has_dressing_room: z.boolean().optional(),
  has_laundry_room: z.boolean().optional(),
  has_playroom: z.boolean().optional(),
  has_wine_cellar: z.boolean().optional(),
  has_pantry: z.boolean().optional(),
  cadastral_reference: z.string().optional(),
  occupancy_certificate: z.string().optional(),
  energy_certificate_number: z.string().optional(),
  energy_rating: z.string().optional(),
  public_description: z.string().optional(),
  internal_notes: z.string().optional(),
  appliances_list: z.array(z.string()).optional(),
  smart_home_features: z.array(z.string()).optional(),
  
  // Champs Equipment Step manquants
  kitchen_brand: z.string().optional(),
  has_kitchen_appliances: z.boolean().optional(),
  hvac_type: z.string().optional(),
  heating_type: z.string().optional(),
  flooring_type: z.string().optional(),
  windows_type: z.string().optional(),
  doors_type: z.string().optional(),
  
  // Champs Financial Step manquants
  price_excluding_vat: z.number().optional(),
  commission_rate: z.number().optional(),
  deposit_percentage: z.number().optional(),
  original_price: z.number().optional(),
  payment_plan_available: z.boolean().optional(),
  finance_available: z.boolean().optional(),
  minimum_cash_required: z.number().optional(),
  annual_property_tax: z.number().optional(),
  communal_fees_monthly: z.number().optional(),
  maintenance_fee_monthly: z.number().optional(),
  
  // Champs Outdoor Step manquants
  balcony_count: z.number().optional(),
  balcony_area: z.number().optional(),
  terrace_count: z.number().optional(),
  terrace_area: z.number().optional(),
  has_private_garden: z.boolean().optional(),
  pool_type: z.string().optional(),
  parking_spaces: z.number().optional(),
  parking_type: z.string().optional(),
  storage_spaces: z.number().optional(),
  storage_area: z.number().optional(),
  
  // PropertyForm.tsx champs manquants
  unit_number: z.string().optional(),
  property_status: z.string().optional(),
  bedrooms_count: z.number().optional(),
  bathrooms_count: z.number().optional(),
  
  // Métadonnées
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type PropertyDBData = z.infer<typeof propertyDBSchema>;

// Steps pour le formulaire
export const propertyFormSteps = [
  {
    id: 'identification',
    title: 'Identification',
    description: 'Projet, bâtiment, code unité'
  },
  {
    id: 'configuration', 
    title: 'Configuration',
    description: 'Pièces et surfaces'
  },
  {
    id: 'financial',
    title: 'Prix',
    description: 'Prix et conditions financières'
  }
];