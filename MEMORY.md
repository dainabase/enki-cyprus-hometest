# MEMORY.md - Journal Vivant ENKI Reality

> Mis a jour apres chaque session significative.
> Source de verite pour le contexte recent.

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
