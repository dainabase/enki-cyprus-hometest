/*
  # Fix VAT Rate Constraint - Allow 0% for Land Properties

  ## Problem
  The current constraint `CHECK (vat_rate IN (5, 19))` rejects VAT = 0%, which is needed for:
  - Land properties (agricultural, residential land)
  - Certain exempted property types
  - Special tax situations

  The TypeScript schema allows `min(0).max(100)` but the database constraint is more restrictive,
  causing save errors when users select 0% VAT.

  ## Solution
  1. Drop the existing restrictive constraint
  2. Create a new constraint allowing 0, 5, and 19 (or NULL)
  3. This aligns with Cyprus VAT regulations:
     - 0%: Land, exempted properties
     - 5%: Reduced rate (first home buyers)
     - 19%: Standard rate

  ## Changes
  - Drop existing `projects_vat_rate_check` constraint
  - Add new constraint: `CHECK (vat_rate IN (0, 5, 19) OR vat_rate IS NULL)`
  - Update existing data if needed (no impact expected, as current constraint blocks 0%)
*/

-- Step 1: Drop the existing restrictive constraint
DO $$
BEGIN
  -- Try multiple possible constraint names
  BEGIN
    ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_vat_rate_check;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  BEGIN
    ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_vat_rate_check1;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  BEGIN
    ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_vat_rate_check2;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
END $$;

-- Step 2: Add the new constraint allowing 0, 5, and 19
ALTER TABLE projects
ADD CONSTRAINT projects_vat_rate_check
CHECK (vat_rate IN (0, 5, 19) OR vat_rate IS NULL);

-- Step 3: Add a comment explaining the constraint
COMMENT ON CONSTRAINT projects_vat_rate_check ON projects IS
  'Cyprus VAT rates: 0% (land/exempted), 5% (reduced rate), 19% (standard rate). NULL allowed for properties without VAT information.';

-- Step 4: Verify the constraint works
DO $$
BEGIN
  -- Test 1: Try to insert vat_rate = 0 (should succeed)
  BEGIN
    INSERT INTO projects (title, city, cyprus_zone, vat_rate)
    VALUES ('Test VAT 0%', 'Limassol', 'limassol', 0);
    DELETE FROM projects WHERE title = 'Test VAT 0%';
    RAISE NOTICE '✓ TEST PASSED: VAT rate 0%% is now accepted';
  EXCEPTION WHEN check_violation THEN
    RAISE EXCEPTION 'TEST FAILED: VAT rate 0%% is still rejected';
  END;

  -- Test 2: Try to insert vat_rate = 5 (should succeed)
  BEGIN
    INSERT INTO projects (title, city, cyprus_zone, vat_rate)
    VALUES ('Test VAT 5%', 'Limassol', 'limassol', 5);
    DELETE FROM projects WHERE title = 'Test VAT 5%';
    RAISE NOTICE '✓ TEST PASSED: VAT rate 5%% is accepted';
  END;

  -- Test 3: Try to insert vat_rate = 19 (should succeed)
  BEGIN
    INSERT INTO projects (title, city, cyprus_zone, vat_rate)
    VALUES ('Test VAT 19%', 'Limassol', 'limassol', 19);
    DELETE FROM projects WHERE title = 'Test VAT 19%';
    RAISE NOTICE '✓ TEST PASSED: VAT rate 19%% is accepted';
  END;

  -- Test 4: Try to insert vat_rate = 10 (should fail)
  BEGIN
    INSERT INTO projects (title, city, cyprus_zone, vat_rate)
    VALUES ('Test VAT 10%', 'Limassol', 'limassol', 10);
    DELETE FROM projects WHERE title = 'Test VAT 10%';
    RAISE EXCEPTION 'TEST FAILED: VAT rate 10%% should be rejected but was accepted';
  EXCEPTION WHEN check_violation THEN
    RAISE NOTICE '✓ TEST PASSED: Invalid VAT rate 10%% is correctly rejected';
  END;

  -- Test 5: Try to insert vat_rate = NULL (should succeed)
  BEGIN
    INSERT INTO projects (title, city, cyprus_zone, vat_rate)
    VALUES ('Test VAT NULL', 'Limassol', 'limassol', NULL);
    DELETE FROM projects WHERE title = 'Test VAT NULL';
    RAISE NOTICE '✓ TEST PASSED: VAT rate NULL is accepted';
  END;
END $$;

-- Step 6: Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_vat_rate ON projects(vat_rate) WHERE vat_rate IS NOT NULL;
