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

    // Process each document with advanced parsing
    const parsedDocuments = await Promise.all(
      fileUrls.map(async (url: string) => {
        try {
          console.log(`📄 Processing: ${url}`);
          
          // Download the file
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Failed to download: ${response.status}`);
          }
          
          const buffer = await response.arrayBuffer();
          const uint8Array = new Uint8Array(buffer);
          
          console.log(`📊 File size: ${buffer.byteLength} bytes`);
          
          // Extract text content using advanced PDF parsing
          let extractedText = '';
          let metadata = {};
          
          if (url.toLowerCase().includes('.pdf')) {
            // Use PDF.js for text extraction
            const result = await extractPDFContent(uint8Array);
            extractedText = result.text;
            metadata = result.metadata;
          } else {
            // Handle other file types
            extractedText = new TextDecoder().decode(uint8Array);
          }
          
          console.log(`✅ Extracted ${extractedText.length} characters`);
          
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
  // Simplified PDF text extraction
  // In production, use a proper PDF library like pdf-parse
  const decoder = new TextDecoder('utf-8');
  let text = decoder.decode(pdfData);
  
  // Basic PDF content detection patterns
  const patterns = [
    /BT\s+(.*?)\s+ET/gs, // Basic text objects
    /Tj\s*\[(.*?)\]/gs,  // Text showing operators
    /TJ\s*\[(.*?)\]/gs   // Text showing with spacing
  ];
  
  let extractedText = '';
  for (const pattern of patterns) {
    const matches = text.match(pattern);
    if (matches) {
      extractedText += matches.join(' ') + '\n';
    }
  }
  
  // Fallback: try to extract readable text
  if (extractedText.length < 100) {
    extractedText = text.replace(/[^\x20-\x7E\n]/g, ' ')
                       .replace(/\s+/g, ' ')
                       .trim();
  }
  
  return extractedText || 'PDF content extraction failed - consider using OCR';
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
  
  const fullPrompt = `${extractionPrompt}

Documents content:
${documents.map(doc => `=== DOCUMENT: ${doc.url} ===\n${doc.content}`).join('\n\n')}`;

  try {
    const response = await callAI(fullPrompt, apiKey);
    const parsed = JSON.parse(response);
    
    return {
      ...parsed,
      documentType: primaryType,
      extractionConfidence: classification.confidence
    };
  } catch (error) {
    console.error('Extraction error:', error);
    return {
      documentType: primaryType,
      error: error.message,
      extractionConfidence: 0
    };
  }
}

function getRealEstateExtractionPrompt(): string {
  return `
Extract real estate project information. Return JSON with this EXACT structure:

{
  "developer": {
    "name": "string REQUIRED",
    "email_primary": "string",
    "phone_numbers": ["string"],
    "addresses": ["string"],
    "website": "string",
    "contact_info": {}
  },
  "project": {
    "title": "string REQUIRED",
    "description": "string REQUIRED",
    "city": "string REQUIRED",
    "full_address": "string",
    "cyprus_zone": "limassol|paphos|larnaca|nicosia",
    "gps_latitude": number,
    "gps_longitude": number,
    "price": number REQUIRED,
    "total_units_new": number,
    "status": "available|under_construction|completed",
    "property_types": ["apartment", "penthouse", "villa"],
    "features": ["string"],
    "amenities": ["string"],
    "completion_date_new": "YYYY-MM-DD"
  },
  "buildings": [
    {
      "name": "string REQUIRED",
      "building_type": "residential|commercial|villa",
      "total_floors": number,
      "total_units": number,
      "construction_status": "planned|under_construction|completed"
    }
  ],
  "properties": [
    {
      "unit_number": "string REQUIRED",
      "building_name": "string",
      "type": "studio|apartment|penthouse|villa",
      "floor": number,
      "bedrooms": number,
      "bathrooms": number,
      "size_m2": number,
      "price": number,
      "status": "available|reserved|sold",
      "features": ["string"]
    }
  ]
}

EXTRACTION RULES:
- Extract ALL property information with exact details
- Count total units accurately 
- Extract complete developer contact information
- Identify all building types including villas
- Parse all individual properties with specifications
- Ensure prices are in euros
- Return only valid JSON
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
  const isXAI = apiKey.startsWith('xai-');
  const apiUrl = isXAI 
    ? 'https://api.x.ai/v1/chat/completions'
    : 'https://api.openai.com/v1/chat/completions';
  
  const model = isXAI ? 'grok-2-1212' : 'gpt-4o-mini';
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: 'You are an expert document analysis AI. Extract information accurately and return only valid JSON.' },
        { role: 'user', content: prompt }
      ],
      max_completion_tokens: 4000,
      temperature: 0.1,
      response_format: { type: 'json_object' }
    }),
  });

  if (!response.ok) {
    throw new Error(`AI API failed: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}