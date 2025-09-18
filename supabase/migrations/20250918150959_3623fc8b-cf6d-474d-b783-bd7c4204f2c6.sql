-- Créer une table de test minimale sans AUCUNE dépendance
CREATE TABLE test_properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID,
    building_id UUID,
    property_type TEXT,
    unit_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Test d'insertion directe
INSERT INTO test_properties (project_id, building_id, property_type, unit_number)
VALUES (
    'dd01cefb-6eb7-49c1-bf18-6a56a0951105'::uuid,
    '32e38967-1a8d-4074-ab1e-edb72ace34e9'::uuid,
    'apartment',
    'TEST-ISOLATED-001'
);

-- Créer une fonction RPC pour cette table de test
CREATE OR REPLACE FUNCTION insert_test_property(
    p_project_id UUID,
    p_building_id UUID,
    p_property_type TEXT,
    p_unit_number TEXT
)
RETURNS UUID
LANGUAGE plpgsql
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