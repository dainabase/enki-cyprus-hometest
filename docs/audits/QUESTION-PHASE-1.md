# Question Jean-Marie - Phase 1 Dead code

## Décision requise : cluster `src/components/ProjectPageV2/*`

### État du cluster

16 fichiers forment un cluster orphelin (aucun import externe depuis `App.tsx` ou autres pages), mais auto-cohérent :

**Composants / sections** (9 fichiers)
- `src/components/ProjectPageV2/index.tsx` (entrée principale)
- `src/components/ProjectPageV2/components/CTAButton.tsx`
- `src/components/ProjectPageV2/sections/FinancingInvestmentSection.tsx`
- `src/components/ProjectPageV2/sections/HeroPrestige.tsx`
- `src/components/ProjectPageV2/sections/LocationInteractive.tsx`
- `src/components/ProjectPageV2/sections/Section5TypologiesReal.tsx`
- `src/components/ProjectPageV2/sections/SocialProofSection.tsx`
- `src/components/ProjectPageV2/sections/UnitTypologiesSection.tsx`

**Utils** (2 fichiers)
- `src/components/ProjectPageV2/utils/calculations.ts`
- `src/components/ProjectPageV2/utils/tracking.ts`

**Hooks associés** (3 fichiers)
- `src/hooks/useProjectFinancing.ts`
- `src/hooks/useProjectSocialProof.ts`
- `src/hooks/useProjectTypologies.ts`

**Types associés** (2 fichiers)
- `src/types/financing.ts`
- `src/types/socialProof.ts`

### Indices

Présence d'une doc : `src/components/ProjectPageV2/README.md` + `IMPLEMENTATION_COMPLETE.md`. Le README indique "Architecture Template Projet Immobilier Premium", suggérant une refonte v2 de la page projet préparée mais pas encore câblée dans le routeur.

Le composant `ProjectPage-C_4lhfjY.js` actuel (41 KB dans le build) vient de `src/components/ProjectPageV1/...` ou équivalent — à confirmer.

### Options

**Option A — Conserver tel quel** : garder en attendant le go de refonte.
- Pour : aucun risque, permet de câbler rapidement si refonte décidée.
- Contre : bundle pollué, 16 fichiers dead code qui ne correspondent plus à l'état réel du repo.

**Option B — Supprimer entièrement** : partir de zéro au moment de la refonte si besoin.
- Pour : repo propre, knip descend à 0 dead file, cohérence gouvernance stricte.
- Contre : perte du travail préparatoire (bien que git le conserve dans l'historique).

**Option C — Déplacer dans `docs/references/ProjectPageV2-prototype/`** :
- Pour : garde trace sans polluer le build, signale clairement l'état « prototype ».
- Contre : demande un minimum de restructuration.

### Recommandation

Option B (suppression) est la plus alignée avec la règle CLAUDE.md « zéro dead code ». Git garde tout dans `main` (avant cette branche) donc rien n'est perdu. Si la refonte est relancée, on repart d'une base plus propre.

**Action attendue de Jean-Marie** : confirmer l'option choisie. En attendant, la Phase 1 laisse ces 16 fichiers intacts.
