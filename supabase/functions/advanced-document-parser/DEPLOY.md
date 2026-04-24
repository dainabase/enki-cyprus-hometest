# Deploy `advanced-document-parser` Edge Function

> Dernière mise à jour : 2026-04-24 (Phase 9 cleanup)

## Description

Pipeline avancé: OCR + AI extraction + mapping schema

## Commande de déploiement

```bash
supabase functions deploy advanced-document-parser
```

## Secrets requis

Configurer dans **Supabase Dashboard > Edge Functions > Secrets** :

- `OPENAI_API_KEY`
- `XAI_API_KEY`

Ou via CLI :
```bash
supabase secrets set OPENAI_API_KEY=<value>
supabase secrets set XAI_API_KEY=<value>
```

## Test post-déploiement

```bash
# Remplacer $SUPABASE_URL, $USER_JWT par des valeurs reelles
curl -X POST "$SUPABASE_URL/functions/v1/advanced-document-parser" -H "Authorization: Bearer $USER_JWT" -F "file=@brochure.pdf"
```

## Rollback

En cas de problème après déploiement :

```bash
# Lister les versions deployees
supabase functions list

# Redeployer la version precedente depuis git
git show HEAD~1:supabase/functions/advanced-document-parser/index.ts > /tmp/rollback.ts
cp /tmp/rollback.ts supabase/functions/advanced-document-parser/index.ts
supabase functions deploy advanced-document-parser
```

## Notes

Voir `docs/governance/EDGE-FUNCTIONS-REGISTRY.md` pour le statut global.
