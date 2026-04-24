export { supabase } from '@/integrations/supabase/client';

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

interface DatabasePropertyRow {
  id: string;
  title?: string | null;
  description?: string | null;
  detailed_description?: string | null;
  type?: string | null;
  property_sub_type?: string[] | null;
  price_from?: number | null;
  price_to?: number | null;
  city?: string | null;
  gps_latitude?: number | null;
  gps_longitude?: number | null;
  bedrooms_count?: number | null;
  bathrooms_count?: number | null;
  internal_area?: number | null;
  built_area_m2?: number | null;
  features?: unknown;
  amenities?: unknown;
  detailed_features?: unknown;
  photos?: unknown;
  photo_gallery_urls?: unknown;
  plans?: unknown;
  virtual_tour?: string | null;
  virtual_tour_url?: string | null;
}

function coerceStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object') {
        const obj = item as { name?: unknown; url?: unknown };
        if (typeof obj.name === 'string') return obj.name;
        if (typeof obj.url === 'string') return obj.url;
      }
      return String(item);
    })
    .filter((s) => s.length > 0);
}

export const transformDatabaseProperty = (dbProperty: DatabasePropertyRow): Property => {
  return {
    id: dbProperty.id,
    title: dbProperty.title || 'Titre non disponible',
    description: dbProperty.description || dbProperty.detailed_description || 'Description non disponible',
    detailedDescription: dbProperty.detailed_description || dbProperty.description || undefined,
    type: (dbProperty.property_sub_type?.[0] || dbProperty.type || 'apartment') as Property['type'],
    price: dbProperty.price_from ? `EUR ${dbProperty.price_from.toLocaleString()}` : 'Prix sur demande',
    priceValue: dbProperty.price_from ?? dbProperty.price_to ?? 0,
    location: dbProperty.city || 'Localisation non disponible',
    coordinates: {
      lat: dbProperty.gps_latitude ?? 35.1264,
      lng: dbProperty.gps_longitude ?? 33.4299
    },
    bedrooms: dbProperty.bedrooms_count ?? 2,
    bathrooms: dbProperty.bathrooms_count ?? 1,
    area: dbProperty.internal_area ?? dbProperty.built_area_m2 ?? 80,
    features: coerceStringArray(dbProperty.features).length > 0
      ? coerceStringArray(dbProperty.features)
      : coerceStringArray(dbProperty.amenities),
    detailedFeatures: coerceStringArray(dbProperty.detailed_features),
    photos: coerceStringArray(dbProperty.photos).length > 0
      ? coerceStringArray(dbProperty.photos)
      : coerceStringArray(dbProperty.photo_gallery_urls),
    plans: coerceStringArray(dbProperty.plans),
    virtualTour: dbProperty.virtual_tour ?? dbProperty.virtual_tour_url ?? undefined,
  };
};
