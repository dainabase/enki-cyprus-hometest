# 🔨 PHASE 3 : CORRECTIONS IMPORTANTES P2 (3-5 jours)

## ⚠️ CONTEXTE

Tu travailles sur le projet **ENKI Reality Cyprus**.
- **Repo local** : `/Users/jean-mariedelaunay/Downloads/enki-cyprus-hometest`
- **Stack** : React 19 + TypeScript + Vite + Tailwind + Supabase
- **Rapport d'audit** : `/docs/audits/AUDIT_CLAUDE_CODE_15DEC2025.md`
- **Prérequis** : Phases 1 et 2 complétées

---

## 🎯 OBJECTIF DE CETTE PHASE

Corriger les **7 erreurs importantes P2** identifiées dans l'audit :
1. ERR-001 : Incohérence champs building (types vs DB)
2. ERR-003 : Enum building_type non aligné avec DB
3. ERR-006 : `invalidateQueries()` sans clé spécifique
4. ERR-010 : Console logs en production
5. ERR-012 : Sentry non configuré (complété si non fait en Phase 1)
6. ERR-017 : 17 types `any` dans le code
7. ERR-007 : Pas de compression images côté client

**Durée estimée** : 3-5 jours

---

## 📋 TÂCHES À RÉALISER

### TÂCHE 3.1 : Aligner les types Building avec la DB

**Fichiers concernés** :
- `src/types/building.ts`
- Migrations Supabase pour `buildings`

**Action** :

1. **Extraire le schéma actuel de la table buildings** :
   - Lire les migrations SQL dans `supabase/migrations/`
   - Lister toutes les colonnes avec leurs types

2. **Comparer avec `src/types/building.ts`** :
   - Identifier les champs manquants dans les types
   - Identifier les champs en trop dans les types
   - Identifier les types incorrects

3. **Créer un tableau de correspondance** :

```markdown
| Colonne DB | Type DB | Propriété TS | Type TS | Action |
|------------|---------|--------------|---------|--------|
| id | uuid | id | string | ✅ OK |
| name | text | name | string | ✅ OK |
| xxx | jsonb | xxx | any | ⚠️ Typer |
| yyy | text | - | - | ❌ Ajouter |
```

4. **Mettre à jour `building.ts`** pour correspondre exactement à la DB

**Commit** : `fix(types): align Building types with Supabase schema`

---

### TÂCHE 3.2 : Corriger l'enum building_type

**Problème** : ERR-003 - `BuildingFormData.building_type` inclut 'commercial', 'hotel' non présents dans DB

**Action** :

1. **Vérifier l'enum dans Supabase** :
   - Chercher dans les migrations : `CREATE TYPE building_type` ou contrainte CHECK
   - Lister les valeurs autorisées

2. **Vérifier dans le code TypeScript** :
   - `src/types/building.ts`
   - `src/schemas/buildingSchema.ts` (si existe)

3. **Aligner les deux** :

```typescript
// Si DB a : 'residential', 'mixed'
// Alors TS doit avoir :
type BuildingType = 'residential' | 'mixed';

// NE PAS ajouter des valeurs qui n'existent pas en DB
```

4. **Vérifier les formulaires** qui utilisent cet enum et supprimer les options invalides

**Commit** : `fix(types): align BuildingType enum with database constraints`

---

### TÂCHE 3.3 : Corriger invalidateQueries sans clé

**Fichier** : `src/hooks/useSupabaseQuery.ts` (ligne ~28)

**Problème** :
```typescript
// MAUVAIS - invalide TOUT le cache
queryClient.invalidateQueries();
```

**Solution** :
```typescript
// BON - invalide seulement les queries concernées
queryClient.invalidateQueries({ queryKey: ['specificKey'] });

// OU pour invalider une "famille" de queries
queryClient.invalidateQueries({ queryKey: ['projects'] }); // invalide ['projects'], ['projects', id], etc.
```

**Action** :

1. **Chercher toutes les occurrences** :
```bash
grep -rn "invalidateQueries" src/
```

2. **Pour chaque occurrence**, vérifier si une queryKey est spécifiée

3. **Corriger les appels sans queryKey** en ajoutant la clé appropriée

4. **Pattern recommandé** pour les mutations :

```typescript
const mutation = useMutation({
  mutationFn: async (data) => {
    const { error } = await supabase.from('projects').insert(data);
    if (error) throw error;
  },
  onSuccess: () => {
    // Invalider uniquement les queries projects
    queryClient.invalidateQueries({ queryKey: ['projects'] });
  },
});
```

**Commit** : `fix(queries): add specific queryKeys to invalidateQueries calls`

---

### TÂCHE 3.4 : Remplacer console.log par logger

**Prérequis** : Logger créé en Phase 1 (`src/lib/logger.ts`)

**Action** :

1. **Lister tous les console.log/warn** :
```bash
grep -rn "console.log\|console.warn\|console.debug" src/ --include="*.ts" --include="*.tsx" | wc -l
```

2. **Remplacer progressivement** (par fichier) :

```typescript
// AVANT
console.log('Debug info:', data);
console.warn('Warning:', message);

// APRÈS
import { logger } from '@/lib/logger';
logger.log('Debug info:', data);
logger.warn('Warning:', message);
```

3. **Garder `console.error`** pour les vraies erreurs (déjà géré dans logger)

4. **Priorité** : Commencer par les fichiers les plus critiques
   - `src/hooks/`
   - `src/lib/`
   - `src/contexts/`
   - Puis `src/components/admin/`
   - Puis le reste

**Commit par groupe** : `refactor: replace console.log with logger in [folder]`

---

### TÂCHE 3.5 : Éliminer les types `any`

**Problème** : ERR-017 - 17 types `any` identifiés

**Fichiers concernés** :
- `src/types/building.ts` : 15 occurrences
- `src/types/project.types.ts` : 2 occurrences

**Action** :

1. **Lister tous les `any`** :
```bash
grep -rn ": any" src/types/
```

2. **Pour chaque `any`**, déterminer le type correct :

```typescript
// AVANT
amenities: any;
metadata: any;
custom_fields: any;

// APRÈS - Si c'est du JSON structuré
amenities: Record<string, boolean>;
metadata: {
  source?: string;
  imported_at?: string;
  version?: number;
};

// APRÈS - Si vraiment inconnu, utiliser unknown
custom_fields: unknown;

// APRÈS - Si c'est un tableau
images: string[];
features: Array<{ name: string; value: string }>;
```

3. **Patterns courants à appliquer** :

| Pattern `any` | Remplacement suggéré |
|---------------|---------------------|
| `data: any` | `data: unknown` puis type guard |
| `options: any` | `options: Record<string, unknown>` |
| `callback: any` | `callback: (...args: unknown[]) => void` |
| `jsonb field` | Type spécifique ou `Record<string, unknown>` |

4. **Vérifier que le build passe** après chaque fichier modifié

**Commit** : `fix(types): replace any types with strict typing`

---

### TÂCHE 3.6 : Ajouter compression images côté client

**Problème** : ERR-007 - Pas de compression avant upload

**Action** :

1. **Installer browser-image-compression** (si pas déjà présent) :
```bash
npm install browser-image-compression
```

2. **Créer un utilitaire de compression** :

```typescript
// src/lib/imageCompression.ts
import imageCompression from 'browser-image-compression';

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
}

const defaultOptions: CompressionOptions = {
  maxSizeMB: 1,           // Max 1MB
  maxWidthOrHeight: 1920, // Max 1920px
  useWebWorker: true,
};

export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Ne pas compresser si déjà petit
  if (file.size < 100 * 1024) { // < 100KB
    return file;
  }
  
  try {
    const compressedFile = await imageCompression(file, mergedOptions);
    console.log(`Compressed ${file.name}: ${file.size} -> ${compressedFile.size}`);
    return compressedFile;
  } catch (error) {
    console.error('Compression failed, using original:', error);
    return file;
  }
}

export async function compressImages(files: File[]): Promise<File[]> {
  return Promise.all(files.map(file => compressImage(file)));
}
```

3. **Intégrer dans les uploaders existants** :

Chercher les fichiers d'upload :
- `src/lib/projectImages.ts`
- `src/components/admin/ImageUploader.tsx`
- Autres composants d'upload

```typescript
// AVANT
const handleUpload = async (file: File) => {
  await supabase.storage.from('bucket').upload(path, file);
};

// APRÈS
import { compressImage } from '@/lib/imageCompression';

const handleUpload = async (file: File) => {
  const compressedFile = await compressImage(file);
  await supabase.storage.from('bucket').upload(path, compressedFile);
};
```

**Commit** : `feat: add client-side image compression before upload`

---

## ✅ CHECKLIST DE FIN DE PHASE

- [ ] Types Building alignés avec DB
- [ ] Enum building_type corrigé
- [ ] Tous les invalidateQueries ont une queryKey
- [ ] Console.log remplacés par logger (au moins 80%)
- [ ] Types `any` éliminés (17 → 0)
- [ ] Compression images implémentée
- [ ] `npm run build` passe sans erreur
- [ ] `npm run lint` passe (ou erreurs documentées)

---

## 📝 RAPPORT DE FIN DE PHASE

Crée un fichier `/docs/prompts-corrections/RAPPORT-PHASE-3.md` avec :

```markdown
# Rapport Phase 3 - Corrections Importantes P2

**Date** : [DATE]
**Durée** : [DURÉE]

## ERR-001 & ERR-003 : Alignement Types

### Building Types
- Champs ajoutés : [LISTE]
- Champs supprimés : [LISTE]
- Types corrigés : [LISTE]

### Enum building_type
- Valeurs DB : [LISTE]
- Valeurs TS avant : [LISTE]
- Valeurs TS après : [LISTE]

## ERR-006 : invalidateQueries

| Fichier | Ligne | Avant | Après |
|---------|-------|-------|-------|
| ... | ... | ... | ... |

## ERR-010 : Console.log

- Fichiers modifiés : [NOMBRE]
- Console.log restants : [NOMBRE]
- Raison si > 0 : [EXPLICATION]

## ERR-017 : Types any

| Fichier | Avant | Après |
|---------|-------|-------|
| building.ts | 15 | 0 |
| project.types.ts | 2 | 0 |

## ERR-007 : Compression Images

- Utilitaire créé : src/lib/imageCompression.ts
- Composants mis à jour : [LISTE]
- Taille max : 1MB
- Dimension max : 1920px

## Commits Effectués

1. [hash] message
...

## Problèmes Rencontrés

[Liste]

## Notes pour Phase 4

[Observations]
```

---

## 🚫 INTERDICTIONS

- ❌ NE PAS modifier la structure des tables DB
- ❌ NE PAS changer les noms de colonnes
- ❌ NE PAS supprimer des champs utilisés
- ❌ NE PAS ajouter de logique métier
- ❌ NE PAS refactorer au-delà du scope

---

**COMMENCE PAR LA TÂCHE 3.1 ET PROGRESSE SÉQUENTIELLEMENT**
