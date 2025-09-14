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
    console.log('🚀 Advanced Document Parser - Starting');
    
    const { fileUrls, documentType } = await req.json();
    console.log('📂 Processing documents:', fileUrls?.length || 0);
    
    // Initialize Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Check API keys
    const xaiApiKey = Deno.env.get('XAI_API_KEY');
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!xaiApiKey && !openaiApiKey) {
      throw new Error('No AI API keys configured');
    }

    console.log('🔑 API Keys available:', {
      hasXAI: !!xaiApiKey,
      hasOpenAI: !!openaiApiKey
    });

    // Process each document with advanced parsing using Supabase parse-document
    const parsedDocuments = await Promise.all(
      fileUrls.map(async (url: string) => {
        try {
          console.log(`📄 Processing: ${url}`);
          
          // Use Supabase parse-document service for robust PDF extraction
          const parseResponse = await supabase.functions.invoke('parse-document', {
            body: { fileUrl: url }
          });
          
          if (parseResponse.error) {
            console.error('Parse document error:', parseResponse.error);
            throw new Error(`Failed to parse document: ${parseResponse.error.message}`);
          }
          
          const parseData = parseResponse.data;
          let extractedText = '';
          let metadata = {};
          
          if (parseData && parseData.content) {
            extractedText = parseData.content;
            metadata = parseData.metadata || {};
            console.log(`✅ Extracted ${extractedText.length} characters via parse-document`);
          } else {
            // Fallback to basic extraction if parse-document fails
            console.log('📄 Falling back to basic extraction...');
            
            const response = await fetch(url, {
              headers: {
                'User-Agent': 'Supabase-Edge-Function/1.0',
                'Accept': '*/*',
                'Authorization': `Bearer ${supabaseKey}`
              }
            });
            
            if (!response.ok) {
              console.error(`Download failed: ${response.status} - ${response.statusText}`);
              throw new Error(`Failed to download file: ${response.status}`);
            }
            
            const buffer = await response.arrayBuffer();
            const uint8Array = new Uint8Array(buffer);
            
            console.log(`📊 File size: ${buffer.byteLength} bytes`);
            
            if (url.toLowerCase().includes('.pdf')) {
              const result = await extractPDFContent(uint8Array);
              extractedText = result.text;
              metadata = result.metadata;
            } else {
              extractedText = new TextDecoder().decode(uint8Array);
            }
            
            console.log(`✅ Fallback extracted ${extractedText.length} characters`);
          }
          
          return {
            url,
            content: extractedText,
            metadata,
            contentType: url.includes('.pdf') ? 'application/pdf' : 'text/plain'
          };
          
        } catch (error) {
          console.error(`❌ Error processing ${url}:`, error);
          return {
            url,
            content: '',
            metadata: {},
            error: error.message
          };
        }
      })
    );

    // Step 1: Document Classification
    console.log('🤖 Step 1: Document Classification');
    const documentClassification = await classifyDocuments(parsedDocuments, xaiApiKey || openaiApiKey);
    
    // Step 2: Intelligent Information Extraction
    console.log('🧠 Step 2: Information Extraction');
    const extractedData = await extractInformationByType(
      parsedDocuments, 
      documentClassification, 
      xaiApiKey || openaiApiKey
    );
    
    // Step 3: Data Validation and Enrichment
    console.log('✨ Step 3: Data Validation');
    const validatedData = await validateAndEnrichData(extractedData);
    
    console.log('🎯 Extraction completed successfully');
    
    return new Response(JSON.stringify({
      success: true,
      documentType: documentClassification.primaryType,
      confidence: documentClassification.confidence,
      extractedData: validatedData,
      metadata: {
        documentsProcessed: parsedDocuments.length,
        totalTextLength: parsedDocuments.reduce((sum, doc) => sum + doc.content.length, 0),
        processingTime: Date.now()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 Advanced Document Parser Error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      details: 'Advanced document parsing failed'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Advanced PDF Content Extraction
async function extractPDFContent(pdfData: Uint8Array) {
  try {
    // Basic PDF text extraction (in production, use pdf-parse or similar)
    const text = await extractTextFromPDF(pdfData);
    
    return {
      text,
      metadata: {
        pages: estimatePageCount(text),
        hasImages: text.includes('[IMAGE]'),
        hasTable: text.includes('|') || text.includes('\t'),
        language: detectLanguage(text)
      }
    };
  } catch (error) {
    console.error('PDF extraction error:', error);
    return {
      text: '',
      metadata: { error: error.message }
    };
  }
}

async function extractTextFromPDF(pdfData: Uint8Array): Promise<string> {
  try {
    // Convertir en string pour chercher le contenu texte
    const decoder = new TextDecoder('utf-8', { fatal: false });
    let rawText = decoder.decode(pdfData);
    
    console.log(`📋 PDF brut: ${rawText.length} caractères`);
    
    // Méthode 1: Extraire tout le texte visible entre parenthèses
    const textMatches = rawText.match(/\((.*?)\)/g) || [];
    let extractedText = textMatches
      .map(match => match.slice(1, -1)) // Enlever les parenthèses
      .filter(text => text.length > 1 && /[a-zA-Z]/.test(text)) // Garder seulement le texte avec lettres
      .join(' ');
    
    console.log(`🔤 Texte extrait méthode 1: ${extractedText.length} caractères`);
    
    // Méthode 2: Chercher des mots complets dans le PDF brut
    if (extractedText.length < 100) {
      const wordPattern = /[A-Za-z]{3,}(?:\s+[A-Za-z]{3,})*/g;
      const words = rawText.match(wordPattern) || [];
      const filteredWords = words
        .filter(word => !word.includes('\\') && !word.includes('/'))
        .filter(word => word.length > 3)
        .slice(0, 200); // Limiter à 200 mots
      
      extractedText = filteredWords.join(' ');
      console.log(`🔤 Texte extrait méthode 2: ${extractedText.length} caractères`);
    }
    
    // Méthode 3: Recherche de patterns spécifiques immobiliers
    if (extractedText.length < 50) {
      const realEstatePatterns = [
        /([A-Z][a-z]+\s+){2,}[A-Z][a-z]+/g, // Noms de projets
        /\b\d+[\s]*m[²2]\b/g, // Surfaces
        /\b\d+[\s]*€\b/g, // Prix
        /\b\d+[\s]*bedroom[s]?\b/gi, // Chambres
        /\b\d+[\s]*bathroom[s]?\b/gi, // Salles de bain
        /\blimassol|paphos|larnaca|nicosia\b/gi, // Villes chypriotes
        /\bapartment|villa|penthouse|studio\b/gi // Types de biens
      ];
      
      let patternText = '';
      for (const pattern of realEstatePatterns) {
        const matches = rawText.match(pattern) || [];
        patternText += matches.join(' ') + ' ';
      }
      
      if (patternText.length > extractedText.length) {
        extractedText = patternText;
        console.log(`🔤 Texte extrait méthode 3: ${extractedText.length} caractères`);
      }
    }
    
    // Nettoyage final
    extractedText = extractedText
      .replace(/\\[nrt]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    const finalLength = extractedText.length;
    console.log(`✅ Texte final: ${finalLength} caractères`);
    console.log(`📝 Aperçu: "${extractedText.substring(0, 200)}..."`);
    
    return finalLength > 10 ? extractedText : 'PDF_EXTRACTION_FAILED_NO_TEXT_FOUND';
    
  } catch (error) {
    console.error('❌ Erreur extraction PDF:', error);
    return 'PDF_EXTRACTION_ERROR';
  }
}

function estimatePageCount(text: string): number {
  const pageBreaks = (text.match(/\f/g) || []).length;
  const estimatedByLength = Math.ceil(text.length / 2000);
  return Math.max(pageBreaks + 1, estimatedByLength);
}

function detectLanguage(text: string): string {
  const frenchWords = ['le', 'la', 'de', 'et', 'à', 'un', 'il', 'être', 'et', 'en', 'avoir', 'que', 'pour'];
  const englishWords = ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for'];
  
  const words = text.toLowerCase().split(/\s+/).slice(0, 100);
  
  const frenchScore = frenchWords.reduce((score, word) => 
    score + (words.includes(word) ? 1 : 0), 0);
  const englishScore = englishWords.reduce((score, word) => 
    score + (words.includes(word) ? 1 : 0), 0);
    
  return frenchScore > englishScore ? 'french' : 'english';
}

// Document Classification System
async function classifyDocuments(documents: any[], apiKey: string) {
  const classificationPrompt = `
Analyze these documents and classify them. Return JSON with this structure:
{
  "primaryType": "real_estate_project|invoice|contract|legal_document|other",
  "confidence": 0.95,
  "documentTypes": ["type1", "type2"],
  "language": "french|english",
  "keyIndicators": ["indicator1", "indicator2"]
}

Classification rules:
- real_estate_project: Contains property listings, floor plans, amenities, developer info
- invoice: Contains amounts, VAT, billing addresses, invoice numbers  
- contract: Contains legal terms, signatures, parties, obligations
- legal_document: Contains legal language, clauses, regulations

Documents content:
${documents.map(doc => `Document: ${doc.url}\nContent: ${doc.content.substring(0, 1000)}...`).join('\n\n')}
`;

  try {
    const response = await callAI(classificationPrompt, apiKey);
    return JSON.parse(response);
  } catch (error) {
    console.error('Classification error:', error);
    return {
      primaryType: 'other',
      confidence: 0.5,
      documentTypes: ['unknown'],
      language: 'french',
      keyIndicators: []
    };
  }
}

// Intelligent Information Extraction by Document Type
async function extractInformationByType(documents: any[], classification: any, apiKey: string) {
  const { primaryType } = classification;
  
  // Vérifier le contenu extrait
  console.log('📝 Contenu des documents extraits:');
  documents.forEach((doc, idx) => {
    console.log(`  Document ${idx + 1}: ${doc.content.length} caractères`);
    console.log(`  Aperçu: "${doc.content.substring(0, 200)}..."`);
    
    // Vérifier si c'est une erreur d'extraction
    if (doc.content.includes('PDF_EXTRACTION_FAILED') || doc.content.includes('PDF_EXTRACTION_ERROR')) {
      console.error(`❌ ERREUR: Échec extraction PDF pour ${doc.url}`);
    }
  });
  
  // Vérifier qu'on a du vrai contenu
  const totalContent = documents.reduce((sum, doc) => sum + doc.content.length, 0);
  if (totalContent < 50) {
    console.error('❌ ERREUR: Pas assez de contenu extrait pour l\'analyse IA');
    return {
      error: 'INSUFFICIENT_CONTENT_EXTRACTED',
      documentType: primaryType,
      extractionConfidence: 0,
      debug: {
        totalContentLength: totalContent,
        documents: documents.map(doc => ({
          url: doc.url,
          contentLength: doc.content.length,
          contentPreview: doc.content.substring(0, 100)
        }))
      }
    };
  }
  
  let extractionPrompt = '';
  
  if (primaryType === 'real_estate_project') {
    extractionPrompt = getRealEstateExtractionPrompt();
  } else if (primaryType === 'invoice') {
    extractionPrompt = getInvoiceExtractionPrompt();
  } else if (primaryType === 'contract') {
    extractionPrompt = getContractExtractionPrompt();
  } else {
    extractionPrompt = getGenericExtractionPrompt();
  }
  
  const documentContent = documents.map(doc => `=== DOCUMENT: ${doc.url} ===\n${doc.content}`).join('\n\n');
  
  console.log('🤖 Envoi vers IA:', {
    promptLength: extractionPrompt.length,
    contentLength: documentContent.length,
    model: apiKey.startsWith('xai-') ? 'grok-2-1212' : 'gpt-4o-mini'
  });
  
  const fullPrompt = `${extractionPrompt}

CRITICAL: You MUST extract information from the actual document content below. DO NOT generate fake data or examples.

Documents content:
${documentContent}`;

  try {
    const response = await callAI(fullPrompt, apiKey);
    console.log('🎯 Réponse IA reçue:', response.substring(0, 500) + '...');
    const parsed = JSON.parse(response);
    
    return {
      ...parsed,
      documentType: primaryType,
      extractionConfidence: classification.confidence
    };
  } catch (error) {
    console.error('❌ Erreur extraction IA:', error);
    return {
      documentType: primaryType,
      error: error.message,
      extractionConfidence: 0
    };
  }
}

function getRealEstateExtractionPrompt(): string {
  return `
Tu es un expert en analyse de documents immobiliers. Tu dois extraire SEULEMENT les informations qui existent dans le document fourni.

RÈGLES CRITIQUES:
- N'INVENTE AUCUNE DONNÉE
- Si une information n'existe pas dans le document, utilise null
- Cherche toutes les variations possibles (français, anglais, grec)
- Sois intelligent avec les abréviations et formats
- Extrait TOUT ce qui ressemble à de l'immobilier

PATTERNS À CHERCHER:
- Noms de projets/développeurs
- Prix (€, EUR, euros, numbers followed by price indicators)  
- Surfaces (m², m2, sq m, square meters)
- Chambres/bathrooms (bed, bath, ch, sdb, bedroom, bathroom)
- Adresses/villes (Limassol, Paphos, Larnaca, Nicosia, Cyprus)
- Types de biens (apartment, villa, penthouse, studio)
- Statuts (available, sold, under construction, completed)

Retourne un JSON avec cette structure EXACTE:

{
  "developer": {
    "name": "nom exact trouvé ou null",
    "email_primary": "email exact ou null", 
    "phone_numbers": ["téléphones trouvés"],
    "addresses": ["adresses trouvées"],
    "website": "site web ou null",
    "contact_info": {}
  },
  "project": {
    "title": "nom exact du projet",
    "description": "description exacte trouvée",
    "city": "ville exacte trouvée",
    "full_address": "adresse complète",
    "cyprus_zone": "limassol|paphos|larnaca|nicosia ou null",
    "gps_latitude": null,
    "gps_longitude": null,
    "price": "prix de départ en nombre ou null",
    "total_units_new": "nombre total d'unités ou null",
    "status": "statut trouvé ou null",
    "property_types": ["types exacts trouvés"],
    "features": ["caractéristiques exactes"],
    "amenities": ["équipements exacts"],
    "completion_date_new": "date au format YYYY-MM-DD ou null"
  },
  "buildings": [
    {
      "name": "nom exact du bâtiment",
      "building_type": "type exact",
      "total_floors": "nombre d'étages ou null",
      "total_units": "nombre d'unités ou null", 
      "construction_status": "statut exact"
    }
  ],
  "properties": [
    {
      "unit_number": "numéro exact",
      "building_name": "nom du bâtiment",
      "type": "type exact",
      "floor": "étage en nombre ou null",
      "bedrooms": "nombre de chambres ou null",
      "bathrooms": "nombre de salles de bain ou null",
      "size_m2": "superficie en m2 ou null",
      "price": "prix en euros ou null",
      "status": "statut exact",
      "features": ["caractéristiques exactes"]
    }
  ]
}

IMPORTANT: Analyse intelligemment même si le texte est fragmenté ou mal formaté. Reconstitue les informations cohérentes.
`;
}

function getInvoiceExtractionPrompt(): string {
  return `
Extract invoice information. Return JSON:
{
  "invoiceNumber": "string",
  "date": "YYYY-MM-DD",
  "dueDate": "YYYY-MM-DD",
  "supplier": {
    "name": "string",
    "address": "string",
    "vatNumber": "string"
  },
  "customer": {
    "name": "string", 
    "address": "string"
  },
  "items": [
    {
      "description": "string",
      "quantity": number,
      "unitPrice": number,
      "total": number
    }
  ],
  "totals": {
    "subtotal": number,
    "vat": number,
    "total": number
  }
}
`;
}

function getContractExtractionPrompt(): string {
  return `
Extract contract information. Return JSON:
{
  "contractType": "string",
  "parties": [
    {
      "name": "string",
      "role": "buyer|seller|tenant|landlord|other",
      "address": "string"
    }
  ],
  "property": {
    "address": "string",
    "description": "string",
    "price": number
  },
  "terms": {
    "duration": "string",
    "paymentTerms": "string",
    "keyConditions": ["string"]
  },
  "dates": {
    "signed": "YYYY-MM-DD",
    "effective": "YYYY-MM-DD",
    "expires": "YYYY-MM-DD"
  }
}
`;
}

function getGenericExtractionPrompt(): string {
  return `
Extract key information from this document. Return JSON:
{
  "documentType": "string",
  "title": "string",
  "keyInformation": {
    "entities": ["string"],
    "dates": ["string"],
    "amounts": ["string"],
    "addresses": ["string"]
  },
  "summary": "string"
}
`;
}

async function validateAndEnrichData(data: any) {
  // Add validation logic
  if (data.project) {
    // Ensure Golden Visa flags
    if (data.properties) {
      data.properties = data.properties.map((prop: any) => ({
        ...prop,
        is_golden_visa: prop.price >= 300000,
        vat_rate: 5.00
      }));
    }
    
    // Set default values
    data.project.cyprus_zone = data.project.cyprus_zone || 'limassol';
    data.project.vat_rate_new = 5.00;
  }
  
  return data;
}

async function callAI(prompt: string, apiKey: string): Promise<string> {
  // Préférer OpenAI car GROK ignore les instructions
  const openaiKey = Deno.env.get('OPENAI_API_KEY');
  const xaiKey = Deno.env.get('XAI_API_KEY');
  
  // Essayer OpenAI en premier si disponible
  let useOpenAI = true;
  let finalApiKey = openaiKey;
  
  if (!openaiKey && xaiKey) {
    useOpenAI = false;
    finalApiKey = xaiKey;
  } else if (!openaiKey && !xaiKey) {
    throw new Error('No AI API keys available');
  }
  
  const apiUrl = useOpenAI 
    ? 'https://api.openai.com/v1/chat/completions'
    : 'https://api.x.ai/v1/chat/completions';
  
  const model = useOpenAI ? 'gpt-4o-mini' : 'grok-2-1212';
  
  console.log(`🤖 Using ${useOpenAI ? 'OpenAI' : 'XAI'} with model: ${model}`);
  
  // Prompt ultra strict pour forcer l'extraction réelle
  const systemPrompt = useOpenAI 
    ? 'You are a document extraction expert. NEVER generate fake data. Extract ONLY what exists in the document. If data is missing, use null.'
    : 'CRITICAL: You MUST extract real data from documents. DO NOT generate examples. NO FAKE DATA. EXTRACT ONLY WHAT EXISTS.';
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${finalApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      max_completion_tokens: 4000,
      temperature: 0.1,
      response_format: { type: 'json_object' }
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`AI API failed: ${response.status} - ${errorText}`);
    throw new Error(`AI API failed: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}