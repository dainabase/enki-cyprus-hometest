/** Frontend display types for map/search UI components.
 * These are NOT the Supabase model types (see property.ts for those).
 * TODO: Connect to Supabase - align with real Property model */

export interface DisplayProperty {
  id: string;
  title: string;
  description: string;
  price: string;
  location: string;
  property_category: 'residential' | 'commercial' | 'mixed' | 'industrial';
  property_sub_type: string[];
  bedrooms?: number;
  bathrooms?: number;
  area: string;
  image: string;
  features: string[];
  status: 'available' | 'sold' | 'reserved';
  lat: number;
  lng: number;
  priceValue: number;
  detailedDescription: string;
  detailedFeatures: string[];
  photos: string[];
  plans: string[];
  virtualTour: string;
}

export interface FeaturedProject {
  id: string;
  title: string;
  description: string;
  location: string;
  prix_moyen: number;
  nombre_biens: number;
  types_biens: string[];
  image: string;
  features: string[];
  status: 'disponible' | 'en_construction' | 'livre';
  biens: DisplayProperty[];
}
