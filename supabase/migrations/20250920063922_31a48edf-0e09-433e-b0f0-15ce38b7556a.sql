-- ÉTAPE 2/3 : IMPORT DES DONNÉES AVEC MAPPING INTELLIGENT
-- =======================================================

-- 1. IMPORT DEVELOPERS (21 entrées)
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
  COALESCE(phone_numbers::jsonb, '[]'::jsonb),
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
  COALESCE(p.city, 'Limassol') as city, -- Défaut Limassol
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
  
  -- Prestations
  COALESCE(p.amenities::jsonb, '[]'::jsonb),
  COALESCE(p.unique_selling_points::jsonb, '[]'::jsonb),
  
  -- Statuts  
  COALESCE(p.status_project, p.status, 'planning'),
  COALESCE(p.completion_date_new, p.completion_date),
  p.construction_start,
  
  -- Financier
  COALESCE(p.price_from_new, p.price_from),
  p.price_to,
  COALESCE(p.golden_visa_eligible_new, p.golden_visa_eligible, false),
  COALESCE(p.vat_rate_new, p.vat_rate, 5.0), -- TVA par défaut 5%
  COALESCE(p.payment_plan::jsonb, '[]'::jsonb),
  p.roi_estimate_percent,
  p.rental_yield_percent,
  
  -- Légal
  p.title_deed_status,
  p.planning_permit_number,
  p.building_permit_number,
  
  -- Médias
  COALESCE(p.photos::jsonb, '[]'::jsonb),
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
WHERE p.developer_id IS NOT NULL; -- Assurer l'intégrité référentielle

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
  COALESCE(b.building_code, 'A'), -- Défaut Building A
  COALESCE(b.building_type, 'residential'),
  COALESCE(b.total_floors, 1),
  COALESCE(b.total_units, 0),
  COALESCE(b.units_available, 0),
  COALESCE(b.construction_status, 'planning'),
  COALESCE(b.energy_rating, 'B'), -- Défaut classe B
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
WHERE b.project_id IN (SELECT id FROM projects); -- Assurer l'intégrité

-- 4. IMPORT PROPERTIES (avec cascade automatique)
-- Les triggers vont automatiquement:
-- 1. Récupérer commission_rate du developer
-- 2. Récupérer vat_rate du project  
-- 3. Récupérer energy_rating du building
-- 4. Calculer golden_visa_eligible, vat_amount, price_including_vat

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
  COALESCE(p.internal_area, 100), -- Surface minimum 100m²
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

-- 5. VÉRIFICATIONS POST-IMPORT
-- Compter les enregistrements importés
SELECT 
  'Import Results' as info,
  (SELECT COUNT(*) FROM developers) as developers_count,
  (SELECT COUNT(*) FROM projects) as projects_count,
  (SELECT COUNT(*) FROM buildings) as buildings_count,
  (SELECT COUNT(*) FROM properties) as properties_count;

-- Vérifier que les cascades ont fonctionné
SELECT 
  'CASCADE CHECK' as check_type,
  COUNT(*) as total_properties,
  COUNT(CASE WHEN commission_rate IS NOT NULL THEN 1 END) as with_commission,
  COUNT(CASE WHEN vat_rate IS NOT NULL THEN 1 END) as with_vat,
  COUNT(CASE WHEN energy_rating IS NOT NULL THEN 1 END) as with_energy,
  COUNT(CASE WHEN golden_visa_eligible = true THEN 1 END) as golden_visa_count
FROM properties;

-- 6. CORRECTION SI NÉCESSAIRE
-- Si les triggers n'ont pas fonctionné, forcer la mise à jour
UPDATE properties p
SET 
  commission_rate = COALESCE(p.commission_rate, d.commission_rate),
  vat_rate = COALESCE(p.vat_rate, pr.vat_rate),
  energy_rating = COALESCE(p.energy_rating, b.energy_rating)
FROM developers d, projects pr, buildings b
WHERE p.developer_id = d.id
  AND p.project_id = pr.id
  AND p.building_id = b.id
  AND (p.commission_rate IS NULL OR p.vat_rate IS NULL OR p.energy_rating IS NULL);

-- Recalculer les compteurs si nécessaire
UPDATE projects SET 
  total_units = (SELECT COUNT(*) FROM properties WHERE project_id = projects.id),
  units_available = (SELECT COUNT(*) FROM properties WHERE project_id = projects.id AND property_status = 'available'),
  units_sold = (SELECT COUNT(*) FROM properties WHERE project_id = projects.id AND property_status = 'sold');

UPDATE buildings SET 
  total_units = (SELECT COUNT(*) FROM properties WHERE building_id = buildings.id),
  units_available = (SELECT COUNT(*) FROM properties WHERE building_id = buildings.id AND property_status = 'available');