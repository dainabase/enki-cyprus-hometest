# Deploy `parse-document` Edge Function

> Dernière mise à jour : 2026-04-24 (Phase 9 cleanup)

## Description

OCR et extraction depuis PDF/images de projets

## Commande de déploiement

```bash
supabase functions deploy parse-document
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
curl -X POST "$SUPABASE_URL/functions/v1/parse-document" -H "Authorization: Bearer $USER_JWT" -F "file=@test.pdf"
```

## Rollback

En cas de problème après déploiement :

```bash
# Lister les versions deployees
supabase functions list

# Redeployer la version precedente depuis git
git show HEAD~1:supabase/functions/parse-document/index.ts > /tmp/rollback.ts
cp /tmp/rollback.ts supabase/functions/parse-document/index.ts
supabase functions deploy parse-document
```

## Notes

Voir `docs/governance/EDGE-FUNCTIONS-REGISTRY.md` pour le statut global.
