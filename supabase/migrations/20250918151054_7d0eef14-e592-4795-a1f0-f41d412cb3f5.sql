-- Corriger les issues de sécurité pour la table de test
ALTER TABLE test_properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for authenticated users" ON test_properties
    FOR ALL USING (auth.role() = 'authenticated');

-- Corriger les fonctions avec search_path
CREATE OR REPLACE FUNCTION insert_test_property(
    p_project_id UUID,
    p_building_id UUID,
    p_property_type TEXT,
    p_unit_number TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_id UUID;
BEGIN
    INSERT INTO test_properties (project_id, building_id, property_type, unit_number)
    VALUES (p_project_id, p_building_id, p_property_type, p_unit_number)
    RETURNING id INTO new_id;
    
    RETURN new_id;
END;
$$;

CREATE OR REPLACE FUNCTION insert_property_minimal(
    p_project_id UUID,
    p_building_id UUID,
    p_property_type TEXT,
    p_unit_number TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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