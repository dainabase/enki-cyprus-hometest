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
    const { location } = await req.json();
    console.log('Fetching interests for location:', location);

    const xaiApiKey = Deno.env.get('XAI_API_KEY');
    if (!xaiApiKey) {
      // TODO: MOCK - return basic interests when no API key
      return new Response(JSON.stringify({
        success: true,
        interests: ['Beach proximity', 'Mediterranean climate', 'EU membership', 'Tax benefits', 'Golden Visa'],
        source: 'mock'
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // TODO: implement real AI-powered interest detection
    return new Response(JSON.stringify({
      success: true,
      interests: [],
      location,
      source: 'api'
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('Error fetching interests:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
