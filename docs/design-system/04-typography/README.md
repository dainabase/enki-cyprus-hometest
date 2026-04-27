# Couche 4 — Typography Stack v1.0

> **Statut** : VALIDÉ par Jean-Marie le 27 avril 2026
> **Source de vérité éditoriale** : page Notion dédiée — https://www.notion.so/34f8c7bb251581ba9b75e54f5bb437fc

## Stack adoptée

Trois polices libres (toutes OFL 1.1) qui portent ensemble le registre Sage + Magician d'ENKI Realty :

| Police | Rôle | Auteur | Famille |
|---|---|---|---|
| **Hanken Grotesk** | Voix principale (UI, corps, sous-titres, boutons, captions) | Alfredo Marco Pradil — Hanken Design Co., Manille | 9 graisses + italiques + variable |
| **Schibsted Grotesk** | Voix éditoriale (hero, H2, citations, italiques sémantiques) | Henrik Kongsvoll — Bakken & Bæck pour Schibsted ASA, Oslo | 6 graisses + vraies italiques + variable |
| **JetBrains Mono** | Voix technique (eyebrows, data, coordonnées GPS) | JetBrains s.r.o., Prague | 8 graisses + italiques + variable |

## Sources officielles

- Hanken Grotesk : https://fonts.google.com/specimen/Hanken+Grotesk
- Schibsted Grotesk : https://fonts.google.com/specimen/Schibsted+Grotesk
- JetBrains Mono : https://www.jetbrains.com/lp/mono/

## Comment intégrer dans le projet

### Via Google Fonts (recommandé pour démarrer)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,100..900;1,100..900&family=Schibsted+Grotesk:ital,wght@0,400..900;1,400..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap" rel="stylesheet">
```

### Variables CSS à utiliser

```css
:root {
  --font-sans: 'Hanken Grotesk', -apple-system, sans-serif;
  --font-serif: 'Schibsted Grotesk', Georgia, serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', monospace;
}
```

### Tailwind config (à appliquer en Couche 8 si la stack Tailwind est confirmée)

```js
fontFamily: {
  sans: ['Hanken Grotesk', 'sans-serif'],
  serif: ['Schibsted Grotesk', 'serif'],
  mono: ['JetBrains Mono', 'monospace'],
}
```

## Règles d'usage essentielles

Voir le tableau de décision complet dans `brand-book.html` ou la page Notion. Synthèse :

- **Hero / Display** → Schibsted Grotesk Medium 500 + italic 400i pour la signature
- **Titres H2** → Schibsted Grotesk 400-500
- **Sous-titres H3-H4** → Hanken Grotesk 600 Semibold
- **Corps** → Hanken Grotesk 400 Regular, 17px / line-height 1.65
- **CTA / boutons** → Hanken Grotesk 500 Medium (jamais Bold)
- **Eyebrows / labels** → JetBrains Mono 400, uppercase, tracking 0.10em
- **Données techniques** → JetBrains Mono 400-500
- **Citations / emphasis** → Schibsted Grotesk 400 Italic (italique sémantique uniquement)

## Règles non-négociables

1. Pas de Bold (700) pour les CTAs et boutons. On utilise Medium (500).
2. Schibsted Grotesk uniquement pour les titres éditoriaux et la signature, jamais pour le corps de texte.
3. Les italiques sont sémantiques, jamais décoratives.
4. JetBrains Mono uppercase + tracking 0.10em pour les eyebrows.
5. Les ligatures de code de JetBrains Mono sont désactivées (contexte immobilier, pas dev).
6. Une page = trois polices avec des rôles clairs. Jamais quatre.
7. Les chiffres sont tabulaires dans les contextes data (`font-feature-settings: 'tnum'`).

## Plan d'évolution

Si après prototypage la signature de marque doit être renforcée, l'évolution naturelle est **l'achat de Söhne** (Klim Type Foundry, ~700€). Söhne est précisément la référence dont Hanken Grotesk et Schibsted Grotesk reproduisent la lignée Akzidenz-Grotesk. La migration se ferait sans rupture du système car les rôles et l'architecture typographique restent identiques.

Pour l'instant, le compromis gratuit atteint ~88% de la valeur Söhne sur les usages réels d'ENKI Realty (UI dense + contenu éditorial).

## Brand book visuel

Le fichier `brand-book.html` contient un brand book complet avec :
- Cover signature
- Spécimens des 3 polices avec toutes leurs graisses
- La hiérarchie en action sur une page éditoriale ENKI typique
- Mockup d'une fiche bien (drawer Niveau 3)
- Citation italique signature
- Tableau de décision complet

Il embarque les Google Fonts en direct et inclut des règles CSS print qui permettent de générer un PDF A3 portrait propre (10 pages, une section par page).

Pour générer le PDF :
1. Ouvrir `brand-book.html` dans Chrome
2. CMD+P (ou CTRL+P sur Windows)
3. Format A3 portrait, marges 0
4. Cocher "Activer les graphiques d'arrière-plan"
5. Enregistrer en PDF

## Références complémentaires

- Document **Verrous constitutionnels** (Notion, sous-hub Gouvernance documentaire) — point 1.4 VALIDÉ
- **Hub Design System** (Notion) — règles constitutionnelles mises à jour
- **Brand Manifesto v1.2** (Notion) — pièce-mère du design system

---

*Document maintenu par Claude Opus 4.7 sous l'autorité de Jean-Marie Delaunay*
*Couche 4 sur 8 du Design System ENKI Realty*
