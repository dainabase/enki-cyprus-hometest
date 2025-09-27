// BACKUP TYPESCRIPT TYPES - 2025-09-27
// Before refactoring buildings/projects tables

// =====================================
// TYPE: Building (from src/types/building.ts)
// =====================================

export interface Building {
  id: string;
  project_id: string;
  building_name: string;
  building_type: 'apartment_building' | 'villa_complex' | 'mixed_residence' | 'residential';
  building_code?: string;  // INCOHÉRENCE: Optional in TS but NOT NULL in DB
  total_floors?: number;
  total_units?: number;
  units_available?: number;
  construction_status: 'planned' | 'construction' | 'delivered';  // INCOHÉRENCE: 'planned' vs 'planning' in DB
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

// NOTE: Missing 30+ fields from database including:
// - has_solar_panels
// - building_amenities (jsonb)
// - common_areas (jsonb)
// - security_features (jsonb)
// - wellness_facilities (jsonb)
// - infrastructure (jsonb)
// - outdoor_facilities (jsonb)
// - floor_plans (jsonb)
// - typical_floor_plan_url
// - model_3d_url
// - building_brochure_url
// - All accessibility fields (wheelchair_accessible, etc.)
// - All system fields (central_vacuum_system, etc.)

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

// =====================================
// TYPE: Project (204+ fields in DB)
// =====================================
// Note: Project type is very large and managed through multiple files
// Main structure includes:
// - Basic info (title, description, etc.)
// - Developer relationship
// - Location and address
// - Pricing and financial details
// - SEO fields
// - Marketing content
// - Construction timeline
// - Golden Visa eligibility
// - Amenities (via junction tables)
// - Media and documents
// - Multilingual support
// - And much more...
