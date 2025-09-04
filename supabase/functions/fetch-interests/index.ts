import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location } = await req.json();
    console.log('Fetching interests for location:', location);

    const xaiApiKey = Deno.env.get('XAI_API_KEY');
    if (!xaiApiKey) {
      throw new Error('XAI_API_KEY not found');
    }

    // Extract city name from location
    const cityName = typeof location === 'string' ? location : location?.city || 'Limassol';
    
    // Call xAI to get top 5 attractions near the location
    const xaiPrompt = `List exactly 5 top tourist attractions near ${cityName}, Cyprus. For each attraction, provide:
    1. Name
    2. A direct Wikipedia URL or official website URL
    3. A brief description (max 50 characters)

    Format as JSON array with objects containing: name, link, desc properties.
    Ensure all URLs are valid and working links.`;

    console.log('Calling xAI with prompt:', xaiPrompt);

    const xaiResponse = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${xaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that provides tourist information for Cyprus. Always respond with valid JSON format.'
          },
          {
            role: 'user',
            content: xaiPrompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      }),
    });

    if (!xaiResponse.ok) {
      console.error('xAI API error:', await xaiResponse.text());
      throw new Error(`xAI API error: ${xaiResponse.status}`);
    }

    const xaiData = await xaiResponse.json();
    console.log('xAI response:', xaiData);

    let interests = [];
    
    try {
      const content = xaiData.choices[0].message.content;
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        interests = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found in response');
      }
    } catch (parseError) {
      console.error('Error parsing xAI response:', parseError);
      // Fallback to default interests for the city
      interests = getDefaultInterests(cityName);
    }

    // Validate and clean the interests
    interests = interests.slice(0, 5).map((interest: any) => ({
      name: interest.name || 'Unknown Attraction',
      link: interest.link || `https://en.wikipedia.org/wiki/${cityName}`,
      desc: interest.desc || 'Tourist attraction'
    }));

    console.log('Final interests:', interests);

    return new Response(JSON.stringify({ interests }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in fetch-interests function:', error);
    
    // Return fallback interests on error
    const fallbackInterests = getDefaultInterests('Limassol');
    
    return new Response(JSON.stringify({ 
      interests: fallbackInterests,
      error: error.message 
    }), {
      status: 200, // Return 200 with fallback data
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getDefaultInterests(cityName: string) {
  const defaultInterests: { [key: string]: any[] } = {
    'limassol': [
      { name: 'Limassol Castle', link: 'https://en.wikipedia.org/wiki/Limassol_Castle', desc: 'Historical medieval castle' },
      { name: 'Limassol Marina', link: 'https://www.limassolmarina.com/', desc: 'Luxury yacht harbor' },
      { name: 'Molos Promenade', link: 'https://www.visitcyprus.com/index.php/en/discovercyprus/city/limassol/attractions-places-of-interest/308-molos-promenade-limassol', desc: 'Scenic seaside walk' },
      { name: 'Kolossi Castle', link: 'https://en.wikipedia.org/wiki/Kolossi_Castle', desc: 'Crusader fortress' },
      { name: 'Kourion', link: 'https://en.wikipedia.org/wiki/Kourion', desc: 'Ancient Greco-Roman site' }
    ],
    'paphos': [
      { name: 'Paphos Archaeological Park', link: 'https://en.wikipedia.org/wiki/Paphos_Archaeological_Park', desc: 'UNESCO World Heritage site' },
      { name: 'Tombs of the Kings', link: 'https://en.wikipedia.org/wiki/Tombs_of_the_Kings_(Paphos)', desc: 'Ancient underground tombs' },
      { name: 'Paphos Castle', link: 'https://en.wikipedia.org/wiki/Paphos_Castle', desc: 'Medieval fortress by the sea' },
      { name: 'Coral Bay', link: 'https://www.visitcyprus.com/index.php/en/discovercyprus/beaches/130-coral-bay-beach', desc: 'Beautiful sandy beach' },
      { name: 'Akamas Peninsula', link: 'https://en.wikipedia.org/wiki/Akamas', desc: 'Protected natural area' }
    ],
    'nicosia': [
      { name: 'Cyprus Museum', link: 'https://en.wikipedia.org/wiki/Cyprus_Museum', desc: 'National archaeological museum' },
      { name: 'Selimiye Mosque', link: 'https://en.wikipedia.org/wiki/Selimiye_Mosque_(Nicosia)', desc: 'Historic Gothic cathedral' },
      { name: 'Ledra Street', link: 'https://en.wikipedia.org/wiki/Ledra_Street', desc: 'Main shopping thoroughfare' },
      { name: 'Venetian Walls', link: 'https://en.wikipedia.org/wiki/Venetian_Walls_of_Nicosia', desc: 'Historic city fortifications' },
      { name: 'Archbishop\'s Palace', link: 'https://en.wikipedia.org/wiki/Archbishop%27s_Palace_(Nicosia)', desc: 'Neo-Byzantine architecture' }
    ]
  };

  const key = cityName.toLowerCase();
  return defaultInterests[key] || defaultInterests['limassol'];
}