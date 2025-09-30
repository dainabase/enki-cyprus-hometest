# 🚀 Guide d'exécution - Enrichissement formulaire Projects

## ✅ État actuel

- ✅ Script Python prêt : `scripts/enrich-complete.py`
- ✅ 3 nouveaux steps créés et validés
- ✅ Branche active : `feature/enrich-project-form-steps`
- ⏳ **À faire** : Exécuter le script pour enrichir `ProjectFormSteps.tsx`

---

## 📋 Commandes d'exécution (5 minutes)

### Option 1 : Exécution locale (RECOMMANDÉ)

```bash
# 1. Cloner le repository (si pas déjà fait)
git clone https://github.com/dainabase/enki-cyprus-hometest.git
cd enki-cyprus-hometest

# 2. Basculer sur la bonne branche
git checkout feature/enrich-project-form-steps
git pull origin feature/enrich-project-form-steps

# 3. Exécuter le script Python
python3 scripts/enrich-complete.py

# 4. Vérifier les modifications
git status
git diff src/components/admin/projects/ProjectFormSteps.tsx

# 5. Commiter et pusher
git add src/components/admin/projects/ProjectFormSteps.tsx
git commit -m "feat: Enrich project form with 29 new fields

- Add imports for 3 new steps (ProjectAmenitiesStep, LegalComplianceStep, UtilitiesServicesStep)
- Add render conditions for new steps  
- Enrich PricingStep with 15 fields (pricing transparency, ROI, financing, legal)
- Enrich SpecificationsStep with 8 fields (unit ranges, quality/prestige)
- Enrich MediaStep with 3 fields (video_url, drone_footage_url, brochure_pdf)
- Total: +29 new fields for complete project management"

git push origin feature/enrich-project-form-steps

# 6. Tester localement
npm install
npm run dev
```

---

### Option 2 : Via GitHub Codespaces

Si vous préférez travailler directement dans le navigateur :

1. Allez sur : https://github.com/dainabase/enki-cyprus-hometest
2. Cliquez sur **Code** → **Codespaces** → **Create codespace**
3. Attendez le chargement du workspace
4. Exécutez dans le terminal :

```bash
git checkout feature/enrich-project-form-steps
python3 scripts/enrich-complete.py
git add .
git commit -m "feat: Enrich project form with 29 new fields"
git push
```

---

## 📊 Ce que le script va faire

### Phase 1 : Imports ✨
Ajoute au début du fichier :
```typescript
import { ProjectAmenitiesStep } from './steps/ProjectAmenitiesStep';
import { LegalComplianceStep } from './steps/LegalComplianceStep';
import { UtilitiesServicesStep } from './steps/UtilitiesServicesStep';
```

### Phase 2 : Conditions de rendu 🎯
Ajoute dans la fonction principale :
```typescript
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

### Phase 3 : PricingStep (+15 champs) 💰
- Section Tarification Transparente (6 champs)
- Section ROI Investisseurs (2 champs)
- Section Financement (3 champs)
- Section Légal (3 champs)

### Phase 4 : SpecificationsStep (+8 champs) 📐
- Section Gamme Unités (4 champs)
- Section Qualité & Prestige (4 champs)

### Phase 5 : MediaStep (+3 champs) 📸
- video_url
- drone_footage_url
- brochure_pdf

---

## ✅ Vérification post-exécution

Le script créera automatiquement un **backup** :
- `ProjectFormSteps.backup_[timestamp].tsx`

### Tests à effectuer après l'exécution

1. **Compilation** :
   ```bash
   npm run dev
   ```
   ✅ Pas d'erreurs TypeScript

2. **Interface Admin** :
   - Ouvrir http://localhost:5173/admin/projects
   - Créer un nouveau projet
   - ✅ Vérifier que la sidebar affiche **10 steps** (au lieu de 7)
   - ✅ Cliquer sur chaque step et vérifier l'affichage

3. **Steps enrichis** :
   - **PricingStep** : Vérifier les 4 nouvelles sections
   - **SpecificationsStep** : Vérifier les 2 nouvelles sections  
   - **MediaStep** : Vérifier les 3 nouveaux champs vidéo

4. **Sauvegarde** :
   - Remplir un projet avec tous les champs
   - Sauvegarder
   - ✅ Vérifier dans Supabase que les données sont persistées
   - Éditer le projet
   - ✅ Vérifier que les données sont rechargées

---

## 🐛 En cas de problème

### Le script échoue
```bash
# Restaurer le backup
cp src/components/admin/projects/ProjectFormSteps.backup_*.tsx src/components/admin/projects/ProjectFormSteps.tsx
```

### Python non installé
```bash
# macOS/Linux
sudo apt-get install python3  # Linux
brew install python3          # macOS

# Windows
# Télécharger depuis python.org
```

### Erreurs TypeScript après enrichissement
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📈 Métriques finales attendues

| Métrique | Avant | Après | Delta |
|----------|-------|-------|-------|
| Steps actifs | 7 | 10 | +3 ✅ |
| Champs PricingStep | 5 | 20 | +15 ✅ |
| Champs SpecificationsStep | 3 | 11 | +8 ✅ |
| Champs MediaStep | 9 | 12 | +3 ✅ |
| **Total nouveaux champs** | — | — | **+29** 🎉 |

---

## 🎯 Après l'enrichissement

### Prochaines étapes

1. **Merger la Pull Request** :
   ```bash
   # Depuis GitHub : https://github.com/dainabase/enki-cyprus-hometest/pull/1
   # Cliquer sur "Merge pull request"
   ```

2. **Déployer en production** :
   ```bash
   git checkout main
   git pull origin main
   npm run build
   # Déployer sur Vercel/Netlify
   ```

3. **Mettre à jour la documentation** :
   - Documenter les 29 nouveaux champs
   - Créer un guide utilisateur
   - Enregistrer une vidéo de démonstration

---

## 📞 Support

En cas de blocage :
- 📧 Contacter l'équipe technique
- 💬 Créer une issue sur GitHub
- 📚 Consulter `scripts/README-ENRICH-COMPLETE.md`

---

**🎉 Bonne exécution ! Le formulaire Projects va devenir COMPLET avec 29 nouveaux champs !**
