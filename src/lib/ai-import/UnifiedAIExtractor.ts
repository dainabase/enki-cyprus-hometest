import { supabase } from '@/integrations/supabase/client';
import { 
  AI_EXTRACTION_SYSTEM_PROMPT, 
  AI_EXTRACTION_USER_PROMPT,
  generateMockExtraction
} from './aiExtractionPrompt';
import {
  ExtractionResult,
  validateExtractedData,
  enrichExtractedData
} from './aiFieldMapper';
import { DEBUG_MODE, logDebug, logError, logSuccess, generateTestData } from './debugExtractor';

export async function extractFullHierarchy(fileUrls: string[]): Promise<ExtractionResult> {
  logDebug('🚀 Real AI Extraction System Starting', { urlCount: fileUrls.length, urls: fileUrls });
  
  try {
    logDebug('🤖 Calling Advanced Document Parser...');
    
    // Call the new advanced document parser
    const { data, error } = await supabase.functions.invoke('advanced-document-parser', {
      body: {
        fileUrls,
        documentType: 'auto_detect'
      }
    });

    logDebug('📊 Parser response', { hasData: !!data, hasError: !!error, dataKeys: data ? Object.keys(data) : [] });

    if (error) {
      logError('Advanced parser error', error);
      throw error;
    }

    if (data && data.success && data.extractedData) {
      logSuccess('✅ Real extraction successful', { 
        documentType: data.documentType,
        confidence: data.confidence,
        propertiesCount: data.extractedData.properties?.length || 0 
      });
      
      return {
        ...data.extractedData,
        extraction_metadata: {
          confidence_score: data.confidence || 0.8,
          document_type: data.documentType || 'real_estate_project',
          pages_analyzed: data.metadata?.documentsProcessed || 1,
          extraction_timestamp: new Date().toISOString(),
          ai_model: 'advanced-parser',
          warnings: []
        },
        statistics: calculateStatistics(data.extractedData),
        validation_errors: []
      };
    } else {
      logDebug('No valid data from advanced parser, falling back');
      throw new Error('Advanced parsing returned no valid data');
    }

  } catch (error) {
    logError('Real extraction failed', {
      message: error.message,
      stack: error.stack
    });
    
    // Fallback to basic extraction
    logDebug('🔄 Falling back to basic extraction');
    return await basicExtractionFallback(fileUrls);
  }
}

// Fallback extraction system
async function basicExtractionFallback(fileUrls: string[]): Promise<ExtractionResult> {
  logDebug('🔄 Basic extraction fallback activated');
  
  try {
    // Call the existing edge function as fallback
    const { data, error } = await supabase.functions.invoke('extract-full-hierarchy', {
      body: {
        fileUrls,
        extractionType: 'full_hierarchy'
      }
    });

    if (error) throw error;

    if (data && data.properties && data.properties.length > 0) {
      return {
        ...data,
        extraction_metadata: {
          confidence_score: 0.6,
          document_type: 'real_estate_project',
          pages_analyzed: 1,
          extraction_timestamp: new Date().toISOString(),
          ai_model: 'fallback-extraction',
          warnings: ['Used fallback extraction method']
        },
        statistics: calculateStatistics(data),
        validation_errors: []
      };
    }
    
    throw new Error('Fallback extraction failed');
    
  } catch (error) {
    logError('Fallback extraction failed', error);
    
    // Last resort: generate minimal test data
    return generateMinimalTestData();
  }
}

function calculateStatistics(data: any) {
  const properties = data.properties || [];
  const goldenVisaCount = properties.filter((p: any) => p.price >= 300000).length;
  const totalValue = properties.reduce((sum: number, p: any) => sum + (p.price || 0), 0);
  
  const typeDistribution: Record<string, number> = {};
  properties.forEach((p: any) => {
    typeDistribution[p.type] = (typeDistribution[p.type] || 0) + 1;
  });
  
  return {
    total_properties: properties.length,
    golden_visa_eligible: goldenVisaCount,
    total_portfolio_value: totalValue,
    average_price: properties.length > 0 ? totalValue / properties.length : 0,
    price_range: {
      min: Math.min(...properties.map((p: any) => p.price || 0)),
      max: Math.max(...properties.map((p: any) => p.price || 0))
    },
    types_distribution: typeDistribution,
    availability: {
      available: properties.filter((p: any) => p.status === 'available').length,
      reserved: properties.filter((p: any) => p.status === 'reserved').length,
      sold: properties.filter((p: any) => p.status === 'sold').length
    }
  };
}

function generateMinimalTestData(): ExtractionResult {
  return {
    extraction_metadata: {
      confidence_score: 0.3,
      document_type: 'unknown',
      pages_analyzed: 0,
      extraction_timestamp: new Date().toISOString(),
      ai_model: 'minimal-fallback',
      warnings: ['All extraction methods failed - using minimal test data']
    },
    developer: {
      name: 'Unknown Developer',
      email_primary: 'contact@unknown.com'
    },
    project: {
      title: 'Unknown Project',
      description: 'Project details could not be extracted',
      city: 'Unknown',
      price: 0,
      status: 'unknown',
      features: [],
      photos: [],
      location: { city: 'Unknown', address: 'Unknown' }
    },
    buildings: [],
    properties: [],
    statistics: {
      total_properties: 0,
      golden_visa_eligible: 0,
      total_portfolio_value: 0,
      average_price: 0,
      price_range: { min: 0, max: 0 },
      types_distribution: {},
      availability: { available: 0, reserved: 0, sold: 0 }
    },
    validation_errors: [
      { field: 'extraction', message: 'Complete extraction failure - manual data entry required' }
    ]
  };
}