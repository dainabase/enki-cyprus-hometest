# Deploy `ensure-project-photos` Edge Function

> Dernière mise à jour : 2026-04-24 (Phase 9 cleanup)

## Description

Script one-shot admin - garantit qu un projet a au moins une photo

## Commande de déploiement

```bash
supabase functions deploy ensure-project-photos
```

## Secrets requis

Aucun secret requis pour cette fonction.

## Test post-déploiement

```bash
# Remplacer $SUPABASE_URL, $USER_JWT par des valeurs reelles
Admin-only
```

## Rollback

En cas de problème après déploiement :

```bash
# Lister les versions deployees
supabase functions list

# Redeployer la version precedente depuis git
git show HEAD~1:supabase/functions/ensure-project-photos/index.ts > /tmp/rollback.ts
cp /tmp/rollback.ts supabase/functions/ensure-project-photos/index.ts
supabase functions deploy ensure-project-photos
```

## Notes

Voir `docs/governance/EDGE-FUNCTIONS-REGISTRY.md` pour le statut global.
