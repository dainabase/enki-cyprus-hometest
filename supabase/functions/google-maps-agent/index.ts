import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PLACE_TYPES = [
  'transit_station',
  'bus_station', 
  'train_station',
  'subway_station',
  'airport',
  'hospital',
  'pharmacy',
  'doctor',
  'dentist',
  'veterinary_care',
  'physiotherapist',
  'school',
  'university',
  'secondary_school',
  'primary_school',
  'supermarket',
  'shopping_mall',
  'grocery_or_supermarket',
  'convenience_store',
  'bakery',
  'bank',
  'atm',
  'post_office',
  'laundry',
  'hair_care',
  'restaurant',
  'cafe',
  'bar',
  'night_club',
  'movie_theater',
  'gym',
  'spa',
  'beauty_salon',
  'park',
  'church',
  'mosque',
  'synagogue',
  'parking',
  'gas_station',
  'police',
  'fire_station',
  'city_hall',
  'courthouse',
  'embassy',
  'museum',
  'art_gallery',
  'library',
  'tourist_attraction',
  'lodging',
  'hotel'
];

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
}

async function findStrategicDistances(lat: number, lng: number) {
  console.log(`📍 Recherche distances stratégiques pour: ${lat}, ${lng}`);
  
  const strategicDistances = {
    proximity_sea_km: null as number | null,
    proximity_airport_km: null as number | null,
    proximity_city_center_km: null as number | null,
    proximity_highway_km: null as number | null
  };

  // RECHERCHE SPÉCIFIQUE POUR CHYPRE
  
  // 1. PLAGE - Recherche TRÈS locale d'abord
  try {
    // D'abord chercher dans un rayon très proche (2km)
    const beachNearbyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
      `location=${lat},${lng}` +
      `&radius=2000` +
      `&keyword=beach|sea|waterfront|coast|shore` +
      `&key=${GOOGLE_MAPS_API_KEY}`;
    
    const beachResponse = await fetch(beachNearbyUrl);
    const beachData = await beachResponse.json();
    
    if (beachData.results && beachData.results.length > 0) {
      let minDistance = Infinity;
      for (const place of beachData.results) {
        const distance = calculateDistance(
          lat, lng,
          place.geometry.location.lat,
          place.geometry.location.lng
        );
        if (distance < minDistance) {
          minDistance = distance;
        }
      }
      strategicDistances.proximity_sea_km = Math.round(minDistance * 10) / 10;
      console.log(`✅ Plage trouvée par recherche: ${strategicDistances.proximity_sea_km} km`);
    }
    
    // Si pas trouvé, utiliser les coordonnées des plages connues
    if (!strategicDistances.proximity_sea_km) {
      const cyprusBeaches = [
        // Limassol beaches
        { name: "Dasoudi Beach", lat: 34.6786, lng: 33.0413 },
        { name: "Ladies Mile Beach", lat: 34.6065, lng: 33.0102 },
        { name: "Akti Olympion Beach", lat: 34.6624, lng: 33.0287 },
        { name: "Pareklisia Beach", lat: 34.6847, lng: 33.0983 },
        { name: "Governor's Beach", lat: 34.6429, lng: 33.1813 },
        // Paphos beaches
        { name: "Coral Bay Beach", lat: 34.8550, lng: 32.3673 },
        { name: "Paphos Municipal Beach", lat: 34.7550, lng: 32.4051 },
        // Larnaca beaches
        { name: "Finikoudes Beach", lat: 34.9140, lng: 33.6367 },
        { name: "Mackenzie Beach", lat: 34.8850, lng: 33.6340 }
      ];
      
      let minDistance = Infinity;
      for (const beach of cyprusBeaches) {
        const distance = calculateDistance(lat, lng, beach.lat, beach.lng);
        if (distance < minDistance) {
          minDistance = distance;
        }
      }
      strategicDistances.proximity_sea_km = Math.round(minDistance * 10) / 10;
      console.log(`✅ Plage calculée manuellement: ${strategicDistances.proximity_sea_km} km`);
    }
  } catch (error) {
    console.error('Erreur recherche plage:', error);
  }

  // 2. AÉROPORTS DE CHYPRE
  const airports = [
    { name: "Larnaca Airport", lat: 34.8751, lng: 33.6248 },
    { name: "Paphos Airport", lat: 34.7180, lng: 32.4857 }
  ];
  
  let minAirportDistance = Infinity;
  for (const airport of airports) {
    const distance = calculateDistance(lat, lng, airport.lat, airport.lng);
    if (distance < minAirportDistance) {
      minAirportDistance = distance;
    }
  }
  strategicDistances.proximity_airport_km = Math.round(minAirportDistance * 10) / 10;
  console.log(`✅ Aéroport le plus proche: ${strategicDistances.proximity_airport_km} km`);

  // 3. CENTRES-VILLES DE CHYPRE
  const cityCenters = [
    { name: "Limassol City Center", lat: 34.6741, lng: 33.0442 },
    { name: "Paphos City Center", lat: 34.7720, lng: 32.4297 },
    { name: "Larnaca City Center", lat: 34.9178, lng: 33.6345 },
    { name: "Nicosia City Center", lat: 35.1856, lng: 33.3823 }
  ];
  
  let minCityDistance = Infinity;
  for (const city of cityCenters) {
    const distance = calculateDistance(lat, lng, city.lat, city.lng);
    if (distance < minCityDistance) {
      minCityDistance = distance;
    }
  }
  strategicDistances.proximity_city_center_km = Math.round(minCityDistance * 10) / 10;
  console.log(`✅ Centre-ville le plus proche: ${strategicDistances.proximity_city_center_km} km`);

  // 4. AUTOROUTES - Recherche Google Maps
  try {
    const highwayUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?` +
      `query=highway+OR+motorway+OR+A1+OR+A6&location=${lat},${lng}&radius=10000` +
      `&key=${GOOGLE_MAPS_API_KEY}`;
    
    const highwayResponse = await fetch(highwayUrl);
    const highwayData = await highwayResponse.json();
    
    if (highwayData.results && highwayData.results.length > 0) {
      const nearest = highwayData.results[0];
      strategicDistances.proximity_highway_km = calculateDistance(
        lat, lng,
        nearest.geometry.location.lat,
        nearest.geometry.location.lng
      );
    } else {
      // Fallback : autoroutes principales de Chypre
      const highways = [
        { name: "A1 Limassol", lat: 34.6950, lng: 33.0550 },
        { name: "A6 Paphos", lat: 34.7680, lng: 32.4450 }
      ];
      let minHighwayDistance = Infinity;
      for (const highway of highways) {
        const distance = calculateDistance(lat, lng, highway.lat, highway.lng);
        if (distance < minHighwayDistance) {
          minHighwayDistance = distance;
        }
      }
      strategicDistances.proximity_highway_km = Math.round(minHighwayDistance * 10) / 10;
    }
  } catch (error) {
    console.error('Erreur recherche autoroute:', error);
  }

  console.log('📏 Distances finales:', strategicDistances);
  return strategicDistances;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, params } = await req.json();

    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error('Google Maps API key not configured');
    }

    switch (action) {
      case 'geocode':
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(params.address)}&key=${GOOGLE_MAPS_API_KEY}`;
        const geocodeResponse = await fetch(geocodeUrl);
        const geocodeData = await geocodeResponse.json();
        
        if (geocodeData.results && geocodeData.results.length > 0) {
          const result = geocodeData.results[0];
          return new Response(
            JSON.stringify({
              lat: result.geometry.location.lat,
              lng: result.geometry.location.lng,
              formatted_address: result.formatted_address
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        break;

      case 'findNearbyPlaces':
        const { address, radius = 2 } = params;
        
        const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();
        
        if (!geoData.results || geoData.results.length === 0) {
          return new Response(
            JSON.stringify({ error: 'Address not found' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const location = geoData.results[0].geometry.location;
        const radiusMeters = radius * 1000;
        
        const allPlaces: any[] = [];
        const processedPlaceIds = new Set();
        
        for (const placeType of PLACE_TYPES) {
          try {
            const nearbyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
              `location=${location.lat},${location.lng}` +
              `&radius=${radiusMeters}` +
              `&type=${placeType}` +
              `&key=${GOOGLE_MAPS_API_KEY}`;
            
            const nearbyResponse = await fetch(nearbyUrl);
            
            if (nearbyResponse.ok) {
              const nearbyData = await nearbyResponse.json();
              
              if (nearbyData.results) {
                for (const place of nearbyData.results) {
                  if (!processedPlaceIds.has(place.place_id)) {
                    processedPlaceIds.add(place.place_id);
                    
                    const distance = calculateDistance(
                      location.lat,
                      location.lng,
                      place.geometry.location.lat,
                      place.geometry.location.lng
                    );
                    
                    if (distance <= radius) {
                      allPlaces.push({
                        name: place.name,
                        type: placeType,
                        distance_km: distance,
                        address: place.vicinity || place.formatted_address || '',
                        rating: place.rating || null,
                        lat: place.geometry.location.lat,
                        lng: place.geometry.location.lng,
                        place_id: place.place_id
                      });
                    }
                  }
                }
              }
            }
          } catch (error) {
            console.error(`Erreur type ${placeType}:`, error);
          }
        }

        allPlaces.sort((a, b) => a.distance_km - b.distance_km);
        
        const strategicDistances = await findStrategicDistances(location.lat, location.lng);
        
        return new Response(
          JSON.stringify({
            places: allPlaces,
            strategicDistances: strategicDistances,
            totalFound: allPlaces.length,
            location: location
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      default:
        return new Response(
          JSON.stringify({ error: 'Unknown action' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
    }
    
    return new Response(
      JSON.stringify({ error: 'No data found' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});