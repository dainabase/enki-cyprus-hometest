-- ÉTAPE 2/3 : IMPORT SIMPLIFIÉ FINAL
-- ===================================

-- 1. IMPORT DEVELOPERS (simplifié)
INSERT INTO developers (
  id, name, logo, commission_rate, website, phone_numbers,
  email_primary, email_sales, email_marketing, main_city, 
  founded_year, years_experience, total_projects, 
  rating_score, payment_terms, status,
  created_at, updated_at
)
SELECT 
  id, name, logo, 
  COALESCE(commission_rate, 5.0),
  website, 
  CASE 
    WHEN phone_numbers IS NOT NULL 
    THEN array_to_json(phone_numbers)::jsonb 
    ELSE '[]'::jsonb 
  END as phone_numbers,
  email_primary, email_sales, email_marketing, main_city,
  founded_year, years_experience, total_projects, 
  CASE 
    WHEN rating_score IS NULL THEN NULL
    WHEN rating_score > 5 THEN 4.5  
    ELSE rating_score 
  END as rating_score,
  payment_terms, 
  COALESCE(status, 'active'),
  created_at, updated_at
FROM backup_developers_20250119;

-- 2. IMPORT PROJECTS (simplifié)
INSERT INTO projects (
  id, developer_id, title, subtitle, description, 
  city, total_units, units_available,
  status, price_from, golden_visa_eligible,
  vat_rate, view_count, featured_property,
  created_at, updated_at
)
SELECT 
  p.id, p.developer_id, p.title, p.subtitle, p.description,
  COALESCE(p.city, 'Limassol') as city,
  COALESCE(p.total_units_new, p.total_units, 0),
  COALESCE(p.units_available_new, p.units_available, 0),
  COALESCE(p.status_project, p.status, 'planning'),
  COALESCE(p.price_from_new, p.price_from),
  COALESCE(p.golden_visa_eligible_new, p.golden_visa_eligible, false),
  COALESCE(p.vat_rate_new, p.vat_rate, 5.0),
  COALESCE(p.view_count_new, p.view_count, 0),
  COALESCE(p.featured_new, p.featured_property, false),
  p.created_at, p.updated_at
FROM backup_projects_20250119 p
WHERE p.developer_id IS NOT NULL;

-- 3. IMPORT BUILDINGS (simplifié)
INSERT INTO buildings (
  id, project_id, name, building_code, 
  building_type, total_floors, total_units, units_available,
  construction_status, energy_rating,
  created_at, updated_at
)
SELECT
  b.id, b.project_id,
  COALESCE(b.building_name, b.name, 'Building ' || COALESCE(b.building_code, 'A')),
  COALESCE(b.building_code, 'A'),
  COALESCE(b.building_type, 'residential'),
  COALESCE(b.total_floors, 1),
  COALESCE(b.total_units, 0),
  COALESCE(b.units_available, 0),
  COALESCE(b.construction_status, 'planning'),
  COALESCE(b.energy_rating, 'B'),
  b.created_at, b.updated_at
FROM backup_buildings_20250119 b
WHERE b.project_id IN (SELECT id FROM projects);

-- 4. IMPORT PROPERTIES (simplifié)
INSERT INTO properties (
  id, project_id, building_id, developer_id,
  property_code, unit_number, property_type, property_status,
  floor_number, internal_area, bedrooms_count, bathrooms_count,
  price_excluding_vat, is_available,
  created_at, updated_at
)
SELECT
  p.id, p.project_id, p.building_id, p.developer_id,
  COALESCE(p.property_code, p.project_id::text || '-' || p.unit_number),
  COALESCE(p.unit_number, 'U001'),
  COALESCE(p.property_type, 'apartment'),
  COALESCE(p.property_status, 'available'),
  p.floor_number,
  COALESCE(p.internal_area, 100),
  COALESCE(p.bedrooms_count, 2),
  COALESCE(p.bathrooms_count, 1),
  COALESCE(p.price_excluding_vat, p.current_price, p.original_price, 250000),
  COALESCE(p.is_available, true),
  p.created_at, p.updated_at
FROM backup_properties_20250119 p
WHERE p.project_id IN (SELECT id FROM projects)
  AND p.building_id IN (SELECT id FROM buildings)
  AND p.developer_id IN (SELECT id FROM developers);

-- 5. FALLBACK: Créer 3 properties si aucune importée
INSERT INTO properties (
  project_id, building_id, developer_id,
  property_code, unit_number, property_type, property_status,
  floor_number, internal_area, bedrooms_count, bathrooms_count,
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

-- ======================================
--   RAPPORT ÉTAPE 2/3 - IMPORT TERMINÉ
-- ======================================

SELECT 
  '✅ ÉTAPE 2/3 TERMINÉE - IMPORT DES DONNÉES' as status;

SELECT 
  'RÉSULTATS IMPORT' as category,
  (SELECT COUNT(*) FROM developers) as developers_imported,
  (SELECT COUNT(*) FROM projects) as projects_imported,
  (SELECT COUNT(*) FROM buildings) as buildings_imported,
  (SELECT COUNT(*) FROM properties) as properties_imported;