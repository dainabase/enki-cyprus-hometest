-- PHASE 3: MIGRATION DES DONNÉES VERS NOUVELLE STRUCTURE
-- Migration sécurisée et progressive des données

-- 3.1 Migrer les données PROJETS depuis la table projects vers projects_clean
INSERT INTO projects_clean (
    id, developer_id, title, slug, description, subtitle,
    city, region, zone, address,
    latitude, longitude,
    status, phase, launch_date, completion_date,
    price_range_min, price_range_max,
    photos, plans, virtual_tour_url, video_url,
    meta_title, meta_description,
    golden_visa_eligible,
    view_count,
    created_at, updated_at
)
SELECT 
    id,
    developer_id,
    title,
    url_slug,
    description,
    subtitle,
    -- Location mapping
    COALESCE(
        CASE 
            WHEN location->>'city' IS NOT NULL THEN location->>'city'
            WHEN city IS NOT NULL THEN city
            ELSE 'Limassol'
        END
    ) as city,
    region,
    cyprus_zone as zone,
    full_address as address,
    gps_latitude as latitude,
    gps_longitude as longitude,
    -- Status mapping
    COALESCE(project_status, status, 'planning') as status,
    construction_phase as phase,
    launch_date,
    completion_date_new as completion_date,
    -- Price mapping
    COALESCE(price_from_new, price_from::numeric) as price_range_min,
    price_to as price_range_max,
    -- Media mapping
    photos,
    plans,
    virtual_tour,
    video_url,
    -- SEO mapping
    meta_title,
    meta_description,
    -- Business logic
    COALESCE(golden_visa_eligible_new, golden_visa_eligible, false) as golden_visa_eligible,
    COALESCE(view_count_new, view_count, 0) as view_count,
    -- Timestamps
    created_at,
    updated_at
FROM projects
WHERE id IS NOT NULL;

-- 3.2 Créer des buildings par défaut depuis les données projets
INSERT INTO buildings_enhanced (
    project_id, building_code, building_type,
    total_floors, total_units,
    plot_area_m2, built_area_m2,
    has_elevator, has_gym, has_pool, has_spa, has_playground,
    has_underground_parking,
    energy_rating,
    construction_status, expected_completion,
    units_available_count,
    created_at, updated_at
)
SELECT 
    pc.id as project_id,
    'BUILDING-A' as building_code,
    CASE 
        WHEN p.property_types @> ARRAY['villa'] THEN 'villa'
        WHEN p.property_types @> ARRAY['townhouse'] THEN 'townhouse'
        ELSE 'apartment'
    END as building_type,
    COALESCE(p.floors_total, 5) as total_floors,
    COALESCE(p.total_units_new, p.total_units, 10) as total_units,
    p.land_area_m2,
    p.built_area_m2,
    -- Amenities from project data
    COALESCE(p.amenities @> ARRAY['Elevator'], false) as has_elevator,
    COALESCE(p.amenities @> ARRAY['Gym'], false) as has_gym,
    COALESCE(p.amenities @> ARRAY['Pool'], false) as has_pool,
    COALESCE(p.amenities @> ARRAY['Spa'], false) as has_spa,
    COALESCE(p.amenities @> ARRAY['Playground'], false) as has_playground,
    COALESCE(p.amenities @> ARRAY['Underground Parking'], false) as has_underground_parking,
    p.energy_rating,
    COALESCE(p.construction_phase, 'planning') as construction_status,
    p.completion_date_new as expected_completion,
    COALESCE(p.units_available_new, p.units_available, 0) as units_available_count,
    p.created_at,
    p.updated_at
FROM projects_clean pc
JOIN projects p ON pc.id = p.id;

-- 3.3 Migrer les unités individuelles depuis projects vers properties_final
-- Créer des propriétés fictives si pas de données détaillées
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
    vat_rate,
    status,
    view_type,
    has_balcony, has_terrace, has_garden,
    has_parking_space, parking_spaces_count,
    title_deed_status,
    created_at, updated_at
)
SELECT 
    be.project_id,
    be.id as building_id,
    COALESCE(p.unit_number, 'UNIT-' || generate_random_uuid()::text) as unit_code,
    COALESCE(
        CASE 
            WHEN p.property_types @> ARRAY['villa'] THEN 'villa'
            WHEN p.property_types @> ARRAY['apartment'] THEN 'apartment'
            WHEN p.property_types @> ARRAY['penthouse'] THEN 'penthouse'
            ELSE 'apartment'
        END
    ) as property_type,
    COALESCE(p.floor_number, 1) as floor_number,
    -- Extract bedrooms from bedrooms_range or default
    COALESCE(
        CASE 
            WHEN p.bedrooms_range ~ '^[0-9]+' THEN 
                substring(p.bedrooms_range from '^([0-9]+)')::integer
            ELSE 2
        END
    ) as bedrooms,
    COALESCE(
        CASE 
            WHEN p.bathrooms_range ~ '^[0-9]+' THEN 
                substring(p.bathrooms_range from '^([0-9]+)')::integer
            ELSE 1
        END
    ) as bathrooms,
    -- Area calculation
    COALESCE(p.built_area_m2, 100.0) as internal_area_m2,
    -- Price mapping
    COALESCE(p.price, p.price_from_new, 250000.0) as price,
    COALESCE(p.vat_rate_new, p.vat_rate, 5.0) as vat_rate,
    COALESCE(p.reservation_status, 'available') as status,
    'sea' as view_type, -- Default view
    true as has_balcony,
    false as has_terrace,
    CASE WHEN be.building_type = 'villa' THEN true ELSE false END as has_garden,
    COALESCE(p.parking_spaces > 0, false) as has_parking_space,
    COALESCE(p.parking_spaces, 1) as parking_spaces_count,
    COALESCE(p.title_deed_status, 'pending') as title_deed_status,
    p.created_at,
    p.updated_at
FROM buildings_enhanced be
JOIN projects p ON be.project_id = p.id
-- Limiter à 3 unités par building pour les données de test
CROSS JOIN generate_series(1, LEAST(COALESCE(p.total_units, 3), 5)) as unit_series;

-- 3.4 Mettre à jour les statistiques des buildings
UPDATE buildings_enhanced SET
    units_available_count = (
        SELECT COUNT(*) 
        FROM properties_final pf 
        WHERE pf.building_id = buildings_enhanced.id 
        AND pf.status = 'available'
    ),
    units_sold_count = (
        SELECT COUNT(*) 
        FROM properties_final pf 
        WHERE pf.building_id = buildings_enhanced.id 
        AND pf.status = 'sold'
    ),
    total_units = (
        SELECT COUNT(*) 
        FROM properties_final pf 
        WHERE pf.building_id = buildings_enhanced.id
    );

-- 3.5 Mettre à jour le rapport de migration avec les nouvelles données
INSERT INTO migration_report_20250119 (table_name, row_count)
VALUES 
    ('projects_clean_migrated', (SELECT COUNT(*) FROM projects_clean)),
    ('buildings_enhanced_created', (SELECT COUNT(*) FROM buildings_enhanced)),
    ('properties_final_created', (SELECT COUNT(*) FROM properties_final));