# 💡 PHASE 4 : AMÉLIORATIONS (1-2 semaines)

## ⚠️ CONTEXTE

Tu travailles sur le projet **ENKI Reality Cyprus**.
- **Repo local** : `/Users/jean-mariedelaunay/Downloads/enki-cyprus-hometest`
- **Stack** : React 19 + TypeScript + Vite + Tailwind + Supabase
- **Rapport d'audit** : `/docs/audits/AUDIT_CLAUDE_CODE_15DEC2025.md`
- **Prérequis** : Phases 1, 2 et 3 complétées

---

## 🎯 OBJECTIF DE CETTE PHASE

Implémenter les **améliorations optionnelles** pour améliorer la qualité du projet :
1. WARN-006/007 : Compléter les traductions i18n
2. WARN-011 : Unifier les animations (framer-motion)
3. WARN-008 : PWA / Service Worker
4. SUG-001 : Lazy loading images
5. SUG-002 : Virtualisation listes longues
6. SUG-004 : CSP headers

**Durée estimée** : 1-2 semaines (peut être fait partiellement)

---

## 📋 TÂCHES À RÉALISER

### TÂCHE 4.1 : Compléter les traductions i18n

**Fichiers** : `src/locales/*.json`

**État actuel** (selon audit) :
| Langue | Complétude |
|--------|------------|
| en.json | 100% (référence) |
| fr.json | ~95% |
| el.json | ~90% |
| ru.json | ~85% |
| es.json | ~80% |
| it.json | ~80% |
| de.json | ~75% |
| nl.json | ~70% |

**Action** :

1. **Extraire toutes les clés de en.json** :
```bash
# Compter les clés
cat src/locales/en.json | jq 'paths | length'
```

2. **Pour chaque langue incomplète**, identifier les clés manquantes :
```typescript
// Script de comparaison (à exécuter manuellement ou créer)
const en = require('./src/locales/en.json');
const de = require('./src/locales/de.json');

function findMissingKeys(reference: object, target: object, prefix = ''): string[] {
  const missing: string[] = [];
  for (const key in reference) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (!(key in target)) {
      missing.push(fullKey);
    } else if (typeof reference[key] === 'object' && reference[key] !== null) {
      missing.push(...findMissingKeys(reference[key], target[key], fullKey));
    }
  }
  return missing;
}
```

3. **Ajouter les traductions manquantes** :
   - Utiliser des traductions automatiques comme base
   - Marquer avec `// TODO: verify translation` si incertain

4. **Priorité** : de.json et nl.json (les moins complets)

**Commit par langue** : `i18n: complete [LANG] translations (X keys added)`

---

### TÂCHE 4.2 : Identifier et corriger les textes hardcodés

**Problème** : WARN-007 - Textes hardcodés dans certains composants

**Action** :

1. **Chercher les textes hardcodés** :
```bash
# Textes entre guillemets dans JSX
grep -rn '>[A-Z][a-z]' src/components/ --include="*.tsx" | grep -v '//' | head -50
```

2. **Patterns à chercher** :
```typescript
// MAUVAIS - Texte hardcodé
<Button>Submit</Button>
<p>Loading...</p>
<span>Error occurred</span>

// BON - Avec i18n
import { useTranslation } from 'react-i18next';
const { t } = useTranslation();

<Button>{t('common.submit')}</Button>
<p>{t('common.loading')}</p>
<span>{t('errors.generic')}</span>
```

3. **Fichiers prioritaires** (interface utilisateur visible) :
   - `src/components/layout/`
   - `src/components/search/`
   - `src/pages/` (pages publiques)
   - `src/components/ui/` (messages génériques)

**Commit** : `i18n: replace hardcoded texts with translation keys`

---

### TÂCHE 4.3 : Unifier les animations avec Framer Motion

**Problème** : WARN-011 - Mix de framer-motion, gsap, et CSS animations

**Objectif** : Standardiser sur Framer Motion (déjà la lib principale)

**Action** :

1. **Identifier les usages de gsap** :
```bash
grep -rn "gsap\|ScrollTrigger" src/
```

2. **Identifier les CSS animations** :
```bash
grep -rn "@keyframes\|animation:" src/
```

3. **Pour chaque animation gsap**, convertir en Framer Motion :

```typescript
// AVANT (gsap)
import gsap from 'gsap';
gsap.to(element, { opacity: 1, duration: 0.5 });

// APRÈS (framer-motion)
import { motion } from 'framer-motion';
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
```

4. **Pour les CSS keyframes simples**, évaluer si conversion nécessaire :
   - Animations au hover → garder en CSS (plus performant)
   - Animations d'entrée/sortie → convertir en Framer Motion
   - Animations complexes/séquencées → convertir en Framer Motion

5. **Créer des variants réutilisables** :

```typescript
// src/lib/animations.ts
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};
```

**Note** : NE PAS supprimer gsap de package.json s'il est encore utilisé ailleurs.

**Commit** : `refactor: migrate gsap animations to framer-motion`

---

### TÂCHE 4.4 : Ajouter lazy loading pour les images

**Problème** : SUG-001 - Images chargées immédiatement

**Action** :

1. **Vérifier si `loading="lazy"` est utilisé** :
```bash
grep -rn 'loading="lazy"' src/
```

2. **Vérifier le composant OptimizedImage** :
   - Fichier probable : `src/components/ui/OptimizedImage.tsx`
   - S'assurer qu'il utilise `loading="lazy"` par défaut

3. **Si OptimizedImage n'existe pas, le créer** :

```typescript
// src/components/ui/OptimizedImage.tsx
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

export function OptimizedImage({ 
  src, 
  alt, 
  className, 
  fallback = '/placeholder.jpg',
  ...props 
}: OptimizedImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      src={error ? fallback : src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setError(true)}
      onLoad={() => setLoaded(true)}
      className={cn(
        'transition-opacity duration-300',
        loaded ? 'opacity-100' : 'opacity-0',
        className
      )}
      {...props}
    />
  );
}
```

4. **Remplacer les `<img>` par `<OptimizedImage>`** dans les composants critiques :
   - Galeries de projets
   - Cartes de propriétés
   - Listes avec images

**Commit** : `perf: implement lazy loading for images`

---

### TÂCHE 4.5 : Virtualisation des listes longues

**Problème** : SUG-002 - Listes avec beaucoup d'items non virtualisées

**Action** :

1. **Installer @tanstack/react-virtual** (si pas présent) :
```bash
npm install @tanstack/react-virtual
```

2. **Identifier les listes potentiellement longues** :
   - Liste des propriétés (peut avoir 100+ items)
   - Liste des leads (peut avoir 1000+ items)
   - Dropdowns avec beaucoup d'options

3. **Implémenter la virtualisation** :

```typescript
// Exemple pour une liste de propriétés
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

function PropertyList({ properties }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: properties.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // Hauteur estimée d'un item
    overscan: 5, // Items rendus en plus (scroll fluide)
  });

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <PropertyCard property={properties[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

4. **Appliquer aux composants identifiés** (seulement si liste > 50 items typiquement)

**Commit** : `perf: implement virtual scrolling for long lists`

---

### TÂCHE 4.6 : Ajouter CSP Headers (optionnel avancé)

**Problème** : SUG-004 - Pas de Content Security Policy

**Action** :

1. **Pour Vite en dev**, ajouter dans `vite.config.ts` :

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' https://apis.google.com",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https: blob:",
        "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://maps.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "frame-src 'self' https://www.google.com",
      ].join('; ')
    }
  }
});
```

2. **Pour la production**, les headers doivent être configurés côté serveur (Vercel, Netlify, etc.)

Exemple `vercel.json` :
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://apis.google.com; ..."
        }
      ]
    }
  ]
}
```

**Note** : Tester en local d'abord, les CSP strictes peuvent casser des fonctionnalités.

**Commit** : `security: add Content-Security-Policy headers`

---

## ✅ CHECKLIST DE FIN DE PHASE

- [ ] Traductions de.json et nl.json complétées
- [ ] Textes hardcodés identifiés et migrés (principaux)
- [ ] Animations gsap migrées vers framer-motion (si applicable)
- [ ] Lazy loading images implémenté
- [ ] Virtualisation ajoutée aux listes longues (si applicable)
- [ ] CSP headers configurés (optionnel)
- [ ] `npm run build` passe sans erreur
- [ ] Tests manuels des fonctionnalités impactées

---

## 📝 RAPPORT DE FIN DE PHASE

Crée un fichier `/docs/prompts-corrections/RAPPORT-PHASE-4.md` avec :

```markdown
# Rapport Phase 4 - Améliorations

**Date** : [DATE]
**Durée** : [DURÉE]

## i18n

### Traductions complétées
| Langue | Avant | Après | Clés ajoutées |
|--------|-------|-------|---------------|
| de.json | 75% | 100% | XX |
| nl.json | 70% | 100% | XX |

### Textes hardcodés migrés
- Fichiers modifiés : [NOMBRE]
- Clés ajoutées : [NOMBRE]

## Animations

- Usages gsap trouvés : [NOMBRE]
- Usages gsap migrés : [NOMBRE]
- CSS animations conservées : [NOMBRE]
- Variants créés : [LISTE]

## Performance

### Lazy Loading
- Composant OptimizedImage : [CRÉÉ/MIS À JOUR]
- Images migrées : [NOMBRE]

### Virtualisation
- Listes virtualisées : [LISTE]
- Bibliothèque : @tanstack/react-virtual

## Sécurité

### CSP Headers
- Implémenté : [OUI/NON]
- Fichier config : [NOM]
- Note : [OBSERVATIONS]

## Commits Effectués

1. [hash] message
...

## Non Réalisé (et pourquoi)

[Liste avec justifications]

## Recommandations Futures

[Suggestions pour améliorer encore]
```

---

## 🚫 INTERDICTIONS

- ❌ NE PAS casser les fonctionnalités existantes
- ❌ NE PAS modifier la logique métier
- ❌ NE PAS changer la structure de données
- ❌ NE PAS forcer des migrations npm majeures
- ❌ NE PAS supprimer gsap si encore utilisé quelque part

---

**CETTE PHASE EST OPTIONNELLE - PRIORISER LES TÂCHES SELON LE TEMPS DISPONIBLE**

Ordre de priorité suggéré :
1. 4.1 + 4.2 (i18n) - Impact utilisateur direct
2. 4.4 (Lazy loading) - Performance visible
3. 4.3 (Animations) - Dette technique
4. 4.5 (Virtualisation) - Si listes vraiment longues
5. 4.6 (CSP) - Sécurité avancée
