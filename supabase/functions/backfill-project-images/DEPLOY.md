# Deploy `backfill-project-images` Edge Function

> Dernière mise à jour : 2026-04-24 (Phase 9 cleanup)

## Description

Script one-shot admin - remplissage images manquantes

## Commande de déploiement

```bash
supabase functions deploy backfill-project-images
```

## Secrets requis

Aucun secret requis pour cette fonction.

## Test post-déploiement

```bash
# Remplacer $SUPABASE_URL, $USER_JWT par des valeurs reelles
Admin-only, pas de JWT user requis
```

## Rollback

En cas de problème après déploiement :

```bash
# Lister les versions deployees
supabase functions list

# Redeployer la version precedente depuis git
git show HEAD~1:supabase/functions/backfill-project-images/index.ts > /tmp/rollback.ts
cp /tmp/rollback.ts supabase/functions/backfill-project-images/index.ts
supabase functions deploy backfill-project-images
```

## Notes

Voir `docs/governance/EDGE-FUNCTIONS-REGISTRY.md` pour le statut global.
