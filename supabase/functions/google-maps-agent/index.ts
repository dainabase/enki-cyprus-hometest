import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PlaceResult {
  name: string;
  type: string;
  distance_km: number;
  address?: string;
  rating?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action = 'search', address, radiusKm = 2, lat, lng } = await req.json();
    const googleApiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');
    
    if (!googleApiKey) {
      throw new Error('Google Maps API key not configured');
    }

    console.log(`🗺️ Google Maps Agent - Action: ${action}`);

    if (action === 'geocode') {
      // Géocodage simple
      const coordinates = await geocodeAddress(address, googleApiKey);
      return new Response(JSON.stringify({ coordinates }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'distances') {
      // Calcul des distances stratégiques
      const distances = await calculateStrategicDistances(lat, lng, googleApiKey);
      return new Response(JSON.stringify({ distances }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'search') {
      // Recherche des commodités
      console.log(`🔍 Searching places near: ${address}, radius: ${radiusKm}km`);
      
      // 1. Géocoder l'adresse
      const coordinates = await geocodeAddress(address, googleApiKey);
      if (!coordinates) {
        throw new Error('Address not found');
      }

      // 2. Rechercher les lieux à proximité
      const places = await searchNearbyPlaces(
        coordinates.lat, 
        coordinates.lng, 
        radiusKm * 1000, // Convertir en mètres
        googleApiKey
      );

      // 3. Traiter et organiser les résultats
      const processedPlaces = processPlaces(places, coordinates);

      console.log(`✅ Found ${processedPlaces.length} places`);

      return new Response(JSON.stringify({ 
        places: processedPlaces,
        coordinates 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error(`Unknown action: ${action}`);

  } catch (error) {
    console.error('❌ Error in Google Maps Agent:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      places: [] 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

/**
 * Géocodage de l'adresse
 */
async function geocodeAddress(address: string, apiKey: string): Promise<{lat: number, lng: number} | null> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    );
    const data = await response.json();
    
    if (data.results && data.results[0]) {
      const location = data.results[0].geometry.location;
      console.log(`📍 Geocoded: ${address} -> ${location.lat}, ${location.lng}`);
      return { lat: location.lat, lng: location.lng };
    }
    
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

/**
 * Recherche des lieux via Places API
 */
async function searchNearbyPlaces(lat: number, lng: number, radius: number, apiKey: string) {
  // Types de lieux à rechercher (Google Places API types)
  const placeTypes = [
    'hospital', 'pharmacy', 'doctor', 'dentist', 'veterinary_care',
    'school', 'secondary_school', 'university',
    'supermarket', 'shopping_mall', 'bakery', 'grocery_or_supermarket', 'store',
    'bank', 'atm', 'post_office', 'local_government_office', 'police',
    'restaurant', 'cafe', 'bar', 'meal_takeaway', 'night_club',
    'gym', 'park', 'amusement_park', 'golf_course', 'casino', 'movie_theater', 'spa',
    'bus_station', 'subway_station', 'taxi_stand', 'airport', 'gas_station', 'parking',
    'church', 'mosque', 'synagogue', 'hindu_temple', 'place_of_worship'
  ];
  
  const allPlaces = [];
  
  // Rechercher chaque type avec délai pour éviter les limites de taux
  for (const type of placeTypes) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${apiKey}`
      );
      const data = await response.json();
      
      if (data.results) {
        allPlaces.push(...data.results);
      }
      
      // Délai de 100ms entre les requêtes
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`Error searching for ${type}:`, error);
    }
  }
  
  console.log(`🔍 Raw places found: ${allPlaces.length}`);
  return allPlaces;
}

/**
 * Traitement et catégorisation des résultats
 */
function processPlaces(places: any[], origin: {lat: number, lng: number}): PlaceResult[] {
  const processed = places.map(place => {
    // Calculer la distance
    const distance = calculateDistance(
      origin.lat, 
      origin.lng,
      place.geometry.location.lat,
      place.geometry.location.lng
    );
    
    // Mapper le type Google vers notre type
    const type = mapGoogleType(place.types || []);
    
    return {
      name: place.name,
      type: type,
      distance_km: Math.round(distance * 10) / 10,
      address: place.vicinity,
      rating: place.rating
    };
  });
  
  // Trier par distance, éliminer les doublons et limiter
  return processed
    .sort((a, b) => a.distance_km - b.distance_km)
    .filter((place, index, self) => 
      // Éliminer les doublons par nom
      index === self.findIndex(p => p.name === place.name)
    )
    .slice(0, 100); // Limiter à 100 résultats
}

/**
 * Calcul de distance entre deux points (formule Haversine)
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Mapper les types Google vers nos types
 */
function mapGoogleType(googleTypes: string[]): string {
  const typeMap: Record<string, string> = {
    'hospital': 'hospital',
    'pharmacy': 'pharmacy',
    'doctor': 'doctor',
    'dentist': 'dentist',
    'veterinary_care': 'veterinary',
    'school': 'primary_school',
    'secondary_school': 'high_school',
    'university': 'university',
    'supermarket': 'supermarket',
    'shopping_mall': 'mall',
    'bakery': 'bakery',
    'grocery_or_supermarket': 'grocery',
    'store': 'shops',
    'bank': 'bank',
    'atm': 'atm',
    'post_office': 'post_office',
    'local_government_office': 'city_hall',
    'police': 'police',
    'restaurant': 'restaurant',
    'cafe': 'cafe',
    'bar': 'bar',
    'meal_takeaway': 'fastfood',
    'night_club': 'nightclub',
    'gym': 'sports_center',
    'park': 'park',
    'amusement_park': 'park',
    'golf_course': 'golf',
    'casino': 'casino',
    'movie_theater': 'cinema',
    'spa': 'sports_center',
    'bus_station': 'bus_stop',
    'subway_station': 'bus_stop',
    'taxi_stand': 'taxi',
    'airport': 'airport',
    'gas_station': 'gas_station',
    'parking': 'parking',
    'church': 'church',
    'mosque': 'mosque',
    'synagogue': 'synagogue',
    'hindu_temple': 'temple',
    'place_of_worship': 'church'
  };
  
  for (const googleType of googleTypes) {
    if (typeMap[googleType]) {
      return typeMap[googleType];
    }
  }
  
  return googleTypes[0] || 'other';
}

/**
 * Calcul des distances stratégiques
 */
async function calculateStrategicDistances(lat: number, lng: number, apiKey: string) {
  const distances: any = {};
  
  try {
    // Rechercher l'aéroport le plus proche
    const airportResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=50000&type=airport&key=${apiKey}`
    );
    const airportData = await airportResponse.json();
    if (airportData.results && airportData.results[0]) {
      const airport = airportData.results[0];
      distances.proximity_airport_km = Math.round(calculateDistance(
        lat, lng,
        airport.geometry.location.lat,
        airport.geometry.location.lng
      ) * 10) / 10;
    }

    // Pour la mer et le centre-ville, on pourrait utiliser des coordonnées fixes 
    // ou des algorithmes plus complexes selon le contexte de Chypre
    
  } catch (error) {
    console.error('Error calculating strategic distances:', error);
  }
  
  return distances;
}