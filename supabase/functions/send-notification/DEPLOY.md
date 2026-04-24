# Deploy `send-notification` Edge Function

> Dernière mise à jour : 2026-04-24 (Phase 9 cleanup)

## Description

Envoi emails via SendGrid (leads, commissions, alerts)

## Commande de déploiement

```bash
supabase functions deploy send-notification
```

## Secrets requis

Configurer dans **Supabase Dashboard > Edge Functions > Secrets** :

- `SENDGRID_API_KEY`
- `SITE_URL`

Ou via CLI :
```bash
supabase secrets set SENDGRID_API_KEY=<value>
supabase secrets set SITE_URL=<value>
```

## Test post-déploiement

```bash
# Remplacer $SUPABASE_URL, $USER_JWT par des valeurs reelles
curl -X POST "$SUPABASE_URL/functions/v1/send-notification" -H "Authorization: Bearer $USER_JWT" -H "Content-Type: application/json" -d '{"to":"test@example.com","template":"lead_welcome","data":{"name":"Test"}}'
```

## Rollback

En cas de problème après déploiement :

```bash
# Lister les versions deployees
supabase functions list

# Redeployer la version precedente depuis git
git show HEAD~1:supabase/functions/send-notification/index.ts > /tmp/rollback.ts
cp /tmp/rollback.ts supabase/functions/send-notification/index.ts
supabase functions deploy send-notification
```

## Notes

Voir `docs/governance/EDGE-FUNCTIONS-REGISTRY.md` pour le statut global.
