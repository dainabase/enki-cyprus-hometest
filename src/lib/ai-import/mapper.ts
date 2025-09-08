import { ExtractedFieldData } from './types';

export interface PrefilledFormData {
  [fieldName: string]: ExtractedFieldData;
}

/**
 * Mappe les données extraites par l'IA vers les champs du formulaire
 */
export function mapAIDataToFormFields(rawExtraction: any): PrefilledFormData {
  const mappedData: PrefilledFormData = {};

  if (!rawExtraction) return mappedData;

  // Mapper les champs basiques
  if (rawExtraction.title) {
    mappedData.title = createFieldData(rawExtraction.title);
  }

  if (rawExtraction.description) {
    mappedData.description = createFieldData(rawExtraction.description);
  }

  if (rawExtraction.price) {
    mappedData.price = createFieldData(rawExtraction.price);
  }

  if (rawExtraction.location) {
    if (rawExtraction.location.city) {
      mappedData.city = createFieldData(rawExtraction.location.city);
    }
    if (rawExtraction.location.address) {
      mappedData.full_address = createFieldData(rawExtraction.location.address);
    }
  }

  // Mapper les propriétés spécifiques
  if (rawExtraction.property_type) {
    mappedData.property_category = createFieldData(rawExtraction.property_type);
  }

  if (rawExtraction.completion_date) {
    mappedData.completion_date_new = createFieldData(rawExtraction.completion_date);
  }

  return mappedData;
}

function createFieldData(
  value: any, 
  confidence: number = 0.8, 
  source: string = 'AI_EXTRACTION',
  documentName: string = 'Document'
): ExtractedFieldData {
  return {
    value,
    confidence,
    source,
    documentName
  };
}

/**
 * Génère les paramètres URL pour pré-remplir le formulaire
 */
export function generatePrefilledUrl(mappedData: PrefilledFormData, baseUrl: string = '/admin/projects/new'): string {
  const params = new URLSearchParams();
  
  Object.entries(mappedData).forEach(([fieldName, fieldData]) => {
    params.set(`ai_${fieldName}`, JSON.stringify(fieldData));
  });

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Extrait les données pré-remplies depuis les paramètres URL
 */
export function extractPrefilledData(searchParams: URLSearchParams): PrefilledFormData {
  const prefilledData: PrefilledFormData = {};

  for (const [key, value] of searchParams.entries()) {
    if (key.startsWith('ai_')) {
      const fieldName = key.replace('ai_', '');
      try {
        prefilledData[fieldName] = JSON.parse(value);
      } catch (error) {
        console.warn(`Failed to parse prefilled data for ${fieldName}:`, error);
      }
    }
  }

  return prefilledData;
}