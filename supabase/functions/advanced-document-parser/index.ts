import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    console.log('Advanced Document Parser - Starting');
    
    const { fileUrls } = await req.json();
    console.log('Processing documents:', fileUrls?.length || 0);
    
    // TODO: MOCK - implement real document parsing pipeline
    return new Response(JSON.stringify({
      success: true,
      message: 'Advanced document parser ready - implement real pipeline',
      filesCount: fileUrls?.length || 0
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('Error in advanced-document-parser:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
