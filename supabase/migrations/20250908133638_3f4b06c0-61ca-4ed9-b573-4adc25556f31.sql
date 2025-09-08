-- Migration: Convert property_sub_type to array and add new property types
BEGIN;

-- 1. Remove old CHECK constraint if it exists
ALTER TABLE projects 
DROP CONSTRAINT IF EXISTS projects_property_sub_type_check;

-- 2. Create temporary column
ALTER TABLE projects 
ADD COLUMN property_sub_types TEXT[];

-- 3. Migrate existing data (if any exists)
UPDATE projects 
SET property_sub_types = CASE 
  WHEN property_sub_type IS NOT NULL THEN ARRAY[property_sub_type]::TEXT[]
  ELSE NULL
END
WHERE property_sub_type IS NOT NULL;

-- 4. Drop old column
ALTER TABLE projects 
DROP COLUMN IF EXISTS property_sub_type;

-- 5. Rename new column
ALTER TABLE projects 
RENAME COLUMN property_sub_types TO property_sub_type;

-- 6. Add new constraint with all possible types
ALTER TABLE projects 
ADD CONSTRAINT projects_property_sub_type_check 
CHECK (
  property_sub_type IS NULL OR 
  property_sub_type <@ ARRAY[
    -- Residential
    'villa', 'apartment', 'penthouse', 'townhouse', 
    'studio', 'duplex', 'triplex', 'maisonette',
    -- Commercial
    'office', 'retail', 'warehouse', 'showroom',
    'restaurant', 'hotel', 'clinic', 'workshop',
    -- Industrial
    'factory', 'logistics', 'storage', 'production',
    -- Land
    'land_residential', 'land_commercial', 'land_agricultural',
    -- Other
    'mixed_use', 'other'
  ]::TEXT[]
);

-- 7. Add comment
COMMENT ON COLUMN projects.property_sub_type IS 'Property sub-types in the project (multiple selection)';

COMMIT;