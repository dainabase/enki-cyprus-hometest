import { supabase } from '@/integrations/supabase/client';
import { ProjectFormData } from '@/schemas/projectSchema';

/**
 * Service de génération de contenu SEO optimisé pour Chypre
 * RÈGLES STRICTES :
 * - Titre : MAXIMUM 60 caractères
 * - Description : MAXIMUM 160 caractères  
 * - JAMAIS d'emojis
 * - JAMAIS de caractères spéciaux Unicode
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
 * Supprime TOUS les emojis et caractères spéciaux d'une chaîne
 * Expression regex complète pour éliminer tous les emojis Unicode
 */
function removeAllEmojisAndSpecialChars(str: string): string {
  if (!str) return '';
  
  // Suppression complète de TOUS les emojis et symboles Unicode
  let cleaned = str
    // Emojis et symboles principaux
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
    // Symboles divers
    .replace(/[\u{2600}-\u{26FF}]/gu, '')
    .replace(/[\u{2700}-\u{27BF}]/gu, '')
    // Dingbats
    .replace(/[\u{2300}-\u{23FF}]/gu, '')
    // Flèches et symboles mathématiques
    .replace(/[\u{2190}-\u{21FF}]/gu, '')
    .replace(/[\u{2B00}-\u{2BFF}]/gu, '')
    // Symboles et pictogrammes divers
    .replace(/[\u{1F000}-\u{1F02F}]/gu, '')
    .replace(/[\u{1F0A0}-\u{1F0FF}]/gu, '')
    .replace(/[\u{1F100}-\u{1F64F}]/gu, '')
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
    .replace(/[\u{1F700}-\u{1F77F}]/gu, '')
    .replace(/[\u{1F780}-\u{1F7FF}]/gu, '')
    .replace(/[\u{1F800}-\u{1F8FF}]/gu, '')
    // Emojis supplémentaires
    .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '')
    .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '')
    // Symboles de transport et cartes
    .replace(/[\u{1F900}-\u{1F9FF}]/gu, '')
    // Caractères de contrôle et formatage
    .replace(/[\u{200B}-\u{200F}]/gu, '')
    .replace(/[\u{2060}-\u{206F}]/gu, '')
    .replace(/[\u{FE00}-\u{FE0F}]/gu, '')
    // Nettoyage des espaces multiples
    .replace(/\s+/g, ' ')
    .trim();
    
  return cleaned;
}

/**
 * Tronque STRICTEMENT à la longueur maximale
 * Ne dépasse JAMAIS la limite spécifiée
 */
function enforceMaxLength(str: string, maxLength: number): string {
  if (!str) return '';
  
  // Nettoyer d'abord les emojis
  str = removeAllEmojisAndSpecialChars(str);
  
  // Si déjà dans la limite, retourner tel quel
  if (str.length <= maxLength) return str;
  
  // Tronquer intelligemment sans couper les mots
  if (maxLength <= 10) return str.substring(0, maxLength);
  
  // Pour les textes plus longs, essayer de couper au dernier espace
  const truncated = str.substring(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  
  // Si on trouve un espace dans les 80% du texte, couper là
  if (lastSpace > maxLength * 0.7) {
    return truncated.substring(0, lastSpace).trim() + '...';
  }
  
  // Sinon couper brutalement à la limite
  return truncated.substring(0, maxLength - 3).trim() + '...';
}

/**
 * Formate le prix de manière compacte pour SEO
 */
function formatPriceCompact(price: number): string {
  if (!price || price <= 0) return '';
  
  if (price >= 1000000) {
    const millions = (price / 1000000).toFixed(1);
    return millions.endsWith('.0') 
      ? millions.slice(0, -2) + 'M' 
      : millions + 'M';
  } else if (price >= 1000) {
    return Math.round(price / 1000) + 'K';
  }
  return price.toString();
}

/**
 * Détermine le type de propriété principal
 */
function getPropertyType(subTypes: string[] | undefined): string {
  if (!subTypes || subTypes.length === 0) return 'Property';
  
  const typeMap: Record<string, string> = {
    villa: 'Villa',
    apartment: 'Apt', // Plus court pour économiser les caractères
    penthouse: 'Penthouse',
    townhouse: 'Townhouse',
    studio: 'Studio',
    office: 'Office',
    retail: 'Shop',
    warehouse: 'Warehouse',
    land_residential: 'Land',
    land_commercial: 'Commercial'
  };
  
  return typeMap[subTypes[0]] || 'Property';
}

/**
 * Service principal de génération SEO - RESPECTE STRICTEMENT LES LIMITES
 */
export async function generateSEOContent(projectData: any): Promise<{
  meta_title: string;
  meta_description: string;
  meta_keywords: string[];
  url_slug: string;
}> {
  try {
    console.log('🔧 Generating SEO content for:', projectData.title);
    
    // Préparer les données
    const propertyType = getPropertyType(projectData.property_sub_type);
    const city = projectData.city || 'Cyprus';
    const zone = projectData.cyprus_zone || 'limassol';
    const price = projectData.price_from ? formatPriceCompact(projectData.price_from) : '';
    const isGoldenVisa = projectData.golden_visa_eligible === true;
    
    // 1. GÉNÉRER LE TITRE (MAX 60 caractères STRICT)
    let title = '';
    
    if (isGoldenVisa && price) {
      // Format court pour Golden Visa
      title = `Golden Visa ${propertyType} ${city} €${price}`;
    } else if (price) {
      // Format avec prix
      title = `${propertyType} ${city} Cyprus | €${price}`;
    } else {
      // Format basique
      title = `${propertyType} for Sale in ${city} Cyprus`;
    }
    
    // NETTOYER et FORCER la limite
    title = removeAllEmojisAndSpecialChars(title);
    title = enforceMaxLength(title, 60);
    
    // 2. GÉNÉRER LA DESCRIPTION (MAX 160 caractères STRICT)  
    let description = '';
    
    if (isGoldenVisa) {
      // Description Golden Visa (courte)
      description = `Golden Visa ${propertyType.toLowerCase()} in ${city}, Cyprus. `;
      if (price) description += `From €${price}. `;
      if (projectData.built_area_m2) {
        description += `${projectData.built_area_m2}m². `;
      }
      description += `EU residency opportunity.`;
    } else {
      // Description standard
      description = `Premium ${propertyType.toLowerCase()} in ${city}, Cyprus. `;
      if (price) description += `From €${price}. `;
      
      // Ajouter des détails si on a de la place
      if (projectData.total_units && projectData.total_units > 1) {
        description += `${projectData.total_units} units. `;
      } else if (projectData.built_area_m2) {
        description += `${projectData.built_area_m2}m². `;
      }
      
      // Proximité si pertinent
      if (projectData.proximity_sea_km && projectData.proximity_sea_km < 1) {
        description += `Near beach. `;
      }
      
      description += `Contact us today.`;
    }
    
    // NETTOYER et FORCER la limite
    description = removeAllEmojisAndSpecialChars(description);
    description = enforceMaxLength(description, 160);
    
    // 3. GÉNÉRER LES MOTS-CLÉS (sans emojis)
    const keywords: string[] = [];
    
    // Mots-clés de base
    keywords.push('Cyprus property');
    keywords.push('Cyprus real estate');
    keywords.push(`${city} property`);
    keywords.push(`${propertyType} Cyprus`);
    
    // Mots-clés Golden Visa si applicable
    if (isGoldenVisa) {
      keywords.push('Golden Visa Cyprus');
      keywords.push('EU residency');
      keywords.push('Cyprus investment visa');
    }
    
    // Ajouter des mots-clés de zone
    const zoneKeywords = CYPRUS_KEYWORDS[zone as keyof typeof CYPRUS_KEYWORDS] || [];
    zoneKeywords.slice(0, 3).forEach(kw => {
      if (keywords.length < 10) {
        keywords.push(kw);
      }
    });
    
    // Nettoyer tous les mots-clés
    const cleanKeywords = keywords
      .map(kw => removeAllEmojisAndSpecialChars(kw))
      .filter(kw => kw.length > 0)
      .slice(0, 10);
    
    // 4. GÉNÉRER LE SLUG URL (propre et simple)
    let slug = projectData.title || 'property-cyprus';
    slug = removeAllEmojisAndSpecialChars(slug)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50);
    
    // Si le slug est vide après nettoyage
    if (!slug) {
      slug = `${propertyType}-${city}-${Date.now()}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    
    // VÉRIFICATION FINALE DES LIMITES
    console.log('✅ SEO Content Generated:');
    console.log(`  Title: ${title.length}/60 chars`);
    console.log(`  Description: ${description.length}/160 chars`);
    console.log(`  Keywords: ${cleanKeywords.length} keywords`);
    console.log(`  Slug: ${slug}`);
    
    // Vérifier qu'on respecte bien les limites
    if (title.length > 60) {
      console.error('⚠️ TITLE TOO LONG - Forcing truncation');
      title = title.substring(0, 60);
    }
    if (description.length > 160) {
      console.error('⚠️ DESCRIPTION TOO LONG - Forcing truncation');
      description = description.substring(0, 160);
    }
    
    return {
      meta_title: title,
      meta_description: description,
      meta_keywords: cleanKeywords,
      url_slug: slug
    };
    
  } catch (error) {
    console.error('❌ Error generating SEO content:', error);
    
    // Valeurs par défaut SANS EMOJIS et DANS LES LIMITES
    return {
      meta_title: 'Property for Sale in Cyprus', // 28 chars
      meta_description: 'Premium property in Cyprus. Excellent investment opportunity. Contact us for more information.', // 94 chars
      meta_keywords: ['Cyprus property', 'Cyprus real estate', 'Cyprus investment'],
      url_slug: 'property-cyprus'
    };
  }
}

/**
 * Valide que le contenu SEO respecte les limites
 */
export function validateSEOContent(content: {
  meta_title?: string;
  meta_description?: string;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (content.meta_title) {
    const cleanTitle = removeAllEmojisAndSpecialChars(content.meta_title);
    if (cleanTitle.length > 60) {
      errors.push(`Le titre SEO est trop long (${cleanTitle.length}/60 caractères)`);
    }
    if (cleanTitle !== content.meta_title) {
      errors.push('Le titre SEO contient des emojis ou caractères spéciaux');
    }
  }
  
  if (content.meta_description) {
    const cleanDesc = removeAllEmojisAndSpecialChars(content.meta_description);
    if (cleanDesc.length > 160) {
      errors.push(`La description SEO est trop longue (${cleanDesc.length}/160 caractères)`);
    }
    if (cleanDesc !== content.meta_description) {
      errors.push('La description SEO contient des emojis ou caractères spéciaux');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
