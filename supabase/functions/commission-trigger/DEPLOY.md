# Deploy `commission-trigger` Edge Function

> Dernière mise à jour : 2026-04-24 (Phase 9 cleanup)

## Description

Calcul automatique commissions sur signature pipeline

## Commande de déploiement

```bash
supabase functions deploy commission-trigger
```

## Secrets requis

Aucun secret requis pour cette fonction.

## Test post-déploiement

```bash
# Remplacer $SUPABASE_URL, $USER_JWT par des valeurs reelles
Appelé automatiquement par trigger DB (pas de cURL manuel)
```

## Rollback

En cas de problème après déploiement :

```bash
# Lister les versions deployees
supabase functions list

# Redeployer la version precedente depuis git
git show HEAD~1:supabase/functions/commission-trigger/index.ts > /tmp/rollback.ts
cp /tmp/rollback.ts supabase/functions/commission-trigger/index.ts
supabase functions deploy commission-trigger
```

## Notes

Voir `docs/governance/EDGE-FUNCTIONS-REGISTRY.md` pour le statut global.
