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
    const PLACE_TYPES = [
      // Transport
      'transit_station',
      'bus_station', 
      'train_station',
      'subway_station',
      'airport',
      
      // Services essentiels
      'hospital',
      'pharmacy',
      'doctor',
      'dentist',
      'veterinary_care',
      'physiotherapist',
      
      // Éducation
      'school',
      'university',
      'secondary_school',
      'primary_school',
      
      // Shopping & Services
      'supermarket',
      'shopping_mall',
      'grocery_or_supermarket',
      'convenience_store',
      'bakery',
      'bank',
      'atm',
      'post_office',
      
      // Restauration & Loisirs
      'restaurant',
      'cafe',
      'bar',
      'night_club',
      'movie_theater',
      'gym',
      'spa',
      
      // Espaces publics
      'park',
      'beach',
      'church',
      'mosque',
      'synagogue',
      
      // Parking & Essence
      'parking',
      'gas_station',
      
      // Services gouvernementaux
      'police',
      'fire_station',
      'city_hall',
      'courthouse',
      'embassy',
      
      // Culture
      'museum',
      'art_gallery',
      'library',
      'tourist_attraction',
      
      // Hébergement
      'lodging',
      'hotel'
    ];
    
    const allPlaces = [];
    
    for (const type of PLACE_TYPES) {
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

    // 3. RECHERCHE DES DISTANCES STRATÉGIQUES
    async function findStrategicDistances(lat: number, lng: number) {
      const strategicSearches = [
        {
          keyword: 'beach OR sea OR seafront OR waterfront',
          type: 'natural_feature',
          maxResults: 5,
          radius: 10000 // 10km pour la mer
        },
        {
          keyword: 'airport',
          type: 'airport', 
          maxResults: 3,
          radius: 50000 // 50km pour aéroport
        },
        {
          keyword: 'city center OR downtown OR centre ville',
          type: 'point_of_interest',
          maxResults: 3,
          radius: 15000 // 15km pour centre-ville
        },
        {
          keyword: 'highway OR motorway OR autoroute',
          type: 'route',
          maxResults: 3,
          radius: 10000 // 10km pour autoroute
        }
      ];

      const strategicDistances = {
        nearest_beach: null,
        airport_distance: null,
        city_center_distance: null,
        highway_distance: null
      };

      for (const search of strategicSearches) {
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/textsearch/json?` +
            `query=${encodeURIComponent(search.keyword)}` +
            `&location=${lat},${lng}` +
            `&radius=${search.radius}` +
            `&key=${GOOGLE_MAPS_API_KEY}`
          );

          if (response.ok) {
            const data = await response.json();
            if (data.results && data.results.length > 0) {
              const nearest = data.results[0];
              const distance = calculateDistance(
                lat, lng,
                nearest.geometry.location.lat,
                nearest.geometry.location.lng
              );

              if (search.keyword.includes('beach')) {
                strategicDistances.nearest_beach = distance;
              } else if (search.keyword.includes('airport')) {
                strategicDistances.airport_distance = distance;
              } else if (search.keyword.includes('city center')) {
                strategicDistances.city_center_distance = distance;
              } else if (search.keyword.includes('highway')) {
                strategicDistances.highway_distance = distance;
              }
            }
          }
        } catch (error) {
          console.error(`Error searching for ${search.keyword}:`, error);
        }
      }

      return strategicDistances;
    }

    const strategicDistances = await findStrategicDistances(lat, lng);

    // 4. TRAITER ET FORMATER LES RÉSULTATS
    const processedPlaces = allPlaces.map(place => ({
      name: place.name,
      type: place.types[0],
      distance_km: calculateDistance(lat, lng, place.geometry.location.lat, place.geometry.location.lng),
      address: place.vicinity,
      rating: place.rating || null,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng
    }));

    // Trier par distance
    processedPlaces.sort((a, b) => a.distance_km - b.distance_km);

    // RÉPONSE FINALE
    const response = {
      success: true,
      coordinates: { lat, lng },
      formatted_address: geocodeData.results[0].formatted_address,
      places: processedPlaces,
      strategicDistances: strategicDistances,
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