# 05 Color Lab — Laboratoire visuel

> Archive du processus de validation de la Couche 5 Color System.

Ce dossier contient les fichiers HTML interactifs produits pendant les sessions de design des 27 et 28 avril 2026. Ils ne font pas partie du design system officiel, mais ils racontent **comment les décisions ont été prises** et servent de référence pour comprendre la genèse de la palette.

## Document officiel de la Couche 5

Pour la documentation officielle et opposable, voir `../05-color-system.md`.

## Structure

```
05-color-lab/
├── README.md                         ← ce fichier
├── brand-book.html                   ← brand book v1 (rejeté le 28 avril 2026)
├── build.py                          ← script Python du brand book v1
├── assets/                           ← assets du brand book v1
└── v3/                               ← exploration du 28 avril 2026
    ├── assets/
    ├── brand-book.html               ← v3 du brand book Claude Code
    ├── nuancier-bleus.html           ← 8 bleus testés
    ├── palette-jm-validated.html     ← Linen+Aero+Columbia+Chamoisée
    ├── declinaisons-fond.html        ← 6 fonds crèmes (B4 retenu)
    ├── couleurs-sources.html         ← 6 couleurs sources nues
    ├── round-critique.html           ← 4 Aero + Encre (A2 retenu)
    ├── columbia-vs-aero100.html      ← Aero-100 retenu
    ├── preview-fullscreen.html       ← preview hero (rejetée)
    ├── dark-bg-candidates.html       ← 3 fonds dark (D2 retenu)
    └── dark-tokens-complete.html     ← 7 tokens dark complets (validés)
```

## Chronologie courte

**27 avril 2026 (matin)** — Production du brand book v1 (`brand-book.html` racine + `build.py` + `assets/`). 9 palettes superficielles, layout sous-investi.

**28 avril 2026 (matin)** — Brand book v1 rejeté par Jean-Marie. Pivot vers une approche Experience-First. Production du dossier `v3/` avec une exploration méthodique et itérative.

**28 avril 2026 (après-midi)** — Couche 5 verrouillée :
- Light mode validé (papier bible, Aero méditerranéen, Chamoisée, Aero-100 dérivé)
- Dark mode validé (encre sombre, Aero éclairci, Chamoisée éclaircie)
- Échelles 50→950 générées (33 nuances OKLCH)

## Comment consulter

Pour ouvrir un fichier HTML interactif :

```bash
# Depuis la racine du repo
open docs/design-system/05-color-lab/v3/round-critique.html
```

Les fichiers sont autonomes (CSS et JS inline, polices via Google Fonts). Aucune dépendance.

## Documentation Notion associée

- **Couche 5 — Page principale** : `34f8c7bb-2515-8159-a40a-e74dad3bf1c1`
- **Couche 5 LIGHT MODE verrouillée** : `3508c7bb-2515-8186-a99e-cdd48648561d`
- **Couche 5 ENTIÈREMENT verrouillée (Light + Dark)** : `3508c7bb-2515-81c4-acfd-fd496769cece`
- **Échelles 50→950 (33 nuances OKLCH)** : `3508c7bb-2515-819f-8525-dd871236564a`

---

*Archive de processus. Ne pas modifier — ces fichiers sont des références historiques.*
