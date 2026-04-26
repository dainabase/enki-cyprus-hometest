# CLAUDE.md - ENKI Realty Project Governance

> Rules permanentes pour tous les agents IA travaillant sur ce repo.
> Lu automatiquement par Claude Code. Inclure dans les prompts Jules/Lovable/Cowork.
>
> **Version** : v1.1 (26 avril 2026)
> **Source de verite strategique et editoriale** : Notion (hub Design System)
> **Source de verite technique** : ce fichier + repo GitHub

## IDENTITE PROJET

- **Nom** : ENKI Realty (PropTech B2B2C)
- **Type** : Marketplace immobiliere agentique
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
7. **Font** : Inter uniquement (typographie display sera definie en Couche 4)
8. **Palette** : a definir en Couche 5 (Color System). Toute palette utilisee actuellement dans le code est provisoire et NON VALIDEE. Aucun token de couleur ne doit etre fige tant que la Couche 5 n'est pas validee.
9. **Crona Group** : structure capitalistique invisible. Crona apparait publiquement comme developpeur liste parmi les autres. Aucune communication, aucun signal visuel, aucun positionnement ne doit reveler ou suggerer la relation actionnariale entre Crona et la societe de vente affiliee.

### Obligations
1. **Toujours verifier** la coherence schema TypeScript <-> colonnes Supabase avant tout formulaire
2. **Toujours prefixer** les colonnes JSONB avec le nom du domaine (ex: `golden_visa_details`, `tax_benefits`)
3. **Toujours utiliser** les vrais noms de colonnes Supabase (voir EDGE-FUNCTIONS-REGISTRY.md)
4. **Toujours tester** le build (`npm run build`) avant commit
5. **Toujours documenter** dans MEMORY.md apres chaque session significative
6. **Toujours respecter** le design system par couches : aucune decision visuelle, typographique, chromatique ou interactionnelle ne peut etre prise sans retour explicite au document de la couche correspondante (voir DESIGN-SYSTEM.md)

## DESIGN SYSTEM - APPROCHE PAR COUCHES

Le design system ENKI Realty se construit en 8 couches sequentielles. Chaque couche s'appuie sur la precedente. Aucun saut autorise.

| Couche | Document | Statut |
|--------|----------|--------|
| 1 - Brand Manifesto | `docs/design-system/01-brand-manifesto.md` | v1.1 mergee, v1.2 en review (Notion) |
| 2 - Conversational Tier | `docs/design-system/02-conversational-tier.md` | v2.1 en review (Notion, pas encore sync) |
| Doc complementaire - Architecture Commerciale & CRM | `docs/design-system/03-architecture-commerciale-crm.md` | v1.0 en review (Notion, pas encore sync) |
| 3 - Visual Principles | a venir | Pas encore cree |
| 4 - Typography System | a venir | Pas encore cree |
| 5 - Color System | a venir | Pas encore cree |
| 6 - Motion & Interaction Principles | a venir | Pas encore cree |
| 7 - Photography & Imagery Direction | a venir | Pas encore cree |
| 8 - Component Tokens | a venir | Pas encore cree |

**Source de verite strategique** : pages Notion sous le hub "Design System & Cinematic Experience" (voir Mapping Notion <-> GitHub sur Notion).

**Source de verite technique** : fichiers .md sous `docs/design-system/` une fois synchronises depuis Notion.

Tant qu'une couche n'a pas son fichier .md sync sur GitHub avec statut "Validee", aucune decision technique correspondante ne doit etre figee dans le code.

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
- **Langues supportees (9 langues natives)** : EN, FR, DE, PL, RU, EL, NL, ES, IT
  - Choix justifie par les statistiques d'achat a Chypre
  - Aucune langue n'est traitee comme secondaire ou comme traduction automatique
  - Italien valide en V1 selon decision du 25 avril 2026
- Zones : Limassol, Paphos, Larnaca, Nicosia, Famagusta

## ARCHITECTURE COMMERCIALE B2B2C

ENKI Realty repose sur une architecture B2B2C avec trois entites distinctes :
- **ENKI Realty Tech** (societe X) : plateforme technologique. Pas de licence d'agent immobilier chypriote. Genere et qualifie les leads.
- **Societe de vente** (societe Y) : entite chypriote titulaire de la licence d'agent immobilier. Realise les transactions.
- **Crona Group** : developpeur immobilier chypriote partenaire. Apparait publiquement comme developpeur liste. Actionnaire partiel (non public) de la societe de vente.

**Tracking anti-fraude** : triple ancrage immuable + double-signature + detection automatique. Voir document Architecture Commerciale & CRM Commission Tracking.

## VOCABULAIRE INTERNE

Voir le **Glossaire ENKI Realty** sur Notion pour la definition complete et autorisante de tous les termes (ENKI, Lexaia, espace personnel, gradation N1/N2, passage de main, triple ancrage, etc.).

## WORKFLOW DEVELOPPEMENT

1. Lire CLAUDE.md (ce fichier)
2. Consulter MEMORY.md pour contexte recent
3. Verifier ROADMAP-BUSINESS.md pour priorites
4. Pour toute decision design : verifier la couche correspondante du design system (Notion ou `docs/design-system/`)
5. Executer la tache
6. Tester (`npm run build`)
7. Mettre a jour MEMORY.md
8. Commit avec message conventionnel (feat/fix/docs/refactor)

## CHANGELOG

### v1.1 - 26 avril 2026
- Nom corrige : ENKI Realty (avec "y") au lieu de "ENKI Reality"
- Langues : 9 langues europeennes (ajout polonais qui manquait)
- Palette Ocean Blue / Cyprus Terra retiree (sera definie en Couche 5)
- Ajout reference au design system par couches
- Ajout regle constitutionnelle Crona (structure capitalistique invisible)
- Ajout architecture B2B2C
- Ajout reference au Glossaire Notion
- Workflow developpement : ajout etape verification couche design

### v1.0 - 25 mars 2026 (initial)
- Creation du fichier de gouvernance
