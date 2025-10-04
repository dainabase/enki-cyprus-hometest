/**
 * NKREALTY - Mock Data Enrichment System
 * Phase 1: Comble les lacunes BDD pour débloquer développement des 12 sections
 * 
 * Usage:
 *   import { enrichProjectData } from './utils/mockProjectEnrichment';
 *   const enrichedProject = enrichProjectData(baseProjectFromSupabase);
 */

/**
 * Enrichit les données d'un projet avec mock data pour toutes les sections
 * @param {Object} baseProject - Projet de base depuis Supabase
 * @returns {Object} Projet enrichi avec tous les champs nécessaires
 */
export const enrichProjectData = (baseProject) => {
  if (!baseProject) {
    throw new Error('baseProject is required');
  }

  return {
    ...baseProject,
    
    // ============================================
    // SECTION 5 - PLANS & TYPOLOGIES (PRIORITÉ #1)
    // ============================================
    unitTypes: generateMockUnitTypes(baseProject),
    
    // ============================================
    // SECTION 7 - FINANCEMENT & INVESTISSEMENT (PRIORITÉ #2)
    // ============================================
    investment: {
      // Données existantes
      rentalYield: baseProject.rental_yield_percent || 7.03,
      goldenVisa: baseProject.golden_visa_eligible || true,
      
      // Mock data manquant
      rentalPriceMonthly: calculateEstimatedRent(baseProject.price_from || 450000),
      appreciationHistorical: 8.5, // %/an moyenne Cyprus 2020-2024
      goldenVisaDetails: {
        minimumInvestment: 300000,
        eligible: baseProject.golden_visa_eligible || true,
        benefits: [
          'Résidence permanente UE pour toute la famille',
          'Liberté de circulation Espace Schengen',
          'Pas d\'obligation de résidence',
          'Transmission héréditaire',
          'Accès système éducatif européen'
        ],
        requirements: [
          'Achat immobilier minimum €300,000',
          'Visite Cyprus tous les 2 ans',
          'Casier judiciaire vierge',
          'Assurance santé'
        ],
        processingTime: '2-3 mois',
        applicationFee: 500
      },
      taxBenefits: [
        {
          type: 'Plus-value',
          description: 'Exonération totale si détention >5 ans',
          savingEstimate: 20 // % du gain
        },
        {
          type: 'Revenus locatifs',
          description: 'Imposition 20% flat (vs 45% France)',
          savingEstimate: 25 // % d\'économie
        },
        {
          type: 'Succession',
          description: 'Pas de droits de succession Cyprus',
          savingEstimate: 100
        },
        {
          type: 'TVA réduite',
          description: '5% au lieu de 19% pour première résidence',
          savingEstimate: 14
        }
      ]
    },
    
    financing: {
      // Données existantes partielles
      partners: baseProject.bank_partners || [
        {
          name: 'Bank of Cyprus',
          logo: '/assets/banks/boc.svg',
          maxLTV: 70,
          interestRate: 3.5,
          termYears: 25,
          description: 'Leader marché chypriote, conditions préférentielles résidents UE'
        },
        {
          name: 'Hellenic Bank',
          logo: '/assets/banks/hellenic.svg',
          maxLTV: 65,
          interestRate: 3.8,
          termYears: 20,
          description: 'Banque historique, excellent service clientèle français'
        },
        {
          name: 'Alpha Bank Cyprus',
          logo: '/assets/banks/alpha.svg',
          maxLTV: 60,
          interestRate: 4.0,
          termYears: 20,
          description: 'Groupe grec international, expertise investisseurs étrangers'
        }
      ],
      aidsPTZ: false, // Pas de PTZ à Cyprus
      paymentPlan: baseProject.payment_plan?.length > 0 ? baseProject.payment_plan : [
        {
          stage: 'Réservation',
          percentage: 10,
          amount: (baseProject.price_from || 450000) * 0.10,
          timing: 'À la signature',
          description: 'Dépôt initial pour bloquer l\'unité'
        },
        {
          stage: 'Contrat',
          percentage: 20,
          amount: (baseProject.price_from || 450000) * 0.20,
          timing: '30 jours après réservation',
          description: 'Signature contrat de vente'
        },
        {
          stage: 'Fondations',
          percentage: 20,
          amount: (baseProject.price_from || 450000) * 0.20,
          timing: 'Achèvement fondations',
          description: 'Premier versement construction'
        },
        {
          stage: 'Structure',
          percentage: 20,
          amount: (baseProject.price_from || 450000) * 0.20,
          timing: 'Gros œuvre terminé',
          description: 'Deuxième versement construction'
        },
        {
          stage: 'Livraison',
          percentage: 30,
          amount: (baseProject.price_from || 450000) * 0.30,
          timing: 'Remise des clés',
          description: 'Solde final'
        }
      ],
      downPaymentMin: 30, // %
      flexiblePayment: true,
      description: 'Échelonnement personnalisable selon avancement chantier'
    },
    
    price: {
      ...baseProject.price,
      fees: {
        vat: baseProject.vat_rate || 5, // % - existe déjà
        transfer: 3, // % - frais de mutation Cyprus
        notary: 1.5, // % - frais notaire
        legal: 1, // % - honoraires avocat
        stamp: 0.15 // % - droits de timbre
      },
      totalFeesEstimate: {
        percentage: 10.65,
        amount: (baseProject.price_from || 450000) * 0.1065,
        breakdown: 'TVA 5% + Transfer 3% + Notaire 1.5% + Avocat 1% + Timbre 0.15%'
      }
    },
    
    // ============================================
    // SECTION 10 - PREUVE SOCIALE (PRIORITÉ #3)
    // ============================================
    testimonials: [
      {
        id: 1,
        name: 'Marie D.',
        nationality: 'France',
        flag: '🇫🇷',
        photo: '/assets/testimonials/marie-d.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=placeholder-1',
        videoThumbnail: '/assets/testimonials/video-thumb-1.jpg',
        text: 'Cherchais résidence UE fiscalement avantageuse. Trouvé qualité de vie méditerranéenne + rendement locatif 6.5% + Golden Visa. Équipe NKREALTY francophone exceptionnelle.',
        rating: 5,
        date: '2024-09',
        propertyType: '3BR Penthouse',
        location: baseProject.city || 'Limassol',
        verified: true
      },
      {
        id: 2,
        name: 'Thomas K.',
        nationality: 'Belgique',
        flag: '🇧🇪',
        photo: '/assets/testimonials/thomas-k.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=placeholder-2',
        videoThumbnail: '/assets/testimonials/video-thumb-2.jpg',
        text: 'Investissement locatif Cyprus = best deal. Fiscalité 20% vs 50% Belgique. Après 3 ans, revente +28%. Parfait pour patrimoine famille.',
        rating: 5,
        date: '2024-06',
        propertyType: '2BR Apartment',
        location: baseProject.city || 'Limassol',
        verified: true
      },
      {
        id: 3,
        name: 'Alexandra P.',
        nationality: 'Suisse',
        flag: '🇨🇭',
        photo: '/assets/testimonials/alexandra-p.jpg',
        text: 'Retraite anticipée Cyprus. Qualité construction supérieure Suisse, prix 60% moins cher. Plage 5min à pied. Rêve devenu réalité.',
        rating: 5,
        date: '2024-03',
        propertyType: 'Villa 4BR',
        location: baseProject.city || 'Limassol',
        verified: true
      },
      {
        id: 4,
        name: 'Jean-Luc M.',
        nationality: 'France',
        flag: '🇫🇷',
        photo: '/assets/testimonials/jean-luc-m.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=placeholder-3',
        videoThumbnail: '/assets/testimonials/video-thumb-3.jpg',
        text: 'Entrepreneur digital. Cyprus = hub tech + soleil 300j/an. Loyer couvre crédit. Golden Visa = mobilité totale. Game changer.',
        rating: 5,
        date: '2024-01',
        propertyType: '1BR Studio',
        location: baseProject.city || 'Limassol',
        verified: true
      }
    ],
    
    developer: {
      ...baseProject.developer,
      stats: {
        revenue: 85000000, // €85M - estimation
        employees: 45,
        projectsDelivered: baseProject.developer?.total_projects || 10,
        familiesSatisfied: 850,
        unitsBuilt: 1200,
        yearsFounded: new Date().getFullYear() - (baseProject.developer?.founded_year || 2001),
        satisfactionRate: 94.5 // %
      },
      awards: [
        {
          name: 'Cyprus Property Awards',
          year: 2024,
          category: 'Best Residential Developer',
          image: '/assets/awards/cpa-2024.png',
          description: 'Reconnaissance excellence construction résidentielle'
        },
        {
          name: 'European Property Awards',
          year: 2023,
          category: '5-Star Development',
          image: '/assets/awards/epa-2023.png',
          description: 'Standard européen qualité et durabilité'
        },
        {
          name: 'Green Building Certification',
          year: 2023,
          category: 'Excellence Environnementale',
          image: '/assets/awards/green-cert.png',
          description: 'Construction éco-responsable certifiée'
        }
      ],
      press: [
        {
          mediaName: 'Financial Mirror',
          logo: '/assets/press/financial-mirror.svg',
          articleUrl: 'https://financial-mirror.com/placeholder',
          title: 'Top 10 Developers Cyprus 2024',
          date: '2024-09',
          excerpt: 'Classé parmi les promoteurs les plus fiables...'
        },
        {
          mediaName: 'Cyprus Mail',
          logo: '/assets/press/cyprus-mail.svg',
          articleUrl: 'https://cyprus-mail.com/placeholder',
          title: 'Innovation Construction Durable',
          date: '2024-06',
          excerpt: 'Pionnier techniques construction écologique...'
        },
        {
          mediaName: 'Kathimerini',
          logo: '/assets/press/kathimerini.svg',
          articleUrl: 'https://kathimerini.com/placeholder',
          title: 'Record Ventes Q2 2024',
          date: '2024-07',
          excerpt: 'Meilleure performance marché résidentiel...'
        }
      ]
    },
    
    // ============================================
    // AUTRES SECTIONS - Enrichissement complémentaire
    // ============================================
    
    // Section 4 - Architecture & Design
    architecture: {
      style: baseProject.design_style || 'Mediterranean Contemporary',
      architect: baseProject.architect_name || 'Studio Architects Ltd',
      architectLicense: baseProject.architect_license_number || 'CYP-ARCH-2024-456',
      description: 'Architecture contemporaine inspirée tradition méditerranéenne, maximisant lumière naturelle et vues panoramiques',
      designPrinciples: [
        'Open-plan living maximisant espace et luminosité',
        'Grandes baies vitrées vue mer/montagne',
        'Terrasses généreuses prolongeant intérieur',
        'Matériaux nobles locaux (pierre, bois)',
        'Integration paysage naturel'
      ],
      renders3D: [
        '/assets/3d/exterior-day.jpg',
        '/assets/3d/exterior-night.jpg',
        '/assets/3d/aerial-view.jpg',
        '/assets/3d/pool-area.jpg'
      ]
    },
    
    // Section 6 - Équipements & Lifestyle
    lifestyle: {
      communityVibe: 'Résidentiel haut de gamme, atmosphère familiale internationale',
      targetAudience: 'Familles expatriées, retraités actifs, investisseurs avertis',
      dailyLife: [
        'Réveil vue mer, café terrasse panoramique',
        'Jogging sentiers bord de mer',
        'Coworking space résidents entrepreneurs',
        'Piscine infinity après-midi',
        'Dîner restaurants pieds dans l\'eau',
        'Événements communauté résidents'
      ]
    },
    
    // Section 8 - Finitions & Spécifications
    specifications: {
      kitchen: {
        brand: 'Italian Design',
        countertop: 'Quartz/Granit',
        appliances: ['Four encastré', 'Plaque induction', 'Hotte aspirante', 'Lave-vaisselle'],
        finishLevel: 'Premium'
      },
      bathrooms: {
        brand: 'Villeroy & Boch / Hansgrohe',
        fixtures: 'Haute qualité européenne',
        features: ['Douche pluie', 'Robinetterie thermostatique', 'Meubles suspendus']
      },
      flooring: {
        living: 'Carrelage grand format effet marbre',
        bedrooms: 'Parquet stratifié résistant',
        bathrooms: 'Carrelage anti-dérapant'
      },
      windows: {
        type: 'Double vitrage PVC/Aluminium',
        features: ['Isolation thermique A+', 'Isolation acoustique', 'Volets électriques']
      },
      hvac: {
        type: 'VRV climatisation réversible',
        heating: baseProject.has_underfloor_heating ? 'Chauffage sol + VRV' : 'VRV split units',
        control: 'Thermostat intelligent par pièce'
      },
      security: {
        door: 'Porte blindée certifiée',
        intercom: 'Vidéophone connecté',
        alarm: 'Pré-installation système alarme',
        cctv: baseProject.has_cctv ? '24/7 surveillance périmètre' : 'Optionnel'
      }
    },
    
    // Section 9 - Calendrier & Avancement
    timeline: {
      phases: [
        {
          name: 'Permis & Préparation',
          status: 'completed',
          startDate: '2024-01',
          endDate: '2024-03',
          completion: 100,
          milestones: ['Permis construction obtenu', 'Terrassement achevé']
        },
        {
          name: 'Fondations',
          status: 'completed',
          startDate: '2024-04',
          endDate: '2024-06',
          completion: 100,
          milestones: ['Fondations coulées', 'Inspection validée']
        },
        {
          name: 'Structure & Gros Œuvre',
          status: 'in_progress',
          startDate: '2024-07',
          endDate: '2025-03',
          completion: 65,
          milestones: ['3 étages sur 5 achevés', 'Toiture prévue fin Q1 2025']
        },
        {
          name: 'Second Œuvre',
          status: 'upcoming',
          startDate: '2025-04',
          endDate: '2025-12',
          completion: 0,
          milestones: ['Installation électrique', 'Plomberie', 'Climatisation']
        },
        {
          name: 'Finitions & Livraison',
          status: 'upcoming',
          startDate: '2026-01',
          endDate: '2026-06',
          completion: 0,
          milestones: ['Finitions intérieures', 'Aménagements extérieurs', 'Livraison Q2 2026']
        }
      ],
      overallCompletion: 45,
      onSchedule: true,
      nextMilestone: {
        description: 'Achèvement toiture',
        date: '2025-03-30',
        daysRemaining: 90
      },
      photoUpdates: [
        { date: '2025-01', url: '/assets/progress/jan-2025.jpg', description: 'Structure niveau 3' },
        { date: '2024-12', url: '/assets/progress/dec-2024.jpg', description: 'Structure niveau 2' },
        { date: '2024-11', url: '/assets/progress/nov-2024.jpg', description: 'Fondations achevées' }
      ]
    },
    
    // Metadata enrichie
    meta: {
      ...baseProject.meta,
      lastEnriched: new Date().toISOString(),
      enrichmentVersion: '1.0.0',
      mockDataSections: ['unitTypes', 'investment', 'financing', 'testimonials', 'developer.stats', 'developer.awards', 'developer.press', 'architecture', 'lifestyle', 'specifications', 'timeline']
    }
  };
};

/**
 * Génère types d'unités mock à partir données projet
 */
function generateMockUnitTypes(project) {
  const basePrice = project.price_from || 450000;
  
  return [
    {
      id: 'apt-2br',
      type: 'Apartment',
      name: 'Appartement 2 Chambres',
      bedrooms: 2,
      bathrooms: 2,
      
      // ❌ MANQUANT - Mock ajouté
      floorPlan2D: '/assets/floorplans/2br-2d.pdf',
      floorPlan3D: '/assets/floorplans/2br-3d.jpg',
      floorPlanThumbnail: '/assets/floorplans/2br-thumb.jpg',
      
      // Surfaces
      internalArea: 85, // m²
      coveredVerandas: 18,
      uncoveredVerandas: 0,
      surfaceTotal: 103, // ❌ MANQUANT - calculé
      
      // Prix
      priceFrom: basePrice * 0.85,
      priceTo: basePrice * 0.95,
      pricePerSqm: Math.round((basePrice * 0.9) / 103), // ❌ existe mais recalculé
      
      // Disponibilité
      totalUnits: 12,
      availableCount: 5, // ❌ MANQUANT - Mock
      soldCount: 4,
      reservedCount: 3,
      status: 'Disponible', // ❌ MANQUANT - Mock
      
      // Orientation ✅ existe dans properties mais mock ici
      orientation: 'Sud', 
      
      // Features
      parkingSpaces: 1,
      storageRoom: true,
      features: [
        'Open plan living',
        'Master bedroom en-suite',
        'Grande terrasse couverte',
        'Vue mer partielle',
        'Cuisine équipée'
      ]
    },
    {
      id: 'apt-3br',
      type: 'Apartment',
      name: 'Appartement 3 Chambres',
      bedrooms: 3,
      bathrooms: 2,
      
      floorPlan2D: '/assets/floorplans/3br-2d.pdf',
      floorPlan3D: '/assets/floorplans/3br-3d.jpg',
      floorPlanThumbnail: '/assets/floorplans/3br-thumb.jpg',
      
      internalArea: 115,
      coveredVerandas: 25,
      uncoveredVerandas: 0,
      surfaceTotal: 140,
      
      priceFrom: basePrice,
      priceTo: basePrice * 1.15,
      pricePerSqm: Math.round((basePrice * 1.075) / 140),
      
      totalUnits: 18,
      availableCount: 8,
      soldCount: 6,
      reservedCount: 4,
      status: 'Disponible',
      
      orientation: 'Sud-Ouest',
      
      parkingSpaces: 2,
      storageRoom: true,
      features: [
        'Plan spacieux 140m²',
        '2 master bedrooms en-suite',
        'Terrasse 25m² vue mer',
        'Cuisine ouverte premium',
        'Dressing'
      ]
    },
    {
      id: 'pth-3br',
      type: 'Penthouse',
      name: 'Penthouse 3 Chambres',
      bedrooms: 3,
      bathrooms: 3,
      
      floorPlan2D: '/assets/floorplans/pth-2d.pdf',
      floorPlan3D: '/assets/floorplans/pth-3d.jpg',
      floorPlanThumbnail: '/assets/floorplans/pth-thumb.jpg',
      
      internalArea: 145,
      coveredVerandas: 35,
      uncoveredVerandas: 45, // Roof terrace
      surfaceTotal: 225,
      
      priceFrom: basePrice * 1.8,
      priceTo: basePrice * 2.2,
      pricePerSqm: Math.round((basePrice * 2.0) / 225),
      
      totalUnits: 4,
      availableCount: 2,
      soldCount: 1,
      reservedCount: 1,
      status: 'Disponible',
      
      orientation: 'Panoramique',
      
      parkingSpaces: 2,
      storageRoom: true,
      features: [
        'Roof terrace privé 45m²',
        'Vue mer panoramique 180°',
        '3 master bedrooms en-suite',
        'Cuisine ouverte luxe',
        'Salon double hauteur',
        'Jacuzzi roof terrace'
      ]
    }
  ];
}

/**
 * Calcule loyer mensuel estimé selon prix achat
 */
function calculateEstimatedRent(purchasePrice) {
  // Rendement Cyprus moyen: 5-7%
  // Formule: (Prix × Rendement) / 12
  const yieldRate = 0.065; // 6.5%
  return Math.round((purchasePrice * yieldRate) / 12);
}

/**
 * Utilitaires pour composants
 */
export const mockHelpers = {
  /**
   * Vérifie si données sont mock ou réelles
   */
  isMockData: (project) => {
    return project.meta?.mockDataSections?.length > 0;
  },
  
  /**
   * Affiche warning mock data en dev
   */
  logMockWarning: (project) => {
    if (process.env.NODE_ENV === 'development' && mockHelpers.isMockData(project)) {
      console.warn('⚠️ MOCK DATA - Sections utilisent données test:', project.meta.mockDataSections);
    }
  }
};

/**
 * Version simplifiée pour tests rapides
 */
export const enrichProjectDataMinimal = (baseProject) => {
  return {
    ...baseProject,
    unitTypes: generateMockUnitTypes(baseProject),
    investment: {
      rentalYield: 7.03,
      rentalPriceMonthly: 2050,
      goldenVisa: true
    },
    testimonials: [
      {
        name: 'Marie D.',
        text: 'Excellent investissement Cyprus',
        rating: 5
      }
    ]
  };
};

export default enrichProjectData;