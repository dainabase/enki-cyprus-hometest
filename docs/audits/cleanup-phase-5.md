# Phase 5 - console.log migration vers logger unifié

> Date : 2026-04-24
> Branche : `cleanup/socle-stabilisation`

## Résumé

**Baseline** : 181 occurrences `console.log`, `console.info`, `console.debug` dans src/
**Après Phase 5** : 0 hors de `src/lib/logger.ts` (qui contient volontairement des `console.*` comme implémentation du logger)

## Méthode

Script Python exécuté sur tous les `src/**/*.{ts,tsx}` (sauf `logger.ts`) :

1. Pour chaque fichier contenant `console.log|info|debug(` :
   - Détecte si `import { logger } from '@/lib/logger'` est déjà présent
   - Sinon, ajoute l'import après les autres imports en haut du fichier
2. Remplace `console.log(` → `logger.info(`
3. Remplace `console.info(` → `logger.info(`
4. Remplace `console.debug(` → `logger.debug(`

**`console.error` conservé** : volontairement laissé seul (garde le comportement existant + le logger.error wrapper Sentry est disponible si besoin).

## Fichiers modifiés

38 fichiers impactés. Total 179 remplacements.

Top 10 :
| Fichier | Remplacements |
|---|---|
| `src/components/admin/projects/ProjectFormSteps.tsx` | 28 |
| `src/utils/auditPropertyFields.ts` | 20 |
| `src/pages/admin/AdminProjectForm.tsx` | 18 |
| `src/pages/admin/AdminPropertyForm.tsx` | 13 |
| `src/utils/testDataGenerator.ts` | 9 |
| `src/components/auth/PrivateRoute.tsx` | 7 |
| `src/components/admin/settings/AIAgentsManager.tsx` | 6 |
| `src/components/admin/projects/CategorizedMediaUploader.tsx` | 5 |
| `src/components/admin/ai/UnifiedAIImporter.tsx` | 5 |
| `src/components/GoogleMap.tsx` | 5 |

## Problème rencontré et résolution

Dans 3 fichiers, l'auto-insertion de `import { logger } from '@/lib/logger'` est tombée au milieu d'un **import multi-ligne** existant (format `import {\n  X,\n  Y\n} from '...'`), cassant la syntaxe :

```ts
import {
import { logger } from '@/lib/logger';
  MapPin,
  Phone,
```

**Fix** : second script Python qui :
1. Détecte le pattern cassé par regex
2. Supprime la ligne fautive
3. Réinsère `import { logger }` après le dernier import valide

3 fichiers corrigés :
- `src/components/admin/settings/AIAgentsManager.tsx`
- `src/components/admin/properties/PropertiesSection.tsx`
- `src/pages/Contact.tsx`

## Validation

- `npm run build` : PASS (8.11s)
- `grep -rn 'console.log' src/ --include='*.ts' --include='*.tsx'` → 2 matches, tous dans `src/lib/logger.ts` (implémentation du logger)
- Aucune régression détectée
- Le logger Sentry-compatible est actif en prod (config `sentryEnabled: import.meta.env.PROD`)

## Bénéfices

1. **Silence en production** : `logger.info/debug` ne log que si `import.meta.env.DEV === true`
2. **Erreurs remontées à Sentry** : `logger.error` envoie automatiquement à Sentry en prod
3. **Grep propre** : un futur `grep console.log src/` retourne 0 (hors logger.ts), ce qui devient la règle de gouvernance
4. **Pas de bloat runtime** : les logs dev disparaissent du bundle prod

## Recommandation Phase 6

Le bundle fait actuellement 15 MB (dist/). Cible : < 12 MB. Actions :
1. Auditer les assets > 100 KB dans public/ et les convertir en WebP
2. Vérifier le chunking Vite (déjà bien configuré)
3. Auditer lucide-react imports (déjà individuels)
4. Vérifier lazy loading pages admin (déjà fait)

Le plus gros levier sera la conversion des images JPG → WebP.
