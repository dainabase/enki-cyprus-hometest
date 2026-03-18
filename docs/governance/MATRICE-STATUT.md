# MATRICE DE STATUT - ENKI Reality

> Etat de chaque module sur 5 dimensions.
> Mise a jour apres chaque sprint.

## Legende
- OK : Fonctionnel et teste
- PARTIAL : Partiellement fonctionnel
- MOCK : Donnees fictives
- BROKEN : Ne fonctionne pas
- TODO : Pas encore implemente

## Matrice (mise a jour 2026-03-18)

| Module | Frontend | Backend | BDD | Tests | Securite |
|--------|----------|---------|-----|-------|----------|
| Auth & Login | OK | OK | OK | PARTIAL | OK (RLS) |
| Dashboard KPIs | OK | PARTIAL | OK | TODO | PARTIAL |
| Gestion Developpeurs | OK | OK | OK | PARTIAL | OK (RLS) |
| Gestion Projets | OK | OK | OK | PARTIAL | OK (RLS) |
| Gestion Batiments | OK | OK | OK | PARTIAL | OK (RLS) |
| Gestion Proprietes | OK | OK | OK | PARTIAL | OK (RLS) |
| CRM Leads | OK | OK | OK | TODO | OK (RLS) |
| Pipeline Kanban | OK | PARTIAL | OK | TODO | PARTIAL |
| Commissions | OK | OK | OK | TODO | PARTIAL |
| Golden Visa | OK | PARTIAL | OK | TODO | PARTIAL |
| Agent IA (agentic-search) | PARTIAL | BROKEN | OK | TODO | BROKEN (no JWT) |
| EXAIA Fiscal | MOCK | MOCK | TODO | TODO | TODO |
| Analytics | OK | PARTIAL | OK | TODO | PARTIAL |
| Multilingue (8 langues) | OK | N/A | N/A | PARTIAL | N/A |
| Site Public | PARTIAL | PARTIAL | OK | TODO | PARTIAL |

## Scores par dimension

| Dimension | OK | PARTIAL | MOCK | BROKEN | TODO | Score |
|-----------|----|---------|------|--------|------|-------|
| Frontend | 11 | 3 | 1 | 0 | 0 | 83% |
| Backend | 7 | 4 | 1 | 1 | 0 | 69% |
| BDD | 13 | 0 | 0 | 0 | 1 | 93% |
| Tests | 0 | 4 | 0 | 0 | 11 | 13% |
| Securite | 5 | 5 | 0 | 1 | 3 | 54% |

## Priorites deduites

1. **Agent IA** : Backend BROKEN + Securite BROKEN = priorite absolue
2. **Tests** : 11/15 modules a TODO = dette technique massive
3. **Securite** : 14 Edge Functions sans JWT
4. **EXAIA** : Tout en MOCK = a construire from scratch
