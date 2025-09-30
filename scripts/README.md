# Scripts d'automatisation

## enrich-project-form.js

Script pour enrichir automatiquement le formulaire Projects avec :
- Intégration des 3 nouveaux steps (ProjectAmenitiesStep, LegalComplianceStep, UtilitiesServicesStep)
- Enrichissement des steps existants avec nouveaux champs

### Usage

```bash
# Exécuter le script
node scripts/enrich-project-form.js

# Puis tester
npm run dev
```

### Ce que fait le script

1. **PHASE 1** : Ajoute les imports des 3 nouveaux steps
2. **PHASE 2** : Ajoute les conditions de rendu pour les 3 nouveaux steps
3. **PHASE 3** : Enrichit renderPricingStep() avec les nouveaux champs
4. **PHASE 4** : Enrichit renderSpecificationsStep() avec les nouveaux champs
5. **PHASE 5** : Enrichit renderMediaStep() avec les nouveaux champs

### Sauvegarde

Le script crée automatiquement une sauvegarde avant modification :
```
ProjectFormSteps.tsx.backup
```
