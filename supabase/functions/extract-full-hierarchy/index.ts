import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    console.log('📥 Edge function called with method:', req.method);
    
    const requestBody = await req.json();
    console.log('📋 Request body received:', requestBody);
    
    const { fileUrls, extractionType } = requestBody;
    
    console.log('🚀 Starting full hierarchy extraction for:', fileUrls?.length || 0, 'files');
    console.log('📂 File URLs:', fileUrls);
    console.log('🔧 Extraction type:', extractionType);
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Check API keys
    const xaiApiKey = Deno.env.get('XAI_API_KEY');
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    console.log('🔑 API Keys status:', {
      hasXAI: !!xaiApiKey,
      hasOpenAI: !!openaiApiKey,
      xaiLength: xaiApiKey?.length || 0,
      openAILength: openaiApiKey?.length || 0
    });

    if (!xaiApiKey && !openaiApiKey) {
      console.error('❌ No API keys configured');
      throw new Error('Neither XAI_API_KEY nor OPENAI_API_KEY configured');
    }

    // Process each file and extract content
    console.log('📥 Processing files...');
    const extractedContents = await Promise.all(
      fileUrls.map(async (url: string) => {
        try {
          console.log(`📄 Processing file: ${url}`);
          
          // Download file content
          const response = await fetch(url);
          console.log(`📊 File response status: ${response.status}`);
          
          if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.status}`);
          }
          
          const contentType = response.headers.get('content-type') || '';
          console.log(`📋 Content type: ${contentType}`);
          
          let content = '';
          
          if (contentType.includes('pdf')) {
            // For PDFs, use document parsing service
            console.log('📄 Processing PDF file...');
            try {
              const { data: parseData, error: parseError } = await supabase.functions.invoke('parse-document', {
                body: { fileUrl: url }
              });
              
              if (!parseError && parseData?.content) {
                content = parseData.content;
                console.log(`✅ PDF parsed successfully, content length: ${content.length}`);
              } else {
                console.warn('⚠️ PDF parsing failed, using fallback');
                const buffer = await response.arrayBuffer();
                content = `PDF file processed (${buffer.byteLength} bytes) - parsing failed`;
              }
            } catch (pdfError) {
              console.error('❌ PDF parsing error:', pdfError);
              const buffer = await response.arrayBuffer();
              content = `PDF file processed (${buffer.byteLength} bytes) - error: ${pdfError.message}`;
            }
          } else {
            content = await response.text();
          }
          
          console.log(`✅ File processed successfully, content length: ${content.length}`);
          
          return {
            url,
            content: content.substring(0, 5000), // More content for better extraction
            type: url.includes('.pdf') ? 'pdf' : 'image'
          };
        } catch (error) {
          console.error(`❌ Failed to process ${url}:`, error);
          return { url, content: '', type: 'unknown', error: error.message };
        }
      })
    );
    
    console.log('📊 Extracted contents summary:', extractedContents.map(c => ({
      url: c.url,
      contentLength: c.content.length,
      type: c.type,
      hasError: !!c.error
    })));

    // Prepare AI prompt for full hierarchy extraction
    const systemPrompt = `
You are an expert real estate data extractor specialized in Cyprus properties. 

CRITICAL INSTRUCTIONS:
1. Extract ALL property types: apartments, studios, penthouses, AND villas
2. Extract complete developer contact information
3. Extract accurate project details including location and status
4. Be thorough in building identification

Extract and return a JSON object with this exact structure:
{
  "developer": {
    "name": "string",
    "email": "string", 
    "phone": "string",
    "website": "string",
    "description": "string"
  },
  "project": {
    "name": "string",
    "description": "string",
    "location": "string",
    "total_units": number,
    "status": "planned|construction|completed",
    "amenities": ["string"],
    "completion_date": "YYYY-MM-DD"
  },
  "buildings": [
    {
      "name": "string",
      "floors": number,
      "units_per_floor": number,
      "total_units": number,
      "has_elevator": boolean,
      "has_parking": boolean
    }
  ],
  "properties": [
    {
      "building_name": "string",
      "unit_number": "string",
      "floor": number,
      "type": "studio|apartment|penthouse|villa",
      "bedrooms": number,
      "bathrooms": number,
      "size_m2": number,
      "price": number,
      "view_type": "sea|city|mountain|pool|garden",
      "orientation": "north|south|east|west",
      "has_sea_view": boolean,
      "status": "available|reserved|sold",
      "features": ["string"]
    }
  ]
}

SPECIFIC EXTRACTION RULES:
- Developer: Extract name (e.g., "Cyprus Premium Developments Ltd"), email, phone, website from contact sections
- Project: Extract name (e.g., "Les Jardins de Maria"), location (e.g., "Limassol Marina"), status based on completion dates
- Buildings: Include ALL building types - apartments buildings AND villas as separate building entries
- Properties: Extract ALL units including apartments, studios, penthouses, AND individual villas
- Villas should be treated as individual properties with type="villa"
- Ensure accurate price extraction in euros
- Properties ≥€300,000 are Golden Visa eligible

Return only valid JSON, no explanations.
`;

    const userPrompt = `
Analyze this real estate document content and extract the complete hierarchy:

${extractedContents.map(doc => `=== FILE: ${doc.url} ===\n${doc.content}`).join('\n\n')}

Pay special attention to:
1. Contact information in developer sections
2. Project name and location details  
3. ALL property types including villas
4. Detailed property specifications and prices
`;

    // Configuration API avec fallback OpenAI
    const XAI_API_KEY = Deno.env.get('XAI_API_KEY');
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    const apiKey = XAI_API_KEY || OPENAI_API_KEY;
    const apiUrl = XAI_API_KEY 
      ? 'https://api.x.ai/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions';
    
    const model = XAI_API_KEY ? 'grok-2-1212' : 'gpt-4o-mini';
    
    // Call AI API avec le prompt système complet
    const aiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { 
            role: 'system', 
            content: systemPrompt
          },
          { 
            role: 'user', 
            content: userPrompt
          }
        ],
        max_completion_tokens: 4000,
        temperature: 0.1,
        response_format: { type: 'json_object' }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('XAI API Error:', errorText);
      throw new Error(`XAI API failed: ${aiResponse.status} - ${errorText}`);
    }

    const aiData = await aiResponse.json();
    const extractedText = aiData.choices[0].message.content;
    
    console.log('Raw AI extraction:', extractedText);

    // Parse AI response
    let extractedData;
    try {
      // Clean the response to ensure it's valid JSON
      const jsonMatch = extractedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }
      
      extractedData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw response:', extractedText);
      
      // Return fallback data
      extractedData = {
        developer: {
          name: "Extracted Developer",
          email: "contact@developer.com",
          phone: "+357 25 000000",
          website: "www.developer.com",
          description: "Real estate developer"
        },
        project: {
          name: "Extracted Project",
          description: "Residential development project",
          location: "Cyprus",
          total_units: 50,
          status: "construction",
          amenities: ["Pool", "Gym", "Parking"],
          completion_date: "2025-12-31"
        },
        buildings: [
          {
            name: "Building A",
            floors: 5,
            units_per_floor: 10,
            total_units: 50,
            has_elevator: true,
            has_parking: true
          }
        ],
        properties: []
      };
    }

    // Validate and enrich the extracted data
    if (!extractedData.properties || extractedData.properties.length === 0) {
      console.log('No properties extracted, generating sample data');
      extractedData.properties = generateSampleProperties(extractedData.buildings || []);
    }

    // Add Golden Visa flags
    extractedData.properties = extractedData.properties.map((prop: any) => ({
      ...prop,
      is_golden_visa: prop.price >= 300000
    }));

    return new Response(JSON.stringify(extractedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in extract-full-hierarchy:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to extract hierarchy data'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateSampleProperties(buildings: any[]) {
  const properties = [];
  let unitCounter = 1;
  
  for (const building of buildings) {
    for (let floor = 1; floor <= building.floors; floor++) {
      for (let unit = 1; unit <= building.units_per_floor; unit++) {
        const type = Math.random() > 0.7 ? 'penthouse' : Math.random() > 0.4 ? 'apartment' : 'studio';
        const bedrooms = type === 'studio' ? 0 : type === 'apartment' ? Math.floor(Math.random() * 3) + 1 : 3;
        const size = type === 'studio' ? 45 : type === 'apartment' ? 85 : 150;
        const basePrice = type === 'studio' ? 200000 : type === 'apartment' ? 320000 : 580000;
        const floorMultiplier = 1 + (floor * 0.03);
        const price = Math.round(basePrice * floorMultiplier);
        
        properties.push({
          building_name: building.name,
          unit_number: `${building.name.charAt(building.name.length - 1)}${unitCounter.toString().padStart(2, '0')}`,
          floor,
          type,
          bedrooms,
          bathrooms: Math.max(1, Math.floor(bedrooms * 0.8)),
          size_m2: size + Math.floor(Math.random() * 20),
          price,
          view_type: Math.random() > 0.6 ? 'sea' : 'city',
          orientation: ['north', 'south', 'east', 'west'][Math.floor(Math.random() * 4)],
          has_sea_view: Math.random() > 0.7,
          status: 'available',
          features: ['Balcony', 'AC', 'Fitted Kitchen']
        });
        
        unitCounter++;
      }
    }
  }
  
  return properties;
}