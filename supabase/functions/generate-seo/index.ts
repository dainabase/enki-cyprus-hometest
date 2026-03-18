import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { verifyAuth } from '../_shared/auth.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // JWT verification
  const { error: authError } = verifyAuth(req);
  if (authError) return authError;

  try {
    console.log('SEO Generator called');
    const requestData = await req.json();
    const { title, description, city, zone, price_from, total_units, golden_visa, developer, amenities } = requestData;

    const prompt = `Generate SEO content for a real estate project in Cyprus:\nProject: ${title}\nLocation: ${city}, ${zone || 'Cyprus'}\nPrice from: ${price_from || 'TBD'} EUR\nGolden Visa: ${golden_visa ? 'Yes' : 'No'}\nDeveloper: ${developer || 'Premium'}\nAmenities: ${Array.isArray(amenities) ? amenities.join(', ') : 'Premium'}\n\nReturn JSON: { "meta_title": "max60chars", "meta_description": "max160chars", "meta_keywords": [...], "url_slug": "..." }`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${openAIApiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: 'Expert SEO for Cyprus real estate. Return valid JSON only.' }, { role: 'user', content: prompt }], temperature: 0.7, max_tokens: 500 }),
    });
    if (!response.ok) throw new Error(`OpenAI API error: ${response.status}`);
    const data = await response.json();
    let seoData;
    try { seoData = JSON.parse(data.choices[0].message.content); } catch {
      seoData = {
        meta_title: `${title} - Investissement Immobilier Chypre`,
        meta_description: `${title} a ${city}, projet premium. ${total_units || ''} unites a partir de ${price_from || ''} EUR.`,
        meta_keywords: ['immobilier chypre', 'golden visa cyprus', city?.toLowerCase(), 'investissement'].filter(Boolean),
        url_slug: title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'projet'
      };
    }
    return new Response(JSON.stringify(seoData), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error in generate-seo:', error);
    return new Response(JSON.stringify({ meta_title: 'Investissement Immobilier Chypre', meta_description: 'Projets premium a Chypre. Eligible Golden Visa.', meta_keywords: ['immobilier chypre','golden visa'], url_slug: 'projet-immobilier-chypre' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
