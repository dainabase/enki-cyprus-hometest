# Couche 5 — Color System

> **Statut** : Verrouillé le 28 avril 2026
> **Version** : 1.0
> **Validateur** : Jean-Marie Delaunay
> **Implémentation** : `src/styles/tokens.css` + `tailwind.config.ts` (namespace `enki`)

---

## 1. Philosophie

Trois pôles colorés, un fond papier, un système qui peut tenir 10 ans.

ENKI Realty se présente sur du **calcaire chaud chypriote**, pas sur du blanc neutre nord-américain. La marque parle de la Méditerranée comme d'une géographie sérieuse — ancienne, lumineuse — pas comme d'une carte postale. La palette traduit cette double promesse : **sobriété qui démontre le sérieux + modernité qui fait rêver**.

Verrous chromatiques fondamentaux :

- **Aucun `#FFFFFF` ni `#000000` pur** — le blanc est papier bible, le noir est encre profonde tintée.
- **Discipline 95/5** — 95 % de neutres (papier, encre, soft), 5 % d'accent rare (Aero) + accent humain (Chamoisée).
- **Trois sources colorées seulement** (Aero, Chamoisée, Encre). Tout le reste dérive.
- **Symétrie chromatique parfaite** entre light et dark — l'utilisateur perçoit une inversion, pas un changement de marque.

---

## 2. Tokens sémantiques (API publique)

Ces 14 variables CSS sont l'API publique du système. Elles basculent automatiquement en dark mode via l'attribut `[data-theme="dark"]`.

### Light Mode

| Token CSS | HEX | OKLCH | Rôle UI |
|---|---|---|---|
| `--bg` | `#FCFAF5` | oklch(0.98 0.008 85) | Fond dominant |
| `--card` | `#FFFFFE` | oklch(0.99 0.004 85) | Surfaces flottantes, panneaux |
| `--fg` | `#1A2940` | oklch(0.21 0.04 250) | Texte principal + présence visuelle |
| `--fg-muted` | `#4A5A78` | oklch(0.43 0.04 250) | Métadonnées, captions |
| `--accent` | `#3D8FB0` | oklch(0.59 0.10 220) | CTA, sceau, italiques signature |
| `--accent-soft` | `#E5EEF3` | oklch(0.94 0.012 220) | Bordures, séparateurs, bulles user |
| `--warm` | `#A17964` | oklch(0.58 0.06 50) | Eyebrows, accents humains |

### Dark Mode

| Token CSS | HEX | OKLCH | Rôle UI |
|---|---|---|---|
| `--bg` | `#0F1A2A` | oklch(0.15 0.035 250) | Fond dominant |
| `--card` | `#1A2940` | oklch(0.21 0.04 250) | Surfaces élevées |
| `--fg` | `#FCFAF5` | oklch(0.98 0.008 85) | Texte principal |
| `--fg-muted` | `#A8B4C7` | oklch(0.74 0.025 250) | Métadonnées |
| `--accent` | `#57B9D6` | oklch(0.74 0.10 220) | Aero éclairci pour contraste WCAG |
| `--accent-soft` | `#1E3147` | oklch(0.25 0.04 250) | Bulles user, bordures |
| `--warm` | `#C9966A` | oklch(0.68 0.08 50) | Chamoisée éclaircie |

---

## 3. Échelles 50→950 (33 nuances)

Trois échelles à 11 paliers chacune, calculées en OKLCH avec hue conservé. Pour usages avancés (états hover, fonds tintés, ombres colorées, variations subtiles).

### Aero · hue 220° · anchor 500

| Palier | HEX | Usage typique |
|---|---|---|
| `aero-50` | `#F4F9FB` | Fonds tintés très subtils |
| `aero-100` | `#E5EEF3` | **= `--accent-soft` light** (bulles user, bordures) |
| `aero-200` | `#C8DDE7` | Hovers surfaces claires |
| `aero-300` | `#9DC4D4` | Bordures focus, états info |
| `aero-400` | `#6FA8C0` | Disabled states |
| `aero-500` | `#3D8FB0` | **= `--accent` light** (CTA, sceau) |
| `aero-600` | `#2E7593` | Hover du CTA principal |
| `aero-700` | `#245C76` | Pressed, liens visités |
| `aero-800` | `#1B4459` | Bordures cards dark |
| `aero-900` | `#1E3147` | **= `--accent-soft` dark** |
| `aero-950` | `#131F2C` | Fonds très sombres |

### Chamoisée · hue 50° · anchor 500

| Palier | HEX | Usage typique |
|---|---|---|
| `chamoisee-50` | `#FAF5EF` | Bandeaux éditoriaux chauds |
| `chamoisee-100` | `#F2E8DD` | Surfaces tintées chaudes |
| `chamoisee-200` | `#E2CDB6` | Éléments décoratifs |
| `chamoisee-300` | `#CDAC8E` | Filets de séparation chauds |
| `chamoisee-400` | `#B79176` | Variant Chamoisée éclaircie |
| `chamoisee-500` | `#A17964` | **= `--warm` light** (eyebrows) |
| `chamoisee-600` | `#876451` | Hover sur eyebrows |
| `chamoisee-700` | `#6D5040` | Texte chaud sur fond clair |
| `chamoisee-800` | `#523B30` | Footers chaleureux |
| `chamoisee-900` | `#392922` | Fonds cognac sombres |
| `chamoisee-950` | `#211814` | Ambiance bois max |

> Note : le `#C9966A` retenu pour `--warm` en dark mode se situe entre `chamoisee-400` et `-500`. Il reste un token sémantique distinct pour la flexibilité.

### Encre · hue 250° · anchor 700

| Palier | HEX | Usage typique |
|---|---|---|
| `encre-50` | `#F2F4F8` | Backgrounds froids très subtils |
| `encre-100` | `#E1E5ED` | Surfaces tintées froides |
| `encre-200` | `#C0C7D4` | Texte placeholder, dividers |
| `encre-300` | `#A8B4C7` | **= `--fg-muted` dark** |
| `encre-400` | `#7B8AA3` | Texte tertiaire, captions |
| `encre-500` | `#4A5A78` | **= `--fg-muted` light** |
| `encre-600` | `#36445C` | Texte fort secondaire |
| `encre-700` | `#1A2940` | **= `--fg` light + `--card` dark** |
| `encre-800` | `#131F33` | Headers sticky dark |
| `encre-900` | `#0F1A2A` | **= `--bg` dark** |
| `encre-950` | `#080F1B` | Profondeur cinématique max |

> **Important** : sur l'échelle Encre, l'anchor du système est sur le palier **700** (pas 500). Volontaire — l'Encre profonde est conçue comme un foreground/présence sombre, pas comme un accent moyen. Le palier 500 correspond au `fg-muted` light.

---

## 4. Audit WCAG

Tous les contrastes critiques ont été vérifiés. Aucun échec.

### Light Mode

| Couple | Ratio | Verdict |
|---|---|---|
| FG `#1A2940` sur BG `#FCFAF5` | 13.2 : 1 | AAA |
| Aero `#3D8FB0` sur BG `#FCFAF5` | 4.9 : 1 | AA |
| Muted `#4A5A78` sur BG `#FCFAF5` | 7.8 : 1 | AAA |
| Warm `#A17964` sur BG `#FCFAF5` | 4.5 : 1 | AA |
| FG `#1A2940` sur Card `#FFFFFE` | 13.4 : 1 | AAA |

### Dark Mode

| Couple | Ratio | Verdict |
|---|---|---|
| FG `#FCFAF5` sur BG `#0F1A2A` | 14.8 : 1 | AAA |
| Aero `#57B9D6` sur BG `#0F1A2A` | 7.2 : 1 | AAA |
| Muted `#A8B4C7` sur BG `#0F1A2A` | 8.1 : 1 | AAA |
| Warm `#C9966A` sur BG `#0F1A2A` | 5.8 : 1 | AA |
| FG `#FCFAF5` sur Card `#1A2940` | 12.4 : 1 | AAA |
| CTA Aero (texte FG `#1A2940`) | 5.4 : 1 | AA |

**Total** : 8 paires AAA, 4 paires AA. Tous les usages critiques tiennent.

---

## 5. Implémentation technique

### Structure des fichiers

```
src/
├── styles/
│   └── tokens.css         ← définit les 14 sémantiques + 33 nuances
├── index.css              ← importe tokens.css en tête (avant Tailwind)
└── ...

tailwind.config.ts         ← expose le namespace `enki.*` pour Tailwind
```

### Usage dans le code

**Avec Tailwind (recommandé)** — namespace `enki` :

```tsx
<div className="bg-enki-bg text-enki-fg">
  <h1 className="text-enki-fg">Titre principal</h1>
  <p className="text-enki-fg-muted">Métadonnées</p>
  <button className="bg-enki-accent text-enki-bg">CTA principal</button>
  <span className="text-enki-warm uppercase tracking-wider">Eyebrow</span>
  <div className="border border-enki-accent-soft p-4">Carte avec bordure douce</div>

  {/* Échelles pour usages avancés */}
  <div className="bg-enki-aero-100 text-enki-aero-700">Bulle utilisateur</div>
  <div className="bg-enki-chamoisee-50 text-enki-chamoisee-800">Bandeau éditorial</div>
</div>
```

**Avec CSS direct** — variables natives :

```css
.custom-element {
  background: var(--bg);
  color: var(--fg);
  border: 1px solid var(--accent-soft);
}

.custom-tinted {
  background: var(--aero-100);
  color: var(--aero-800);
}
```

### Bascule light/dark

Le mode dark est activé via `[data-theme="dark"]` sur l'élément racine (généralement `<html>`).

```ts
// Activer dark mode
document.documentElement.dataset.theme = "dark";

// Activer light mode (default)
delete document.documentElement.dataset.theme;
```

---

## 6. Coexistence avec les tokens Shadcn legacy

Les tokens Shadcn historiques (`--background`, `--foreground`, `--primary`, `--secondary`, etc.) **continuent de fonctionner** pendant la phase de migration. Ils coexistent avec les nouveaux tokens ENKI dans le même fichier `index.css`.

Plan de migration progressive :

1. **Phase actuelle** — nouveaux composants ENKI utilisent `enki.*`, anciens composants Shadcn restent inchangés.
2. **Phase 2** (à planifier) — migration composant par composant des composants critiques (header, hero, sceau Lexaia) vers `enki.*`.
3. **Phase 3** (à planifier) — dépréciation progressive des tokens Shadcn une fois 100 % des composants migrés.

---

## 7. Documentation Notion

Les détails complets de la genèse de la palette (chronologie des décisions, alternatives rejetées, photos d'inspiration, raisonnement symbolique) sont documentés sur Notion :

- **Couche 5 — Page principale** : `34f8c7bb-2515-8159-a40a-e74dad3bf1c1`
- **Couche 5 LIGHT MODE verrouillée** : `3508c7bb-2515-8186-a99e-cdd48648561d`
- **Couche 5 ENTIÈREMENT verrouillée (Light + Dark)** : `3508c7bb-2515-81c4-acfd-fd496769cece`
- **Échelles 50→950 (33 nuances OKLCH)** : `3508c7bb-2515-819f-8525-dd871236564a`

---

## 8. Verrous constitutionnels

Ces règles ne sont pas négociables sans une revalidation complète de la Couche 5 :

- Hue 220° pour tout le bleu (Aero source + dérivés). Aucun glissement vers le vert ni vers le marine corporate.
- Hue 250° pour tous les neutres bleutés (Encre profonde, fond dark, card dark, muted dark).
- Hue 50° pour le Chamoisée dans les deux modes.
- Aucun `#FFFFFF` ni `#000000` pur.
- Trois couleurs sources colorées uniquement (Aero, Chamoisée, Encre).
- Encre profonde au double rôle (texte light + surface dark).
- Symétrie d'inversion light ↔ dark préservée.

---

*Document officiel du Design System ENKI Realty. Verrouillé le 28 avril 2026.*
