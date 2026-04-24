# Phase 7 - i18n EN/FR 100% + rapport autres langues

> Date : 2026-04-24
> Branche : `cleanup/socle-stabilisation`

## Résumé

| Lang | Coverage avant | Coverage après | Action |
|---|---|---|---|
| EN | 100% (374 clés, référence) | 100% | aucune |
| FR | 92.8% (347 clés, 27 manquantes) | **100%** (374 clés) | 27 clés ajoutées |
| EL | 92.2% | 92.2% | rapport généré |
| ES | 88.5% | 88.5% | rapport généré |
| RU | 53.5% | 53.5% | rapport généré |
| DE | 47.6% | 47.6% | rapport généré |
| IT | 47.6% | 47.6% | rapport généré |
| NL | 47.6% | 47.6% | rapport généré |

**Objectif atteint** : EN + FR à 100%. Rapport détaillé des clés manquantes pour les 6 autres langues.

## 27 clés ajoutées en FR

Catégorie `documentation.*` (7 clés) :
- `documentation.api`, `documentation.external`, `documentation.features`, `documentation.quickStart`, `documentation.shortcuts`, `documentation.subtitle`, `documentation.title`

Catégorie `fields.*` (9 clés) :
- `fields.available`, `fields.buildingName`, `fields.constructionStatus`, `fields.contact`, `fields.priceFrom`, `fields.priceMax`, `fields.priceTo`, `fields.rating`, `fields.status`, `fields.website`

Catégorie `messages.*` (11 clés) :
- `messages.buildingDeleted`, `messages.buildingDeletedTitle`, `messages.deleteBuildingConfirm`, `messages.deleteBuildingConfirmWithDeps`, `messages.deleteBuildingError`, `messages.deleteProjectConfirm`, `messages.deleteProjectConfirmWithDeps`, `messages.deleteProjectError`, `messages.projectDeleted`, `messages.projectDeletedTitle`

Traductions humaines depuis EN (pas d'auto-traduction). Style cohérent avec le reste de `fr.json`.

## Rapport détaillé

Fichier généré : `docs/audits/i18n-missing-keys.md` (912 lignes).

Contient :
1. Coverage summary (tableau toutes langues)
2. Liste détaillée par langue avec la valeur EN de référence pour chaque clé manquante

**À ne pas auto-traduire** (règle gouvernance) : un traducteur natif validera EL, RU, ES, IT, DE, NL. Le rapport sert de TODO pour l'équipe.

## Validation

- `npm run build` : PASS (8.45s)
- `src/locales/fr.json` : 374 clés (= EN)
- `src/locales/en.json` : inchangé (référence)

## Recommandation Phase 8

Tests Vitest. Vérifier si Vitest est déjà dans devDependencies ou l'ajouter. Écrire 5-10 tests critiques :
- `useAgenticSearch` (supprimé Phase 1 → choisir autre hook)
- `projectSchema.ts` validation Zod
- `property.schema.ts` validation Zod
- `amenitiesMapper.ts` conversion
- Golden Visa detection logic
