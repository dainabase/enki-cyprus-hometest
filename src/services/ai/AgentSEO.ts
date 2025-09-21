import { TrendingUp, Home, Users, MessageSquare } from 'lucide-react';

export interface ContenuSEO {
  titre_meta: string;
  description_meta: string;
  mots_cles: string[];
  points_marketing: string[];
  audience_cible: string;
  slug_url: string;
  schema_json_ld?: any;
}

export interface DonneesProjet {
  nom_projet: string;
  zone: string;
  prix_min: number;
  prix_max: number;
  types: string[];
  chambres?: number;
  vue?: string;
  caracteristiques?: string[];
}

// Configuration des agents disponibles
const AI_AGENTS = [
  {
    id: 'seo-generator',
    name: 'Générateur de Contenu SEO',
    type: 'seo',
    icon: TrendingUp,
    description: 'Génère du contenu SEO optimisé pour les propriétés',
    features: [
      'Titres meta (60 caractères)',
      'Descriptions meta (160 caractères)', 
      'Génération de mots-clés',
      'Points marketing',
      'Analyse audience cible',
      'Support multi-langue'
    ],
    defaultPrompt: `Tu es un expert SEO immobilier senior spécialisé sur le marché de Chypre avec 10 ans d'expérience.
Tu travailles pour ENKI Reality, une agence premium qui cible principalement les investisseurs européens.

🎯 CONNAISSANCE DU MARCHÉ CHYPRE
========================

TU MAÎTRISES PARFAITEMENT :
- Le marché immobilier chypriote et ses 5 zones principales
- La psychologie d'achat des Européens (Français, Allemands, Britanniques, Italiens, Espagnols)
- Les avantages fiscaux de Chypre (12.5% impôt sociétés, pas de plus-value après 3 ans)
- Le lifestyle méditerranéen (340 jours de soleil, communautés expats établies)
- Les rendements locatifs réels (5-8% net selon zones)
- Le programme Golden Visa SANS en faire l'obsession (juste un avantage parmi d'autres)

PROFILS CLIENTS PRIORITAIRES :
1. 🏖️ LIFESTYLE (40%) : Retraités/pré-retraités européens cherchant résidence secondaire au soleil
2. 💼 INVESTISSEMENT (35%) : Investisseurs cherchant rendement locatif stable + appréciation capitale  
3. 🌍 DIGITAL NOMADS (15%) : Professionnels remote avec visa nomade digital Cyprus
4. 🏆 GOLDEN VISA (10%) : Mentionner SI propriété ≥300k€, mais sans insister lourdement

SPÉCIFICITÉS PAR ZONE :
- LIMASSOL : Hub business international, Marina de luxe, Communauté française importante, Prix premium mais forte demande locative
- PAPHOS : Site UNESCO, Forte communauté britannique, Tourisme toute l'année, Excellent rapport qualité/prix
- LARNACA : Proximité aéroport (10min), Prix attractifs, Nouvelle marina 2025, Marché en développement
- NICOSIA : Capitale administrative, Universités internationales, Prix les plus bas, Marché locatif étudiants
- FAMAGUSTA : Plages paradisiaques, Ayia Napa/Protaras, Forte saisonnalité, Potentiel plus-value

📝 RÈGLES DE GÉNÉRATION SEO STRICTES
====================================

STRUCTURE OBLIGATOIRE :

1. TITRE META (55-60 caractères MAX) :
   - Toujours inclure : [Nom Projet] + [Type] + [Ville] + "Chypre" ou "Cyprus"
   - Année courante pour fraîcheur (2024/2025)
   - Éviter sur-optimisation Golden Visa
   Exemple : "Marina Tower - Appartements Vue Mer Limassol Cyprus 2024"

2. DESCRIPTION META (155-160 caractères MAX) :
   - Hook accrocheur + Projet + Localisation + USP principal + Prix si attractif + CTA
   - Mentionner Golden Visa SEULEMENT si ≥300k€ et en fin de description
   Exemple : "Découvrez Marina Tower à Limassol. Appartements luxe pieds dans l'eau, rentabilité 7%. Dès 185k€. Gestion locative incluse. Contactez-nous!"

3. MOTS-CLÉS (8-12 mots) :
   - 30% génériques : "immobilier chypre", "investissement cyprus", "propriété méditerranée"
   - 40% spécifiques zone : "appartement limassol", "paphos property", "larnaca investment"
   - 30% projet/USP : nom projet, type bien, caractéristiques uniques
   - Golden Visa SEULEMENT si applicable, en position 6-8

4. POINTS MARKETING (5 points) :
   Ordre de priorité :
   - Point 1 : Localisation et lifestyle (proximité mer, centre-ville, commodités)
   - Point 2 : ROI et potentiel investissement (rendement, appréciation, demande)
   - Point 3 : Qualité construction/équipements (architecture, matériaux, services)
   - Point 4 : Avantages fiscaux Chypre ou gestion simplifiée
   - Point 5 : Golden Visa SI ≥300k€, sinon autre USP (communauté, écoles, etc.)

5. AUDIENCE CIBLE (1 phrase précise) :
   Adapter selon prix :
   - <200k€ : "Investisseurs cherchant premier achat rentable à Chypre"
   - 200-300k€ : "Familles européennes cherchant résidence secondaire au soleil"
   - 300-500k€ : "Investisseurs patrimoniaux, éligibilité Golden Visa possible"
   - >500k€ : "Clients premium cherchant propriétés d'exception"

6. URL SLUG :
   Format : [projet]-[type]-[ville]-chypre
   Exemple : "marina-tower-appartements-limassol-chypre"

🌍 ADAPTATION LINGUISTIQUE
==========================

FRANÇAIS :
- Ton professionnel mais accessible
- Mettre en avant : art de vivre, investissement sûr, communauté francophone
- Vocabulaire : "appartement" pas "flat", "vue mer" pas "sea view"

ANGLAIS :
- Ton international business-friendly  
- Focus : ROI, market data, investment security
- Termes : "property", "estate", "residence"

ALLEMAND :
- Précision et données chiffrées
- Insister : sécurité juridique, qualité construction, efficacité énergétique
- Mentionner : "Energieausweis", "Rendite", "Wertsteigerung"

⚡ OPTIMISATIONS SEO AVANCÉES
=============================

- Toujours inclure l'année courante (${new Date().getFullYear()})
- Utiliser des power words AVEC modération : Premium, Exclusive, Unique, Exceptionnel
- Nombres : écrire "3 chambres" pas "trois chambres" (meilleur CTR)
- Prix : format "250k€" ou "250.000€" selon marché cible
- Éviter : superlatifs excessifs, promesses irréalistes, spam keywords
- Schema.org : générer données structurées pour rich snippets Google

🚫 ERREURS À ÉVITER
==================

- NE PAS spammer "Golden Visa" partout
- NE PAS utiliser de langage trop commercial/agressif
- NE PAS promettre des rendements irréalistes (max 8%)
- NE PAS ignorer le contexte local (communautés, écoles, hospitals)
- NE PAS traduire littéralement (adapter culturellement)

📊 CONTEXTE MARCHÉ 2024-2025
============================

- Taux hypothécaires : 4-5% (mentionner si financement disponible)
- Croissance prix : +8-12%/an selon zones
- Demande locative : Très forte (Limassol/Paphos), Forte (Larnaca), Moyenne (autres)
- Délais construction : 18-24 mois pour neuf
- Tendances : Eco-construction, Smart homes, Communautés fermées

RAPPEL FINAL : Tu optimises pour des EUROPÉENS cherchant qualité de vie et/ou investissement stable.
Le Golden Visa est un PLUS, pas l'argument principal. Focus sur lifestyle, ROI, et sécurité.`
  }
];

export class AgentSEO {
  private cleAPI: string = '';

  // Données RÉELLES du marché chypriote
  private readonly MARCHE_CHYPRE = {
    zones: {
      'Limassol': {
        mots_cles: ['limassol marina', 'business hub cyprus', 'luxury limassol', 'limassol investment'],
        points_forts: 'Centre d\'affaires, Marina de luxe, Hub tech',
        prix_moyen_m2: 4500,
        croissance_annuelle: '12%',
        caracteristiques: ['Marina prestigieuse', 'Centre financier', 'Vie nocturne active', 'Écoles internationales']
      },
      'Paphos': {
        mots_cles: ['paphos unesco', 'paphos investment', 'coastal paphos', 'paphos golden visa'],
        points_forts: 'Site UNESCO, Tourisme premium, ROI élevé',
        prix_moyen_m2: 3200,
        croissance_annuelle: '10%',
        caracteristiques: ['Patrimoine UNESCO', 'Aéroport international', 'Plages Blue Flag', 'Communauté expat']
      },
      'Larnaca': {
        mots_cles: ['larnaca airport', 'emerging larnaca', 'larnaca marina', 'larnaca opportunity'],
        points_forts: 'Proximité aéroport, Prix attractifs, Marina 2025',
        prix_moyen_m2: 2800,
        croissance_annuelle: '8%',
        caracteristiques: ['Aéroport principal', 'Prix compétitifs', 'Nouveau port de plaisance', 'Développement rapide']
      },
      'Nicosia': {
        mots_cles: ['nicosia capital', 'university district', 'nicosia business', 'capital investment'],
        points_forts: 'Capitale, Universités, Centre administratif',
        prix_moyen_m2: 2500,
        croissance_annuelle: '6%',
        caracteristiques: ['Capitale historique', 'Universités prestigieuses', 'Centre gouvernemental', 'Culture riche']
      },
      'Famagusta': {
        mots_cles: ['ayia napa property', 'protaras investment', 'beach property', 'tourism cyprus'],
        points_forts: 'Plages, Tourisme, Potentiel croissance',
        prix_moyen_m2: 3000,
        croissance_annuelle: '9%',
        caracteristiques: ['Plages paradisiaques', 'Destination touristique', 'Potentiel locatif élevé', 'Ayia Napa nearby']
      }
    },
    
    golden_visa: {
      seuil_euros: 300000,
      mots_cles: [
        'cyprus golden visa',
        'EU residency cyprus',
        'permanent residency',
        'cyprus investment visa',
        'european passport'
      ],
      avantages: [
        '✓ Résidence permanente en 2 mois',
        '✓ Famille incluse (conjoint + enfants <25)',
        '✓ Voyage libre Schengen',
        '✓ Pas d\'obligation de résidence',
        '✓ Citoyenneté possible après 7 ans',
        '✓ Fiscalité avantageuse (non-dom)'
      ]
    },
    
    segments_clients: {
      'golden_visa': {
        profil: 'Investisseurs cherchant résidence EU (Russie, Chine, Moyen-Orient)',
        mots_cles: ['investment visa', 'EU residency', 'family visa', 'cyprus citizenship'],
        focus_marketing: 'Sécurité juridique, Rapidité process, Avantages famille, Mobilité européenne'
      },
      'lifestyle': {
        profil: 'Retraités européens cherchant soleil et qualité de vie',
        mots_cles: ['retirement cyprus', 'beach property', 'cyprus lifestyle', 'expat community'],
        focus_marketing: '340 jours de soleil, Communauté expat, Système santé, Coût de la vie'
      },
      'investment': {
        profil: 'Investisseurs cherchant rendement locatif 6-8%',
        mots_cles: ['rental yield', 'ROI cyprus', 'investment property', 'buy to let'],
        focus_marketing: 'ROI garanti, Gestion locative, Croissance capitale, Demande touristique'
      },
      'tech_nomads': {
        profil: 'Digital nomads avec visa spécial',
        mots_cles: ['digital nomad', 'tech hub', 'coworking cyprus', 'remote work'],
        focus_marketing: 'Fibre optique, Écosystème tech, Coworking spaces, Lifestyle méditerranéen'
      }
    }
  };

  constructor(cleAPI?: string) {
    this.cleAPI = cleAPI || '';
  }

  async genererContenuSEO(donnees: DonneesProjet, langue: string = 'fr'): Promise<ContenuSEO> {
    const estGoldenVisa = donnees.prix_min >= this.MARCHE_CHYPRE.golden_visa.seuil_euros;
    const zone = this.MARCHE_CHYPRE.zones[donnees.zone] || this.MARCHE_CHYPRE.zones['Limassol'];
    const segment = this.determinerSegmentClient(donnees, estGoldenVisa);
    const anneeActuelle = new Date().getFullYear();
    
    // Prompt utilisateur optimisé pour l'agent expert
    const promptUtilisateur = `
      PROJET À OPTIMISER SEO:
      📍 Nom: ${donnees.nom_projet}
      📍 Zone: ${donnees.zone} (Spécificités: ${zone.points_forts})
      💰 Prix: €${donnees.prix_min?.toLocaleString()}-€${donnees.prix_max?.toLocaleString()}
      🏠 Types: ${donnees.types?.join(', ')}
      ${donnees.chambres ? `🛏️ Chambres: ${donnees.chambres}` : ''}
      ${donnees.vue ? `👀 Vue: ${donnees.vue}` : ''}
      ${estGoldenVisa ? '🏆 ÉLIGIBLE GOLDEN VISA (≥300k€) - Mentionner avec subtilité' : '💡 Focus LIFESTYLE et INVESTISSEMENT'}
      
      CONTEXTE MARCHÉ ${anneeActuelle}:
      - Zone ${donnees.zone}: Croissance ${zone.croissance_annuelle}/an, Prix moyen €${zone.prix_moyen_m2}/m²
      - Segment cible prioritaire: "${segment}"
      - Langue: ${langue}
      
      GÉNÈRE LE CONTENU SEO OPTIMAL selon tes règles expertes:
      
      FORMAT JSON STRICT:
      {
        "titre_meta": "Titre exactement 55-60 caractères avec ${anneeActuelle}",
        "description_meta": "Description 155-160 caractères avec CTA fort",
        "mots_cles": ["8-12 mots-clés équilibrés selon tes règles 30/40/30"],
        "points_marketing": ["5 points selon ordre prioritaire lifestyle/ROI/qualité/fiscal/GV"],
        "audience_cible": "Une phrase précise selon prix et profil",
        "slug_url": "format-kebab-case-avec-zone"
      }
      
      APPLIQUE TON EXPERTISE SENIOR pour ce marché européen !`;
    
    try {
      if (!this.cleAPI) {
        throw new Error('Clé API manquante');
      }
      
      const reponse = await this.appelerOpenAI(promptUtilisateur);
      const contenu = this.parserReponse(reponse);
      
      // Ajouter schema.org JSON-LD
      contenu.schema_json_ld = this.genererSchemaJsonLD(donnees, contenu);
      
      return contenu;
    } catch (error) {
      console.error('Erreur génération SEO:', error);
      return this.genererContenuSecours(donnees, estGoldenVisa, zone);
    }
  }

  private async appelerOpenAI(promptUtilisateur: string): Promise<any> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.cleAPI}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          { 
            role: 'system', 
            content: this.getSystemPrompt()
          },
          { 
            role: 'user', 
            content: promptUtilisateur 
          }
        ],
        temperature: 0.7,
        max_tokens: 800,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API Error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  }

  private getSystemPrompt(): string {
    // Utiliser le prompt système complet depuis la configuration de l'agent
    const agentSEO = AI_AGENTS.find(agent => agent.id === 'seo-generator');
    return agentSEO?.defaultPrompt || 'Tu es un expert SEO immobilier.';
  }

  private determinerSegmentClient(donnees: DonneesProjet, estGoldenVisa: boolean): string {
    if (estGoldenVisa) return 'golden_visa';
    if (donnees.prix_min < 200000) return 'lifestyle';
    if (donnees.types?.includes('Commercial') || donnees.zone === 'Limassol') return 'investment';
    return 'tech_nomads';
  }

  private parserReponse(reponse: any): ContenuSEO {
    return {
      titre_meta: reponse.titre_meta || '',
      description_meta: reponse.description_meta || '',
      mots_cles: reponse.mots_cles || [],
      points_marketing: reponse.points_marketing || [],
      audience_cible: reponse.audience_cible || '',
      slug_url: reponse.slug_url || ''
    };
  }

  private genererContenuSecours(donnees: DonneesProjet, estGoldenVisa: boolean, zone: any): ContenuSEO {
    const annee = new Date().getFullYear();
    return {
      titre_meta: `${donnees.nom_projet} - ${donnees.zone} ${estGoldenVisa ? 'Golden Visa ' : ''}Cyprus ${annee}`,
      description_meta: `${donnees.nom_projet} à ${donnees.zone}. ${estGoldenVisa ? 'Éligible Golden Visa. ' : ''}Investissement sécurisé Chypre ${annee}. Contactez-nous!`,
      mots_cles: zone.mots_cles.concat([`${donnees.zone.toLowerCase()} property`, 'cyprus investment']),
      points_marketing: [
        ...(estGoldenVisa ? ['🏆 Éligible Golden Visa (résidence EU)'] : []),
        `📍 ${zone.points_forts}`,
        `💹 Croissance ${zone.croissance_annuelle}/an`,
        '🌞 340 jours de soleil/an',
        '🏖️ Lifestyle méditerranéen premium'
      ],
      audience_cible: estGoldenVisa ? 'Investisseurs internationaux cherchant résidence européenne' : 'Investisseurs lifestyle et retraités',
      slug_url: `${donnees.nom_projet.toLowerCase().replace(/\s+/g, '-')}-${donnees.zone.toLowerCase()}-cyprus-${annee}`
    };
  }

  private genererSchemaJsonLD(donnees: DonneesProjet, contenu: ContenuSEO): any {
    return {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      "name": donnees.nom_projet,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": donnees.zone,
        "addressCountry": "CY"
      },
      "priceRange": `€${donnees.prix_min}-€${donnees.prix_max}`,
      "description": contenu.description_meta,
      "offers": {
        "@type": "Offer",
        "category": "RealEstate",
        "eligibleRegion": "Cyprus"
      }
    };
  }

  // Méthode pour TESTER avec une vraie clé
  async testerAvecCleAPI(cleTest: string, projetTest?: DonneesProjet): Promise<ContenuSEO> {
    this.cleAPI = cleTest;
    
    const donneesDemoChypre: DonneesProjet = projetTest || {
      nom_projet: "Sunset Marina Residences",
      zone: "Limassol",
      prix_min: 450000,
      prix_max: 1200000,
      types: ["Apartment", "Penthouse"],
      chambres: 3,
      vue: "Sea view",
      caracteristiques: ["Marina location", "Luxury finishes", "Concierge service"]
    };
    
    console.log('🚀 Test Agent SEO Chypre avec:', donneesDemoChypre);
    
    const resultat = await this.genererContenuSEO(donneesDemoChypre, 'fr');
    
    console.log('✅ Test Agent SEO réussi:', {
      ...resultat,
      validation: {
        titre_longueur: resultat.titre_meta.length,
        description_longueur: resultat.description_meta.length,
        nb_mots_cles: resultat.mots_cles.length,
        nb_points_marketing: resultat.points_marketing.length
      }
    });
    
    return resultat;
  }

  // Méthode pour tester sans API (mode démo)
  genererContenuDemo(donnees: DonneesProjet): ContenuSEO {
    const estGoldenVisa = donnees.prix_min >= 300000;
    const zone = this.MARCHE_CHYPRE.zones[donnees.zone] || this.MARCHE_CHYPRE.zones['Limassol'];
    
    return {
      titre_meta: `${donnees.nom_projet} - Luxury ${donnees.zone} ${estGoldenVisa ? 'Golden Visa ' : ''}Cyprus 2025`,
      description_meta: `${donnees.nom_projet} à ${donnees.zone}. ${estGoldenVisa ? 'Éligible Golden Visa. ' : ''}Investissement premium. ${zone.points_forts}. Réservez visite!`,
      mots_cles: [
        ...zone.mots_cles,
        `${donnees.zone.toLowerCase()} luxury`,
        'cyprus investment 2025',
        ...(estGoldenVisa ? ['golden visa property'] : ['lifestyle investment'])
      ],
      points_marketing: [
        ...(estGoldenVisa ? ['🏆 Éligible Golden Visa - Résidence EU en 2 mois'] : []),
        `📍 ${zone.points_forts}`,
        `💹 Croissance immobilière ${zone.croissance_annuelle}/an`,
        '🌞 340 jours de soleil garantis',
        '🏖️ Lifestyle méditerranéen d\'exception',
        '✈️ 3h de vol des capitales européennes'
      ],
      audience_cible: estGoldenVisa 
        ? 'Investisseurs internationaux cherchant résidence européenne et sécurité patrimoniale'
        : 'Investisseurs lifestyle, retraités aisés et digital nomads',
      slug_url: `${donnees.nom_projet.toLowerCase().replace(/\s+/g, '-')}-${donnees.zone.toLowerCase()}-cyprus-investment-2025`,
      schema_json_ld: this.genererSchemaJsonLD(donnees, {} as ContenuSEO)
    };
  }
}