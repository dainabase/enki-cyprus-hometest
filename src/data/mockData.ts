export interface Property {
  id: string;
  title: string;
  description: string;
  price: string;
  location: string;
  type: 'villa' | 'apartment' | 'penthouse' | 'commercial';
  bedrooms?: number;
  bathrooms?: number;
  area: string;
  image: string;
  features: string[];
  status: 'available' | 'sold' | 'reserved';
  lat: number;
  lng: number;
  priceValue: number;
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
    priceValue: 1850000
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
    priceValue: 750000
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
    priceValue: 425000
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
    priceValue: 2200000
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
    priceValue: 890000
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
    priceValue: 385000
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
    priceValue: 1200000
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
    priceValue: 950000
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
    priceValue: 250000
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