# Deploy `extract-properties-ai` Edge Function

> Dernière mise à jour : 2026-04-24 (Phase 9 cleanup)

## Description

Extraction AI des propriétés unitaires depuis tableau Excel/PDF

## Commande de déploiement

```bash
supabase functions deploy extract-properties-ai
```

## Secrets requis

Configurer dans **Supabase Dashboard > Edge Functions > Secrets** :

- `XAI_API_KEY`

Ou via CLI :
```bash
supabase secrets set XAI_API_KEY=<value>
```

## Test post-déploiement

```bash
# Remplacer $SUPABASE_URL, $USER_JWT par des valeurs reelles
curl -X POST "$SUPABASE_URL/functions/v1/extract-properties-ai" -H "Authorization: Bearer $USER_JWT" -F "file=@properties.xlsx"
```

## Rollback

En cas de problème après déploiement :

```bash
# Lister les versions deployees
supabase functions list

# Redeployer la version precedente depuis git
git show HEAD~1:supabase/functions/extract-properties-ai/index.ts > /tmp/rollback.ts
cp /tmp/rollback.ts supabase/functions/extract-properties-ai/index.ts
supabase functions deploy extract-properties-ai
```

## Notes

Voir `docs/governance/EDGE-FUNCTIONS-REGISTRY.md` pour le statut global.
