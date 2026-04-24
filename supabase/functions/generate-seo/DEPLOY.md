# Deploy `generate-seo` Edge Function

> Dernière mise à jour : 2026-04-24 (Phase 9 cleanup)

## Description

Génération meta titles/descriptions via OpenAI

## Commande de déploiement

```bash
supabase functions deploy generate-seo
```

## Secrets requis

Configurer dans **Supabase Dashboard > Edge Functions > Secrets** :

- `OPENAI_API_KEY`

Ou via CLI :
```bash
supabase secrets set OPENAI_API_KEY=<value>
```

## Test post-déploiement

```bash
# Remplacer $SUPABASE_URL, $USER_JWT par des valeurs reelles
curl -X POST "$SUPABASE_URL/functions/v1/generate-seo" -H "Authorization: Bearer $USER_JWT" -H "Content-Type: application/json" -d '{"projectId":"<uuid>","language":"en"}'
```

## Rollback

En cas de problème après déploiement :

```bash
# Lister les versions deployees
supabase functions list

# Redeployer la version precedente depuis git
git show HEAD~1:supabase/functions/generate-seo/index.ts > /tmp/rollback.ts
cp /tmp/rollback.ts supabase/functions/generate-seo/index.ts
supabase functions deploy generate-seo
```

## Notes

Voir `docs/governance/EDGE-FUNCTIONS-REGISTRY.md` pour le statut global.
