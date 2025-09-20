-- ÉTAPE 2/3 : IMPORT DES DONNÉES AVEC MAPPING INTELLIGENT (CORRIGÉ)
-- =======================================================

-- 1. IMPORT DEVELOPERS (21 entrées) - CORRECTED TYPE CASTING
INSERT INTO developers (
  id, name, logo, commission_rate, website, phone_numbers,
  email_primary, email_sales, email_marketing, main_city, 
  founded_year, years_experience, total_projects, rating_score,
  payment_terms, status, company_registration_number, vat_number,
  license_number, insurance_coverage, bank_guarantee,
  created_at, updated_at
)
SELECT 
  id, name, logo, 
  COALESCE(commission_rate, 5.0), -- Défaut 5% si null
  website, 
  -- Fix type casting for phone_numbers
  CASE 
    WHEN phone_numbers IS NOT NULL 
    THEN array_to_json(phone_numbers)::jsonb 
    ELSE '[]'::jsonb 
  END as phone_numbers,
  email_primary, email_sales, email_marketing, main_city,
  founded_year, years_experience, total_projects, rating_score,
  payment_terms, 
  COALESCE(status, 'active'),
  company_registration_number, vat_number, license_number,
  insurance_coverage, bank_guarantee,
  created_at, updated_at
FROM backup_developers_20250119;

-- 2. IMPORT PROJECTS (3 entrées avec mapping complexe)
INSERT INTO projects (
  id, developer_id, title, subtitle, description, detailed_description,
  
  -- Localisation
  city, region, neighborhood, full_address, cyprus_zone,
  gps_latitude, gps_longitude,
  proximity_sea_km, proximity_airport_km, proximity_city_center_km, proximity_highway_km,
  
  -- Dimensions
  land_area_m2, built_area_m2, total_units, units_available,
  
  -- Prestations
  amenities, unique_selling_points,
  
  -- Statuts
  status, completion_date, construction_start,
  
  -- Financier
  price_from, price_to, golden_visa_eligible,
  vat_rate, payment_plan, roi_estimate_percent, rental_yield_percent,
  
  -- Légal
  title_deed_status, planning_permit_number, building_permit_number,
  
  -- Médias
  photos, virtual_tour_url, video_url,
  
  -- SEO
  meta_title, meta_description, url_slug,
  
  -- Tracking
  view_count, featured_property,
  
  created_at, updated_at
)
SELECT 
  p.id, 
  p.developer_id,
  p.title,
  p.subtitle,
  p.description,
  p.detailed_description,
  
  -- Localisation
  COALESCE(p.city, 'Limassol') as city,
  p.region,
  p.neighborhood,
  p.full_address,
  p.cyprus_zone,
  p.gps_latitude,
  p.gps_longitude,
  p.proximity_sea_km,
  p.proximity_airport_km,
  p.proximity_city_center_km,
  p.proximity_highway_km,
  
  -- Dimensions
  p.land_area_m2,
  p.built_area_m2,
  COALESCE(p.total_units_new, p.total_units, 0),
  COALESCE(p.units_available_new, p.units_available, 0),
  
  -- Prestations - Handle array to jsonb conversion
  CASE 
    WHEN p.amenities IS NOT NULL 
    THEN array_to_json(p.amenities)::jsonb 
    ELSE '[]'::jsonb 
  END as amenities,
  CASE 
    WHEN p.unique_selling_points IS NOT NULL 
    THEN array_to_json(p.unique_selling_points)::jsonb 
    ELSE '[]'::jsonb 
  END as unique_selling_points,
  
  -- Statuts  
  COALESCE(p.status_project, p.status, 'planning'),
  COALESCE(p.completion_date_new, p.completion_date),
  p.construction_start,
  
  -- Financier
  COALESCE(p.price_from_new, p.price_from),
  p.price_to,
  COALESCE(p.golden_visa_eligible_new, p.golden_visa_eligible, false),
  COALESCE(p.vat_rate_new, p.vat_rate, 5.0),
  COALESCE(p.payment_plan::jsonb, '[]'::jsonb),
  p.roi_estimate_percent,
  p.rental_yield_percent,
  
  -- Légal
  p.title_deed_status,
  p.planning_permit_number,
  p.building_permit_number,
  
  -- Médias - Handle array to jsonb conversion
  CASE 
    WHEN p.photos IS NOT NULL 
    THEN array_to_json(p.photos)::jsonb 
    ELSE '[]'::jsonb 
  END as photos,
  COALESCE(p.virtual_tour_url_new, p.virtual_tour_url),
  p.video_url,
  
  -- SEO
  COALESCE(p.meta_title_new, p.meta_title),
  COALESCE(p.meta_description_new, p.meta_description),
  p.url_slug,
  
  -- Tracking
  COALESCE(p.view_count_new, p.view_count, 0),
  COALESCE(p.featured_new, p.featured_property, false),
  
  p.created_at,
  p.updated_at
FROM backup_projects_20250119 p
WHERE p.developer_id IS NOT NULL;

-- 3. IMPORT BUILDINGS (3 entrées)
INSERT INTO buildings (
  id, project_id, name, building_code, 
  building_type, total_floors, total_units, units_available,
  construction_status, energy_rating, energy_certificate,
  elevator_count,
  has_generator, has_security_system, has_cctv, has_concierge,
  has_solar_panels, has_pool, has_gym, has_spa,
  has_playground, has_garden, has_parking, parking_type,
  expected_completion, actual_completion,
  created_at, updated_at, created_by
)
SELECT
  b.id,
  b.project_id,
  COALESCE(b.building_name, b.name, 'Building ' || COALESCE(b.building_code, 'A')),
  COALESCE(b.building_code, 'A'),
  COALESCE(b.building_type, 'residential'),
  COALESCE(b.total_floors, 1),
  COALESCE(b.total_units, 0),
  COALESCE(b.units_available, 0),
  COALESCE(b.construction_status, 'planning'),
  COALESCE(b.energy_rating, 'B'),
  b.energy_certificate,
  COALESCE(b.elevator_count, 0),
  COALESCE(b.has_generator, false),
  COALESCE(b.has_security_system, false),
  COALESCE(b.has_cctv, false),
  COALESCE(b.has_concierge, false),
  COALESCE(b.has_solar_panels, false),
  COALESCE(b.has_pool, false),
  COALESCE(b.has_gym, false),
  COALESCE(b.has_spa, false),
  COALESCE(b.has_playground, false),
  COALESCE(b.has_garden, false),
  COALESCE(b.has_parking, false),
  b.parking_type,
  b.expected_completion,
  b.actual_completion,
  b.created_at,
  b.updated_at,
  b.created_by
FROM backup_buildings_20250119 b
WHERE b.project_id IN (SELECT id FROM projects);

-- 4. IMPORT PROPERTIES (avec cascade automatique)
INSERT INTO properties (
  id, project_id, building_id, developer_id,
  property_code, unit_number,
  property_type, property_sub_type, property_status,
  floor_number, orientation,
  
  -- Surfaces
  internal_area, covered_verandas, balcony_area,
  private_garden_area, roof_garden_area,
  
  -- Configuration
  bedrooms_count, bathrooms_count, wc_count,
  
  -- Prix (les triggers vont calculer le reste)
  price_excluding_vat,
  
  -- Parking
  parking_spaces, parking_type_unit,
  
  -- Vues
  has_sea_view, has_mountain_view, has_city_view,
  
  -- État
  is_available,
  is_furnished,
  
  created_at, updated_at
)
SELECT
  p.id,
  p.project_id,
  p.building_id, 
  p.developer_id,
  COALESCE(p.property_code, p.project_id::text || '-' || p.unit_number),
  COALESCE(p.unit_number, 'U001'),
  COALESCE(p.property_type, 'apartment'),
  p.property_sub_type,
  COALESCE(p.property_status, 'available'),
  p.floor_number,
  p.orientation,
  
  -- Surfaces
  COALESCE(p.internal_area, 100),
  p.covered_verandas,
  p.balcony_area,
  p.private_garden_area,
  p.roof_garden_area,
  
  -- Configuration
  COALESCE(p.bedrooms_count, 2),
  COALESCE(p.bathrooms_count, 1),
  COALESCE(p.wc_count, 0),
  
  -- Prix
  COALESCE(p.price_excluding_vat, p.current_price, p.original_price, 250000),
  
  -- Parking
  COALESCE(p.parking_spaces, 0),
  p.parking_type_unit,
  
  -- Vues
  COALESCE(p.has_sea_view, false),
  COALESCE(p.has_mountain_view, false), 
  COALESCE(p.has_city_view, false),
  
  -- État
  COALESCE(p.is_available, true),
  COALESCE(p.is_furnished, false),
  
  p.created_at,
  p.updated_at
FROM backup_properties_20250119 p
WHERE p.project_id IN (SELECT id FROM projects)
  AND p.building_id IN (SELECT id FROM buildings)
  AND p.developer_id IN (SELECT id FROM developers);

-- Si aucune property dans le backup, créer 3 properties test
INSERT INTO properties (
  project_id, building_id, developer_id,
  property_code, unit_number,
  property_type, property_status,
  floor_number, internal_area,
  bedrooms_count, bathrooms_count,
  price_excluding_vat
)
SELECT 
  p.id as project_id,
  b.id as building_id,
  p.developer_id,
  p.id::text || '-PH0' || row_number() OVER () as property_code,
  'PH0' || row_number() OVER () as unit_number,
  'penthouse' as property_type,
  'available' as property_status,
  5 as floor_number,
  150 as internal_area,
  3 as bedrooms_count,
  2 as bathrooms_count,
  350000 as price_excluding_vat
FROM projects p
JOIN buildings b ON b.project_id = p.id
WHERE NOT EXISTS (SELECT 1 FROM properties)
LIMIT 3;