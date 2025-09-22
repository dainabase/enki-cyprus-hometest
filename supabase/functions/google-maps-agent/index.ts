import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Gestion CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log('📥 Request body:', body);
    
    // Récupérer la clé API
    const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY');
    
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error('Google Maps API key not configured in Supabase environment');
    }

    // Normalisation des paramètres (accepter les deux formats)
    const address = body.address;
    const radius_km = body.radius_km || body.radiusKm || 2; // Accepter les deux formats
    const action = body.action || 'search'; // Par défaut : recherche de lieux
    
    console.log(`🗺️ Action: ${action}, Address: ${address}, Radius: ${radius_km}km`);

    // 1. GÉOCODAGE - Convertir adresse en coordonnées
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`;
    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData = await geocodeResponse.json();
    
    console.log('📍 Geocode status:', geocodeData.status);
    
    if (geocodeData.status !== 'OK' || !geocodeData.results?.length) {
      return new Response(
        JSON.stringify({ 
          error: `Address not found: ${address}. Status: ${geocodeData.status}`,
          details: geocodeData.error_message || 'No results found'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    const location = geocodeData.results[0].geometry.location;
    const lat = location.lat;
    const lng = location.lng;
    
    console.log(`📌 Coordinates found: ${lat}, ${lng}`);

    // Si l'action est juste géocoder
    if (action === 'geocode') {
      return new Response(
        JSON.stringify({
          success: true,
          coordinates: { lat, lng },
          formatted_address: geocodeData.results[0].formatted_address
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. RECHERCHE DE LIEUX AUTOUR
    const placeTypes = [
      'hospital', 'pharmacy', 'doctor', 'school', 'university',
      'supermarket', 'shopping_mall', 'bank', 'atm',
      'restaurant', 'cafe', 'bar', 'gym', 'park',
      'bus_station', 'train_station', 'church', 'mosque',
      'police', 'fire_station', 'post_office', 'library',
      'dentist', 'veterinary_care'
    ];
    
    const allPlaces = [];
    
    for (const type of placeTypes) {
      const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius_km * 1000}&type=${type}&key=${GOOGLE_MAPS_API_KEY}`;
      
      try {
        const placesResponse = await fetch(placesUrl);
        const placesData = await placesResponse.json();
        
        if (placesData.status === 'OK' && placesData.results) {
          // Limiter à 2 résultats par type pour éviter trop de données
          const topPlaces = placesData.results.slice(0, 2);
          allPlaces.push(...topPlaces);
          console.log(`✅ Found ${topPlaces.length} ${type}(s)`);
        } else if (placesData.status === 'ZERO_RESULTS') {
          console.log(`ℹ️ No ${type} found nearby`);
        } else {
          console.log(`⚠️ Error for ${type}: ${placesData.status}`);
        }
      } catch (error) {
        console.error(`Error fetching ${type}:`, error);
      }
    }

    console.log(`📍 Total places found: ${allPlaces.length}`);

    // 3. TRAITER ET FORMATER LES RÉSULTATS
    const processedPlaces = allPlaces.map(place => ({
      name: place.name,
      type: place.types[0],
      distance_km: calculateDistance(lat, lng, place.geometry.location.lat, place.geometry.location.lng),
      address: place.vicinity,
      rating: place.rating || null
    }));

    // Trier par distance
    processedPlaces.sort((a, b) => a.distance_km - b.distance_km);

    // RÉPONSE FINALE
    const response = {
      success: true,
      coordinates: { lat, lng },
      formatted_address: geocodeData.results[0].formatted_address,
      places: processedPlaces,
      total_places_found: processedPlaces.length
    };

    console.log(`✅ Sending response with ${response.places.length} places`);

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error in edge function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack 
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Fonction pour calculer la distance entre deux points GPS
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  // Arrondir à 1 décimale
  return Math.round(distance * 10) / 10;
}