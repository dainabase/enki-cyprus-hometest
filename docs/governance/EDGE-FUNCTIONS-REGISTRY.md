# EDGE FUNCTIONS REGISTRY - ENKI Reality

> Registre complet des 18 Edge Functions Supabase.
> Mis a jour le 2026-03-18.

## Legende statuts
- PRODUCTION : Fonctionnelle, testee, securisee
- FIXED : Corrigee, prete a deployer
- CLEANED : JWT ajoute + code nettoye
- NO-JWT-OK : Pas de JWT necessaire (cas special)
- MOCK : Retourne des donnees fictives

## Registre

| # | Nom | JWT | Statut | Action restante |
|---|-----|-----|--------|-----------------|
| 1 | google-maps-agent | Oui | PRODUCTION | Aucune |
| 2 | agentic-search | Oui | FIXED | Deployer + configurer XAI_API_KEY |
| 3 | send-notification | Oui | CLEANED | Deployer + configurer SENDGRID_API_KEY |
| 4 | lexaia-call | Oui | MOCK | Deployer + connecter vraie API Lexaia |
| 5 | generate-seo | Oui | CLEANED | Deployer + configurer OPENAI_API_KEY |
| 6 | commission-trigger | Oui | CLEANED | Deployer |
| 7 | parse-document | Oui | CLEANED | Deployer + implementer vrai OCR |
| 8 | extract-full-hierarchy | Oui | CLEANED | Deployer (hardcode supprime) |
| 9 | extract-properties-ai | Oui | CLEANED | Deployer + pipeline extraction |
| 10 | fetch-interests | Oui | CLEANED | Deployer |
| 11 | simple-pdf-extractor | Oui | CLEANED | Deployer + vrai PDF parser |
| 12 | advanced-document-parser | Oui | CLEANED | Deployer + pipeline |
| 13 | lexaia-mock | Oui | MOCK | A supprimer quand lexaia-call OK |
| 14 | db-trigger | Non | NO-JWT-OK | Trigger interne Supabase |
| 15 | image-proxy | Non | NO-JWT-OK | Proxy GET public (necessaire frontend) |
| 16 | backfill-project-images | Non | NO-JWT-OK | Script admin one-shot |
| 17 | ensure-project-photos | Non | NO-JWT-OK | Script admin one-shot |

## Bilan securite
- 13/17 fonctions avec JWT (76%)
- 4 fonctions sans JWT justifie (triggers internes, proxy public, scripts admin)
- 0 fonction exposee sans raison

## Secrets a configurer dans Supabase
- XAI_API_KEY : pour agentic-search + extraction AI
- OPENAI_API_KEY : pour generate-seo + fallback extraction
- SENDGRID_API_KEY : pour send-notification
- LEXAIA_API_KEY : pour lexaia-call (quand API reelle disponible)
- SITE_URL : pour liens dans emails
