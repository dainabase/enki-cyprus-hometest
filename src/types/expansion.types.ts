// Types pour la nouvelle section d'expansion inline des propriétés

export type ExpansionPhase = 'idle' | 'grid' | 'expanded' | 'lexaia';

export interface PropertyData {
  id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  location: string;
  images: string[];
  description: string;
  goldenVisaEligible: boolean;
  fiscalPreview: {
    originCountry: string;
    annualSavings: number;
    taxRate: number;
    comparisonRate: number;
  };
}

export type ChatWidth = 'full' | 'mini' | 'collapsed';

export interface ExpansionState {
  phase: ExpansionPhase;
  expandedPropertyId: string | null;
  showLexaia: boolean;
  selectedPropertyForLexaia: string | null;
  chatWidth: ChatWidth;
}
