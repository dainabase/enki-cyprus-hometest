# Deploy `lexaia-mock` Edge Function

> Dernière mise à jour : 2026-04-24 (Phase 9 cleanup)

## Description

Version mock de lexaia-call (à supprimer quand lexaia-call OK)

## Commande de déploiement

```bash
supabase functions deploy lexaia-mock
```

## Secrets requis

Aucun secret requis pour cette fonction.

## Test post-déploiement

```bash
# Remplacer $SUPABASE_URL, $USER_JWT par des valeurs reelles
Identique à lexaia-call
```

## Rollback

En cas de problème après déploiement :

```bash
# Lister les versions deployees
supabase functions list

# Redeployer la version precedente depuis git
git show HEAD~1:supabase/functions/lexaia-mock/index.ts > /tmp/rollback.ts
cp /tmp/rollback.ts supabase/functions/lexaia-mock/index.ts
supabase functions deploy lexaia-mock
```

## Notes

Voir `docs/governance/EDGE-FUNCTIONS-REGISTRY.md` pour le statut global.
