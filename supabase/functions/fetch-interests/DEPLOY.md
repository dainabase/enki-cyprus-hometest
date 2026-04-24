# Deploy `fetch-interests` Edge Function

> Dernière mise à jour : 2026-04-24 (Phase 9 cleanup)

## Description

Récupération intérêts leads pour pipeline Kanban

## Commande de déploiement

```bash
supabase functions deploy fetch-interests
```

## Secrets requis

Aucun secret requis pour cette fonction.

## Test post-déploiement

```bash
# Remplacer $SUPABASE_URL, $USER_JWT par des valeurs reelles
curl "$SUPABASE_URL/functions/v1/fetch-interests?leadId=<uuid>" -H "Authorization: Bearer $USER_JWT"
```

## Rollback

En cas de problème après déploiement :

```bash
# Lister les versions deployees
supabase functions list

# Redeployer la version precedente depuis git
git show HEAD~1:supabase/functions/fetch-interests/index.ts > /tmp/rollback.ts
cp /tmp/rollback.ts supabase/functions/fetch-interests/index.ts
supabase functions deploy fetch-interests
```

## Notes

Voir `docs/governance/EDGE-FUNCTIONS-REGISTRY.md` pour le statut global.
