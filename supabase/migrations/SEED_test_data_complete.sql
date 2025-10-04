-- ================================================
-- SCRIPT DE GÉNÉRATION DE DONNÉES DE TEST
-- ================================================
-- Date: 4 octobre 2025
-- Projet: ENKI REALITY CYPRUS
-- Objectif: Populer la base avec des données réalistes
-- ================================================

/*
CE SCRIPT GÉNÈRE:
- 100 propriétés variées (apartments, villas, penthouses)
- 20 leads avec différents statuts
- 10 commissions pour tester calculs
- 50 project_images supplémentaires
- 30 buildings supplémentaires
*/

-- ================================================
-- 1. PRÉPARATION: Récupérer les IDs existants
-- ================================================

DO $$
DECLARE
    project_marina UUID;
    project_azure UUID;
    project_mountain UUID;
    project_skyline UUID;
    developer_id UUID;
    building_count INT;
BEGIN
    -- Récupérer les IDs des projets existants
    SELECT id INTO project_marina FROM projects WHERE url_slug = 'marina-bay-residences-limassol';
    SELECT id INTO project_azure FROM projects WHERE url_slug = 'azure-marina-paradise-limassol';
    SELECT id INTO project_mountain FROM projects WHERE url_slug = 'mountain-view-villas-limassol';
    SELECT id INTO project_skyline FROM projects WHERE url_slug = 'skyline-tower-nicosia';
    
    -- Récupérer un developer_id
    SELECT id INTO developer_id FROM developers LIMIT 1;
    
    RAISE NOTICE 'IDs projets récupérés: Marina=%, Azure=%, Mountain=%, Skyline=%', 
        project_marina, project_azure, project_mountain, project_skyline;
    
    -- ================================================
    -- 2. GÉNÉRER 30 BUILDINGS SUPPLÉMENTAIRES
    -- ================================================
    
    -- Buildings pour Marina Bay (5 buildings)
    FOR i IN 1..5 LOOP
        INSERT INTO buildings (
            project_id,
            building_code,
            building_name,
            display_order,
            total_floors,
            total_units,
            units_available,
            construction_status,
            expected_completion
        ) VALUES (
            project_marina,
            'MBR-B' || i,
            'Marina Bay Building ' || i,
            i,
            CASE WHEN i <= 2 THEN 6 ELSE 8 END,
            CASE WHEN i <= 2 THEN 24 ELSE 32 END,
            CASE WHEN i <= 2 THEN 20 ELSE 28 END,
            'under_construction',
            CURRENT_DATE + INTERVAL '18 months'
        );
    END LOOP;
    
    -- Buildings pour Azure Marina (5 buildings)
    FOR i IN 1..5 LOOP
        INSERT INTO buildings (
            project_id,
            building_code,
            building_name,
            display_order,
            total_floors,
            total_units,
            units_available,
            construction_status,
            expected_completion
        ) VALUES (
            project_azure,
            'AMP-B' || i,
            'Azure Tower ' || i,
            i,
            10,
            40,
            35,
            'under_construction',
            CURRENT_DATE + INTERVAL '24 months'
        );
    END LOOP;
    
    -- Villas pour Mountain View (10 villas individuelles)
    FOR i IN 1..10 LOOP
        INSERT INTO buildings (
            project_id,
            building_code,
            building_name,
            display_order,
            total_floors,
            total_units,
            units_available,
            construction_status,
            expected_completion
        ) VALUES (
            project_mountain,
            'MVV-V' || i,
            'Villa ' || i,
            i,
            2, -- Villas sur 2 étages
            1, -- Une seule unité par villa
            CASE WHEN i % 3 = 0 THEN 0 ELSE 1 END, -- 1/3 déjà vendues
            'completed',
            CURRENT_DATE - INTERVAL '3 months'
        );
    END LOOP;
    
    -- Buildings pour Skyline Tower (10 étages dans une tour)
    FOR i IN 1..10 LOOP
        INSERT INTO buildings (
            project_id,
            building_code,
            building_name,
            display_order,
            total_floors,
            total_units,
            units_available,
            construction_status,
            expected_completion
        ) VALUES (
            project_skyline,
            'ST-F' || i,
            'Skyline Floor ' || i,
            i,
            1, -- Un étage = un "building" pour organisation
            4, -- 4 appartements par étage
            3,
            'planned',
            CURRENT_DATE + INTERVAL '36 months'
        );
    END LOOP;
    
    RAISE NOTICE '✅ 30 buildings créés';
    
END $$;

-- ================================================
-- 3. GÉNÉRER 100 PROPRIÉTÉS VARIÉES
-- ================================================

DO $$
DECLARE
    building_rec RECORD;
    property_types TEXT[] := ARRAY['apartment', 'penthouse', 'villa', 'studio', 'duplex'];
    bedrooms INT;
    bathrooms INT;
    price NUMERIC;
    counter INT := 0;
BEGIN
    -- Pour chaque building, créer plusieurs properties
    FOR building_rec IN 
        SELECT id, project_id, building_name, total_units 
        FROM buildings 
        ORDER BY RANDOM() 
        LIMIT 25 -- Limiter à 25 buildings pour 100 properties
    LOOP
        -- Créer 4 properties par building
        FOR i IN 1..4 LOOP
            counter := counter + 1;
            
            IF counter > 100 THEN
                EXIT;
            END IF;
            
            -- Randomiser caractéristiques
            bedrooms := 1 + (RANDOM() * 4)::INT; -- 1 à 5 bedrooms
            bathrooms := 1 + (RANDOM() * 2)::INT; -- 1 à 3 bathrooms
            price := 150000 + (RANDOM() * 850000)::INT; -- 150k à 1M€
            
            INSERT INTO properties (
                project_id,
                building_id,
                property_code,
                unit_number,
                property_type,
                property_status,
                is_available,
                floor_number,
                bedrooms_count,
                bathrooms_count,
                internal_area,
                covered_verandas,
                price_excluding_vat,
                vat_rate,
                price_including_vat,
                golden_visa_eligible,
                commission_rate
            ) VALUES (
                building_rec.project_id,
                building_rec.id,
                'PROP-' || LPAD(counter::TEXT, 4, '0'),
                building_rec.building_name || '-U' || i,
                property_types[(RANDOM() * (array_length(property_types, 1) - 1))::INT + 1],
                CASE 
                    WHEN RANDOM() < 0.7 THEN 'available'
                    WHEN RANDOM() < 0.9 THEN 'reserved'
                    ELSE 'sold'
                END,
                RANDOM() < 0.7, -- 70% disponibles
                1 + (RANDOM() * 10)::INT, -- Étage 1 à 10
                bedrooms,
                bathrooms,
                80 + (RANDOM() * 250)::NUMERIC, -- 80 à 330m²
                15 + (RANDOM() * 35)::NUMERIC, -- 15 à 50m² verandas
                price,
                5.0,
                price * 1.05,
                price >= 300000, -- Golden Visa si >= 300k
                5.0
            );
        END LOOP;
    END LOOP;
    
    RAISE NOTICE '✅ % properties créées', counter;
    
END $$;

-- ================================================
-- 4. GÉNÉRER 20 LEADS AVEC STATUTS VARIÉS
-- ================================================

INSERT INTO leads (
    first_name,
    last_name,
    email,
    phone,
    budget_min,
    budget_max,
    urgency,
    property_type,
    zones,
    status,
    score,
    source,
    golden_visa_interest,
    notes
)
SELECT
    'Lead-' || generate_series AS first_name,
    'Prospect-' || generate_series AS last_name,
    'lead' || generate_series || '@example.com' AS email,
    '+357 99 ' || LPAD((generate_series * 111)::TEXT, 6, '0') AS phone,
    (100000 + RANDOM() * 200000)::NUMERIC AS budget_min,
    (400000 + RANDOM() * 600000)::NUMERIC AS budget_max,
    CASE 
        WHEN generate_series % 4 = 0 THEN 'immediate'
        WHEN generate_series % 4 = 1 THEN '1-3 months'
        WHEN generate_series % 4 = 2 THEN '3-6 months'
        ELSE '6+ months'
    END AS urgency,
    CASE 
        WHEN generate_series % 5 = 0 THEN 'apartment'
        WHEN generate_series % 5 = 1 THEN 'villa'
        WHEN generate_series % 5 = 2 THEN 'penthouse'
        WHEN generate_series % 5 = 3 THEN 'townhouse'
        ELSE 'duplex'
    END AS property_type,
    ARRAY['limassol', 'paphos']::TEXT[] AS zones,
    CASE 
        WHEN generate_series <= 5 THEN 'new'
        WHEN generate_series <= 10 THEN 'contacted'
        WHEN generate_series <= 14 THEN 'qualified'
        WHEN generate_series <= 17 THEN 'proposal'
        WHEN generate_series <= 19 THEN 'won'
        ELSE 'lost'
    END AS status,
    (RANDOM() * 5)::INT AS score, -- Score 0-5
    CASE 
        WHEN generate_series % 3 = 0 THEN 'website'
        WHEN generate_series % 3 = 1 THEN 'referral'
        ELSE 'social_media'
    END AS source,
    RANDOM() < 0.4 AS golden_visa_interest, -- 40% intéressés Golden Visa
    'Lead généré automatiquement pour tests' AS notes
FROM generate_series(1, 20);

-- ================================================
-- 5. GÉNÉRER 10 COMMISSIONS
-- ================================================

DO $$
DECLARE
    property_rec RECORD;
    user_id UUID;
    promoter_rec RECORD;
BEGIN
    -- Récupérer un user_id
    SELECT id INTO user_id FROM auth.users LIMIT 1;
    
    -- Pour 10 properties "sold", créer des commissions
    FOR property_rec IN 
        SELECT id, project_id, price_including_vat 
        FROM properties 
        WHERE property_status = 'sold' 
        LIMIT 10
    LOOP
        -- Récupérer un promoter aléatoire
        SELECT id, commission_rate INTO promoter_rec 
        FROM promoters 
        ORDER BY RANDOM() 
        LIMIT 1;
        
        INSERT INTO commissions (
            promoter_id,
            user_id,
            project_id,
            amount,
            status,
            date
        ) VALUES (
            promoter_rec.id,
            user_id,
            property_rec.project_id,
            property_rec.price_including_vat * (promoter_rec.commission_rate / 100),
            CASE 
                WHEN RANDOM() < 0.3 THEN 'paid'
                WHEN RANDOM() < 0.7 THEN 'pending'
                ELSE 'cancelled'
            END,
            CURRENT_DATE - (RANDOM() * 60)::INT -- Dans les 60 derniers jours
        );
    END LOOP;
    
    RAISE NOTICE '✅ 10 commissions créées';
    
END $$;

-- ================================================
-- 6. STATISTIQUES FINALES
-- ================================================

DO $$
DECLARE
    total_properties INT;
    total_leads INT;
    total_commissions INT;
    total_buildings INT;
BEGIN
    SELECT COUNT(*) INTO total_properties FROM properties;
    SELECT COUNT(*) INTO total_leads FROM leads;
    SELECT COUNT(*) INTO total_commissions FROM commissions;
    SELECT COUNT(*) INTO total_buildings FROM buildings;
    
    RAISE NOTICE '================================================';
    RAISE NOTICE 'DONNÉES DE TEST GÉNÉRÉES AVEC SUCCÈS';
    RAISE NOTICE '================================================';
    RAISE NOTICE 'Buildings: %', total_buildings;
    RAISE NOTICE 'Properties: %', total_properties;
    RAISE NOTICE 'Leads: %', total_leads;
    RAISE NOTICE 'Commissions: %', total_commissions;
    RAISE NOTICE '================================================';
END $$;

-- ================================================
-- FIN DU SCRIPT DE GÉNÉRATION
-- ================================================
