# Phase 9 - Préparation déploiement Edge Functions

> Date : 2026-04-24
> Branche : `cleanup/socle-stabilisation`
> **AUCUN DÉPLOIEMENT EFFECTUÉ** — préparation uniquement

## Résumé

- **16 fichiers DEPLOY.md** créés (un par Edge Function à déployer)
- **1 script interactif** `scripts/deploy-edge-functions.sh` prêt pour Jean-Marie
- **google-maps-agent exclue** : déjà en production stable (règle CLAUDE.md)

## DEPLOY.md créés

Chaque DEPLOY.md contient :
1. Description fonctionnelle de la fonction
2. Commande `supabase functions deploy <name>`
3. Secrets à configurer (avec commandes CLI `supabase secrets set`)
4. Exemple cURL pour test post-déploiement
5. Procédure de rollback via git

Fonctions documentées (16) :
| # | Fonction | Secret critique |
|---|---|---|
| 1 | agentic-search | `XAI_API_KEY` |
| 2 | send-notification | `SENDGRID_API_KEY`, `SITE_URL` |
| 3 | generate-seo | `OPENAI_API_KEY` |
| 4 | commission-trigger | aucun (DB trigger) |
| 5 | parse-document | `OPENAI_API_KEY` |
| 6 | extract-full-hierarchy | `XAI_API_KEY`, `OPENAI_API_KEY` |
| 7 | extract-properties-ai | `XAI_API_KEY` |
| 8 | fetch-interests | aucun |
| 9 | simple-pdf-extractor | aucun |
| 10 | advanced-document-parser | `OPENAI_API_KEY`, `XAI_API_KEY` |
| 11 | lexaia-call | `LEXAIA_API_KEY` (optionnel tant que mock) |
| 12 | lexaia-mock | aucun |
| 13 | backfill-project-images | aucun (script admin) |
| 14 | ensure-project-photos | aucun (script admin) |
| 15 | image-proxy | aucun (proxy public GET) |
| 16 | db-trigger | aucun (trigger Postgres interne) |

## Script `scripts/deploy-edge-functions.sh`

- Vérifie présence de la CLI `supabase` (sinon exit 1 avec message install)
- Affiche la liste des 16 fonctions
- Demande confirmation globale (Y/n)
- Pour chaque fonction : demande confirmation individuelle (y/n/q pour quitter)
- Reporte succès/échecs en fin de session
- Support `--dry-run` pour tester sans déployer

### Test dry-run effectué

```bash
$ bash scripts/deploy-edge-functions.sh --dry-run
=== DRY RUN MODE ===
ERREUR: CLI 'supabase' non trouvee. Installer via:
  brew install supabase/tap/supabase
```

Le script détecte correctement l'absence de la CLI et bloque. Jean-Marie devra installer `supabase` CLI avant usage :

```bash
brew install supabase/tap/supabase
# OU
npm install -g supabase
```

## Ordre recommandé de déploiement

Suggestion d'ordre safe (déployer les plus simples d'abord, les plus critiques en dernier) :

1. **image-proxy, db-trigger** : pas de secrets, pas de JWT ; déploiement safe en premier
2. **fetch-interests, simple-pdf-extractor, commission-trigger** : pas de secrets externes
3. **backfill-project-images, ensure-project-photos** : scripts admin one-shot
4. **send-notification** : configurer `SENDGRID_API_KEY` d'abord
5. **generate-seo** : configurer `OPENAI_API_KEY` d'abord
6. **agentic-search** : configurer `XAI_API_KEY` d'abord (**critique pour l'expérience agent conversationnel**)
7. **parse-document, extract-properties-ai, extract-full-hierarchy, advanced-document-parser** : pipelines AI avancés
8. **lexaia-call, lexaia-mock** : à déployer ensemble (mock sert de fallback)

## Avant de déployer — Checklist

- [ ] CLI `supabase` installée : `supabase --version`
- [ ] Lié au projet Supabase : `supabase link --project-ref ccsakftsslurjgnjwdci`
- [ ] Secrets configurés dans Dashboard > Edge Functions > Secrets
- [ ] `supabase secrets list` confirme leur présence
- [ ] Branche git actuelle à jour (`git status` clean)
- [ ] Build local PASS : `npm run build`
- [ ] Tests unitaires PASS : `npm test`

## Validation

- 16 DEPLOY.md créés et commit-ables
- Script `scripts/deploy-edge-functions.sh` rendu exécutable (`chmod +x`)
- Dry-run script confirme la détection d'absence de CLI
- **Aucun déploiement réel effectué** (attendu — phase préparatoire)

## Recommandation Phase 10

Documentation finale : mettre à jour MEMORY.md, MATRICE-STATUT.md, EDGE-FUNCTIONS-REGISTRY.md, CHANGELOG.md et créer la synthèse AUDIT_CLEANUP_SOCLE_2026-04.md.
