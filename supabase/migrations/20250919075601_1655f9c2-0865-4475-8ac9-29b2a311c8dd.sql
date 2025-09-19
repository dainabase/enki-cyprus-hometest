-- PHASE 3: MIGRATION DES DONNÉES CORRIGÉE - Types de données compatibles

-- 3.1 Migrer les données PROJETS depuis la sauvegarde (types corrigés)
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
    -- Correction: conversion explicite en date
    CASE 
        WHEN completion_date_new IS NOT NULL THEN completion_date_new::date
        WHEN completion_date IS NOT NULL THEN 
            CASE 
                WHEN completion_date ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' 
                THEN completion_date::date 
                ELSE NULL 
            END
        ELSE NULL 
    END as completion_date,
    COALESCE(price_from_new, 
             CASE WHEN price_from ~ '^[0-9]+\.?[0-9]*$' THEN price_from::numeric ELSE NULL END,
             price_range_min),
    price_to,
    photos, 
    plans, 
    COALESCE(virtual_tour_url_new, virtual_tour), 
    video_url,
    COALESCE(meta_title_new, meta_title), 
    COALESCE(meta_description_new, meta_description),
    COALESCE(golden_visa_eligible_new, golden_visa_eligible, false),
    COALESCE(price_from_new, 
             CASE WHEN price_from ~ '^[0-9]+\.?[0-9]*$' THEN price_from::numeric ELSE 300000 END,
             300000),
    COALESCE(view_count_new, view_count, 0),
    CASE WHEN ARRAY_LENGTH(photos, 1) > 0 THEN photos[1] ELSE NULL END as featured_image,
    created_at, 
    updated_at
FROM backup_projects_20250119
WHERE developer_id IS NOT NULL
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    updated_at = NOW();

-- 3.2 Créer les BUILDINGS depuis les projets sauvegardés (avec vérification de nullité)
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
    COALESCE(p.project_code, 'BLDG-' || substring(p.id::text, 1, 8)) as building_code,
    COALESCE(p.title || ' - Building A', 'Building A') as building_name,
    CASE 
        WHEN p.property_types IS NOT NULL AND ARRAY_LENGTH(p.property_types, 1) > 0 
        THEN p.property_types[1] 
        ELSE 'residential' 
    END as building_type,
    COALESCE(p.floors_total, 5) as total_floors,
    COALESCE(p.total_units_new, p.total_units, 10) as total_units,
    COALESCE(p.units_available_new, p.units_available, 5) as units_available_count,
    COALESCE(p.construction_phase, 'planning') as construction_status,
    CASE 
        WHEN p.completion_date_new IS NOT NULL THEN p.completion_date_new::date
        WHEN p.completion_date IS NOT NULL AND p.completion_date ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' 
        THEN p.completion_date::date 
        ELSE NULL 
    END as expected_completion,
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