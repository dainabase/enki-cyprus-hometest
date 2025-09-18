-- Fix security warning by setting search_path for the function
CREATE OR REPLACE FUNCTION insert_property_safe(
  p_project_id UUID,
  p_building_id UUID DEFAULT NULL,
  p_property_type TEXT DEFAULT 'apartment',
  p_unit_number TEXT DEFAULT 'UNIT-001',
  p_property_status TEXT DEFAULT 'available',
  p_price_excluding_vat NUMERIC DEFAULT 0,
  p_bedrooms_count INTEGER DEFAULT 1,
  p_bathrooms_count INTEGER DEFAULT 1
) RETURNS TABLE(
  id UUID,
  project_id UUID,
  building_id UUID,
  property_type TEXT,
  unit_number TEXT,
  property_status TEXT,
  price_excluding_vat NUMERIC,
  created_at TIMESTAMPTZ
) AS $$
DECLARE
  new_property properties%ROWTYPE;
BEGIN
  -- Insertion avec gestion explicite des champs requis
  INSERT INTO properties (
    project_id,
    building_id,
    property_type,
    unit_number,
    property_status,
    price_excluding_vat,
    bedrooms_count,
    bathrooms_count
  ) VALUES (
    p_project_id,
    p_building_id,
    p_property_type,
    p_unit_number,
    p_property_status,
    p_price_excluding_vat,
    p_bedrooms_count,
    p_bathrooms_count
  ) RETURNING * INTO new_property;
  
  -- Retourner les données essentielles
  RETURN QUERY SELECT 
    new_property.id,
    new_property.project_id,
    new_property.building_id,
    new_property.property_type,
    new_property.unit_number,
    new_property.property_status,
    new_property.price_excluding_vat,
    new_property.created_at;
    
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error in insert_property_safe: % - %', SQLSTATE, SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;