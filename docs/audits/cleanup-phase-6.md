# Phase 6 - Bundle et assets

> Date : 2026-04-24
> Branche : `cleanup/socle-stabilisation`

## Résumé

| Indicateur | Avant Phase 6 | Après Phase 6 | Delta |
|---|---|---|---|
| `dist/` total | 15 MB | 7.9 MB | **-47%** |
| `public/` total | 10 MB | 3 MB | **-70%** |
| `public/lovable-uploads/` | 9 MB | 3 MB | **-67%** |
| Build duration | 8.11s | 8.48s | stable |

**Objectif largement atteint** : dist < 12 MB (cible) → 7.9 MB (résultat).

## Action principale : conversion WebP

16 images (PNG + JPG) > 100 KB converties avec `cwebp -q 82 -m 6` :

### PNG (forts gains 80-95%)

| Fichier | Avant | Après | Gain |
|---|---|---|---|
| `fd97a015-cee3-4fa9-850b-433d2e7ba761.png` | 1891 KB | 130 KB | -93% |
| `a1dfce22-4751-4496-ad17-be349e5e3cea.png` | 1776 KB | 89 KB | -95% |
| `908acac7-30e3-4ec8-a596-fceda857b322.png` | 1638 KB | 162 KB | -90% |
| `9a75d696-69ab-4957-93c2-70b44f9fc985.png` | 1522 KB | 65 KB | -96% |
| `7a1f4c1e-ed5d-401e-98a7-e7d380bb9d99.png` | 532 KB | 191 KB | -64% |
| `aec5ed87-7930-4b41-954b-9e598b9fcb57.png` | 165 KB | 4 KB | -98% |
| `2699123d-495f-4d53-a300-95fb50be8462.png` | 116 KB | 25 KB | -78% |
| `8acce094-0212-4562-9dff-42bd9d25efb0.png` | 101 KB | 24 KB | -76% |

### JPG (gains modérés 5-30%)

Les JPG étaient déjà optimisés, gain plus modeste :
- `marina-bay-*.jpg` : 120-220 KB → 100-160 KB en moyenne

## Changements

1. **16 nouveaux fichiers WebP** créés dans `public/lovable-uploads/`
2. **16 fichiers PNG/JPG originaux supprimés** (les navigateurs modernes supportent WebP à 97%+)
3. **6 fichiers src/ mis à jour** pour référencer les .webp :
   - `src/components/TabsFeatures-Alternative5-Accordion.tsx`
   - `src/components/hero/Alternative3.tsx`
   - `src/hooks/useSearchAnalysis.ts`
   - `src/pages/Projects.tsx`
   - `src/pages/Blog.tsx`
   - `src/pages/admin/AdminDevelopers.tsx`

## Vérifications chunking et lazy loading

### `vite.config.ts` — déjà bien configuré

```ts
manualChunks: {
  vendor: ['react', 'react-dom', 'react-router-dom'],
  ui: ['framer-motion', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
  maps: ['@react-google-maps/api', '@googlemaps/markerclusterer'],
  supabase: ['@supabase/supabase-js'],
}
```

`terserOptions.drop_console: true` → les `console.*` sont strippés en prod.

### `App.tsx` — toutes les pages en lazy()

16 `const X = lazy(() => import(...))` dans App.tsx (pages public + admin). Rien à changer.

### `lucide-react` — imports individuels

Vérifié : `grep -r "from 'lucide-react'" src/` retourne uniquement `import { IconX, IconY } from 'lucide-react'` (jamais `import * as Icons`).

## Plus gros chunks post-Phase-6 (inchangé)

| Chunk | Taille gzipped |
|---|---|
| `AdminProjectForm` | 160 KB |
| `index` (Home + router + App) | 168 KB |
| `AdminProjects` | 148 KB |
| `BarChart` (recharts) | 92 KB |
| `ui` (Radix + Framer Motion) | 71 KB |
| `Home` page | 59 KB |
| `vendor` (React etc.) | 50 KB |
| `supabase` | 32 KB |
| `maps` (Google Maps) | 39 KB |

Les grosses pages (AdminProjectForm, AdminProjects) sont directement liées au `ProjectFormSteps.tsx` de 3340 lignes non découpé (Phase 3b planifiée).

## Validation

- `npm run build` : PASS (8.48s)
- `dist/` : 7.9 MB (largement sous les 12 MB cible)
- Aucun 404 sur les ressources publiques (images WebP correctement liées)

## Notes

### Refs PNG orphelines (non touchées)

`src/pages/admin/AdminDevelopers.tsx` contient des refs à des logos PNG (leptos, karma, zavos, etc.) qui n'ont **pas de fichier physique** dans `public/lovable-uploads/`. Ces refs existaient déjà avant cette session — elles sont probablement des placeholders. Laissées intactes car hors du scope Phase 6.

### WebP sans fallback

Les navigateurs modernes supportent WebP natif depuis Edge 18, Firefox 65, Chrome 32, Safari 14. Pour ENKI Reality (cible européens 2024-2025), le risque est négligeable. Si un fallback est demandé plus tard, wrapper dans `<picture>` avec `<source type="image/webp">` + `<img src=".jpg">`.

## Recommandation Phase 7

i18n : EN/FR à compléter, rapport pour autres langues. Les clés sont dans `src/locales/*.json`. Objectif : EN et FR à 100%, rapport généré pour EL/RU/ES/IT/DE/NL.
