# 🚀 PHASE 1 : QUICK WINS (2-3 heures)

## ⚠️ CONTEXTE

Tu travailles sur le projet **ENKI Reality Cyprus**.
- **Repo local** : `/Users/jean-mariedelaunay/Downloads/enki-cyprus-hometest`
- **Stack** : React 19 + TypeScript + Vite + Tailwind + Supabase
- **Rapport d'audit** : `/docs/audits/AUDIT_CLAUDE_CODE_15DEC2025.md`

---

## 🎯 OBJECTIF DE CETTE PHASE

Corriger les problèmes simples et rapides identifiés dans l'audit.
**Durée estimée** : 2-3 heures
**Commits** : Faire UN commit par correction avec message descriptif

---

## 📋 TÂCHES À RÉALISER

### TÂCHE 1.1 : Supprimer les fichiers obsolètes

**Fichiers à supprimer** :
```
src/components/layout/NavbarOLD.tsx
src/pages/Projects-Old-Backup.tsx (si existe)
```

**Action** :
1. Vérifier que ces fichiers existent
2. Vérifier qu'ils ne sont PAS importés ailleurs (grep/search)
3. Si non importés → Supprimer
4. Si importés → NE PAS supprimer, noter dans le rapport

**Commit** : `chore: remove obsolete files (NavbarOLD, Projects-Old-Backup)`

---

### TÂCHE 1.2 : Corriger le téléphone placeholder

**Fichier** : `src/components/seo/SEOHead.tsx` (ou similaire)
**Ligne approximative** : ~71

**Problème** :
```typescript
"telephone": "+357-XX-XXXXXX" // Placeholder non remplacé
```

**Correction** :
```typescript
"telephone": "+357-25-123456" // Numéro Enki Reality (temporaire)
```

**Note** : Si tu ne trouves pas de vrai numéro dans le projet, utilise un format valide chypriote.

**Commit** : `fix: replace phone placeholder in SEOHead with valid format`

---

### TÂCHE 1.3 : Conditionner les console.log en production

**Problème** : 269 console.error/warn qui s'affichent en production

**Action** :
1. Créer un utilitaire de logging conditionnel s'il n'existe pas
2. Fichier : `src/lib/logger.ts`

```typescript
// src/lib/logger.ts
const isDev = import.meta.env.DEV;

export const logger = {
  log: (...args: unknown[]) => {
    if (isDev) console.log(...args);
  },
  warn: (...args: unknown[]) => {
    if (isDev) console.warn(...args);
  },
  error: (...args: unknown[]) => {
    // Les erreurs restent visibles en prod pour debug
    console.error(...args);
  },
  debug: (...args: unknown[]) => {
    if (isDev) console.debug(...args);
  },
};

export default logger;
```

**NE PAS remplacer tous les console.log maintenant** - juste créer l'utilitaire.
Les remplacements seront faits progressivement.

**Commit** : `feat: add conditional logger utility for production`

---

### TÂCHE 1.4 : Vérifier/Configurer Sentry DSN

**Fichier à vérifier** : `src/lib/sentry.ts` ou `src/lib/monitoring.ts` ou `vite.config.ts`

**Action** :
1. Chercher où Sentry est configuré
2. Vérifier si `VITE_SENTRY_DSN` est utilisé
3. Si la variable existe mais est vide, ajouter un commentaire explicatif
4. Mettre à jour `.env.example` si nécessaire

**Dans `.env.example`**, s'assurer que cette ligne existe :
```env
VITE_SENTRY_DSN=# Optionnel - DSN Sentry pour monitoring erreurs production
```

**Commit** : `docs: document Sentry DSN configuration in .env.example`

---

### TÂCHE 1.5 : Vérifier GA4 ID hardcodé

**Fichier** : `src/lib/analytics.ts` ou similaire
**Ligne** : ~6

**Problème** : GA4 ID potentiellement hardcodé

**Action** :
1. Vérifier si `GA4_ID` ou `G-XXXXXXXX` est hardcodé
2. Si oui, remplacer par variable d'environnement :

```typescript
// AVANT (problème)
const GA4_ID = 'G-XXXXXXXXXX';

// APRÈS (solution)
const GA4_ID = import.meta.env.VITE_GA4_ID || '';
```

3. Mettre à jour `.env.example` :
```env
VITE_GA4_ID=# Google Analytics 4 Measurement ID (G-XXXXXXXXXX)
```

**Commit** : `fix: move GA4 ID to environment variable`

---

## ✅ CHECKLIST DE FIN DE PHASE

Avant de terminer, vérifie :

- [ ] Fichiers obsolètes supprimés (ou documenté pourquoi non)
- [ ] Téléphone placeholder corrigé
- [ ] Logger utilitaire créé (`src/lib/logger.ts`)
- [ ] Sentry DSN documenté dans `.env.example`
- [ ] GA4 ID dans variable d'environnement
- [ ] Tous les commits sont faits avec messages clairs
- [ ] `npm run build` passe sans erreur

---

## 📝 RAPPORT DE FIN DE PHASE

Crée un fichier `/docs/prompts-corrections/RAPPORT-PHASE-1.md` avec :

```markdown
# Rapport Phase 1 - Quick Wins

**Date** : [DATE]
**Durée** : [DURÉE]

## Tâches Complétées

- [ ] 1.1 Fichiers obsolètes : [FAIT/NON FAIT + raison]
- [ ] 1.2 Téléphone placeholder : [FAIT/NON FAIT]
- [ ] 1.3 Logger utility : [FAIT/NON FAIT]
- [ ] 1.4 Sentry DSN : [FAIT/NON FAIT]
- [ ] 1.5 GA4 ID : [FAIT/NON FAIT]

## Commits Effectués

1. [hash] message
2. [hash] message
...

## Problèmes Rencontrés

[Liste des problèmes si applicable]

## Notes pour Phase 2

[Observations utiles]
```

---

## 🚫 INTERDICTIONS

- ❌ NE PAS modifier la logique métier
- ❌ NE PAS refactorer du code non listé
- ❌ NE PAS ajouter de nouvelles dépendances
- ❌ NE PAS toucher aux migrations SQL
- ❌ NE PAS modifier les composants UI existants

---

**COMMENCE PAR LA TÂCHE 1.1 ET PROGRESSE SÉQUENTIELLEMENT**
