-- Migration pour corriger le problème du champ construction_year
-- Date: 2025-01-18
-- Objectif: S'assurer que construction_year est uniquement dans projects et pas dans buildings

-- 1. Vérifier et nettoyer si construction_year existe dans buildings (au cas où)
DO $$ 
BEGIN
    -- Si construction_year existe dans buildings, le supprimer
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'buildings' 
        AND column_name = 'construction_year'
    ) THEN
        ALTER TABLE buildings DROP COLUMN construction_year;
        RAISE NOTICE 'Colonne construction_year supprimée de buildings';
    END IF;
END $$;

-- 2. S'assurer que construction_year existe bien dans projects avec les bonnes contraintes
DO $$ 
BEGIN
    -- La colonne existe déjà, on s'assure qu'elle a les bonnes contraintes
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'projects' 
        AND column_name = 'construction_year'
    ) THEN
        -- Supprimer l'ancienne contrainte si elle existe
        ALTER TABLE projects 
        DROP CONSTRAINT IF EXISTS projects_construction_year_check;
        
        -- Ajouter la nouvelle contrainte
        ALTER TABLE projects 
        ADD CONSTRAINT projects_construction_year_check 
        CHECK (construction_year >= 1900 AND construction_year <= 2100);
        
        -- Ajouter un commentaire descriptif
        COMMENT ON COLUMN projects.construction_year IS 'Année de construction du projet immobilier';
        
        RAISE NOTICE 'Contraintes de construction_year mises à jour dans projects';
    END IF;
END $$;

-- 3. Créer une vue pour faciliter l'accès aux données des bâtiments avec les infos du projet
DROP VIEW IF EXISTS buildings_with_project_info CASCADE;

CREATE VIEW buildings_with_project_info AS
SELECT 
    b.*,
    p.construction_year as project_construction_year,
    p.title as project_title,
    p.street_address as project_street_address,
    p.postal_code as project_postal_code,
    p.city as project_city,
    p.cyprus_zone as project_zone,
    p.energy_rating as project_energy_rating,
    p.status as project_status,
    p.completion_date as project_completion_date
FROM buildings b
LEFT JOIN projects p ON b.project_id = p.id;

COMMENT ON VIEW buildings_with_project_info IS 'Vue combinée des bâtiments avec les informations du projet parent';

-- 4. Créer une fonction pour récupérer les bâtiments avec les infos du projet
CREATE OR REPLACE FUNCTION get_buildings_with_project_data(p_project_id uuid)
RETURNS TABLE (
    building_id uuid,
    building_name varchar,
    building_type varchar,
    total_floors integer,
    total_units integer,
    construction_year integer,
    street_address text,
    postal_code varchar,
    city text,
    zone text,
    energy_rating varchar,
    project_title text
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.id as building_id,
        b.building_name,
        b.building_type,
        b.total_floors,
        b.total_units,
        p.construction_year,
        p.street_address,
        p.postal_code,
        p.city,
        p.cyprus_zone as zone,
        p.energy_rating,
        p.title as project_title
    FROM buildings b
    INNER JOIN projects p ON b.project_id = p.id
    WHERE p.id = p_project_id
    ORDER BY b.building_name;
END;
$$;

COMMENT ON FUNCTION get_buildings_with_project_data IS 'Récupère les bâtiments d''un projet avec les données du projet parent';

-- 5. Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_projects_construction_year 
ON projects(construction_year) 
WHERE construction_year IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_projects_energy_rating 
ON projects(energy_rating) 
WHERE energy_rating IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_projects_postal_code 
ON projects(postal_code) 
WHERE postal_code IS NOT NULL;

-- 6. Vérifier l'intégrité des données
DO $$
DECLARE
    v_project_count INTEGER;
    v_building_count INTEGER;
BEGIN
    -- Compter les projets avec construction_year
    SELECT COUNT(*) INTO v_project_count 
    FROM projects 
    WHERE construction_year IS NOT NULL;
    
    -- Compter les bâtiments
    SELECT COUNT(*) INTO v_building_count 
    FROM buildings;
    
    RAISE NOTICE 'Nombre de projets avec construction_year: %', v_project_count;
    RAISE NOTICE 'Nombre total de bâtiments: %', v_building_count;
END $$;

-- 7. Rafraîchir le cache des métadonnées Supabase
NOTIFY pgrst, 'reload schema';

-- Message de succès final
DO $$ 
BEGIN
    RAISE NOTICE '✅ Migration fix_buildings_construction_year_complete appliquée avec succès';
    RAISE NOTICE '✅ La colonne construction_year est maintenant uniquement dans la table projects';
    RAISE NOTICE '✅ Vue buildings_with_project_info créée pour accès aux données combinées';
    RAISE NOTICE '✅ Fonction get_buildings_with_project_data créée pour requêtes optimisées';
    RAISE NOTICE '✅ Index créés pour améliorer les performances';
END $$;
