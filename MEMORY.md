# MEMORY.md - Journal Vivant ENKI Reality

> Mis a jour apres chaque session significative.
> Source de verite pour le contexte recent.

## Session 2026-04-24 - Cleanup Socle Stabilisation (10 phases)

### Contexte
Session autonome Claude Code mode loop sur repo ENKI Reality. Architecte du plan: Claude Opus 4.7. Execution: 10 phases de cleanup documentees dans `docs/audits/cleanup-phase-[0-9].md`.

### Actions realisees

**Phase 0 - Setup**: branche `cleanup/socle-stabilisation` creee, `.gitignore` renforce pour `.claude/settings.local.json`.

**Phase 1 - Dead code**: 125 fichiers supprimes (45 Next.js App Router + scripts legacy + Search cluster + admin/test + 4 pages admin orphelines + ai-import v1 + hero alternatives + Property/Project views dead). `knip.json` cree avec exclusions pour Shadcn UI + Edge Functions Deno. Cluster ProjectPageV2 (16 fichiers) laisse intact - decision Jean-Marie requise (QUESTION-PHASE-1.md).

**Phase 2 - TypeScript any**: 275 -> 96 (-65%). 35 fichiers traites. Types stricts, Record<string, unknown>, type guards, Supabase Row types. 23 any restants dans ProjectPageV2 non touche.

**Phase 3 - Refacto gros fichiers**: PARTIELLE (option C). Extraction safe AI_AGENTS config de AIAgentsManager.tsx (1066 -> 884 lignes). 14 autres fichiers > 600 lignes non refactores - decision reportee (QUESTION-PHASE-3.md) car tests E2E insuffisants pour garantir zero regression.

**Phase 4 - Mock data**: 2 mocks implicites flagges avec `// TODO: MOCK` (BuildingsTable.tsx calcul 30% dispo, AdminContent.tsx setTimeout simule API). `grep 'Jardins de Maria' src/` retourne 0.

**Phase 5 - console.log**: 181 -> 0 hors logger.ts (2 restants dans logger.ts = implementation). Script Python auto-import + auto-replace sur 38 fichiers. 3 imports multi-lignes casses puis fixes.

**Phase 6 - Bundle WebP**: dist 15MB -> 7.9MB (-47%), public 10MB -> 3MB (-70%). 16 images converties (PNG gains 76-98%, JPG gains 5-30%). Chunking vite.config.ts confirme (vendor/ui/maps/supabase), 16 pages lazy() dans App.tsx.

**Phase 7 - i18n**: FR 92.8% -> 100% (27 cles traduites manuellement EN->FR: documentation.*, fields.*, messages.*). Rapport detaille `i18n-missing-keys.md` pour EL/RU/ES/IT/DE/NL (pas d'auto-traduction).

**Phase 8 - Tests**: Vitest installe (v4.1.5 + happy-dom). 42 tests ecrits sur 5 fichiers (projectSchema, property.schema, amenitiesMapper, supabase.ts transformer, goldenVisa metier 300k EUR inclusif). Tous PASS en 325ms.

**Phase 9 - Edge Functions**: 16 `DEPLOY.md` crees + `scripts/deploy-edge-functions.sh` interactif (dry-run testable). Aucun deploiement effectue. google-maps-agent exclue (deja en prod). Jean-Marie doit installer CLI supabase puis lancer le script.

**Phase 10 - Documentation**: CHANGELOG, MEMORY, MATRICE-STATUT, EDGE-FUNCTIONS-REGISTRY mis a jour. Synthese AUDIT_CLEANUP_SOCLE_2026-04.md creee.

### Fichiers nouveaux cles
- `knip.json`, `vitest.config.ts`
- `scripts/deploy-edge-functions.sh`
- `src/components/admin/settings/aiAgents.config.ts`
- `src/{schemas,utils,lib}/*.test.ts` x5
- `supabase/functions/*/DEPLOY.md` x16
- `docs/audits/cleanup-phase-[0-9].md` x11
- `docs/audits/QUESTION-PHASE-{1,3}.md` x2
- `docs/audits/i18n-missing-keys.md`
- `docs/audits/AUDIT_CLEANUP_SOCLE_2026-04.md`

### Statut
- Branche: `cleanup/socle-stabilisation` (11 commits apres main)
- Build: PASS (8.48s)
- Tests: 42/42 PASS
- Tables Supabase touchees: AUCUNE
- Edge Functions deployees: AUCUNE (preparation uniquement)
- `git status` clean apres commit final

### Prochaines actions (pour Jean-Marie)
1. Reviewer QUESTION-PHASE-1.md (decision cluster ProjectPageV2)
2. Reviewer QUESTION-PHASE-3.md (refacto gros fichiers option A/B/C)
3. Merger `cleanup/socle-stabilisation` dans `main` apres validation
4. Installer CLI supabase et lancer `scripts/deploy-edge-functions.sh`
5. Configurer les secrets Supabase (XAI_API_KEY, OPENAI_API_KEY, SENDGRID_API_KEY)
6. Planifier Phase 3b (refacto ProjectFormSteps.tsx etape par etape) + Phase i18n autres langues

---

## Session 2026-03-19 - Post-Cleanup Corrections

### Actions realisees

**ACTION 1 : npm audit fix**
- `npm audit fix` + `npm install jspdf@latest` executes
- Vulnerabilites reduites de 24 (1 critique) a 8 (0 critique)
- Restant : esbuild/vite (moderate, transitive), node-fetch (high, transitive via fbjs), xlsx (high, pas de fix)
- jspdf mis a jour vers derniere version (critique resolu)

**ACTION 2 : Remplacement z.any() dans projectSchema.ts**
- Tous les `z.any()` remplaces par des types stricts
- Arrays de strings : unique_selling_points, smart_home_features, photos, etc.
- Arrays de numbers : plot_sizes_m2
- Records : financing_options, payment_plan, schema_markup, etc.
- Arrays de records : price_list, special_offers, payment_plans
- Categorized photos : z.record(z.string(), z.array(z.string()))
- 0 z.any() restant dans le fichier

**ACTION 3 : Suppression imports mockData**
- Types `Property` et `FeaturedProject` de mockData deplaces vers `src/types/frontend.types.ts`
- Renomme en `DisplayProperty` pour eviter conflit avec le vrai `Property` Supabase
- 5 fichiers mis a jour : SearchContext, PropertySearch, EnhancedGoogleMap, FeaturedProjectCard, About
- About.tsx : partners inlines avec TODO Supabase
- console.log supprimes de PropertySearch.tsx (regle CLAUDE.md)

### Fichiers modifies
- `package.json`, `package-lock.json` (npm audit fix + jspdf)
- `src/schemas/projectSchema.ts` (z.any() -> types stricts)
- `src/types/frontend.types.ts` (nouveau - types display frontend)
- `src/contexts/SearchContext.tsx` (import mockData -> frontend.types)
- `src/components/PropertySearch.tsx` (import + console.log)
- `src/components/search/EnhancedGoogleMap.tsx` (import)
- `src/components/FeaturedProjectCard.tsx` (import)
- `src/pages/About.tsx` (partners inlines)

### Statut
- Tables Supabase touchees : aucune
- Edge Functions modifiees : aucune
- Build : PASS
- 0 z.any() restant
- 0 import mockData dans components/contexts/pages

### Prochaine action
- Deployer les Edge Functions corrigees sur Supabase
- Preparer site public MVP

---

## Session 2026-03-18 (suite) - Fix agentic-search

### Action realisee
**Correction critique `agentic-search` Edge Function** (commit `ff1e908`)

Colonnes fantomes corrigees:
- `price` -> `price_from` / `price_to`
- `location->city` (JSONB inexistant) -> `city` (TEXT)
- `type` -> `property_category`
- `features` -> `unique_selling_points`
- `prop.location?.city` -> `proj.city`

Autres corrections:
- JWT verification ajoutee (etait publiquement accessible)
- Supabase client utilise ANON_KEY + user JWT pour RLS
- Filtre `show_on_website = true` ajoute
- Support filtre `bedrooms_range` ajoute
- Types TypeScript stricts (zero `any`)
- Tous les mocks prefixes `TODO: MOCK`
- Rename `PropertyMatch` -> `ProjectMatch`
- Lexaia fallback n'invente plus de faux chiffres fiscaux
- URL Supabase via env var (plus hardcodee)
- Limite resultats augmentee de 4 a 6 projets

### Statut agentic-search apres fix
- Backend: PARTIAL (fonctionne si XAI_API_KEY configuree, sinon fallback mock)
- Securite: OK (JWT ajoute)
- Colonnes: OK (verifiees via schema Supabase)
- Lexaia integration: MOCK (depend de lexaia-call qui est aussi mock)

### Prochaines actions
1. Deployer la Edge Function sur Supabase (`supabase functions deploy agentic-search`)
2. Configurer XAI_API_KEY dans les secrets Supabase
3. Tester end-to-end avec vraie requete utilisateur
4. Securiser les 13 autres Edge Functions sans JWT (P1)

---

## Session 2026-03-18 - Audit Complet + Gouvernance

### Outils utilises
- Claude (claude.ai) avec MCP Supabase + MCP GitHub + Jules
- Supabase MCP officiel (@supabase/mcp-server-supabase)
- Google Jules pour audit code et corrections

### Actions realisees

**Audit Supabase (direct via MCP)** :
- 25 tables listees avec structure detaillee
- 27 triggers identifies et documentes
- 62 fonctions cataloguees
- 56 RLS policies analysees
- 18 Edge Functions decouvertes et auditees en profondeur

**Corrections RLS (5 migrations appliquees)** :
- enable_rls_on_leads
- tighten_buildings_rls_policies
- tighten_properties_rls_policies
- tighten_projects_rls_policies
- tighten_developers_rls_policies

**Sessions Jules completees** :
1. `8280415768827696041` - AUDIT COMPLET Frontend/Backend
2. `10172869486854252795` - CORRECTIONS P1 Cleanup + MockData TODOs + Zod
3. `5645509866216267691` - AUDIT PROFOND Connexions Frontend/Supabase
4. `11560702176475663916` - GOUVERNANCE (plan complete, push echoue -> repousse manuellement)

**Findings critiques Edge Functions** :
- `agentic-search` : CORRIGE (commit ff1e908)
- `lexaia-call` : API fictive, tout en mock
- `parse-document` : faux OCR, contenu hardcode
- `extract-full-hierarchy` : donnees Jardins de Maria hardcodees
- `google-maps-agent` : seul vrai bijou fonctionnel
- 13/18 fonctions encore sans verification JWT

**Gouvernance creee** (commit c5a6250) :
- CLAUDE.md, MEMORY.md, ROADMAP-BUSINESS.md
- LESSONS-LEARNED.md, EDGE-FUNCTIONS-REGISTRY.md, MATRICE-STATUT.md

---

## Session 2025-12-15 - Audit Claude Code + Corrections

### Actions realisees
- Audit complet Claude Code (AUDIT_CLAUDE_CODE_15DEC2025.md)
- Phase 1 : Quick wins (fichiers obsoletes supprimes, env vars)
- Phase 2 : Critical P1 (lazy loading, TODOs documentes)
- Phase 3 : P2 corrections (logger, types, compression)
- Phase 4 : i18n traductions admin
- Dernier commit avant reprise: `0f3b40f`

---

## Decisions architecturales actives

1. **Agent IA** : UN seul agent conversationnel connecte Supabase (pas multi-agents)
2. **EXAIA** : Systeme fiscal v1 sur 4-5 pays (FR/DE/BE/UK/NL)
3. **Lancement** : 3-5 developpeurs partenaires, pas 20
4. **Priorite absolue** : Premier client qui utilise le chat et signe
5. **LLM** : xAI Grok pour parsing requetes (a evaluer vs Anthropic)
