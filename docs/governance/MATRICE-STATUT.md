# MATRICE DE STATUT - ENKI Reality

> Etat de chaque module sur 5 dimensions.
> Mise a jour apres chaque sprint.

## Legende
- OK : Fonctionnel et teste
- PARTIAL : Partiellement fonctionnel
- MOCK : Donnees fictives
- BROKEN : Ne fonctionne pas
- TODO : Pas encore implemente

## Matrice (mise a jour 2026-04-24 post-cleanup socle)

| Module | Frontend | Backend | BDD | Tests | Securite |
|--------|----------|---------|-----|-------|----------|
| Auth & Login | OK | OK | OK | PARTIAL | OK (RLS) |
| Dashboard KPIs | OK | PARTIAL | OK | TODO | PARTIAL |
| Gestion Developpeurs | OK | OK | OK | PARTIAL | OK (RLS) |
| Gestion Projets | OK | OK | OK | OK (schema+mapper) | OK (RLS) |
| Gestion Batiments | OK | OK | OK | PARTIAL | OK (RLS) |
| Gestion Proprietes | OK | OK | OK | OK (schema) | OK (RLS) |
| CRM Leads | OK | OK | OK | TODO | OK (RLS) |
| Pipeline Kanban | OK | PARTIAL | OK | TODO | PARTIAL |
| Commissions | OK | OK | OK | TODO | PARTIAL |
| Golden Visa | OK | PARTIAL | OK | OK (6 tests metier) | PARTIAL |
| Agent IA (agentic-search) | PARTIAL | FIXED | OK | TODO | OK (JWT ajoute) |
| EXAIA Fiscal | MOCK | MOCK | TODO | TODO | TODO |
| Analytics | OK | PARTIAL | OK | TODO | PARTIAL |
| Multilingue (EN/FR) | OK | N/A | N/A | PARTIAL | N/A |
| Multilingue (EL/ES) | OK | N/A | N/A | TODO | N/A |
| Multilingue (RU/DE/IT/NL) | PARTIAL | N/A | N/A | TODO | N/A |
| Site Public | OK | PARTIAL | OK | PARTIAL | PARTIAL |

## Scores par dimension

| Dimension | OK | PARTIAL | MOCK | BROKEN/FIXED | TODO | Score |
|-----------|----|---------|------|--------------|------|-------|
| Frontend | 13 | 3 | 1 | 0 | 0 | 91% |
| Backend | 8 | 4 | 1 | 1 (FIXED) | 0 | 76% |
| BDD | 14 | 0 | 0 | 0 | 1 | 93% |
| Tests | 4 | 4 | 0 | 0 | 9 | 29% |
| Securite | 7 | 5 | 0 | 0 | 3 | 65% |

## Progres depuis 2026-03-18

| Dimension | 2026-03-18 | 2026-04-24 | Delta |
|-----------|------------|------------|-------|
| Frontend | 83% | 91% | +8 pts |
| Backend | 69% | 76% | +7 pts |
| BDD | 93% | 93% | stable |
| Tests | 13% | 29% | +16 pts (Vitest + 42 tests) |
| Securite | 54% | 65% | +11 pts (JWT Edge Functions) |

## Indicateurs qualite code (2026-04-24)

- Dead code `knip` : 16 fichiers (tous dans cluster ProjectPageV2 en attente decision)
- TypeScript `any` (hors types.ts) : 96 (de 843 baseline)
- `console.log` actif : 0 (hors logger.ts)
- Fichiers > 600 lignes : 14 (Phase 3b planifiee)
- Bundle `dist/` : 7.9 MB (de 17 MB)
- i18n EN/FR : 100%
- Tests unitaires : 42 PASS

## Priorites deduites

1. **Tests** : encore 9/15 modules a TODO. Priorite pour la stabilite. Phase 8 a pose les fondations (Vitest + 42 tests), continuer avec tests hooks + integration Supabase.
2. **Refacto gros fichiers** : Phase 3b apres Phase 8 (etape par etape avec Cypress).
3. **Cluster ProjectPageV2** : decision Jean-Marie (supprimer ou pusher en refonte page projet V2).
4. **Deploiement Edge Functions** : Jean-Marie lance `scripts/deploy-edge-functions.sh` apres config secrets.
5. **i18n autres langues** : traducteur natif pour EL/RU/ES/IT/DE/NL (rapport disponible `i18n-missing-keys.md`).
6. **EXAIA Fiscal** : toujours en MOCK, a construire from scratch.
