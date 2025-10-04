# Fix Redirection /project-v2/azure-marina

## Problème

Tu utilisais `/project-v2/azure-marina` mais ce slug **n'existe pas** en BDD.

## Cause

En BDD, les slugs sont :
- ✅ `marina-bay-residences-limassol` (16 photos)
- ⚠️ `azure-marina-paradise-limassol` (pas de photos)
- ❌ `azure-marina` (N'EXISTE PAS)

## Solution Appliquée

**Redirection automatique** dans App.tsx :

```tsx
// Ligne 5 - Import Navigate
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Ligne 113 - Redirection avant la route dynamique
<Route 
  path="/project-v2/azure-marina" 
  element={<Navigate to="/project-v2/marina-bay-residences-limassol" replace />} 
/>
<Route path="/project-v2/:slug" element={<ProjectPageV2 />} />
```

## Résultat

### Avant
```
/project-v2/azure-marina
→ 404 "Projet non trouvé" (slug n'existe pas en BDD)
```

### Après
```
/project-v2/azure-marina
→ Redirection 302 automatique
→ /project-v2/marina-bay-residences-limassol
→ Page V2 avec 5 sections + 16 photos
```

## URLs Fonctionnelles

### ✅ URL Directe (Recommandée)
```
/project-v2/marina-bay-residences-limassol
```
- Accès direct
- 16 photos marina-bay
- 5 sections complètes

### ✅ URL Raccourcie (Redirige)
```
/project-v2/azure-marina
```
- Redirige vers marina-bay
- Fonctionne maintenant grâce à Navigate

### ⚠️ URL Longue (Fonctionne mais sans photos)
```
/project-v2/azure-marina-paradise-limassol
```
- Slug existe en BDD
- Mais pas de photos dans /public/
- Affichera placeholders

## Build

✅ Succès (38.42s)

## Test

**Essayer les 2 URLs** :

1. **URL Raccourcie** :
   ```
   http://localhost:5173/project-v2/azure-marina
   ```
   → Devrait rediriger vers marina-bay-residences-limassol

2. **URL Complète** :
   ```
   http://localhost:5173/project-v2/marina-bay-residences-limassol
   ```
   → Devrait afficher directement

**Console logs attendus** :
```
[ProjectPageV2] Loading project with slug: marina-bay-residences-limassol
[ProjectPageV2] Base project loaded: Marina Bay Residences
[ProjectPageV2] Data enriched successfully
```

## Comportement Redirection

**React Router remplace l'URL** :
1. User tape `/project-v2/azure-marina`
2. React Router détecte la route redirect
3. `<Navigate replace />` change l'URL dans la barre
4. URL devient `/project-v2/marina-bay-residences-limassol`
5. ProjectPageV2 charge avec le bon slug
6. Historique ne contient pas azure-marina (grâce à `replace`)

## Alternatives

### Option 1 : Créer Vraiment Azure Marina

Si tu veux `/project-v2/azure-marina` comme vrai projet :

**1. Migration SQL** :
```sql
INSERT INTO projects (
  url_slug,
  name,
  title,
  location_city,
  location_country,
  price_from,
  main_image_url,
  status,
  created_at
) VALUES (
  'azure-marina',
  'Azure Marina',
  'Azure Marina Residences',
  'Limassol',
  'Cyprus',
  450000,
  '/lovable-uploads/azure-marina-hero.jpg',
  'available',
  NOW()
);
```

**2. Ajouter photos** :
```bash
# Copier/renommer dans /public/lovable-uploads/
azure-marina-hero.jpg
azure-marina-exterior-1.jpg
azure-marina-interior-1.jpg
azure-marina-bedroom.jpg
# etc.
```

**3. Supprimer redirection** :
```tsx
// Supprimer cette ligne dans App.tsx
<Route path="/project-v2/azure-marina" element={<Navigate ... />} />
```

### Option 2 : Alias Multiple Projets

Rediriger plusieurs slugs courts :

```tsx
<Route path="/project-v2/azure" element={<Navigate to="/project-v2/azure-marina-paradise-limassol" replace />} />
<Route path="/project-v2/marina" element={<Navigate to="/project-v2/marina-bay-residences-limassol" replace />} />
<Route path="/project-v2/skyline" element={<Navigate to="/project-v2/skyline-tower-nicosia" replace />} />
<Route path="/project-v2/mountain" element={<Navigate to="/project-v2/mountain-view-villas-limassol" replace />} />
```

Comme ça, URLs courtes fonctionnent pour tous les projets.

## Notes Importantes

⚠️ **L'ordre des routes compte** :

```tsx
// ✅ BON - Route spécifique AVANT route dynamique
<Route path="/project-v2/azure-marina" element={<Navigate ... />} />
<Route path="/project-v2/:slug" element={<ProjectPageV2 />} />

// ❌ MAUVAIS - Route dynamique AVANT route spécifique
<Route path="/project-v2/:slug" element={<ProjectPageV2 />} />
<Route path="/project-v2/azure-marina" element={<Navigate ... />} />
// azure-marina sera intercepté par :slug avant d'atteindre la redirection
```

## Fichiers Modifiés

```
src/App.tsx
├── Ligne 5   : Import Navigate
└── Ligne 113 : Route redirection azure-marina
```

## Prochaines Actions

Si tu veux vraiment un projet "Azure Marina" distinct :

1. Créer migration SQL avec INSERT
2. Ajouter 10-15 photos azure-marina-*
3. Supprimer la redirection dans App.tsx
4. Update BDD : `main_image_url`, `description`, etc.

Sinon, garde la redirection - c'est la solution la plus simple.

---

Date : 2025-10-04
Status : ✅ Redirection Ajoutée
Build : ✅ Passe (38.42s)
