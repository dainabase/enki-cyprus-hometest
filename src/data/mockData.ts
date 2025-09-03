export interface Property {
  id: string;
  title: string;
  description: string;
  price: string;
  location: string;
  type: 'villa' | 'apartment' | 'penthouse' | 'commercial' | 'maison';
  bedrooms?: number;
  bathrooms?: number;
  area: string;
  image: string;
  features: string[];
  status: 'available' | 'sold' | 'reserved';
  lat: number;
  lng: number;
  priceValue: number;
  // Nouvelles propriétés pour les fiches détaillées
  detailedDescription: string;
  detailedFeatures: string[];
  photos: string[];
  // Nouvelles propriétés pour plans et visites virtuelles
  plans: string[];
  virtualTour: string;
}

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Villa Méditerranéenne de Luxe',
    description: 'Magnifique villa avec vue panoramique sur la mer Méditerranée, située dans le quartier prestigieux de Limassol.',
    price: '€1,850,000',
    location: 'Limassol Marina, Chypre',
    type: 'villa',
    bedrooms: 4,
    bathrooms: 3,
    area: '320 m²',
    image: '/placeholder-villa.jpg',
    features: ['Vue mer', 'Piscine privée', 'Jardin paysager', 'Garage double', 'Climatisation'],
    status: 'available',
    lat: 34.7071,
    lng: 33.0226,
    priceValue: 1850000,
    detailedDescription: 'Cette villa d\'exception de 320m² incarne l\'art de vivre méditerranéen dans toute sa splendeur. Située dans le prestigieux quartier de Limassol Marina, elle offre une vue panoramique imprenable sur la mer Méditerranée. L\'architecture contemporaine s\'harmonise parfaitement avec les matériaux nobles et les finitions haut de gamme. Chaque espace a été pensé pour maximiser la lumière naturelle et créer une atmosphère de sérénité absolue.',
    detailedFeatures: [
      'Surface habitable de 320 m²',
      '4 chambres avec suites parentales',
      '3 salles de bains en marbre de Carrare',
      'Salon cathédrale avec baies vitrées',
      'Cuisine équipée Bulthaup',
      'Piscine infinity 12x6m',
      'Jardin méditerranéen 800m²',
      'Garage double avec rangements',
      'Climatisation zones multiples',
      'Système domotique intégré',
      'Terrasse panoramique 80m²',
      'Cave à vin climatisée'
    ],
    photos: [
      'https://placehold.co/1200x800/4A90E2/ffffff?text=Villa+Exterieur',
      'https://placehold.co/1200x800/2ECC71/ffffff?text=Salon+Panoramique',
      'https://placehold.co/1200x800/E74C3C/ffffff?text=Cuisine+Moderne',
      'https://placehold.co/1200x800/9B59B6/ffffff?text=Chambre+Master',
      'https://placehold.co/1200x800/F39C12/ffffff?text=Piscine+Infinity',
      'https://placehold.co/1200x800/1ABC9C/ffffff?text=Jardin+Paysager',
      'https://placehold.co/1200x800/34495E/ffffff?text=Terrasse+Vue+Mer',
      'https://placehold.co/1200x800/E67E22/ffffff?text=Garage+Double'
    ],
    plans: [
      'https://placehold.co/800x600/34495E/ffffff?text=Plan+RDC+Villa+320m2',
      'https://placehold.co/800x600/2C3E50/ffffff?text=Plan+Etage+Villa+Chambres',
      'https://placehold.co/800x600/1ABC9C/ffffff?text=Plan+Jardin+Piscine+800m2'
    ],
    virtualTour: 'https://my.matterport.com/show/?m=villa-limassol-luxury'
  },
  {
    id: '2',
    title: 'Penthouse Moderne Centre-Ville',
    description: 'Appartement de standing avec terrasse panoramique au cœur de Nicosie, finitions haut de gamme.',
    price: '€750,000',
    location: 'Centre-ville, Nicosie',
    type: 'penthouse',
    bedrooms: 3,
    bathrooms: 2,
    area: '180 m²',
    image: '/placeholder-penthouse.jpg',
    features: ['Terrasse 60m²', 'Vue panoramique', 'Cuisine équipée', 'Parking inclus'],
    status: 'available',
    lat: 35.1856,
    lng: 33.3823,
    priceValue: 750000,
    detailedDescription: 'Penthouse d\'exception au dernier étage d\'une résidence moderne au cœur de Nicosie. Cet appartement de 180m² offre une vue panoramique à 360° sur la capitale chypriote. La terrasse de 60m² devient un véritable salon extérieur où vous pourrez profiter des couchers de soleil exceptionnels. Les finitions sont d\'un niveau irréprochable avec des matériaux sélectionnés pour leur qualité et leur esthétique.',
    detailedFeatures: [
      'Surface habitable de 180 m²',
      '3 chambres dont 1 suite parentale',
      '2 salles de bains avec douche italienne',
      'Salon/séjour open space 50m²',
      'Cuisine américaine équipée Siematic',
      'Terrasse panoramique 60m²',
      'Vue 360° sur Nicosie',
      'Parking souterrain sécurisé',
      'Cave et cellier',
      'Climatisation réversible',
      'Stores électriques',
      'Ascenseur privatif'
    ],
    photos: [
      'https://placehold.co/1200x800/4A90E2/ffffff?text=Penthouse+Facade',
      'https://placehold.co/1200x800/2ECC71/ffffff?text=Salon+Open+Space',
      'https://placehold.co/1200x800/E74C3C/ffffff?text=Terrasse+Panoramique',
      'https://placehold.co/1200x800/9B59B6/ffffff?text=Cuisine+Americaine',
      'https://placehold.co/1200x800/F39C12/ffffff?text=Suite+Parentale',
      'https://placehold.co/1200x800/1ABC9C/ffffff?text=Vue+Nicosie',
      'https://placehold.co/1200x800/34495E/ffffff?text=Salle+Bain+Marbre'
    ],
    plans: [
      'https://placehold.co/800x600/8E44AD/ffffff?text=Plan+Penthouse+180m2+Vue+360',
      'https://placehold.co/800x600/9B59B6/ffffff?text=Plan+Terrasse+60m2+Panoramique'
    ],
    virtualTour: 'https://my.matterport.com/show/?m=penthouse-nicosie-modern'
  },
  {
    id: '3',
    title: 'Appartement Vue Mer Paphos',
    description: 'Résidence moderne avec accès direct à la plage, dans un complexe sécurisé avec services.',
    price: '€425,000',
    location: 'Coral Bay, Paphos',
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: '95 m²',
    image: '/placeholder-apartment.jpg',
    features: ['Accès plage', 'Piscine commune', 'Sécurité 24h', 'Balcon vue mer'],
    status: 'reserved',
    lat: 34.7720,
    lng: 32.3588,
    priceValue: 425000,
    detailedDescription: 'Appartement moderne de 95m² situé dans la prestigieuse résidence de Coral Bay. Cet appartement bénéficie d\'un accès direct à l\'une des plus belles plages de Paphos. Le complexe sécurisé offre de nombreux services incluant piscine commune, jardins tropicaux et conciergerie 24h/24. Le balcon privé offre une vue imprenable sur la mer Méditerranée.',
    detailedFeatures: [
      'Surface habitable de 95 m²',
      '2 chambres avec placards intégrés',
      '2 salles de bains modernes',
      'Salon avec accès balcon mer',
      'Cuisine équipée et aménagée',
      'Balcon vue mer 15m²',
      'Accès direct plage privée',
      'Piscine commune chauffée',
      'Jardins tropicaux entretenus',
      'Sécurité 24h et vidéosurveillance',
      'Parking attribué',
      'Climatisation tout appartement'
    ],
    photos: [
      'https://placehold.co/1200x800/4A90E2/ffffff?text=Residence+Coral+Bay',
      'https://placehold.co/1200x800/2ECC71/ffffff?text=Salon+Vue+Mer',
      'https://placehold.co/1200x800/E74C3C/ffffff?text=Balcon+Panoramique',
      'https://placehold.co/1200x800/9B59B6/ffffff?text=Chambre+Principale',
      'https://placehold.co/1200x800/F39C12/ffffff?text=Piscine+Commune',
      'https://placehold.co/1200x800/1ABC9C/ffffff?text=Acces+Plage+Prive'
    ],
    plans: [
      'https://placehold.co/800x600/E74C3C/ffffff?text=Plan+Appartement+95m2+Vue+Mer',
      'https://placehold.co/800x600/C0392B/ffffff?text=Plan+Balcon+15m2+Coral+Bay'
    ],
    virtualTour: 'https://my.matterport.com/show/?m=coral-bay-apartment'
  },
  {
    id: '9',
    title: 'Mersini Beach Apartment',
    description: 'Appartement moderne avec vue mer à quelques pas de la plage de Mersini, dans le quartier recherché de Paphos.',
    price: '€250,000',
    location: 'Mersini Beach, Paphos',
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 1,
    area: '80 m²',
    image: '/placeholder-apartment.jpg',
    features: ['Vue mer', 'Proche plage', 'Balcon', 'Parking', 'Cuisine équipée'],
    status: 'available',
    lat: 34.7768,
    lng: 32.4245,
    priceValue: 250000,
    detailedDescription: 'Appartement moderne de 80m² situé à Mersini Beach, l\'un des quartiers les plus prisés de Paphos. À seulement 50 mètres de la magnifique plage de Mersini, cet appartement offre un cadre de vie exceptionnel entre mer et montagne. Entièrement rénové avec des matériaux contemporains, il dispose d\'un balcon avec vue mer partielle et d\'une cuisine entièrement équipée. Idéal pour résidence secondaire ou investissement locatif.',
    detailedFeatures: [
      'Surface habitable de 80 m²',
      '2 chambres lumineuses',
      '1 salle de bain avec douche',
      'Salon/séjour avec accès balcon',
      'Cuisine équipée et fonctionnelle',
      'Balcon vue mer partielle 8m²',
      'À 50m de la plage Mersini',
      'Parking extérieur attribué',
      'Proche commerces et restaurants',
      'Climatisation réversible',
      'Volets roulants électriques',
      'Résidence récente et entretenue'
    ],
    photos: [
      'https://placehold.co/1200x800/4A90E2/ffffff?text=Mersini+Beach+Apt',
      'https://placehold.co/1200x800/2ECC71/ffffff?text=Salon+Lumineux',
      'https://placehold.co/1200x800/E74C3C/ffffff?text=Balcon+Vue+Mer',
      'https://placehold.co/1200x800/9B59B6/ffffff?text=Cuisine+Equipee',
      'https://placehold.co/1200x800/F39C12/ffffff?text=Chambre+Double',
      'https://placehold.co/1200x800/1ABC9C/ffffff?text=Plage+Mersini+50m',
      'https://placehold.co/1200x800/34495E/ffffff?text=Residence+Moderne',
      'https://placehold.co/1200x800/E67E22/ffffff?text=Parking+Prive'
    ],
    plans: [
      'https://placehold.co/800x600/16A085/ffffff?text=Plan+Mersini+Beach+80m2+2Ch',
      'https://placehold.co/800x600/1ABC9C/ffffff?text=Plan+Balcon+Vue+Mer+8m2',
      'https://placehold.co/800x600/48C9B0/ffffff?text=Plan+Residence+Parking'
    ],
    virtualTour: 'https://my.matterport.com/show/?m=mersini-beach-apartment-9'
  },
  {
    id: '4',
    title: 'Villa de Prestige Ayia Napa',
    description: 'Villa exceptionnelle avec architecture contemporaine, équipements de luxe et jardins méditerranéens.',
    price: '€2,200,000',
    location: 'Ayia Napa Hills',
    type: 'villa',
    bedrooms: 5,
    bathrooms: 4,
    area: '450 m²',
    image: '/placeholder-luxury-villa.jpg',
    features: ['Design contemporain', 'Spa privé', 'Cave à vin', 'Domotique', 'Héliport'],
    status: 'available',
    lat: 34.9823,
    lng: 34.0196,
    priceValue: 2200000,
    detailedDescription: 'Villa d\'exception de 450m² perchée sur les hauteurs d\'Ayia Napa, offrant une vue panoramique sur la Méditerranée. Cette propriété unique combine architecture contemporaine et technologies de pointe. Le spa privé, la cave à vin climatisée et l\'héliport privé en font une résidence d\'exception. Les jardins méditerranéens de 2000m² créent un écrin de verdure préservé.',
    detailedFeatures: [
      'Surface habitable de 450 m²',
      '5 suites avec salles de bains privatives',
      '4 salles de bains en marbre italien',
      'Grand salon cathédrale 80m²',
      'Cuisine professionnelle Gaggenau',
      'Spa privé avec hammam et sauna',
      'Cave à vin pour 500 bouteilles',
      'Héliport privé homologué',
      'Piscine infinity 15x8m',
      'Jardins méditerranéens 2000m²',
      'Système domotique KNX complet',
      'Garage pour 4 véhicules'
    ],
    photos: [
      'https://placehold.co/1200x800/4A90E2/ffffff?text=Villa+Prestige+Facade',
      'https://placehold.co/1200x800/2ECC71/ffffff?text=Salon+Cathedrale',
      'https://placehold.co/1200x800/E74C3C/ffffff?text=Spa+Prive+Luxe',
      'https://placehold.co/1200x800/9B59B6/ffffff?text=Cave+Vin+500+Btl',
      'https://placehold.co/1200x800/F39C12/ffffff?text=Heliport+Prive',
      'https://placehold.co/1200x800/1ABC9C/ffffff?text=Piscine+Infinity',
      'https://placehold.co/1200x800/34495E/ffffff?text=Jardins+Mediterraneens',
      'https://placehold.co/1200x800/E67E22/ffffff?text=Vue+Panoramique+Mer'
    ],
    plans: [
      'https://placehold.co/800x600/D35400/ffffff?text=Plan+Villa+Prestige+450m2+5Ch',
      'https://placehold.co/800x600/E67E22/ffffff?text=Plan+Spa+Cave+Vin+Heliport',
      'https://placehold.co/800x600/F39C12/ffffff?text=Plan+Jardins+2000m2+Piscine'
    ],
    virtualTour: 'https://my.matterport.com/show/?m=villa-ayia-napa-prestige'
  },
  {
    id: '5',
    title: 'Local Commercial Premium',
    description: 'Espace commercial stratégiquement situé dans la zone touristique de Larnaca, idéal pour investissement.',
    price: '€890,000',
    location: 'Zone Touristique, Larnaca',
    type: 'commercial',
    area: '250 m²',
    image: '/placeholder-commercial.jpg',
    features: ['Emplacement premium', 'Forte affluence', 'Parking clients', 'Climatisation'],
    status: 'available',
    lat: 34.9229,
    lng: 33.6276,
    priceValue: 890000,
    detailedDescription: 'Local commercial premium de 250m² idéalement situé dans la zone touristique de Larnaca. Cet espace polyvalent bénéficie d\'un emplacement stratégique avec une forte affluence toute l\'année. Parfait pour restaurant, boutique de luxe ou centre de services. La zone offre un excellent potentiel de rentabilité avec plus de 2 millions de visiteurs annuels.',
    detailedFeatures: [
      'Surface commerciale de 250 m²',
      'Rez-de-chaussée avec vitrine 15m',
      'Hauteur sous plafond 4m',
      'Espace stockage 50m²',
      'Cuisine professionnelle équipée',
      'Terrasse extérieure 40m²',
      'Parking clients 20 places',
      'Zone touristique premium',
      'Affluence 2M visiteurs/an',
      'Climatisation centralisée',
      'Système sécurité complet',
      'Accès livraisons facilité'
    ],
    photos: [
      'https://placehold.co/1200x800/4A90E2/ffffff?text=Local+Commercial+250m2',
      'https://placehold.co/1200x800/2ECC71/ffffff?text=Vitrine+15m+Premium',
      'https://placehold.co/1200x800/E74C3C/ffffff?text=Espace+Principal+RDC',
      'https://placehold.co/1200x800/9B59B6/ffffff?text=Cuisine+Professionnelle',
      'https://placehold.co/1200x800/F39C12/ffffff?text=Terrasse+40m2',
      'https://placehold.co/1200x800/1ABC9C/ffffff?text=Parking+20+Places',
      'https://placehold.co/1200x800/34495E/ffffff?text=Zone+Touristique'
    ],
    plans: [
      'https://placehold.co/800x600/E74C3C/ffffff?text=Plan+Commercial+250m2+RDC',
      'https://placehold.co/800x600/C0392B/ffffff?text=Plan+Terrasse+Parking+20pl'
    ],
    virtualTour: 'https://my.matterport.com/show/?m=commercial-larnaca-premium'
  },
  {
    id: '6',
    title: 'Appartement Moderne Protaras',
    description: 'Résidence contemporaine avec vue sur la baie de Fig Tree, à quelques pas des plages dorées.',
    price: '€385,000',
    location: 'Fig Tree Bay, Protaras',
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 1,
    area: '85 m²',
    image: '/placeholder-apartment.jpg',
    features: ['Vue baie', 'Balcon spacieux', 'Proche plages', 'Parking'],
    status: 'available',
    lat: 35.0123,
    lng: 34.0591,
    priceValue: 385000,
    detailedDescription: 'Appartement moderne de 85m² dans une résidence contemporaine face à la célèbre baie de Fig Tree. Cet appartement lumineux offre une vue exceptionnelle sur l\'une des plus belles plages de Chypre. Le balcon spacieux permet de profiter pleinement de la vue mer et des couchers de soleil. Idéalement situé à 100m des plages dorées de Protaras.',
    detailedFeatures: [
      'Surface habitable de 85 m²',
      '2 chambres avec rangements',
      '1 salle de bain avec baignoire',
      'Salon lumineux accès balcon',
      'Cuisine aménagée moderne',
      'Balcon spacieux vue baie 12m²',
      'À 100m de Fig Tree Beach',
      'Résidence sécurisée récente',
      'Parking souterrain inclus',
      'Piscine commune résidence',
      'Climatisation tout logement',
      'Proche restaurants et commerces'
    ],
    photos: [
      'https://placehold.co/1200x800/4A90E2/ffffff?text=Apt+Fig+Tree+Bay',
      'https://placehold.co/1200x800/2ECC71/ffffff?text=Vue+Baie+Exceptionnelle',
      'https://placehold.co/1200x800/E74C3C/ffffff?text=Balcon+Vue+Mer+12m2',
      'https://placehold.co/1200x800/9B59B6/ffffff?text=Salon+Lumineux',
      'https://placehold.co/1200x800/F39C12/ffffff?text=Cuisine+Moderne',
      'https://placehold.co/1200x800/1ABC9C/ffffff?text=Fig+Tree+Beach+100m'
    ],
    plans: [
      'https://placehold.co/800x600/3498DB/ffffff?text=Plan+Appartement+85m2+Vue+Baie',
      'https://placehold.co/800x600/2980B9/ffffff?text=Plan+Balcon+12m2+Fig+Tree'
    ],
    virtualTour: 'https://my.matterport.com/show/?m=fig-tree-bay-apartment'
  },
  {
    id: '7',
    title: 'Villa Familiale Limassol',
    description: 'Villa spacieuse dans quartier résidentiel calme, parfaite pour familles avec enfants.',
    price: '€1,200,000',
    location: 'Agios Athanasios, Limassol',
    type: 'villa',
    bedrooms: 4,
    bathrooms: 3,
    area: '280 m²',
    image: '/placeholder-villa.jpg',
    features: ['Jardin privé', 'Piscine', 'Garage', 'Quartier familial'],
    status: 'available',
    lat: 34.7142,
    lng: 33.0039,
    priceValue: 1200000,
    detailedDescription: 'Villa familiale de 280m² située dans le quartier résidentiel prisé d\'Agios Athanasios à Limassol. Cette propriété offre un cadre de vie idéal pour les familles avec de nombreuses écoles internationales à proximité. Le jardin privé de 600m² avec piscine crée un espace de détente parfait. La villa combine confort moderne et fonctionnalité familiale.',
    detailedFeatures: [
      'Surface habitable de 280 m²',
      '4 chambres dont 1 suite parentale',
      '3 salles de bains familiales',
      'Salon/séjour familial 45m²',
      'Cuisine familiale avec îlot central',
      'Bureau/salle de jeux',
      'Jardin privé paysagé 600m²',
      'Piscine 8x4m avec pool house',
      'Garage double avec atelier',
      'Proche écoles internationales',
      'Quartier résidentiel sécurisé',
      'Climatisation et chauffage central'
    ],
    photos: [
      'https://placehold.co/1200x800/4A90E2/ffffff?text=Villa+Familiale+280m2',
      'https://placehold.co/1200x800/2ECC71/ffffff?text=Salon+Familial+45m2',
      'https://placehold.co/1200x800/E74C3C/ffffff?text=Cuisine+Ilot+Central',
      'https://placehold.co/1200x800/9B59B6/ffffff?text=Jardin+Paysage+600m2',
      'https://placehold.co/1200x800/F39C12/ffffff?text=Piscine+Pool+House',
      'https://placehold.co/1200x800/1ABC9C/ffffff?text=Quartier+Residentiel'
    ],
    plans: [
      'https://placehold.co/800x600/27AE60/ffffff?text=Plan+Villa+Familiale+280m2+4Ch',
      'https://placehold.co/800x600/2ECC71/ffffff?text=Plan+Jardin+600m2+Piscine+8x4'
    ],
    virtualTour: 'https://my.matterport.com/show/?m=villa-familiale-limassol'
  },
  {
    id: '8',
    title: 'Penthouse Luxury Nicosie',
    description: 'Penthouse ultra-moderne avec terrasse de 100m² et vue à 360° sur la capitale.',
    price: '€950,000',
    location: 'Strovolos, Nicosie',
    type: 'penthouse',
    bedrooms: 3,
    bathrooms: 2,
    area: '200 m²',
    image: '/placeholder-penthouse.jpg',
    features: ['Terrasse 100m²', 'Vue 360°', 'Ascenseur privé', 'Domotique'],
    status: 'available',
    lat: 35.1448,
    lng: 33.3617,
    priceValue: 950000,
    detailedDescription: 'Penthouse ultra-moderne de 200m² au sommet d\'une tour de prestige à Strovolos. Cet appartement exceptionnel offre une vue panoramique à 360° sur Nicosie et les montagnes environnantes. La terrasse de 100m² est un véritable atout avec jacuzzi, cuisine d\'été et espaces lounge. L\'ascenseur privé dessert directement l\'appartement pour un confort absolu.',
    detailedFeatures: [
      'Surface habitable de 200 m²',
      '3 suites avec dressing privé',
      '2 salles de bains design italien',
      'Salon panoramique 60m²',
      'Cuisine ouverte haut de gamme',
      'Terrasse panoramique 100m²',
      'Vue 360° Nicosie et montagnes',
      'Jacuzzi terrasse 8 places',
      'Cuisine d\'été extérieure',
      'Ascenseur privé direct',
      'Système domotique intégral',
      'Parking souterrain 2 places'
    ],
    photos: [
      'https://placehold.co/1200x800/4A90E2/ffffff?text=Penthouse+Luxury+200m2',
      'https://placehold.co/1200x800/2ECC71/ffffff?text=Vue+360+Nicosie',
      'https://placehold.co/1200x800/E74C3C/ffffff?text=Terrasse+100m2+Jacuzzi',
      'https://placehold.co/1200x800/9B59B6/ffffff?text=Salon+Panoramique+60m2',
      'https://placehold.co/1200x800/F39C12/ffffff?text=Cuisine+Ete+Exterieure',
      'https://placehold.co/1200x800/1ABC9C/ffffff?text=Ascenseur+Prive'
    ],
    plans: [
      'https://placehold.co/800x600/9B59B6/ffffff?text=Plan+Penthouse+200m2+Terrasse+100',
      'https://placehold.co/800x600/8E44AD/ffffff?text=Plan+Jacuzzi+Cuisine+Ete'
    ],
    virtualTour: 'https://my.matterport.com/show/?m=penthouse-luxury-nicosie'
  },
  {
    id: '10',
    title: 'Maison Traditionnelle Pissouri',
    description: 'Charmante maison traditionnelle chypriote rénovée avec goût, jardin méditerranéen et vue montagne.',
    price: '€580,000',
    location: 'Village de Pissouri',
    type: 'maison',
    bedrooms: 3,
    bathrooms: 2,
    area: '150 m²',
    image: '/placeholder-villa.jpg',
    features: ['Architecture traditionnelle', 'Jardin méditerranéen', 'Vue montagne', 'Proche plage'],
    status: 'available',
    lat: 34.6698,
    lng: 32.7056,
    priceValue: 580000,
    detailedDescription: 'Maison traditionnelle chypriote de 150m² entièrement restaurée dans le charmant village de Pissouri. Cette propriété unique conserve tout le charme de l\'architecture locale avec ses murs en pierre, ses poutres apparentes et ses voûtes traditionnelles. Le jardin méditerranéen de 400m² offre une vue imprenable sur les montagnes de Troodos et la mer au loin.',
    detailedFeatures: [
      'Surface habitable de 150 m²',
      '3 chambres avec caractère',
      '2 salles de bains rénovées',
      'Salon avec cheminée en pierre',
      'Cuisine traditionnelle équipée',
      'Murs en pierre apparente',
      'Poutres chêne apparentes',
      'Voûtes traditionnelles préservées',
      'Jardin méditerranéen 400m²',
      'Vue montagne Troodos',
      'Village authentique préservé',
      'À 5min de la plage Pissouri'
    ],
    photos: [
      'https://placehold.co/1200x800/4A90E2/ffffff?text=Maison+Traditionnelle+150m2',
      'https://placehold.co/1200x800/2ECC71/ffffff?text=Salon+Cheminee+Pierre',
      'https://placehold.co/1200x800/E74C3C/ffffff?text=Murs+Pierre+Apparente',
      'https://placehold.co/1200x800/9B59B6/ffffff?text=Poutres+Chene+Apparentes',
      'https://placehold.co/1200x800/F39C12/ffffff?text=Jardin+Mediterraneen+400m2',
      'https://placehold.co/1200x800/1ABC9C/ffffff?text=Vue+Montagne+Troodos',
      'https://placehold.co/1200x800/34495E/ffffff?text=Village+Pissouri'
    ],
    plans: [
      'https://placehold.co/800x600/D68910/ffffff?text=Plan+Maison+Traditionnelle+150m2',
      'https://placehold.co/800x600/E67E22/ffffff?text=Plan+Jardin+400m2+Vue+Troodos'
    ],
    virtualTour: 'https://my.matterport.com/show/?m=maison-traditionnelle-pissouri'
  }
];

export const partners = [
  'LEPTOS Group',
  'PAFILIA Property',
  'CYBARCO-CITYCHAMP',
  'ARISTO Developers',
  'LIMASSOL DEL MAR',
  'AMATHUS Developments',
  'SALAMIS Bay',
  'APHRODITE HILLS',
  'SECRET VALLEY',
  'MINTHIS Resort'
];