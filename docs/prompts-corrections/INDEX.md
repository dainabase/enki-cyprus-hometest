# 📚 INDEX DES PROMPTS DE CORRECTION

## Vue d'ensemble

Ce dossier contient **4 phases de corrections** basées sur l'audit Claude Code du 15 décembre 2025.

| Phase | Fichier | Durée | Priorité |
|-------|---------|-------|----------|
| **Phase 1** | `PHASE-1-QUICK-WINS.md` | 2-3h | 🔴 Critique |
| **Phase 2** | `PHASE-2-CORRECTIONS-P1.md` | 1-2 jours | 🔴 Critique |
| **Phase 3** | `PHASE-3-CORRECTIONS-P2.md` | 3-5 jours | 🟠 Important |
| **Phase 4** | `PHASE-4-AMELIORATIONS.md` | 1-2 sem | 🟢 Optionnel |

---

## 🚀 Instructions d'Exécution pour Claude Code

### Prérequis

1. **Connecter Claude Code au repo** :
   ```
   /Users/jean-mariedelaunay/Downloads/enki-cyprus-hometest
   ```

2. **S'assurer que le repo est propre** :
   ```bash
   git status  # Doit être clean
   git pull    # Dernières modifications
   ```

---

## Mode d'Emploi

### Pour chaque phase :

1. **Ouvrir le fichier de la phase** dans Claude Code
2. **Copier tout le contenu** du fichier .md
3. **Coller comme prompt** dans Claude Code
4. **Laisser Claude Code travailler** en mode autonome
5. **Vérifier le rapport** créé à la fin de la phase
6. **Pousser les changements** :
   ```bash
   git push origin main
   ```

---

## Ordre d'Exécution Recommandé

```
Phase 1 (Quick Wins)
    ↓
Phase 2 (Corrections P1) 
    ↓
Phase 3 (Corrections P2)
    ↓
Phase 4 (Améliorations) [Optionnel]
```

**⚠️ NE PAS sauter de phase** - Chaque phase dépend de la précédente.

---

## Fichiers de Rapport

Après chaque phase, Claude Code créera un rapport :

| Phase | Rapport attendu |
|-------|-----------------|
| 1 | `RAPPORT-PHASE-1.md` |
| 2 | `RAPPORT-PHASE-2.md` |
| 3 | `RAPPORT-PHASE-3.md` |
| 4 | `RAPPORT-PHASE-4.md` |

---

## Résumé des Corrections par Phase

### Phase 1 : Quick Wins
- [ ] Supprimer fichiers obsolètes
- [ ] Corriger téléphone placeholder
- [ ] Créer logger conditionnel
- [ ] Documenter Sentry DSN
- [ ] Déplacer GA4 ID en env variable

### Phase 2 : Corrections P1
- [ ] Analyser et implémenter Steps 8-10 ProjectForm
- [ ] Optimiser bundle (lazy imports)
- [ ] Ajouter pagination aux listes admin

### Phase 3 : Corrections P2
- [ ] Aligner types Building avec DB
- [ ] Corriger enum building_type
- [ ] Ajouter queryKeys aux invalidateQueries
- [ ] Remplacer console.log par logger
- [ ] Éliminer types `any`
- [ ] Ajouter compression images

### Phase 4 : Améliorations
- [ ] Compléter traductions de.json/nl.json
- [ ] Migrer textes hardcodés vers i18n
- [ ] Unifier animations (framer-motion)
- [ ] Lazy loading images
- [ ] Virtualisation listes longues
- [ ] CSP headers

---

## En Cas de Problème

Si Claude Code rencontre un blocage :

1. **Lire l'erreur** dans le terminal
2. **Consulter le rapport d'audit** : `/docs/audits/AUDIT_CLAUDE_CODE_15DEC2025.md`
3. **Vérifier les fichiers** mentionnés dans l'erreur
4. **Revenir en arrière si nécessaire** :
   ```bash
   git checkout -- [fichier]  # Annuler modifications d'un fichier
   git reset --hard HEAD~1    # Annuler dernier commit
   ```

---

## Contact

Pour toute question sur ces prompts :
- Consulter d'abord le rapport d'audit original
- Vérifier la documentation dans `/docs/`

---

**Bon courage ! 🚀**
