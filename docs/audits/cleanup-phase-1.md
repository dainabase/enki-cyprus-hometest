# Phase 1 - Dead code cleanup

> Date : 2026-04-24
> Branche : `cleanup/socle-stabilisation`
> Objectif : supprimer dead code confirmé, descendre knip < 30 items

## Résumé

**125 fichiers supprimés**, répartis en 4 vagues + 1 knip.json de configuration ajouté.

## Métriques avant / après

| Indicateur | Avant Phase 1 | Après Phase 1 | Delta |
|---|---|---|---|
| knip dead files (sans config) | 170 | 143 (post vague 0) → 16 (post config + vagues) | -154 |
| knip issues totales | 233 | 65 | -168 |
| dist/ total | 17 MB | 15 MB | -2 MB |
| Build duration | 8.70s | 8.13s | -0.57s |
| Build warnings | quelques | identiques | 0 |

**Objectif cible atteint** : knip dead < 30 ✓ (16 restants).

## Vague 0 - Suppressions prioritaires (18 + 1 = 19 fichiers)

- `src/app/(public)/**` - 18 fichiers Next.js App Router dans un projet Vite (dead code copie d'archi)
- `src/pages/ProjectDetail.tsx.old` - fichier `.old` orphelin

## Vague 1 - Dead code évident (27 fichiers)

Fichiers hors src/ :
- `test-supabase-connection.js`, `verify-database-structure.js`
- `utils/mockProjectEnrichment.js`, `utils/mockValidation.js`
- `types/mock-enrichment.ts`
- `test/jardins-maria-test.ts`
- `scripts/execute-seed.js`, `scripts/seed-projects.js`, `scripts/test-mock-enrichment.js`

Dans src/ :
- `src/App.css` - aucun import
- `src/pages/Admin.tsx`, `src/pages/AdminProjects.tsx` - remplacés par `src/pages/admin/*`
- `src/components/admin/AdminSidebar.tsx` - remplacé par `AdminSidebarExecutive.tsx`
- `src/components/TabsFeatures-Alternative1..6.tsx` - 6 variantes non utilisées (Home.tsx utilise `TabsFeatures-Alternative5-Accordion`)
- `src/components/hero/Alternative1.tsx`, `Alternative2.tsx`, `Alternative5.tsx` - Home.tsx utilise seulement `Alternative3`
- `src/components/hero/HeroSelector.tsx`, `HeroAlternative5.tsx`, `ChatAlternative4.tsx` - chaîne orpheline
- `src/lib/codebase-copier.ts` + `src/pages/admin/AdminCodebaseCopier.tsx` - outil admin non routé

## Vague 2 - Cluster Search + Admin Test + Pages orphelines (30 fichiers)

Cluster Search (9 fichiers) :
- `src/contexts/SearchContext.tsx`
- `src/components/search/{AdvancedSearchForm,EnhancedGoogleMap,PropertySearchResults,SearchErrorBoundary}.tsx`
- `src/components/{PropertySearch,FeaturedProjectCard}.tsx`
- `src/types/frontend.types.ts` - créé en session 2026-03-19 mais tous ses consommateurs étaient dead
- `src/data/mockData.ts` - imports retirés en session 2026-03-19

Cluster Admin Test (9 fichiers) :
- `src/pages/admin/AdminTestIntegration.tsx`
- `src/components/admin/test/{CronaTestRunner,DataSeeder,HealthCheckPanel,IntegrityReport,StatisticsDashboard}.tsx`
- `src/utils/{cronaGroupTestData,runCronaTest}.ts`
- `src/lib/supabase/test-helpers.ts`
- Ces suppressions éliminent les dernières références hardcodées à `Jardins de Maria`

Pages admin orphelines (4) : `AdminAIImport`, `AdminBuildingDetail`, `AdminUsers`, `TestPage`
Agentic search orphelin (3) : `AgenticSearchForm`, `AgenticSearchModal`, `useAgenticSearch`
Composants isolés (5) : `MiniMap`, `VerticalAccordion`, `VirtualTourViewer`, `FloorPlanModal`, `LoadingIndicator`

## Vague 3 - Hooks / utils / admin orphelins (23 fichiers)

Hooks (4) : `useABTest`, `useDebounce`, `useScrollLock`, `useSecureAdmin`
Utils (5) : `addressExtraction`, `fixCriticalIssues`, `testGoogleMaps`, `csvExport`, `projectImageHelpers`
Lib (4) : `imageCompression`, `seo`, `services/ai/SEOAgent`, `config/environment`
Chat/layout (4) : `chat/ChatExpandButton`, `chat/ChatHeader`, `layout/Navbar`, `admin/ImageUploader`
Buildings steps (6) : `AdvancedStep`, `AmenitiesStep`, `InfrastructureStep`, `LeisureStep`, `SecurityStep`, `ServicesStep`

## Vague 4 - ai-import / excel / pdf / admin sections (27 fichiers)

ai-import (7) : tous les fichiers v1 (`types.ts` v1, `aiExtractionPrompt`, `aiFieldMapper`, `cyprusFieldsValidator`, `debugExtractor`, `mapper`, `propertyAIExtractor`). `types-v2.ts` conservé (utilisé par `UnifiedAIImporter`).
excel (2) : `propertyParser`, `propertyTemplate`
pdf (1) : `batchPdfExporter`
storage (1) : `storage/projectImages`
admin/properties (5) : `BulkPropertyCreator`, `CSVImporter`, `PropertyGlobalModal`, `PropertyOCRImporter`, `PropertyWizard`
admin/projects (8) : `AIFieldIndicator`, `AIImportDropzone`, `AddressAutocomplete`, `DocumentManager`, `NearbyAmenitiesSelector`, `ProjectFilters`, `SimplifiedNearbyAmenities`, `addressExtractionPatch`
Autres (3) : `admin/ai/ValidationWizard`, `admin/buildings/BuildingFilters`, `admin/common/LanguageSelector`

## Configuration knip ajoutée

Fichier `knip.json` créé pour exclure les faux positifs :

```json
{
  "entry": ["src/main.tsx", "index.html", "scripts/generate-sitemap.js", "cypress/e2e/**/*.cy.{ts,tsx}", "cypress/support/**/*.{ts,tsx}"],
  "project": ["src/**/*.{ts,tsx}", "scripts/**/*.{js,ts}"],
  "ignore": [
    "src/components/ui/**",
    "src/integrations/supabase/types.ts",
    "supabase/functions/**",
    "dist/**",
    "node_modules/**"
  ]
}
```

Raisons des exclusions :
- `src/components/ui/**` : composants Shadcn utilisés dynamiquement via patterns de composition — nombreux faux positifs knip.
- `supabase/functions/**` : Edge Functions Deno déployées sur Supabase, environnement non compris par knip.
- `src/integrations/supabase/types.ts` : fichier généré automatiquement.

## Dead files restants (16) — cluster ProjectPageV2

Non supprimés en Phase 1 : décision Jean-Marie requise.

Voir `docs/audits/QUESTION-PHASE-1.md` pour le détail et les options.

- 9 composants/sections dans `src/components/ProjectPageV2/**`
- 2 utils dans `src/components/ProjectPageV2/utils/`
- 3 hooks associés (`useProjectFinancing`, `useProjectSocialProof`, `useProjectTypologies`)
- 2 types associés (`financing.ts`, `socialProof.ts`)

## Validations

- `npm run build` : PASS après chaque vague (final : 8.13s)
- `knip` : 16 dead files restants, 49 unused exports/types à investiguer en phase ultérieure
- Aucun import cassé détecté dans le build
- Aucune modification de tables Supabase ni Edge Functions

## Fichiers modifiés

- Ajouté : `knip.json`, `docs/audits/QUESTION-PHASE-1.md`, `docs/audits/cleanup-phase-1.md`
- Supprimés : 125 fichiers listés ci-dessus

## Recommandation Phase 2

Avec le dead code retiré, le comptage `any` sera plus représentatif. Démarrer Phase 2 par un `grep` baseline, puis attaquer le top 10 :
1. `src/schemas/projectSchema.ts` (36) — déjà partiellement traité en session 2026-03-19
2. `src/pages/admin/AdminPropertyForm.tsx` (27)
3. `src/pages/admin/AdminProjectForm.tsx` (22)
4. `src/hooks/useProjectData.ts` (20)
5. `src/pages/admin/AdminProjects.tsx` (18)
