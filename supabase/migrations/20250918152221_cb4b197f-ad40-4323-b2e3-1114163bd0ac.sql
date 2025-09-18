-- ÉTAPE 1: Créer une table de test sans contraintes problématiques
DROP TABLE IF EXISTS properties_test CASCADE;

CREATE TABLE properties_test (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL,
    building_id UUID NOT NULL,  -- NOT NULL obligatoire !
    property_type TEXT NOT NULL,
    unit_number TEXT NOT NULL,
    floor INTEGER,
    bedrooms INTEGER,
    bathrooms INTEGER,
    surface_area DECIMAL(10,2),
    price DECIMAL(15,2),
    status TEXT DEFAULT 'available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ÉTAPE 2: Test d'insertion directe
INSERT INTO properties_test (project_id, building_id, property_type, unit_number)
VALUES (
    'dd01cefb-6eb7-49c1-bf18-6a56a0951105'::uuid,
    '32e38967-1a8d-4074-ab1e-edb72ace34e9'::uuid,
    'apartment',
    'TEST-CLEAN-001'
);

-- ÉTAPE 3: Créer une fonction RPC propre
CREATE OR REPLACE FUNCTION insert_property_test(
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
    -- Validation explicite
    IF p_project_id IS NULL THEN
        RAISE EXCEPTION 'project_id cannot be NULL';
    END IF;
    
    IF p_building_id IS NULL THEN
        RAISE EXCEPTION 'building_id cannot be NULL';
    END IF;
    
    -- Insertion
    INSERT INTO properties_test (
        project_id, 
        building_id, 
        property_type, 
        unit_number
    )
    VALUES (
        p_project_id, 
        p_building_id, 
        p_property_type, 
        p_unit_number
    )
    RETURNING id INTO new_id;
    
    RETURN new_id;
END;
$$;

-- ÉTAPE 4: Activer RLS
ALTER TABLE properties_test ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for authenticated users" ON properties_test
    FOR ALL USING (auth.role() = 'authenticated');