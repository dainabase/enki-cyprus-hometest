import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { address, radius_km = 2 } = await req.json();
    
    // Récupérer la clé API depuis les variables d'environnement Supabase
    const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY');
    
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error('Google Maps API key not configured');
    }

    // 1. Géocoder l'adresse
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`;
    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData = await geocodeResponse.json();
    
    if (!geocodeData.results || geocodeData.results.length === 0) {
      throw new Error('Address not found');
    }
    
    const location = geocodeData.results[0].geometry.location;
    const lat = location.lat;
    const lng = location.lng;

    // 2. Rechercher les commodités
    const placeTypes = [
      'hospital', 'pharmacy', 'doctor', 'school', 'university',
      'supermarket', 'shopping_mall', 'bank', 'atm',
      'restaurant', 'cafe', 'bar', 'gym', 'park',
      'bus_station', 'church'
    ];
    
    const allPlaces = [];
    
    for (const type of placeTypes) {
      const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius_km * 1000}&type=${type}&key=${GOOGLE_MAPS_API_KEY}`;
      const placesResponse = await fetch(placesUrl);
      const placesData = await placesResponse.json();
      
      if (placesData.results) {
        allPlaces.push(...placesData.results.slice(0, 3)); // Limiter à 3 par type
      }
    }

    // 3. Traiter et formater les résultats
    const processedPlaces = allPlaces.map(place => ({
      name: place.name,
      type: place.types[0],
      distance_km: calculateDistance(lat, lng, place.geometry.location.lat, place.geometry.location.lng),
      address: place.vicinity,
      rating: place.rating
    }));

    // Retourner les résultats
    return new Response(
      JSON.stringify({
        success: true,
        coordinates: { lat, lng },
        places: processedPlaces.sort((a, b) => a.distance_km - b.distance_km)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 10) / 10;
}