# CLAUDE.md - ENKI Realty Project Governance

> Rules permanentes pour tous les agents IA travaillant sur ce repo.
> Lu automatiquement par Claude Code. Inclure dans les prompts Jules/Lovable/Cowork.
>
> **Version** : v1.3 (26 avril 2026)
> **Source de verite strategique et editoriale** : Notion (hub Design System)
> **Source de verite technique** : ce fichier + repo GitHub
>
> **REGLE DE PRIORITE** : en cas d'incoherence entre un document Notion et un fichier .md du repo, **Notion fait foi**. Les fichiers .md du repo peuvent etre en retard sur Notion (cycle de sync explicite). Tout agent IA doit verifier la version Notion correspondante avant de prendre une decision basee sur un .md du repo.

## IDENTITE PROJET

- **Nom** : ENKI Realty (PropTech B2B2C)
- **Type** : Marketplace immobiliere agentique
- **Marche** : Chypre (expansion future Grece/Portugal/Malte/Dubai)
- **Supabase Project ID** : `ccsakftsslurjgnjwdci`
- **Repo** : `dainabase/enki-cyprus-hometest`
- **Stack technique actuelle** : React 19 + TypeScript + Vite + Supabase + Tailwind + Framer Motion (heritage du codebase initial - sera valide explicitement en Couche 8)

## REGLES ABSOLUES

### Interdictions
1. **JAMAIS inventer** de chiffres, ROI, fonctionnalites, apps. Si inconnu -> demander a Jean-Marie
2. **JAMAIS utiliser `any`** en TypeScript - toujours typer strictement
3. **JAMAIS laisser de console.log** en production - utiliser le logger unifie
4. **JAMAIS creer de mock data** sans prefixe `// TODO: MOCK - remplacer par vraie donnee`
5. **JAMAIS modifier** les Edge Functions `google-maps-agent` et triggers RLS sans validation
6. **ZERO emoji** dans le code et l'UI (regle issue du Brand Manifesto v1.2)
7. **Crona Group** : structure capitalistique invisible. Crona apparait publiquement comme developpeur liste parmi les autres. Aucune communication, aucun signal visuel, aucun positionnement ne doit reveler ou suggerer la relation actionnariale entre Crona et la societe de vente affiliee.
8. **JAMAIS figer une decision visuelle, typographique, chromatique ou interactionnelle** sans qu'elle soit valide dans la couche correspondante du design system (cf. section DESIGN SYSTEM ci-dessous).

### A definir dans les couches du design system - aucune decision actuellement validee
- **Typographie** : a definir en Couche 4 (Typography System). Aucune police n'est validee a ce jour. La police actuellement presente dans le code (Inter) est un heritage du codebase initial, elle n'a fait l'objet d'aucune decision editoriale et sera reinterrogee en Couche 4.
- **Couleurs** : a definir en Couche 5 (Color System). Aucune palette n'est validee a ce jour. Toute palette utilisee actuellement dans le code est provisoire et NON VALIDEE. Aucun token de couleur ne doit etre fige tant que la Couche 5 n'est pas validee.
- **Motion / Animations** : principes generaux fixes par la Couche 3 v1.0 (animations restraint qui autorise le sublime, filtre 3 questions). Valeurs precises (durees, easings) a definir en Couche 6.
- **Composants UI** : a definir en Couche 8 (Component Tokens), incluant validation explicite du framework Tailwind + Shadcn/ui.

### Obligations
1. **Toujours verifier** la coherence schema TypeScript <-> colonnes Supabase avant tout formulaire
2. **Toujours prefixer** les colonnes JSONB avec le nom du domaine (ex: `golden_visa_details`, `tax_benefits`)
3. **Toujours utiliser** les vrais noms de colonnes Supabase (voir `docs/governance/EDGE-FUNCTIONS-REGISTRY.md`)
4. **Toujours tester** le build (`npm run build`) avant commit
5. **Toujours documenter** dans MEMORY.md apres chaque session significative
6. **Toujours respecter** le design system par couches : aucune decision visuelle, typographique, chromatique ou interactionnelle ne peut etre prise sans retour explicite au document de la couche correspondante (Notion source de verite, `docs/design-system/` source technique une fois sync)

## DESIGN SYSTEM - APPROCHE PAR COUCHES

Le design system ENKI Realty se construit en 8 couches sequentielles plus des documents complementaires. Chaque couche s'appuie sur la precedente. Aucun saut autorise.

| Couche | Fichier .md (futur) | Statut Notion | Sync GitHub |
|--------|---------------------|----------------|-------------|
| 1 - Brand Manifesto | `docs/design-system/01-brand-manifesto.md` | v1.2 en review | v1.1 mergee (commit `34ca850`) |
| 2 - Conversational Tier | `docs/design-system/02-conversational-tier.md` | v2.1 en review | Pas encore sync |
| Doc complementaire - Architecture Commerciale & CRM | `docs/design-system/03-architecture-commerciale-crm.md` | v1.0 en review | Pas encore sync |
| 3 - Visual Principles | `docs/design-system/04-visual-principles.md` | v1.0 en review | Pas encore sync |
| Doc complementaire - Experience Architecture | `docs/design-system/04bis-experience-architecture.md` | v1.0 en review | Pas encore sync |
| 4 - Typography System | a venir | Pas encore cree | n/a |
| 5 - Color System | a venir | Pas encore cree | n/a |
| 6 - Motion & Interaction Principles | a venir | Pas encore cree | n/a |
| 7 - Photography & Imagery Direction | a venir | Pas encore cree | n/a |
| 8 - Component Tokens | a venir | Pas encore cree | n/a |

**Source de verite strategique** : pages Notion sous le hub "Design System & Cinematic Experience", organise en 6 sous-hubs thematiques depuis le 26 avril 2026 (Piece-mere, Couches du Design System, Documents complementaires, Gouvernance documentaire, Memos & reflexions en cours, References permanentes). Voir Mapping Notion <-> GitHub sur Notion pour le detail.

**Source de verite technique** : fichiers .md sous `docs/design-system/` une fois synchronises depuis Notion.

**Memos de reflexion en cours** : voir page Notion "Decisions en suspens" pour sujets a retravailler (structure capitalistique, architecture memoire ENKI). Aucun de ces sujets n'est decide a ce jour.

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

**Tracking anti-fraude** : triple ancrage immuable + double-signature + detection automatique. Voir document Architecture Commerciale & CRM Commission Tracking sur Notion.

## VOCABULAIRE INTERNE

Voir le **Glossaire ENKI Realty** sur Notion (sous-hub Gouvernance documentaire) pour la definition complete et autorisante de tous les termes (ENKI, Lexaia, espace personnel, gradation N1/N2, passage de main, triple ancrage, etc.).

## WORKFLOW DEVELOPPEMENT

1. Lire CLAUDE.md (ce fichier)
2. Consulter MEMORY.md pour contexte recent
3. Pour toute decision business / strategique : verifier les pages Notion correspondantes (war room ENKI Realty)
4. Pour toute decision design : verifier la couche correspondante du design system (Notion d'abord, `docs/design-system/` ensuite)
5. Executer la tache
6. Tester (`npm run build`)
7. Mettre a jour MEMORY.md
8. Commit avec message conventionnel (feat/fix/docs/refactor)

## CHANGELOG

### v1.3 - 26 avril 2026
- **Correction majeure** : suppression de la regle "Font: Inter uniquement" qui n'avait jamais ete validee par Jean-Marie. Inter etait un heritage du codebase initial presente a tort comme verrou constitutionnel. La typographie sera definie en Couche 4 apres formulaire structurant.
- Reorganisation des regles : section "A definir dans les couches" cree, distincte des "Interdictions" definitives, pour clarifier le statut de chaque regle (validee vs en attente de Couche)
- Ajout de la Couche 3 - Visual Principles v1.0 (en review) et du document complementaire Experience Architecture v1.0 (en review) au tableau des couches
- Mention explicite que la stack actuelle (React/TS/Vite/Tailwind/Shadcn) est un heritage du codebase initial a valider explicitement en Couche 8
- Reference au hub Notion reorganise en 6 sous-hubs thematiques depuis le 26 avril
- Mention du sous-hub "Gouvernance documentaire" pour le Glossaire

### v1.2 - 26 avril 2026
- Suppression references a fichiers fantomes (DESIGN-SYSTEM.md, ROADMAP-BUSINESS.md inexistants)
- Ajout regle de priorite explicite : en cas d'incoherence Notion / .md, Notion fait foi
- Tableau des couches enrichi : statut Notion separe du statut sync GitHub
- Reference explicite au memo "Decisions en suspens" (sujets a retravailler)
- Workflow simplifie (suppression etape Roadmap-business inexistante)

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
