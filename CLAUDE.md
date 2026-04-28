# [CLAUDE.md](http://CLAUDE.md) - ENKI Realty Project Governance

> Rules permanentes pour tous les agents IA travaillant sur ce repo. Lu automatiquement par Claude Code. Inclure dans les prompts Jules/Lovable/Cowork. \*\***Version** : v1.6 (28 avril 2026) **Source de verite strategique et editoriale** : Notion (hub Design System) **Source de verite technique** : ce fichier + repo GitHub \*\***REGLE DE PRIORITE** : en cas d'incoherence entre un document Notion et un fichier .md du repo :
>
> - Pour les documents marques **EN REVIEW** ou **EN ATTENTE DE VALIDATION** : Notion fait foi.
> - Pour les documents marques **VALIDES** dans `docs/design-system/` : le repo est la source de verite technique opposable.
>
> Voir `docs/design-system/README.md` pour la regle complete de gouvernance Notion &lt;-&gt; GitHub.

## IDENTITE PROJET

- **Nom** : ENKI Realty (PropTech B2B2C)
- **Type** : Marketplace immobiliere agentique
- **Marche** : Chypre (expansion future Grece/Portugal/Malte/Dubai)
- **Supabase Project ID** : `ccsakftsslurjgnjwdci`
- **Repo** : `dainabase/enki-cyprus-hometest`
- **Stack technique actuelle** : React 19 + TypeScript + Vite + Supabase + Tailwind + Framer Motion (heritage du codebase initial - sera valide explicitement en Couche 8)

## REGLES ABSOLUES

### Interdictions

 1. **JAMAIS inventer** de chiffres, ROI, fonctionnalites, apps. Si inconnu -&gt; demander a Jean-Marie
 2. **JAMAIS utiliser** `any` en TypeScript - toujours typer strictement
 3. **JAMAIS laisser de console.log** en production - utiliser le logger unifie
 4. **JAMAIS creer de mock data** sans prefixe `// TODO: MOCK - remplacer par vraie donnee`
 5. **JAMAIS modifier** les Edge Functions `google-maps-agent` et triggers RLS sans validation
 6. **ZERO emoji** dans le code et l'UI (regle issue du Brand Manifesto v1.2)
 7. **Crona Group** : structure capitalistique invisible. Crona apparait publiquement comme developpeur liste parmi les autres. Aucune communication, aucun signal visuel, aucun positionnement ne doit reveler ou suggerer la relation actionnariale entre Crona et la societe de vente affiliee.
 8. **JAMAIS figer une decision visuelle, typographique, chromatique ou interactionnelle** sans qu'elle soit validee dans la couche correspondante du design system (cf. section DESIGN SYSTEM ci-dessous).
 9. **JAMAIS utiliser Inter** comme police par defaut. Inter est saturee a 414 milliards de requetes Google Fonts en 12 mois et signale "default SaaS americain" - exactement ce que le brief evite. La typographie est definie par la Couche 4 v1.0 validee : Hanken Grotesk + Schibsted Grotesk + JetBrains Mono.
10. **JAMAIS communiquer hors CRM ENKI Realty** apres passage de main d'un lead a la societe de vente affiliee. Toute communication avec un client transmis (appels, emails, SMS, WhatsApp, visioconference) doit etre tracee dans le CRM. Cette discipline est non negociable et conditionne le mecanisme de tracking anti-fraude commission. Voir `docs/design-system/03-architecture-commerciale-crm.md`.

### Validees dans les couches du design system

- **Voix de marque & ton editorial** : VALIDES en Couche 2 v2.1 (Conversational Tier) le 27 avril 2026. Voix unique en six attributs invariants (calme, precis, pedagogique, chaleureux, discret, mythique sans theatral), declinee en trois registres operationnels (voix editoriale du site, voix de l'agent ENKI, voix de Lexaia). Tone of voice matrix sur 15 contextes. Serment editorial en huit promesses. Voir `docs/design-system/02-conversational-tier.md`.
- **Architecture conversationnelle** : VALIDEE en Couche 2 v2.1 le 27 avril 2026. Un seul agent conversationnel (ENKI), Lexaia comme systeme de production de livrables (pas de seconde voix conversationnelle), gradation a deux niveaux (apercu en chat / rapport synthetique contre creation d'espace), espace personnel comme actif strategique differenciateur. Voir `docs/design-system/02-conversational-tier.md`.
- **Architecture commerciale B2B2C** : VALIDEE le 27 avril 2026 (document complementaire a la Couche 2). Trois entites distinctes (ENKI Realty Tech, societe de vente, developpeurs incluant Crona). Passage de main avec evenement technique signe et opposable. CRM unique heberge par ENKI Realty avec deux interfaces. Tracking anti-fraude par triple ancrage immuable + double-signature + detection automatique. Voir `docs/design-system/03-architecture-commerciale-crm.md`.
- **Typographie** : VALIDEE en Couche 4 v1.0 le 27 avril 2026. Stack a trois polices libres (OFL 1.1) : **Hanken Grotesk** (voix principale, UI/corps), **Schibsted Grotesk** (voix editoriale, titres/signature, italiques semantiques), **JetBrains Mono** (voix technique, eyebrows/data). Voir `docs/design-system/04-typography-system.md` et `docs/design-system/04-typography/`. Plan d'evolution accepte vers Sohne (Klim Type Foundry) quand le budget le permet, sans rupture du systeme.
- **Couleurs** : VALIDEE en Couche 5 v1.0 le 28 avril 2026. 14 tokens semantiques (7 light + 7 dark) avec symetrie d'inversion parfaite light/dark, et 33 nuances d'echelles 50→950 pour les 3 couleurs sources colorees (Aero hue 220°, Chamoisee hue 50°, Encre hue 250°). Format colorimetrique retenu : HEX en valeur, OKLCH en reference. Implementation : `src/styles/tokens.css` + namespace `enki.*` dans `tailwind.config.ts`. Coexiste avec les tokens Shadcn legacy pendant la phase de migration. Verrous : aucun #FFFFFF/#000000 pur, discipline 95/5, hue 220°/50°/250° figes. Voir `docs/design-system/05-color-system.md`.

### A definir dans les couches du design system - aucune decision actuellement validee

- **Motion / Animations** : principes generaux fixes par la Couche 3 v1.0 (en review sur Notion : animations restraint qui autorise le sublime, filtre 3 questions). Valeurs precises (durees, easings) a definir en Couche 6.
- **Composants UI** : a definir en Couche 8 (Component Tokens), incluant validation explicite du framework Tailwind + Shadcn/ui.

### Obligations

1. **Toujours verifier** la coherence schema TypeScript &lt;-&gt; colonnes Supabase avant tout formulaire
2. **Toujours prefixer** les colonnes JSONB avec le nom du domaine (ex: `golden_visa_details`, `tax_benefits`)
3. **Toujours utiliser** les vrais noms de colonnes Supabase (voir `docs/governance/EDGE-FUNCTIONS-REGISTRY.md`)
4. **Toujours tester** le build (`npm run build`) avant commit
5. **Toujours documenter** dans [MEMORY.md](http://MEMORY.md) apres chaque session significative
6. **Toujours respecter** le design system par couches : aucune decision visuelle, typographique, chromatique ou interactionnelle ne peut etre prise sans retour explicite au document de la couche correspondante (voir regle de priorite Notion &lt;-&gt; GitHub ci-dessus)

## DESIGN SYSTEM - APPROCHE PAR COUCHES

Le design system ENKI Realty se construit en 8 couches sequentielles plus des documents complementaires. Chaque couche s'appuie sur la precedente. Aucun saut autorise.

CoucheFichier .mdStatut NotionSync GitHub1 - Brand Manifesto`docs/design-system/01-brand-manifesto.md`v1.2 VALIDEEv1.2 sync 27 avril 20262 - Conversational Tier`docs/design-system/02-conversational-tier.md`v2.1 VALIDEEv2.1 sync 27 avril 2026Doc complementaire - Architecture Commerciale & CRM`docs/design-system/03-architecture-commerciale-crm.md`v1.0 VALIDEEv1.0 sync 27 avril 20263 - Visual Principles(en review sur Notion)v1.0 en reviewPas encore syncDoc complementaire - Experience Architecture(en review sur Notion)v1.0 en reviewPas encore sync4 - Typography System`docs/design-system/04-typography-system.md`v1.0 VALIDEEv1.0 sync 27 avril 20265 - Color System`docs/design-system/05-color-system.md`v1.0 VALIDEEv1.0 sync 28 avril 20266 - Motion & Interaction Principlesa venirPas encore creen/a7 - Photography & Imagery Directiona venirPas encore creen/a8 - Component Tokensa venirPas encore creen/a

**Source de verite strategique** : pages Notion sous le hub "Design System & Cinematic Experience", organise en 6 sous-hubs thematiques depuis le 26 avril 2026 (Piece-mere, Couches du Design System, Documents complementaires, Gouvernance documentaire, Memos & reflexions en cours, References permanentes). Voir Mapping Notion &lt;-&gt; GitHub sur Notion pour le detail.

**Source de verite technique** : fichiers .md sous `docs/design-system/` pour les couches validees. Voir `docs/design-system/README.md` pour la regle de gouvernance complete.

**Memos de reflexion en cours** : voir page Notion "Decisions en suspens" pour sujets a retravailler (structure capitalistique, ethique de la memoire). Voir egalement page Notion "Sujets a retravailler a froid" (URL : <https://www.notion.so/34f8c7bb251581fb99b1f31d1a1629e5>) qui recense le Sujet A (avocat chypriote + fiscaliste) et le Sujet B (architecture memoire 5 dimensions). Aucun de ces sujets n'est decide a ce jour.

**Verrous constitutionnels** : un document de gouvernance dedie sur Notion recense les regles non-negociables qui ont emerge au fil des couches (URL : <https://www.notion.so/34e8c7bb251581acad91d6b411954ff5>). A consulter en cas de doute sur un arbitrage.

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
- Golden Visa : `golden_visa_eligible` (boolean, auto-calcule si price_from &gt;= 300000)

### Table `projects`

- Zone : `zone` (Limassol, Paphos, Larnaca, Nicosia, Famagusta)
- Statut : `status` (planning, under_construction, completed, selling)
- Slug : `slug` (URL-friendly, unique)

## EDGE FUNCTIONS - STATUT

FonctionStatutNotegoogle-maps-agentPRODUCTIONNe pas toucheragentic-searchBROKENColonnes fantomes a corrigerlexaia-callMOCKAPI fictiveparse-documentMOCKFaux OCRextract-full-hierarchyMOCKDonnees hardcodees14 autresSANS JWTA securiser

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

**Tracking anti-fraude** : triple ancrage immuable + double-signature + detection automatique. Voir document Architecture Commerciale & CRM Commission Tracking v1.0 sync sur le repo (`docs/design-system/03-architecture-commerciale-crm.md`).

## VOCABULAIRE INTERNE

Voir le **Glossaire ENKI Realty** sur Notion (sous-hub Gouvernance documentaire) pour la definition complete et autorisante de tous les termes (ENKI, Lexaia, espace personnel, gradation N1/N2, passage de main, triple ancrage, etc.).

## WORKFLOW DEVELOPPEMENT

1. Lire [CLAUDE.md](http://CLAUDE.md) (ce fichier)
2. Consulter [MEMORY.md](http://MEMORY.md) pour contexte recent
3. Pour toute decision business / strategique : verifier les pages Notion correspondantes (war room ENKI Realty)
4. Pour toute decision design : verifier la couche correspondante du design system. Pour les couches validees, le fichier `docs/design-system/` fait foi. Pour les couches en review, Notion fait foi.
5. Executer la tache
6. Tester (`npm run build`)
7. Mettre a jour [MEMORY.md](http://MEMORY.md)
8. Commit avec message conventionnel (feat/fix/docs/refactor)

## CHANGELOG

### v1.5 - 27 avril 2026

- **Couche 2 v2.1 VALIDEE** par delegation explicite de Jean-Marie : *"si tu l'as fait correctement, je ne pense pas qu'il y ait besoin de la reverifier"*. Architecture conversationnelle + voix editoriale entrent dans la section "Validees dans les couches".
- **Architecture Commerciale & CRM v1.0 VALIDEE** par coherence (rattachee a la Couche 2). Triple ancrage anti-fraude entre dans la section "Validees dans les couches".
- **Nouvelle interdiction n.10** : JAMAIS communiquer hors CRM ENKI Realty apres passage de main d'un lead. Toute communication doit etre tracee. Discipline non negociable.
- Tableau des couches mis a jour : Couche 2 v2.1 sync, Architecture Commerciale v1.0 sync.
- Reference au document "Sujets a retravailler a froid" (Sujet A avocat/fiscaliste + Sujet B architecture memoire 5D).
- Couche 3 et Experience Architecture restent en review sur Notion - non validees explicitement par Jean-Marie a ce jour.

### v1.4 - 27 avril 2026

- **Couche 4 - Typography System v1.0 VALIDEE** par Jean-Marie : Hanken Grotesk + Schibsted Grotesk + JetBrains Mono (toutes OFL 1.1, gratuites). La regle "JAMAIS Inter" entre dans les Interdictions.
- Nouvelle section "Validees dans les couches du design system" pour distinguer les couches validees des couches encore a definir.
- Tableau des couches mis a jour : Couche 1 v1.2 sync, Couche 4 v1.0 VALIDEE et sync.
- Regle de priorite Notion &lt;-&gt; GitHub affinee : pour les documents VALIDES, le repo est la source de verite technique opposable. Pour les documents EN REVIEW, Notion fait foi.
- Reference au nouveau `docs/design-system/README.md` qui pose la regle complete de gouvernance documentaire.
- Reference au document Verrous constitutionnels sur Notion.

### v1.3 - 26 avril 2026

- **Correction majeure** : suppression de la regle "Font: Inter uniquement" qui n'avait jamais ete validee par Jean-Marie. Inter etait un heritage du codebase initial presente a tort comme verrou constitutionnel. La typographie sera definie en Couche 4 apres formulaire structurant.
- Reorganisation des regles : section "A definir dans les couches" creee, distincte des "Interdictions" definitives, pour clarifier le statut de chaque regle (validee vs en attente de Couche)
- Ajout de la Couche 3 - Visual Principles v1.0 (en review) et du document complementaire Experience Architecture v1.0 (en review) au tableau des couches
- Mention explicite que la stack actuelle (React/TS/Vite/Tailwind/Shadcn) est un heritage du codebase initial a valider explicitement en Couche 8
- Reference au hub Notion reorganise en 6 sous-hubs thematiques depuis le 26 avril
- Mention du sous-hub "Gouvernance documentaire" pour le Glossaire

### v1.2 - 26 avril 2026

- Suppression references a fichiers fantomes ([DESIGN-SYSTEM.md](http://DESIGN-SYSTEM.md), [ROADMAP-BUSINESS.md](http://ROADMAP-BUSINESS.md) inexistants)
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
