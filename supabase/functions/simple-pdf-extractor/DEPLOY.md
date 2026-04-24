# Deploy `simple-pdf-extractor` Edge Function

> Dernière mise à jour : 2026-04-24 (Phase 9 cleanup)

## Description

Extraction texte basique depuis PDF (sans AI)

## Commande de déploiement

```bash
supabase functions deploy simple-pdf-extractor
```

## Secrets requis

Aucun secret requis pour cette fonction.

## Test post-déploiement

```bash
# Remplacer $SUPABASE_URL, $USER_JWT par des valeurs reelles
curl -X POST "$SUPABASE_URL/functions/v1/simple-pdf-extractor" -H "Authorization: Bearer $USER_JWT" -F "file=@doc.pdf"
```

## Rollback

En cas de problème après déploiement :

```bash
# Lister les versions deployees
supabase functions list

# Redeployer la version precedente depuis git
git show HEAD~1:supabase/functions/simple-pdf-extractor/index.ts > /tmp/rollback.ts
cp /tmp/rollback.ts supabase/functions/simple-pdf-extractor/index.ts
supabase functions deploy simple-pdf-extractor
```

## Notes

Voir `docs/governance/EDGE-FUNCTIONS-REGISTRY.md` pour le statut global.
