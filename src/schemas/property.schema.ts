import { z } from 'zod';

export const propertySchema = z.object({
  // STEP 1: IDENTIFICATION (using exact DB field names)
  project_id: z.string().uuid("Sélectionnez un projet"),
  building_id: z.string().nullable().optional()
    .transform(val => val === '' ? null : val),
  unit_code: z.string().min(1, "Code d'unité requis"),
  property_type: z.enum(['apartment', 'villa', 'penthouse', 'studio', 'townhouse', 'duplex', 'triplex', 'maisonette']),
  status: z.enum(['available', 'reserved', 'sold', 'rented', 'unavailable']).default('available'),
  ownership_type: z.enum(['freehold', 'leasehold', 'shared_ownership']).optional(),
  floor_number: z.number().min(-5).max(50).optional(),

  // STEP 2: CONFIGURATION & SURFACES (using exact DB field names)
  bedrooms: z.number().min(0).max(20),
  bathrooms: z.number().min(0).max(20),
  internal_area_m2: z.number().min(1, "Surface interne requise"),
  covered_veranda_m2: z.number().min(0).optional(),
  uncovered_veranda_m2: z.number().min(0).optional(),
  garden_area_m2: z.number().min(0).optional(),
  roof_terrace_m2: z.number().min(0).optional(),
  total_covered_area_m2: z.number().min(0).optional(),
  storage_area_m2: z.number().min(0).optional(),
  orientation: z.enum(['north', 'south', 'east', 'west', 'north_east', 'north_west', 'south_east', 'south_west']).optional(),

  // Features (exact DB field names)
  has_maid_room: z.boolean().default(false),
  has_jacuzzi: z.boolean().default(false),
  has_fireplace: z.boolean().default(false),
  has_storage_room: z.boolean().default(false),
  has_balcony: z.boolean().default(false),
  has_terrace: z.boolean().default(false),
  has_garden: z.boolean().default(false),
  has_private_pool: z.boolean().default(false),
  has_parking_space: z.boolean().default(false),

  // STEP 3: ÉQUIPEMENTS & FINITIONS (exact DB field names)
  kitchen_type: z.string().optional(),
  property_features: z.array(z.string()).default([]),

  // STEP 4: ESPACES EXTÉRIEURS (exact DB field names)
  parking_spaces_count: z.number().min(0).default(0),

  // STEP 5: PRIX & FINANCIER (exact DB field names)
  price: z.number().min(1, "Prix requis"),
  price_per_m2: z.number().min(0).optional(),
  price_with_vat: z.number().min(0).optional(),
  down_payment_percent: z.number().min(0).max(100).default(30),
  reservation_fee: z.number().min(0).default(5000),
  financing_available: z.boolean().default(false),
  common_expenses_monthly: z.number().min(0).optional(),
  management_fee_monthly: z.number().min(0).optional(),
  golden_visa_eligible: z.boolean().default(false),
  rental_potential_monthly: z.number().min(0).optional(),
  rental_yield_percent: z.number().min(0).optional(),
  payment_plan: z.record(z.any()).optional(),

  // STEP 6: DOCUMENTATION (exact DB field names)
  title_deed_status: z.string().optional(),
  title_deed_number: z.string().optional(),
  planning_permit_number: z.string().optional(),
  building_permit_number: z.string().optional(),
  occupancy_certificate_number: z.string().optional(),
  furniture_status: z.string().optional(),

  // Additional DB fields
  currency: z.string().optional(),
  availability_date: z.string().optional(),
  first_published_at: z.string().optional(),
  last_viewed_at: z.string().optional(),
  view_type: z.string().optional(),
  is_resale: z.boolean().optional(),
  bank_loan_eligible: z.boolean().optional(),
  legal_check_completed: z.boolean().optional(),
  title_deed_ready: z.boolean().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
});

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