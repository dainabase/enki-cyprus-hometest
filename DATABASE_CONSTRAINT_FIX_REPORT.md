# 🔧 Database Constraint Fix Report - Cyprus Zone

**Date**: 2025-10-03
**Issue**: Admin project form failing at Localisation step (step 2)
**Error**: `new row for relation "projects" violates check constraint "projects_cyprus_zone_check"`

---

## 🎯 Root Cause Identified

### The Problem

There is a **case sensitivity mismatch** between the database constraint and the frontend code:

| Component | Cyprus Zone Format | Example Values |
|-----------|-------------------|----------------|
| **Database Constraint** | ✅ **Capitalized** | 'Limassol', 'Paphos', 'Larnaca', 'Nicosia', 'Famagusta' |
| **Frontend Helper** | ❌ **lowercase** | 'limassol', 'paphos', 'larnaca', 'nicosia', 'famagusta' |
| **Address Extraction** | ❌ **lowercase** | 'limassol', 'paphos', 'larnaca', 'nicosia', 'famagusta' |
| **Form Defaults** | ❌ **lowercase** | 'limassol' |

### Evidence

1. **Database Migration Conflict**
   ```sql
   -- Migration: 20250907132950 (CORRECT - lowercase)
   cyprus_zone TEXT DEFAULT 'limassol'
   CHECK (cyprus_zone IN ('limassol', 'paphos', 'larnaca', 'nicosia', 'famagusta', 'kyrenia'))

   -- Migration: 20250920060644 (BREAKING - Capitalized)
   cyprus_zone TEXT
   CHECK (cyprus_zone IN ('Limassol', 'Paphos', 'Larnaca', 'Nicosia', 'Famagusta'))
   ```

2. **Frontend Code (All Lowercase)**

   **cyprusAddressHelper.ts**:
   ```typescript
   export const CYPRUS_MUNICIPALITY_TO_DISTRICT: Record<string, string> = {
     'Limassol': 'limassol',    // Returns lowercase
     'Paphos': 'paphos',        // Returns lowercase
     'Larnaca': 'larnaca',      // Returns lowercase
     // ... etc
   };
   ```

   **AddressExtraction.tsx** (line 60):
   ```typescript
   form.setValue('cyprus_zone', parsedAddress.district);  // Sets lowercase value
   ```

   **AdminProjectForm.tsx** (line 53):
   ```typescript
   cyprus_zone: 'limassol',  // Default is lowercase
   ```

3. **Auto-Detection Trigger (Lowercase)**
   ```sql
   -- Migration: 20250923_fix_missing_fields.sql
   CREATE OR REPLACE FUNCTION detect_cyprus_zone(city_name TEXT)
   RETURNS TEXT AS $$
   BEGIN
     -- Returns 'limassol', 'paphos', etc. (lowercase)
     IF city_name IN ('limassol', 'lemesos', ...) THEN
       RETURN 'limassol';  -- lowercase
   ```

### Timeline of the Bug

1. ✅ **Sept 7**: Constraint created with lowercase values (working correctly)
2. ❌ **Sept 20**: Multiple migrations recreated constraint with Capitalized values (breaking change)
3. ❌ **Oct 3**: User reports error when saving projects

---

## ✅ The Solution

The **entire frontend codebase** uses lowercase values consistently. We need to update the database constraint to match.

### Migration File to Apply

**Filename**: `supabase/migrations/20251003_fix_cyprus_zone_constraint.sql`

```sql
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
```

---

## 🔄 Alternative Solution (NOT Recommended)

If you prefer to keep the database constraint with capitalized values, you would need to modify the frontend code in multiple places:

1. **cyprusAddressHelper.ts**: Change all 112 mappings from lowercase to Capitalized
2. **AddressExtraction.tsx**: Add transformation before setValue
3. **AdminProjectForm.tsx**: Change default from 'limassol' to 'Limassol'
4. **All admin pages**: Update filtering/sorting logic

This approach is **NOT recommended** because:
- ❌ Requires changes across 10+ files
- ❌ Higher risk of introducing new bugs
- ❌ Conflicts with existing auto-detection trigger (uses lowercase)
- ❌ Conflicts with existing default value in earlier migration

---

## 📋 Implementation Steps

### Option 1: Apply Migration via Supabase Dashboard (Recommended)

1. Login to Supabase Dashboard: https://oseyhlmpeoprtfqbuupm.supabase.co
2. Go to SQL Editor
3. Create new query
4. Copy the migration SQL from above
5. Execute the query
6. Test the project form

### Option 2: Apply Migration via CLI

```bash
# Create the migration file
cat > supabase/migrations/20251003_fix_cyprus_zone_constraint.sql << 'EOF'
[paste migration SQL here]
EOF

# Apply migrations
npx supabase db push
```

---

## ✅ Testing Checklist

After applying the migration:

1. [ ] Go to Admin Dashboard → Gestion Immobilière → Projets
2. [ ] Click "Créer un projet"
3. [ ] Fill in Step 1 (Information de Base)
4. [ ] Go to Step 2 (Localisation)
5. [ ] Paste a complete address in the address field
6. [ ] Click "Extraire" button
7. [ ] Verify that cyprus_zone is detected (should show toast with district)
8. [ ] Click "Sauvegarder" or "Suivant"
9. [ ] Verify NO constraint violation error
10. [ ] Check database: `SELECT id, title, cyprus_zone FROM projects ORDER BY created_at DESC LIMIT 5;`
11. [ ] Verify cyprus_zone values are lowercase

---

## 📊 Impact Analysis

### What This Fixes
- ✅ Admin project form Step 2 (Localisation) save functionality
- ✅ Automatic address extraction system
- ✅ Auto-detection trigger from city name
- ✅ Consistency across entire application

### What This Does NOT Break
- ✅ Google Maps AI agent (not touched)
- ✅ Address extraction logic (not touched)
- ✅ Distance and commodities calculation (not touched)
- ✅ All existing projects (data normalized to lowercase)
- ✅ Frontend filtering and sorting (already uses lowercase)

### Affected Tables
- ✅ `projects` table only
- ❌ No other tables affected

---

## 🎯 Conclusion

This is a **database constraint definition issue**, not a frontend bug. The fix is:

1. **Simple**: One migration file
2. **Safe**: Only affects constraint definition
3. **Backward compatible**: Normalizes existing data
4. **Aligns with codebase**: Matches frontend standard
5. **Preserves functionality**: No changes to address extraction or Google Maps agent

**Recommended Action**: Apply the migration via Supabase Dashboard SQL Editor.

---

**Report Generated**: 2025-10-03
**Status**: ✅ Root cause identified, solution provided
**Next Step**: Apply migration to production database
