# 🚀 Quick Start Guide pour Bolt

## 📌 Ce qu'il faut savoir

✅ **Phase 1 est TERMINÉE** - Vous pouvez développer TOUTES les sections maintenant  
✅ **Mock data prêt** - Toutes les données manquantes sont générées automatiquement  
✅ **Aucun blocage BDD** - Travaillez en autonomie complète  

---

## ⚡ Démarrage Ultra-Rapide (2 minutes)

### Étape 1: Importer l'enrichissement

Dans votre page projet:

```javascript
// app/projects/[id]/page.jsx
import { enrichProjectData } from '@/utils/mockProjectEnrichment';

export default async function ProjectPage({ params }) {
  // 1. Récupérer depuis Supabase (comme avant)
  const { data: baseProject } = await supabase
    .from('projects')
    .select('*, developer:developers(*)')
    .eq('id', params.id)
    .single();
  
  // 2. ✨ ENRICHIR (nouvelle ligne magique)
  const project = enrichProjectData(baseProject);
  
  // 3. Utiliser normalement
  return <ProjectTemplate project={project} />;
}
```

### Étape 2: C'est tout ! 🎉

Toutes les sections ont maintenant leurs données:

```javascript
project.unitTypes        // ✅ Plans avec floor plans, stock
project.investment       // ✅ Golden Visa, tax benefits
project.financing        // ✅ Banques, échéancier
project.testimonials     // ✅ Avec vidéos
project.developer.stats  // ✅ Revenue, satisfaction
project.developer.awards // ✅ Prix
project.developer.press  // ✅ Articles
project.architecture     // ✅ Style, architecte
project.specifications   // ✅ Cuisine, bains, sols
project.timeline         // ✅ Phases construction
```

---

## 📘 Sections à Développer (Ordre Prioritaire)

### 1️⃣ Section 5 - Plans & Typologies (PRIORITÉ #1)

**Impact:** 31% acheteurs = critère décisif #1

```jsx
function PlansSection({ project }) {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {project.unitTypes.map(unit => (
        <UnitCard
          key={unit.id}
          name={unit.name}                    // "Appartement 2 Chambres"
          bedrooms={unit.bedrooms}            // 2
          bathrooms={unit.bathrooms}          // 2
          surfaceTotal={unit.surfaceTotal}    // ✅ 103m² (calculé)
          priceFrom={unit.priceFrom}          // 382500
          pricePerSqm={unit.pricePerSqm}      // 3738
          
          // ✅ MOCK - Champs manquants BDD
          floorPlan2D={unit.floorPlan2D}      // '/assets/floorplans/2br-2d.pdf'
          floorPlan3D={unit.floorPlan3D}      // '/assets/floorplans/2br-3d.jpg'
          availableCount={unit.availableCount} // 5 unités
          status={unit.status}                 // 'Disponible'
          orientation={unit.orientation}       // 'Sud'
        />
      ))}
    </div>
  );
}
```

**Design:**
- Cards avec image plan 3D
- Badge stock disponible (couleur selon statut)
- Icones specs (chambres, bains, m²)
- Prix + prix/m²
- CTA "Voir plan 3D" + "Télécharger PDF"

---

### 2️⃣ Section 7 - Financement (PRIORITÉ #2)

**Impact:** Section décisive investisseurs

```jsx
function FinancingSection({ project }) {
  const { investment, financing, price } = project;
  
  return (
    <>
      {/* Highlights Investment */}
      <MetricsGrid>
        <Metric 
          value={`${investment.rentalYield}%`}
          label="Rendement locatif"
          subtitle={`${investment.rentalPriceMonthly}€/mois`} // ✅ MOCK
        />
        <Metric 
          value={`${investment.appreciationHistorical}%`} // ✅ MOCK
          label="Plus-value historique"
        />
      </MetricsGrid>
      
      {/* Golden Visa */}
      <GoldenVisaCard details={investment.goldenVisaDetails} /> {/* ✅ MOCK complet */}
      
      {/* Tax Benefits */}
      <TaxBenefitsGrid benefits={investment.taxBenefits} /> {/* ✅ MOCK */}
      
      {/* Payment Plan */}
      <PaymentSchedule stages={financing.paymentPlan} /> {/* ✅ MOCK */}
      
      {/* Banques */}
      <BankPartners partners={financing.partners} /> {/* ✅ MOCK */}
      
      {/* Frais */}
      <FeesBreakdown fees={price.fees} /> {/* ✅ MOCK */}
    </>
  );
}
```

**Design:**
- Metrics cards avec icones
- Golden Visa avec checkbox avantages
- Timeline échéancier visuel
- Logos banques avec specs (LTV, taux)

---

### 3️⃣ Section 10 - Preuve Sociale (PRIORITÉ #3)

**Impact:** +68% conversion avec vidéos

```jsx
function SocialProofSection({ project }) {
  const { testimonials, developer } = project;
  
  return (
    <>
      {/* Carousel Testimonials avec VIDÉOS */}
      <TestimonialsCarousel>
        {testimonials.map(t => (
          <TestimonialCard
            key={t.id}
            name={t.name}                    // "Marie D."
            nationality={t.nationality}      // "France"
            flag={t.flag}                    // "🇫🇷"
            photo={t.photo}                  // Photo URL
            videoUrl={t.videoUrl}            // ✅ MOCK - YouTube URL
            videoThumbnail={t.videoThumbnail} // ✅ MOCK
            text={t.text}                    // Témoignage complet
            rating={t.rating}                // 5 étoiles
            verified={t.verified}            // true
          />
        ))}
      </TestimonialsCarousel>
      
      {/* Stats Promoteur */}
      <DeveloperStats stats={developer.stats} /> {/* ✅ MOCK */}
      
      {/* Prix */}
      <AwardsGrid awards={developer.awards} /> {/* ✅ MOCK */}
      
      {/* Presse */}
      <PressGrid articles={developer.press} /> {/* ✅ MOCK */}
    </>
  );
}
```

**Design CRITIQUE:**
- Vidéo testimonials OBLIGATOIRES (conversion +68%)
- Carousel avec play button overlay
- Badge "Vérifié" pour crédibilité
- Stats en grille 2x2 ou 4x1
- Logos awards + press

---

### 4️⃣ Autres Sections (Ordre)

4. **Section 4 - Architecture** (`project.architecture`)
5. **Section 6 - Lifestyle** (`project.lifestyle`)
6. **Section 8 - Spécifications** (`project.specifications`)
7. **Section 9 - Timeline** (`project.timeline`)
8. **Section 2 - Vision & Opportunité**
9. **Section 11 - Promoteur & Track Record**
10. **Section 12 - Contact & CTAs**

Exemples code disponibles dans `docs/mock-data-examples.md`

---

## 🎨 Design System - Mediterranean Minimalism

### Couleurs

```javascript
// Palette stricte - NE PAS dévier
const colors = {
  terracotta: {
    50: '#FFF5F0',
    100: '#FFE8DC',
    500: '#E07856',
    700: '#C85A35',
    900: '#8B3A1F'
  },
  mediterranean: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    500: '#0EA5E9',
    700: '#0369A1'
  },
  sand: {
    50: '#FAFAF8',
    100: '#F5F5F0',
    500: '#D4D1C6'
  },
  neutral: {
    600: '#52525B',
    700: '#3F3F46',
    900: '#18181B'
  }
};
```

### Typographie

```css
/* Headings - Serif (Playfair Display ou similaire) */
h1, h2, h3 {
  font-family: 'Playfair Display', serif;
  color: var(--terracotta-900);
}

/* Body - Sans (Inter ou similaire) */
body, p, span {
  font-family: 'Inter', sans-serif;
  color: var(--neutral-700);
}
```

### Composants Clés

- **Cards**: `rounded-lg shadow-lg bg-white`
- **Buttons Primary**: `bg-terracotta-700 hover:bg-terracotta-900 text-white`
- **Buttons Secondary**: `border-2 border-terracotta-700 text-terracotta-700`
- **Badges**: Pill shape avec couleurs sémantiques
- **Spacing**: Utiliser système 8px (8, 16, 24, 32, 48, 64)

### 🚫 INTERDICTIONS STRICTES

❌ **AUCUN emoji dans le design**  
❌ Pas de dégradés criards  
❌ Pas de néons/fluo  
❌ Pas de Comic Sans ou fonts fantaisistes  

---

## ✅ Checklist Développement

### Setup Initial
- [ ] `enrichProjectData` importé
- [ ] Test sur 1 projet existant
- [ ] Vérification console (warning mock data)

### Sections Prioritaires
- [ ] Section 5 - Plans (floorplans, stock)
- [ ] Section 7 - Financement (Golden Visa, banques)
- [ ] Section 10 - Testimonials (VIDÉOS obligatoires)

### Sections Secondaires
- [ ] Section 4 - Architecture
- [ ] Section 6 - Lifestyle
- [ ] Section 8 - Spécifications
- [ ] Section 9 - Timeline

### Finitions
- [ ] Section 2 - Vision
- [ ] Section 11 - Promoteur
- [ ] Section 12 - Contact & CTAs
- [ ] Sticky elements (Contact, WhatsApp)

### Design
- [ ] Mediterranean Minimalism respecté
- [ ] Responsive mobile complet
- [ ] Images optimisées (Next.js Image)
- [ ] Animations subtiles (pas too much)
- [ ] Accessibility (contraste, alt text)

### Tests
- [ ] Navigation smooth entre sections
- [ ] CTAs fonctionnels
- [ ] Formulaire contact
- [ ] Performance (<3s LCP)
- [ ] SEO metadata

---

## 🐛 Débogage

### Vérifier enrichissement

```javascript
import { mockHelpers } from '@/utils/mockProjectEnrichment';

// Dans votre composant
const project = enrichProjectData(baseProject);

// Vérifier si mock
console.log('Using mock?', mockHelpers.isMockData(project));
console.log('Mock sections:', project.meta.mockDataSections);

// Afficher warning dev
mockHelpers.logMockWarning(project);
```

### Tester en local

```bash
# Valider mock enrichment
node scripts/test-mock-enrichment.js

# Devrait afficher:
# ✅ ALL VALIDATION TESTS PASSED!
```

### Erreurs communes

**Erreur:** `enrichProjectData is not a function`  
**Fix:** Vérifier import path `@/utils/mockProjectEnrichment`

**Erreur:** `Cannot read property 'unitTypes' of undefined`  
**Fix:** Passer `baseProject` à `enrichProjectData()`

**Erreur:** `floorPlan2D` undefined  
**Fix:** Utiliser `enrichProjectData()` pas juste `baseProject`

---

## 📚 Resources

**Documentation complète:**
- `docs/implementation-guide.md` - Guide étape par étape
- `docs/mock-data-examples.md` - Exemples code toutes sections
- `docs/database-migration-phase2.md` - Futur migration BDD

**Code source:**
- `utils/mockProjectEnrichment.js` - Logique enrichissement
- `types/mock-enrichment.ts` - Types TypeScript
- `utils/mockValidation.js` - Tests validation

---

## ❓ Questions

**Q: Puis-je modifier le mock data?**  
R: Oui! Éditer `utils/mockProjectEnrichment.js`

**Q: Comment ajouter mes propres champs mock?**  
R: Ajouter dans fonction `enrichProjectData()`, section concernée

**Q: Quand remplacer par vraies données?**  
R: Phase 3, après validation UX et migration BDD

**Q: Mock data sécurisé pour production?**  
R: Oui pour beta/demo. Ajouter disclaimer visible.

---

## 🎯 Objectif Phase 1

✅ Développer page template complète  
✅ Tester UX avec données réalistes  
✅ Valider design Mediterranean Minimalism  
✅ Préparer démo client  

**Cible conversion:** 7%+ (vs 2-3% standard)

---

**Bon développement Bolt! 🚀**

En cas de blocage, consulter `docs/implementation-guide.md` ou `docs/mock-data-examples.md`