# Deploy `agentic-search` Edge Function

> Dernière mise à jour : 2026-04-24 (Phase 9 cleanup)

## Description

Agent conversationnel - recherche propriétés via NLP xAI Grok

## Commande de déploiement

```bash
supabase functions deploy agentic-search
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
curl -X POST "$SUPABASE_URL/functions/v1/agentic-search" -H "Authorization: Bearer $USER_JWT" -H "Content-Type: application/json" -d '{"query":"appartement 3 chambres Limassol 500k","language":"fr"}'
```

## Rollback

En cas de problème après déploiement :

```bash
# Lister les versions deployees
supabase functions list

# Redeployer la version precedente depuis git
git show HEAD~1:supabase/functions/agentic-search/index.ts > /tmp/rollback.ts
cp /tmp/rollback.ts supabase/functions/agentic-search/index.ts
supabase functions deploy agentic-search
```

## Notes

Voir `docs/governance/EDGE-FUNCTIONS-REGISTRY.md` pour le statut global.
