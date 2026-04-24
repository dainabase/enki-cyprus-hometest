# ENKI Realty — Claude Design Bundle

> **But de ce dossier** : matériel optimisé pour l'onboarding Claude Design.
> Contient uniquement les fichiers pertinents pour l'extraction du design system,
> sans bruit (pas de node_modules, Edge Functions, admin, tests).
>
> **À uploader dans Claude Design via "Set up design system"**.

## Contexte marque

**ENKI Realty** — Marketplace premium d'investissement immobilier à Chypre pour investisseurs européens (budgets 300k-1M€+).

**Positionnement** : Sotheby's meets modern tech. Premium européen accessible.

**Clientèle cible** :
- Retraités français/belges (200-400k€, Paphos, motivés par fiscalité pension 5%)
- Entrepreneurs allemands (300-800k€, Limassol, motivés par non-dom 0% dividendes)
- Investisseurs yield (150-500k€, rendement 5-7%)

**Différenciateurs** :
1. Agent conversationnel IA (recherche en langage naturel)
2. Scoring transparent des propriétés
3. LEXAIA — optimisation fiscale européenne (RAG 27 pays UE)
4. Golden Visa automation (90 jours process)

## Système actuel (à faire évoluer vers premium européen poussé loin)

**Palette actuelle** : Cyprus Mediterranean
- Primary : Cyprus Ocean Blue `#57B9D6` (HSL 199 63% 59%)
- Accent : Cyprus Terra cotta warm
- Golden Visa : Premium gold `hsl(45 93% 47%)`
- Neutrals : Warm beige undertones

**Typographie actuelle** : Inter (verrouillé — règle gouvernance stricte)
- Hero titles : 6xl → 8xl, font-extralight, tracking tighter
- Scale "swaarg" : hero, section, large, card, body-large, body, button, nav

**Radius actuel** : `--radius: 1rem` (très arrondi)

**Shadows** : sm, md, lg, premium (avec teinte primary)

**Composants** : Shadcn/ui (58 composants) + ENKI-specific (property-card, chat-container, lexaia-panel, hero-alternative3, trust-bar)

## Verrous non-négociables (règles gouvernance)

- **Font** : Inter exclusivement (secondaire éditorial possible pour h1/h2 si justifié)
- **Zéro emoji** dans l'interface
- **Couleurs en HSL** uniquement (convention codebase)
- **Framework** : Tailwind CSS + Shadcn/ui
- **Pas d'inventions** : tous les chiffres/chiffres-clients doivent être vérifiables

## Direction souhaitée pour l'évolution

**Option B — Premium européen poussée loin**. On garde l'ADN Cyprus (bleu océan en mémoire) mais on repositionne vers luxe éditorial européen.

**Inspirations** :
- Sotheby's (sobriété, espace blanc généreux, hiérarchie forte)
- Knight Frank (data authority, gris charcoal, densité contrôlée)
- Christie's (typographie éditoriale serif possible)
- Airbnb Plus (raffinement accessible, pas intimidant)

**À explorer** :
- Palette : évoluer vers navy profond + neutrals chauds + accent or/champagne ? ou terra/sable + métal ? ou rester ocean blue raffiné ?
- Typo : rester 100% Inter ou ajouter serif display (Fraunces, Playfair, Canela, GT Super) pour h1/h2 ?
- Radius : passer de 1rem (très arrondi) à 0.5rem ou 0.25rem (plus premium/institutionnel) ?
- Densité : plus éditorial avec plus d'espace blanc ou consolider le spacieux actuel ?
- Motion : garder minimaliste ou ajouter signature (parallax subtil, reveals éditoriaux) ?

## Contenu de ce bundle

```
docs/claude-design-bundle/
├── README.md (ce fichier)
├── 01-design-tokens/
│   ├── index.css              Design tokens HSL actuels
│   └── tailwind.config.ts     Config Tailwind avec mappings
├── 02-components-ui/          58 composants Shadcn atomiques
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── ...
├── 03-components-enki/        Composants signature ENKI
│   ├── OptimizedPropertyCard.tsx
│   ├── hero-Alternative3.tsx
│   ├── chat-ChatContainer.tsx
│   ├── lexaia-LexaiaPanel.tsx
│   └── SmartTrustBar.tsx
└── 04-inspiration/
    └── references.md           Urls et notes d'inspiration
```

## Upload dans Claude Design

Deux options au choix selon ce que Claude Design propose à l'onboarding :

**Option 1 — Upload de dossier local**
Tu zippes ce dossier `docs/claude-design-bundle/` et tu l'uploades directement dans le flow d'onboarding Claude Design.

**Option 2 — Link GitHub**
Tu pointes Claude Design vers `https://github.com/dainabase/enki-cyprus-hometest` avec le path `docs/claude-design-bundle/`.

L'option 1 est plus rapide et plus sûre (pas de dépendance au rendu GitHub). L'option 2 garde la source de vérité synchronisée.

## Après l'upload

Claude Design va générer un **design system extrait** (palette, typographie, composants, layouts).

**Action suivante** : ne pas publier tout de suite. Utiliser la fonction **Remix** pour faire évoluer vers la direction Option B premium européen poussée loin, avant de publier.
