# ProjectPageV2 — Prototype archivé

> Statut : **PROTOTYPE NON CÂBLÉ** — code de référence uniquement
> Archivé le : 2026-04-24
> Décision : Phase 1b cleanup socle stabilisation (Option C)

## Contexte

Cluster de 17 fichiers conçu comme refonte v2 de la page projet (template immobilier premium). Code abouti et auto-cohérent, mais jamais câblé dans `App.tsx` au moment de l'audit.

Pour respecter la règle gouvernance "zéro dead code dans `src/`" tout en préservant le travail préparatoire, le cluster a été déplacé ici plutôt que supprimé.

## Contenu

| Type | Fichiers | Destination |
|---|---|---|
| Composant principal | `index.tsx` | racine |
| Documentation | `README.md`, `IMPLEMENTATION_COMPLETE.md` | racine |
| Composants | `CTAButton.tsx` | `components/` |
| Sections | 6 sections (Hero, Financing, Location, Typologies x2, SocialProof) | `sections/` |
| Utils | `tracking.ts`, `calculations.ts` | `utils/` |
| Hooks associés | `useProjectFinancing`, `useProjectSocialProof`, `useProjectTypologies` | `_associated-hooks/` |
| Types associés | `financing.ts`, `socialProof.ts` | `_associated-types/` |

## Si on relance la refonte

1. Décider d'abord si on repart de ce prototype ou d'une base neuve
2. Si reprise : `git mv docs/references/ProjectPageV2-prototype/* src/...` en restaurant les chemins d'origine
3. Câbler dans `App.tsx` ou un router dédié
4. Mettre à jour les imports cassés (les hooks/types ont changé de chemin)
5. Vérifier la cohérence avec le schéma Supabase actuel (peut avoir évolué depuis octobre 2025)

## Historique Git

Les 17 fichiers étaient à l'origine dans `src/components/ProjectPageV2/`, `src/hooks/`, `src/types/`. Voir l'historique git pour le détail des contributions originales.

Commit d'archivage : `cleanup(phase-1b): archive ProjectPageV2 prototype to docs/references/`
