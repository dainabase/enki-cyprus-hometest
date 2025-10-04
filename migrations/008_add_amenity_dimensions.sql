-- Migration: 008 - Add dimensions to amenities
-- Priority: P1 - Important for Section 6 (Lifestyle)
-- Date: 2025-01-04

-- Add size and capacity fields to project_amenities
ALTER TABLE project_amenities
ADD COLUMN IF NOT EXISTS size_value NUMERIC,
ADD COLUMN IF NOT EXISTS size_unit TEXT,
ADD COLUMN IF NOT EXISTS capacity INTEGER,
ADD COLUMN IF NOT EXISTS opening_hours TEXT;

-- Add comments
COMMENT ON COLUMN project_amenities.size_value IS 'Dimension/taille équipement (ex: piscine 25m, gym 150m²)';
COMMENT ON COLUMN project_amenities.size_unit IS 'Unité de mesure: m2, m, places, personnes';
COMMENT ON COLUMN project_amenities.capacity IS 'Capacité maximale personnes';
COMMENT ON COLUMN project_amenities.opening_hours IS 'Horaires disponibilité (ex: "6h-22h" ou "24/7")';

DO $$
BEGIN
  RAISE NOTICE '✅ Migration 008 completed: Amenity dimensions added';
END $$;