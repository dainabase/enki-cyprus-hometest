# Guide d'Implémentation - Page Template NKREALTY

## 📋 Vue d'ensemble

Guide complet pour implémenter le système de page template haute conversion sur 3 phases.

**Statut actuel:** ✅ Phase 1 (Mock Data)
**Prochain:** Phase 2 (Migration BDD)
**Final:** Phase 3 (Données Réelles + Optimisation)

---

## 🎯 Phase 1 - Utilisation Mock Data Enrichment (ACTUEL)

### Installation & Setup

#### 1. Importer la fonction d'enrichissement

```javascript
// Dans votre composant page projet
import { enrichProjectData, mockHelpers } from '@/utils/mockProjectEnrichment';
```

#### 2. Enrichir données projet Supabase

```javascript
// Exemple dans un Server Component Next.js
import { createClient } from '@/lib/supabase/server';
import { enrichProjectData } from '@/utils/mockProjectEnrichment';

export default async function ProjectPage({ params }) {
  const supabase = createClient();
  
  // Récupérer projet de base depuis Supabase
  const { data: baseProject } = await supabase
    .from('projects')
    .select(`
      *,
      developer:developers(*),
      properties(*),
      project_amenities(
        amenity:amenities(*)
      )
    `)
    .eq('id', params.id)
    .single();
  
  // Enrichir avec mock data
  const enrichedProject = enrichProjectData(baseProject);
  
  // Logger warning en dev
  mockHelpers.logMockWarning(enrichedProject);
  
  return <ProjectTemplate project={enrichedProject} />;
}
```

#### 3. Utiliser données enrichies dans composants

```javascript
// Section 5 - Plans
function PlansSection({ project }) {
  const { unitTypes } = project;
  
  return (
    <section>
      {unitTypes.map(unit => (
        <UnitCard
          key={unit.id}
          name={unit.name}
          floorPlan2D={unit.floorPlan2D}  // ✅ Mock si manquant
          floorPlan3D={unit.floorPlan3D}  // ✅ Mock si manquant
          surfaceTotal={unit.surfaceTotal} // ✅ Mock calculé
          availableCount={unit.availableCount} // ✅ Mock
          orientation={unit.orientation}
          pricePerSqm={unit.pricePerSqm}
        />
      ))}
    </section>
  );
}

// Section 7 - Financement
function FinancingSection({ project }) {
  const { investment, financing, price } = project;
  
  return (
    <section>
      <InvestmentHighlights
        rentalYield={investment.rentalYield}
        rentalMonthly={investment.rentalPriceMonthly} // ✅ Mock
        appreciation={investment.appreciationHistorical} // ✅ Mock
        goldenVisa={investment.goldenVisaDetails} // ✅ Mock complet
        taxBenefits={investment.taxBenefits} // ✅ Mock
      />
      
      <PaymentPlan
        schedule={financing.paymentPlan} // ✅ Mock
        partners={financing.partners} // ✅ Mock
      />
      
      <PriceBreakdown fees={price.fees} /> {/* ✅ Mock */}
    </section>
  );
}

// Section 10 - Preuve Sociale
function TestimonialsSection({ project }) {
  const { testimonials, developer } = project;
  
  return (
    <section>
      <TestimonialsCarousel
        testimonials={testimonials} // ✅ Mock avec vidéos
      />
      
      <DeveloperCredibility
        stats={developer.stats} // ✅ Mock
        awards={developer.awards} // ✅ Mock
        press={developer.press} // ✅ Mock
      />
    </section>
  );
}
```

### Vérifier Mock vs Réel

```javascript
import { mockHelpers } from '@/utils/mockProjectEnrichment';

function DevWarningBanner({ project }) {
  if (process.env.NODE_ENV !== 'development') return null;
  if (!mockHelpers.isMockData(project)) return null;
  
  return (
    <div className="bg-yellow-100 p-4 border-l-4 border-yellow-500">
      ⚠️ MOCK DATA ACTIF
      <ul className="text-sm mt-2">
        {project.meta.mockDataSections.map(section => (
          <li key={section}>• {section}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Avantages Phase 1

✅ **Développement immédiat** - Bolt peut créer toutes sections maintenant
✅ **UX complète** - Tester flow utilisateur avec données réalistes
✅ **Pas de blocage** - Équipe frontend autonome
✅ **Données cohérentes** - Mock suivent structure finale
✅ **Performance** - Pas de requêtes BDD complexes pendant dev

---

## 🔧 Phase 2 - Migration Base de Données

### Préparation

#### 1. Backup base actuelle

```bash
# Via Supabase CLI
supabase db dump -f backup-pre-migration.sql

# Ou via dashboard: Database → Backups → Create backup
```

#### 2. Créer environnement staging

```bash
# Dupliquer projet production
supabase projects create nkrealty-staging

# Importer dump
supabase db push --project-ref <staging-ref>
```

### Exécution Migrations

#### Option A: Via Supabase Dashboard (Recommandé)

1. **Database** → **SQL Editor** → **New Query**
2. Copier contenu `migrations/001_add_floorplans_to_properties.sql`
3. **Run** → Vérifier succès
4. Répéter pour chaque migration dans l'ordre

#### Option B: Via CLI

```bash
# Se connecter au projet
supabase link --project-ref ccsakftsslurjgnjwdci

# Exécuter migrations P0 (critiques)
supabase db execute migrations/001_add_floorplans_to_properties.sql
supabase db execute migrations/002_add_investment_fields_to_projects.sql
supabase db execute migrations/003_create_testimonials_table.sql
supabase db execute migrations/004_add_developer_stats.sql
supabase db execute migrations/005_create_awards_table.sql
supabase db execute migrations/006_create_press_mentions_table.sql

# Vérifier après chaque migration
supabase db diff
```

### Validation Post-Migration

#### Test queries critiques

```sql
-- Test 1: Vérifier nouvelles colonnes properties
SELECT 
  property_code,
  floor_plan_2d,
  floor_plan_3d,
  surface_total
FROM properties
LIMIT 5;

-- Test 2: Vérifier table testimonials créée
SELECT COUNT(*) FROM testimonials;

-- Test 3: Vérifier champs investment projects
SELECT 
  title,
  rental_price_monthly_estimate,
  golden_visa_details,
  tax_benefits
FROM projects
LIMIT 1;

-- Test 4: Vérifier foreign keys
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_name IN ('testimonials', 'awards', 'press_mentions');
```

### Mise à jour Types TypeScript

```bash
# Regénérer types depuis schéma Supabase
supabase gen types typescript --project-id ccsakftsslurjgnjwdci > types/supabase.ts
```

---

## 📊 Phase 3 - Peuplement Données Réelles

### 3A - Interface Admin (Recommandé)

#### Créer formulaires admin

```javascript
// app/admin/projects/[id]/testimonials/page.jsx
import { createClient } from '@/lib/supabase/server';

export default function TestimonialsAdmin({ params }) {
  async function addTestimonial(formData) {
    'use server';
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('testimonials')
      .insert({
        project_id: params.id,
        name: formData.get('name'),
        nationality: formData.get('nationality'),
        text: formData.get('text'),
        rating: parseInt(formData.get('rating')),
        video_url: formData.get('videoUrl'),
        verified: true
      });
      
    if (error) throw error;
    revalidatePath(`/admin/projects/${params.id}`);
  }
  
  return (
    <form action={addTestimonial}>
      {/* Formulaire complet */}
    </form>
  );
}
```

### 3B - Import Progressif

#### Stratégie de remplacement

1. **Commencer par Section 10** (Preuve Sociale)
   - Impact conversion immédiat (+68%)
   - Données faciles à collecter
   - Validation rapide

2. **Puis Section 7** (Financement)
   - Partenaires bancaires réels
   - Calculs ROI précis
   - Golden Visa détails légaux

3. **Enfin Section 5** (Plans)
   - Upload plans architecte
   - Photos 3D professionnelles
   - Données stock temps réel

#### Basculement Mock → Réel

```javascript
// Modifier enrichProjectData pour détecter données réelles
export const enrichProjectData = (baseProject) => {
  return {
    ...baseProject,
    
    // Ne mock QUE si données manquantes
    unitTypes: baseProject.properties?.length > 0 
      ? formatRealUnitTypes(baseProject.properties) // ✅ Données réelles
      : generateMockUnitTypes(baseProject),          // ❌ Fallback mock
    
    testimonials: baseProject.testimonials?.length > 0
      ? baseProject.testimonials                      // ✅ Données réelles
      : generateMockTestimonials(baseProject),       // ❌ Fallback mock
    
    // Etc pour chaque section...
  };
};
```

### 3C - Tests A/B

#### Setup Vercel Analytics

```javascript
// app/layout.jsx
import { Analytics } from '@vercel/analytics/react';

export default function Layout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

#### Tracker conversions

```javascript
import { track } from '@vercel/analytics';

function ContactCTA({ project }) {
  const handleContact = () => {
    track('contact_initiated', {
      project_id: project.id,
      section: 'cta_sticky',
      data_source: mockHelpers.isMockData(project) ? 'mock' : 'real'
    });
    
    // Ouvrir formulaire...
  };
  
  return <button onClick={handleContact}>Contactez-nous</button>;
}
```

---

## 🎯 Checklist Complète

### Phase 1 ✅

- [x] Mock enrichment créé
- [x] Documentation migration rédigée
- [x] Guide implémentation rédigé
- [x] Exemples code fournis
- [ ] Bolt développe sections prioritaires avec mock
- [ ] Tests UX complets

### Phase 2 (À faire)

- [ ] Backup BDD production
- [ ] Environnement staging créé
- [ ] Migrations P0 exécutées staging
- [ ] Tests validation réussis staging
- [ ] Migrations P0 exécutées production
- [ ] Types TypeScript regénérés
- [ ] Documentation API mise à jour
- [ ] Tests end-to-end passent

### Phase 3 (À faire)

- [ ] Interface admin testimonials créée
- [ ] Interface admin awards créée
- [ ] Interface admin plans créée
- [ ] Premier projet avec données 100% réelles
- [ ] Tests A/B configurés
- [ ] Métriques conversion trackées
- [ ] Optimisations finales

---

## 🚨 Points d'Attention

### Sécurité

- **RLS Policies** à configurer pour nouvelles tables
- **Uploads fichiers** (plans, photos) via Supabase Storage
- **Validation données** côté serveur obligatoire

### Performance

- **Lazy loading** images plans/testimonials
- **CDN** pour assets statiques
- **Caching** requêtes Supabase avec `revalidate`
- **Images optimisées** avec Next.js Image

### SEO

- **Metadata dynamique** par projet
- **Schema.org** structured data
- **Open Graph** images personnalisées
- **Sitemap** mis à jour automatiquement

---

## 📞 Support

### Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Mediterranean Minimalism Design System](./design-system.md)

### Questions Fréquentes

**Q: Puis-je utiliser mock en production temporairement?**
R: Oui, tant que projet beta. Ajouter disclaimer visible.

**Q: Comment prioriser imports données réelles?**
R: Section 10 → 7 → 5 (ordre impact conversion)

**Q: Rollback si problème migration?**
R: Scripts rollback fournis dans `database-migration-phase2.md`

**Q: Performance avec mock vs réel?**
R: Mock = plus rapide car calcul JS. Réel = requêtes BDD mais cachées.

---

**Document créé:** Phase 1
**Dernière mise à jour:** 2025-01-04
**Version:** 1.0.0