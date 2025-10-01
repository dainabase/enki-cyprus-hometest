import { z } from 'zod';

export const projectSchema = z.object({
  // ========================================
  // BASICS
  // ========================================
  title: z.string().min(3, "Minimum 3 caractères"),
  project_code: z.string().optional(),
  developer_id: z.string().uuid("Sélectionnez un développeur"),
  subtitle: z.string().optional(), // Added (PRIORITY 4)
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
  unique_selling_points: z.any().optional(),
  exclusive_commercialization: z.boolean().default(false),
  description: z.string().min(10, "Description trop courte"),
  detailed_description: z.string().optional(),

  // ========================================
  // LOCATION
  // ========================================
  full_address: z.string().optional(),
  street_number: z.string().optional(),
  street_name: z.string().optional(),
  street_address: z.string().optional(),
  postal_code: z.string().optional(),
  auto_detected_zone: z.boolean().optional(), // Added (PRIORITY 4)
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

  // ========================================
  // SPECIFICATIONS
  // ========================================
  land_area_m2: z.number().min(0).optional(),
  built_area_m2: z.number().min(0).optional(),
  total_units: z.number().min(0).optional(),
  units_available: z.number().min(0).optional(),
  units_sold: z.number().min(0).optional(),
  parking_spaces: z.number().min(0).optional(),
  bedrooms_range_min: z.number().min(0).optional(),
  bedrooms_range_max: z.number().min(0).optional(),
  square_meters_min: z.number().min(0).optional(),
  square_meters_max: z.number().min(0).optional(),
  plot_sizes_m2: z.any().optional(), // Added (PRIORITY 3) - JSONB
  smart_home_features: z.any().optional(),

  // ========================================
  // PRICING & FEES
  // ========================================
  price_from: z.number().min(0).optional(),
  price_to: z.number().min(0).optional(),
  price_per_m2: z.number().min(0).optional(),
  vat_rate: z.number().min(0).max(100).default(5),
  vat_included: z.boolean().default(false),
  transfer_fees_included: z.boolean().optional(),
  golden_visa_eligible: z.boolean().default(false),
  roi_estimate_percent: z.number().min(0).max(100).optional(),
  rental_yield_percent: z.number().min(0).max(100).optional(),
  financing_available: z.boolean().default(false),
  financing_options: z.any().optional(),
  payment_plan: z.any().optional(),
  incentives: z.any().optional(),
  
  // New Pricing Fields (PRIORITY 2)
  pricing_strategy_notes: z.string().optional(),
  deposit_terms: z.string().optional(),
  cancellation_policy: z.string().optional(),
  price_list: z.any().optional(), // JSONB
  special_offers: z.any().optional(), // JSONB
  bank_partners: z.any().optional(), // JSONB
  investment_highlights: z.any().optional(), // JSONB

  // ========================================
  // MEDIA
  // ========================================
  photos: z.any().optional(),
  photo_gallery_urls: z.any().optional(),
  photo_count: z.number().optional(), // Added (PRIORITY 4)
  categorized_photos: z.any().optional(), // Added (PRIORITY 3) - JSONB
  video_tour_urls: z.any().optional(),
  video_url: z.string().optional(), // Added (PRIORITY 3)
  virtual_tour_url: z.string().optional(),
  project_presentation_url: z.string().optional(),
  youtube_tour_url: z.string().optional(),
  vimeo_tour_url: z.string().optional(),
  vr_tour_url: z.string().optional(),
  ar_experience_url: z.string().optional(),
  interactive_map_url: z.string().optional(),
  map_image: z.string().optional(),
  drone_footage_urls: z.any().optional(),
  drone_footage_url: z.string().optional(),
  model_3d_urls: z.any().optional(),
  bim_model_url: z.string().optional(), // Added (PRIORITY 3)
  master_plan_url: z.string().optional(),
  brochure_url: z.string().optional(),
  brochure_pdf: z.string().optional(), // Added (PRIORITY 3)
  site_plan_url: z.string().optional(),
  video_tour_url: z.string().optional(),
  virtual_tour_3d_url: z.string().optional(),

  // ========================================
  // CONSTRUCTION
  // ========================================
  construction_materials: z.any().optional(),
  finishing_level: z.string().optional(),
  design_style: z.string().optional(),
  architect_name: z.string().optional(),
  architect_license_number: z.string().optional(),
  builder_name: z.string().optional(),
  construction_warranty_details: z.string().optional(),
  building_certification: z.any().optional(),
  construction_year: z.number().min(1900).max(2050).optional(),
  renovation_year: z.number().min(1900).max(2050).optional(),
  maintenance_fees_yearly: z.number().min(0).optional(),
  property_tax_yearly: z.number().min(0).optional(),
  hoa_fees_monthly: z.number().min(0).optional(),
  building_insurance: z.number().min(0).optional(),
  
  // New Maintenance Fees (PRIORITY 2)
  pool_maintenance_fee: z.number().optional(),
  security_service_fee: z.number().optional(),
  garden_maintenance_fee: z.number().optional(),
  
  seismic_rating: z.string().optional(),
  accessibility_features: z.any().optional(),
  internet_speed_mbps: z.number().min(0).optional(),
  pet_policy: z.string().optional(),
  smoking_policy: z.string().optional(),
  sustainability_certifications: z.any().optional(),
  warranty_years: z.number().min(0).optional(),
  after_sales_service: z.string().optional(),

  // ========================================
  // LEGAL & COMPLIANCE
  // ========================================
  permits_obtained: z.any().optional(),
  compliance_certifications: z.any().optional(),
  planning_permit_number: z.string().optional(),
  building_permit_number: z.string().optional(),

  // ========================================
  // UTILITIES & SERVICES
  // ========================================
  gas_connection_available: z.boolean().optional(),
  fiber_optic_available: z.boolean().optional(),

  // ========================================
  // MARKETING
  // ========================================
  project_narrative: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  meta_keywords: z.string().optional(),
  marketing_highlights: z.any().optional(),
  target_audience: z.string().optional(),
  url_slug: z.string().optional(),
  og_image_url: z.string().optional(),
  schema_markup: z.any().optional(),

  // ========================================
  // AMENITIES - Common (existing)
  // ========================================
  amenities: z.any().optional(),
  lifestyle_amenities: z.any().optional(),
  community_features: z.any().optional(),
  wellness_features: z.any().optional(),
  seasonal_features: z.any().optional(),
  
  // ========================================
  // AMENITIES - Boolean Fields (PRIORITY 1 - 27 fields)
  // ========================================
  has_pool: z.boolean().optional(),
  has_gym: z.boolean().optional(),
  has_spa: z.boolean().optional(),
  has_playground: z.boolean().optional(),
  has_garden: z.boolean().optional(),
  has_security_system: z.boolean().optional(),
  has_cctv: z.boolean().optional(),
  has_concierge: z.boolean().optional(),
  has_generator: z.boolean().optional(),
  has_solar_panels: z.boolean().optional(),
  has_parking: z.boolean().optional(),
  parking_type: z.enum(['underground', 'outdoor', 'covered']).optional(),
  has_security_24_7: z.boolean().optional(),
  has_tennis_court: z.boolean().optional(),
  club_house: z.boolean().optional(),
  restaurant: z.boolean().optional(),
  cafe: z.boolean().optional(),
  mini_market: z.boolean().optional(),
  business_center: z.boolean().optional(),
  kids_club: z.boolean().optional(),
  beach_access: z.boolean().optional(),
  marina_access: z.boolean().optional(),
  golf_course: z.boolean().optional(),
  shuttle_service: z.boolean().optional(),
  sports_facilities: z.boolean().optional(),
  wellness_center: z.boolean().optional(),
  coworking_space: z.boolean().optional(),
  
  // ========================================
  // AMENITIES - JSONB Fields (PRIORITY 3 - 3 fields)
  // ========================================
  security_features: z.any().optional(),
  wellness_facilities: z.any().optional(),
  outdoor_facilities: z.any().optional(),
  
  // ========================================
  // BUILDINGS
  // ========================================
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

  // ========================================
  // NEARBY AMENITIES
  // ========================================
  surrounding_amenities: z.any().optional(),

  // ========================================
  // STATUS
  // ========================================
  status: z.string().optional(),
  project_status: z.string().optional(),
  construction_phase: z.string().optional(),
  construction_start: z.string().optional(),
  completion_date: z.string().optional(),
  expected_completion: z.string().optional(),
  launch_date: z.string().optional(),
  featured_property: z.boolean().default(false),
  featured_project: z.boolean().default(false),
  featured_until: z.string().optional(),
  show_on_website: z.boolean().default(true),
  
  // ========================================
  // ANALYTICS & TRACKING (PRIORITY 4)
  // ========================================
  view_count: z.number().optional(),
  inquiry_count: z.number().optional(),
  favorite_count: z.number().optional(),
  search_ranking_weight: z.number().min(1).max(10).default(5),
  last_price_update: z.string().optional(),
  social_proof_stats: z.any().optional(),
  ai_chatbot_enabled: z.boolean().optional(),
  ai_description: z.string().optional(),
  ai_generated_at: z.string().optional(),
  ai_generated_content: z.any().optional(),
  ai_content_disclosure: z.string().optional(),
  
  // ========================================
  // ENERGY & SUSTAINABILITY
  // ========================================
  solar_panels_installed: z.boolean().default(false),
  solar_capacity_kw: z.number().min(0).optional(),
  photovoltaic_system: z.boolean().default(false),
  geothermal_heating: z.boolean().default(false),
  green_building_certification: z.string().optional(),
  energy_efficiency_class: z.string().optional(),
  ev_charging_stations: z.number().min(0).default(0),
  ev_charging_type: z.enum(['type2', 'ccs', 'chademo', 'tesla', 'mixed']).optional(),
  smart_grid_ready: z.boolean().default(false),
  
  // ========================================
  // SALES & AVAILABILITY
  // ========================================
  sold_percentage: z.number().min(0).max(100).optional(),
  reserved_percentage: z.number().min(0).max(100).optional(),
  available_units: z.number().min(0).optional(),
  phase_current: z.number().min(1).optional(),
  total_phases: z.number().min(1).optional(),
  
  // ========================================
  // DISCOUNTS & OFFERS
  // ========================================
  hot_deal: z.boolean().default(false),
  discount_percentage: z.number().min(0).max(100).optional(),
  discount_valid_until: z.string().optional(),
  early_bird_discount: z.number().min(0).optional(),
  bulk_purchase_discount: z.number().min(0).max(100).optional(),
  payment_plans: z.any().optional(),
  
  // ========================================
  // PROPERTY MANAGEMENT & SERVICES
  // ========================================
  furniture_package_available: z.boolean().default(false),
  furniture_package_price: z.number().min(0).optional(),
  furniture_package_description: z.string().optional(),
  property_management_company: z.string().optional(),
  property_management_fee: z.number().min(0).optional(),
  concierge_service: z.boolean().optional(),
  rental_management_available: z.boolean().default(false),
  guaranteed_rental_return: z.number().min(0).max(100).optional(),
  rental_pool_option: z.boolean().default(false)
});

export type ProjectFormData = z.infer<typeof projectSchema>;

export const projectFormSteps = [
  // ========================================
  // EXISTING STEPS (1-7)
  // ========================================
  {
    id: 'basics',
    title: 'Informations de base',
    icon: 'FileText',
    fields: [
      'title', 'subtitle', 'project_code', 'developer_id', 'property_category', 
      'property_sub_type', 'project_phase', 'statut_commercial', 'launch_month', 
      'completion_month', 'description', 'detailed_description', 'unique_selling_points',
      'exclusive_commercialization'
    ]
  },
  {
    id: 'location',
    title: 'Localisation',
    icon: 'MapPin',
    fields: [
      'full_address', 'street_number', 'street_name', 'street_address', 'postal_code', 
      'auto_detected_zone', 'city', 'region', 'neighborhood', 'neighborhood_description', 
      'district', 'municipality', 'gps_latitude', 'gps_longitude', 'proximity_sea_km', 
      'proximity_airport_km', 'proximity_city_center_km', 'proximity_highway_km',
      'cyprus_zone', 'surrounding_amenities'
    ]
  },
  {
    id: 'amenities',
    title: 'Équipements Communs',
    icon: 'Star',
    fields: ['amenities', 'lifestyle_amenities', 'community_features', 'wellness_features', 'seasonal_features']
  },
  {
    id: 'specifications',
    title: 'Spécifications',
    icon: 'Ruler',
    fields: [
      'land_area_m2', 'built_area_m2', 'plot_sizes_m2', 'total_units', 'units_available', 
      'units_sold', 'parking_spaces', 'bedrooms_range_min', 'bedrooms_range_max',
      'square_meters_min', 'square_meters_max', 'smart_home_features'
    ]
  },
  {
    id: 'pricing',
    title: 'Prix & Investissement',
    icon: 'Euro',
    fields: [
      'price_from', 'price_to', 'price_per_m2', 'vat_rate', 'vat_included', 
      'transfer_fees_included', 'golden_visa_eligible', 'roi_estimate_percent', 'rental_yield_percent', 
      'financing_available', 'financing_options', 'payment_plan', 'incentives',
      'pricing_strategy_notes', 'deposit_terms', 'cancellation_policy', 
      'price_list', 'special_offers', 'bank_partners', 'investment_highlights'
    ]
  },
  {
    id: 'media',
    title: 'Photos & Vidéos',
    icon: 'Image',
    fields: [
      'photos', 'photo_count', 'categorized_photos', 'photo_gallery_urls',
      'video_url', 'youtube_tour_url', 'vimeo_tour_url', 'video_tour_urls', 
      'vr_tour_url', 'virtual_tour_url', 'ar_experience_url', 
      'project_presentation_url', 'master_plan_url', 'site_plan_url',
      'brochure_url', 'brochure_pdf', 'bim_model_url', 'model_3d_urls', 
      'drone_footage_url', 'drone_footage_urls', 'interactive_map_url', 'map_image'
    ]
  },
  {
    id: 'marketing',
    title: 'Marketing & SEO',
    icon: 'Megaphone',
    fields: [
      'project_narrative', 'meta_title', 'meta_description', 'meta_keywords',
      'marketing_highlights', 'target_audience', 'url_slug', 'og_image_url',
      'schema_markup', 'featured_project', 'featured_property', 'featured_until',
      'show_on_website', 'hot_deal', 'construction_phase'
    ]
  },
  
  // ========================================
  // NEW STEPS (8-10)
  // ========================================
  {
    id: 'project-amenities',
    title: 'Équipements Projet',
    icon: 'Building',
    fields: [
      // Boolean amenities (27 fields)
      'has_pool', 'has_gym', 'has_spa', 'has_playground', 'has_garden',
      'has_security_system', 'has_cctv', 'has_concierge', 'has_generator', 'has_solar_panels',
      'has_parking', 'parking_type', 'has_security_24_7', 'has_tennis_court', 
      'club_house', 'restaurant', 'cafe', 'mini_market', 'business_center', 
      'kids_club', 'beach_access', 'marina_access', 'golf_course', 
      'shuttle_service', 'sports_facilities', 'wellness_center', 'coworking_space',
      // JSONB amenities (3 fields)
      'security_features', 'wellness_facilities', 'outdoor_facilities'
    ]
  },
  {
    id: 'legal-compliance',
    title: 'Légal & Conformité',
    icon: 'FileCheck',
    fields: [
      'permits_obtained', 'compliance_certifications',
      'planning_permit_number', 'building_permit_number',
      'construction_warranty_details'
    ]
  },
  {
    id: 'utilities-services',
    title: 'Utilitaires & Services',
    icon: 'Zap',
    fields: [
      'gas_connection_available', 'fiber_optic_available', 
      'pool_maintenance_fee', 'security_service_fee', 'garden_maintenance_fee'
    ]
  }
];
