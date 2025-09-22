import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    console.log('🤖 SEO Generator called');
    
    const requestData = await req.json();
    console.log('📋 Request data:', requestData);

    const {
      title,
      description,
      city,
      zone,
      price_from,
      total_units,
      golden_visa,
      developer,
      amenities
    } = requestData;

    // Construct AI prompt for SEO generation
    const prompt = `Generate SEO content for a real estate project in Cyprus with the following details:

Project: ${title}
Description: ${description || 'Premium real estate project'}
Location: ${city}, ${zone || 'Cyprus'}
Price from: €${price_from || 'TBD'}
Total units: ${total_units || 'Multiple'}
Golden Visa eligible: ${golden_visa ? 'Yes' : 'No'}
Developer: ${developer || 'Premium developer'}
Amenities: ${Array.isArray(amenities) ? amenities.join(', ') : 'Premium amenities'}

Generate:
1. SEO title (max 60 characters, include "Cyprus", "Golden Visa" if eligible, and location)
2. Meta description (max 160 characters, compelling, include key details)
3. Keywords (array of 8-10 relevant keywords in French and English)
4. URL slug (clean, SEO-friendly)

Focus on Cyprus real estate investment, Golden Visa program, luxury living, and the specific location.

Return as JSON format:
{
  "meta_title": "...",
  "meta_description": "...", 
  "meta_keywords": ["keyword1", "keyword2", ...],
  "url_slug": "..."
}`;

    console.log('🚀 Calling OpenAI API...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert SEO specialist for luxury real estate in Cyprus. Generate compelling, accurate SEO content that attracts international investors and Golden Visa applicants. Always return valid JSON.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ OpenAI response received');
    
    const generatedContent = data.choices[0].message.content;
    console.log('📝 Generated content:', generatedContent);

    // Parse the JSON response from AI
    let seoData;
    try {
      seoData = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      // Fallback if AI doesn't return valid JSON
      seoData = {
        meta_title: `${title} - Investissement Immobilier Chypre | Golden Visa`,
        meta_description: `Découvrez ${title} à ${city}, projet immobilier premium à Chypre. ${total_units} unités disponibles à partir de ${price_from}€. Éligible Golden Visa.`,
        meta_keywords: ['immobilier chypre', 'golden visa cyprus', city?.toLowerCase(), zone, 'investissement immobilier', 'residence permit'].filter(Boolean),
        url_slug: title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'projet-immobilier'
      };
    }

    console.log('🎯 Final SEO data:', seoData);

    return new Response(JSON.stringify(seoData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error in generate-seo function:', error);
    
    // Return fallback SEO content in case of error
    const fallbackData = {
      meta_title: 'Investissement Immobilier Chypre | Golden Visa',
      meta_description: 'Découvrez nos projets immobiliers premium à Chypre. Investissement sécurisé, éligible Golden Visa. Contactez-nous pour plus d\'informations.',
      meta_keywords: ['immobilier chypre', 'golden visa', 'investissement', 'cyprus real estate'],
      url_slug: 'projet-immobilier-chypre'
    };

    return new Response(JSON.stringify(fallbackData), {
      status: 200, // Return 200 with fallback instead of error
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});