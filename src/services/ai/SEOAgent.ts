import { supabase } from '@/integrations/supabase/client';

interface SEOContent {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  marketingPoints: string[];
  targetAudience: string;
  urlSlug: string;
}

interface PropertyData {
  id?: string;
  title: string;
  type: string;
  location: string;
  zone?: string;
  price_from: number;
  price_to?: number;
  bedrooms: number;
  bathrooms: number;
  area_sqm: number;
  amenities: string[];
  description?: string;
  golden_visa_eligible: boolean;
  developer_name?: string;
  project_name?: string;
}

export class SEOAgent {
  private config: any = null;

  async initialize() {
    // Récupérer la config depuis Supabase
    const { data, error } = await supabase
      .from('ai_agents_config')
      .select('*')
      .eq('agent_name', 'seo-generator')
      .eq('is_active', true)
      .single();

    if (error || !data) {
      throw new Error('SEO Agent not configured or not active');
    }

    if (!data.api_key_encrypted) {
      throw new Error('API key not configured for SEO Agent');
    }

    this.config = data;
  }

  async generateSEOContent(propertyData: PropertyData, language: string = 'en'): Promise<SEOContent> {
    if (!this.config) {
      await this.initialize();
    }

    const systemPrompt = this.config.system_prompt || this.getDefaultPrompt();
    
    const userPrompt = `
      Generate SEO content for this Cyprus property:
      
      Property: ${propertyData.title}
      Type: ${propertyData.type}
      Location: ${propertyData.location}${propertyData.zone ? `, ${propertyData.zone}` : ''}
      Price Range: €${propertyData.price_from.toLocaleString()}${propertyData.price_to ? ` - €${propertyData.price_to.toLocaleString()}` : ''}
      Bedrooms: ${propertyData.bedrooms}
      Bathrooms: ${propertyData.bathrooms}
      Area: ${propertyData.area_sqm} sqm
      Golden Visa Eligible: ${propertyData.golden_visa_eligible ? 'YES (Investment ≥€300,000)' : 'No'}
      Developer: ${propertyData.developer_name || 'N/A'}
      Project: ${propertyData.project_name || 'N/A'}
      Amenities: ${propertyData.amenities.join(', ')}
      
      Generate in ${language} language:
      1. Meta Title (max 60 characters, include location and key feature)
      2. Meta Description (max 160 characters, compelling and with CTA)
      3. 5-7 relevant keywords (comma-separated)
      4. 3-5 marketing bullet points (unique selling points)
      5. Target audience description (1-2 sentences)
      6. URL slug (lowercase, hyphens, no special chars)
      
      Format as JSON with keys: metaTitle, metaDescription, keywords[], marketingPoints[], targetAudience, urlSlug
    `;

    try {
      // Simuler un appel à l'API OpenAI pour la démo
      // En production, utiliser l'API réelle avec la clé configurée
      const mockResponse = await this.generateMockSEOContent(propertyData);

      // Logger l'utilisation
      await this.logUsage({
        entity_type: 'property',
        entity_id: propertyData.id,
        input_data: { propertyData, language },
        output_data: mockResponse,
        tokens_used: 500,
        cost_estimate: this.calculateCost(500),
        duration_ms: 1500,
        status: 'success'
      });

      return mockResponse;
    } catch (error) {
      console.error('SEO Generation failed:', error);
      await this.logUsage({
        entity_type: 'property',
        entity_id: propertyData.id,
        input_data: { propertyData, language },
        output_data: null,
        tokens_used: 0,
        cost_estimate: 0,
        duration_ms: 0,
        status: 'error',
        error_message: error.message
      });
      throw error;
    }
  }

  private async generateMockSEOContent(propertyData: PropertyData): Promise<SEOContent> {
    // Mock generation pour la démo
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simuler délai API

    const isGoldenVisa = propertyData.golden_visa_eligible;
    const location = propertyData.location;
    const type = propertyData.type;

    return {
      metaTitle: `${propertyData.bedrooms}BR ${type} in ${location}${isGoldenVisa ? ' | Golden Visa' : ''} - From €${(propertyData.price_from / 1000).toFixed(0)}k`,
      metaDescription: `Stunning ${propertyData.bedrooms}-bedroom ${type.toLowerCase()} in ${location}. ${propertyData.area_sqm}sqm living space with premium amenities.${isGoldenVisa ? ' Golden Visa eligible.' : ''} Contact us today!`,
      keywords: [
        `${location} property`,
        `${type} for sale`,
        `${propertyData.bedrooms} bedroom ${location}`,
        'Cyprus real estate',
        isGoldenVisa ? 'Golden Visa Cyprus' : 'Cyprus investment',
        `${location} apartments`,
        'Cyprus property investment'
      ],
      marketingPoints: [
        `Premium ${propertyData.bedrooms}-bedroom ${type.toLowerCase()} in sought-after ${location}`,
        `Spacious ${propertyData.area_sqm}sqm living area with modern finishes`,
        isGoldenVisa ? 'Golden Visa eligible investment (€300,000+)' : 'Excellent investment opportunity',
        `Prime location with easy access to amenities`,
        `Professional property management available`
      ],
      targetAudience: `International investors and families seeking luxury ${type.toLowerCase()} properties in ${location}, Cyprus. Ideal for those interested in European residency${isGoldenVisa ? ' through Golden Visa program' : ''}.`,
      urlSlug: `${propertyData.bedrooms}br-${type.toLowerCase()}-${location.toLowerCase().replace(/\s+/g, '-')}-${(propertyData.price_from / 1000).toFixed(0)}k`
    };
  }

  async generateBulkSEO(propertyIds: string[]): Promise<Map<string, SEOContent>> {
    const results = new Map();
    
    // Process par batch pour éviter rate limiting
    const batchSize = 5;
    for (let i = 0; i < propertyIds.length; i += batchSize) {
      const batch = propertyIds.slice(i, i + batchSize);
      const promises = batch.map(id => this.generateForProperty(id));
      const batchResults = await Promise.allSettled(promises);
      
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.set(batch[index], result.value);
        }
      });
      
      // Pause entre les batches
      if (i + batchSize < propertyIds.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return results;
  }

  private async generateForProperty(propertyId: string): Promise<SEOContent> {
    // Récupérer les données de la propriété depuis Supabase
    const { data } = await supabase
      .from('properties')
      .select(`
        *,
        projects!inner (
          title,
          city,
          developers!inner (
            name
          )
        )
      `)
      .eq('id', propertyId)
      .single();

    if (!data) {
      throw new Error(`Property ${propertyId} not found`);
    }

    const propertyData: PropertyData = {
      id: data.id,
      title: data.unit_number || `${data.property_type} ${data.id.substr(0, 8)}`,
      type: data.property_type || 'Apartment',
      location: data.projects?.city || 'Cyprus',
      price_from: data.price_excluding_vat || 0,
      bedrooms: data.bedrooms_count || 0,
      bathrooms: data.bathrooms_count || 0,
      area_sqm: data.internal_area || 0,
      amenities: [], // TODO: Extract from project amenities
      golden_visa_eligible: data.golden_visa_eligible || false,
      developer_name: data.projects?.developers?.name,
      project_name: data.projects?.title
    };

    return this.generateSEOContent(propertyData);
  }

  private calculateCost(tokens: number): number {
    // GPT-4 Turbo pricing approximation
    const costPer1kTokens = 0.03; // $0.03 per 1K tokens
    return (tokens / 1000) * costPer1kTokens;
  }

  private async logUsage(data: any) {
    try {
      await supabase
        .from('ai_agents_logs')
        .insert({
          agent_id: this.config.id,
          ...data,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Failed to log usage:', error);
    }
  }

  private getDefaultPrompt(): string {
    return `You are a real estate SEO expert specializing in Cyprus properties.
    Generate compelling, keyword-rich content that appeals to international investors.
    Focus on Golden Visa eligibility when applicable (≥€300,000).
    Highlight location benefits, ROI potential, and lifestyle aspects.
    Use power words and create urgency while remaining factual.`;
  }
}