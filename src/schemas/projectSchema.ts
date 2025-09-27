import { z } from 'zod';

export const projectSchema = z.object({
  // BASICS
  title: z.string().min(3, "Minimum 3 caractères"),
  project_code: z.string().optional(),
  developer_id: z.string().uuid("Sélectionnez un développeur"),
  property_category: z.enum(['residential', 'commercial', 'mixed', 'industrial']).optional(),
  property_sub_type: z.array(z.enum([
    // Residential
    'villa', 'apartment', 'penthouse', 'townhouse', 'studio', 'duplex', 'triplex', 'maisonette',
    // Commercial
    'office', 'retail', 'warehouse', 'showroom', 'restaurant', 'hotel', 'clinic', 'workshop',
    // Industrial
    'factory', 'logistics', 'storage', 'production',
    // Land
    'land_residential', 'land_commercial', 'land_agricultural',
    // Other
    'mixed_use', 'other'
  ])).optional(),
  project_phase: z.enum(['off-plan', 'under-construction', 'completed', 'ready-to-move']).optional(),
  statut_commercial: z.enum(['pre_commercialisation', 'commercialisation', 'reduction_prix', 'dernieres_opportunites', 'vendu']).default('pre_commercialisation'),
  launch_month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Format YYYY-MM requis").optional(),
  completion_month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Format YYYY-MM requis").optional(),
  unique_selling_points: z.any().optional(), // Changed to any for JSONB
  exclusive_commercialization: z.boolean().default(false),
  description: z.string().min(10, "Description trop courte"),
  detailed_description: z.string().optional(),

  // LOCATION - Added missing fields
  full_address: z.string().optional(),
  street_address: z.string().optional(), // Added
  postal_code: z.string().optional(), // Added
  city: z.string().min(1, "Ville requise"),
  region: z.string().optional(),
  neighborhood: z.string().optional(),
  neighborhood_description: z.string().optional(),
  district: z.string().optional(),
  municipality: z.string().optional(),
  gps_latitude: z.number().min(-90).max(90).optional(),
  gps_longitude: z.number().min(-180).max(180).optional(),
  proximity_sea_km: z.number().min(0).optional(),
  proximity_airport_km: z.number().min(0).optional(),
  proximity_city_center_km: z.number().min(0).optional(),
  proximity_highway_km: z.number().min(0).optional(),
  cyprus_zone: z.string().default('limassol'),

  // SPECIFICATIONS - Added missing fields
  land_area_m2: z.number().min(0).optional(),
  built_area_m2: z.number().min(0).optional(),
  total_units: z.number().min(0).optional(),
  units_available: z.number().min(0).optional(),
  units_sold: z.number().min(0).optional(), // Added
  parking_spaces: z.number().min(0).optional(),
  bedrooms_range_min: z.number().min(0).optional(), // Added
  bedrooms_range_max: z.number().min(0).optional(), // Added
  square_meters_min: z.number().min(0).optional(), // Added
  square_meters_max: z.number().min(0).optional(), // Added
  smart_home_features: z.any().optional(), // JSONB

  // PRICING
  price_from: z.number().min(0).optional(),
  price_to: z.number().min(0).optional(),
  price_per_m2: z.number().min(0).optional(),
  vat_rate: z.number().min(0).max(100).default(5),
  vat_included: z.boolean().default(false),
  golden_visa_eligible: z.boolean().default(false),
  roi_estimate_percent: z.number().min(0).max(100).optional(),
  rental_yield_percent: z.number().min(0).max(100).optional(),
  financing_available: z.boolean().default(false),
  financing_options: z.any().optional(), // Changed to any for JSONB
  payment_plan: z.any().optional(), // Changed to any for JSONB
  incentives: z.any().optional(), // Changed to any for JSONB
  transfer_fee: z.number().min(0).optional(),

  // MEDIA
  photos: z.any().optional(), // Changed to any for JSONB
  photo_gallery_urls: z.any().optional(), // JSONB
  video_tour_urls: z.any().optional(), // JSONB
  virtual_tour_url: z.string().optional(),
  project_presentation_url: z.string().optional(),
  youtube_tour_url: z.string().optional(),
  vimeo_tour_url: z.string().optional(),
  vr_tour_url: z.string().optional(),
  ar_experience_url: z.string().optional(),
  metaverse_preview_url: z.string().optional(),
  interactive_map_url: z.string().optional(),
  map_image: z.string().optional(),
  
  drone_footage_urls: z.any().optional(), // JSONB
  drone_footage_url: z.string().optional(), // Also exists as singular
  model_3d_urls: z.any().optional(), // JSONB
  master_plan_url: z.string().optional(),
  brochure_url: z.string().optional(),
  site_plan_url: z.string().optional(), // Added
  video_tour_url: z.string().optional(), // Added
  virtual_tour_3d_url: z.string().optional(), // Added

  // CONSTRUCTION
  construction_materials: z.any().optional(), // JSONB
  finishing_level: z.string().optional(), // Changed from enum to string
  design_style: z.string().optional(),
  architect_name: z.string().optional(),
  architect_license_number: z.string().optional(),
  builder_name: z.string().optional(),
  energy_rating: z.string().optional(), // Changed from enum to string
  building_certification: z.any().optional(), // JSONB
  construction_year: z.number().min(1900).max(2050).optional(),
  renovation_year: z.number().min(1900).max(2050).optional(),
  maintenance_fees_yearly: z.number().min(0).optional(),
  property_tax_yearly: z.number().min(0).optional(),
  hoa_fees_monthly: z.number().min(0).optional(),
  building_insurance: z.number().min(0).optional(), // Changed to number
  seismic_rating: z.string().optional(),
  accessibility_features: z.any().optional(), // JSONB
  internet_speed_mbps: z.number().min(0).optional(),
  pet_policy: z.string().optional(), // Changed from enum to string
  smoking_policy: z.string().optional(), // Changed from enum to string
  sustainability_certifications: z.any().optional(), // JSONB
  warranty_years: z.number().min(0).optional(),
  after_sales_service: z.string().optional(), // Changed from boolean to string

  // MARKETING
  project_narrative: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  meta_keywords: z.string().optional(), // Changed from array to string
  marketing_highlights: z.any().optional(), // JSONB
  target_audience: z.string().optional(), // Changed from array to string
  url_slug: z.string().optional(),
  og_image_url: z.string().optional(),
  schema_markup: z.any().optional(), // Added - JSONB

  // AMENITIES
  amenities: z.any().optional(), // JSONB
  lifestyle_amenities: z.any().optional(), // Added - JSONB
  community_features: z.any().optional(), // Added - JSONB
  wellness_features: z.any().optional(), // Added - JSONB
  seasonal_features: z.any().optional(), // Added - JSONB
  
  // BUILDINGS
  buildings: z.array(z.object({
    id: z.string().optional(),
    building_name: z.string().min(1, "Nom requis"),
    building_type: z.enum(['apartment_building', 'villa_complex', 'mixed_residence', 'residential']).optional(),
    building_code: z.string().optional(),
    total_floors: z.number().min(0).optional(),
    total_units: z.number().min(0).optional(),
    units_available: z.number().min(0).optional(),
    construction_status: z.enum(['planned', 'construction', 'delivered']).optional(),
    expected_completion: z.string().optional(),
    actual_completion: z.string().optional(),
    building_class: z.enum(['A+', 'A', 'B', 'C']).optional(),
    energy_certificate: z.string().optional(),
    elevator_count: z.number().min(0).optional(),
    has_generator: z.boolean().optional(),
    has_security_system: z.boolean().optional(),
    has_cctv: z.boolean().optional(),
    has_concierge: z.boolean().optional(),
    has_pool: z.boolean().optional(),
    has_gym: z.boolean().optional(),
    has_spa: z.boolean().optional(),
    has_playground: z.boolean().optional(),
    has_garden: z.boolean().optional(),
    has_parking: z.boolean().optional(),
    parking_type: z.enum(['underground', 'outdoor', 'covered']).optional(),
    display_order: z.number().optional()
  })).default([]),

  // NEARBY AMENITIES
  surrounding_amenities: z.any().optional(), // JSONB

  // STATUS
  status: z.string().optional(), // Added
  project_status: z.string().optional(), // Added  
  construction_phase: z.string().optional(), // Changed from enum to string
  construction_start: z.string().optional(), // Added
  completion_date: z.string().optional(), // Added
  expected_completion: z.string().optional(), // Added
  launch_date: z.string().optional(), // Added
  featured_property: z.boolean().default(false), // Added
  featured_project: z.boolean().default(false),
  featured_until: z.string().optional(), // Added
  show_on_website: z.boolean().default(true), // Added
  hot_deal: z.boolean().default(false), // Added
  nft_ownership_available: z.boolean().optional(),
  
  // Additional fields from DB
  view_count: z.number().optional(),
  inquiry_count: z.number().optional(),
  favorite_count: z.number().optional(),
  search_ranking_weight: z.number().optional(),
  last_price_update: z.string().optional(),
  social_proof_stats: z.any().optional(), // JSONB
  ai_chatbot_enabled: z.boolean().optional(),
  ai_description: z.string().optional(),
  ai_generated_at: z.string().optional(),
  ai_generated_content: z.any().optional(), // JSONB
  ai_content_disclosure: z.string().optional(),
  
  // Energy & Sustainability
  solar_panels_installed: z.boolean().optional(),
  solar_capacity_kw: z.number().optional(),
  photovoltaic_system: z.boolean().optional(),
  net_metering_available: z.boolean().optional(),
  geothermal_heating: z.boolean().optional(),
  rainwater_harvesting: z.boolean().optional(),
  grey_water_recycling: z.boolean().optional(),
  green_building_certification: z.string().optional(),
  energy_efficiency_class: z.string().optional(),
  carbon_neutral: z.boolean().optional(),
  ev_charging_stations: z.number().optional(),
  ev_charging_type: z.string().optional(),
  ev_charging_power_kw: z.number().optional(),
  smart_grid_ready: z.boolean().optional(),
  backup_power_generator: z.boolean().optional(),
  ups_system: z.boolean().optional(),
  
  // Sales & Availability
  sold_percentage: z.number().optional(),
  reserved_percentage: z.number().optional(),
  available_units: z.number().optional(),
  phase_current: z.number().optional(),
  total_phases: z.number().optional(),
  
  // Discounts & Offers
  discount_percentage: z.number().optional(),
  discount_valid_until: z.string().optional(),
  early_bird_discount: z.number().optional(),
  bulk_purchase_discount: z.number().optional(),
  payment_plans: z.any().optional(), // JSONB
  
  // Property Management
  furniture_package_available: z.boolean().optional(),
  furniture_package_price: z.number().optional(),
  furniture_package_description: z.string().optional(),
  property_management_company: z.string().optional(),
  property_management_fee: z.number().optional(),
  concierge_service: z.boolean().optional(),
  rental_management_available: z.boolean().optional(),
  guaranteed_rental_return: z.number().optional(),
  rental_pool_option: z.boolean().optional()
});

export type ProjectFormData = z.infer<typeof projectSchema>;

export const projectFormSteps = [
  {
    id: 'basics',
    title: 'Informations de base',
    icon: 'FileText',
    fields: [
      'title', 'project_code', 'developer_id', 'property_category', 
      'property_sub_type', 'project_phase', 'statut_commercial', 'launch_month', 
      'completion_month', 'description', 'detailed_description'
    ]
  },
  {
    id: 'location',
    title: 'Localisation',
    icon: 'MapPin',
    fields: [
      'full_address', 'street_address', 'postal_code', 'city', 'region', 
      'neighborhood', 'neighborhood_description', 'gps_latitude', 'gps_longitude',
      'proximity_sea_km', 'proximity_airport_km', 'proximity_city_center_km',
      'cyprus_zone', 'surrounding_amenities'
    ]
  },
  {
    id: 'buildings',
    title: 'Bâtiments',
    icon: 'Building2',
    fields: ['buildings']
  },
  {
    id: 'amenities',
    title: 'Équipements Communs',
    icon: 'Star',
    fields: ['amenities', 'lifestyle_amenities', 'community_features', 'wellness_features']
  },
  {
    id: 'specifications',
    title: 'Spécifications',
    icon: 'Ruler',
    fields: [
      'land_area_m2', 'built_area_m2', 'total_units', 'units_available', 'units_sold',
      'parking_spaces', 'bedrooms_range_min', 'bedrooms_range_max',
      'square_meters_min', 'square_meters_max'
    ]
  },
  {
    id: 'pricing',
    title: 'Prix & Investissement',
    icon: 'Euro',
    fields: [
      'price_from', 'price_to', 'price_per_m2', 'vat_rate',
      'vat_included', 'golden_visa_eligible', 'roi_estimate_percent',
      'rental_yield_percent', 'financing_available', 'financing_options'
    ]
  },
  {
    id: 'media',
    title: 'Photos & Vidéos',
    icon: 'Image',
    fields: [
      'photos', 'youtube_tour_url', 'vr_tour_url', 'virtual_tour_url',
      'project_presentation_url', 'vimeo_tour_url', 'master_plan_url',
      'brochure_url', 'model_3d_urls', 'drone_footage_url',
      'ar_experience_url', 'metaverse_preview_url'
    ]
  },
  {
    id: 'marketing',
    title: 'Marketing & SEO',
    icon: 'Megaphone',
    fields: [
      'meta_title', 'meta_description', 'meta_keywords',
      'marketing_highlights', 'target_audience', 'url_slug', 
      'og_image_url', 'featured_project', 'construction_phase',
      'schema_markup'
    ]
  }
];
