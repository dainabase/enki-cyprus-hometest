# Phase 4 - Mock data cleanup et documentation

> Date : 2026-04-24
> Branche : `cleanup/socle-stabilisation`

## Résumé

La plupart des mocks identifiés dans AUDIT_2026_03_19 ont été **automatiquement supprimés en Phase 1** quand les fichiers morts ont été retirés.

## État initial (pré-Phase 1)

Selon AUDIT_2026_03_19, fichiers avec `TODO: MOCK` :
- `src/components/admin/test/CronaTestRunner.tsx` — **supprimé en Phase 1**
- `src/components/lexaia/TaxStructureRecommendation.tsx`
- `src/components/ProjectPageV2/sections/FinancingInvestmentSection.tsx` — dans cluster ProjectPageV2 en attente
- `src/lib/api/properties.ts`
- `src/lib/ai-import/debugExtractor.ts` — **supprimé en Phase 1**

Références "Jardins de Maria" :
- `src/components/admin/test/CronaTestRunner.tsx` — **supprimé en Phase 1**
- `src/utils/cronaGroupTestData.ts` — **supprimé en Phase 1**
- `src/components/admin/test/IntegrityReport.tsx` — **supprimé en Phase 1**
- `src/components/admin/test/HealthCheckPanel.tsx` — **supprimé en Phase 1**
- `src/components/admin/buildings/BuildingFormWithSidebar.tsx` — vérifié, aucune ref trouvée actuellement
- `test/jardins-maria-test.ts` — **supprimé en Phase 1**

## Vérification post-Phase-1

```
grep -rn "Jardins de Maria" src/ → 0 matches
grep -rn "TODO: MOCK" src/ → 0 matches avant Phase 4, 2 après (volontairement ajoutés)
```

## Ce qui reste

### `src/lib/api/properties.ts`

Inspection : fichier contient uniquement des **appels Supabase réels** (`supabase.from('properties').select(...)`, etc.). Aucun mock data. La mention dans l'audit était dépassée (déjà corrigée avant cette session).

### `src/components/lexaia/TaxStructureRecommendation.tsx`

Contient 3 recommandations fiscales hardcodées :
- Non-Domiciled (Non-Dom) Status
- Holding Company Structure
- 60-Day Rule Optimization

**Non mock au sens strict** : contenu statique éditorial (UX), pas de données personnalisées dépendant du profil utilisateur. Pas besoin de base de données pour l'instant.

### `src/components/ProjectPageV2/sections/FinancingInvestmentSection.tsx`

Dans le cluster `ProjectPageV2` non touché (décision Jean-Marie requise, voir QUESTION-PHASE-1.md). Si ce cluster est supprimé en Phase 3b, ce mock disparaît avec.

## Mocks implicites (non taggés) découverts et flaggés

### `src/components/admin/buildings/BuildingsTable.tsx:97`
Calcul `Math.floor(total * 0.3)` pour simuler 30% de disponibilité. Ajouté :
```ts
// TODO: MOCK - remplacer par count reel properties WHERE building_id AND sale_status='available'
```

### `src/pages/admin/AdminContent.tsx:113`
`await new Promise(resolve => setTimeout(resolve, 1000))` pour simuler un appel API CMS. Ajouté :
```ts
// TODO: MOCK - connecter a une table content_settings Supabase (delai 1s simule un appel reseau)
```

## Autres découvertes

Quelques TODO features présents (pas des mocks data) :
- `src/components/projects/ProjectCard.tsx:242` — virtual tour non implémenté
- `src/components/projects/ProjectCard.tsx:255` — comparaison non implémentée
- `src/components/admin/projects/ProjectFormSteps.tsx:3322-3332` — 3 steps placeholder
- `src/pages/Projects.tsx:1112` — newsletter subscription non connectée
- `src/pages/About.tsx:5` — fetch developers pas encore Supabase-connecté

Ces TODO features ne sont pas des "mock data" au sens strict (elles renvoient vide ou no-op, pas de valeurs mensongères).

## Validation

- `npm run build` : PASS (7.75s)
- `grep "TODO: MOCK"` : 2 matches (les 2 ajoutés volontairement, bien préfixés)
- `grep "Jardins de Maria"` : 0 match
- `src/data/mockData.ts` : supprimé en Phase 1

## Recommandation Phase 5

Passer au cleanup des console.log. Le logger existe déjà à `src/lib/logger.ts` (amélioré en Phase 2). Il suffit de grep/remplacer les `console.log` actifs par `logger.info` ou `logger.debug`.
