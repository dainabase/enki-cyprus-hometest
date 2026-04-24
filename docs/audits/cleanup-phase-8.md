# Phase 8 - Tests Vitest socle minimum

> Date : 2026-04-24
> Branche : `cleanup/socle-stabilisation`

## Résumé

**42 tests** unitaires écrits sur 5 fichiers critiques. Tous **PASS** en ~325ms.

## Installation

```bash
npm install --save-dev vitest @vitest/ui happy-dom
```

Ajoutés dans `package.json` devDependencies :
- `vitest@^4.1.5`
- `happy-dom@^20.9.0`
- `@vitest/ui` (pour futurs debugs visuels)

## Configuration

Nouveau fichier `vitest.config.ts` :
```ts
{
  environment: 'happy-dom',
  globals: true,
  include: ['src/**/*.test.{ts,tsx}'],
  exclude: ['node_modules', 'dist', 'cypress'],
  resolve: { alias: { '@': './src' } }
}
```

Scripts ajoutés dans `package.json` :
- `npm test` → `vitest run` (one-shot, pour CI)
- `npm run test:watch` → `vitest` (mode watch dev)
- `npm run test:ui` → `vitest --ui` (interface visuelle)

## Tests écrits

### 1. `src/schemas/projectSchema.test.ts` — 8 tests

Validation Zod du schéma projet :
- Accepte projet minimal valide
- Rejette title < 3 caractères
- Rejette developer_id non-UUID
- Rejette description < 10 caractères
- Accepte launch_month YYYY-MM
- Rejette launch_month mauvais format
- Accepte property_sub_type array valide
- Rejette property_sub_type enum invalide

### 2. `src/schemas/property.schema.test.ts` — 8 tests

Validation Zod du schéma propriété :
- Accepte propriété minimale valide
- Rejette project_id non-UUID
- Rejette unit_number vide
- Rejette bedrooms_count > 20
- Accepte building_id null (villa individuelle)
- Transforme building_id '' en null (via `.transform()`)
- Rejette internal_area = 0
- Rejette property_type invalide

### 3. `src/utils/amenitiesMapper.test.ts` — 13 tests

Conversion amenities et photos :
- `amenitiesLegacyToCode` : 2 tests (piscine→swimming_pool, conciergerie→concierge)
- `convertLegacyAmenities` : 5 tests (FR→EN, already-coded, null, non-array, filter)
- `convertPhotosToCategorized` : 4 tests (null, undefined, array strings, object avec category)
- `prepareSurroundingAmenities` : 2 tests (filtre invalides, null safe)

### 4. `src/lib/supabase.test.ts` — 7 tests

`transformDatabaseProperty` mapper :
- Mappe id et title
- Formate price avec EUR
- Fallback "Prix sur demande" si price_from null
- Coordonnées Cyprus par défaut
- Coordonnées GPS si fournies
- Coerce features object→string[]
- Fallback amenities si features vide

### 5. `src/lib/goldenVisa.test.ts` — 6 tests

Règle métier Cyprus Golden Visa (seuil 300k EUR, inclusif) :
- price >= 300000 → eligible
- price < 300000 → not eligible
- null/undefined/NaN → false
- Exactement 300000 → true (borne incluse)

## Résultats

```
Test Files  5 passed (5)
Tests      42 passed (42)
Duration   325ms
```

## Limitations

### Cypress E2E non lancé

Le lancement local de Cypress nécessite un serveur dev actif (`npm run dev`) et un environnement Supabase accessible. Non exécuté dans cette session. Les 6 tests Cypress existants dans `cypress/e2e/` ne sont pas modifiés — ils restent valides pour validation manuelle.

### Coverage non mesuré

`vitest --coverage` nécessite un provider (`c8` ou `istanbul`). Non installé en Phase 8 — à ajouter si un seuil de coverage devient un critère CI.

## Validation

- `npm test` : 42/42 PASS en 325ms
- `npm run build` : PASS (reste stable)
- Aucun faux positif (tous les tests ciblent du code réel)

## Recommandation Phase 9

Préparation déploiement Edge Functions :
- Documenter chaque Edge Function avec `DEPLOY.md`
- Créer script interactif `scripts/deploy-edge-functions.sh`
- **NE PAS déployer** — Jean-Marie lancera manuellement
