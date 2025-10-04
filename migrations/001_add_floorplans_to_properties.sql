-- Migration: 001 - Add floor plans and total surface to properties
-- Priority: P0 - CRITICAL for Section 5 (Plans)
-- Date: 2025-01-04

-- Add new columns for floor plans and 3D views
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS floor_plan_2d TEXT,
ADD COLUMN IF NOT EXISTS floor_plan_3d TEXT,
ADD COLUMN IF NOT EXISTS floor_plan_thumbnail TEXT,
ADD COLUMN IF NOT EXISTS surface_total NUMERIC,
ADD COLUMN IF NOT EXISTS view_3d_url TEXT;

-- Add comments for documentation
COMMENT ON COLUMN properties.floor_plan_2d IS 'URL du plan 2D technique (PDF)';
COMMENT ON COLUMN properties.floor_plan_3d IS 'URL du plan 3D visuel (JPG/PNG)';
COMMENT ON COLUMN properties.floor_plan_thumbnail IS 'URL miniature aperçu plan';
COMMENT ON COLUMN properties.surface_total IS 'Surface totale = internal_area + covered_verandas + uncovered_verandas';
COMMENT ON COLUMN properties.view_3d_url IS 'URL visite virtuelle 3D unité';

-- Create function to auto-calculate total surface
CREATE OR REPLACE FUNCTION calculate_surface_total()
RETURNS TRIGGER AS $$
BEGIN
  NEW.surface_total := COALESCE(NEW.internal_area, 0) 
                     + COALESCE(NEW.covered_verandas, 0) 
                     + COALESCE(NEW.uncovered_verandas, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update surface_total automatically
DROP TRIGGER IF EXISTS update_surface_total ON properties;
CREATE TRIGGER update_surface_total
BEFORE INSERT OR UPDATE OF internal_area, covered_verandas, uncovered_verandas
ON properties
FOR EACH ROW
EXECUTE FUNCTION calculate_surface_total();

-- Backfill existing properties with calculated total surface
UPDATE properties 
SET surface_total = COALESCE(internal_area, 0) 
                  + COALESCE(covered_verandas, 0) 
                  + COALESCE(uncovered_verandas, 0)
WHERE surface_total IS NULL;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Migration 001 completed: Floor plans and surface_total added to properties';
END $$;