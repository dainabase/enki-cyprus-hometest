# Deploy `image-proxy` Edge Function

> Dernière mise à jour : 2026-04-24 (Phase 9 cleanup)

## Description

Proxy public GET pour images externes (Unsplash, etc.) - PAS de JWT

## Commande de déploiement

```bash
supabase functions deploy image-proxy
```

## Secrets requis

Aucun secret requis pour cette fonction.

## Test post-déploiement

```bash
# Remplacer $SUPABASE_URL, $USER_JWT par des valeurs reelles
curl "$SUPABASE_URL/functions/v1/image-proxy?url=https://images.unsplash.com/..."
```

## Rollback

En cas de problème après déploiement :

```bash
# Lister les versions deployees
supabase functions list

# Redeployer la version precedente depuis git
git show HEAD~1:supabase/functions/image-proxy/index.ts > /tmp/rollback.ts
cp /tmp/rollback.ts supabase/functions/image-proxy/index.ts
supabase functions deploy image-proxy
```

## Notes

Voir `docs/governance/EDGE-FUNCTIONS-REGISTRY.md` pour le statut global.
