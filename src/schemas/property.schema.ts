import { z } from 'zod';

// Schema simple correspondant aux champs réels de properties_test
export const propertySimpleSchema = z.object({
  project_id: z.string().uuid("Sélectionnez un projet"),
  building_id: z.string().uuid("Sélectionnez un bâtiment"),
  property_type: z.string().min(1, "Type de propriété requis"),
  unit_number: z.string().min(1, "Numéro d'unité requis"),
  floor: z.number().min(-5).max(50).default(1),
  bedrooms: z.number().min(0).max(20).default(1),
  bathrooms: z.number().min(0).max(20).default(1),
  surface_area: z.number().min(0).optional(),
  price: z.number().min(0).optional(),
  status: z.string().optional().default('available')
});

// Schema complet pour le formulaire avec tous les champs possibles
export const propertySchema = z.object({
  // Champs de base (correspondent à la DB)
  project_id: z.string().uuid("Sélectionnez un projet"),
  building_id: z.string().uuid("Sélectionnez un bâtiment"),
  property_type: z.enum(['apartment', 'villa', 'penthouse', 'studio', 'townhouse', 'duplex', 'triplex', 'maisonette']),
  unit_number: z.string().min(1, "Numéro d'unité requis"),
  floor_number: z.number().min(-5).max(50).default(1), // Sera mappé vers 'floor' dans la DB
  bedrooms: z.number().min(0).max(20).default(1),
  bathrooms: z.number().min(0).max(20).default(1),
  surface_area: z.number().min(0).optional(),
  price: z.number().min(0).optional(),
  status: z.string().optional().default('available'),
  
  // Champs additionnels pour le formulaire (pas sauvés en DB pour l'instant)
  furnished: z.boolean().default(false),
  balcony: z.boolean().default(false),
  terrace: z.boolean().default(false),
  parking: z.boolean().default(false),
  storage: z.boolean().default(false),
  air_conditioning: z.boolean().default(false),
  heating: z.boolean().default(false),
  sea_view: z.boolean().default(false),
  mountain_view: z.boolean().default(false),
  city_view: z.boolean().default(false),
  garden_view: z.boolean().default(false),
  pool_view: z.boolean().default(false),
  elevator: z.boolean().default(false),
  fireplace: z.boolean().default(false),
  garden: z.boolean().default(false),
  swimming_pool: z.boolean().default(false),
  gym: z.boolean().default(false),
  spa: z.boolean().default(false),
  concierge: z.boolean().default(false),
  security: z.boolean().default(false),
  gated_community: z.boolean().default(false),
  golf_course: z.boolean().default(false),
  tennis_court: z.boolean().default(false),
  marina: z.boolean().default(false),
  shopping_center: z.boolean().default(false),
  restaurants: z.boolean().default(false),
  schools: z.boolean().default(false),
  hospitals: z.boolean().default(false),
  public_transport: z.boolean().default(false),
  highway_access: z.boolean().default(false),
  airport_proximity: z.boolean().default(false),
  finance_available: z.boolean().default(false),
  title_deed_status: z.string().default('pending'),
  has_office: z.boolean().default(false),
  has_maid_room: z.boolean().default(false),
  has_dressing_room: z.boolean().default(false),
  has_playroom: z.boolean().default(false),
  has_wine_cellar: z.boolean().default(false),
  has_pantry: z.boolean().default(false),
  has_laundry_room: z.boolean().default(false),
  has_private_garden: z.boolean().default(false),
  has_private_pool: z.boolean().default(false),
  balcony_count: z.number().min(0).default(0),
  terrace_count: z.number().min(0).default(0),
  parking_spaces: z.number().min(0).default(0),
  storage_spaces: z.number().min(0).default(0),
  appliances_list: z.array(z.string()).default([]),
  smart_home_features: z.array(z.string()).default([]),
  security_features: z.array(z.string()).default([]),
  view_type: z.array(z.string()).default([])
});

export type PropertyFormData = z.infer<typeof propertySchema>;
export type PropertySimpleData = z.infer<typeof propertySimpleSchema>;