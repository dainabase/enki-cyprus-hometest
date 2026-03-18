# CLAUDE.md - ENKI Reality Project Governance

> Rules permanentes pour tous les agents IA travaillant sur ce repo.
> Lu automatiquement par Claude Code. Inclure dans les prompts Jules/Lovable.

## IDENTITE PROJET

- **Nom** : ENKI Reality (anciennement Enki Cyprus)
- **Type** : Marketplace immobiliere agentique B2B2C
- **Marche** : Chypre (expansion future Grece/Portugal/Malte/Dubai)
- **Supabase Project ID** : `ccsakftsslurjgnjwdci`
- **Repo** : `dainabase/enki-cyprus-hometest`
- **Stack** : React 19 + TypeScript + Vite + Supabase + Tailwind + Framer Motion

## REGLES ABSOLUES

### Interdictions
1. **JAMAIS inventer** de chiffres, ROI, fonctionnalites, apps. Si inconnu -> demander a Jean-Marie
2. **JAMAIS utiliser `any`** en TypeScript - toujours typer strictement
3. **JAMAIS laisser de console.log** en production - utiliser le logger unifie
4. **JAMAIS creer de mock data** sans prefixe `// TODO: MOCK - remplacer par vraie donnee`
5. **JAMAIS modifier** les Edge Functions `google-maps-agent` et triggers RLS sans validation
6. **ZERO emoji** dans le code et l'UI (design system strict)
7. **Font** : Inter uniquement
8. **Palette** : Ocean Blue / Cyprus Terra (voir docs/design-system/)

### Obligations
1. **Toujours verifier** la coherence schema TypeScript <-> colonnes Supabase avant tout formulaire
2. **Toujours prefixer** les colonnes JSONB avec le nom du domaine (ex: `golden_visa_details`, `tax_benefits`)
3. **Toujours utiliser** les vrais noms de colonnes Supabase (voir EDGE-FUNCTIONS-REGISTRY.md)
4. **Toujours tester** le build (`npm run build`) avant commit
5. **Toujours documenter** dans MEMORY.md apres chaque session significative

## HIERARCHIE BASE DE DONNEES

```
developers (entreprises promotrices)
  -> projects (programmes immobiliers)
    -> buildings (batiments)
      -> properties (unites individuelles)
```

Cascade automatique via triggers SQL. Modifier un niveau propage aux niveaux inferieurs.

## COLONNES CRITIQUES (noms reels Supabase)

### Table `properties`
- Prix : `price_from`, `price_to` (PAS `price`)
- Ville : `city` (PAS `location->city`)
- Type : `property_type` (PAS `type`)
- Surface : `area_from`, `area_to`
- Chambres : `bedrooms_from`, `bedrooms_to`
- Golden Visa : `golden_visa_eligible` (boolean, auto-calcule si price_from >= 300000)

### Table `projects`
- Zone : `zone` (Limassol, Paphos, Larnaca, Nicosia, Famagusta)
- Statut : `status` (planning, under_construction, completed, selling)
- Slug : `slug` (URL-friendly, unique)

## EDGE FUNCTIONS - STATUT

| Fonction | Statut | Note |
|----------|--------|------|
| google-maps-agent | PRODUCTION | Ne pas toucher |
| agentic-search | BROKEN | Colonnes fantomes a corriger |
| lexaia-call | MOCK | API fictive |
| parse-document | MOCK | Faux OCR |
| extract-full-hierarchy | MOCK | Donnees hardcodees |
| 14 autres | SANS JWT | A securiser |

Voir `docs/governance/EDGE-FUNCTIONS-REGISTRY.md` pour details.

## REGLES METIER CHYPRE

- Golden Visa : seuil 300,000 EUR minimum
- TVA : 5% residentiel neuf, 19% commercial/revente
- Commission standard : 3-5%
- Langues supportees : EN, FR, EL, RU, ES, IT, DE, NL
- Zones : Limassol, Paphos, Larnaca, Nicosia, Famagusta

## WORKFLOW DEVELOPPEMENT

1. Lire CLAUDE.md (ce fichier)
2. Consulter MEMORY.md pour contexte recent
3. Verifier ROADMAP-BUSINESS.md pour priorites
4. Executer la tache
5. Tester (`npm run build`)
6. Mettre a jour MEMORY.md
7. Commit avec message conventionnel (feat/fix/docs/refactor)
