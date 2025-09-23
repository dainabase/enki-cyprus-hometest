import { supabase } from '@/integrations/supabase/client';
import { ProjectFormData } from '@/schemas/projectSchema';

/**
 * Service de génération de contenu SEO optimisé pour Chypre
 * Respecte les limites : Titre 60 caractères, Description 160 caractères
 * JAMAIS d'emojis dans le contenu généré
 */

// Mots-clés Cyprus pour l'immobilier
const CYPRUS_KEYWORDS = {
  limassol: ['Limassol', 'Marina', 'Business hub', 'Coastal', 'Investment'],
  paphos: ['Paphos', 'UNESCO', 'Tourism', 'Resort', 'Heritage'],
  larnaca: ['Larnaca', 'Airport', 'Beach', 'Convenient', 'Central'],
  nicosia: ['Nicosia', 'Capital', 'Business', 'Urban', 'Modern'],
  famagusta: ['Famagusta', 'Emerging', 'Opportunity', 'Coastal', 'Growth']
};

/**
 * Supprime tous les emojis d'une chaîne
 */
function removeEmojis(str: string): string {
  if (!str) return '';
  // Expression régulière complète pour supprimer tous les emojis
  return str.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F000}-\u{1F02F}]|[\u{1F0A0}-\u{1F0FF}]|[\u{1F100}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F700}-\u{1F77F}]|[\u{1F780}-\u{1F7FF}]|[\u{1F800}-\u{1F8FF}]|[\u{2300}-\u{23FF}]|[\u{2B00}-\u{2BFF}]|[\u{2190}-\u{21FF}]|[\u{2934}-\u{2935}]|[\u{3030}]|[\u{3297}]|[\u{3299}]|[\u{1F004}]|[\u{1F0CF}]|[\u{1F170}-\u{1F251}]/gu, '').trim();
}

/**
 * Tronque une chaîne à une longueur maximale sans couper les mots
 */
function truncateString(str: string, maxLength: number): string {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  
  const truncated = str.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.8) {
    return truncated.slice(0, lastSpace).trim();
  }
  
  return truncated.slice(0, maxLength - 3).trim() + '...';
}

/**
 * Formate le prix pour l'affichage SEO
 */
function formatPrice(price: number): string {
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1)}M`;
  } else if (price >= 1000) {
    return `${Math.round(price / 1000)}K`;
  }
  return price.toString();
}

/**
 * Obtient le type de propriété principal
 */
function getMainPropertyType(subTypes: string[] | undefined): string {
  if (!subTypes || subTypes.length === 0) return 'Property';
  
  const typeMap: Record<string, string> = {
    villa: 'Villa',
    apartment: 'Apartment', 
    penthouse: 'Penthouse',
    townhouse: 'Townhouse',
    studio: 'Studio',
    office: 'Office',
    retail: 'Retail Space',
    warehouse: 'Warehouse',
    land_residential: 'Residential Land',
    land_commercial: 'Commercial Land'
  };
  
  return typeMap[subTypes[0]] || 'Property';
}

/**
 * Service principal de génération de contenu SEO
 */
export async function generateSEOContent(projectData: any): Promise<{
  meta_title: string;
  meta_description: string;
  meta_keywords: string[];
  url_slug: string;
}> {
  try {
    console.log('Generating SEO content for:', projectData.title);
    
    // Préparer les données pour le service
    const propertyType = getMainPropertyType(projectData.property_sub_type);
    const city = projectData.city || 'Cyprus';
    const price = projectData.price_from ? formatPrice(projectData.price_from) : '';
    const zone = projectData.cyprus_zone || 'limassol';
    
    // Générer le titre SEO (max 60 caractères, sans emojis)
    let meta_title = `${propertyType} in ${city} Cyprus`;
    if (price) {
      meta_title = `${propertyType} ${city} | From €${price}`;
    }
    if (projectData.golden_visa_eligible) {
      meta_title = `Golden Visa ${propertyType} ${city}`;
    }
    meta_title = removeEmojis(meta_title);
    meta_title = truncateString(meta_title, 60);
    
    // Générer la description SEO (max 160 caractères, sans emojis)
    let meta_description = `Premium ${propertyType.toLowerCase()} in ${city}, Cyprus.`;
    
    if (projectData.golden_visa_eligible) {
      meta_description += ` Golden Visa eligible from €${price || '300K'}.`;
    } else if (price) {
      meta_description += ` Starting from €${price}.`;
    }
    
    if (projectData.built_area_m2) {
      meta_description += ` ${projectData.built_area_m2}m² living space.`;
    }
    
    if (projectData.proximity_sea_km && projectData.proximity_sea_km < 1) {
      meta_description += ` Near beach.`;
    } else if (projectData.proximity_airport_km && projectData.proximity_airport_km < 10) {
      meta_description += ` Near airport.`;
    }
    
    meta_description += ` Investment opportunity.`;
    meta_description = removeEmojis(meta_description);
    meta_description = truncateString(meta_description, 160);
    
    // Générer les mots-clés (pas d'emojis)
    const keywords: Set<string> = new Set();
    keywords.add('Cyprus property');
    keywords.add('Cyprus real estate');
    keywords.add(`${propertyType} Cyprus`);
    keywords.add(`${city} property`);
    
    // Ajouter les mots-clés de zone
    const zoneKeywords = CYPRUS_KEYWORDS[zone as keyof typeof CYPRUS_KEYWORDS] || [];
    zoneKeywords.forEach(kw => keywords.add(kw));
    
    if (projectData.golden_visa_eligible) {
      keywords.add('Golden Visa Cyprus');
      keywords.add('EU residency');
    }
    
    const meta_keywords = Array.from(keywords).slice(0, 10);
    
    // Générer le slug URL (sans caractères spéciaux ni emojis)
    let url_slug = projectData.title || 'property-cyprus';
    url_slug = removeEmojis(url_slug);
    url_slug = url_slug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50);
    
    // Optionnel : Appel à l'Edge Function si elle existe
    try {
      const { data, error } = await supabase.functions.invoke('generate-seo', {
        body: {
          title: projectData.title,
          description: projectData.description,
          city: projectData.city,
          zone: projectData.cyprus_zone,
          price_from: projectData.price_from,
          total_units: projectData.total_units,
          golden_visa: projectData.golden_visa_eligible,
          developer: projectData.developer_name,
          amenities: projectData.amenities
        }
      });
      
      if (!error && data) {
        // Si l'Edge Function retourne du contenu, vérifier et nettoyer
        if (data.meta_title) {
          meta_title = removeEmojis(data.meta_title);
          meta_title = truncateString(meta_title, 60);
        }
        if (data.meta_description) {
          meta_description = removeEmojis(data.meta_description);
          meta_description = truncateString(meta_description, 160);
        }
        if (data.meta_keywords && Array.isArray(data.meta_keywords)) {
          // Nettoyer les mots-clés des emojis
          data.meta_keywords = data.meta_keywords.map((kw: string) => removeEmojis(kw));
          if (data.meta_keywords.length > 0) {
            meta_keywords.length = 0;
            meta_keywords.push(...data.meta_keywords.slice(0, 10));
          }
        }
        if (data.url_slug) {
          url_slug = removeEmojis(data.url_slug);
          url_slug = url_slug
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .substring(0, 50);
        }
      }
    } catch (edgeFunctionError) {
      console.log('Edge function not available, using local generation');
    }
    
    console.log('SEO content generated successfully');
    
    return {
      meta_title,
      meta_description,
      meta_keywords,
      url_slug
    };
    
  } catch (error) {
    console.error('Error in generateSEOContent:', error);
    
    // Valeurs par défaut en cas d'erreur (sans emojis, respectant les limites)
    return {
      meta_title: 'Property in Cyprus | Investment Opportunity',
      meta_description: 'Premium property development in Cyprus. Excellent location and investment potential. Contact us for details.',
      meta_keywords: ['Cyprus property', 'Cyprus real estate', 'Cyprus investment'],
      url_slug: 'property-cyprus'
    };
  }
}
