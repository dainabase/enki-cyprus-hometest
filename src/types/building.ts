export interface Building {
  id: string;
  project_id: string;
  building_name: string;
  building_type: 'apartment_building' | 'villa_complex' | 'mixed_residence' | 'residential';
  building_code: string; // Fixed: Now required to match DB (NOT NULL)
  total_floors: number; // Fixed: Now required to match DB (NOT NULL)
  total_units?: number;
  units_available?: number;
  construction_status: 'planning' | 'construction' | 'delivered'; // Fixed: 'planning' to match DB default
  expected_completion?: string;
  actual_completion?: string;
  building_class?: 'A+' | 'A' | 'B' | 'C';
  energy_certificate?: string;
  energy_rating?: string; // Added missing field
  elevator_count?: number;
  has_generator?: boolean;
  has_security_system?: boolean;
  has_cctv?: boolean;
  has_concierge?: boolean;
  has_solar_panels?: boolean; // Added missing field
  has_pool?: boolean;
  has_gym?: boolean;
  has_spa?: boolean;
  has_playground?: boolean;
  has_garden?: boolean;
  has_parking?: boolean;
  parking_type?: 'underground' | 'outdoor' | 'covered';
  display_order?: number;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  // JSONB fields from database
  building_amenities?: Record<string, any>;
  common_areas?: Record<string, any>;
  security_features?: Record<string, any>;
  wellness_facilities?: Record<string, any>;
  infrastructure?: Record<string, any>;
  outdoor_facilities?: Record<string, any>;
  floor_plans?: Array<any>;
  // Document URLs
  typical_floor_plan_url?: string;
  model_3d_url?: string;
  building_brochure_url?: string;
  // Accessibility features
  wheelchair_accessible?: boolean;
  disabled_parking_spaces?: number;
  ramp_access?: boolean;
  wide_doorways?: boolean;
  accessible_elevator?: boolean;
}

export interface BuildingFormData {
  building_name: string;
  building_type: 'apartment_building' | 'villa_complex' | 'mixed_residence' | 'residential';
  building_code: string; // Fixed: Now required to match DB
  total_floors: number; // Fixed: Now required to match DB
  total_units?: number;
  units_available?: number;
  construction_status: 'planning' | 'construction' | 'delivered'; // Fixed: 'planning' to match DB
  expected_completion?: string;
  actual_completion?: string;
  building_class?: 'A+' | 'A' | 'B' | 'C';
  energy_certificate?: string;
  energy_rating?: string; // Added missing field
  elevator_count?: number;
  has_generator?: boolean;
  has_security_system?: boolean;
  has_cctv?: boolean;
  has_concierge?: boolean;
  has_solar_panels?: boolean; // Added missing field
  has_pool?: boolean;
  has_gym?: boolean;
  has_spa?: boolean;
  has_playground?: boolean;
  has_garden?: boolean;
  has_parking?: boolean;
  parking_type?: 'underground' | 'outdoor' | 'covered';
  display_order?: number;
  // JSONB fields
  building_amenities?: Record<string, any>;
  common_areas?: Record<string, any>;
  security_features?: Record<string, any>;
  wellness_facilities?: Record<string, any>;
  infrastructure?: Record<string, any>;
  outdoor_facilities?: Record<string, any>;
  floor_plans?: Array<any>;
  // Document URLs
  typical_floor_plan_url?: string;
  model_3d_url?: string;
  building_brochure_url?: string;
  // Accessibility features
  wheelchair_accessible?: boolean;
  disabled_parking_spaces?: number;
  ramp_access?: boolean;
  wide_doorways?: boolean;
  accessible_elevator?: boolean;
}
