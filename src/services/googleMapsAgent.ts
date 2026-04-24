// Service pour l'agent Google Maps
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

interface PlaceResult {
  name: string;
  type: string;
  distance_km: number;
  address?: string;
  rating?: number;
}

export class GoogleMapsAgent {
  /**
   * Recherche automatique des commodités autour d'une adresse
   */
  async findNearbyPlaces(
    address: string, 
    radiusKm: number = 2
  ): Promise<PlaceResult[]> {
    logger.info(`🔍 Recherche dans ${radiusKm} km autour de: ${address}`);
    
    try {
      // Appel via Edge Function avec les bons paramètres
      const { data, error } = await supabase.functions.invoke('google-maps-agent', {
        body: {
          address,
          radius_km: radiusKm, // IMPORTANT: Le rayon doit être passé ici
          action: 'findNearbyPlaces'
        }
      });

      if (error) {
        console.error('❌ Edge Function error:', error);
        throw error;
      }

      if (data?.error) {
        console.error('❌ API error:', data.error);
        return [];
      }

      logger.info(`✅ Trouvé ${data?.places?.length || 0} lieux dans ${radiusKm} km`);
      return data?.places || [];
      
    } catch (error) {
      console.error('❌ Error in findNearbyPlaces:', error);
      return [];
    }
  }
  
  /**
   * Géocodage simple d'une adresse
   */
  async geocodeAddress(address: string): Promise<{lat: number, lng: number} | null> {
    try {
      const { data, error } = await supabase.functions.invoke('google-maps-agent', {
        body: {
          action: 'geocode',
          address
        }
      });

      if (error) throw error;
      return data.coordinates || null;
      
    } catch (error) {
      console.error('Erreur géocodage:', error);
      return null;
    }
  }

  /**
   * Calcul de distances stratégiques depuis un point
   */
  async calculateDistances(
    lat: number, 
    lng: number
  ): Promise<{
    proximity_sea_km?: number;
    proximity_city_center_km?: number;
    proximity_airport_km?: number;
    proximity_highway_km?: number;
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('google-maps-agent', {
        body: {
          action: 'distances',
          lat,
          lng
        }
      });

      if (error) throw error;
      return data.distances || {};
      
    } catch (error) {
      console.error('Erreur calcul distances:', error);
      return {};
    }
  }

  /**
   * Mapper les types Google vers nos types de commodités
   */
  static mapGoogleType(googleTypes: string[]): string {
    const typeMap: Record<string, string> = {
      'hospital': 'hospital',
      'pharmacy': 'pharmacy',
      'doctor': 'doctor',
      'dentist': 'dentist',
      'veterinary_care': 'veterinary',
      'school': 'primary_school',
      'secondary_school': 'high_school',
      'university': 'university',
      'supermarket': 'supermarket',
      'shopping_mall': 'mall',
      'bakery': 'bakery',
      'grocery_or_supermarket': 'grocery',
      'store': 'shops',
      'bank': 'bank',
      'atm': 'atm',
      'post_office': 'post_office',
      'local_government_office': 'city_hall',
      'police': 'police',
      'restaurant': 'restaurant',
      'cafe': 'cafe',
      'bar': 'bar',
      'meal_takeaway': 'fastfood',
      'night_club': 'nightclub',
      'gym': 'sports_center',
      'park': 'park',
      'amusement_park': 'park',
      'golf_course': 'golf',
      'casino': 'casino',
      'movie_theater': 'cinema',
      'swimming_pool': 'pool',
      'spa': 'sports_center',
      'bus_station': 'bus_stop',
      'subway_station': 'bus_stop',
      'taxi_stand': 'taxi',
      'airport': 'airport',
      'gas_station': 'gas_station',
      'parking': 'parking',
      'church': 'church',
      'mosque': 'mosque',
      'synagogue': 'synagogue',
      'hindu_temple': 'temple',
      'place_of_worship': 'church'
    };
    
    for (const googleType of googleTypes) {
      if (typeMap[googleType]) {
        return typeMap[googleType];
      }
    }
    
    return googleTypes[0] || 'other';
  }

  /**
   * Filtrer et organiser les résultats par catégorie
   */
  static categorizeResults(places: PlaceResult[]): {
    health: PlaceResult[];
    education: PlaceResult[];
    shopping: PlaceResult[];
    transport: PlaceResult[];
    leisure: PlaceResult[];
    finance: PlaceResult[];
    food: PlaceResult[];
    worship: PlaceResult[];
  } {
    const categories = {
      health: ['hospital', 'clinic', 'pharmacy', 'doctor', 'dentist', 'veterinary'],
      education: ['primary_school', 'high_school', 'university', 'intl_school', 'nursery', 'training_center'],
      shopping: ['supermarket', 'mall', 'market', 'bakery', 'grocery', 'shops'],
      transport: ['bus_stop', 'taxi', 'airport', 'marina', 'gas_station', 'parking'],
      finance: ['bank', 'atm', 'post_office', 'city_hall', 'police', 'notary'],
      leisure: ['beach', 'park', 'golf', 'sports_center', 'pool', 'tennis', 'casino', 'cinema', 'theater'],
      food: ['restaurant', 'cafe', 'bar', 'fastfood', 'tavern', 'nightclub'],
      worship: ['church', 'mosque', 'synagogue', 'temple']
    };

    const result: any = {};
    Object.keys(categories).forEach(cat => {
      result[cat] = places.filter(place => 
        (categories as any)[cat].includes(place.type)
      );
    });

    return result;
  }
}

// Export d'une instance singleton pour faciliter l'utilisation
export const googleMapsAgent = new GoogleMapsAgent();