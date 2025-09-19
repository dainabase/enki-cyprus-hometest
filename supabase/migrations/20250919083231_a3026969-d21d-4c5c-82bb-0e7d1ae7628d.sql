-- ÉTAPE 1: DIAGNOSTIC DES COLONNES EXACTES
-- Voir TOUTES les colonnes de la table projects originale
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'projects'
ORDER BY ordinal_position;

-- Voir ce qui existe vraiment dans les données
SELECT 
    id,
    developer_id,
    title,
    url_slug,
    description,
    city,
    region,
    cyprus_zone,
    full_address,
    gps_latitude,
    gps_longitude,
    project_status,
    construction_phase,
    launch_date,
    completion_date,
    price_from,
    price_to,
    photos,
    plans,
    virtual_tour,
    meta_title,
    meta_description
FROM projects
LIMIT 1;

-- ÉTAPE 2: MIGRATION CORRIGÉE DES PROJETS
-- VIDER d'abord la table si tentative précédente
TRUNCATE TABLE projects_clean CASCADE;

-- Migration avec gestion des NULL et conversions
INSERT INTO projects_clean (
    id,
    developer_id,
    title,
    slug,
    description,
    city,
    region,
    zone,
    address,
    latitude,
    longitude,
    status,
    phase,
    launch_date,
    completion_date,
    price_range_min,
    price_range_max,
    photos,
    plans,
    virtual_tour_url,
    meta_title,
    meta_description,
    created_at,
    updated_at
)
SELECT 
    id,
    developer_id,
    COALESCE(title, 'Sans titre'),
    COALESCE(url_slug, LOWER(REPLACE(title, ' ', '-'))),
    description,
    COALESCE(city, 'Limassol'),
    region,
    cyprus_zone,
    full_address,
    CAST(gps_latitude AS DECIMAL(10,8)),
    CAST(gps_longitude AS DECIMAL(11,8)),
    COALESCE(project_status, 'planning'),
    construction_phase,
    CASE 
        WHEN launch_date IS NOT NULL THEN launch_date::DATE
        ELSE NULL
    END,
    CASE 
        WHEN completion_date IS NOT NULL THEN completion_date::DATE
        ELSE NULL
    END,
    CAST(price_from AS DECIMAL(12,2)),
    CAST(price_to AS DECIMAL(12,2)),
    CASE 
        WHEN photos IS NOT NULL THEN photos
        ELSE ARRAY[]::TEXT[]
    END,
    CASE 
        WHEN plans IS NOT NULL THEN plans
        ELSE ARRAY[]::TEXT[]
    END,
    virtual_tour,
    SUBSTRING(COALESCE(meta_title, title), 1, 160),
    SUBSTRING(COALESCE(meta_description, description), 1, 320),
    COALESCE(created_at, NOW()),
    COALESCE(updated_at, NOW())
FROM projects
WHERE developer_id IS NOT NULL;

-- ÉTAPE 3: CRÉATION DES BUILDINGS DEPUIS PROJETS MIGRÉS
-- VIDER d'abord si tentative précédente
TRUNCATE TABLE buildings_enhanced CASCADE;

-- Créer un building par défaut pour chaque projet migré
INSERT INTO buildings_enhanced (
    project_id,
    building_code,
    building_type,
    total_floors,
    total_units,
    has_gym,
    has_pool,
    has_underground_parking,
    construction_status,
    energy_rating
)
SELECT 
    pc.id,
    'A',
    'residential',
    5,
    10,
    FALSE,
    FALSE,
    FALSE,
    'planning',
    'B'
FROM projects_clean pc;

-- ÉTAPE 4: MIGRATION DES PROPERTIES TEST
-- VIDER d'abord
TRUNCATE TABLE properties_final;

-- Créer des propriétés types pour tester
INSERT INTO properties_final (
    project_id,
    building_id,
    unit_code,
    property_type,
    floor_number,
    bedrooms,
    bathrooms,
    internal_area_m2,
    price,
    status,
    view_type,
    furniture_status,
    title_deed_status
)
SELECT 
    pc.id as project_id,
    be.id as building_id,
    'A101' as unit_code,
    'apartment' as property_type,
    1 as floor_number,
    2 as bedrooms,
    1 as bathrooms,
    85.00 as internal_area_m2,
    350000.00 as price,
    'available' as status,
    'sea_view' as view_type,
    'unfurnished' as furniture_status,
    'ready' as title_deed_status
FROM projects_clean pc
JOIN buildings_enhanced be ON be.project_id = pc.id
LIMIT 3;

-- ÉTAPE 5: VALIDATION DE LA MIGRATION
-- Vérifier les comptes
SELECT 
    'projects_clean' as table_name, COUNT(*) as count 
FROM projects_clean
UNION ALL
SELECT 
    'buildings_enhanced', COUNT(*) 
FROM buildings_enhanced
UNION ALL
SELECT 
    'properties_final', COUNT(*) 
FROM properties_final;

-- Vérifier les relations et Golden Visa
SELECT 
    pc.title as project,
    be.building_code as building,
    pf.unit_code as unit,
    pf.price,
    pf.golden_visa_eligible
FROM projects_clean pc
LEFT JOIN buildings_enhanced be ON be.project_id = pc.id
LEFT JOIN properties_final pf ON pf.project_id = pc.id AND pf.building_id = be.id;