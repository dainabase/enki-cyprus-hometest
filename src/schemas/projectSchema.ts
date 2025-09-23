import { z } from 'zod';

export const projectSchema = z.object({
  // BASICS
  title: z.string().min(3, "Minimum 3 caractères"),
  project_code: z.string().optional(),
  developer_id: z.string().uuid("Sélectionnez un développeur"),
  property_category: z.enum(['residential', 'commercial', 'mixed', 'industrial']),
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
  ])).min(1, "Sélectionnez au moins un type"),
  project_phase: z.enum(['off-plan', 'under-construction', 'completed', 'ready-to-move']),
  statut_commercial: z.enum(['pre_commercialisation', 'commercialisation', 'reduction_prix', 'dernieres_opportunites', 'vendu']).default('pre_commercialisation'),
  launch_month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Format YYYY-MM requis").optional(),
  completion_month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Format YYYY-MM requis").optional(),
  unique_selling_points: z.array(z.string()).optional(),
  exclusive_commercialization: z.boolean().default(false),
  description: z.string().min(10, "Description trop courte"),
  detailed_description: z.string().optional(),

  // LOCATION - Structure améliorée
  street_address: z.string().optional(),
  postal_code: z.string().optional(),
  city: z.string().min(1, "Ville requise"),
  region: z.string().optional(),
  neighborhood: z.string().optional(),
  neighborhood_description: z.string().optional(),
  district: z.string().optional(),
  municipality: z.string().optional(),
  cyprus_zone: z.string().default('limassol'),
  auto_detected_zone: z.boolean().default(false),
  gps_latitude: z.number().min(-90).max(90).optional(),
  gps_longitude: z.number().min(-180).max(180).optional(),
  proximity_sea_km: z.number().min(0).optional(),
  proximity_airport_km: z.number().min(0).optional(),
  proximity_city_center_km: z.number().min(0).optional(),
  proximity_highway_km: z.number().min(0).optional(),
  
  // Legacy compatibility
  full_address: z.string().optional(),

  // SPECIFICATIONS - Avec tous les champs manquants restaurés
  land_area_m2: z.number().min(0).optional(),
  built_area_m2: z.number().min(0).optional(),
  total_units: z.number().min(0).optional(),
  units_available: z.number().min(0).optional(),
  floors_total: z.number().min(0).optional(),
  parking_spaces: z.number().min(0).optional(),
  storage_spaces: z.number().min(0).optional(),
  smart_home_features: z.record(z.string(), z.boolean()).optional(),
  
  // Champs techniques restaurés
  energy_rating: z.enum(['A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G']).optional(),
  construction_materials: z.array(z.string()).optional(),
  design_style: z.string().optional(),
  building_certification: z.string().optional(),
  construction_year: z.number().min(1900).max(2050).optional(),
  architect_name: z.string().optional(),
  architect_license_number: z.string().optional(),
  builder_name: z.string().optional(),
  renovation_year: z.number().min(1900).max(2050).optional(),
  maintenance_fees_yearly: z.number().min(0).optional(),
  property_tax_yearly: z.number().min(0).optional(),
  hoa_fees_monthly: z.number().min(0).optional(),
  building_insurance: z.string().optional(),
  seismic_rating: z.string().optional(),
  accessibility_features: z.array(z.string()).optional(),
  internet_speed_mbps: z.number().min(0).optional(),
  pet_policy: z.enum(['allowed', 'restricted', 'forbidden']).optional(),
  smoking_policy: z.enum(['allowed', 'restricted', 'forbidden']).optional(),
  sustainability_certifications: z.array(z.string()).optional(),
  warranty_years: z.number().min(0).optional(),
  finishing_level: z.enum(['basic', 'standard', 'premium', 'luxury']).optional(),

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
  financing_options: z.object({
    bank_loan: z.boolean().optional(),
    developer_financing: z.boolean().optional(),
    payment_plan_available: z.boolean().optional(),
    crypto_accepted: z.boolean().optional(),
    cash_discount: z.number().min(0).max(100).optional()
  }).optional(),
  payment_plan: z.object({
    deposit_percent: z.number().min(0).max(100).optional(),
    installments_count: z.number().min(0).optional(),
    installment_frequency: z.enum(['monthly', 'quarterly', 'semi-annual', 'annual']).optional(),
    completion_payment_percent: z.number().min(0).max(100).optional(),
    notes: z.string().optional()
  }).optional(),
  incentives: z.array(z.string()).optional(),
  transfer_fee: z.number().min(0).optional(),

  // MEDIA
  photos: z.array(z.object({
    url: z.string(),
    category: z.enum(['hero', 'exterior_1', 'exterior_2', 'interior_1', 'interior_2', 'panoramic_view', 'sea_view', 'mountain_view', 'amenities', 'plans', 'kitchen', 'bedroom', 'bathroom', 'balcony', 'garden']),
    isPrimary: z.boolean().optional(),
    caption: z.string().optional()
  })).default([]),
  photo_gallery_urls: z.array(z.string()).optional(),
  video_tour_urls: z.array(z.string()).optional(),
  virtual_tour_url: z.string().optional(),
  project_presentation_url: z.string().optional(),
  youtube_tour_url: z.string().optional(),
  vimeo_tour_url: z.string().optional(),
  vr_tour_url: z.string().optional(),
  ar_experience_url: z.string().optional(),
  metaverse_preview_url: z.string().optional(),
  interactive_map_url: z.string().optional(),
  map_image: z.string().optional(),
  drone_footage_urls: z.array(z.string()).optional(),
  model_3d_urls: z.array(z.string()).optional(),
  master_plan_pdf: z.string().optional(),
  brochure_pdf: z.string().optional(),
  price_list_pdf: z.string().optional(),
  technical_specs_pdf: z.string().optional(),
  legal_documents_urls: z.array(z.string()).optional(),

  // MARKETING - SEO
  project_narrative: z.string().optional(),
  meta_title: z.string().max(60, "Maximum 60 caractères").optional(),
  meta_description: z.string().max(160, "Maximum 160 caractères").optional(),
  meta_keywords: z.array(z.string()).optional(),
  marketing_highlights: z.array(z.string()).optional(),
  target_audience: z.array(z.string()).optional(),
  url_slug: z.string().optional(),
  og_title: z.string().optional(),
  og_description: z.string().optional(),
  og_image: z.string().optional(),
  seo_agent_content: z.string().optional(),

  // AMENITIES
  amenities: z.array(z.string()).default([]),
  
  // BUILDINGS - Structure corrigée
  buildings: z.array(z.object({
    id: z.string().optional(),
    project_id: z.string().optional(),
    building_name: z.string().min(1, "Nom requis"),
    building_type: z.enum(['apartment_building', 'villa_complex', 'mixed_residence', 'residential']),
    building_code: z.string().optional(),
    total_floors: z.number().min(0).optional(),
    total_units: z.number().min(0).optional(),
    units_available: z.number().min(0).optional(),
    construction_status: z.enum(['planned', 'construction', 'delivered']),
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
    display_order: z.number().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional()
  })).default([]),

  // NEARBY AMENITIES
  surrounding_amenities: z.array(z.object({
    nearby_amenity_id: z.string().min(1, "ID requis"),
    distance_km: z.number().optional(),
    details: z.string().optional()
  })).default([]),

  // STATUS
  construction_phase: z.enum(['planned', 'in_progress', 'completion', 'finished']).default('planned'),
  featured_project: z.boolean().default(false),
  after_sales_service: z.boolean().optional(),
  nft_ownership_available: z.boolean().optional()
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
      'street_address', 'postal_code', 'city', 'region', 'neighborhood',
      'neighborhood_description', 'gps_latitude', 'gps_longitude',
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
    fields: ['amenities']
  },
  {
    id: 'specifications',
    title: 'Spécifications',
    icon: 'Ruler',
    fields: [
      'land_area_m2', 'built_area_m2', 'total_units', 'units_available',
      'floors_total', 'parking_spaces', 'storage_spaces',
      'energy_rating', 'construction_materials', 'design_style', 
      'building_certification', 'construction_year', 'architect_name',
      'builder_name', 'finishing_level'
    ]
  },
  {
    id: 'pricing',
    title: 'Prix & Investissement',
    icon: 'Euro',
    fields: [
      'price_from', 'price_to', 'price_per_m2', 'vat_rate',
      'vat_included', 'golden_visa_eligible', 'roi_estimate_percent',
      'rental_yield_percent', 'financing_available'
    ]
  },
  {
    id: 'media',
    title: 'Photos & Vidéos',
    icon: 'Image',
    fields: [
      'photos', 'youtube_tour_url', 'vr_tour_url', 'virtual_tour_url',
      'project_presentation_url', 'vimeo_tour_url', 'master_plan_pdf',
      'brochure_pdf', 'price_list_pdf', 'technical_specs_pdf', 'model_3d_urls',
      'ar_experience_url', 'metaverse_preview_url'
    ]
  },
  {
    id: 'marketing',
    title: 'Marketing & SEO',
    icon: 'Megaphone',
    fields: [
      'meta_title', 'meta_description', 'meta_keywords',
      'marketing_highlights', 'target_audience', 'url_slug', 'og_title',
      'og_description', 'og_image', 'featured_project', 'construction_phase'
    ]
  }
];
