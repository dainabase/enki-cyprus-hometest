# LESSONS LEARNED - ENKI Reality

> Memoire des erreurs pour ne pas les repeter.
> Chaque lecon a un statut : ACTIVE (a respecter) ou RESOLVED (corrigee).

## L1 - Colonnes fantomes dans Edge Functions [ACTIVE]
**Probleme** : `agentic-search` utilise `price`, `location->city`, `type` qui n'existent pas dans Supabase.
**Cause** : Developpement sans verification schema reel.
**Solution** : Toujours verifier noms colonnes via `SELECT column_name FROM information_schema.columns WHERE table_name = 'xxx'` avant d'ecrire une query.
**Prevention** : Regle dans CLAUDE.md + audit pre-commit.

## L2 - Mock data sans marquage [ACTIVE]
**Probleme** : Donnees fictives melangees avec vraies donnees, impossible a distinguer.
**Cause** : Prototypage rapide sans convention.
**Solution** : Prefixer tout mock avec `// TODO: MOCK`.
**Prevention** : Jules a ajoute les TODOs. Verification dans code review.

## L3 - Edge Functions sans JWT [ACTIVE]
**Probleme** : 14/18 Edge Functions accessibles sans authentification.
**Cause** : Developpement en mode "ca marche d'abord".
**Solution** : Ajouter verification JWT standard a chaque fonction.
**Prevention** : Template Edge Function avec JWT inclus.

## L4 - Formulaire <-> BDD desynchronise [ACTIVE]
**Probleme** : Schemas Zod frontend ne correspondent pas aux colonnes Supabase.
**Cause** : Evolution independante du front et du back.
**Solution** : Audit regulier, script de comparaison automatise.
**Prevention** : Regle CLAUDE.md - verifier coherence avant tout formulaire.

## L5 - ProjectFormSteps.tsx massif (3340 lignes) [ACTIVE]
**Probleme** : Fichier trop gros, difficile a maintenir et modifier.
**Cause** : Accumulation de steps sans refactoring.
**Solution** : Decomposer en composants par step.
**Prevention** : Max 500 lignes par composant.

## L6 - 386 occurrences `any` [ACTIVE]
**Probleme** : Types `any` partout degradent la qualite TypeScript.
**Cause** : Prototypage rapide.
**Solution** : Remplacer progressivement par types stricts.
**Prevention** : Regle CLAUDE.md - jamais de `any`.

## L7 - Jules session completed mais push echoue [RESOLVED]
**Probleme** : Jules complete sa session mais les fichiers n'arrivent pas sur le repo.
**Cause** : Probablement permissions ou timeout sur le push/PR.
**Solution** : Verifier systematiquement le resultat apres COMPLETED.
**Prevention** : Toujours verifier presence fichiers sur GitHub apres session Jules.
