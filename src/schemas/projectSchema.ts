import { z } from 'zod';

export const projectSchema = z.object({
  // BASICS
  title: z.string().min(3, "Minimum 3 caractères"),
  project_code: z.string().optional(),
  developer_id: z.string().uuid("Sélectionnez un développeur"),
  property_category: z.enum(['residential', 'commercial', 'mixed', 'industrial']),
  property_sub_type: z.enum(['villa', 'apartment', 'penthouse', 'townhouse', 'studio', 'duplex', 'office', 'retail', 'warehouse']),
  project_phase: z.enum(['off-plan', 'under-construction', 'completed', 'ready-to-move']),
  launch_date: z.string().optional(),
  completion_date_new: z.string().optional(),
  unique_selling_points: z.array(z.string()).optional(),
  description: z.string().min(10, "Description trop courte"),
  detailed_description: z.string().optional(),

  // LOCATION
  full_address: z.string().optional(),
  city: z.string().min(1, "Ville requise"),
  region: z.string().optional(),
  neighborhood: z.string().optional(),
  neighborhood_description: z.string().optional(),
  gps_latitude: z.number().min(-90).max(90).optional(),
  gps_longitude: z.number().min(-180).max(180).optional(),
  proximity_sea_km: z.number().min(0).optional(),
  proximity_airport_km: z.number().min(0).optional(),
  proximity_city_center_km: z.number().min(0).optional(),
  proximity_highway_km: z.number().min(0).optional(),
  cyprus_zone: z.string().default('limassol'),

  // SPECIFICATIONS
  land_area_m2: z.number().min(0).optional(),
  built_area_m2: z.number().min(0).optional(),
  total_units_new: z.number().min(0).optional(),
  units_available_new: z.number().min(0).optional(),
  bedrooms_range: z.string().optional(),
  bathrooms_range: z.string().optional(),
  floors_total: z.number().min(0).optional(),
  parking_spaces: z.number().min(0).optional(),
  storage_spaces: z.number().min(0).optional(),
  smart_home_features: z.record(z.any()).optional(),

  // PRICING
  price: z.number().min(0, "Prix requis"),
  price_from_new: z.number().min(0).optional(),
  price_to: z.number().min(0).optional(),
  price_per_m2: z.number().min(0).optional(),
  vat_rate_new: z.number().min(0).max(100).default(5),
  vat_included: z.boolean().default(false),
  golden_visa_eligible_new: z.boolean().default(false),
  roi_estimate_percent: z.number().min(0).max(100).optional(),
  rental_yield_percent: z.number().min(0).max(100).optional(),
  financing_available: z.boolean().default(false),
  financing_options: z.record(z.any()).optional(),
  payment_plan: z.record(z.any()).optional(),
  incentives: z.array(z.string()).optional(),

  // MEDIA
  photos: z.array(z.string()).default([]),
  photo_gallery_urls: z.array(z.string()).optional(),
  video_tour_urls: z.array(z.string()).optional(),
  floor_plan_urls: z.array(z.string()).optional(),
  virtual_tour_url_new: z.string().optional(),
  drone_footage_urls: z.array(z.string()).optional(),
  model_3d_urls: z.array(z.string()).optional(),

  // CONSTRUCTION
  construction_materials: z.array(z.string()).optional(),
  finishing_level: z.enum(['basic', 'standard', 'premium', 'luxury']).optional(),
  design_style: z.string().optional(),
  architect_name: z.string().optional(),
  builder_name: z.string().optional(),
  energy_rating: z.enum(['A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G']).optional(),
  sustainability_certifications: z.array(z.string()).optional(),
  warranty_years: z.number().min(0).optional(),

  // MARKETING
  project_narrative: z.string().optional(),
  meta_title_new: z.string().optional(),
  meta_description_new: z.string().optional(),
  meta_keywords: z.array(z.string()).optional(),
  marketing_highlights: z.array(z.string()).optional(),
  target_audience: z.array(z.string()).optional(),

  // FEATURES & AMENITIES
  features: z.array(z.string()).default([]),
  amenities: z.array(z.string()).optional(),

  // STATUS
  status: z.enum(['available', 'under_construction', 'delivered', 'sold']).default('available'),
  featured_new: z.boolean().default(false),
  type: z.string().min(1, "Type requis"),

  // LOCATION OBJECT (legacy compatibility)
  location: z.object({
    city: z.string(),
    address: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional()
  }).optional()
}).refine(
  (data) => {
    if (data.golden_visa_eligible_new && data.price < 300000) {
      return false;
    }
    return true;
  },
  {
    message: "Pour être éligible Golden Visa, le prix minimum doit être ≥ 300,000€",
    path: ["golden_visa_eligible_new"],
  }
).refine(
  (data) => {
    if (data.price_to && data.price_from_new && data.price_to < data.price_from_new) {
      return false;
    }
    return true;
  },
  {
    message: "Le prix maximum ne peut être inférieur au prix minimum",
    path: ["price_to"],
  }
);

export type ProjectFormData = z.infer<typeof projectSchema>;

export const projectFormSteps = [
  {
    id: 'basics',
    title: 'Informations de base',
    icon: 'FileText',
    fields: [
      'title', 'project_code', 'developer_id', 'property_category', 
      'property_sub_type', 'project_phase', 'launch_date', 
      'completion_date_new', 'description', 'detailed_description', 'type'
    ]
  },
  {
    id: 'location',
    title: 'Localisation',
    icon: 'MapPin',
    fields: [
      'full_address', 'city', 'region', 'neighborhood',
      'neighborhood_description', 'gps_latitude', 'gps_longitude',
      'proximity_sea_km', 'proximity_airport_km', 'proximity_city_center_km',
      'cyprus_zone'
    ]
  },
  {
    id: 'specifications',
    title: 'Spécifications',
    icon: 'Ruler',
    fields: [
      'land_area_m2', 'built_area_m2', 'total_units_new', 'units_available_new',
      'bedrooms_range', 'bathrooms_range', 'floors_total', 
      'parking_spaces', 'storage_spaces'
    ]
  },
  {
    id: 'pricing',
    title: 'Prix & Investissement',
    icon: 'Euro',
    fields: [
      'price', 'price_from_new', 'price_to', 'price_per_m2', 'vat_rate_new', 
      'vat_included', 'golden_visa_eligible_new', 'roi_estimate_percent',
      'rental_yield_percent', 'financing_available'
    ]
  },
  {
    id: 'media',
    title: 'Médias',
    icon: 'Image',
    fields: [
      'photos', 'photo_gallery_urls', 'video_tour_urls', 'floor_plan_urls',
      'virtual_tour_url_new', 'drone_footage_urls', 'model_3d_urls'
    ]
  },
  {
    id: 'amenities',
    title: 'Prestations',
    icon: 'Star',
    component: 'AmenitiesSelector'
  },
  {
    id: 'marketing',
    title: 'Marketing & SEO',
    icon: 'Megaphone',
    fields: [
      'project_narrative', 'meta_title_new', 'meta_description_new',
      'marketing_highlights', 'target_audience', 'features', 'status'
    ]
  }
];