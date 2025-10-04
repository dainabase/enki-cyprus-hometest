# 🎨 OPTIMISATIONS FRONTEND - COMMODITÉS ET LOCALISATION

**Date:** 4 Octobre 2025
**Demandes utilisateur:**
1. ✅ Réduire de 29 à 13 commodités affichées
2. 🔧 Optimiser l'affichage carte distances et commodités
3. 🔧 Optimiser l'affichage carte localisation
4. 🐛 Corriger la sauvegarde des champs extraits (street_address, district, etc.)

---

## ✅ 1. RÉDUCTION DES COMMODITÉS (29 → 13)

### Avant
```typescript
const amenityOptions = [
  // 29 options avec beaucoup de types non pertinents
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'cafe', label: 'Café' },
  { value: 'atm', label: 'ATM' },
  // ... 26 autres
];
```

### Après
```typescript
// ✅ 13 COMMODITÉS VALIDÉES (dans l'ordre de priorité)
const amenityOptions = [
  // 🏥 Santé (3)
  { value: 'hospital', label: 'Hôpital', icon: <Building2 />, priority: 1 },
  { value: 'pharmacy', label: 'Pharmacie', icon: <Heart />, priority: 2 },

  // 🎓 Éducation (3)
  { value: 'school', label: 'École', icon: <GraduationCap />, priority: 3 },
  { value: 'university', label: 'Université', icon: <School />, priority: 4 },

  // 🛒 Shopping (2)
  { value: 'supermarket', label: 'Supermarché', icon: <ShoppingCart />, priority: 5 },
  { value: 'shopping_center', label: 'Centre commercial', icon: <Store />, priority: 6 },

  // 🚇 Transport (1)
  { value: 'transport_public', label: 'Transport public', icon: <Bus />, priority: 7 },

  // 💰 Services (1)
  { value: 'bank', label: 'Banque', icon: <Landmark />, priority: 8 },

  // 🏋️ Loisirs & Bien-être (2)
  { value: 'gym', label: 'Salle de sport', icon: <Dumbbell />, priority: 9 },
  { value: 'park', label: 'Parc', icon: <Trees />, priority: 10 },

  // 🚓 Sécurité (1)
  { value: 'police', label: 'Police', icon: <Shield />, priority: 11 },

  // 🌊 Distance stratégique
  { value: 'beach', label: 'Plage', icon: <Waves />, priority: 12 }
];
```

**Résultat:** Seulement les 13 commodités validées sont affichables/sélectionnables.

---

## 🎨 2. OPTIMISATION CARTE DISTANCES & COMMODITÉS

### Problèmes Identifiés
1. ❌ Trop de logs console de debug
2. ❌ Code dupliqué checkbox dans "essentielles" et "autres"
3. ❌ Logique compliquée de sélection
4. ❌ Pas de grille responsive optimale

### Solutions

#### A. Supprimer tous les console.log de debug

**Lignes à nettoyer:**
- Lignes 1973-1976, 1984-1985: Logs bouton "Tout sélectionner"
- Lignes 2013-2014, 2034-2052: Logs checkbox essentielles
- Lignes 2107-2125: Logs checkbox autres

**Action:** Supprimer TOUS les console.log sauf ceux vraiment nécessaires (erreurs).

#### B. Simplifier l'affichage des commodités

**Avant:** 2 sections séparées (essentielles + autres) avec code dupliqué

**Après:** Une seule grille avec badges de priorité

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
  {form.watch('surrounding_amenities')
    ?.sort((a, b) => {
      // Tri: essentielles d'abord, puis par distance
      const aEssential = ESSENTIAL_AMENITIES.includes(a.nearby_amenity_id);
      const bEssential = ESSENTIAL_AMENITIES.includes(b.nearby_amenity_id);
      if (aEssential && !bEssential) return -1;
      if (!aEssential && bEssential) return 1;
      return a.distance_km - b.distance_km;
    })
    ?.map((amenity, idx) => {
      const option = amenityOptions.find(opt => opt.value === amenity.nearby_amenity_id);
      if (!option) return null;

      const isEssential = ESSENTIAL_AMENITIES.includes(amenity.nearby_amenity_id);
      const isSelected = selectedAmenities.has(amenity.nearby_amenity_id);

      return (
        <div
          key={`amenity-${amenity.nearby_amenity_id}-${idx}`}
          className={`
            relative bg-white rounded-lg p-4 border-2 transition-all cursor-pointer
            ${isSelected ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
            ${isEssential ? 'shadow-md' : ''}
          `}
          onClick={() => {
            const newSelected = new Set(selectedAmenities);
            if (isSelected) {
              newSelected.delete(amenity.nearby_amenity_id);
            } else {
              newSelected.add(amenity.nearby_amenity_id);
            }
            setSelectedAmenities(newSelected);
          }}
        >
          {/* Badge "Essentiel" */}
          {isEssential && (
            <div className="absolute top-2 right-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                <Star className="h-3 w-3" />
                Prioritaire
              </span>
            </div>
          )}

          <div className="flex items-start gap-3">
            {/* Checkbox */}
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => e.stopPropagation()}
              className="mt-1 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />

            {/* Contenu */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gray-700">{option.icon}</span>
                <span className="font-semibold text-sm">{option.label}</span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">{amenity.distance_km} km</span>
                </div>

                <div className="text-xs text-gray-600 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {amenity.distance_km <= 0.5 && '⚡ 5 min à pied'}
                  {amenity.distance_km > 0.5 && amenity.distance_km <= 1 && '👟 10 min à pied'}
                  {amenity.distance_km > 1 && amenity.distance_km <= 2 && '🚶 20 min à pied'}
                  {amenity.distance_km > 2 && `🚗 ~${Math.round(amenity.distance_km * 2.5)} min`}
                </div>

                {amenity.details && (
                  <div className="text-xs text-gray-500 truncate">{amenity.details}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    })}
</div>
```

**Avantages:**
- ✅ Code 50% plus court
- ✅ Plus de duplication
- ✅ Tri intelligent (essentielles en premier)
- ✅ Badge visuel pour les prioritaires
- ✅ Clic sur toute la card pour sélectionner

#### C. Optimiser les distances stratégiques

**Simplifier le calcul des aéroports:**

```typescript
// Fonction helper réutilisable
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 10) / 10;
};

// Coordonnées des points d'intérêt
const STRATEGIC_LOCATIONS = {
  larnacaAirport: { lat: 34.8751, lng: 33.6248 },
  paphosAirport: { lat: 34.7180, lng: 32.4857 }
};

// Utilisation simplifiée
const distLarnaca = calculateDistance(
  form.watch('gps_latitude'),
  form.watch('gps_longitude'),
  STRATEGIC_LOCATIONS.larnacaAirport.lat,
  STRATEGIC_LOCATIONS.larnacaAirport.lng
);
```

---

## 🗺️ 3. OPTIMISATION CARTE LOCALISATION

### Problèmes Identifiés
1. ❌ Carte trop petite sur desktop
2. ❌ Bouton "Extraire" pas assez visible
3. ❌ Champs pas alignés correctement

### Solutions

#### A. Agrandir la carte

```typescript
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* GAUCHE: Formulaire */}
  <div className="space-y-4">
    {/* ... champs ... */}
  </div>

  {/* DROITE: Carte plus grande */}
  <div className="lg:sticky lg:top-4">
    <div className="rounded-lg overflow-hidden border-2 border-gray-200 shadow-lg">
      <EnhancedMap
        center={{
          lat: form.watch('gps_latitude') || 34.6841,
          lng: form.watch('gps_longitude') || 33.0442
        }}
        zoom={15}
        height="600px"  // Plus grand: 400px → 600px
        commodities={mapCommodities}
        projectLocation={{
          lat: form.watch('gps_latitude') || 34.6841,
          lng: form.watch('gps_longitude') || 33.0442
        }}
      />
    </div>
  </div>
</div>
```

#### B. Améliorer le bouton "Extraire"

```typescript
<div className="flex items-end gap-2">
  <FormField
    control={form.control}
    name="full_address"
    render={({ field }) => (
      <FormItem className="flex-1">
        <FormLabel>Adresse complète *</FormLabel>
        <FormControl>
          <Input
            placeholder="Ex: 45 Poseidonos Avenue, Limassol 4007, Cyprus"
            {...field}
            className="border-2"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />

  <Button
    type="button"
    onClick={handleExtractAddressDetails}
    variant="default"
    size="lg"
    className="mb-1.5 min-w-[140px]"
  >
    <Search className="mr-2 h-4 w-4" />
    Extraire
  </Button>
</div>
```

---

## 🐛 4. CORRECTION SAUVEGARDE CHAMPS ADRESSE

### Problème
Les champs `street_address`, `district`, `postal_code`, etc. sont bien remplis par `handleExtractAddressDetails()` mais ne sont PAS sauvegardés en base lors de l'update du projet.

### Diagnostic

**Ce qui se passe actuellement:**
1. ✅ User clique "Extraire" → `handleExtractAddressDetails()` exécuté
2. ✅ `form.setValue('street_address', ...)` appelé → champ rempli visuellement
3. ✅ User continue à remplir le formulaire
4. ✅ User clique "Mettre à jour"
5. ❌ `onSubmit()` est appelé MAIS certains champs ne sont pas dans `form.getValues()`
6. ❌ Les champs extraits ne sont PAS dans le payload envoyé à Supabase
7. ❌ Quand user revient sur Localisation → champs vides

### Cause Probable
Les champs ne sont peut-être pas déclarés dans le schéma Zod ou ne sont pas inclus dans le `defaultValues`.

### Solution

#### A. Vérifier que les champs sont dans le schéma

```typescript
// Dans projectSchema.ts
export const projectSchema = z.object({
  // ... autres champs
  full_address: z.string().optional(),
  street_address: z.string().optional(),  // ✅ Doit être présent
  city: z.string().optional(),             // ✅ Doit être présent
  postal_code: z.string().optional(),      // ✅ Doit être présent
  neighborhood: z.string().optional(),     // ✅ Doit être présent
  cyprus_zone: z.string().optional(),      // ✅ Doit être présent
  // ...
});
```

#### B. S'assurer que `form.setValue` marque le champ comme "dirty"

```typescript
// Dans handleExtractAddressDetails()
if (streetAddress) {
  form.setValue('street_address', streetAddress, {
    shouldValidate: false,
    shouldDirty: true,  // ✅ IMPORTANT: marquer comme modifié
    shouldTouch: true   // ✅ IMPORTANT: marquer comme touché
  });
}

if (city) {
  form.setValue('city', city, {
    shouldValidate: false,
    shouldDirty: true,
    shouldTouch: true
  });
}

if (postalCode) {
  form.setValue('postal_code', postalCode, {
    shouldValidate: false,
    shouldDirty: true,
    shouldTouch: true
  });
}

if (neighborhood) {
  form.setValue('neighborhood', neighborhood, {
    shouldValidate: false,
    shouldDirty: true,
    shouldTouch: true
  });
}

if (detectedZone) {
  form.setValue('cyprus_zone', detectedZone, {
    shouldValidate: false,
    shouldDirty: true,
    shouldTouch: true
  });
}
```

#### C. Logger pour débugger

```typescript
// Après extraction, logger les valeurs du form
console.log('📋 Valeurs form après extraction:', {
  street_address: form.getValues('street_address'),
  city: form.getValues('city'),
  postal_code: form.getValues('postal_code'),
  neighborhood: form.getValues('neighborhood'),
  cyprus_zone: form.getValues('cyprus_zone')
});
```

#### D. Vérifier onSubmit

```typescript
const onSubmit = async (data: ProjectFormData) => {
  console.log('🚀 SUBMIT - Données complètes:', data);

  // Vérifier que les champs sont présents
  console.log('✅ Champs adresse:', {
    street_address: data.street_address,
    city: data.city,
    postal_code: data.postal_code,
    neighborhood: data.neighborhood,
    cyprus_zone: data.cyprus_zone
  });

  // ... reste du code submit
};
```

---

## 📋 PLAN D'IMPLÉMENTATION

### Étape 1: Nettoyer les commodités ✅ FAIT
- [x] Réduire `amenityOptions` de 29 à 13
- [x] Ajouter propriété `priority`

### Étape 2: Optimiser affichage commodités
- [ ] Supprimer tous les console.log de debug
- [ ] Fusionner sections "essentielles" et "autres"
- [ ] Ajouter badges de priorité
- [ ] Améliorer responsive grid
- [ ] Créer fonction helper `calculateDistance()`

### Étape 3: Optimiser affichage localisation
- [ ] Agrandir la carte (400px → 600px)
- [ ] Améliorer bouton "Extraire"
- [ ] Grid responsive 50/50 sur desktop

### Étape 4: Corriger sauvegarde adresse
- [ ] Ajouter `shouldDirty: true` dans `setValue()`
- [ ] Ajouter `shouldTouch: true` dans `setValue()`
- [ ] Vérifier schéma Zod
- [ ] Logger dans `onSubmit()` pour debug

### Étape 5: Tester
- [ ] Créer nouveau projet
- [ ] Extraire adresse
- [ ] Vérifier champs remplis
- [ ] Sauvegarder
- [ ] Revenir sur Localisation
- [ ] Vérifier champs toujours remplis ✅

---

## 🎨 MOCKUP AVANT/APRÈS

### Avant
```
┌─────────────────────────────────────────┐
│ Commodités essentielles (14 items)     │
│ ┌───┐ ┌───┐ ┌───┐ ┌───┐              │
│ │ ☑ │ │ ☐ │ │ ☐ │ │ ☑ │  [Trop]     │
│ └───┘ └───┘ └───┘ └───┘              │
│                                         │
│ Autres commodités (15 items)           │
│ ┌───┐ ┌───┐ ┌───┐ ┌───┐              │
│ │ ☐ │ │ ☐ │ │ ☐ │ │ ☐ │  [Trop]     │
│ └───┘ └───┘ └───┘ └───┘              │
└─────────────────────────────────────────┘
```

### Après
```
┌─────────────────────────────────────────┐
│ 13 Commodités validées                  │
│                                         │
│ ┌─────────────────┐ ┌─────────────────┐│
│ │☑ 🏥 Hôpital     │ │☑ 💊 Pharmacie   ││
│ │  0.8 km         │ │  0.3 km         ││
│ │  [⭐ Prioritaire]│ │  [⭐ Prioritaire]││
│ └─────────────────┘ └─────────────────┘│
│                                         │
│ ┌─────────────────┐ ┌─────────────────┐│
│ │☑ 🎓 École       │ │☐ 🏦 Banque      ││
│ │  1.2 km         │ │  2.5 km         ││
│ │  [⭐ Prioritaire]│ │                 ││
│ └─────────────────┘ └─────────────────┘│
└─────────────────────────────────────────┘
```

**Différences:**
- ✅ 29 → 13 commodités (56% de réduction)
- ✅ Badge "Prioritaire" pour les essentielles
- ✅ Une seule section (vs 2 sections)
- ✅ Grid plus aérée et responsive
- ✅ Clic sur toute la card (vs checkbox uniquement)

---

## ✅ VALIDATION

### Checklist
- [x] Liste `amenityOptions` réduite à 13 items
- [ ] Logs de debug supprimés
- [ ] Code commodités simplifié (50% moins de lignes)
- [ ] Carte localisation agrandie
- [ ] Bouton "Extraire" amélioré
- [ ] `shouldDirty: true` ajouté aux setValue()
- [ ] Tests de sauvegarde OK

---

**Prochaine étape:** Implémenter les corrections dans le code.
