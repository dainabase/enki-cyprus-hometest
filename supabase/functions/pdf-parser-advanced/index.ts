import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 PDF Parser Advanced - Starting');
    
    const { fileUrl } = await req.json();
    console.log('📄 Processing PDF:', fileUrl);
    
    // Initialize Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Check API keys
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('🔑 API Keys available: OpenAI ✓');

    // Step 1: Download and process PDF with multiple methods
    console.log('📥 Step 1: Advanced PDF Processing');
    const extractedContent = await advancedPDFExtraction(fileUrl, supabaseKey);
    
    if (!extractedContent || extractedContent.length < 100) {
      throw new Error(`Extraction PDF insuffisante: seulement ${extractedContent?.length || 0} caractères extraits`);
    }
    
    console.log(`✅ Contenu extrait: ${extractedContent.length} caractères`);
    console.log(`📋 Aperçu: "${extractedContent.substring(0, 300)}..."`);
    
    // Step 2: Intelligent AI Analysis with specialized prompts
    console.log('🤖 Step 2: AI Analysis with Real Estate Expert System');
    const extractedData = await intelligentRealEstateExtraction(extractedContent, openaiApiKey);
    
    // Step 3: Data validation and enrichment
    console.log('✨ Step 3: Data Validation and Enrichment');
    const validatedData = await validateAndEnrichRealEstateData(extractedData);
    
    // Step 4: Generate comprehensive statistics
    const statistics = calculateComprehensiveStatistics(validatedData);
    
    console.log('🎯 Extraction completed successfully');
    console.log('📊 Statistics:', statistics);
    
    return new Response(JSON.stringify({
      success: true,
      documentType: 'real_estate_project',
      confidence: extractedData.confidence || 0.95,
      extractedData: validatedData,
      metadata: {
        contentLength: extractedContent.length,
        extractionMethod: 'advanced-pdf-parser',
        processingTime: Date.now(),
        aiModel: 'gpt-4o-mini'
      },
      statistics
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 PDF Parser Advanced Error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      details: 'Advanced PDF parsing failed'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Advanced PDF Content Extraction with multiple methods
async function advancedPDFExtraction(fileUrl: string, supabaseKey: string): Promise<string> {
  console.log('🔍 Advanced PDF Extraction Starting...');
  
  try {
    // Method 1: Try Supabase parse-document first
    console.log('📄 Method 1: Supabase Parse Document');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const parseResponse = await supabase.functions.invoke('parse-document', {
      body: { fileUrl }
    });
    
    if (parseResponse.data?.content && parseResponse.data.content.length > 100) {
      console.log(`✅ Method 1 Success: ${parseResponse.data.content.length} characters`);
      return parseResponse.data.content;
    }
    
    console.log('⚠️ Method 1 failed, trying Method 2...');
    
    // Method 2: Direct PDF processing with multiple extraction techniques
    console.log('📄 Method 2: Direct PDF Processing');
    const response = await fetch(fileUrl, {
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'User-Agent': 'Supabase-Edge-Function/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to download PDF: ${response.status}`);
    }
    
    const buffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);
    
    console.log(`📊 PDF size: ${buffer.byteLength} bytes`);
    
    if (buffer.byteLength === 0) {
      throw new Error('PDF file is empty');
    }
    
    // Multiple PDF extraction strategies
    const extractedText = await extractPDFWithMultipleMethods(uint8Array);
    
    if (extractedText.length > 100) {
      console.log(`✅ Method 2 Success: ${extractedText.length} characters`);
      return extractedText;
    }
    
    throw new Error('All PDF extraction methods failed');
    
  } catch (error) {
    console.error('❌ PDF Extraction Error:', error);
    throw error;
  }
}

async function extractPDFWithMultipleMethods(pdfData: Uint8Array): Promise<string> {
  const decoder = new TextDecoder('utf-8', { fatal: false });
  const rawContent = decoder.decode(pdfData);
  
  console.log(`📄 Raw PDF content: ${rawContent.length} characters`);
  
  let bestExtraction = '';
  let bestScore = 0;
  
  // Method A: Text stream extraction (most reliable for normal PDFs)
  try {
    console.log('🔤 Method A: Text Stream Extraction');
    
    // Extract text between parentheses (PDF text streams)
    const textStreams = rawContent.match(/\((.*?)\)/g) || [];
    let streamText = textStreams
      .map(match => match.slice(1, -1))
      .filter(text => text.length > 2 && /[a-zA-Z]/.test(text))
      .join(' ');
    
    // Clean up escape sequences
    streamText = streamText
      .replace(/\\n/g, ' ')
      .replace(/\\r/g, ' ')
      .replace(/\\t/g, ' ')
      .replace(/\\\\/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    const score = scoreExtraction(streamText);
    console.log(`📊 Method A Score: ${score}, Length: ${streamText.length}`);
    
    if (score > bestScore) {
      bestExtraction = streamText;
      bestScore = score;
    }
  } catch (error) {
    console.error('❌ Method A failed:', error);
  }
  
  // Method B: Pattern-based extraction for structured data
  try {
    console.log('🔍 Method B: Pattern-based Extraction');
    
    const patterns = [
      // Prices and surfaces
      /(?:€|EUR|EURO|euro|euros|prix|price)\s*:?\s*[0-9.,]+/gi,
      /[0-9]+[\s]*(?:m²|m2|sq\.?\s*m|square\s*meter)/gi,
      
      // Property details
      /(?:bedroom|bedrooms|chambre|chambres|bed|beds)\s*:?\s*[0-9]+/gi,
      /(?:bathroom|bathrooms|salle\s*de\s*bain|salles\s*de\s*bain|bath|baths)\s*:?\s*[0-9]+/gi,
      
      // Locations
      /(?:limassol|paphos|larnaca|nicosia|cyprus|chypre|nicosie)/gi,
      
      // Property types
      /(?:apartment|villa|penthouse|studio|house|appartement|maison)/gi,
      
      // Project names and developers
      /[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3}(?:\s+(?:project|development|residence|tower|complex|gardens?))?/g,
      
      // Phone numbers and emails
      /(?:\+\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g,
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    ];
    
    let patternText = '';
    for (const pattern of patterns) {
      const matches = rawContent.match(pattern) || [];
      patternText += matches.join(' ') + ' ';
    }
    
    patternText = patternText.replace(/\s+/g, ' ').trim();
    
    const score = scoreExtraction(patternText);
    console.log(`📊 Method B Score: ${score}, Length: ${patternText.length}`);
    
    if (score > bestScore) {
      bestExtraction = patternText;
      bestScore = score;
    }
  } catch (error) {
    console.error('❌ Method B failed:', error);
  }
  
  console.log(`🏆 Best extraction method score: ${bestScore}`);
  console.log(`📝 Best extraction preview: "${bestExtraction.substring(0, 200)}..."`);
  
  return bestExtraction;
}

function scoreExtraction(text: string): number {
  if (!text || text.length < 50) return 0;
  
  let score = 0;
  
  // Base score for length
  score += Math.min(text.length / 100, 50);
  
  // Real estate keywords
  const realEstateKeywords = [
    'apartment', 'villa', 'penthouse', 'studio', 'property', 'development',
    'bedroom', 'bathroom', 'sqm', 'm²', 'price', 'euro', '€',
    'limassol', 'paphos', 'cyprus', 'project', 'developer'
  ];
  
  realEstateKeywords.forEach(keyword => {
    const matches = (text.toLowerCase().match(new RegExp(keyword, 'g')) || []).length;
    score += matches * 5;
  });
  
  // Number patterns (prices, areas, etc.)
  const numberMatches = (text.match(/\d+/g) || []).length;
  score += numberMatches * 2;
  
  // Contact information
  if (text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)) score += 10;
  if (text.match(/\+?[\d\s-()]+/)) score += 5;
  
  return score;
}

// Intelligent Real Estate Extraction with specialized AI prompts
async function intelligentRealEstateExtraction(content: string, apiKey: string) {
  console.log('🤖 Starting intelligent real estate extraction...');
  
  const prompt = `Tu es un expert en analyse de documents immobiliers chypriotes. Tu dois extraire TOUTES les informations avec une précision de 100%.

MISSION CRITIQUE : Extraire OBLIGATOIREMENT ces informations prioritaires :

1. DÉVELOPPEUR/ENTREPRISE (PRIORITÉ ABSOLUE) :
   - Nom de l'entreprise/société (cherche partout dans le document)
   - TOUS les numéros de téléphone (fixe, mobile, bureau)
   - TOUTES les adresses email (info@, sales@, contact@, etc.)
   - Site web/URL (www., http, .com, .cy, etc.)
   - Adresse physique complète
   - Licence/registration numbers

2. PROJET (PRIORITÉ ABSOLUE) :
   - Nom exact du projet (titre principal, heading, nom en gras)
   - Localisation complète (ville, quartier, adresse exacte)
   - Nombre total d'unités dans TOUT le projet
   - Statut général du projet (planifié, en construction, livré, etc.)
   - Description du projet

3. TECHNIQUE D'EXTRACTION AVANCÉE :
   - Regarde en HAUT et en BAS de chaque page (headers/footers)
   - Cherche dans les logos, watermarks, signatures
   - Analyse les contacts dans les formulaires/applications
   - Examine les disclaimers et mentions légales
   - Regarde les QR codes, références, numéros de licences

PATTERNS À CHERCHER ABSOLUMENT :
- Entreprise : "Developed by", "By:", "Developer:", "Company:", etc.
- Contact : "+357", "Tel:", "Phone:", "Mobile:", "@", "www.", ".com", ".cy"
- Projet : "Project:", titre en gras, nom répété, "Development"
- Total : "units", "apartments", "villas", "total", "properties"

FORMAT JSON (OBLIGATOIRE) :
{
  "confidence": 0.98,
  "developer": {
    "name": "NOM EXACT DE L'ENTREPRISE TROUVÉ",
    "email_primary": "email principal exact",
    "phone_numbers": ["TOUS les téléphones trouvés"],
    "addresses": ["adresses physiques complètes"],
    "website": "site web exact si trouvé",
    "contact_info": {}
  },
  "project": {
    "title": "NOM EXACT DU PROJET",
    "description": "description détaillée extraite",
    "city": "ville exacte (Limassol/Paphos/Larnaca/Nicosia)",
    "full_address": "adresse complète du projet",
    "cyprus_zone": "limassol|paphos|larnaca|nicosia",
    "total_units_new": 127,
    "status": "statut exact du projet",
    "property_types": ["tous les types trouvés"],
    "features": ["caractéristiques du projet"],
    "amenities": ["équipements du projet"],
    "completion_date_new": "date si trouvée (YYYY-MM-DD)"
  },
  "buildings": [
    {
      "name": "nom du bâtiment",
      "building_type": "residential",
      "total_floors": 3,
      "total_units": 15,
      "construction_status": "completed"
    }
  ],
  "properties": [
    {
      "unit_number": "A101",
      "building_name": "nom du bâtiment",
      "type": "apartment",
      "floor": 1,
      "bedrooms": 2,
      "bathrooms": 2,
      "size_m2": 85,
      "price": 320000,
      "status": "available",
      "features": ["balcony", "sea view"]
    }
  ]
}

DOCUMENT À ANALYSER POUR EXTRACTION COMPLÈTE :
${content}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Tu es un expert en extraction de données immobilières avec 20 ans d\'expérience. Tu dois extraire TOUTES les informations disponibles, en particulier les données de contact et d\'entreprise. Tu ne génères JAMAIS de fausses données.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 4000,
        temperature: 0.05,
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API failed: ${response.status} - ${errorText}`);
      throw new Error(`OpenAI API failed: ${response.status}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    
    console.log('🎯 AI Extraction completed with enhanced focus');
    console.log('📊 Extracted data preview:', {
      developer_name: result.developer?.name || 'MANQUANT',
      developer_email: result.developer?.email_primary || 'MANQUANT',
      developer_phones: result.developer?.phone_numbers?.length || 0,
      project_title: result.project?.title || 'MANQUANT',
      project_location: result.project?.full_address || result.project?.city || 'MANQUANT',
      total_units: result.project?.total_units_new || 'MANQUANT',
      buildings: result.buildings?.length || 0,
      properties: result.properties?.length || 0
    });
    
    return result;
    
  } catch (error) {
    console.error('❌ AI Extraction Error:', error);
    throw error;
  }
}

async function validateAndEnrichRealEstateData(data: any) {
  console.log('✨ Validating and enriching real estate data...');
  
  // Ensure all arrays exist
  data.buildings = data.buildings || [];
  data.properties = data.properties || [];
  
  // Enrich properties with Golden Visa eligibility
  if (data.properties) {
    data.properties = data.properties.map((prop: any) => ({
      ...prop,
      is_golden_visa: prop.price >= 300000,
      vat_rate: 5.00
    }));
  }
  
  // Set default Cyprus zone
  if (data.project && !data.project.cyprus_zone) {
    data.project.cyprus_zone = 'limassol';
  }
  
  // Set project VAT rate
  if (data.project) {
    data.project.vat_rate_new = 5.00;
  }
  
  console.log('✅ Data validation completed');
  return data;
}

function calculateComprehensiveStatistics(data: any) {
  const properties = data.properties || [];
  
  const stats = {
    total_properties: properties.length,
    golden_visa_eligible: properties.filter((p: any) => p.is_golden_visa).length,
    total_portfolio_value: properties.reduce((sum: number, p: any) => sum + (p.price || 0), 0),
    average_price: properties.length > 0 ? properties.reduce((sum: number, p: any) => sum + (p.price || 0), 0) / properties.length : 0,
    price_range: {
      min: properties.length > 0 ? Math.min(...properties.map((p: any) => p.price || 0)) : 0,
      max: properties.length > 0 ? Math.max(...properties.map((p: any) => p.price || 0)) : 0
    },
    types_distribution: {} as Record<string, number>,
    availability: {
      available: properties.filter((p: any) => p.status === 'available').length,
      reserved: properties.filter((p: any) => p.status === 'reserved').length,
      sold: properties.filter((p: any) => p.status === 'sold').length
    }
  };
  
  // Calculate types distribution
  properties.forEach((prop: any) => {
    const type = prop.type || 'unknown';
    stats.types_distribution[type] = (stats.types_distribution[type] || 0) + 1;
  });
  
  return stats;
}