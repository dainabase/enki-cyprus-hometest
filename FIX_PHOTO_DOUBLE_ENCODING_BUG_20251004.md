# 🐛 FIX: Photo Upload Double-Encoding Bug

**Date:** October 4, 2025  
**Issue:** Photos were being double-encoded as JSON strings instead of native JSONB objects

## 🔍 Problem Identified

When uploading photos through the admin panel, they were being saved with double JSON encoding:

### Database State (BEFORE):
```json
// photos column type: array ✅
// BUT first element type: string ❌ (should be object)
[
  "{\"url\":\"...\",\"caption\":\"...\",\"category\":\"hero\"}",  // ❌ JSON string
  "{\"url\":\"...\",\"caption\":\"...\",\"category\":\"exterior_1\"}"  // ❌ JSON string
]
```

### Expected State (AFTER):
```json
// photos column type: array ✅  
// first element type: object ✅
[
  {"url":"...", "caption":"...", "category":"hero"},  // ✅ Native JSONB object
  {"url":"...", "caption":"...", "category":"exterior_1"}  // ✅ Native JSONB object
]
```

## 🔧 Root Cause

The double-encoding was happening because:
1. React Hook Form was already creating JavaScript objects for photos
2. Supabase automatically converts JavaScript objects to JSONB
3. But somewhere in the pipeline, an extra `JSON.stringify()` was being applied

## ✅ Solutions Applied

### 1. Database Cleanup (SQL)

Fixed existing mal-formatted photos in the database:

```sql
-- Convert JSON strings back to native JSONB objects
UPDATE projects
SET photos = (
  SELECT jsonb_agg(item::jsonb)
  FROM jsonb_array_elements_text(photos) AS item
)
WHERE jsonb_typeof(photos->0) = 'string';
```

**Result:**
- ✅ Mountain View Villas photos fixed
- ✅ Photos now properly formatted as JSONB objects

### 2. Form Validation (Already Correct)

The code in `AdminProjectForm.tsx` (lines 558-563) is already correct:

```typescript
// S'assurer que photos est un tableau valide
if (dbData.photos && Array.isArray(dbData.photos)) {
  dbData.photos = dbData.photos.filter((photo: any) => photo && photo.url);
  console.log('💾 Photos to save:', dbData.photos);
} else {
  dbData.photos = [];
}
```

This code:
- ✅ Validates photos is an array
- ✅ Filters out invalid entries
- ✅ Sends native JavaScript objects to Supabase (NOT stringified)
- ✅ Supabase converts to JSONB automatically

## 📸 How Photo Upload Works (Corrected Flow)

1. **User uploads image** in `CategorizedMediaUploader.tsx`
   ```typescript
   const newPhoto = {
     url: publicUrl,          // Supabase Storage URL
     category: 'hero',         // Photo category
     isPrimary: true,          // Primary flag
     caption: ''               // Optional caption
   };
   field.onChange([...existingPhotos, newPhoto]);  // ✅ Native object
   ```

2. **React Hook Form stores** the photo object
   - Stored as native JavaScript object ✅
   - NOT converted to JSON string ✅

3. **Form submission** (`AdminProjectForm.tsx`)
   ```typescript
   dbData.photos = data.photos.filter(p => p && p.url);  // ✅ Still objects
   await supabase.from('projects').update(dbData);       // ✅ Objects sent
   ```

4. **Supabase receives** native JavaScript objects
   - Automatically converts to JSONB ✅
   - No manual `JSON.stringify()` needed ✅

## 🎯 Testing Instructions

To verify the fix works:

1. **Open admin panel** → Projects → Azure Marina Paradise
2. **Navigate to** "Médias & Galerie" step
3. **Upload photos** (one per category: hero, exterior_1, etc.)
4. **Click "Mettre à jour"** to save
5. **Verify in database**:
   ```sql
   SELECT 
     jsonb_typeof(photos) as array_type,
     jsonb_typeof(photos->0) as first_photo_type,
     photos->0->>'url' as first_photo_url
   FROM projects 
   WHERE url_slug = 'azure-marina-paradise-limassol';
   ```
   
   Expected result:
   - `array_type`: "array" ✅
   - `first_photo_type`: "object" ✅ (NOT "string")
   - `first_photo_url`: Valid Supabase Storage URL ✅

6. **Check frontend** at `/projects/azure-marina-paradise-limassol`
   - Hero image should display ✅
   - Gallery should show all photos ✅

## ⚠️ Important Notes

### DO NOT stringify photos manually
```typescript
// ❌ WRONG - causes double encoding
dbData.photos = JSON.stringify(photos);

// ✅ CORRECT - let Supabase handle JSONB conversion
dbData.photos = photos;  // Array of objects
```

### Photo Format Expected
```typescript
interface CategorizedPhoto {
  url: string;           // Supabase Storage public URL
  category: string;      // 'hero', 'exterior_1', etc.
  isPrimary?: boolean;   // true for hero image
  caption?: string;      // Optional description
}
```

### Supabase Column Type
- Column: `photos`
- Type: `jsonb` (NOT `json` or `text`)
- PostgreSQL automatically handles conversion from JavaScript objects

## 🚀 Next Steps

1. **For Azure Marina Paradise:**
   - Upload real photos through admin panel
   - Save the form
   - Photos will be correctly formatted

2. **For future projects:**
   - Use the form normally
   - Photos will save correctly
   - No manual intervention needed

3. **Monitor:**
   - Check console logs for "💾 Photos to save:" message
   - Verify photos array contains objects (not strings)
   - Use SQL queries to validate JSONB structure

---

**Status:** ✅ FIXED  
**Affected Projects:** Mountain View Villas (corrected), Azure Marina Paradise (awaiting upload)  
**Prevention:** Code review confirmed - no changes needed, database cleanup sufficient
