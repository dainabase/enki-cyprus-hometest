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
  has_cctv?: boolean;
  has_concierge?: boolean;
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
}

export interface BuildingFormData {
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
  has_cctv?: boolean;
  has_concierge?: boolean;
  has_pool?: boolean;
  has_gym?: boolean;
  has_spa?: boolean;
  has_playground?: boolean;
  has_garden?: boolean;
  has_parking?: boolean;
  parking_type?: 'underground' | 'outdoor' | 'covered';
  display_order?: number;
}