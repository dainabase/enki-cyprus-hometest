-- SOLUTION DÉFINITIVE: Supprimer l'ancienne fonction et créer une version simplifiée

-- 1. Supprimer l'ancienne fonction problématique
DROP FUNCTION IF EXISTS insert_property_safe CASCADE;

-- 2. Créer une fonction ultra-simple pour tester
CREATE OR REPLACE FUNCTION insert_property_minimal(
    p_project_id UUID,
    p_building_id UUID,
    p_property_type TEXT,
    p_unit_number TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_id UUID;
BEGIN
    -- Validation stricte
    IF p_project_id IS NULL THEN
        RAISE EXCEPTION 'project_id cannot be NULL';
    END IF;
    
    IF p_building_id IS NULL THEN
        RAISE EXCEPTION 'building_id cannot be NULL';
    END IF;
    
    -- Insertion directe sans aucune manipulation
    INSERT INTO properties (
        project_id,
        building_id,
        property_type,
        unit_number
    ) VALUES (
        p_project_id,
        p_building_id,
        p_property_type,
        p_unit_number
    )
    RETURNING id INTO new_id;
    
    RETURN new_id;
END;
$$;