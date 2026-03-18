import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { verifyAuth } from '../_shared/auth.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LexaiaRequest {
  country: string;
  budget: number;
  propertyType?: string;
  citizenship?: string;
  laws?: 'EU' | 'US';
}

interface LexaiaResponse {
  tax_saved: number;
  laws: string[];
  recommendations: string[];
  effective_rate: number;
  country_benefits: string[];
  scenarios?: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // JWT verification
  const { error: authError } = verifyAuth(req);
  if (authError) return authError;

  try {
    console.log('Lexaia API Call Function started');
    if (req.method !== 'POST') throw new Error('Method not allowed');

    const { country, budget, propertyType = 'apartment', citizenship = 'EU', laws = 'EU' }: LexaiaRequest = await req.json();
    console.log('Processing Lexaia request:', { country, budget, propertyType, citizenship, laws });

    const LEXAIA_API_KEY = Deno.env.get('LEXAIA_API_KEY');
    let result: LexaiaResponse;

    if (LEXAIA_API_KEY && LEXAIA_API_KEY !== 'placeholder') {
      try {
        const resp = await fetch('https://api.lexaia.com/v1/tax-scenarios', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${LEXAIA_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ country, budget, property_type: propertyType, citizenship, laws }),
        });
        if (!resp.ok) throw new Error(`Lexaia API error: ${resp.status}`);
        const d = await resp.json();
        result = { tax_saved: d.tax_saved||0, laws: d.laws||[], recommendations: d.recommendations||[], effective_rate: d.effective_rate||0, country_benefits: d.country_benefits||[], scenarios: d.scenarios||[] };
      } catch (e) { console.error('Lexaia API error, fallback mock:', e); result = getMockResponse(country, budget); }
    } else {
      // TODO: MOCK - remplacer quand LEXAIA_API_KEY configuree
      result = getMockResponse(country, budget);
    }

    return new Response(JSON.stringify({ success: true, data: result, country, budget, source: LEXAIA_API_KEY ? 'api' : 'mock', generated_at: new Date().toISOString() }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error in Lexaia function:', error);
    return new Response(JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});

// TODO: MOCK - donnees fictives
function getMockResponse(country: string, budget: number): LexaiaResponse {
  const m: Record<string, (b:number)=>LexaiaResponse> = {
    'Chypre': (b)=>({tax_saved:Math.round(b*0.15),laws:['Directive UE 2003/48/CE','Loi chypriote Cap. 118'],recommendations:['Residence fiscale 60j/an','Holding','Exemption CGT 3 ans'],effective_rate:12.5,country_benefits:['Corporate 12.5%','Exemption dividendes','65+ conventions'],scenarios:['Holding','Non-dom','Structure immo']}),
    'France': (b)=>({tax_saved:Math.round(b*0.10),laws:['CGI Art. 150 U','Convention FR-CY'],recommendations:['Non-dom Chypre','SCI','Optimisation PV'],effective_rate:30.0,country_benefits:['Defiscalisation outre-mer'],scenarios:['Relocalisation','SCI+holding']}),
    'Allemagne': (b)=>({tax_saved:Math.round(b*0.12),laws:['EStG','DBA DE-CY'],recommendations:['Holding chypriote','Non-dom','Dividendes'],effective_rate:36.6,country_benefits:['Taux effectif reduit via UE'],scenarios:['GmbH+holding','Relocalisation partielle']}),
    'Belgique': (b)=>({tax_saved:Math.round(b*0.11),laws:['CIR 92','Convention BE-CY'],recommendations:['Holding belgo-chypriote','Residence CY','Regle 60j'],effective_rate:45.0,country_benefits:['Reduction revenus locatifs','0% succession CY'],scenarios:['Relocalisation famille','Holding optimisee']}),
  };
  return m[country]?.(budget) || {tax_saved:Math.round(budget*0.05),laws:['Conventions internationales'],recommendations:['Consultation specialisee requise'],effective_rate:25.0,country_benefits:['Analyse personnalisee requise'],scenarios:['Optimisation sur mesure']};
}
