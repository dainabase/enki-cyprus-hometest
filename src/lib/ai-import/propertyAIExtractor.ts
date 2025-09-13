import { supabase } from '@/integrations/supabase/client';

interface PropertyExtractionContext {
  developerId: string;
  projectId: string;
  buildingId: string;
}

export interface ExtractedProperty {
  unit_number: string;
  floor: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  size_m2: number;
  price: number;
  view_type?: string;
  orientation?: string;
  has_sea_view?: boolean;
  is_golden_visa?: boolean;
  description?: string;
  status: string;
  parking_spaces: number;
}

export async function extractPropertiesFromPDF(
  file: File,
  context: PropertyExtractionContext
): Promise<ExtractedProperty[]> {
  // Upload PDF to storage
  const fileName = `property-imports/${Date.now()}-${file.name}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('project-documents')
    .upload(fileName, file);

  if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

  // Call Edge Function for AI extraction
  const { data, error } = await supabase.functions.invoke('extract-properties-ai', {
    body: {
      fileUrl: uploadData.path,
      context,
      extractionType: 'properties_list'
    }
  });

  if (error) throw new Error(`Extraction failed: ${error.message}`);

  // Parse and validate extracted data
  const properties = data.properties || [];
  
  // Enhance with smart defaults and validation
  return properties.map((prop: any, index: number) => ({
    unit_number: prop.unit_number || `${context.buildingId}-${index + 1}`,
    floor: parseInt(prop.floor) || Math.floor(index / 4) + 1,
    type: normalizePropertyType(prop.type),
    bedrooms: parseInt(prop.bedrooms) || detectBedroomsFromType(prop.type),
    bathrooms: parseFloat(prop.bathrooms) || Math.max(1, Math.floor((parseInt(prop.bedrooms) || 2) / 2)),
    size_m2: parseFloat(prop.size_m2) || estimateSizeFromBedrooms(parseInt(prop.bedrooms) || 2),
    price: parseFloat(prop.price) || 0,
    view_type: prop.view_type || detectViewFromDescription(prop.description),
    orientation: prop.orientation || 'S',
    has_sea_view: prop.has_sea_view || prop.description?.toLowerCase().includes('sea') || false,
    is_golden_visa: parseFloat(prop.price) >= 300000,
    description: prop.description || '',
    status: 'available',
    parking_spaces: parseInt(prop.parking_spaces) || 1,
    // Add context for database insertion
    developer_id: context.developerId,
    project_id: context.projectId,
    building_id: context.buildingId
  }));
}

function normalizePropertyType(type: string): string {
  if (!type) return '2bed';
  
  const typeMap: Record<string, string> = {
    'studio': 'studio',
    'appartement': '2bed',
    'apartment': '2bed',
    '1bed': '1bed',
    '2bed': '2bed',
    '3bed': '3bed',
    '4bed': '4bed',
    'penthouse': 'penthouse',
    'villa': 'villa',
    'maison': 'townhouse',
    'townhouse': 'townhouse'
  };
  
  const normalized = type.toLowerCase();
  
  // Check for bedroom patterns
  if (normalized.includes('1 bed') || normalized.includes('1bed')) return '1bed';
  if (normalized.includes('2 bed') || normalized.includes('2bed')) return '2bed';
  if (normalized.includes('3 bed') || normalized.includes('3bed')) return '3bed';
  if (normalized.includes('4 bed') || normalized.includes('4bed')) return '4bed';
  
  return typeMap[normalized] || '2bed';
}

function detectBedroomsFromType(type: string): number {
  if (!type) return 2;
  
  const normalized = type.toLowerCase();
  if (normalized.includes('studio')) return 0;
  if (normalized.includes('1 bed') || normalized.includes('1bed')) return 1;
  if (normalized.includes('2 bed') || normalized.includes('2bed')) return 2;
  if (normalized.includes('3 bed') || normalized.includes('3bed')) return 3;
  if (normalized.includes('4 bed') || normalized.includes('4bed')) return 4;
  if (normalized.includes('penthouse')) return 3;
  if (normalized.includes('villa')) return 4;
  return 2; // default
}

function estimateSizeFromBedrooms(bedrooms: number): number {
  const sizeMap: Record<number, number> = {
    0: 35,  // studio
    1: 55,  // 1 bed
    2: 85,  // 2 bed
    3: 120, // 3 bed
    4: 180, // 4 bed
    5: 220  // 5+ bed
  };
  return sizeMap[bedrooms] || 85;
}

function detectViewFromDescription(description?: string): string {
  if (!description) return 'city';
  
  const desc = description.toLowerCase();
  if (desc.includes('sea') || desc.includes('mer') || desc.includes('ocean')) return 'sea';
  if (desc.includes('mountain') || desc.includes('montagne')) return 'mountain';
  if (desc.includes('pool') || desc.includes('piscine')) return 'pool';
  if (desc.includes('garden') || desc.includes('jardin')) return 'garden';
  
  return 'city';
}