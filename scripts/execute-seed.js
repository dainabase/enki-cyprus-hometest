// Script d'exécution du seeding
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://ccsakftsslurjgnjwdci.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjc2FrZnRzc2x1cmpnbmp3ZGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjQyNDIsImV4cCI6MjA3MjUwMDI0Mn0.HpJzpJC8d9H74Pqye-AoYIZWPLvT9iYNHx_4yeFrPnk";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Données factices pour 50 biens
const projects = [
  // Villa Mersini Beach
  {
    title: 'Villa Mersini Beach - Vue mer exceptionnelle',
    description: 'Villa de luxe 250m² front de mer à Mersini Beach, 4 chambres avec piscine privée',
    type: 'Villa',
    price: 850000,
    location: { lat: 34.7768, lng: 32.4245, city: 'Paphos' },
    features: ['Vue mer', 'Piscine privée', 'Parking', 'Jardin', 'Barbecue', 'Wifi inclus', 'Climatisation', 'Terrasse'],
    photos: [
      'https://source.unsplash.com/random/800x600/?cyprus+villa+beach&sig=mersini1',
      'https://source.unsplash.com/random/800x600/?luxury+villa+pool&sig=mersini2',
      'https://source.unsplash.com/random/800x600/?sea+view+terrace&sig=mersini3',
      'https://source.unsplash.com/random/800x600/?villa+interior&sig=mersini4'
    ],
    plans: [
      'https://placehold.co/800x600/png?text=Villa+Ground+Floor&font=roboto&seed=mersini1',
      'https://placehold.co/800x600/png?text=Villa+Upper+Floor&font=roboto&seed=mersini2'
    ],
    virtual_tour: 'https://my.matterport.com/show/?m=mersinibeach123'
  }
];

// Génération des 49 autres biens
const cities = ['Paphos', 'Limassol', 'Nicosia', 'Larnaca', 'Ayia Napa'];
const cityCoordinates = {
  'Paphos': { lat: 34.7667, lng: 32.4167 },
  'Limassol': { lat: 34.6851, lng: 33.0430 },
  'Nicosia': { lat: 35.1667, lng: 33.3667 },
  'Larnaca': { lat: 34.9208, lng: 33.6358 },
  'Ayia Napa': { lat: 34.9898, lng: 33.9942 }
};

const featuresPool = [
  'Piscine', 'Vue mer', 'Parking', 'Climatisation', 'Chauffage central',
  'Terrasse', 'Balcon', 'Jardin', 'Garage', 'Ascenseur', 'Sécurité 24h',
  'Wifi inclus', 'Meublé', 'Cuisine équipée', 'Lave-vaisselle', 'Lave-linge',
  'Barbecue', 'Piscine privée', 'Vue montagne', 'Proche plage', 'Centre ville',
  'Transport public', 'Écoles proximité', 'Commerces proximité', 'Calme'
];

function getRandomFromArray(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateRandomCoordinates(city) {
  const baseCoords = cityCoordinates[city];
  return {
    lat: parseFloat((baseCoords.lat + (Math.random() - 0.5) * 0.04).toFixed(6)),
    lng: parseFloat((baseCoords.lng + (Math.random() - 0.5) * 0.04).toFixed(6)),
    city
  };
}

// Générer les 49 autres projets
for (let i = 1; i < 50; i++) {
  const city = cities[Math.floor(Math.random() * cities.length)];
  const coordinates = generateRandomCoordinates(city);
  const price = Math.floor(Math.random() * (1000000 - 100000) + 100000);
  
  let type;
  if (i <= 30) {
    type = 'Appartement';
  } else {
    type = Math.random() > 0.5 ? 'Maison' : 'Villa';
  }
  
  const bedrooms = Math.floor(Math.random() * 4) + 1;
  const size = type === 'Appartement' ? 
    Math.floor(Math.random() * 80) + 40 : 
    Math.floor(Math.random() * 150) + 100;
  
  const featuresCount = Math.floor(Math.random() * 6) + 5;
  const features = getRandomFromArray(featuresPool, featuresCount);
  
  const photoCount = Math.floor(Math.random() * 3) + 3;
  const photos = [];
  const typeQuery = type.toLowerCase() === 'appartement' ? 'apartment' : type.toLowerCase();
  
  for (let j = 0; j < photoCount; j++) {
    photos.push(`https://source.unsplash.com/random/800x600/?cyprus+${typeQuery}&sig=${i}${j}`);
  }
  
  const planCount = Math.floor(Math.random() * 3) + 1;
  const plans = [];
  for (let j = 0; j < planCount; j++) {
    plans.push(`https://placehold.co/800x600/png?text=Floor+Plan+${j + 1}&font=roboto&seed=${i}${j}`);
  }
  
  const descriptions = {
    'Appartement': [
      `Appartement moderne ${size}m² vue mer à ${city}, ${bedrooms} chambres`,
      `Bel appartement ${size}m² au cœur de ${city}, ${bedrooms} chambres`,
      `Appartement lumineux ${size}m² avec terrasse à ${city}, ${bedrooms} chambres`,
      `Appartement rénové ${size}m² proche centre ${city}, ${bedrooms} chambres`
    ],
    'Maison': [
      `Maison familiale ${size}m² avec jardin à ${city}, ${bedrooms} chambres`,
      `Belle maison ${size}m² traditionnelle à ${city}, ${bedrooms} chambres`,
      `Maison moderne ${size}m² proche commodités ${city}, ${bedrooms} chambres`,
      `Charmante maison ${size}m² dans quartier calme de ${city}, ${bedrooms} chambres`
    ],
    'Villa': [
      `Villa de luxe ${size}m² avec piscine à ${city}, ${bedrooms} chambres`,
      `Magnifique villa ${size}m² vue panoramique ${city}, ${bedrooms} chambres`,
      `Villa contemporaine ${size}m² jardin paysagé ${city}, ${bedrooms} chambres`,
      `Villa exceptionnelle ${size}m² front de mer ${city}, ${bedrooms} chambres`
    ]
  };
  
  const typeDescriptions = descriptions[type];
  const description = typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)];
  
  projects.push({
    title: `${type} ${bedrooms} chambres - ${city}`,
    description,
    type,
    price,
    location: coordinates,
    features,
    photos,
    plans,
    virtual_tour: `https://my.matterport.com/show/?m=project${i}abc`
  });
}

async function seedDatabase() {
  try {
    console.log('🏗️  Génération de 50 biens immobiliers...');
    
    console.log('💾 Insertion en base de données...');
    const { data, error } = await supabase
      .from('projects')
      .insert(projects);
    
    if (error) {
      console.error('❌ Erreur lors de l\'insertion:', error);
      return;
    }
    
    console.log('✅ 50 biens immobiliers créés avec succès !');
    
    // Vérification
    const { count } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true });
    
    console.log(`📊 Total des biens en base : ${count}`);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

// Exécuter le script
seedDatabase();