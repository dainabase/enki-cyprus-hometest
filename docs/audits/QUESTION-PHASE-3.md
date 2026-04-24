# Question Jean-Marie - Phase 3 Refacto fichiers > 600 lignes

## Constat

15 fichiers dépassent 600 lignes, dont 5 critiques :

| Fichier | Lignes | Type |
|---|---|---|
| `src/components/admin/projects/ProjectFormSteps.tsx` | 3340 | Formulaire multi-étapes projet |
| `src/pages/Projects.tsx` | 1217 | Page publique listing projets |
| `src/components/admin/settings/AIAgentsManager.tsx` | 884 (était 1066) | Config agents IA |
| `src/pages/admin/AdminDevelopers.tsx` | 909 | CRUD développeurs |
| `src/pages/admin/AdminProjectForm.tsx` | 830 | Wrapper du ProjectFormSteps |

## Ce qui a été fait en Phase 3

Extraction safe des **constantes et configs** (aucun changement de comportement) :

1. `src/components/admin/settings/AIAgentsManager.tsx` : 1066 → 884 lignes
   - Extrait 175 lignes de prompts AI vers `aiAgents.config.ts` (201 lignes)
   - Plus simple à maintenir, prompts éditables sans toucher la UI

## Pourquoi le reste est à risque

**Les autres fichiers nécessitent un vrai découpage de composants**, pas seulement des extractions de constantes :

- `ProjectFormSteps.tsx` (3340) est un composant unique avec 10+ étapes imbriquées et logique inter-étapes (amenities surround, Google Maps geocoding, photos categorized, watch/setValue sur dizaines de champs). Un découpage nécessite :
  - Extraction par étape : `useProjectFormStep1`, `StepBasicsForm`, etc.
  - Factoring de la logique métier dans hooks (`useSurroundingAmenities`, `useCategorizedPhotos`)
  - Réécriture des communications inter-étapes
  - **Tests E2E Cypress devraient valider chaque étape pour éviter régression**

- `Projects.tsx` (1217) est une page publique avec filtres, pagination, vue carte, vue liste, golden visa, tri multi-critères. Découpage possible en `ProjectsFilters`, `ProjectsList`, `ProjectsMap` mais beaucoup de state partagé (URL params, React Query, localStorage).

- `AdminDevelopers.tsx` (909) gère CRUD + upload + i18n. Découpage en `DeveloperList`, `DeveloperForm`, `DeveloperDetail` faisable mais nécessite extraire des hooks partagés.

## Options

### Option A — Refacto complet maintenant (risqué)
- Pour : code clean, objectif atteint
- Contre : sans Cypress vert actuel, régression possible en production. Les tests Cypress existants ne couvrent pas toutes les étapes du formulaire. Jean-Marie utilise le site activement.

### Option B — Refacto échelonné (recommandé)
- Phase 3a (maintenant, fait) : extraction configs safe
- Phase 3b (session dédiée) : refacto Projects.tsx avec validation manuelle sur chaque vue
- Phase 3c (session dédiée) : refacto AdminDevelopers.tsx
- Phase 3d (session dédiée, plus tard) : refacto ProjectFormSteps.tsx en découpant étape par étape, avec Jean-Marie qui teste à chaque étape

### Option C — Accepter la dette et avancer
- Pour : débloque les phases 4-10 (logger, bundle, i18n, tests, déploiement)
- Contre : fichiers monstres restent, mais code typé (Phase 2) et dead code retiré (Phase 1) = qualité déjà en hausse
- Les tests Cypress existants restent valides

## Recommandation

**Option C pour cette session** : accepter temporairement la dette sur les 4 gros fichiers restants. Passer aux phases 4-10 qui sont plus isolées et moins risquées.

Planifier une **Phase 3b dédiée** une fois que :
1. Les tests Vitest de Phase 8 sont en place (pour unit-tester les hooks extraits)
2. Les tests Cypress existants ont été étendus à tous les steps
3. Un environnement staging est disponible pour validation

## Action attendue

Confirmer l'option choisie (A, B ou C).

En attendant, la Phase 3 est considérée **partiellement complétée** :
- AIAgentsManager : 1066 → 884 lignes (-17%)
- Les 14 autres fichiers restent inchangés

Les phases 4-10 démarrent en Option C par défaut.
