import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileUrl, context, extractionType } = await req.json();
    console.log('🔍 Starting property extraction for:', fileUrl);

    const XAI_API_KEY = Deno.env.get('XAI_API_KEY');
    
    if (!XAI_API_KEY || XAI_API_KEY === 'placeholder') {
      console.log('🎭 Using mock property extraction (no XAI API key)');
      return mockPropertyExtraction(context);
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the file from storage
    const { data: fileData, error: fileError } = await supabase.storage
      .from('project-documents')
      .download(fileUrl);

    if (fileError) {
      throw new Error(`Failed to download file: ${fileError.message}`);
    }

    // Convert to base64 for AI processing
    const arrayBuffer = await fileData.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    // Call XAI API for property extraction
    const aiResponse = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${XAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-vision-beta',
        messages: [
          {
            role: 'system',
            content: `You are a real estate property extraction expert. Extract individual property details from PDF documents.
            
            Return a JSON object with this structure:
            {
              "properties": [
                {
                  "unit_number": "string",
                  "floor": number,
                  "type": "studio|1bed|2bed|3bed|4bed|penthouse|villa|townhouse",
                  "bedrooms": number,
                  "bathrooms": number,
                  "size_m2": number,
                  "price": number,
                  "view_type": "sea|mountain|garden|city|pool",
                  "orientation": "N|NE|E|SE|S|SW|W|NW",
                  "has_sea_view": boolean,
                  "description": "string"
                }
              ]
            }
            
            Extract ALL properties found in the document. Be precise with numbers.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Extract all property details from this real estate document. Include unit numbers, floors, types, bedrooms, bathrooms, surface area, prices, and any special features mentioned.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:application/pdf;base64,${base64}`
                }
              }
            ]
          }
        ],
        max_completion_tokens: 2000
      })
    });

    if (!aiResponse.ok) {
      throw new Error(`XAI API error: ${aiResponse.status} ${aiResponse.statusText}`);
    }

    const aiResult = await aiResponse.json();
    const extractedContent = aiResult.choices[0]?.message?.content;

    if (!extractedContent) {
      throw new Error('No content extracted from AI response');
    }

    // Parse the JSON response
    let extractedData;
    try {
      // Try to extract JSON from the response
      const jsonMatch = extractedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in AI response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', extractedContent);
      throw new Error('Failed to parse AI response as JSON');
    }

    console.log('✅ Successfully extracted properties:', extractedData.properties?.length || 0);

    return new Response(JSON.stringify({
      success: true,
      properties: extractedData.properties || [],
      source: 'xai_api',
      context
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Property extraction error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      properties: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

function mockPropertyExtraction(context: any) {
  console.log('🎭 Generating mock property data for context:', context);
  
  const mockProperties = [
    {
      unit_number: 'A101',
      floor: 1,
      type: '2bed',
      bedrooms: 2,
      bathrooms: 1,
      size_m2: 85.5,
      price: 285000,
      view_type: 'garden',
      orientation: 'SE',
      has_sea_view: false,
      description: 'Spacious 2-bedroom apartment with garden view'
    },
    {
      unit_number: 'A102',
      floor: 1,
      type: '3bed',
      bedrooms: 3,
      bathrooms: 2,
      size_m2: 120,
      price: 385000,
      view_type: 'sea',
      orientation: 'SW',
      has_sea_view: true,
      description: 'Luxury 3-bedroom with sea view and large terrace'
    },
    {
      unit_number: 'A201',
      floor: 2,
      type: '2bed',
      bedrooms: 2,
      bathrooms: 1,
      size_m2: 85.5,
      price: 295000,
      view_type: 'city',
      orientation: 'E',
      has_sea_view: false,
      description: 'Modern 2-bedroom with city views'
    },
    {
      unit_number: 'A301',
      floor: 3,
      type: 'penthouse',
      bedrooms: 4,
      bathrooms: 3,
      size_m2: 180,
      price: 750000,
      view_type: 'sea',
      orientation: 'S',
      has_sea_view: true,
      description: 'Exclusive penthouse with panoramic sea views and private terrace'
    },
    {
      unit_number: 'B101',
      floor: 1,
      type: '1bed',
      bedrooms: 1,
      bathrooms: 1,
      size_m2: 55,
      price: 195000,
      view_type: 'garden',
      orientation: 'N',
      has_sea_view: false,
      description: 'Cozy 1-bedroom apartment perfect for investment'
    }
  ];

  return new Response(JSON.stringify({
    success: true,
    properties: mockProperties,
    source: 'mock_data',
    context
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}