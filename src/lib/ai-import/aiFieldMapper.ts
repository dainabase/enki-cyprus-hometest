// Mapping exact des champs extraits vers la structure de la base de données

export interface ExtractedDeveloper {
  name: string;
  email_primary?: string;
  email_sales?: string;
  email_marketing?: string;
  phone_numbers?: string[];
  addresses?: string[];
  website?: string;
  contact_info?: any;
  main_city?: string;
  main_activities?: string;
  founded_year?: number;
  years_experience?: number;
  total_projects?: number;
  history?: string;
  key_projects?: string;
  rating_score?: number;
  rating_justification?: string;
  reputation_reviews?: string;
  financial_stability?: string;
  commission_rate?: number;
  payment_terms?: string;
  logo?: string;
  status?: string;
}

export interface ExtractedProject {
  // Core fields
  title: string;
  description: string;
  detailed_description?: string;
  subtitle?: string;
  
  // Location
  location: any;
  full_address?: string;
  city?: string;
  region?: string;
  neighborhood?: string;
  neighborhood_description?: string;
  cyprus_zone?: string;
  gps_latitude?: number;
  gps_longitude?: number;
  
  // Proximity
  proximity_sea_km?: number;
  proximity_airport_km?: number;
  proximity_city_center_km?: number;
  proximity_highway_km?: number;
  
  // Pricing
  price: number;
  price_from?: string;
  price_from_new?: number;
  price_to?: number;
  price_per_m2?: number;
  vat_rate?: number;
  vat_rate_new?: number;
  vat_included?: boolean;
  
  // Investment
  golden_visa_eligible?: boolean;
  golden_visa_eligible_new?: boolean;
  rental_yield_percent?: number;
  roi_estimate_percent?: number;
  financing_available?: boolean;
  financing_options?: any;
  payment_plan?: any;
  
  // Property types
  property_types?: string[];
  property_sub_type?: string[];
  property_category?: string;
  bedrooms_range?: string;
  bathrooms_range?: string;
  
  // Areas - FIXED: Removed floors_total and storage_spaces as they don't exist in DB
  built_area_m2?: number;
  land_area_m2?: number;
  parking_spaces?: number;
  
  // Units
  total_units?: number;
  total_units_new?: number;
  units_available?: number;
  units_available_new?: number;
  units_sold?: number;
  
  // Status & Timeline
  status: string;
  project_status?: string;
  construction_phase?: string;
  construction_start?: string;
  construction_year?: number;
  completion_date?: string;
  completion_date_new?: string;
  
  // Legal
  title_deed_status?: string;
  title_deed_available?: boolean;
  title_deed_timeline?: string;
  legal_status?: string;
  permits_obtained?: string[];
  
  // Features
  features: string[];
  amenities?: string[];
  lifestyle_amenities?: string[];
  community_features?: string[];
  wellness_features?: string[];
  
  // Quality
  energy_rating?: string;
  building_certification?: string;
  sustainability_certifications?: string[];
  
  // Media
  photos: string[];
  photo_count?: number;
  floor_plan_urls?: string[];
  virtual_tour_url?: string;
  video_url?: string;
  
  // SEO
  meta_title?: string;
  meta_description?: string;
  url_slug?: string;
  marketing_highlights?: string[];
  unique_selling_points?: string[];
}

export interface ExtractedBuilding {
  name: string;
  building_type?: string;
  total_floors?: number;
  total_units?: number;
  construction_status?: string;
  energy_rating?: string;
}

export interface ExtractedProperty {
  unit_number: string;
  building_name?: string;
  type: string;
  floor: number;
  bedrooms: number;
  bathrooms: number;
  size_m2: number;
  balcony_m2?: number;
  terrace_m2?: number;
  garden_m2?: number;
  parking_spaces?: number;
  storage_units?: number;
  price: number;
  vat_rate?: number;
  price_with_vat?: number;
  commission_rate?: number;
  is_golden_visa?: boolean;
  view_type?: string;
  orientation?: string;
  has_sea_view?: boolean;
  has_mountain_view?: boolean;
  has_pool_access?: boolean;
  has_gym_access?: boolean;
  is_furnished?: boolean;
  featured_image?: string;
  gallery_images?: string[];
  floor_plan_url?: string;
  virtual_tour_url?: string;
  status: string;
  
  // NOUVEAUX CHAMPS CYPRUS (Étape 2)
  title_deed_number?: string;
  energy_certificate_rating?: string;
  property_tax_yearly?: number;
  transfer_fee_percentage?: number;
  stamp_duty_percentage?: number;
  legal_fees_percentage?: number;
  immovable_property_tax?: number;
  sewerage_levy?: number;
  plot_m2?: number;
  covered_veranda_m2?: number;
  uncovered_veranda_m2?: number;
  basement_m2?: number;
  attic_m2?: number;
  has_underfloor_heating?: boolean;
  has_central_heating?: boolean;
  has_air_conditioning?: boolean;
  has_solar_panels?: boolean;
  has_pressurized_water?: boolean;
  has_electric_gates?: boolean;
  has_alarm_system?: boolean;
  internet_ready?: boolean;
}

export interface ExtractionResult {
  extraction_metadata: {
    confidence_score: number;
    document_type: string;
    pages_analyzed: number;
    extraction_timestamp: string;
    ai_model: string;
    warnings: string[];
  };
  developer: ExtractedDeveloper;
  project: ExtractedProject;
  buildings: ExtractedBuilding[];
  properties: ExtractedProperty[];
  statistics: {
    total_properties: number;
    golden_visa_eligible: number;
    total_portfolio_value: number;
    average_price: number;
    average_size_m2?: number;
    price_range: {
      min: number;
      max: number;
    };
    types_distribution: Record<string, number>;
    availability: {
      available: number;
      reserved: number;
      sold: number;
    };
  };
  validation_errors: Array<{
    field: string;
    unit?: string;
    message: string;
  }>;
}

// Mapping functions pour convertir les données extraites vers les tables DB

export function mapDeveloperToDatabase(extracted: ExtractedDeveloper) {
  return {
    name: extracted.name,
    email_primary: extracted.email_primary || null,
    email_sales: extracted.email_sales || null,
    email_marketing: extracted.email_marketing || null,
    phone_numbers: extracted.phone_numbers || null,
    addresses: extracted.addresses || null,
    website: extracted.website || null,
    contact_info: extracted.contact_info || {},
    main_city: extracted.main_city || null,
    main_activities: extracted.main_activities || null,
    founded_year: extracted.founded_year || null,
    years_experience: extracted.years_experience || null,
    total_projects: extracted.total_projects || null,
    history: extracted.history || null,
    key_projects: extracted.key_projects || null,
    rating_score: extracted.rating_score || null,
    rating_justification: extracted.rating_justification || null,
    reputation_reviews: extracted.reputation_reviews || null,
    financial_stability: extracted.financial_stability || null,
    commission_rate: extracted.commission_rate || 3.00,
    payment_terms: extracted.payment_terms || null,
    logo: extracted.logo || null,
    status: extracted.status || 'active'
  };
}

export function mapProjectToDatabase(extracted: ExtractedProject, developerId: string) {
  return {
    developer_id: developerId,
    title: extracted.title,
    description: extracted.description,
    detailed_description: extracted.detailed_description || null,
    subtitle: extracted.subtitle || null,
    location: extracted.location,
    full_address: extracted.full_address || null,
    city: extracted.city || null,
    region: extracted.region || null,
    neighborhood: extracted.neighborhood || null,
    neighborhood_description: extracted.neighborhood_description || null,
    cyprus_zone: extracted.cyprus_zone || 'limassol',
    gps_latitude: extracted.gps_latitude || null,
    gps_longitude: extracted.gps_longitude || null,
    proximity_sea_km: extracted.proximity_sea_km || null,
    proximity_airport_km: extracted.proximity_airport_km || null,
    proximity_city_center_km: extracted.proximity_city_center_km || null,
    proximity_highway_km: extracted.proximity_highway_km || null,
    price: extracted.price,
    price_from: extracted.price_from || null,
    price_from_new: extracted.price_from_new || null,
    price_to: extracted.price_to || null,
    price_per_m2: extracted.price_per_m2 || null,
    vat_rate: extracted.vat_rate || 5.00,
    vat_rate_new: extracted.vat_rate_new || null,
    vat_included: extracted.vat_included || false,
    golden_visa_eligible: extracted.golden_visa_eligible || (extracted.price >= 300000),
    golden_visa_eligible_new: extracted.golden_visa_eligible_new || null,
    rental_yield_percent: extracted.rental_yield_percent || null,
    roi_estimate_percent: extracted.roi_estimate_percent || null,
    financing_available: extracted.financing_available || false,
    financing_options: extracted.financing_options || null,
    payment_plan: extracted.payment_plan || null,
    property_types: extracted.property_types || [],
    property_sub_type: extracted.property_sub_type || null,
    property_category: extracted.property_category || null,
    bedrooms_range: extracted.bedrooms_range || null,
    bathrooms_range: extracted.bathrooms_range || null,
    built_area_m2: extracted.built_area_m2 || null,
    land_area_m2: extracted.land_area_m2 || null,
    // FIXED: Removed floors_total and storage_spaces as they don't exist in projects table
    parking_spaces: extracted.parking_spaces || null,
    total_units: extracted.total_units || null,
    total_units_new: extracted.total_units_new || null,
    units_available: extracted.units_available || null,
    units_available_new: extracted.units_available_new || null,
    units_sold: extracted.units_sold || null,
    status: extracted.status || 'under_construction',
    project_status: extracted.project_status || 'planned',
    construction_phase: extracted.construction_phase || 'planned',
    construction_start: extracted.construction_start || null,
    construction_year: extracted.construction_year || null,
    completion_date: extracted.completion_date || null,
    completion_date_new: extracted.completion_date_new || null,
    title_deed_status: extracted.title_deed_status || 'pending',
    title_deed_available: extracted.title_deed_available || false,
    title_deed_timeline: extracted.title_deed_timeline || null,
    legal_status: extracted.legal_status || null,
    permits_obtained: extracted.permits_obtained || null,
    features: extracted.features || [],
    amenities: extracted.amenities || [],
    lifestyle_amenities: extracted.lifestyle_amenities || null,
    community_features: extracted.community_features || null,
    wellness_features: extracted.wellness_features || null,
    energy_rating: extracted.energy_rating || null,
    building_certification: extracted.building_certification || null,
    sustainability_certifications: extracted.sustainability_certifications || null,
    photos: extracted.photos || [],
    photo_count: extracted.photo_count || 0,
    floor_plan_urls: extracted.floor_plan_urls || null,
    virtual_tour_url: extracted.virtual_tour_url || null,
    video_url: extracted.video_url || null,
    meta_title: extracted.meta_title || null,
    meta_description: extracted.meta_description || null,
    url_slug: extracted.url_slug || null,
    marketing_highlights: extracted.marketing_highlights || null,
    unique_selling_points: extracted.unique_selling_points || null
  };
}

export function mapBuildingToDatabase(extracted: ExtractedBuilding, projectId: string) {
  return {
    project_id: projectId,
    name: extracted.name,
    building_type: extracted.building_type || 'residential',
    total_floors: extracted.total_floors || 1,
    total_units: extracted.total_units || 1,
    construction_status: extracted.construction_status || 'planned',
    energy_rating: extracted.energy_rating || null
  };
}

export function mapPropertyToDatabase(
  extracted: ExtractedProperty, 
  developerId: string, 
  projectId: string, 
  buildingId: string
) {
  return {
    developer_id: developerId,
    project_id: projectId,
    building_id: buildingId,
    unit_number: extracted.unit_number,
    type: extracted.type,
    floor: extracted.floor,
    bedrooms: extracted.bedrooms,
    bathrooms: extracted.bathrooms,
    size_m2: extracted.size_m2,
    balcony_m2: extracted.balcony_m2 || null,
    terrace_m2: extracted.terrace_m2 || null,
    garden_m2: extracted.garden_m2 || null,
    parking_spaces: extracted.parking_spaces || null,
    storage_units: extracted.storage_units || null,
    price: extracted.price,
    vat_rate: extracted.vat_rate || 5.00,
    price_with_vat: extracted.price_with_vat || extracted.price * (1 + (extracted.vat_rate || 5.00) / 100),
    commission_rate: extracted.commission_rate || 3.00,
    is_golden_visa: extracted.is_golden_visa ?? (extracted.price >= 300000),
    view_type: extracted.view_type || null,
    orientation: extracted.orientation || null,
    has_sea_view: extracted.has_sea_view || false,
    has_mountain_view: extracted.has_mountain_view || false,
    has_pool_access: extracted.has_pool_access || false,
    has_gym_access: extracted.has_gym_access || false,
    is_furnished: extracted.is_furnished || false,
    featured_image: extracted.featured_image || null,
    gallery_images: extracted.gallery_images || null,
    floor_plan_url: extracted.floor_plan_url || null,
    virtual_tour_url: extracted.virtual_tour_url || null,
    status: extracted.status || 'available',
    
    // NOUVEAUX CHAMPS CYPRUS (Étape 2)
    title_deed_number: extracted.title_deed_number || null,
    energy_certificate_rating: extracted.energy_certificate_rating || null,
    property_tax_yearly: extracted.property_tax_yearly || null,
    transfer_fee_percentage: extracted.transfer_fee_percentage || 3.00,
    stamp_duty_percentage: extracted.stamp_duty_percentage || 0.15,
    legal_fees_percentage: extracted.legal_fees_percentage || 1.00,
    immovable_property_tax: extracted.immovable_property_tax || null,
    sewerage_levy: extracted.sewerage_levy || null,
    plot_m2: extracted.plot_m2 || null,
    covered_veranda_m2: extracted.covered_veranda_m2 || null,
    uncovered_veranda_m2: extracted.uncovered_veranda_m2 || null,
    basement_m2: extracted.basement_m2 || null,
    attic_m2: extracted.attic_m2 || null,
    has_underfloor_heating: extracted.has_underfloor_heating || false,
    has_central_heating: extracted.has_central_heating || false,
    has_air_conditioning: extracted.has_air_conditioning || false,
    has_solar_panels: extracted.has_solar_panels || false,
    has_pressurized_water: extracted.has_pressurized_water || false,
    has_electric_gates: extracted.has_electric_gates || false,
    has_alarm_system: extracted.has_alarm_system || false,
    internet_ready: extracted.internet_ready ?? true
  };
}

// Fonctions de validation
export function validateExtractedData(data: any): string[] {
  const errors: string[] = [];
  
  // Validation developer
  if (!data.developer?.name) {
    errors.push('Developer name is required');
  }
  
  // Validation project
  if (!data.project?.title) {
    errors.push('Project title is required');
  }
  if (!data.project?.description) {
    errors.push('Project description is required');
  }
  if (!data.project?.price || data.project.price <= 0) {
    errors.push('Project price must be greater than 0');
  }
  
  // Validation properties
  if (data.properties && Array.isArray(data.properties)) {
    data.properties.forEach((prop: any, index: number) => {
      if (!prop.unit_number) {
        errors.push(`Property ${index + 1}: unit_number is required`);
      }
      if (!prop.type) {
        errors.push(`Property ${prop.unit_number || index + 1}: type is required`);
      }
      if (prop.bedrooms === undefined || prop.bedrooms < 0) {
        errors.push(`Property ${prop.unit_number || index + 1}: bedrooms must be >= 0`);
      }
      if (!prop.size_m2 || prop.size_m2 <= 0) {
        errors.push(`Property ${prop.unit_number || index + 1}: size_m2 must be > 0`);
      }
      if (!prop.price || prop.price <= 0) {
        errors.push(`Property ${prop.unit_number || index + 1}: price must be > 0`);
      }
    });
  }
  
  return errors;
}

// Enrichissement automatique des données
export function enrichExtractedData(data: any): any {
  const enriched = { ...data };
  
  // Enrichir les propriétés
  if (enriched.properties && Array.isArray(enriched.properties)) {
    enriched.properties = enriched.properties.map((prop: any) => {
      // Golden Visa automatique
      if (prop.price && !prop.is_golden_visa) {
        prop.is_golden_visa = prop.price >= 300000;
      }
      
      // TVA si manquante
      if (!prop.vat_rate) {
        prop.vat_rate = prop.type === 'commercial' ? 19.00 : 5.00;
      }
      
      // Prix avec TVA si manquant
      if (prop.price && !prop.price_with_vat) {
        prop.price_with_vat = Math.round(prop.price * (1 + prop.vat_rate / 100));
      }
      
      // Estimation salles de bain si manquantes
      if (prop.bedrooms !== undefined && !prop.bathrooms) {
        prop.bathrooms = Math.max(1, Math.floor(prop.bedrooms / 2));
      }
      
      // Estimation parking si manquant
      if (!prop.parking_spaces) {
        prop.parking_spaces = prop.bedrooms <= 1 ? 1 : 2;
      }
      
      return prop;
    });
  }
  
  // Enrichir le projet
  if (enriched.project && !enriched.project.golden_visa_eligible) {
    enriched.project.golden_visa_eligible = enriched.project.price >= 300000;
  }
  
  return enriched;
}
