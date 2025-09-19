-- PHASE 3: MIGRATION DES DONNÉES DEPUIS BACKUP VERS NOUVELLES STRUCTURES
-- Migration sécurisée avec validation

-- 3.1 Migrer les données PROJETS depuis la sauvegarde
INSERT INTO projects_clean (
    id, developer_id, title, slug, description, subtitle,
    city, region, zone, address,
    latitude, longitude,
    status, phase, launch_date, completion_date,
    price_range_min, price_range_max,
    photos, plans, virtual_tour_url, video_url,
    meta_title, meta_description,
    golden_visa_eligible, minimum_investment,
    view_count, featured_image,
    created_at, updated_at
)
SELECT 
    id, 
    developer_id, 
    title, 
    url_slug,
    description, 
    subtitle,
    COALESCE(city, 'Limassol'),
    region, 
    cyprus_zone, 
    full_address,
    gps_latitude, 
    gps_longitude,
    COALESCE(project_status, status, 'planning'),
    construction_phase, 
    launch_date, 
    COALESCE(completion_date_new, completion_date),
    COALESCE(price_from_new, price_from::numeric, price_range_min),
    price_to,
    photos, 
    plans, 
    COALESCE(virtual_tour_url_new, virtual_tour), 
    video_url,
    COALESCE(meta_title_new, meta_title), 
    COALESCE(meta_description_new, meta_description),
    COALESCE(golden_visa_eligible_new, golden_visa_eligible, false),
    COALESCE(price_from_new, price_from::numeric, 300000),
    COALESCE(view_count_new, view_count, 0),
    (photos[1]) as featured_image,
    created_at, 
    updated_at
FROM backup_projects_20250119
WHERE developer_id IS NOT NULL
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    updated_at = NOW();

-- 3.2 Créer les BUILDINGS depuis les projets sauvegardés
INSERT INTO buildings_enhanced (
    project_id, building_code, building_name, building_type,
    total_floors, total_units, units_available_count,
    construction_status, expected_completion,
    has_elevator, has_gym, has_pool, has_spa, has_playground,
    has_underground_parking, plot_area_m2, built_area_m2,
    energy_rating
)
SELECT 
    p.id as project_id,
    COALESCE(p.project_code, 'BLDG-' || p.id::text) as building_code,
    COALESCE(p.title || ' - Building A', 'Building A') as building_name,
    CASE 
        WHEN ARRAY_LENGTH(p.property_types, 1) > 0 
        THEN p.property_types[1] 
        ELSE 'residential' 
    END as building_type,
    COALESCE(p.floors_total, 5) as total_floors,
    COALESCE(p.total_units_new, p.total_units, 10) as total_units,
    COALESCE(p.units_available_new, p.units_available, 5) as units_available_count,
    COALESCE(p.construction_phase, 'planning') as construction_status,
    COALESCE(p.completion_date_new::date, p.completion_date::date) as expected_completion,
    COALESCE((p.amenities @> ARRAY['elevator']::text[]), false) as has_elevator,
    COALESCE((p.amenities @> ARRAY['gym']::text[]), false) as has_gym,
    COALESCE((p.amenities @> ARRAY['pool']::text[]), false) as has_pool,
    COALESCE((p.amenities @> ARRAY['spa']::text[]), false) as has_spa,
    COALESCE((p.amenities @> ARRAY['playground']::text[]), false) as has_playground,
    COALESCE((p.amenities @> ARRAY['parking']::text[]), false) as has_underground_parking,
    p.land_area_m2,
    p.built_area_m2,
    p.energy_rating
FROM backup_projects_20250119 p
WHERE p.developer_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- 3.3 Créer les PROPERTIES depuis les projets (extraction des unités individuelles)
-- Chaque projet devient une propriété par défaut
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
    currency,
    vat_rate,
    status,
    view_type,
    has_balcony,
    has_terrace,
    has_parking_space,
    parking_spaces_count,
    title_deed_status,
    golden_visa_eligible,
    financing_available
)
SELECT 
    p.id as project_id,
    b.id as building_id,
    COALESCE(p.unit_number, 'UNIT-' || p.id::text) as unit_code,
    CASE 
        WHEN ARRAY_LENGTH(p.property_types, 1) > 0 
        THEN p.property_types[1] 
        ELSE 'apartment' 
    END as property_type,
    COALESCE(p.floor_number, 1) as floor_number,
    CASE 
        WHEN p.bedrooms_range LIKE '%-%' 
        THEN SPLIT_PART(p.bedrooms_range, '-', 1)::integer 
        WHEN p.bedrooms_range ~ '^[0-9]+$' 
        THEN p.bedrooms_range::integer 
        ELSE 2 
    END as bedrooms,
    CASE 
        WHEN p.bathrooms_range LIKE '%-%' 
        THEN SPLIT_PART(p.bathrooms_range, '-', 1)::integer 
        WHEN p.bathrooms_range ~ '^[0-9]+$' 
        THEN p.bathrooms_range::integer 
        ELSE 1 
    END as bathrooms,
    COALESCE(p.built_area_m2, 100) as internal_area_m2,
    COALESCE(p.price_from_new, p.price_from::numeric, p.price, 250000) as price,
    'EUR' as currency,
    COALESCE(p.vat_rate_new, p.vat_rate, 5.00) as vat_rate,
    COALESCE(p.reservation_status, 'available') as status,
    CASE 
        WHEN p.amenities @> ARRAY['sea_view']::text[] THEN 'sea'
        WHEN p.amenities @> ARRAY['mountain_view']::text[] THEN 'mountain'
        ELSE 'city'
    END as view_type,
    COALESCE((p.amenities @> ARRAY['balcony']::text[]), true) as has_balcony,
    COALESCE((p.amenities @> ARRAY['terrace']::text[]), false) as has_terrace,
    COALESCE((p.amenities @> ARRAY['parking']::text[]), true) as has_parking_space,
    COALESCE(p.parking_spaces, 1) as parking_spaces_count,
    COALESCE(p.title_deed_status, 'pending') as title_deed_status,
    (COALESCE(p.price_from_new, p.price_from::numeric, p.price, 250000) >= 300000) as golden_visa_eligible,
    COALESCE(p.financing_available, false) as financing_available
FROM backup_projects_20250119 p
JOIN buildings_enhanced b ON b.project_id = p.id
WHERE p.developer_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- 3.4 Mise à jour du rapport de migration
UPDATE migration_report_20250119 
SET row_count = (SELECT COUNT(*) FROM projects_clean)
WHERE table_name = 'projects_clean';

INSERT INTO migration_report_20250119 (table_name, row_count)
VALUES 
    ('buildings_enhanced', (SELECT COUNT(*) FROM buildings_enhanced)),
    ('properties_final', (SELECT COUNT(*) FROM properties_final))
ON CONFLICT DO NOTHING;