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
  console.log('Recherche des distances stratégiques...');
  
  const strategicDistances = {
    nearest_beach: null as number | null,
    airport_distance: null as number | null,
    city_center_distance: null as number | null,
    highway_distance: null as number | null
  };

  const strategicSearches = [
    {
      query: 'beach OR sea OR seafront OR waterfront OR plage OR mer',
      field: 'nearest_beach',
      radius: 15000
    },
    {
      query: 'airport OR aéroport Larnaca OR Paphos airport',
      field: 'airport_distance',
      radius: 60000
    },
    {
      query: 'city center OR downtown OR centre ville Limassol OR Paphos center OR Larnaca center',
      field: 'city_center_distance',
      radius: 20000
    },
    {
      query: 'highway OR motorway OR autoroute OR A1 OR A6',
      field: 'highway_distance',
      radius: 15000
    }
  ];

  for (const search of strategicSearches) {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?` +
        `query=${encodeURIComponent(search.query)}` +
        `&location=${lat},${lng}` +
        `&radius=${search.radius}` +
        `&key=${GOOGLE_MAPS_API_KEY}`;
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          const nearest = data.results[0];
          const distance = calculateDistance(
            lat, lng,
            nearest.geometry.location.lat,
            nearest.geometry.location.lng
          );
          
          strategicDistances[search.field as keyof typeof strategicDistances] = distance;
          console.log(`${search.field}: ${distance} km`);
        }
      }
    } catch (error) {
      console.error(`Erreur ${search.field}:`, error);
    }
  }

  if (!strategicDistances.nearest_beach) {
    const cyprusBeaches = [
      { name: "Limassol Beach", lat: 34.6786, lng: 33.0413 },
      { name: "Ladies Mile Beach", lat: 34.6065, lng: 33.0102 },
      { name: "Paphos Beach", lat: 34.7550, lng: 32.4051 },
      { name: "Larnaca Beach", lat: 34.9178, lng: 33.6367 }
    ];
    
    let minDistance = Infinity;
    for (const beach of cyprusBeaches) {
      const distance = calculateDistance(lat, lng, beach.lat, beach.lng);
      if (distance < minDistance) {
        minDistance = distance;
      }
    }
    
    if (minDistance < Infinity) {
      strategicDistances.nearest_beach = Math.round(minDistance * 10) / 10;
    }
  }

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