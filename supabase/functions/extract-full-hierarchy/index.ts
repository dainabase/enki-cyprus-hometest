import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { verifyAuth } from '../_shared/auth.ts';

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
    console.log('Edge function extract-full-hierarchy called');
    
    const requestBody = await req.json();
    const { fileUrls, extractionType } = requestBody;
    
    console.log('Starting full hierarchy extraction for:', fileUrls?.length || 0, 'files');

    // Check API keys
    const xaiApiKey = Deno.env.get('XAI_API_KEY');
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!xaiApiKey && !openaiApiKey) {
      throw new Error('Neither XAI_API_KEY nor OPENAI_API_KEY configured');
    }

    // Process each file
    const extractedContents = await Promise.all(
      (fileUrls || []).map(async (url: string) => {
        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
          const contentType = response.headers.get('content-type') || '';
          
          if (contentType.includes('pdf')) {
            const buffer = await response.arrayBuffer();
            // TODO: MOCK - implement real PDF text extraction
            return { url, content: `PDF file (${buffer.byteLength} bytes) - implement real parser`, type: 'pdf' };
          } else {
            const text = await response.text();
            return { url, content: text.substring(0, 5000), type: 'text' };
          }
        } catch (error) {
          console.error(`Failed to process ${url}:`, error);
          return { url, content: '', type: 'unknown', error: (error as Error).message };
        }
      })
    );

    // Call AI for structured extraction
    const apiKey = xaiApiKey || openaiApiKey;
    const apiUrl = xaiApiKey ? 'https://api.x.ai/v1/chat/completions' : 'https://api.openai.com/v1/chat/completions';
    const model = xaiApiKey ? 'grok-2-1212' : 'gpt-4o-mini';

    const systemPrompt = `Tu es un expert en extraction de donnees immobilieres. Extrais les informations structurees au format JSON avec: developer (name, email, phone), project (title, city, price_from, total_units, golden_visa_eligible), buildings (name, floors, units), properties (unit_number, type, bedrooms, size_m2, price). Return UNIQUEMENT du JSON valide.`;

    const userPrompt = `Analyse ces documents et extrais la hierarchie complete:\n${extractedContents.map(d => `=== ${d.url} ===\n${d.content}`).join('\n\n')}`;

    const aiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 4000,
        temperature: 0.1
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      throw new Error(`AI API failed: ${aiResponse.status} - ${errorText}`);
    }

    const aiData = await aiResponse.json();
    const extractedText = aiData.choices[0].message.content;

    let extractedData;
    try {
      const jsonMatch = extractedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found in AI response');
      extractedData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // TODO: MOCK - fallback data
      extractedData = {
        developer: { name: 'Unknown Developer' },
        project: { title: 'Unknown Project', city: 'Cyprus', total_units: 0 },
        buildings: [],
        properties: []
      };
    }

    return new Response(JSON.stringify(extractedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in extract-full-hierarchy:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
