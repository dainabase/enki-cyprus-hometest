// Import the official Supabase client
export { supabase } from '@/integrations/supabase/client';

// Types pour TypeScript
export interface DatabaseProperty {
  id: string;
  title: string;
  description: string;
  detailed_description?: string;
  type: string;
  price: number;
  price_from?: number;
  location: {
    lat: number;
    lng: number;
    city: string;
  };
  features: string[];
  detailed_features?: string[];
  photos: string[];
  plans?: string[];
  virtual_tour?: string;
  created_at?: string;
  updated_at?: string;
}

// Types pour compatibilité avec l'interface existante
export interface Property {
  id: string;
  title: string;
  description: string;
  detailedDescription?: string;
  type: 'apartment' | 'villa' | 'penthouse' | 'maison' | 'commercial';
  price: string;
  priceValue: number;
  location: string;
  coordinates: { lat: number; lng: number };
  bedrooms: number;
  bathrooms: number;
  area: number;
  features: string[];
  detailedFeatures?: string[];
  photos: string[];
  plans?: string[];
  virtualTour?: string;
}

// Fonction de transformation des données Supabase vers l'interface Property
export const transformDatabaseProperty = (dbProperty: any): Property => {
  return {
    id: dbProperty.id,
    title: dbProperty.title || 'Titre non disponible',
    description: dbProperty.description || dbProperty.detailed_description || 'Description non disponible',
    detailedDescription: dbProperty.detailed_description || dbProperty.description,
    type: (dbProperty.property_sub_type?.[0] || dbProperty.type || 'apartment') as Property['type'],
    price: dbProperty.price_from ? `€${dbProperty.price_from.toLocaleString()}` : 'Prix sur demande',
    priceValue: dbProperty.price_from || dbProperty.price_to || 0,
    location: dbProperty.city || 'Localisation non disponible',
    coordinates: { 
      lat: dbProperty.gps_latitude || 35.1264, 
      lng: dbProperty.gps_longitude || 33.4299 
    },
    bedrooms: dbProperty.bedrooms_count || 2,
    bathrooms: dbProperty.bathrooms_count || 1,
    area: dbProperty.internal_area || dbProperty.built_area_m2 || 80,
    features: Array.isArray(dbProperty.features) ? dbProperty.features : 
              Array.isArray(dbProperty.amenities) ? dbProperty.amenities : [],
    detailedFeatures: Array.isArray(dbProperty.detailed_features) ? dbProperty.detailed_features : [],
    photos: Array.isArray(dbProperty.photos) ? dbProperty.photos : 
            Array.isArray(dbProperty.photo_gallery_urls) ? dbProperty.photo_gallery_urls : [],
    plans: Array.isArray(dbProperty.plans) ? dbProperty.plans : [],
    virtualTour: dbProperty.virtual_tour || dbProperty.virtual_tour_url,
  };
};