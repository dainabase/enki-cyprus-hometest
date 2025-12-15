# 🤝 CONTRIBUTING - ENKI REALITY

## Conventions de Code

### Git
- **Branches** : Travailler sur `main` directement ou créer des feature branches
- **Commits** : Format conventionnel
  ```
  type: description courte
  
  feat: nouvelle fonctionnalité
  fix: correction de bug
  refactor: refactoring
  docs: documentation
  style: formatage
  ```

### TypeScript
- Strict mode activé
- Types explicites pour les props et retours de fonction
- Interfaces pour les objets complexes

### React
- Composants fonctionnels uniquement
- Hooks pour la logique
- Props destructurées

### Styling
- Tailwind CSS pour tout le styling
- Pas de CSS custom sauf exception
- Classes utilitaires organisées : layout → spacing → typography → colors

## Structure des Fichiers

```
src/components/
├── ComponentName/
│   ├── index.ts          # Export
│   ├── ComponentName.tsx # Composant principal
│   └── types.ts          # Types (si nécessaire)
```

## Tests

Avant chaque commit :
1. `npm run build` - Vérifier que le build passe
2. Tester manuellement les fonctionnalités impactées
3. Vérifier la console pour les erreurs

## Documentation

- Documenter les changements majeurs dans `CHANGELOG.md`
- Mettre à jour la doc technique si nécessaire dans `docs/`
