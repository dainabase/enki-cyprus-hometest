# Exemples Mock Data - Page Template NKREALTY

## 📋 Vue d'ensemble

Ce document fournit des exemples concrets d'utilisation du mock data enrichment pour chaque section de la page template.

---

## 🏗️ Section 1 - Hero Prestige (FAIT)

**Status:** ✅ Déjà développé par Bolt

```javascript
// Données utilisées (déjà dans BDD)
const heroData = {
  title: project.title,
  subtitle: project.subtitle,
  location: `${project.city}, ${project.region}`,
  priceFrom: project.price_from,
  photos: project.photos.filter(p => p.category === 'hero'),
  tags: ['Golden Visa', 'Vue Mer', 'Livraison 2026']
};
```

---

## 🌍 Section 3 - Localisation Split View (FAIT)

**Status:** ✅ Déjà développé par Bolt

```javascript
// Utilise project_nearby_amenities existant
const locationData = {
  gps: {
    lat: project.gps_latitude,
    lng: project.gps_longitude
  },
  proximities: project.project_nearby_amenities.map(p => ({
    name: p.nearby_amenity.name,
    distance: p.distance_km,
    walkTime: p.distance_minutes_walk,
    driveTime: p.distance_minutes_drive
  }))
};
```

---

## 📐 Section 5 - Plans & Typologies (PRIORITÉ #1)

### Mock Data Complet

```javascript
import { enrichProjectData } from '@/utils/mockProjectEnrichment';

const enriched = enrichProjectData(baseProject);

// enriched.unitTypes contient:
[
  {
    id: 'apt-2br',
    type: 'Apartment',
    name: 'Appartement 2 Chambres',
    bedrooms: 2,
    bathrooms: 2,
    
    // ❌ MOCK - Champs manquants BDD
    floorPlan2D: '/assets/floorplans/2br-2d.pdf',
    floorPlan3D: '/assets/floorplans/2br-3d.jpg',
    floorPlanThumbnail: '/assets/floorplans/2br-thumb.jpg',
    
    // Surfaces
    internalArea: 85,
    coveredVerandas: 18,
    uncoveredVerandas: 0,
    surfaceTotal: 103, // ❌ MOCK - calculé
    
    // Prix
    priceFrom: 382500, // basePrice * 0.85
    priceTo: 427500,   // basePrice * 0.95
    pricePerSqm: 3738, // calculé
    
    // Stock
    totalUnits: 12,
    availableCount: 5,  // ❌ MOCK - temps réel
    soldCount: 4,
    reservedCount: 3,
    status: 'Disponible', // ❌ MOCK
    
    orientation: 'Sud', // ✅ Existe properties.orientation
    
    parkingSpaces: 1,
    storageRoom: true,
    features: [
      'Open plan living',
      'Master bedroom en-suite',
      'Grande terrasse couverte 18m²',
      'Vue mer partielle',
      'Cuisine équipée'
    ]
  },
  // ... autres types (3BR, Penthouse)
]
```

### Composant Exemple

```jsx
function PlansSection({ project }) {
  const { unitTypes } = project;
  
  return (
    <section className="py-16 bg-sand-50">
      <h2 className="text-4xl font-serif text-terracotta-900 mb-12">
        Plans & Typologies
      </h2>
      
      <div className="grid md:grid-cols-3 gap-8">
        {unitTypes.map(unit => (
          <div key={unit.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Thumbnail plan */}
            <div className="relative h-64">
              <Image
                src={unit.floorPlanThumbnail}
                alt={unit.name}
                fill
                className="object-cover"
              />
              
              {/* Badge disponibilité */}
              <div className="absolute top-4 right-4">
                <Badge variant={unit.status === 'Disponible' ? 'success' : 'warning'}>
                  {unit.availableCount} disponibles
                </Badge>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-2xl font-serif mb-2">{unit.name}</h3>
              
              {/* Specs */}
              <div className="flex gap-4 text-sm text-neutral-600 mb-4">
                <span>🛏️ {unit.bedrooms} ch.</span>
                <span>🚿 {unit.bathrooms} sdb.</span>
                <span>📏 {unit.surfaceTotal}m²</span>
              </div>
              
              {/* Prix */}
              <div className="mb-4">
                <p className="text-3xl font-bold text-terracotta-700">
                  €{unit.priceFrom.toLocaleString()}
                </p>
                <p className="text-sm text-neutral-500">
                  {unit.pricePerSqm.toLocaleString()}€/m²
                </p>
              </div>
              
              {/* CTAs */}
              <div className="flex gap-2">
                <Button variant="primary" className="flex-1">
                  Voir plan 3D
                </Button>
                <Button variant="outline">
                  📄 PDF
                </Button>
              </div>
              
              {/* Features */}
              <ul className="mt-4 space-y-1">
                {unit.features.map((f, i) => (
                  <li key={i} className="text-sm text-neutral-600">
                    ✓ {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

---

## 💰 Section 7 - Financement & Investissement (PRIORITÉ #2)

### Mock Data Investment

```javascript
const { investment, financing, price } = enrichProjectData(baseProject);

// investment contient:
{
  // ✅ Existe déjà
  rentalYield: 7.03,           // projects.rental_yield_percent
  goldenVisa: true,            // projects.golden_visa_eligible
  
  // ❌ MOCK ajouté
  rentalPriceMonthly: 2050,    // Calculé: (prix * 6.5%) / 12
  appreciationHistorical: 8.5, // % annuel moyen Cyprus
  
  goldenVisaDetails: {
    minimumInvestment: 300000,
    eligible: true,
    benefits: [
      'Résidence permanente UE pour toute la famille',
      'Liberté circulation Espace Schengen',
      'Pas obligation résidence',
      'Transmission héréditaire'
    ],
    requirements: [
      'Achat immobilier minimum €300,000',
      'Visite Cyprus tous les 2 ans',
      'Casier judiciaire vierge'
    ],
    processingTime: '2-3 mois',
    applicationFee: 500
  },
  
  taxBenefits: [
    {
      type: 'Plus-value',
      description: 'Exonération totale si détention >5 ans',
      savingEstimate: 20 // %
    },
    {
      type: 'Revenus locatifs',
      description: 'Imposition 20% flat (vs 45% France)',
      savingEstimate: 25
    },
    {
      type: 'Succession',
      description: 'Pas de droits succession Cyprus',
      savingEstimate: 100
    }
  ]
}

// financing contient:
{
  partners: [
    {
      name: 'Bank of Cyprus',
      logo: '/assets/banks/boc.svg',
      maxLTV: 70,              // % financement max
      interestRate: 3.5,       // % taux
      termYears: 25,
      description: 'Leader marché chypriote...'
    },
    // ... autres banques
  ],
  
  paymentPlan: [
    {
      stage: 'Réservation',
      percentage: 10,
      amount: 45000,           // Calculé selon prix
      timing: 'À la signature',
      description: 'Dépôt initial pour bloquer unité'
    },
    // ... autres échéances
  ],
  
  downPaymentMin: 30,          // % minimum apport
  flexiblePayment: true
}

// price.fees contient:
{
  vat: 5,                      // ✅ Existe projects.vat_rate
  transfer: 3,                 // ❌ MOCK - frais mutation
  notary: 1.5,                 // ❌ MOCK
  legal: 1,                    // ❌ MOCK
  stamp: 0.15,                 // ❌ MOCK
  
  totalFeesEstimate: {
    percentage: 10.65,
    amount: 47925,             // Calculé
    breakdown: 'TVA 5% + Transfer 3% + Notaire 1.5% + ...'
  }
}
```

### Composant Exemple Investment

```jsx
function InvestmentSection({ project }) {
  const { investment, financing, price } = project;
  
  return (
    <section className="py-16 bg-white">
      <h2 className="text-4xl font-serif text-terracotta-900 mb-12">
        Investissement & Rendement
      </h2>
      
      {/* Highlights */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <MetricCard
          icon="📈"
          value={`${investment.rentalYield}%`}
          label="Rendement locatif"
          subtext={`${investment.rentalPriceMonthly}€/mois`}
        />
        <MetricCard
          icon="💰"
          value={`${investment.appreciationHistorical}%`}
          label="Plus-value historique"
          subtext="Moyenne annuelle"
        />
        <MetricCard
          icon="🇪🇺"
          value="Golden Visa"
          label="Éligible"
          subtext="€300k minimum"
        />
        <MetricCard
          icon="💸"
          value="-25%"
          label="Économie fiscale"
          subtext="vs France"
        />
      </div>
      
      {/* Golden Visa détails */}
      <div className="bg-blue-50 rounded-xl p-8 mb-12">
        <h3 className="text-2xl font-serif mb-4">🇪🇺 Golden Visa Cyprus</h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold mb-3">Avantages</h4>
            <ul className="space-y-2">
              {investment.goldenVisaDetails.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Conditions</h4>
            <ul className="space-y-2">
              {investment.goldenVisaDetails.requirements.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span>•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-4 p-4 bg-white rounded-lg">
              <p className="text-sm">
                <strong>Délai:</strong> {investment.goldenVisaDetails.processingTime}
              </p>
              <p className="text-sm">
                <strong>Frais:</strong> €{investment.goldenVisaDetails.applicationFee}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tax benefits */}
      <div className="mb-12">
        <h3 className="text-2xl font-serif mb-6">Avantages Fiscaux</h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          {investment.taxBenefits.map((benefit, i) => (
            <div key={i} className="border rounded-lg p-6">
              <h4 className="font-semibold text-lg mb-2">{benefit.type}</h4>
              <p className="text-sm text-neutral-600 mb-3">
                {benefit.description}
              </p>
              <div className="text-3xl font-bold text-green-600">
                -{benefit.savingEstimate}%
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Payment plan */}
      <div className="bg-sand-50 rounded-xl p-8">
        <h3 className="text-2xl font-serif mb-6">Échéancier de Paiement</h3>
        
        <div className="space-y-4">
          {financing.paymentPlan.map((stage, i) => (
            <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-terracotta-100 flex items-center justify-center font-bold text-terracotta-700">
                {stage.percentage}%
              </div>
              
              <div className="flex-1">
                <h4 className="font-semibold">{stage.stage}</h4>
                <p className="text-sm text-neutral-600">{stage.description}</p>
              </div>
              
              <div className="text-right">
                <p className="text-xl font-bold">€{stage.amount.toLocaleString()}</p>
                <p className="text-sm text-neutral-500">{stage.timing}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Banques partenaires */}
      <div className="mt-12">
        <h3 className="text-2xl font-serif mb-6">Partenaires Bancaires</h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          {financing.partners.map((bank, i) => (
            <div key={i} className="border rounded-lg p-6">
              <Image src={bank.logo} alt={bank.name} width={120} height={40} className="mb-4" />
              <p className="text-sm text-neutral-600 mb-4">{bank.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Financement max:</span>
                  <strong>{bank.maxLTV}%</strong>
                </div>
                <div className="flex justify-between">
                  <span>Taux:</span>
                  <strong>{bank.interestRate}%</strong>
                </div>
                <div className="flex justify-between">
                  <span>Durée:</span>
                  <strong>{bank.termYears} ans</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## 💬 Section 10 - Preuve Sociale (PRIORITÉ #3)

### Mock Data Testimonials

```javascript
const { testimonials, developer } = enrichProjectData(baseProject);

// testimonials contient:
[
  {
    id: 1,
    name: 'Marie D.',
    nationality: 'France',
    flag: '🇫🇷',
    photo: '/assets/testimonials/marie-d.jpg',
    
    // ❌ MOCK - Vidéo CRITIQUE
    videoUrl: 'https://youtube.com/watch?v=...',
    videoThumbnail: '/assets/testimonials/video-thumb-1.jpg',
    
    text: 'Cherchais résidence UE fiscalement avantageuse. Trouvé qualité de vie + rendement 6.5% + Golden Visa...',
    rating: 5,
    date: '2024-09',
    
    propertyType: '3BR Penthouse',
    location: 'Limassol',
    verified: true
  },
  // ... 3-5 testimonials minimum
]

// developer.stats contient:
{
  revenue: 85000000,              // ❌ MOCK - €85M CA
  employees: 45,                  // ❌ MOCK
  projectsDelivered: 10,          // ✅ Existe developers.total_projects
  familiesSatisfied: 850,         // ❌ MOCK
  unitsBuilt: 1200,               // ❌ MOCK
  yearsFounded: 24,               // Calculé depuis founded_year
  satisfactionRate: 94.5          // ❌ MOCK
}

// developer.awards contient:
[
  {
    name: 'Cyprus Property Awards',
    year: 2024,
    category: 'Best Residential Developer',
    image: '/assets/awards/cpa-2024.png',
    description: '...'
  },
  // ... autres prix
]

// developer.press contient:
[
  {
    mediaName: 'Financial Mirror',
    logo: '/assets/press/financial-mirror.svg',
    articleUrl: 'https://...',
    title: 'Top 10 Developers Cyprus 2024',
    date: '2024-09',
    excerpt: '...'
  },
  // ... autres mentions
]
```

### Composant Exemple Testimonials

```jsx
function TestimonialsSection({ project }) {
  const { testimonials, developer } = project;
  
  return (
    <section className="py-16 bg-sand-50">
      <h2 className="text-4xl font-serif text-terracotta-900 mb-12 text-center">
        Ils ont choisi {developer.name}
      </h2>
      
      {/* Carousel vidéos testimonials */}
      <div className="max-w-6xl mx-auto mb-16">
        <Carousel>
          {testimonials.filter(t => t.videoUrl).map(testimonial => (
            <div key={testimonial.id} className="px-4">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Vidéo */}
                <div className="relative aspect-video">
                  <VideoPlayer
                    url={testimonial.videoUrl}
                    thumbnail={testimonial.videoThumbnail}
                  />
                </div>
                
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <Image
                      src={testimonial.photo}
                      alt={testimonial.name}
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">
                        {testimonial.name} {testimonial.flag}
                      </h4>
                      <p className="text-sm text-neutral-600">
                        {testimonial.propertyType} • {testimonial.location}
                      </p>
                    </div>
                    
                    {testimonial.verified && (
                      <Badge variant="success">✓ Vérifié</Badge>
                    )}
                  </div>
                  
                  {/* Rating */}
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  {/* Texte */}
                  <p className="text-neutral-700 italic">
                    "{testimonial.text}"
                  </p>
                  
                  <p className="text-sm text-neutral-500 mt-3">
                    {new Date(testimonial.date).toLocaleDateString('fr-FR', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
      
      {/* Stats promoteur */}
      <div className="bg-white rounded-xl p-8 mb-12">
        <h3 className="text-2xl font-serif text-center mb-8">Chiffres Clés</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard
            value={developer.stats.yearsFounded}
            label="Années expérience"
            icon="🏆"
          />
          <StatCard
            value={developer.stats.projectsDelivered}
            label="Projets livrés"
            icon="🏗️"
          />
          <StatCard
            value={developer.stats.familiesSatisfied}
            label="Familles satisfaites"
            icon="👨‍👩‍👧‍👦"
          />
          <StatCard
            value={`${developer.stats.satisfactionRate}%`}
            label="Taux satisfaction"
            icon="⭐"
          />
        </div>
      </div>
      
      {/* Awards */}
      <div className="mb-12">
        <h3 className="text-2xl font-serif text-center mb-8">Prix & Distinctions</h3>
        
        <div className="flex flex-wrap justify-center gap-8">
          {developer.awards.map((award, i) => (
            <div key={i} className="text-center">
              <Image
                src={award.image}
                alt={award.name}
                width={120}
                height={120}
                className="mb-3 mx-auto"
              />
              <p className="font-semibold">{award.name}</p>
              <p className="text-sm text-neutral-600">{award.year} • {award.category}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Press mentions */}
      <div>
        <h3 className="text-2xl font-serif text-center mb-8">Dans la Presse</h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          {developer.press.map((article, i) => (
            <a
              key={i}
              href={article.articleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <Image
                src={article.logo}
                alt={article.mediaName}
                width={150}
                height={50}
                className="mb-4"
              />
              
              <h4 className="font-semibold mb-2">{article.title}</h4>
              
              <p className="text-sm text-neutral-600 mb-3">{article.excerpt}</p>
              
              <p className="text-xs text-neutral-500">
                {new Date(article.date).toLocaleDateString('fr-FR')}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## 🎨 Autres Sections - Exemples Rapides

### Section 4 - Architecture

```javascript
const { architecture } = enrichProjectData(baseProject);

// Contient:
{
  style: 'Mediterranean Contemporary',
  architect: 'Studio Architects Ltd',
  description: '...',
  designPrinciples: [
    'Open-plan maximisant lumière',
    'Grandes baies vitrées vue mer',
    '...'
  ],
  renders3D: [
    '/assets/3d/exterior-day.jpg',
    '/assets/3d/exterior-night.jpg'
  ]
}
```

### Section 6 - Lifestyle

```javascript
const { lifestyle } = enrichProjectData(baseProject);

// Contient:
{
  communityVibe: 'Résidentiel haut de gamme...',
  targetAudience: 'Familles expatriées...',
  dailyLife: [
    'Réveil vue mer, café terrasse',
    'Jogging sentiers bord de mer',
    '...'
  ]
}
```

### Section 8 - Spécifications

```javascript
const { specifications } = enrichProjectData(baseProject);

// Contient:
{
  kitchen: {
    brand: 'Italian Design',
    countertop: 'Quartz/Granit',
    appliances: ['Four', 'Plaque induction', '...'],
    finishLevel: 'Premium'
  },
  bathrooms: {
    brand: 'Villeroy & Boch',
    features: ['Douche pluie', '...']
  },
  // ... etc
}
```

### Section 9 - Timeline

```javascript
const { timeline } = enrichProjectData(baseProject);

// Contient:
{
  phases: [
    {
      name: 'Fondations',
      status: 'completed',
      completion: 100,
      startDate: '2024-04',
      endDate: '2024-06'
    },
    // ... autres phases
  ],
  overallCompletion: 45,
  nextMilestone: {
    description: 'Achèvement toiture',
    date: '2025-03-30',
    daysRemaining: 90
  }
}
```

---

## 🧪 Tests & Validation

### Test mock enrichment

```javascript
import { enrichProjectData, mockHelpers } from '@/utils/mockProjectEnrichment';

describe('Mock Project Enrichment', () => {
  test('enrichit données basiques projet', () => {
    const baseProject = {
      id: 'test-1',
      title: 'Test Project',
      price_from: 500000
    };
    
    const enriched = enrichProjectData(baseProject);
    
    expect(enriched.unitTypes).toHaveLength(3);
    expect(enriched.testimonials).toHaveLength(4);
    expect(enriched.investment.rentalPriceMonthly).toBeGreaterThan(0);
    expect(enriched.developer.stats.revenue).toBeDefined();
  });
  
  test('détecte mock data', () => {
    const enriched = enrichProjectData({ id: '1' });
    expect(mockHelpers.isMockData(enriched)).toBe(true);
    expect(enriched.meta.mockDataSections).toContain('unitTypes');
  });
});
```

---

**Document créé:** Phase 1
**Dernière mise à jour:** 2025-01-04
**Version:** 1.0.0