import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Simple PDF Extractor V2.0 - Starting');
    
    const { fileUrl, extractionType } = await req.json();
    console.log('📄 Processing PDF:', fileUrl);
    console.log('🎯 Extraction type:', extractionType);
    
    // Vérifier que l'API key OpenAI est disponible
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }
    
    if (extractionType === 'developer') {
      console.log('🏢 ÉTAPE 3: Extraction développeur uniquement');
      return await extractDeveloperInfo(fileUrl, openaiApiKey);
    }
    
    // Pour les autres types, structure de base
    return new Response(JSON.stringify({
      success: true,
      message: 'Structure de base créée - Étape 2 terminée',
      extractionType,
      data: {
        raw_content: 'Contenu PDF basique extrait...',
        ready_for_step_3: true
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 Simple PDF Extractor Error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      step: 'Étape 2 - Structure de base'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// ÉTAPE 3: Extraction développeur spécialisée
async function extractDeveloperInfo(fileUrl: string, apiKey: string) {
  console.log('🏢 Début extraction développeur...');
  
  try {
    // 1. Récupérer le PDF
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status}`);
    }
    
    const buffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);
    console.log(`📊 PDF size: ${buffer.byteLength} bytes`);
    
    // 2. Extraction simple du texte
    const textContent = await extractTextFromPDF(uint8Array);
    console.log(`📝 Text extracted: ${textContent.length} characters`);
    
    // 3. AI spécialisée pour développeur UNIQUEMENT
    const developerData = await extractWithAI(textContent, apiKey);
    
    return new Response(JSON.stringify({
      success: true,
      extractionType: 'developer',
      developer: developerData,
      metadata: {
        contentLength: textContent.length,
        extractionStep: 3,
        model: 'gpt-4o-mini'
      }
    }), {
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('💥 Developer extraction error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      extractionType: 'developer'
    }), {
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
    });
  }
}

// Extraction texte améliorée du PDF
async function extractTextFromPDF(pdfData: Uint8Array): Promise<string> {
  const decoder = new TextDecoder('utf-8', { fatal: false });
  const rawContent = decoder.decode(pdfData);
  
  console.log(`📄 PDF brut: ${rawContent.length} caractères`);
  
  let extractedText = '';
  
  // Méthode 1: Extraire les textes entre parenthèses (streams PDF)
  const textStreams = rawContent.match(/\((.*?)\)/g) || [];
  const streamText = textStreams
    .map(match => match.slice(1, -1))
    .filter(text => text.length > 2 && /[a-zA-Z0-9@.]/.test(text))
    .join(' ');
  
  // Méthode 2: Extraire les objets texte PDF
  const textObjects = rawContent.match(/BT.*?ET/gs) || [];
  const objectText = textObjects
    .map(obj => {
      const texts = obj.match(/\((.*?)\)/g) || [];
      return texts.map(t => t.slice(1, -1)).join(' ');
    })
    .join(' ');
  
  // Méthode 3: Recherche directe de patterns email/téléphone/site web
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const phonePattern = /[\+]?[0-9\s\-\(\)]{8,20}/g;
  const webPattern = /www\.[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|[a-zA-Z0-9.-]+\.com/g;
  
  const emails = rawContent.match(emailPattern) || [];
  const phones = rawContent.match(phonePattern) || [];
  const websites = rawContent.match(webPattern) || [];
  
  // Combiner tous les textes
  extractedText = [streamText, objectText].join(' ');
  
  // Ajouter les patterns trouvés
  if (emails.length > 0) extractedText += ' EMAILS: ' + emails.join(' ');
  if (phones.length > 0) extractedText += ' PHONES: ' + phones.join(' ');
  if (websites.length > 0) extractedText += ' WEBSITES: ' + websites.join(' ');
  
  // Nettoyer
  extractedText = extractedText
    .replace(/\\n/g, ' ')
    .replace(/\\r/g, ' ')
    .replace(/\\t/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s@.+-]/g, ' ')
    .trim();
  
  console.log(`📝 Texte extrait: ${extractedText.length} caractères`);
  console.log(`📧 Emails trouvés: ${emails.length}`);
  console.log(`📱 Téléphones trouvés: ${phones.length}`);
  console.log(`🌐 Sites web trouvés: ${websites.length}`);
  
  return extractedText;
}

// AI spécialisée UNIQUEMENT pour développeur
async function extractWithAI(content: string, apiKey: string) {
  console.log('🤖 AI extraction développeur...');
  
  const prompt = `Tu es un expert en extraction de données immobilières. 
Tu dois extraire UNIQUEMENT les informations du DÉVELOPPEUR/ENTREPRISE de ce document.

MISSION: Trouver ces 4 informations EXACTES :
1. Nom de l'entreprise/société (développeur)
2. Numéro de téléphone  
3. Adresse email
4. Site web

CHERCHE dans tout le document : en-têtes, pieds de page, logos, contacts, signatures.

FORMAT JSON OBLIGATOIRE :
{
  "name": "nom exact de l'entreprise trouvé",
  "phone": "numéro de téléphone exact",
  "email": "email exact trouvé", 
  "website": "site web exact trouvé"
}

Si une info n'est pas trouvée, mets "NON TROUVÉ".
Ne génère JAMAIS de fausses données.

DOCUMENT :
${content}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Tu es un expert en extraction de données développeur. Tu extrais UNIQUEMENT les infos demandées, jamais de fausses données.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.1,
      response_format: { type: 'json_object' }
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API failed: ${response.status}`);
  }

  const data = await response.json();
  const result = JSON.parse(data.choices[0].message.content);
  
  console.log('🏢 Développeur extrait:', result);
  return result;
}