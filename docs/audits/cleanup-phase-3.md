# Phase 3 - Refacto fichiers > 600 lignes (partielle)

> Date : 2026-04-24
> Branche : `cleanup/socle-stabilisation`
> Statut : partielle - décision Jean-Marie requise pour la suite

## Résumé

Phase 3 **partiellement complétée**. Voir `docs/audits/QUESTION-PHASE-3.md` pour le détail des options.

**Décision prise** : extraction safe des configs inline pour gagner des lignes sans risque. Refacto massif (découpage en sous-composants) reporté à une Phase 3b dédiée avec validation Jean-Marie + tests Cypress étendus.

## Ce qui a été fait

### AIAgentsManager.tsx : 1066 → 884 lignes (-17%)

Extraction des constantes `AI_AGENTS` (175 lignes de prompts AI) et `PROVIDERS` (7 lignes) dans un fichier de config dédié :

- **Nouveau fichier** : `src/components/admin/settings/aiAgents.config.ts` (201 lignes)
- **Fichier source** : `src/components/admin/settings/AIAgentsManager.tsx` (884 lignes)

Avantages :
- Prompts AI éditables sans toucher le composant React
- Test unitaire des prompts possible isolément
- Import explicite : `import { AI_AGENTS, PROVIDERS } from './aiAgents.config';`

## Ce qui N'A PAS été fait (et pourquoi)

### Fichiers restants > 600 lignes

| Fichier | Lignes | Raison du report |
|---|---|---|
| `src/components/admin/projects/ProjectFormSteps.tsx` | 3340 | Découpage en 10+ sous-composants nécessite tests Cypress étendus. Trop risqué en one-shot. |
| `src/pages/Projects.tsx` | 1217 | Page publique active, state partagé URL/React Query/localStorage. Découpage demande validation manuelle. |
| `src/pages/admin/AdminDevelopers.tsx` | 909 | CRUD + upload + i18n. Découpage faisable mais pas triviale sans test. |
| `src/pages/admin/AdminProjectForm.tsx` | 830 | Wrapper de ProjectFormSteps, dépend de ce dernier. |
| `src/pages/admin/AdminUnits.tsx` | 760 | Non touché. |
| `src/components/ui/sidebar.tsx` | 761 | Shadcn UI imported, ne pas modifier. |
| `src/pages/Dashboard.tsx` | 723 | Non touché. |
| `src/pages/admin/AdminPropertyForm.tsx` | 681 | Touché superficiellement en Phase 2. |
| `src/components/admin/buildings/BuildingFormWithSidebar.tsx` | 653 | Non touché. |
| `src/pages/Blog.tsx` | 646 | Non touché. |
| `src/pages/admin/AdminProjectDetail.tsx` | 644 | Touché superficiellement en Phase 2. |
| `src/components/admin/projects/CategorizedMediaUploader.tsx` | 632 | Non touché. |
| `src/pages/admin/AdminTests.tsx` | 612 | Touché superficiellement en Phase 2. |
| `src/pages/admin/AdminContent.tsx` | 605 | Non touché. |

## Plan suggéré pour Phase 3b

Une session dédiée **après les tests Vitest (Phase 8)** :

1. Écrire 3-5 tests Cypress supplémentaires pour le formulaire projet multi-étapes
2. Refacto `ProjectFormSteps.tsx` étape par étape avec validation manuelle Jean-Marie
3. Extraire hooks partagés :
   - `useProjectFormBasics`
   - `useProjectFormLocation` 
   - `useProjectFormPricing`
   - `useProjectFormAmenities`
   - `useProjectFormPhotos`
4. Chaque étape sauvegardée + testée avant la suivante

## Validation

- `npm run build` : PASS (8.21s)
- Aucune régression détectée
- Import `AI_AGENTS` et `PROVIDERS` fonctionne depuis config file

## Recommandation Phase 4

Passer directement au Mock data cleanup — tous les mocks identifiés dans AUDIT_2026_03_19 ont déjà été partiellement retirés en Phase 1 (CronaTestRunner, cronaGroupTestData, FinancingInvestmentSection pointaient vers des fichiers supprimés). Vérifier ce qui reste.
