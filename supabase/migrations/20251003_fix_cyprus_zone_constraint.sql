/*
  # Fix Cyprus Zone Constraint - Case Sensitivity Issue

  ## Problem
  The database constraint for `cyprus_zone` expects capitalized values ('Limassol', 'Paphos', etc.)
  but the entire frontend codebase (cyprusAddressHelper.ts, AddressExtraction.tsx, form defaults)
  consistently produces lowercase values ('limassol', 'paphos', etc.).

  This causes constraint violation errors when saving projects in the admin form.

  ## Solution
  1. Drop the existing CHECK constraint
  2. Recreate it with lowercase values to match the frontend standard
  3. Update any existing data to lowercase for consistency

  ## Changes
  - Remove constraint with capitalized values
  - Add constraint with lowercase values: 'limassol', 'paphos', 'larnaca', 'nicosia', 'famagusta', 'kyrenia'
  - Normalize existing data to lowercase
*/

-- Step 1: Update any existing capitalized values to lowercase
UPDATE projects
SET cyprus_zone = LOWER(cyprus_zone)
WHERE cyprus_zone IS NOT NULL
  AND cyprus_zone != LOWER(cyprus_zone);

-- Step 2: Drop the existing constraint if it exists
DO $$
BEGIN
  -- Try to drop constraint with various possible names
  BEGIN
    ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_cyprus_zone_check;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  BEGIN
    ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_cyprus_zone_check1;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  BEGIN
    ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_cyprus_zone_check2;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
END $$;

-- Step 3: Add the corrected constraint with lowercase values
ALTER TABLE projects
ADD CONSTRAINT projects_cyprus_zone_check
CHECK (cyprus_zone IN ('limassol', 'paphos', 'larnaca', 'nicosia', 'famagusta', 'kyrenia'));

-- Step 4: Create an index for better query performance (if not exists)
CREATE INDEX IF NOT EXISTS idx_projects_cyprus_zone_lower ON projects(LOWER(cyprus_zone));

-- Step 5: Add a comment explaining the constraint
COMMENT ON CONSTRAINT projects_cyprus_zone_check ON projects IS
  'Ensures cyprus_zone contains only valid lowercase district names. Frontend code produces lowercase values.';
