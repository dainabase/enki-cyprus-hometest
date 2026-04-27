# 🔤 Couche 4 — Typography Stack v1.0

> **Document de design system, Couche 4 sur 8.** Définit le système typographique d'ENKI Realty : trois polices libres, leurs rôles respectifs, leurs règles d'usage, et le plan d'évolution.
>
> **Statut** : VALIDÉ par Jean-Marie le 27 avril 2026 — *« C'est validé à 100 %, c'est magnifique, le message va vraiment très bien passer sur le site »*
>
> **Version 1.0 · 27 avril 2026**
> Auteurs : Jean-Marie Delaunay (validation) + Claude Opus 4.7 (production)
> Notion source : <https://www.notion.so/34f8c7bb251581ba9b75e54f5bb437fc>
>
> **Référence visuelle** : un brand book HTML/PDF complet a été produit en complément de ce document, avec spécimens, échelles de graisses, mockups en contexte d'usage et tableau de décision. Voir [`04-typography/brand-book.html`](./04-typography/brand-book.html). Le document HTML reste la source de vérité visuelle vivante (avec les polices chargées en direct depuis Google Fonts), le PDF (10 pages A3 portrait) reste la version archivée du 27 avril 2026.

---

## Préambule — Pourquoi cette Couche, pourquoi ces choix

La typographie est la décision la plus engageante d'un design system. Elle dure 5-10 ans, elle teinte tout, et elle coûte cher à changer (refonte CSS / Figma complète si on revient en arrière). Elle représente 80% des caractères affichés sur le site. Le choix typographique est aussi le premier signal de positionnement de marque que perçoit l'utilisateur — bien avant qu'il lise le contenu.

ENKI Realty est positionnée Sage + Magician. Institution patrimoniale moderne mêlée à une maison d'édition. Références : Stripe, Linear, Aman Resorts, Lombard Odier, Monocle magazine, Phaidon. La typographie doit porter une **autorité tranquille, calme, contemporaine**, sans être ni *techy SaaS américain* (comme Inter saturée à 414 milliards de requêtes Google Fonts en 12 mois), ni *vieille banque suisse* (comme Helvetica datée).

La référence cible privée — celle que la marque pourrait acheter à terme — est **Söhne** (Klim Type Foundry, Kris Sowersby), la police d'OpenAI / ChatGPT, de Stripe et de nombreuses marques tech-éditoriales premium. Söhne coûte ~700 €. Pour démarrer, ENKI a choisi des **alternatives gratuites qui reproduisent la même lignée Akzidenz-Grotesk** sans tomber dans les pièges de saturation ou de signature techy.

---

## La stack proposée et validée

Un trio cohérent, trois voix qui ne se marchent jamais sur les pieds.

### Hanken Grotesk — voix principale

- **Auteur** : Alfredo Marco Pradil (Hanken Design Co., Manille)
- **Licence** : SIL OFL 1.1 — gratuite, usage commercial illimité, modifiable
- **Famille** : 9 graisses (Thin 100 → Black 900) × vraies italiques + variable font (axes wght + ital)
- **Source officielle** : `fonts.google.com/specimen/Hanken+Grotesk`
- **Source GitHub** : `github.com/marcologous/hanken-grotesk`
- **Score de proximité Söhne** : 8/10

**Rôle** : porte 80% du texte affiché. Choisie pour :
- Sa parenté structurelle avec Akzidenz-Grotesk (la même lignée que Söhne)
- Sa lisibilité écran à toutes les tailles
- Son absence totale de signal SaaS (utilisée par Mason Garments, Tern, Antara Studio — pas par les acteurs tech mainstream)
- Sa conception originale pour la signalétique environnementale et la lecture longue
- Le « g » double-storey caractéristique, les apertures modérément ouvertes, les terminaisons coupées horizontalement

### Schibsted Grotesk — voix éditoriale

- **Auteur** : Henrik Kongsvoll chez Bakken & Bæck (Oslo) pour Schibsted ASA
- **Commanditaire** : groupe média scandinave Schibsted (Aftenposten, VG, Svenska Dagbladet)
- **Licence** : SIL OFL 1.1
- **Famille** : 6 graisses (Regular 400 → Black 900) × **vraies italiques dessinées** + variable font wght
- **Source officielle** : `fonts.google.com/specimen/Schibsted+Grotesk`
- **Source GitHub** : `github.com/schibsted/schibsted-grotesk`
- **Score de proximité Söhne** : 7,5/10

**Rôle** : la police qu'on utilise quand la marque doit parler. Choisie pour :
- Sa conception spécifique pour la **presse premium scandinave** — donc nativement éditoriale
- Sa correspondance directe avec les références Monocle / Phaidon du Brand Manifesto v1.2
- Ses **vraies italiques dessinées** (pas obliques mécaniques) qui permettent une emphase sémantique de qualité
- Sa saturation très faible hors média scandinave
- Son caractère légèrement plus froid-nordique que la chaleur berlinoise de Söhne — ce qui correspond au registre patrimonial recherché

### JetBrains Mono — voix technique

- **Auteur** : JetBrains s.r.o. (Prague)
- **Licence** : SIL OFL 1.1
- **Famille** : 8 graisses × italiques + variable font
- **Source officielle** : `jetbrains.com/lp/mono` ou Google Fonts

**Rôle** : porte les eyebrows, les références cadastrales, les coordonnées GPS, les codes postaux, les surfaces, et tout ce qui demande l'autorité d'une donnée vérifiable. Choisie pour :
- Sa qualité de dessin (la meilleure mono OFL du marché actuel)
- Sa neutralité (pas de signature visuelle forte)
- Ses ligatures de code désactivables (on les désactive pour ENKI car elles ne servent pas le contexte immobilier)
- Sa cohérence métrique acceptable avec Hanken Grotesk

---

## Tableau de décision — quelle police pour quoi

La règle d'usage. À garder en réflexe pour ne jamais hésiter.

| Contexte | Police | Pourquoi |
|---|---|---|
| **Hero / Display** | Schibsted Grotesk Medium 500 + italic 400i | Les moments où la marque parle. L'italique signe. |
| **Titres de section H2** | Schibsted Grotesk 400-500 | Continuité éditoriale avec le hero. |
| **Sous-titres H3-H4** | Hanken Grotesk 600 Semibold | Plus discret, structurel, ne fait plus signature. |
| **Corps de texte** | Hanken Grotesk 400 Regular | 17 px / line-height 1.65 — lecture longue. |
| **Boutons / CTA** | Hanken Grotesk 500 Medium | Présence sans agressivité. Pas de Bold. |
| **Eyebrows / Labels** | JetBrains Mono 400, uppercase, tracking 0.10em | Le tag éditorial qui structure les pages denses. |
| **Données techniques** | JetBrains Mono 400-500 | Coord. GPS, références cadastrales, surfaces. |
| **Citations / Emphasis** | Schibsted Grotesk 400 Italic | L'italique sémantique, jamais décoratif. |
| **Légendes / Captions** | Hanken Grotesk 400 Italic, 14 px | Discrètement éditorial. |
| **Agent ENKI (chat)** | Hanken Grotesk 400, italic pour les phrases signées | Voix humaine, pas robotique. |

---

## Règles non-négociables

Ces règles découlent du choix de la stack et constituent les premiers verrous typographiques d'ENKI Realty :

1. **Pas de Bold (700) pour les CTAs et boutons.** On utilise Medium (500). Le Bold est réservé aux situations exceptionnelles d'emphase forte.
2. **Schibsted Grotesk uniquement pour les titres éditoriaux et la signature.** Jamais pour le corps de texte. Jamais pour l'UI fonctionnelle.
3. **Les italiques sont sémantiques, jamais décoratives.** On les utilise pour :
   - Une emphase de sens (« *L'architecture n'invente rien* »)
   - Une citation (« *C'est probablement la plus belle des douze.* »)
   - Un nom propre de programme (« Maison de l'*Olivier* »)
   Jamais pour faire « joli » ou « éditorial ».
4. **JetBrains Mono uppercase + tracking 0.10em pour les eyebrows.** C'est le tag éditorial qui structure visuellement les pages denses (références Monocle).
5. **Les ligatures de code de JetBrains Mono sont désactivées.** Pas de `=>` graphique, pas de `==` graphique. Le contexte est immobilier, pas développeur.
6. **Pas de mélange capricieux des trois polices.** Une page = trois polices avec des rôles clairs. Jamais quatre. Jamais deux serif. Jamais une seule police pour tout (perte de la signature éditoriale).
7. **Le numéral est tabulaire dans les contextes data.** Les chiffres alignent en colonnes verticales (`font-feature-settings: 'tnum'`).

---

## Pourquoi pas Inter, ni Geist, ni Söhne (à ce stade)

**Inter écartée** malgré sa qualité technique : saturation extrême (414 milliards de requêtes Google Fonts en 12 mois, +57% YoY). Choisir Inter c'est *littéralement* signaler « default SaaS américain » — exactement ce que le brief cherche à éviter.

**Geist écartée** malgré sa qualité : trop taggée Vercel. Le README officiel cite ses inspirations (ABC Diatype, SF Pro, Suisse Int'l) — c'est de la tech-Swiss explicite, pas du patrimonial-allemand. Reconnaissable comme « police de Vercel » pendant encore 3-5 ans.

**Manrope écartée** : l'auteur refuse explicitement d'ajouter des italiques (« adding italics disrupted the core aesthetic »). Rédhibitoire pour un design system éditorial.

**DM Sans écartée** : saturation comme Inter, ADN géométrique hérité de Poppins, pas grotesque industriel.

**Söhne reportée** à l'horizon V2 / V3 : c'est la cible patrimoniale de la marque mais le coût (~700 €) n'est pas justifié au lancement, et les alternatives gratuites atteignent ~88% de sa valeur sur les usages réels d'ENKI. **Le plan d'évolution accepté est l'achat de Söhne quand le budget le permet, sans rupture du système** (Söhne est précisément la référence dont Hanken et Schibsted reproduisent la lignée Akzidenz-Grotesk).

---

## Caveat honnête sur le compromis

À quel point ces alternatives gratuites égalent-elles vraiment Söhne ?

- En **UI body 12-16px** (80% de l'usage) : Hanken atteint ~88-92% de Söhne. L'œil humain ne fait quasiment pas la différence.
- En **display headlines 32px+** : la chute commence, ~75-82%.
- En **éditorial long-form** : le kerning manuel et les italiques dessinées de Söhne se sentent, ~70-78% au mieux.
- Sur la **famille complète** (Sans + Mono + Schmal + Breit), aucune gratuite ne couvre les quatre axes d'origine de Söhne.

Pour ENKI Realty B2B2C où l'usage dominant sera UI dense + contenu éditorial premium pour annonces, le compromis Hanken / Schibsted / JetBrains est défendable. Le seul compromis qui pourrait se sentir à l'usage long terme est la cohérence Sans / Mono — Hanken Grotesk + JetBrains Mono ne sont pas dessinées par le même studio, donc une légère dissonance optique existe. Si elle devient problématique en année 2-3, c'est un signal supplémentaire pour basculer sur Söhne complet.

---

## Intégration technique

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

---

## Ce qui reste à définir dans la Couche 4

La Question 1 du formulaire (police de base) est validée. Les questions suivantes restent à traiter dans une session future :

- **Q2 — Système solo / duo / trio** : implicitement acté comme **trio** par la Q1. À confirmer formellement.
- **Q3 — Échelle modulaire** : 1.125 (chromatique), 1.25 (majeure tierce), 1.5 (quinte juste), ou hybride (1.125 corps + 1.5 titres). Recommandation Claude : hybride.
- **Q4 — Graisses utilisées** : combien et lesquelles dans chaque police ? Recommandation Claude : 4-5 graisses utilisées sur les 9 disponibles, pour éviter la verbosité.
- **Q5 — Règles d'italiques** : on a déjà le principe (italiques sémantiques uniquement), reste à formaliser les contextes exacts.
- **Q6 — Letter-spacing (tracking)** : valeurs précises pour titres serrés / corps neutre / mono uppercase.
- **Q7 — Line-height (interlignage)** : tight 1.05-1.1 pour les titres / généreux 1.55-1.65 pour le corps / 1.4-1.5 pour le mono.
- **Q8 — Typographie de l'agent ENKI** : même que la base ou différenciée ? Recommandation Claude : même que la base avec italique sur les phrases signées (déjà acté dans le tableau de décision).

---

## Référence visuelle

Un brand book HTML/PDF complet accompagne ce document :

- **Cover** signature en Schibsted Italic
- **§ 01** — Les 3 polices côte à côte avec leurs rôles
- **§ 02** — Spécimen complet Hanken Grotesk avec ses 7 graisses
- **§ 03** — Spécimen complet Schibsted Grotesk avec ses 6 graisses
- **§ 04** — Spécimen complet JetBrains Mono avec ses 4 graisses
- **§ 05** — La hiérarchie en action sur une page éditoriale ENKI typique
- **§ 06** — Mockup d'une fiche bien (drawer Niveau 3) avec la bulle agent ENKI
- **§ 07** — La citation italique signature : *« Une maison n'est pas un investissement. C'est un endroit où l'on revient. »*
- **§ 08** — Le tableau de décision complet
- **Footer** noir avec licences et sources officielles

Le document HTML est la source de vérité vivante (polices chargées en direct depuis Google Fonts). Le document PDF (10 pages A3 portrait) est la version archivée du 27 avril 2026.

Voir [`04-typography/brand-book.html`](./04-typography/brand-book.html) et le [README du dossier 04-typography](./04-typography/README.md).

---

## Serment de la Couche 4

*ENKI Realty s'engage à ne jamais utiliser Inter par défaut. À ne jamais charger une police sans qu'elle ait un rôle précis. À ne jamais mélanger plus de trois polices dans une page. À ne jamais utiliser une italique pour décorer. À ne jamais utiliser le Bold pour un CTA. À ne jamais payer pour une police si l'alternative gratuite atteint le même registre. À ne jamais oublier que la typographie n'est pas un détail — c'est le premier signal de positionnement que perçoit le visiteur.*

---

## Changelog

### v1.0 — 27 avril 2026

- Création initiale après formulaire structurant Question 1
- Stack validée par Jean-Marie : Hanken Grotesk + Schibsted Grotesk + JetBrains Mono
- Brand book HTML/PDF produit en complément (10 pages A3 portrait)
- Verrou consigné dans le document Verrous constitutionnels (point 1.4)
- Questions Q2 à Q8 du formulaire restent ouvertes pour itérations futures

---

*Document maintenu par Claude Opus 4.7 sous l'autorité de Jean-Marie Delaunay*
*Couche 4 sur 8 du Design System ENKI Realty*
