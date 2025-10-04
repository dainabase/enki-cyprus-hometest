-- Migration: 007 - Enhance proximities with travel times
-- Priority: P1 - Important for Section 3 (Location)
-- Date: 2025-01-04

-- Add travel time fields to project_nearby_amenities
ALTER TABLE project_nearby_amenities
ADD COLUMN IF NOT EXISTS travel_time_car INTEGER,
ADD COLUMN IF NOT EXISTS travel_time_walk INTEGER,
ADD COLUMN IF NOT EXISTS travel_time_bike INTEGER,
ADD COLUMN IF NOT EXISTS travel_time_public INTEGER;

-- Add comments
COMMENT ON COLUMN project_nearby_amenities.travel_time_car IS 'Temps trajet voiture (minutes)';
COMMENT ON COLUMN project_nearby_amenities.travel_time_walk IS 'Temps trajet à pied (minutes)';
COMMENT ON COLUMN project_nearby_amenities.travel_time_bike IS 'Temps trajet vélo (minutes)';
COMMENT ON COLUMN project_nearby_amenities.travel_time_public IS 'Temps trajet transport public (minutes)';

-- Backfill existing data with estimates based on distance
-- Formula: walking = distance_km * 12 min/km, car = distance_km * 2 min/km
UPDATE project_nearby_amenities
SET 
  travel_time_walk = CEIL(distance_km * 12)::INTEGER,
  travel_time_car = CEIL(distance_km * 2)::INTEGER,
  travel_time_bike = CEIL(distance_km * 4)::INTEGER
WHERE distance_km IS NOT NULL
  AND travel_time_walk IS NULL;

DO $$
BEGIN
  RAISE NOTICE '✅ Migration 007 completed: Proximities enhanced with travel times';
END $$;