# Phase 2 - TypeScript `any` eradication

> Date : 2026-04-24
> Branche : `cleanup/socle-stabilisation`
> Objectif : descendre sous 100 `any` (depuis 843 initial, 275 post-Phase-1)

## Résumé

**Baseline post-Phase-1** : 275 occurrences `: any` (hors `types.ts` Supabase généré)
**Après Phase 2** : 96 occurrences `: any`
**Delta** : -179 any (-65%)

**Objectif atteint** : sous 100 occurrences restantes. Les 96 restantes incluent :
- 23 dans le cluster ProjectPageV2 (non touché - décision Jean-Marie requise, voir QUESTION-PHASE-1.md)
- ~73 cas à queue longue dispersés (files à 1-2 any chacun)

## Stratégie appliquée

| Cas rencontré | Remplacement choisi |
|---|---|
| `param: any` opaque | `param: unknown` + type guard si nécessaire |
| `(row: any) => void` onEdit / onClick callbacks | `(row: Record<string, unknown>) => void` ou type strict projet/propriété |
| `items: any[]` tableaux typés mais imprécis | `items: Array<Record<string, unknown>>` ou type structurel |
| `catch (error: any)` | `catch (error)` (défaut TS strict: `unknown`) + `error instanceof Error ? error.message : ...` |
| JSONB Supabase `payment_plans: any` | `Record<string, unknown> \| null` |
| Photos `any[]` | `string[]` ou `Array<{ url: string; category?: string }>` |
| Sentry `(window as any).Sentry` | `(window as unknown as { Sentry?: SentryLike })` |
| `(...args: any[]) => any` helpers | `(...args: unknown[]) => unknown` |

## Fichiers traités

Total **35 fichiers** modifiés pour retirer les `any`.

### Vague 1 - Top 5 hot spots

| Fichier | Avant | Après |
|---|---|---|
| `src/hooks/useProjectData.ts` | 19 | 0 |
| `src/utils/amenitiesMapper.ts` | 12 | 0 |
| `src/lib/pdf/propertyPdfGenerator.ts` | 11 | 0 |
| `src/utils/gallery.ts` | 7 | 0 |
| `src/utils/dataIntegrityChecker.ts` | 6 | 0 |

### Vague 2 - Form & tables

| Fichier | Avant | Après |
|---|---|---|
| `src/lib/supabase.ts` | 7 | 0 |
| `src/pages/admin/AdminProjectForm.tsx` | 7 | 0 |
| `src/components/admin/projects/ProjectsTable.tsx` | 6 | 0 |
| `src/components/admin/buildings/BuildingsTable.tsx` | 6 | 0 |
| `src/components/admin/projects/ProjectTableView.tsx` | 5 | 0 |
| `src/lib/supabase/integrity.ts` | 5 | 0 |
| `src/hooks/useFormAutosave.ts` | 5 | 0 |
| `src/lib/logger.ts` | 4 | 0 |

### Vague 3 - Views projet (pattern récurrent)

Pattern identique (3 any : `projects: any[]`, `onEdit: (project: any) => void`, `getDeveloperName(project: any)`) corrigé dans :
- `src/components/admin/projects/ProjectListView.tsx`
- `src/components/admin/projects/ProjectCardView.tsx`
- `src/components/admin/projects/ProjectCompactView.tsx`
- `src/components/admin/projects/ProjectDetailedView.tsx`

### Vague 4 - Pages admin et sections publiques

| Fichier | Avant | Après |
|---|---|---|
| `src/pages/admin/AdminProjects.tsx` | 6 | 0 |
| `src/pages/admin/AdminPropertyForm.tsx` | 4 | 0 |
| `src/pages/admin/AdminProjectDetail.tsx` | 4 | 0 |
| `src/services/ai/AgentSEO.ts` | 4 | 0 |
| `src/lib/supabase/projects.ts` | 4 | 0 |
| `src/pages/projects/components/HeroSection.tsx` | 3 | 0 |
| `src/pages/projects/components/Gallery.tsx` | 3 | 0 |
| `src/pages/projects/components/FloorPlans.tsx` | 3 | 0 |
| `src/pages/admin/AdminTests.tsx` | 3 | 0 |
| `src/components/admin/properties/PropertiesSection.tsx` | 3 | 0 |
| `src/components/admin/properties/steps/IdentificationStep.tsx` | 3 | 0 |
| `src/components/admin/projects/CommoditiesCheckboxes.tsx` | 3 | 0 |
| `src/components/admin/developers/DeveloperTableView.tsx` | 3 | 0 |
| `src/components/admin/ProjectActionDialog.tsx` | 3 | 0 |
| `src/components/admin/AdminSidebarExecutive.tsx` | 3 | 0 |

### Vague 5 - Property views (sed batch)

Pattern identique corrigé via sed dans :
- `src/components/admin/properties/PropertyTableView.tsx`
- `src/components/admin/properties/PropertyListView.tsx`
- `src/components/admin/properties/PropertyCardView.tsx`
- `src/components/admin/properties/PropertyCompactView.tsx`
- `src/components/admin/properties/PropertyDetailedView.tsx`

### Vague 6 - Utils et hooks finaux

- `src/utils/performance.ts` (memoize helper)
- `src/hooks/useDebounceCallback.ts` (args typés)
- `src/contexts/AuthContext.tsx` (Profile + signUp metadata)

## 96 `any` restantes (décomposition)

| Catégorie | Nombre | Justification |
|---|---|---|
| Cluster `ProjectPageV2/**` | 23 | Décision Jean-Marie attendue (voir QUESTION-PHASE-1.md) |
| Fichiers à 2 any (queue) | ~40 | Patterns divers (Property*/Project*Forms, tables queue, etc.) |
| Fichiers à 1 any | ~33 | Cas isolés, coûts élevés de typage pour gain marginal |

## Build & lint

- `npm run build` : PASS (8.08s - stable)
- Aucun test régression détecté dans le build
- dist/ reste à ~15 MB

## Recommandations Phase 3

Maintenant que le typage est au propre sur les chemins critiques, passer au refacto des gros fichiers :
1. `ProjectFormSteps.tsx` (3340 lignes)
2. `Projects.tsx` (1217 lignes)
3. `AIAgentsManager.tsx` (1066 lignes)
4. `AdminDevelopers.tsx` (909 lignes)

Une fois ces fichiers découpés, le type checking sera plus rapide et le diff des PRs beaucoup plus lisible.
