# Design System ENKI Realty

> **Source de vérité** : ce dossier contient les documents **validés** du design system ENKI Realty. Les documents en cours de rédaction ou en review vivent sur Notion (war room PropTech) jusqu'à validation explicite par Jean-Marie.

---

## Règle de gouvernance Notion ↔ GitHub

ENKI Realty maintient deux espaces de documentation pour son design system, avec des rôles distincts et complémentaires :

### Notion = espace de travail vivant

Les documents en cours de rédaction, en debate, en review, ou en attente de validation finale **vivent uniquement sur Notion** (sous-hub Couches du Design System de la war room PropTech). Notion est l'espace où :
- On rédige les premières versions
- On itère après feedback de Jean-Marie
- On débat les arbitrages
- On lie les pages entre elles via la hiérarchie de sous-hubs
- On consigne les versions en review

Tout document estampillé "v0.x", "en review", "à retravailler", "EN ATTENTE", ou "PROVISOIRE" reste sur Notion sans être copié ici.

### GitHub = artefacts validés

Un document n'arrive dans ce dossier qu'après **validation explicite par Jean-Marie**. Le passage de Notion à GitHub est un acte de validation officiel : il signale que le document est suffisamment stable pour être traité comme référence opposable.

Conséquence pratique : si tu lis un document dans `docs/design-system/`, tu peux supposer qu'il a été validé. Si tu cherches un document sur Notion mais ne le trouves pas ici, c'est qu'il est encore en review.

### Pourquoi cette discipline

- **Évite la désync entre Notion et GitHub.** Si on synchronisait tout en permanence, les deux espaces divergeraient au moindre oubli, et on perdrait confiance dans les deux.
- **Force une discipline de validation.** Passer un document de Notion au repo demande un acte explicite de Jean-Marie. Pas de glissement insidieux.
- **Repo lisible pour un futur dev.** Quand un développeur arrive sur le projet et lit `docs/design-system/`, il sait que ce qu'il voit est de l'acté, pas du brouillon.
- **Pas de dette technique cachée.** Le repo ne porte que ce qui est censé tenir 5-10 ans.

---

## État actuel des couches (au 27 avril 2026)

Le design system ENKI Realty se construit en **8 couches séquentielles**, chacune devant être justifiable par retour direct au Brand Manifesto. Aucun saut. Chaque couche appuie sur la précédente.

| Couche | Statut | Fichier ici | Page Notion |
|---|---|---|---|
| 1 — Brand Manifesto | ✅ v1.2 synchronisée | [`01-brand-manifesto.md`](./01-brand-manifesto.md) | [Notion](https://www.notion.so/34d8c7bb251581498d58cbc26bb35e2a) |
| 2 — Conversational Tier | 📝 v2.1 en review | — | [Notion](https://www.notion.so/34d8c7bb25158127ae7cf816a051b9e8) |
| 3 — Visual Principles | 📝 v1.0 en review | — | [Notion](https://www.notion.so/34e8c7bb25158110a08cdb8efa55209e) |
| 4 — Typography System | ✅ v1.0 VALIDÉE | [`04-typography-system.md`](./04-typography-system.md) | [Notion](https://www.notion.so/34f8c7bb251581ba9b75e54f5bb437fc) |
| 5 — Color System | ⏳ à venir | — | — |
| 6 — Motion & Interaction Principles | ⏳ à venir | — | — |
| 7 — Photography & Imagery Direction | ⏳ à venir | — | — |
| 8 — Component Tokens | ⏳ à venir | — | — |

### Documents complémentaires en review (non synchronisés)

- **Architecture Commerciale & CRM Commission Tracking v1.0** — s'attache à la Couche 2. Architecture B2B2C, passage de main, CRM world-class, tracking anti-fraude. Sur Notion uniquement tant que pas validé.
- **Experience Architecture v1.0** — s'attache à la Couche 3. Agent omniprésent en 3 états, hero conversationnel central, modèle "conversation continue avec calques", mémorabilité comme objectif stratégique. Sur Notion uniquement tant que pas validé.

---

## Structure du dossier

```
docs/design-system/
├── README.md                        # Ce document (règle de gouvernance)
├── 01-brand-manifesto.md            # Couche 1 — pièce-mère, source de tout
├── 04-typography-system.md          # Couche 4 — stack typographique validée
└── 04-typography/                   # Artefacts complémentaires Couche 4
    ├── README.md                    # Guide d'intégration technique
    └── brand-book.html              # Brand book vivant (HTML autonome)
```

---

## Comment contribuer

### Si tu modifies un document validé ici

1. Modifier d'abord la page Notion correspondante (source de vérité éditoriale)
2. Faire valider la modification par Jean-Marie
3. Synchroniser le fichier .md ici
4. Commit avec un message clair de la nature du changement

### Si tu veux ajouter un nouveau document

1. Le créer d'abord sur Notion dans le sous-hub adapté
2. L'itérer en review avec Jean-Marie
3. Une fois VALIDÉ, le synchroniser ici
4. Mettre à jour la table d'état dans ce README

### Si un document devient obsolète

1. Le marquer obsolète sur Notion (ne pas le supprimer)
2. Le retirer d'ici uniquement si une nouvelle version validée le remplace
3. Mettre à jour la table d'état dans ce README

---

## Verrous constitutionnels

Un document de gouvernance dédié sur Notion recense les règles **non-négociables** qui ont émergé au fil des couches : [Verrous constitutionnels](https://www.notion.so/34e8c7bb251581acad91d6b411954ff5).

À consulter en cas de doute sur un arbitrage, ou avant toute proposition de modification structurante d'une couche déjà validée.

---

*Document maintenu par Claude Opus 4.7 sous l'autorité de Jean-Marie Delaunay*
*Dernière mise à jour : 27 avril 2026*
