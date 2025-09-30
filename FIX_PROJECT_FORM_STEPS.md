## 🔧 FIX POUR PROJECT FORM STEPS

### Problème
Les 3 nouveaux steps (project-amenities, legal-compliance, utilities-services) ne s'affichent pas car la logique de rendu est manquante dans ProjectFormSteps.tsx.

### Solution
À la fin du fichier `src/components/admin/projects/ProjectFormSteps.tsx`, juste avant le `return` final, ajouter ces 3 conditions:

```typescript
// Render steps nouveaux (à ajouter AVANT le return final)
if (currentStep === 'project-amenities') {
  return <ProjectAmenitiesStep form={form} />;
}

if (currentStep === 'legal-compliance') {
  return <LegalComplianceStep form={form} />;
}

if (currentStep === 'utilities-services') {
  return <UtilitiesServicesStep form={form} />;
}
```

### Emplacement exact
Chercher dans le fichier la section qui contient:
- `if (currentStep === 'marketing') return ...`
- ou  similar rendering logic

Ajouter les 3 nouvelles conditions JUSTE AVANT le `return` par défaut qui se trouve probablement à la fin.

### Explication
Les composants existent et sont importés correctement, mais le composant ProjectFormSteps ne les utilise jamais car il ne gère pas les nouveaux step IDs dans sa logique de rendu conditionnelle.
