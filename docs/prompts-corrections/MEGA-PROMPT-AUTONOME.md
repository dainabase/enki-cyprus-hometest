# 🤖 MISSION AUTONOME COMPLÈTE - CORRECTIONS ENKI REALITY

## ⚠️ INSTRUCTIONS CRITIQUES

Tu es en **mode autonome complet**. Tu dois exécuter TOUTES les corrections sans intervention humaine.

**Repo** : `/Users/jean-mariedelaunay/Downloads/enki-cyprus-hometest`
**Rapport d'audit** : `/docs/audits/AUDIT_CLAUDE_CODE_15DEC2025.md`
**Durée estimée** : 4-8 heures

---

## 🎯 MISSION

Exécuter les **4 phases de corrections** séquentiellement :
1. Phase 1 : Quick Wins
2. Phase 2 : Corrections Critiques P1
3. Phase 3 : Corrections Importantes P2
4. Phase 4 : Améliorations (si temps disponible)

**À la fin** : Créer un rapport final complet et faire un commit global.

---

## 📋 RÈGLES D'EXÉCUTION

### Tu DOIS :
- ✅ Travailler fichier par fichier
- ✅ Tester `npm run build` après chaque phase
- ✅ Documenter chaque modification dans le rapport
- ✅ Faire des commits atomiques par phase
- ✅ Continuer même si une tâche mineure échoue (noter dans rapport)

### Tu NE DOIS PAS :
- ❌ Modifier la logique métier
- ❌ Changer la structure des tables DB
- ❌ Supprimer des fonctionnalités existantes
- ❌ Ajouter de nouvelles dépendances (sauf browser-image-compression si nécessaire)
- ❌ Toucher aux fichiers de migration SQL

---

## 🚀 PHASE 1 : QUICK WINS (30-60 min)

### Tâche 1.1 : Supprimer fichiers obsolètes
```bash
# Vérifier et supprimer si non importés ailleurs
rm -f src/components/layout/NavbarOLD.tsx
rm -f src/pages/Projects-Old-Backup.tsx
```

### Tâche 1.2 : Corriger téléphone placeholder
- Fichier : `src/components/seo/SEOHead.tsx` ou similaire
- Chercher : `+357-XX-XXXXXX`
- Remplacer par : `+357-25-000000`

### Tâche 1.3 : Créer logger conditionnel
Créer `src/lib/logger.ts` :
```typescript
const isDev = import.meta.env.DEV;

export const logger = {
  log: (...args: unknown[]) => { if (isDev) console.log(...args); },
  warn: (...args: unknown[]) => { if (isDev) console.warn(...args); },
  error: (...args: unknown[]) => { console.error(...args); },
  debug: (...args: unknown[]) => { if (isDev) console.debug(...args); },
};

export default logger;
```

### Tâche 1.4 : Variables d'environnement
Vérifier/mettre à jour `.env.example` avec :
```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_GOOGLE_MAPS_KEY=
VITE_SENTRY_DSN=# Optionnel - DSN Sentry pour monitoring
VITE_GA4_ID=# Google Analytics 4 Measurement ID
```

### Tâche 1.5 : GA4 ID en variable
- Chercher GA4 ID hardcodé dans `src/lib/analytics.ts`
- Remplacer par `import.meta.env.VITE_GA4_ID || ''`

**Commit Phase 1** : `fix: phase 1 quick wins - cleanup and env variables`

---

## 🔧 PHASE 2 : CORRECTIONS CRITIQUES (1-2h)

### Tâche 2.1 : Analyser ProjectFormSteps
- Lire `src/components/admin/ProjectFormSteps.tsx`
- Identifier les steps 8, 9, 10 (lignes ~3322-3326)
- Si ce sont des TODO vides, documenter ce qu'ils devraient contenir
- Implémenter si le contenu est clair, sinon laisser un commentaire explicatif

### Tâche 2.2 : Lazy load des dépendances lourdes
Chercher et convertir en imports dynamiques :

```typescript
// Pour xlsx - dans les fonctions d'export
const exportToExcel = async (data: unknown[]) => {
  const XLSX = await import('xlsx');
  // ... reste du code
};

// Pour pdfmake - dans les fonctions de génération PDF
const generatePDF = async () => {
  const pdfMake = await import('pdfmake/build/pdfmake');
  // ... reste du code
};
```

### Tâche 2.3 : Pagination admin
Pour chaque fichier admin (`AdminProjects.tsx`, `AdminBuildings.tsx`, etc.) :

1. Vérifier si pagination existe
2. Si non, ajouter :

```typescript
// Ajouter state pagination
const [page, setPage] = useState(1);
const pageSize = 25;

// Modifier la query pour utiliser .range()
const from = (page - 1) * pageSize;
const to = from + pageSize - 1;

const { data, error, count } = await supabase
  .from('table')
  .select('*', { count: 'exact' })
  .range(from, to)
  .order('created_at', { ascending: false });
```

**Commit Phase 2** : `feat: phase 2 - lazy loading and pagination`

---

## 🔨 PHASE 3 : CORRECTIONS P2 (2-3h)

### Tâche 3.1 : Aligner types Building
- Comparer `src/types/building.ts` avec le schéma DB
- Ajouter les champs manquants
- Corriger les types incorrects
- Supprimer les champs inexistants en DB

### Tâche 3.2 : Corriger enum building_type
- Vérifier les valeurs autorisées en DB
- Aligner le type TypeScript

### Tâche 3.3 : Corriger invalidateQueries
Chercher tous les `invalidateQueries()` sans queryKey :
```bash
grep -rn "invalidateQueries()" src/
```
Ajouter la queryKey appropriée à chaque occurrence.

### Tâche 3.4 : Remplacer console.log
Dans les fichiers critiques (`src/hooks/`, `src/lib/`, `src/contexts/`) :
```typescript
// Remplacer
console.log(...) 
// Par
import { logger } from '@/lib/logger';
logger.log(...)
```

### Tâche 3.5 : Éliminer les types `any`
Dans `src/types/building.ts` et `src/types/project.types.ts` :
- Remplacer `any` par types spécifiques
- Utiliser `unknown` si vraiment indéterminé
- Utiliser `Record<string, unknown>` pour les objets JSON

### Tâche 3.6 : Compression images
Créer `src/lib/imageCompression.ts` :
```typescript
import imageCompression from 'browser-image-compression';

export async function compressImage(file: File): Promise<File> {
  if (file.size < 100 * 1024) return file; // < 100KB, pas besoin
  
  try {
    return await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    });
  } catch {
    return file;
  }
}
```

Installer la dépendance si nécessaire :
```bash
npm install browser-image-compression
```

Intégrer dans les uploaders existants.

**Commit Phase 3** : `fix: phase 3 - types alignment and optimizations`

---

## 💡 PHASE 4 : AMÉLIORATIONS (1-2h, optionnel)

### Tâche 4.1 : Compléter traductions
Pour `de.json` et `nl.json` :
- Comparer avec `en.json`
- Ajouter les clés manquantes avec traductions

### Tâche 4.2 : Lazy loading images
Vérifier/créer `OptimizedImage` component avec `loading="lazy"`.

### Tâche 4.3 : Animations (si temps)
- Identifier usages gsap
- Convertir en framer-motion si simple

**Commit Phase 4** : `feat: phase 4 - i18n and performance improvements`

---

## 📝 RAPPORT FINAL

À la fin, créer `/docs/prompts-corrections/RAPPORT-FINAL-CORRECTIONS.md` :

```markdown
# Rapport Final - Corrections ENKI Reality

**Date** : [DATE]
**Durée totale** : [DURÉE]
**Exécuté par** : Claude Code (autonome)

## Résumé Exécution

| Phase | Statut | Durée | Commits |
|-------|--------|-------|---------|
| 1 | ✅/⚠️/❌ | Xmin | hash |
| 2 | ✅/⚠️/❌ | Xmin | hash |
| 3 | ✅/⚠️/❌ | Xmin | hash |
| 4 | ✅/⚠️/❌ | Xmin | hash |

## Phase 1 : Quick Wins
- [x] Fichiers obsolètes supprimés
- [x] Téléphone placeholder corrigé
- [x] Logger créé
- [x] Variables env documentées
- [x] GA4 ID migré

## Phase 2 : Corrections P1
- [x] ProjectFormSteps analysé : [DÉTAILS]
- [x] Lazy loading implémenté : xlsx, pdfmake
- [x] Pagination ajoutée : [LISTE FICHIERS]

## Phase 3 : Corrections P2
- [x] Types Building alignés : [X champs modifiés]
- [x] Enum building_type corrigé
- [x] invalidateQueries corrigés : [X occurrences]
- [x] console.log remplacés : [X fichiers]
- [x] Types any éliminés : [X → 0]
- [x] Compression images ajoutée

## Phase 4 : Améliorations
- [x/−] Traductions de.json : [STATUT]
- [x/−] Traductions nl.json : [STATUT]
- [x/−] Lazy loading images : [STATUT]

## Erreurs Rencontrées
[LISTE SI APPLICABLE]

## Tests Build
- `npm run build` : ✅ PASS / ❌ FAIL
- Erreurs : [SI APPLICABLE]

## Fichiers Modifiés (total)
[NOMBRE] fichiers

## Recommandations Post-Correction
1. [SUGGESTION 1]
2. [SUGGESTION 2]
```

---

## 🏁 FINALISATION

Après toutes les phases :

```bash
# Vérifier le build
npm run build

# Si OK, push final
git add -A
git status
git push origin main
```

---

## ⚡ COMMENCE MAINTENANT

1. Lis d'abord le rapport d'audit : `/docs/audits/AUDIT_CLAUDE_CODE_15DEC2025.md`
2. Exécute Phase 1
3. Teste le build
4. Continue avec Phase 2, 3, 4
5. Génère le rapport final
6. Push

**GO ! 🚀**
