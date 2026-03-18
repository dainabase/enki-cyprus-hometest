import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ParsedQuery {
  pays_origine: string;
  budget: number;
  type_investissement: string;
  localisation_preferee: string;
  objectifs: string[];
  situation_familiale?: string;
  experience_immobilier?: string;
  bedrooms_min?: number;
  amenities_wanted?: string[];
}

interface ProjectMatch {
  id: string;
  title: string;
  price_from: number;
  price_to: number | null;
  city: string;
  cyprus_zone: string | null;
  property_category: string | null;
  description: string;
  unique_selling_points: Record<string, unknown> | null;
  golden_visa_eligible: boolean;
  bedrooms_range_min: number | null;
  bedrooms_range_max: number | null;
  photos: Record<string, unknown> | null;
  proximity_sea_km: number | null;
  rental_yield_percent: number | null;
  status: string | null;
}

interface LexaiaAnalysis {
  tax_saved: number;
  optimisation_fiscale: string[];
  regles_achat: string[];
  societe_recommandee: boolean;
  scenarios: {
    particulier: Record<string, unknown>;
    societe: Record<string, unknown>;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // --- JWT Verification ---
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Authorization header requis' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { query, consent } = await req.json();
    
    if (!query || !consent) {
      return new Response(
        JSON.stringify({ error: 'Requete et consentement requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Recherche agentique demarree:', query);

    // 1. Parse la requete avec xAI API
    const parsedQuery = await parseQueryWithAI(query);
    console.log('Requete parsee:', parsedQuery);

    // 2. Initialize Supabase client with user JWT for RLS
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      {
        global: {
          headers: { Authorization: authHeader }
        }
      }
    );

    // 3. Query des projets matching (table projects, colonnes reelles)
    const matchingProjects = await findMatchingProjects(supabase, parsedQuery);
    console.log('Projets trouves:', matchingProjects.length);

    // 4. Analyse fiscale avec Lexaia
    const lexaiaAnalysis = await getLexaiaAnalysis(parsedQuery, matchingProjects);
    console.log('Analyse Lexaia completee');

    // 5. Generation du PDF (structure)
    const pdfUrl = await generatePDF(parsedQuery, matchingProjects, lexaiaAnalysis);
    console.log('PDF genere:', pdfUrl);

    // 6. Log de l'interaction (anonymise)
    await logSearchInteraction(supabase, parsedQuery, matchingProjects.length);

    return new Response(
      JSON.stringify({
        success: true,
        parsed_query: parsedQuery,
        projects: matchingProjects,
        lexaia_analysis: lexaiaAnalysis,
        pdf_url: pdfUrl,
        total_projects: matchingProjects.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erreur recherche agentique:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erreur lors de la recherche agentique',
        details: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function parseQueryWithAI(query: string): Promise<ParsedQuery> {
  const XAI_API_KEY = Deno.env.get('XAI_API_KEY');
  
  if (!XAI_API_KEY) {
    console.warn('XAI_API_KEY non configuree, utilisation parsing mock');
    return mockParseQuery(query);
  }

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${XAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-2-1212',
        messages: [
          {
            role: 'system',
            content: `Tu es un expert en immobilier international et fiscalite. Parse cette requete client et extraie les informations structurees au format JSON strict:
{
  "pays_origine": "string (pays du client)",
  "budget": "number (en EUR, convertir si CHF/USD)",
  "type_investissement": "string (investissement/residence_principale/residence_secondaire)",
  "localisation_preferee": "string (ville/region a Chypre: Limassol, Paphos, Larnaca, Nicosia, Famagusta)",
  "objectifs": ["array de strings (objectifs principaux)"],
  "situation_familiale": "string optionnel",
  "experience_immobilier": "string optionnel",
  "bedrooms_min": "number optionnel (nombre minimum de chambres)",
  "amenities_wanted": ["array optionnel de strings (piscine, gym, spa, parking, securite, plage)"]
}

Reponds UNIQUEMENT avec le JSON valide, sans markdown ni explication.`
          },
          {
            role: 'user',
            content: query
          }
        ],
        temperature: 0.1,
        max_tokens: 500
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      return JSON.parse(content);
    } catch (parseError) {
      console.error('Erreur parsing JSON xAI:', parseError);
      return mockParseQuery(query);
    }
  } catch (error) {
    console.error('Erreur API xAI:', error);
    return mockParseQuery(query);
  }
}

function mockParseQuery(query: string): ParsedQuery {
  // TODO: MOCK - remplacer par vraie IA quand XAI_API_KEY configuree
  const lowerQuery = query.toLowerCase();
  return {
    pays_origine: lowerQuery.includes('suisse') ? 'Suisse' 
      : lowerQuery.includes('allemag') ? 'Allemagne'
      : lowerQuery.includes('belg') ? 'Belgique'
      : 'France',
    budget: lowerQuery.includes('500') ? 500000 
      : lowerQuery.includes('800') ? 800000
      : lowerQuery.includes('1m') ? 1000000
      : 300000,
    type_investissement: lowerQuery.includes('resid') ? 'residence_principale' : 'investissement',
    localisation_preferee: lowerQuery.includes('paphos') ? 'Paphos' 
      : lowerQuery.includes('larnaca') ? 'Larnaca'
      : lowerQuery.includes('nicosia') ? 'Nicosia'
      : 'Limassol',
    objectifs: ['optimisation_fiscale', 'investissement_locatif'],
    situation_familiale: 'non_precise',
    experience_immobilier: 'non_precise'
  };
}

/**
 * Recherche les projets correspondants dans la table `projects`.
 * 
 * Colonnes reelles utilisees (verifiees via Supabase schema 2026-03-18):
 * - price_from (numeric) : prix minimum du projet
 * - price_to (numeric) : prix maximum du projet
 * - city (text) : ville du projet
 * - property_category (text) : categorie de propriete
 * - golden_visa_eligible (boolean) : eligible Golden Visa
 * - bedrooms_range_min/max (integer) : fourchette chambres
 * - status (text) : statut du projet
 * - show_on_website (boolean) : visible sur le site
 */
async function findMatchingProjects(supabase: ReturnType<typeof createClient>, parsedQuery: ParsedQuery): Promise<ProjectMatch[]> {
  try {
    // Budget range: 70% to 130% du budget client
    const budgetMin = Math.max(0, parsedQuery.budget * 0.7);
    const budgetMax = parsedQuery.budget * 1.3;

    let queryBuilder = supabase
      .from('projects')
      .select(`
        id, title, description, city, cyprus_zone, property_category,
        price_from, price_to, golden_visa_eligible,
        bedrooms_range_min, bedrooms_range_max,
        unique_selling_points, photos, proximity_sea_km,
        rental_yield_percent, status, has_pool, has_gym, has_spa,
        has_parking, has_security_system, beach_access
      `)
      .gte('price_from', budgetMin)
      .lte('price_from', budgetMax)
      .eq('show_on_website', true);

    // Filtre par ville si specifiee
    if (parsedQuery.localisation_preferee && parsedQuery.localisation_preferee !== 'Chypre') {
      queryBuilder = queryBuilder.ilike('city', `%${parsedQuery.localisation_preferee}%`);
    }

    // Filtre par categorie de propriete
    if (parsedQuery.type_investissement === 'investissement') {
      queryBuilder = queryBuilder.in('property_category', ['apartment', 'commercial', 'villa', 'penthouse']);
    }

    // Filtre par nombre de chambres si specifie
    if (parsedQuery.bedrooms_min) {
      queryBuilder = queryBuilder.gte('bedrooms_range_max', parsedQuery.bedrooms_min);
    }

    const { data: projects, error } = await queryBuilder
      .order('price_from', { ascending: true })
      .limit(6);

    if (error) {
      console.error('Erreur query Supabase:', error.message, error.details);
      throw error;
    }

    return (projects || []).map((proj: Record<string, unknown>) => ({
      id: proj.id as string,
      title: proj.title as string,
      price_from: proj.price_from as number,
      price_to: (proj.price_to as number) || null,
      city: proj.city as string,
      cyprus_zone: (proj.cyprus_zone as string) || null,
      property_category: (proj.property_category as string) || null,
      description: (proj.description as string) || '',
      unique_selling_points: (proj.unique_selling_points as Record<string, unknown>) || null,
      golden_visa_eligible: (proj.golden_visa_eligible as boolean) || false,
      bedrooms_range_min: (proj.bedrooms_range_min as number) || null,
      bedrooms_range_max: (proj.bedrooms_range_max as number) || null,
      photos: (proj.photos as Record<string, unknown>) || null,
      proximity_sea_km: (proj.proximity_sea_km as number) || null,
      rental_yield_percent: (proj.rental_yield_percent as number) || null,
      status: (proj.status as string) || null,
    }));

  } catch (error) {
    console.error('Erreur query projects:', error);
    return [];
  }
}

async function getLexaiaAnalysis(parsedQuery: ParsedQuery, projects: ProjectMatch[]): Promise<LexaiaAnalysis> {
  try {
    const lexaiaResponse = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/lexaia-call`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
        },
        body: JSON.stringify({
          country: parsedQuery.pays_origine,
          investment_amount: parsedQuery.budget,
          property_type: parsedQuery.type_investissement,
          properties_count: projects.length
        })
      }
    );

    if (lexaiaResponse.ok) {
      const lexaiaData = await lexaiaResponse.json();
      return {
        tax_saved: lexaiaData.tax_optimization?.annual_savings || 0,
        optimisation_fiscale: lexaiaData.tax_optimization?.strategies || [],
        regles_achat: lexaiaData.regles_achat || [],
        societe_recommandee: parsedQuery.budget > 350000,
        scenarios: lexaiaData.scenarios || {
          particulier: {},
          societe: {}
        }
      };
    } else {
      throw new Error(`Lexaia API status ${lexaiaResponse.status}`);
    }
  } catch (error) {
    console.error('Erreur Lexaia:', error);
    // TODO: MOCK - remplacer quand lexaia-call sera connectee a une vraie API
    return {
      tax_saved: 0,
      optimisation_fiscale: [
        'Analyse fiscale non disponible - consultez un conseiller agree'
      ],
      regles_achat: [
        'Investissement minimum Golden Visa: 300,000 EUR',
        'TVA 5% residence principale neuve',
        'TVA 19% investissement/revente',
        'Pas de droits de succession a Chypre',
        'CGT exemption apres 3 ans'
      ],
      societe_recommandee: parsedQuery.budget > 350000,
      scenarios: {
        particulier: { note: 'Consultez un conseiller fiscal agree' },
        societe: { note: 'Consultez un conseiller fiscal agree' }
      }
    };
  }
}

async function generatePDF(
  parsedQuery: ParsedQuery, 
  projects: ProjectMatch[], 
  lexaiaAnalysis: LexaiaAnalysis
): Promise<string> {
  try {
    // TODO: MOCK - implementer vraie generation PDF (pdfmake ou puppeteer)
    const docDefinition = {
      content: [
        {
          text: 'DOSSIER IMMOBILIER PERSONNALISE - CHYPRE',
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 30]
        },
        {
          text: 'PROFIL CLIENT',
          style: 'subheader',
          margin: [0, 20, 0, 10]
        },
        {
          table: {
            widths: ['30%', '70%'],
            body: [
              ["Pays d'origine:", parsedQuery.pays_origine],
              ['Budget:', `${parsedQuery.budget.toLocaleString()} EUR`],
              ["Type d'investissement:", parsedQuery.type_investissement],
              ['Localisation preferee:', parsedQuery.localisation_preferee],
              ['Objectifs:', parsedQuery.objectifs.join(', ')]
            ]
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 20]
        },
        {
          text: 'PROJETS RECOMMANDES',
          style: 'subheader',
          margin: [0, 20, 0, 10]
        },
        ...projects.map((project, index) => ([
          {
            text: `${index + 1}. ${project.title}`,
            style: 'propertyTitle',
            margin: [0, 10, 0, 5]
          },
          {
            table: {
              widths: ['25%', '75%'],
              body: [
                ['Prix a partir de:', `${project.price_from?.toLocaleString() || 'N/A'} EUR`],
                ['Categorie:', project.property_category || 'Non specifiee'],
                ['Ville:', project.city],
                ['Zone:', project.cyprus_zone || 'Non specifiee'],
                ['Golden Visa:', project.golden_visa_eligible ? 'Eligible' : 'Non eligible'],
                ['Description:', project.description || 'Non disponible']
              ]
            },
            layout: 'noBorders',
            margin: [0, 0, 0, 15]
          }
        ])).flat(),
        {
          text: 'OPTIMISATION FISCALE',
          style: 'subheader',
          margin: [0, 20, 0, 10]
        },
        {
          text: lexaiaAnalysis.tax_saved > 0 
            ? `Economies fiscales estimees: ${lexaiaAnalysis.tax_saved.toLocaleString()} EUR/an`
            : 'Analyse fiscale detaillee disponible sur consultation',
          style: 'highlight',
          margin: [0, 0, 0, 10]
        },
        {
          ul: lexaiaAnalysis.regles_achat,
          margin: [0, 0, 0, 15]
        }
      ],
      styles: {
        header: { fontSize: 18, bold: true, color: '#2563eb' },
        subheader: { fontSize: 14, bold: true, color: '#1e40af', margin: [0, 15, 0, 5] },
        propertyTitle: { fontSize: 12, bold: true, color: '#059669' },
        highlight: { fontSize: 12, bold: true, color: '#dc2626' },
        normal: { fontSize: 10 }
      },
      defaultStyle: { fontSize: 10 }
    };

    // TODO: MOCK - uploader vers Supabase Storage quand PDF generation implementee
    const fileName = `dossier-immobilier-${Date.now()}.json`;
    const mockPdfUrl = `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/media/dossiers/${fileName}`;
    
    console.log('PDF structure generee pour', projects.length, 'projets');
    return mockPdfUrl;
    
  } catch (error) {
    console.error('Erreur generation PDF:', error);
    return `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/media/reports/agentic-search-${Date.now()}.pdf`;
  }
}

async function logSearchInteraction(
  supabase: ReturnType<typeof createClient>, 
  parsedQuery: ParsedQuery, 
  projectsCount: number
): Promise<void> {
  try {
    await supabase
      .from('analytics_events')
      .insert({
        event_name: 'agentic_search_completed',
        event_data: {
          pays_origine: parsedQuery.pays_origine,
          budget_range: getBudgetRange(parsedQuery.budget),
          type_investissement: parsedQuery.type_investissement,
          localisation: parsedQuery.localisation_preferee,
          projects_found: projectsCount,
          timestamp: new Date().toISOString()
        },
        page_url: '/agentic-search',
        user_agent: 'Supabase Edge Function'
      });
  } catch (error) {
    // Analytics failure should not break the search
    console.error('Erreur log analytics (non-blocking):', error);
  }
}

function getBudgetRange(budget: number): string {
  if (budget < 200000) return '0-200k';
  if (budget < 500000) return '200k-500k';
  if (budget < 1000000) return '500k-1M';
  return '1M+';
}
