import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
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
    const { fileUrl, context, extractionType } = await req.json();
    console.log('Starting property extraction for:', fileUrl);

    const XAI_API_KEY = Deno.env.get('XAI_API_KEY');
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    if (!XAI_API_KEY && !OPENAI_API_KEY) {
      throw new Error('No AI API key configured (XAI_API_KEY or OPENAI_API_KEY)');
    }

    // TODO: MOCK - implement real extraction pipeline
    return new Response(JSON.stringify({
      success: true,
      message: 'Property extraction endpoint ready - implement real pipeline',
      extractionType,
      fileUrl
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in extract-properties-ai:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
