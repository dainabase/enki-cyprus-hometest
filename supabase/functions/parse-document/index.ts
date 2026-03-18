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
    console.log('PDF parsing function called');
    
    const { fileUrl } = await req.json();
    console.log('Parsing PDF from URL:', fileUrl);
    
    const response = await fetch(fileUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status}`);
    }
    
    const buffer = await response.arrayBuffer();
    console.log(`PDF size: ${buffer.byteLength} bytes`);
    
    // TODO: MOCK - implement real PDF parsing (pdf-parse or similar)
    const content = `PDF Document Content Extraction:\n- File size: ${buffer.byteLength} bytes\n- Content type: application/pdf\n- Status: Successfully fetched\n- Note: Generic PDF processing - implement specific parser for complete extraction`;
    
    return new Response(JSON.stringify({
      success: true,
      content: content.trim(),
      size: buffer.byteLength
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error parsing document:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
