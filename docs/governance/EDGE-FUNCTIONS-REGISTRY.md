# EDGE FUNCTIONS REGISTRY - ENKI Reality

> Registre complet des 18 Edge Functions Supabase.
> Statut au 2026-03-18.

## Legende statuts
- PRODUCTION : Fonctionnelle, testee, securisee
- BROKEN : Bug connu, ne fonctionne pas
- MOCK : Retourne des donnees fictives
- NO-JWT : Pas de verification authentification
- DEPRECATED : A supprimer

## Registre

| # | Nom | Statut | JWT | Description | Action requise |
|---|-----|--------|-----|-------------|----------------|
| 1 | google-maps-agent | PRODUCTION | Oui | Calcul distances, detection commodites | Aucune - NE PAS TOUCHER |
| 2 | agentic-search | BROKEN | Non | Recherche IA conversationnelle | Corriger colonnes fantomes |
| 3 | lexaia-call | MOCK | Non | Appel API EXAIA/LEXAIA | API fictive, a connecter |
| 4 | parse-document | MOCK | Non | OCR documents | Faux OCR, contenu hardcode |
| 5 | extract-full-hierarchy | MOCK | Non | Extraction hierarchie complete | Donnees Jardins de Maria hardcodees |
| 6 | generate-property-pdf | NO-JWT | Non | Generation PDF propriete | Ajouter JWT |
| 7 | send-contact-email | NO-JWT | Non | Envoi email contact | Ajouter JWT |
| 8 | lead-scoring | NO-JWT | Non | Scoring automatique leads | Ajouter JWT |
| 9 | commission-calculator | NO-JWT | Non | Calcul commissions | Ajouter JWT |
| 10 | golden-visa-checker | NO-JWT | Non | Verification eligibilite GV | Ajouter JWT |
| 11 | currency-converter | NO-JWT | Non | Conversion devises | Ajouter JWT |
| 12 | seo-generator | NO-JWT | Non | Generation meta SEO | Ajouter JWT |
| 13 | image-optimizer | NO-JWT | Non | Optimisation images | Ajouter JWT |
| 14 | analytics-tracker | NO-JWT | Non | Tracking analytics | Ajouter JWT |
| 15 | notification-sender | NO-JWT | Non | Envoi notifications | Ajouter JWT |
| 16 | report-generator | NO-JWT | Non | Generation rapports | Ajouter JWT |
| 17 | data-exporter | NO-JWT | Non | Export donnees CSV | Ajouter JWT |
| 18 | webhook-handler | NO-JWT | Non | Gestion webhooks | Ajouter JWT |

## Priorite corrections

1. **P0 - Immediat** : `agentic-search` (core business)
2. **P1 - Semaine** : JWT sur les 14 fonctions exposees
3. **P2 - Sprint** : `lexaia-call` connecter vraie API
4. **P3 - Backlog** : Remplacer mocks restants
