# Fix URLs ProjectV2 - Ajout Liens Corrects

## Problème

Tu utilises `/project-v2/azure-marina` mais ce slug n'existe PAS en BDD.

## Slugs Réels en Base de Données

```sql
-- ✅ AVEC PHOTOS (16 fichiers)
'marina-bay-residences-limassol'

-- ⚠️ SANS PHOTOS
'azure-marina-paradise-limassol'
'skyline-tower-nicosia'
'mountain-view-villas-limassol'

-- ❌ N'EXISTE PAS
'azure-marina'  ← CE QUE TU UTILISES
```

## URLs Correctes

### ✅ Fonctionne (avec toutes les photos)
```
https://ton-site.com/project-v2/marina-bay-residences-limassol
```

### ⚠️ Fonctionne (mais sans photos)
```
https://ton-site.com/project-v2/azure-marina-paradise-limassol
```

### ❌ Ne Fonctionne PAS
```
https://ton-site.com/project-v2/azure-marina
```
**Raison** : Ce slug n'existe pas en BDD → projet non trouvé

## Solution 1 : Utiliser Marina Bay

**URL à utiliser** :
```
/project-v2/marina-bay-residences-limassol
```

**Avantages** :
- ✅ 16 photos disponibles
- ✅ Données complètes
- ✅ Toutes sections fonctionnent

## Solution 2 : Créer Azure Marina Simplifié

Si tu veux absolument `/project-v2/azure-marina`, il faut :

1. **Ajouter le slug en BDD** :
   ```sql
   INSERT INTO projects (
     url_slug,
     name,
     location_city,
     location_country,
     price_from,
     main_image_url,
     status
   ) VALUES (
     'azure-marina',
     'Azure Marina',
     'Limassol',
     'Cyprus',
     450000,
     '/lovable-uploads/placeholder.jpg',
     'available'
   );
   ```

2. **Ajouter les photos** :
   - Copier/renommer photos dans `/public/lovable-uploads/`
   - azure-marina-hero.jpg
   - azure-marina-exterior-1.jpg
   - etc.

3. **Update main_image_url** :
   ```sql
   UPDATE projects 
   SET main_image_url = '/lovable-uploads/azure-marina-hero.jpg'
   WHERE url_slug = 'azure-marina';
   ```

## Solution 3 : Redirection (Recommandé)

Créer une redirection dans App.tsx :

```tsx
// Dans App.tsx
<Route 
  path="/project-v2/azure-marina" 
  element={<Navigate to="/project-v2/marina-bay-residences-limassol" replace />}
/>
```

Comme ça, `/project-v2/azure-marina` redirige automatiquement vers la version avec photos.

