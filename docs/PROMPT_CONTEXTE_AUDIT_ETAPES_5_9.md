# 📋 PROMPT DE CONTEXTE - REPRISE AUDIT ÉTAPES 5-9

**Date de création :** 9 octobre 2025  
**Statut :** Audit 40% complété (Étapes 1-4) - Prêt pour Étapes 5-9  
**Repository :** dainabase/enki-cyprus-hometest  
**Branch :** main

---

## 🎯 CONTEXTE GÉNÉRAL DU PROJET

### Projet : Enki Reality Cyprus - Inline Expansion System

**Description :**  
Système de recherche et visualisation immobilière pour le marché chypriote. Permet aux utilisateurs de :
- Cliquer "Search" dans le Hero
- Voir un grid de propriétés avec animations
- Expandre une propriété inline pour voir détails/photos/map/fiscal
- Ouvrir l'analyse fiscale Lexaia dans un panel fullscreen
- Naviguer avec un chat mini en sidebar et breadcrumb

**Architecture :**  
Inline expansion (pas de modal), gestion d'état avec usePropertyExpansion hook, animations Framer Motion, responsive 320px→1920px.

**Stack Technique :**
- Frontend : React 19 + TypeScript + Vite
- UI : Tailwind CSS + Shadcn/ui + Framer Motion
- Backend : Supabase (PostgreSQL + Auth + Storage)
- Charts : Recharts
- Validation : React Hook Form + Zod

---

## ✅ CE QUI A ÉTÉ FAIT (AUDIT ÉTAPES 1-4)

### 📊 Progression : 40% du Projet Audité

**Documents créés sur GitHub :**
1. **Rapport d'audit complet** : `docs/AUDIT_ETAPES_1_4.md`
   - 🔗 https://github.com/dainabase/enki-cyprus-hometest/blob/main/docs/AUDIT_ETAPES_1_4.md
   
2. **Issue des actions prioritaires** : Issue #11
   - 🔗 https://github.com/dainabase/enki-cyprus-hometest/issues/11

### 🏆 Résultats de l'Audit (Étapes 1-4)

| Étape | Titre | Note | Commits | Status |
|-------|-------|------|---------|--------|
| **1/10** | Architecture & Préparation | 92/100 ⭐⭐⭐⭐⭐ | 58212e5 | ✅ Validé |
| **2/10** | Property Card Enhanced | 88/100 ⭐⭐⭐⭐ | 20ae669, ea794b8 | ✅ Validé avec recommandations |
| **3/10** | Property Expanded | 90/100 ⭐⭐⭐⭐⭐ | 9b9f639 | ✅ Validé avec recommandations |
| **4/10** | Tab Map + Tab Fiscal | 86/100 ⭐⭐⭐⭐ | 6adfbe4 | ⚠️ Validé avec correctifs requis |

**Note moyenne : 89/100** ⭐⭐⭐⭐

### 🔴 3 Bugs Critiques Identifiés

1. **Google Maps API Key manquante** (Étape 4)
   - Fichier : `src/components/expansion/TabMap.tsx`
   - Impact : 🔴 CRITIQUE - Map ne fonctionne pas

2. **Accessibilité clavier absente** (Étapes 2-3)
   - Fichiers : `PropertyCardEnhanced.tsx`, `PropertyGallery.tsx`
   - Impact : 🔴 CRITIQUE - Non conforme WCAG 2.1

3. **Build time augmenté de +8.14s** (Étape 4)
   - Cause : Recharts non lazy loaded
   - Impact : 🟠 IMPORTANT - Performance dégradée

### 📈 Métriques (Étapes 1-4)

- **Fichiers créés :** 19
- **Fichiers modifiés :** 5
- **Lignes ajoutées :** +2,268
- **Build time final :** 44.95s
- **Erreurs TypeScript :** 0 ✅
- **Bundle size :** ~183 kB

---

## 🎯 MISSION POUR LA NOUVELLE CONVERSATION

### Objectif Principal

**Auditer les 5 étapes restantes (5-9) pour avoir la vue d'ensemble complète du projet (100%)**

### Étapes à Auditer (60% Restant)

| Étape | Titre | Commits | Fichiers Attendus |
|-------|-------|---------|-------------------|
| **5/10** | Lexaia Panel Fullscreen | 1a16ce1 | LexaiaPanel, FiscalDashboard, CountryComparison, SavingsProjection, TaxStructureRecommendation, ExportPDFButton |
| **6/10** | Chat Mini Mode + Breadcrumb | 2d117c5 | ChatMiniMode, ChatExpandButton, Breadcrumb, ChatHeader |
| **7/10** | Mobile Responsive Optimisation | 4c3f568 | Modifications sur 8+ fichiers (responsive) |
| **8/10** | Animations Polish & Transitions | a0db6e2, 7b971c6 | PropertyCardSkeleton + modifications animations |
| **9/10** | Integration avec Home.tsx | c80f1b9 | Home.tsx, Alternative3.tsx (modifications) |

---

## 📋 MÉTHODOLOGIE D'AUDIT (À SUIVRE)

Pour **CHAQUE étape (5 → 9)**, tu dois :

### 1. Récupérer les Détails du Commit

```
Utilise : github:get_commit avec le SHA de l'étape
Analyse : Files changed, Additions, Deletions
```

### 2. Examiner les Fichiers Clés

```
Utilise : github:get_file_contents pour les fichiers principaux
Mode : 'overview' par défaut, 'full' si nécessaire
Vérifie : Qualité code, respect règles, conventions
```

### 3. Évaluation Structurée

Pour chaque étape, génère un rapport avec cette structure EXACTE :

```markdown
# AUDIT ÉTAPE X/10 : [Titre]

## 📊 Métriques
- Commit: [SHA]
- Fichiers créés: [X]
- Fichiers modifiés: [X]
- Lignes: [+X/-X]
- Build time: [Xs] ([évolution])

## ✅ Points Forts (3-5)
1. [Point fort 1 avec détails]
2. [Point fort 2 avec détails]
...

## ⚠️ Points d'Attention (0-5)
1. [Point attention 1 si applicable]
...

## 🐛 Bugs Potentiels Détectés (0-5)
1. [Bug 1 avec code exemple]
...

## 💡 Recommandations (2-4)
1. [Recommandation 1 avec code exemple]
...

## 🎯 Note Globale: [X/100]

## 📝 Commentaire Final
[Ton avis synthétique - 2-3 phrases]

**Status:** [✅ VALIDÉ / ⚠️ VALIDÉ avec correctifs / ❌ BLOQUÉ]
```

### 4. Critères d'Évaluation

**Points forts (positifs) :**
- Architecture bien pensée
- Performance optimisée
- Code propre et maintenable
- Respect du Design System
- Animations fluides
- UX excellente

**Points d'attention (neutres) :**
- Composants volumineux
- Possibilité de refactoring
- Duplication mineure

**Bugs (négatifs) :**
- Erreurs fonctionnelles
- Problèmes de sécurité
- Non-conformité standards
- Performance dégradée
- Accessibilité manquante

---

## 🔧 OUTILS GITHUB À UTILISER

Tu DOIS utiliser ces outils pour l'audit :

### Outils Principaux

1. **github:list_commits**
   - Pour : Lister les commits si besoin
   - Usage : `github:list_commits(owner, repo, per_page)`

2. **github:get_commit**
   - Pour : Détails d'un commit spécifique
   - Usage : `github:get_commit(owner, repo, sha)`
   - ⚠️ **CRITIQUE** : Toujours utiliser pour chaque étape

3. **github:get_file_contents**
   - Pour : Contenu des fichiers
   - Usage : `github:get_file_contents(owner, repo, path, mode='overview')`
   - Mode 'full' si fichier < 100 lignes

### Paramètres Constants

```
owner: dainabase
repo: enki-cyprus-hometest
branch: main
```

---

## 📊 RAPPORT FINAL À GÉNÉRER

Après avoir audité les étapes 5-9, tu dois créer un **RAPPORT CONSOLIDÉ COMPLET** :

### Structure du Rapport Final

```markdown
# 🔍 AUDIT COMPLET - ÉTAPES 5 À 9 (60%)

## 📊 MÉTRIQUES GLOBALES (ÉTAPES 5-9)
[Tableau récapitulatif]

## AUDIT DÉTAILLÉ
[Une section par étape avec la structure définie]

## 📈 TENDANCES & INSIGHTS (ÉTAPES 5-9)
[Analyse des patterns, tendances, évolution]

## 🏆 CLASSEMENT DES ÉTAPES
[Top 5 des étapes par note]

## 📝 CONCLUSION INTERMÉDIAIRE
[Forces, faiblesses, recommandations]

## 🔗 RAPPORT CONSOLIDÉ GLOBAL (ÉTAPES 1-9)
[Fusion des audits 1-4 et 5-9]

## 📋 PRÉPARATION ÉTAPE 10
[Ce qu'il reste à faire]
```

---

## 🚫 RÈGLES STRICTES À RESPECTER

### Interdictions

❌ Ne JAMAIS inventer ou supposer le contenu d'un fichier  
❌ Ne JAMAIS sauter une étape  
❌ Ne JAMAIS donner une note sans justification détaillée  
❌ Ne JAMAIS oublier d'utiliser les outils GitHub  

### Obligations

✅ TOUJOURS examiner les commits avec github:get_commit  
✅ TOUJOURS lire les fichiers clés avec github:get_file_contents  
✅ TOUJOURS donner des exemples de code pour les bugs/recommandations  
✅ TOUJOURS être précis dans les localisations (fichier:ligne)  
✅ TOUJOURS comparer les métriques (build time, lignes, etc.)  

---

## 🎯 COMMITS À AUDITER (RÉFÉRENCE)

```
ÉTAPE 5 : 1a16ce1 (Lexaia Panel Fullscreen)
ÉTAPE 6 : 2d117c5 (Chat Mini Mode + Breadcrumb)
ÉTAPE 7 : 4c3f568 (Mobile Responsive)
ÉTAPE 8 : a0db6e2, 7b971c6 (Animations Polish)
ÉTAPE 9 : c80f1b9 (Integration Home.tsx)
```

---

## 📁 STRUCTURE ACTUELLE DU PROJET

```
src/
├── components/
│   ├── expansion/
│   │   ├── ExpansionContainer.tsx ⭐ (Container principal)
│   │   ├── PropertyCardEnhanced.tsx
│   │   ├── PropertyCardSkeleton.tsx
│   │   ├── PropertyExpanded.tsx
│   │   ├── PropertyGallery.tsx
│   │   ├── PropertyTabs.tsx
│   │   ├── TabPhotos.tsx
│   │   ├── TabDetails.tsx
│   │   ├── TabMap.tsx ⚠️ (Bug: API key manquante)
│   │   ├── TabFiscal.tsx
│   │   ├── GoldenVisaBadge.tsx
│   │   ├── FiscalPreviewBadge.tsx
│   │   ├── FiscalCalculatorPreview.tsx
│   │   ├── FiscalComparison.tsx
│   │   └── TaxSavingsChart.tsx
│   ├── lexaia/ (À auditer - Étape 5)
│   │   ├── LexaiaPanel.tsx
│   │   ├── LexaiaHeader.tsx
│   │   ├── FiscalDashboard.tsx
│   │   ├── CountryComparison.tsx
│   │   ├── SavingsProjection.tsx
│   │   ├── TaxStructureRecommendation.tsx
│   │   └── ExportPDFButton.tsx
│   ├── chat/ (À auditer - Étape 6)
│   │   ├── ChatMiniMode.tsx
│   │   ├── ChatExpandButton.tsx
│   │   ├── Breadcrumb.tsx
│   │   └── ChatHeader.tsx
│   └── hero/
│       └── Alternative3.tsx (Modifié étape 9)
├── hooks/
│   └── usePropertyExpansion.ts ⭐ (Hook central)
├── types/
│   └── expansion.types.ts
├── data/
│   ├── mockProperties.ts
│   └── mockPointsOfInterest.ts
├── constants/
│   └── expansion.animations.ts
└── pages/
    └── Home.tsx (Modifié étape 9)
```

---

## 📝 EXEMPLE DE PROMPT POUR DÉMARRER

Copie-colle ce prompt dans la nouvelle conversation :

```
Je suis l'Architecte Technique Senior du projet Enki Reality - Inline Expansion.

Nous avons complété l'audit des étapes 1-4 (40% du projet). Les rapports sont disponibles sur GitHub :
- Rapport complet : https://github.com/dainabase/enki-cyprus-hometest/blob/main/docs/AUDIT_ETAPES_1_4.md
- Actions prioritaires : https://github.com/dainabase/enki-cyprus-hometest/issues/11

**Ta mission pour cette conversation :**

Auditer les **5 étapes restantes (5-9)** pour compléter la vue d'ensemble du projet (100%).

**Méthodologie :**

Pour CHAQUE étape (5 → 9) :
1. Utilise `github:get_commit` avec le SHA de l'étape
2. Analyse les fichiers créés/modifiés
3. Utilise `github:get_file_contents` pour examiner les fichiers clés
4. Génère un rapport structuré avec :
   - 📊 Métriques
   - ✅ Points Forts (3-5)
   - ⚠️ Points d'Attention (0-5)
   - 🐛 Bugs Détectés (0-5)
   - 💡 Recommandations (2-4)
   - 🎯 Note Globale (/100)
   - 📝 Commentaire Final

**Étapes à auditer :**

- ✅ ÉTAPE 5/10 : Lexaia Panel Fullscreen (Commit: 1a16ce1)
- ✅ ÉTAPE 6/10 : Chat Mini Mode + Breadcrumb (Commit: 2d117c5)
- ✅ ÉTAPE 7/10 : Mobile Responsive (Commit: 4c3f568)
- ✅ ÉTAPE 8/10 : Animations Polish (Commits: a0db6e2, 7b971c6)
- ✅ ÉTAPE 9/10 : Integration Home.tsx (Commit: c80f1b9)

**Repository :** dainabase/enki-cyprus-hometest
**Branch :** main

**Contexte détaillé :** Lis le fichier `docs/PROMPT_CONTEXTE_AUDIT_ETAPES_5_9.md` sur le repo pour tous les détails.

COMMENCE L'AUDIT DE L'ÉTAPE 5 MAINTENANT ! 🔍
```

---

## 🔗 RESSOURCES IMPORTANTES

### Documents GitHub

1. **Rapport Audit Étapes 1-4**
   - https://github.com/dainabase/enki-cyprus-hometest/blob/main/docs/AUDIT_ETAPES_1_4.md

2. **Issue Actions Prioritaires**
   - https://github.com/dainabase/enki-cyprus-hometest/issues/11

3. **Roadmap Tracking**
   - https://github.com/dainabase/enki-cyprus-hometest/issues/10

4. **Design System** (si besoin)
   - `/docs/ENKI_DESIGN_SYSTEM.md`

### Commits à Auditer

```
5. Lexaia Panel      : 1a16ce1
6. Chat Mini Mode    : 2d117c5
7. Mobile Responsive : 4c3f568
8. Animations Polish : a0db6e2, 7b971c6
9. Integration Home  : c80f1b9
```

---

## ✅ CHECKLIST DE DÉMARRAGE

Avant de commencer l'audit dans la nouvelle conversation, vérifie :

- [ ] Repository accessible : dainabase/enki-cyprus-hometest
- [ ] Branch correcte : main
- [ ] Outils GitHub fonctionnels (get_commit, get_file_contents)
- [ ] Contexte compris (lu ce document)
- [ ] Méthodologie claire (structure de rapport)
- [ ] Prêt à auditer l'étape 5

---

## 🎯 OBJECTIF FINAL

À la fin de l'audit des étapes 5-9, tu devras :

1. ✅ Avoir audité les 5 étapes avec rapports détaillés
2. ✅ Avoir créé un rapport consolidé sur GitHub (docs/AUDIT_ETAPES_5_9.md)
3. ✅ Avoir mis à jour l'issue des actions prioritaires si nouveaux bugs
4. ✅ Avoir une vue d'ensemble complète du projet (étapes 1-9)
5. ✅ Être prêt pour l'étape 10 (Testing & Bug Fixes)

---

**Statut Actuel :** Prêt pour Audit Étapes 5-9 ✅  
**Prochaine Action :** Copier le prompt de démarrage dans une nouvelle conversation  
**Durée Estimée :** 20-30 minutes pour auditer les 5 étapes

**BONNE CHANCE ! 🚀**