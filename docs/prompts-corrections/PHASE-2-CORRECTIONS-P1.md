# 🔧 PHASE 2 : CORRECTIONS CRITIQUES P1 (1-2 jours)

## ⚠️ CONTEXTE

Tu travailles sur le projet **ENKI Reality Cyprus**.
- **Repo local** : `/Users/jean-mariedelaunay/Downloads/enki-cyprus-hometest`
- **Stack** : React 19 + TypeScript + Vite + Tailwind + Supabase
- **Rapport d'audit** : `/docs/audits/AUDIT_CLAUDE_CODE_15DEC2025.md`
- **Prérequis** : Phase 1 complétée

---

## 🎯 OBJECTIF DE CETTE PHASE

Corriger les **3 erreurs critiques P1** identifiées dans l'audit :
1. ERR-013 : Steps 8-10 ProjectForm non implémentés
2. ERR-008 : Bundle size non optimisé
3. ERR-009 : Pagination manquante sur listes admin

**Durée estimée** : 1-2 jours
**Commits** : Un commit par tâche majeure

---

## 📋 TÂCHES À RÉALISER

### TÂCHE 2.1 : Analyser les Steps TODO du ProjectForm

**Fichier** : `src/components/admin/ProjectFormSteps.tsx`
**Lignes** : ~3322-3326

**Action ANALYSE UNIQUEMENT** :
1. Lire le fichier ProjectFormSteps.tsx
2. Identifier les steps 8, 9, 10
3. Comprendre ce qu'ils sont censés contenir
4. Documenter dans le rapport

**NE PAS IMPLÉMENTER** dans cette tâche - juste analyser et documenter.

**Questions à répondre** :
- Quels sont les noms des steps 8, 9, 10 ?
- Quel contenu est attendu ?
- Y a-t-il un schema Zod pour ces steps ?
- Y a-t-il des champs DB correspondants ?

**Livrable** : Section dans le rapport avec analyse complète

---

### TÂCHE 2.2 : Implémenter Step 8 (si applicable)

**Prérequis** : Tâche 2.1 complétée

**Si le Step 8 est identifié** :
1. Créer le composant pour le step 8
2. Ajouter les champs de formulaire nécessaires
3. Connecter au schema Zod existant
4. Tester la navigation entre steps

**Pattern à suivre** (basé sur steps existants) :
```typescript
// Exemple de structure step
const Step8Content = () => {
  const { control, formState: { errors } } = useFormContext();
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Titre Step 8</h3>
      {/* Champs du formulaire */}
    </div>
  );
};
```

**Commit** : `feat(admin): implement ProjectForm step 8 - [NOM DU STEP]`

---

### TÂCHE 2.3 : Implémenter Step 9 (si applicable)

**Même approche que Step 8**

**Commit** : `feat(admin): implement ProjectForm step 9 - [NOM DU STEP]`

---

### TÂCHE 2.4 : Implémenter Step 10 (si applicable)

**Même approche que Step 8**

**Commit** : `feat(admin): implement ProjectForm step 10 - [NOM DU STEP]`

---

### TÂCHE 2.5 : Optimiser les imports lourds (Bundle Size)

**Problème** : ERR-008 - Bundle size non optimisé

**Dépendances lourdes identifiées** :
- `framer-motion` (12.23.22)
- `gsap` (3.13.0)
- `recharts` (3.1.2)
- `xlsx` (0.18.5)
- `pdfmake` (0.2.20)

**Action** :

1. **Identifier où ces dépendances sont importées**
```bash
grep -r "from 'framer-motion'" src/
grep -r "from 'gsap'" src/
grep -r "from 'recharts'" src/
grep -r "from 'xlsx'" src/
grep -r "from 'pdfmake'" src/
```

2. **Convertir en imports dynamiques** là où c'est possible :

```typescript
// AVANT (import statique)
import { motion } from 'framer-motion';

// APRÈS (lazy load si composant entier)
const MotionComponent = lazy(() => import('./MotionComponent'));

// OU pour des fonctions utilitaires (xlsx, pdfmake)
const exportToExcel = async (data: unknown[]) => {
  const XLSX = await import('xlsx');
  // utiliser XLSX
};
```

3. **Pour recharts** - Vérifier si utilisé uniquement dans admin/analytics :
   - Si oui, le composant parent devrait déjà être lazy-loaded
   - Sinon, créer un wrapper lazy

**Commit** : `perf: lazy load heavy dependencies (xlsx, pdfmake, gsap)`

---

### TÂCHE 2.6 : Ajouter la pagination aux listes admin

**Problème** : ERR-009 - Pas de pagination sur certaines listes

**Fichiers à vérifier** :
- `src/pages/admin/AdminProjects.tsx`
- `src/pages/admin/AdminBuildings.tsx`
- `src/pages/admin/AdminProperties.tsx`
- `src/pages/admin/AdminDevelopers.tsx`
- `src/pages/admin/AdminLeads.tsx`

**Pour chaque fichier** :

1. **Vérifier si pagination existe** :
   - Chercher `page`, `pageSize`, `offset`, `limit`
   - Chercher composant `Pagination` de shadcn/ui

2. **Si pagination manquante, implémenter** :

```typescript
// Hook de pagination
const [page, setPage] = useState(1);
const pageSize = 25;

// Query avec pagination
const { data, isLoading } = useQuery({
  queryKey: ['items', page, pageSize],
  queryFn: async () => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    const { data, error, count } = await supabase
      .from('table')
      .select('*', { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { items: data, total: count };
  },
});

// Composant pagination (shadcn/ui)
<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious 
        onClick={() => setPage(p => Math.max(1, p - 1))}
        disabled={page === 1}
      />
    </PaginationItem>
    <PaginationItem>
      <span>Page {page} sur {Math.ceil((data?.total || 0) / pageSize)}</span>
    </PaginationItem>
    <PaginationItem>
      <PaginationNext 
        onClick={() => setPage(p => p + 1)}
        disabled={!data || page * pageSize >= data.total}
      />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

3. **Créer un hook réutilisable si plusieurs pages ont besoin** :

```typescript
// src/hooks/usePagination.ts
export const usePagination = (initialPage = 1, initialPageSize = 25) => {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const nextPage = () => setPage(p => p + 1);
  const prevPage = () => setPage(p => Math.max(1, p - 1));
  const goToPage = (p: number) => setPage(p);

  return { page, pageSize, from, to, nextPage, prevPage, goToPage, setPageSize };
};
```

**Commit par fichier** : `feat(admin): add pagination to Admin[Entity] list`

---

## ✅ CHECKLIST DE FIN DE PHASE

Avant de terminer, vérifie :

- [ ] Steps 8-10 analysés et documentés
- [ ] Steps implémentés (si contenu identifié)
- [ ] Imports lourds convertis en lazy/dynamic
- [ ] Pagination ajoutée sur toutes les listes admin
- [ ] `npm run build` passe sans erreur
- [ ] Tester navigation dans le formulaire projet
- [ ] Tester pagination sur chaque liste

---

## 📝 RAPPORT DE FIN DE PHASE

Crée un fichier `/docs/prompts-corrections/RAPPORT-PHASE-2.md` avec :

```markdown
# Rapport Phase 2 - Corrections Critiques P1

**Date** : [DATE]
**Durée** : [DURÉE]

## ERR-013 : ProjectForm Steps

### Analyse des Steps TODO
- Step 8 : [NOM] - [DESCRIPTION]
- Step 9 : [NOM] - [DESCRIPTION]
- Step 10 : [NOM] - [DESCRIPTION]

### Implémentation
- Step 8 : [FAIT/NON FAIT + détails]
- Step 9 : [FAIT/NON FAIT + détails]
- Step 10 : [FAIT/NON FAIT + détails]

## ERR-008 : Bundle Size

### Dépendances optimisées
| Dépendance | Avant | Après | Méthode |
|------------|-------|-------|---------|
| xlsx | statique | dynamique | import() |
| pdfmake | statique | dynamique | import() |
| gsap | statique | [?] | [?] |

## ERR-009 : Pagination

### Pages avec pagination ajoutée
- [ ] AdminProjects : [FAIT/DÉJÀ PRÉSENT]
- [ ] AdminBuildings : [FAIT/DÉJÀ PRÉSENT]
- [ ] AdminProperties : [FAIT/DÉJÀ PRÉSENT]
- [ ] AdminDevelopers : [FAIT/DÉJÀ PRÉSENT]
- [ ] AdminLeads : [FAIT/DÉJÀ PRÉSENT]

## Commits Effectués

1. [hash] message
2. [hash] message
...

## Problèmes Rencontrés

[Liste des problèmes]

## Notes pour Phase 3

[Observations]
```

---

## 🚫 INTERDICTIONS

- ❌ NE PAS modifier le design/styling
- ❌ NE PAS changer la structure des tables DB
- ❌ NE PAS supprimer de fonctionnalités existantes
- ❌ NE PAS ajouter de nouvelles dépendances npm
- ❌ NE PAS modifier les fichiers de migration SQL

---

**COMMENCE PAR LA TÂCHE 2.1 (ANALYSE) AVANT TOUTE IMPLÉMENTATION**
