# MEMORY.md - Journal Vivant ENKI Reality

> Mis a jour apres chaque session significative.
> Source de verite pour le contexte recent.

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
- `agentic-search` : colonnes `price`, `location->city`, `type` n'existent pas
- `lexaia-call` : API fictive, tout en mock
- `parse-document` : faux OCR, contenu hardcode
- `extract-full-hierarchy` : donnees Jardins de Maria hardcodees
- `google-maps-agent` : seul vrai bijou fonctionnel
- 14/18 fonctions sans verification JWT

**Gouvernance creee** :
- CLAUDE.md, MEMORY.md, ROADMAP-BUSINESS.md
- LESSONS-LEARNED.md, EDGE-FUNCTIONS-REGISTRY.md, MATRICE-STATUT.md

### Prochaine action exacte
Correction Edge Function `agentic-search` :
- `price` -> `price_from`
- `location->city` -> `city`
- `type` -> `property_type`
- Connecter a la vraie structure Supabase

---

## Session 2025-12-15 - Audit Claude Code + Corrections

### Actions realisees
- Audit complet Claude Code (AUDIT_CLAUDE_CODE_15DEC2025.md)
- Phase 1 : Quick wins (fichiers obsoletes supprimes, env vars)
- Phase 2 : Critical P1 (lazy loading, TODOs documentes)
- Phase 3 : P2 corrections (logger, types, compression)
- Phase 4 : i18n traductions admin
- Dernier commit : `0f3b40f`

---

## Decisions architecturales actives

1. **Agent IA** : UN seul agent conversationnel connecte Supabase (pas multi-agents)
2. **EXAIA** : Systeme fiscal v1 sur 4-5 pays (FR/DE/BE/UK/NL)
3. **Lancement** : 3-5 developpeurs partenaires, pas 20
4. **Priorite absolue** : Premier client qui utilise le chat et signe
