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
    status: 'available'
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
    status: 'available'
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
    status: 'reserved'
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
    status: 'available'
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
    status: 'available'
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