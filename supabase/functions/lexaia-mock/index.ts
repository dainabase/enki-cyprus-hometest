import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { verifyAuth } from '../_shared/auth.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// TODO: MOCK - cette fonction entiere est un mock, a supprimer quand lexaia-call fonctionne
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // JWT verification
  const { error: authError } = verifyAuth(req);
  if (authError) return authError;

  try {
    const { country, budget, propertyType, citizenship } = await req.json();
    console.log('Lexaia Mock called:', { country, budget });

    const taxSaved = Math.round(budget * 0.10);
    return new Response(JSON.stringify({
      success: true,
      tax_optimization: {
        annual_savings: taxSaved,
        strategies: ['Residence fiscale chypriote', 'Exemption CGT', 'TVA reduite 5%']
      },
      regles_achat: ['Investissement min 300k EUR', 'TVA 5% residence', '0% succession'],
      scenarios: { particulier: { rate: '12.5%' }, societe: { rate: '12.5%' } },
      source: 'mock'
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('Error in lexaia-mock:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
