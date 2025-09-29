export interface Building {
  id: string;
  project_id: string;
  building_name: string;
  building_type: 'apartment_building' | 'villa_complex' | 'mixed_residence' | 'residential';
  building_code?: string;
  total_floors?: number;
  total_units?: number;
  units_available?: number;
  construction_status: 'planned' | 'construction' | 'delivered';
  expected_completion?: string;
  actual_completion?: string;
  building_class?: 'A+' | 'A' | 'B' | 'C';
  energy_certificate?: string;
  elevator_count?: number;
  has_generator?: boolean;
  has_security_system?: boolean;
  has_security_24_7?: boolean;
  has_cctv?: boolean;
  has_concierge?: boolean;
  has_pool?: boolean;
  has_gym?: boolean;
  has_spa?: boolean;
  has_playground?: boolean;
  has_garden?: boolean;
  has_parking?: boolean;
  parking_type?: 'underground' | 'outdoor' | 'covered';
  
  // Additional technical fields
  has_elevator?: boolean;
  has_solar_panels?: boolean;
  energy_rating?: string;
  central_vacuum_system?: boolean;
  water_softener_system?: boolean;
  water_purification_system?: boolean;
  smart_building_system?: boolean;
  intercom_system?: boolean;
  has_intercom?: boolean;
  
  // Services & Commerce
  restaurant?: boolean;
  cafe?: boolean;
  mini_market?: boolean;
  business_center?: boolean;
  kids_club?: boolean;
  coworking_space?: boolean;
  club_house?: boolean;
  has_tennis_court?: boolean;
  beach_access?: boolean;
  marina_access?: boolean;
  golf_course?: boolean;
  sports_facilities?: boolean;
  wellness_center?: boolean;
  shuttle_service?: boolean;
  
  // Accessibility
  wheelchair_accessible?: boolean;
  disabled_parking_spaces?: number;
  braille_signage?: boolean;
  audio_assistance?: boolean;
  accessible_bathrooms?: number;
  ramp_access?: boolean;
  wide_doorways?: boolean;
  accessible_elevator?: boolean;
  
  // Storage & Utilities
  package_room?: boolean;
  bike_storage?: boolean;
  pet_washing_station?: boolean;
  car_wash_area?: boolean;
  
  // Documents
  typical_floor_plan_url?: string;
  model_3d_url?: string;
  building_brochure_url?: string;
  
  // JSONB fields
  building_amenities?: any;
  common_areas?: any;
  infrastructure?: any;
  floor_plans?: any;
  security_features?: any;
  wellness_facilities?: any;
  outdoor_facilities?: any;
  
  // Relations
  project?: {
    id: string;
    title: string;
    cyprus_zone?: string;
    city?: string;
  };
  
  display_order?: number;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export interface BuildingFormData {
  // Section 1: Informations générales
  project_id: string;
  building_name: string;
  building_type: 'apartment_building' | 'mixed_residence' | 'residential' | 'villa_complex';
  building_code?: string;
  display_order?: number;
  
  // Section 2: Structure
  construction_status: 'construction' | 'delivered' | 'planned';
  total_floors: number;
  total_units: number;
  units_available?: number;
  expected_completion?: string;
  actual_completion?: string;
  building_class?: 'A' | 'A+' | 'B' | 'C';
  
  // Section 3: Infrastructure technique  
  elevator_count?: number;
  has_elevator?: boolean;
  has_generator?: boolean;
  has_solar_panels?: boolean;
  energy_rating?: string;
  energy_certificate?: 'A+' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  central_vacuum_system?: boolean;
  water_softener_system?: boolean;
  water_purification_system?: boolean;
  smart_building_system?: boolean;
  intercom_system?: boolean;
  has_intercom?: boolean;
  
  // Section 4: Sécurité
  has_security_system?: boolean;
  has_security_24_7?: boolean;
  has_cctv?: boolean;
  has_concierge?: boolean;
  has_security_door?: boolean;
  concierge_service?: boolean;
  package_room?: boolean;
  bike_storage?: boolean;
  pet_washing_station?: boolean;
  car_wash_area?: boolean;
  
  // Section 5: Équipements communs
  has_pool?: boolean;
  has_gym?: boolean;
  has_spa?: boolean;
  has_playground?: boolean;
  has_garden?: boolean;
  has_parking?: boolean;
  parking_type?: 'covered' | 'outdoor' | 'underground';
  disabled_parking_spaces?: number;
  shuttle_service?: boolean;
  
  // Section 6: Services & Commerce
  restaurant?: boolean;
  cafe?: boolean;
  mini_market?: boolean;
  business_center?: boolean;
  kids_club?: boolean;
  coworking_space?: boolean;
  club_house?: boolean;
  
  // Section 7: Accessibilité
  wheelchair_accessible?: boolean;
  braille_signage?: boolean;
  audio_assistance?: boolean;
  accessible_bathrooms?: number;
  ramp_access?: boolean;
  wide_doorways?: boolean;
  accessible_elevator?: boolean;
  
  // Section 8: Loisirs & Sports
  has_tennis_court?: boolean;
  beach_access?: boolean;
  marina_access?: boolean;
  golf_course?: boolean;
  sports_facilities?: boolean;
  wellness_center?: boolean;
  
  // Section 9: Documents
  typical_floor_plan_url?: string;
  model_3d_url?: string;
  building_brochure_url?: string;
  floor_plans?: any;
  
  // Section 10: Données avancées (JSONB)
  building_amenities?: any;
  common_areas?: any;
  security_features?: any;
  wellness_facilities?: any;
  infrastructure?: any;
  outdoor_facilities?: any;
  
  // Metadata
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}