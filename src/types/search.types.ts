import { Property } from './property';

export interface FiscalOptimizationDetails {
  taxSavings?: number;
  netIncome?: number;
  recommendations?: string[];
  scenario?: string;
}

export interface AgenticSearchResult {
  analysis?: string;
  properties?: Property[];
  taxInfo?: {
    preview: string;
    details?: FiscalOptimizationDetails;
  };
  pdf_url?: string;
}

export interface SearchConsent {
  given: boolean;
  timestamp?: Date;
}

export interface PropertySearchFilters {
  searchQuery?: string;
  selectedLocation?: string;
  selectedType?: string;
  selectedBudget?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
  bedrooms?: number;
  bathrooms?: number;
}

export interface MockProperty {
  id: number;
  title: string;
  image: string;
  price: string;
  location: string;
  size: number;
  description: string;
  matching: number;
  missingFeatures: string[];
}
