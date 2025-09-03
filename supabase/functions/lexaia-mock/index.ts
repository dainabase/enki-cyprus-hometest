import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TaxScenarioRequest {
  country: string;
  budget: number;
  propertyType?: string;
  citizenship?: string;
}

interface TaxScenarioResponse {
  tax_saved: number;
  laws: string[];
  recommendations: string[];
  effective_rate: number;
  country_benefits: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🏦 Lexaia Tax Mock Function called');
    
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    const { country, budget, propertyType = 'apartment', citizenship = 'EU' }: TaxScenarioRequest = await req.json();

    console.log('📊 Processing tax scenario:', { country, budget, propertyType, citizenship });

    // Mock tax calculations based on country and budget
    const mockTaxScenarios: Record<string, (budget: number) => TaxScenarioResponse> = {
      'Chypre': (budget: number) => ({
        tax_saved: Math.round(budget * 0.15), // 15% savings
        laws: [
          'Directive UE 2003/48/CE sur la fiscalité des revenus',
          'Loi chypriote sur l\'impôt sur le revenu (Cap. 118)',
          'Convention fiscale France-Chypre'
        ],
        recommendations: [
          'Résidence fiscale chypriote après 60 jours/an',
          'Optimisation via holding structure',
          'Exemption gains en capital immobilier après 3 ans'
        ],
        effective_rate: 12.5,
        country_benefits: [
          'Taux d\'imposition corporative 12.5%',
          'Exemption dividendes étrangers',
          'Réseau de 65+ conventions fiscales'
        ]
      }),
      
      'Suisse': (budget: number) => ({
        tax_saved: Math.round(budget * 0.08), // 8% savings
        laws: [
          'Loi fédérale sur l\'impôt fédéral direct (LIFD)',
          'Convention fiscale France-Suisse',
          'Accord UE-Suisse sur la fiscalité'
        ],
        recommendations: [
          'Forfait fiscal pour résidents étrangers',
          'Structure via fondation suisse',
          'Optimisation cantonale (Zoug, Vaud)'
        ],
        effective_rate: 15.0,
        country_benefits: [
          'Stabilité juridique et fiscale',
          'Secret bancaire renforcé',
          'Taux cantonaux avantageux'
        ]
      }),
      
      'Portugal': (budget: number) => ({
        tax_saved: Math.round(budget * 0.12), // 12% savings
        laws: [
          'Régime fiscal des résidents non habituels (RNH)',
          'Code de l\'IRС portugais',
          'Convention fiscale France-Portugal'
        ],
        recommendations: [
          'Statut RNH pour 10 ans (taux 20%)',
          'Golden Visa via investissement immobilier',
          'Exemption plus-values résidence principale'
        ],
        effective_rate: 20.0,
        country_benefits: [
          'Régime RNH très avantageux',
          'Golden Visa 500k€ minimum',
          'Accès libre zone Schengen'
        ]
      }),
      
      'Espagne': (budget: number) => ({
        tax_saved: Math.round(budget * 0.06), // 6% savings
        laws: [
          'Loi 35/2006 sur l\'IRPF',
          'Convention fiscale France-Espagne',
          'Directive UE sur la libre circulation'
        ],
        recommendations: [
          'Résidence fiscale espagnole',
          'Optimisation via SL/SA',
          'Déduction investissement résidence habituelle'
        ],
        effective_rate: 24.0,
        country_benefits: [
          'Proximité géographique France',
          'Coût de la vie avantageux',
          'Marché immobilier dynamique'
        ]
      })
    };

    // Default scenario for unknown countries
    const defaultScenario = (budget: number): TaxScenarioResponse => ({
      tax_saved: Math.round(budget * 0.05),
      laws: ['Conventions fiscales internationales', 'Directive UE sur les services'],
      recommendations: ['Consultation fiscaliste spécialisé', 'Analyse structure optimale'],
      effective_rate: 25.0,
      country_benefits: ['Analyse personnalisée requise']
    });

    const scenario = mockTaxScenarios[country] || defaultScenario;
    const result = scenario(budget);

    // Add some randomization for realism
    const variationFactor = 0.9 + Math.random() * 0.2; // ±10% variation
    result.tax_saved = Math.round(result.tax_saved * variationFactor);

    console.log('✅ Tax scenario generated:', result);

    return new Response(
      JSON.stringify({
        success: true,
        data: result,
        country,
        budget,
        generated_at: new Date().toISOString()
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    );

  } catch (error) {
    console.error('❌ Error in Lexaia function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        generated_at: new Date().toISOString()
      }),
      {
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    );
  }
});