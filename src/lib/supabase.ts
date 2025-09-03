import { createClient } from '@supabase/supabase-js';

// Configuration Supabase - Ces valeurs seront fournies par l'intégration Lovable
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Configuration Supabase manquante. Assurez-vous que l\'intégration Supabase est activée.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour TypeScript
export interface DatabaseProperty {
  id: string;
  title: string;
  description: string;
  detailed_description?: string;
  type: string;
  price: number;
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
export const transformDatabaseProperty = (dbProperty: DatabaseProperty): Property => {
  return {
    id: dbProperty.id,
    title: dbProperty.title,
    description: dbProperty.description,
    detailedDescription: dbProperty.detailed_description,
    type: dbProperty.type as Property['type'],
    price: `€${dbProperty.price.toLocaleString()}`,
    priceValue: dbProperty.price,
    location: dbProperty.location.city,
    coordinates: { lat: dbProperty.location.lat, lng: dbProperty.location.lng },
    bedrooms: 2, // Valeur par défaut, à extraire des features si nécessaire
    bathrooms: 1, // Valeur par défaut, à extraire des features si nécessaire
    area: 80, // Valeur par défaut, à extraire des features si nécessaire
    features: dbProperty.features,
    detailedFeatures: dbProperty.detailed_features,
    photos: dbProperty.photos,
    plans: dbProperty.plans,
    virtualTour: dbProperty.virtual_tour,
  };
};