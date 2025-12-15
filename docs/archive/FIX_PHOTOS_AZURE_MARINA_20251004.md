# Fix Photos & Sections ProjectPageV2

## Problème Identifié

1. **Mauvais slug** : Utilisation de `azure-marina` au lieu du slug correct en BDD
2. **Pas de photos** : azure-marina n'a pas d'images dans `/public/lovable-uploads/`
3. **Version simplifiée** : index-simple.tsx n'utilisait pas HeroPrestige ni LocationInteractive

## Solution Appliquée

### 1. Slug Correct

**En BDD, les slugs sont** :
```sql
- marina-bay-residences-limassol  ← PLEIN DE PHOTOS (16 images)
- azure-marina-paradise-limassol  ← Peu/pas de photos
- skyline-tower-nicosia
- mountain-view-villas-limassol
```

**Photos marina-bay disponibles** :
```
/public/lovable-uploads/
├── marina-bay-hero.jpg              ← Image principale
├── marina-bay-exterior-1.jpg
├── marina-bay-exterior-2.jpg
├── marina-bay-interior-1.jpg
├── marina-bay-interior-2.jpg
├── marina-bay-interior-3.jpg
├── marina-bay-bedroom.jpg
├── marina-bay-bathroom.jpg
├── marina-bay-kitchen-luxury.jpg
├── marina-bay-balcony.jpg
├── marina-bay-amenities-pool.jpg
├── marina-bay-garden.jpg
├── marina-bay-sea-view.jpg
├── marina-bay-mountain-view.jpg
├── marina-bay-panoramic.jpg
└── marina-bay-floor-plan.jpg
```

### 2. Corrections Appliquées

**Fichiers modifiés** :
```
src/
├── App.tsx                                    ← Revert index-simple → index
└── components/ProjectPageV2/
    ├── index.tsx                              ← Slug: marina-bay-residences-limassol
    └── sections/
        ├── HeroPrestige.tsx                   ← Slug: marina-bay-residences-limassol
        ├── LocationInteractive.tsx            ← Slug: marina-bay-residences-limassol
        ├── UnitTypologiesSection.tsx          ← Slug: marina-bay-residences-limassol
        ├── FinancingInvestmentSection.tsx     ← Slug: marina-bay-residences-limassol
        └── SocialProofSection.tsx             ← Slug: marina-bay-residences-limassol
```

**Changements** :
```tsx
// AVANT (mauvais slug)
.eq('url_slug', slug || 'azure-marina')

// APRÈS (slug correct avec photos)
.eq('url_slug', slug || 'marina-bay-residences-limassol')
```

### 3. Version Complète Restaurée

**Sections maintenant actives** :
- ✅ Section 1: HeroPrestige (avec photo hero + parallax)
- ✅ Section 3: LocationInteractive (carte + split view)
- ✅ Section 5: UnitTypologiesSection (plans + cards)
- ✅ Section 7: FinancingInvestmentSection (3 onglets)
- ✅ Section 10: SocialProofSection (testimonials + stats)

## URLs Correctes à Utiliser

### ✅ URL AVEC PHOTOS (Marina Bay)
```
http://localhost:5173/project-v2/marina-bay-residences-limassol
```

**Contenu** :
- Hero avec marina-bay-hero.jpg
- 16 photos high quality
- Données complètes en BDD
- 5 sections fonctionnelles

### ❌ URL SANS PHOTOS (Azure Marina)
```
http://localhost:5173/project-v2/azure-marina-paradise-limassol
```

**Problème** :
- Peu/pas de photos dans /public/
- Slug trop long
- Données potentiellement incomplètes

## Build

✅ Succès (48.26s)

## Test Complet

### 1. Ouvrir URL correcte
```
http://localhost:5173/project-v2/marina-bay-residences-limassol
```

### 2. Checklist Visuelle

**Section 1 - Hero Prestige** :
- [ ] Photo hero marina-bay-hero.jpg charge
- [ ] Parallax scroll fonctionne
- [ ] Badge "Éligible Résidence UE" si applicable
- [ ] Titre "Marina Bay Residences"
- [ ] Localisation "Limassol, Cyprus"
- [ ] Prix "À partir de XXX€"
- [ ] Boutons CTA : "Réserver Visite" + "Visite Virtuelle"
- [ ] Badge urgence si < 10 unités
- [ ] Scroll indicator anime

**Section 3 - Localisation Interactive** :
- [ ] Split view : Carte à gauche, infos à droite
- [ ] Google Maps charge avec marker
- [ ] Points d'intérêt affichent
- [ ] Distances affichent (Aéroport, Plage, etc.)
- [ ] Responsive mobile : Stack vertical

**Section 5 - Plans & Typologies** :
- [ ] Cards unités affichent (1BR, 2BR, 3BR, Penthouses)
- [ ] Photos intérieures chargent (bedroom, bathroom, kitchen)
- [ ] Badges statut : Disponible/Réservé/Vendu
- [ ] Badge urgence rouge si < 5 unités
- [ ] Prix formatés : "500 000€"
- [ ] Surface m² affiche
- [ ] Filtres fonctionnent (Chambres, Budget, Disponibilité)
- [ ] Modal plans ouvre avec floor-plan.jpg
- [ ] Bouton download plan fonctionne

**Section 7 - Financement** :
- [ ] 3 onglets visibles : Tous / Investisseurs / Occupants
- [ ] Onglet "Tous" : Échéancier + Budget total
- [ ] Onglet "Investisseurs" :
  - [ ] Golden Visa section affiche
  - [ ] Avantages (EU residence, travel, etc.)
  - [ ] Requis (300k€, visite tous les 2 ans, etc.)
  - [ ] ROI calculator fonctionne
  - [ ] Rendement locatif calcul
  - [ ] Avantages fiscaux grid
- [ ] Onglet "Occupants" :
  - [ ] Simulateur prêt fonctionne
  - [ ] Slider apport 20-50%
  - [ ] Taux intérêt 3.5-5%
  - [ ] Mensualités calculent
  - [ ] Budget total avec VAT/frais

**Section 10 - Social Proof** :
- [ ] Testimonials cards affichent (min 3)
- [ ] Photos/vidéos clients chargent
- [ ] Citations texte lisibles
- [ ] Notes étoiles affichent
- [ ] Stats crédibilité :
  - [ ] "60 ans d'expérience"
  - [ ] "25 000+ clients"
  - [ ] "98% satisfaction"
  - [ ] "50+ projets livrés"
- [ ] Awards grid affiche
- [ ] Click vidéo testimonial ouvre modal

### 3. Console Logs

**Attendus** :
```
[ProjectPageV2] Loading project with slug: marina-bay-residences-limassol
[ProjectPageV2] Base project loaded: Marina Bay Residences
[ProjectPageV2] Data enriched successfully
[ProjectPageV2] Mock data sections: [...]
```

**Si erreur** :
```
[ProjectPageV2] Supabase error: {...}
[ProjectPageV2] No project found for slug: ...
[ProjectPageV2] Error loading project: ...
```

## Update Projects.tsx

Pour que les liens fonctionnent, vérifier que Projects.tsx utilise les bons slugs :

```tsx
// Dans /src/pages/Projects.tsx

// Liens vers V2 :
<Link to={`/project-v2/${project.url_slug}`}>
  <Button>Version V2</Button>
</Link>

// Projet marina-bay doit avoir url_slug: 'marina-bay-residences-limassol'
```

## Prochaines Actions

### Si Marina Bay Fonctionne

1. **Ajouter photos aux autres projets** :
   ```bash
   # Copier photos dans /public/lovable-uploads/
   azure-marina-hero.jpg
   azure-marina-exterior-1.jpg
   azure-marina-interior-1.jpg
   # etc.
   ```

2. **Update BDD avec chemins images** :
   ```sql
   UPDATE projects 
   SET main_image_url = '/lovable-uploads/marina-bay-hero.jpg'
   WHERE url_slug = 'marina-bay-residences-limassol';
   ```

3. **Créer sections manquantes** :
   - Section 2: Vision/Concept
   - Section 4: Architecture & Design
   - Section 6: Équipements & Finitions
   - Section 8: Process d'achat
   - Section 9: FAQ
   - Section 11: Developer Profile
   - Section 12: Contact Form

### Si Erreur Persiste

**Vérifier dans l'ordre** :

1. **BDD** : Projet existe ?
   ```sql
   SELECT * FROM projects 
   WHERE url_slug = 'marina-bay-residences-limassol';
   ```

2. **Photos** : Fichiers existent ?
   ```bash
   ls /public/lovable-uploads/marina-bay-*
   ```

3. **Enrichment** : Mock data fonctionne ?
   ```javascript
   // Vérifier utils/mockProjectEnrichment.js
   console.log(enrichProjectData(baseProject));
   ```

4. **Composants** : Imports corrects ?
   ```tsx
   // Vérifier imports dans index.tsx
   import { HeroPrestige } from './sections/HeroPrestige';
   import { LocationInteractive } from './sections/LocationInteractive';
   ```

## Sections à Créer (Futures)

**Priorité 1** (Conversion) :
- Section 2: Vision/Concept (storytelling)
- Section 6: Équipements (détails finitions)
- Section 12: Contact Form (lead capture)

**Priorité 2** (Confiance) :
- Section 4: Architecture (rendus 3D)
- Section 8: Process achat (timeline)
- Section 11: Developer (crédibilité)

**Priorité 3** (Support) :
- Section 9: FAQ (objections)
- Section 13: Footer avec liens rapides

## Notes Importantes

⚠️ **NE PAS utiliser** :
- Slug `azure-marina` (sans suffix, pas en BDD)
- Slug `azure-marina-paradise-limassol` (pas de photos)

✅ **UTILISER** :
- Slug `marina-bay-residences-limassol` (16 photos + data complète)

📸 **Convention naming photos** :
```
{project-slug}-{type}.jpg

Exemples :
marina-bay-hero.jpg
marina-bay-exterior-1.jpg
marina-bay-bedroom.jpg
skyline-tower-hero.jpg
mountain-view-hero.jpg
```

Date: 2025-10-04
