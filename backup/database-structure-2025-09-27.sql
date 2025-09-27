-- BACKUP DATABASE STRUCTURE - 2025-09-27
-- Before refactoring buildings/projects tables

-- =====================================
-- TABLE: buildings (58 columns)
-- =====================================

CREATE TABLE IF NOT EXISTS public.buildings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid,
  building_code text NOT NULL,
  building_name text,
  display_order integer DEFAULT 0,
  building_type text DEFAULT 'residential'::text,
  building_class text,
  total_floors integer NOT NULL,
  total_units integer DEFAULT 0,
  units_available integer DEFAULT 0,
  construction_status text DEFAULT 'planning'::text,
  expected_completion date,
  actual_completion date,
  energy_rating character varying,
  energy_certificate text,
  elevator_count integer DEFAULT 0,
  has_generator boolean DEFAULT false,
  has_security_system boolean DEFAULT false,
  has_cctv boolean DEFAULT false,
  has_concierge boolean DEFAULT false,
  has_solar_panels boolean DEFAULT false,
  has_pool boolean DEFAULT false,
  has_gym boolean DEFAULT false,
  has_spa boolean DEFAULT false,
  has_playground boolean DEFAULT false,
  has_garden boolean DEFAULT false,
  has_parking boolean DEFAULT false,
  parking_type text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid,
  building_amenities jsonb DEFAULT '{}'::jsonb,
  common_areas jsonb DEFAULT '{}'::jsonb,
  security_features jsonb DEFAULT '{}'::jsonb,
  wellness_facilities jsonb DEFAULT '{}'::jsonb,
  infrastructure jsonb DEFAULT '{}'::jsonb,
  outdoor_facilities jsonb DEFAULT '{}'::jsonb,
  floor_plans jsonb DEFAULT '[]'::jsonb,
  typical_floor_plan_url text,
  model_3d_url text,
  building_brochure_url text,
  wheelchair_accessible boolean DEFAULT false,
  disabled_parking_spaces integer DEFAULT 0,
  braille_signage boolean DEFAULT false,
  audio_assistance boolean DEFAULT false,
  accessible_bathrooms integer DEFAULT 0,
  ramp_access boolean DEFAULT false,
  wide_doorways boolean DEFAULT false,
  accessible_elevator boolean DEFAULT false,
  central_vacuum_system boolean DEFAULT false,
  water_softener_system boolean DEFAULT false,
  water_purification_system boolean DEFAULT false,
  smart_building_system boolean DEFAULT false,
  intercom_system boolean DEFAULT false,
  package_room boolean DEFAULT false,
  bike_storage boolean DEFAULT false,
  pet_washing_station boolean DEFAULT false,
  car_wash_area boolean DEFAULT false
);

-- =====================================
-- TABLE: projects (204 columns)
-- =====================================
-- Note: Due to size, only documenting column count
-- Full structure exists with 204 columns including:
-- - Basic info (title, description, location)
-- - Developer info
-- - Pricing and financial details
-- - SEO and marketing fields
-- - Media and documents
-- - Amenities via junction tables
-- - Construction and delivery info
-- - Golden Visa eligibility
-- - Multilingue support
-- - And much more...

-- =====================================
-- RELATIONSHIPS
-- =====================================
-- buildings.project_id REFERENCES projects(id)
-- project_amenities connects projects to amenities
-- project_nearby_amenities connects projects to nearby_amenities
-- project_images stores project images
-- building_images stores building images

-- =====================================
-- INDEXES
-- =====================================
-- Various indexes on foreign keys and frequently queried fields

-- =====================================
-- RLS (Row Level Security)
-- =====================================
-- All tables have RLS enabled with appropriate policies
