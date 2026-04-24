# Deploy `lexaia-call` Edge Function

> Dernière mise à jour : 2026-04-24 (Phase 9 cleanup)

## Description

Recommandations fiscales personnalisées Chypre (MOCK - à connecter API Lexaia réelle)

## Commande de déploiement

```bash
supabase functions deploy lexaia-call
```

## Secrets requis

Configurer dans **Supabase Dashboard > Edge Functions > Secrets** :

- `LEXAIA_API_KEY (optionnel tant que mock)`

Ou via CLI :
```bash
supabase secrets set LEXAIA_API_KEY=<value>
```

## Test post-déploiement

```bash
# Remplacer $SUPABASE_URL, $USER_JWT par des valeurs reelles
curl -X POST "$SUPABASE_URL/functions/v1/lexaia-call" -H "Authorization: Bearer $USER_JWT" -H "Content-Type: application/json" -d '{"country":"FR","investmentAmount":350000}'
```

## Rollback

En cas de problème après déploiement :

```bash
# Lister les versions deployees
supabase functions list

# Redeployer la version precedente depuis git
git show HEAD~1:supabase/functions/lexaia-call/index.ts > /tmp/rollback.ts
cp /tmp/rollback.ts supabase/functions/lexaia-call/index.ts
supabase functions deploy lexaia-call
```

## Notes

Voir `docs/governance/EDGE-FUNCTIONS-REGISTRY.md` pour le statut global.
