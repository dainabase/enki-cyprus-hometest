# Deploy `db-trigger` Edge Function

> Dernière mise à jour : 2026-04-24 (Phase 9 cleanup)

## Description

Trigger interne Supabase (appelé par postgres hooks) - PAS de JWT

## Commande de déploiement

```bash
supabase functions deploy db-trigger
```

## Secrets requis

Aucun secret requis pour cette fonction.

## Test post-déploiement

```bash
# Remplacer $SUPABASE_URL, $USER_JWT par des valeurs reelles
Appelé par trigger SQL, pas manuellement
```

## Rollback

En cas de problème après déploiement :

```bash
# Lister les versions deployees
supabase functions list

# Redeployer la version precedente depuis git
git show HEAD~1:supabase/functions/db-trigger/index.ts > /tmp/rollback.ts
cp /tmp/rollback.ts supabase/functions/db-trigger/index.ts
supabase functions deploy db-trigger
```

## Notes

Voir `docs/governance/EDGE-FUNCTIONS-REGISTRY.md` pour le statut global.
