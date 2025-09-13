/**
 * Validateur spécialisé pour les nouveaux champs Cyprus
 * Ajoutés lors de l'étape 1 d'audit de la base de données
 */

export interface CyprusPropertyFields {
  // Champs légaux Cyprus
  title_deed_number?: string;
  energy_certificate_rating?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  property_tax_yearly?: number;
  transfer_fee_percentage?: number;
  stamp_duty_percentage?: number;
  legal_fees_percentage?: number;
  immovable_property_tax?: number;
  sewerage_levy?: number;
  
  // Surfaces Cyprus
  plot_m2?: number;
  covered_veranda_m2?: number;
  uncovered_veranda_m2?: number;
  basement_m2?: number;
  attic_m2?: number;
  
  // Équipements Cyprus
  has_underfloor_heating?: boolean;
  has_central_heating?: boolean;
  has_air_conditioning?: boolean;
  has_solar_panels?: boolean;
  has_pressurized_water?: boolean;
  has_electric_gates?: boolean;
  has_alarm_system?: boolean;
  internet_ready?: boolean;
}

export interface CyprusProjectFields {
  // Permis Cyprus
  planning_permit_number?: string;
  building_permit_number?: string;
  environmental_permit?: string;
  architect_license_number?: string;
  engineer_license_number?: string;
  municipality?: string;
  district?: string;
  
  // SEO Cyprus
  meta_keywords?: string[];
  og_image_url?: string;
  schema_markup?: any;
}

export interface CyprusDeveloperFields {
  // Légal Cyprus
  company_registration_number?: string;
  vat_number?: string;
  license_number?: string;
  insurance_coverage?: number;
  bank_guarantee?: boolean;
}

/**
 * Calcule automatiquement le taux de TVA selon les règles Cyprus
 */
export function calculateVATRate(property: {
  type: string;
  size_m2: number;
  property_category?: string;
}): number {
  // Commercial = 19%
  if (property.type === 'commercial' || property.property_category === 'commercial') {
    return 19.00;
  }
  
  // Résidentiel > 200m² = 19%
  if (property.size_m2 > 200) {
    return 19.00;
  }
  
  // Résidentiel ≤ 200m² = 5%
  return 5.00;
}

/**
 * Calcule le prix avec TVA
 */
export function calculatePriceWithVAT(price: number, vatRate: number): number {
  return Math.round(price * (1 + vatRate / 100));
}

/**
 * Détermine l'éligibilité Golden Visa
 */
export function isGoldenVisaEligible(price: number, priceWithVAT?: number): boolean {
  // Vérifier le prix avec TVA en priorité
  if (priceWithVAT && priceWithVAT >= 300000) {
    return true;
  }
  
  // Sinon vérifier le prix de base
  return price >= 300000;
}

/**
 * Valide un certificat énergétique Cyprus
 */
export function validateEnergyRating(rating?: string): 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | null {
  if (!rating) return null;
  
  const validRatings = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const upperRating = rating.toUpperCase();
  
  return validRatings.includes(upperRating) 
    ? upperRating as 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'
    : null;
}

/**
 * Applique les valeurs par défaut Cyprus
 */
export function applyCyprusDefaults(property: any): any {
  return {
    ...property,
    
    // Calcul VAT automatique
    vat_rate: property.vat_rate || calculateVATRate(property),
    
    // Prix avec TVA
    price_with_vat: property.price_with_vat || calculatePriceWithVAT(
      property.price, 
      property.vat_rate || calculateVATRate(property)
    ),
    
    // Golden Visa
    is_golden_visa: property.is_golden_visa ?? isGoldenVisaEligible(
      property.price, 
      property.price_with_vat
    ),
    
    // Frais Cyprus par défaut
    transfer_fee_percentage: property.transfer_fee_percentage || 3.00,
    stamp_duty_percentage: property.stamp_duty_percentage || 0.15,
    legal_fees_percentage: property.legal_fees_percentage || 1.00,
    
    // Certificat énergétique par défaut
    energy_certificate_rating: property.energy_certificate_rating || 'B',
    
    // Internet par défaut
    internet_ready: property.internet_ready ?? true,
    
    // Équipements par défaut false
    has_underfloor_heating: property.has_underfloor_heating || false,
    has_central_heating: property.has_central_heating || false,
    has_air_conditioning: property.has_air_conditioning || false,
    has_solar_panels: property.has_solar_panels || false,
    has_pressurized_water: property.has_pressurized_water || false,
    has_electric_gates: property.has_electric_gates || false,
    has_alarm_system: property.has_alarm_system || false
  };
}

/**
 * Valide tous les champs Cyprus d'une propriété
 */
export function validateCyprusProperty(property: any): string[] {
  const errors: string[] = [];
  
  // Validation prix
  if (!property.price || property.price <= 0) {
    errors.push('Prix requis et doit être > 0');
  }
  
  // Validation surface
  if (!property.size_m2 || property.size_m2 <= 0) {
    errors.push('Surface (size_m2) requise et doit être > 0');
  }
  
  // Validation VAT rate
  if (property.vat_rate && ![5.00, 19.00].includes(property.vat_rate)) {
    errors.push('VAT rate doit être 5.00 ou 19.00 pour Cyprus');
  }
  
  // Validation certificat énergétique
  if (property.energy_certificate_rating) {
    const validRating = validateEnergyRating(property.energy_certificate_rating);
    if (!validRating) {
      errors.push('Energy certificate rating doit être A, B, C, D, E, F ou G');
    }
  }
  
  // Validation frais (doivent être positifs)
  const feeFields = [
    'transfer_fee_percentage',
    'stamp_duty_percentage', 
    'legal_fees_percentage',
    'property_tax_yearly',
    'immovable_property_tax',
    'sewerage_levy'
  ];
  
  feeFields.forEach(field => {
    if (property[field] !== undefined && property[field] < 0) {
      errors.push(`${field} ne peut pas être négatif`);
    }
  });
  
  return errors;
}

/**
 * Extrait les numéros de permis depuis un texte
 */
export function extractPermitNumbers(text: string): {
  planning_permit?: string;
  building_permit?: string;
  environmental_permit?: string;
} {
  const permits: any = {};
  
  // Patterns pour détecter les permis
  const patterns = {
    planning_permit: /planning\s+permit\s*[:#]?\s*([A-Z0-9\/\-]+)/i,
    building_permit: /building\s+permit\s*[:#]?\s*([A-Z0-9\/\-]+)/i,
    environmental_permit: /environmental\s+permit\s*[:#]?\s*([A-Z0-9\/\-]+)/i
  };
  
  Object.entries(patterns).forEach(([key, pattern]) => {
    const match = text.match(pattern);
    if (match && match[1]) {
      permits[key] = match[1].trim();
    }
  });
  
  return permits;
}

/**
 * Statistiques spécifiques Cyprus
 */
export function calculateCyprusStatistics(properties: any[]) {
  const stats = {
    total_properties: properties.length,
    golden_visa_eligible: 0,
    residential_5_percent_vat: 0,
    residential_19_percent_vat: 0,
    commercial_properties: 0,
    average_size_m2: 0,
    average_price_with_vat: 0,
    total_transfer_fees: 0,
    energy_ratings: {} as Record<string, number>
  };
  
  let totalSize = 0;
  let totalPriceWithVAT = 0;
  let totalTransferFees = 0;
  
  properties.forEach(prop => {
    // Golden Visa
    if (prop.is_golden_visa) {
      stats.golden_visa_eligible++;
    }
    
    // VAT categories
    if (prop.vat_rate === 5.00) {
      stats.residential_5_percent_vat++;
    } else if (prop.vat_rate === 19.00) {
      if (prop.type === 'commercial') {
        stats.commercial_properties++;
      } else {
        stats.residential_19_percent_vat++;
      }
    }
    
    // Moyennes
    if (prop.size_m2) {
      totalSize += prop.size_m2;
    }
    
    if (prop.price_with_vat) {
      totalPriceWithVAT += prop.price_with_vat;
    }
    
    if (prop.price && prop.transfer_fee_percentage) {
      totalTransferFees += prop.price * (prop.transfer_fee_percentage / 100);
    }
    
    // Certificats énergétiques
    if (prop.energy_certificate_rating) {
      const rating = prop.energy_certificate_rating;
      stats.energy_ratings[rating] = (stats.energy_ratings[rating] || 0) + 1;
    }
  });
  
  // Calcul moyennes
  if (properties.length > 0) {
    stats.average_size_m2 = Math.round(totalSize / properties.length);
    stats.average_price_with_vat = Math.round(totalPriceWithVAT / properties.length);
  }
  
  stats.total_transfer_fees = Math.round(totalTransferFees);
  
  return stats;
}