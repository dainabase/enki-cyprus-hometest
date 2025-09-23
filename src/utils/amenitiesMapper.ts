// Mapping entre l'ancien format français et les codes anglais
export const amenitiesLegacyToCode: Record<string, string> = {
  // Wellness
  'piscine': 'swimming_pool',
  'spa': 'spa',
  'gym': 'gym',
  'sauna': 'sauna',
  'hammam': 'steam_room',
  'jacuzzi': 'jacuzzi',
  'massage_room': 'massage_room',
  'yoga_studio': 'yoga_studio',
  
  // Security
  'securite_24_7': 'security_24_7',
  'gated_community': 'gated_community',
  'video_surveillance': 'video_surveillance',
  'access_control': 'access_control',
  'alarm_system': 'alarm_system',
  
  // Lifestyle
  'conciergerie': 'concierge',
  'restaurant': 'restaurant',
  'bar': 'bar',
  'lounge': 'lounge',
  'rooftop_terrace': 'rooftop_terrace',
  'library': 'library',
  'wine_cellar': 'wine_cellar',
  
  // Business
  'business_center': 'business_center',
  'meeting_rooms': 'meeting_rooms',
  'coworking': 'coworking_space',
  
  // Recreation
  'tennis_court': 'tennis_court',
  'padel_court': 'padel_court',
  'basketball_court': 'basketball_court',
  'football_field': 'football_field',
  'golf_simulator': 'golf_simulator',
  'bowling': 'bowling',
  'billiards': 'billiards',
  'games_room': 'games_room',
  'salle_cinema': 'cinema_room',
  'club_house': 'clubhouse',
  'kids_club': 'kids_club',
  'playground': 'playground',
  
  // Essential
  'parking': 'parking',
  'parking_souterrain': 'underground_parking',
  'garage_prive': 'private_garage',
  'storage': 'storage',
  'laundry': 'laundry_room',
  'elevator': 'elevator',
  'disabled_access': 'disabled_access',
  
  // Outdoor
  'garden': 'garden',
  'barbecue': 'bbq_area',
  'beach_access': 'beach_access',
  'jogging_track': 'jogging_track',
  'bike_path': 'bike_path',
  
  // Special
  'helipad': 'helipad',
  'marina_berth': 'marina_berth',
  'private_beach': 'private_beach'
};

// Fonction pour convertir l'ancien format vers le nouveau
export function convertLegacyAmenities(legacyAmenities: string[]): string[] {
  if (!legacyAmenities || !Array.isArray(legacyAmenities)) {
    return [];
  }
  
  return legacyAmenities
    .map(amenity => {
      // Si c'est déjà un code anglais, on le garde
      if (amenity.includes('_')) {
        return amenity;
      }
      // Sinon on cherche le mapping
      return amenitiesLegacyToCode[amenity] || amenity;
    })
    .filter(Boolean);
}

// Type pour les photos catégorisées (nouveau format)
export interface CategorizedPhoto {
  url: string;
  category: 'hero' | 'exterior_1' | 'exterior_2' | 'interior_1' | 'interior_2' | 
            'panoramic_view' | 'sea_view' | 'mountain_view' | 'amenities' | 
            'plans' | 'kitchen' | 'bedroom' | 'bathroom' | 'balcony' | 'garden';
  isPrimary?: boolean;
  caption?: string;
}

// Fonction pour convertir les photos vers le nouveau format catégorisé
export function convertPhotosToCategorized(photos: any): CategorizedPhoto[] {
  console.log('🔄 Converting photos to categorized format:', photos);
  
  // Si photos est déjà au bon format (array avec category)
  if (Array.isArray(photos)) {
    // Filtrer et mapper les photos valides
    return photos
      .filter(photo => photo && (photo.url || typeof photo === 'string'))
      .map((photo, index) => {
        if (typeof photo === 'string') {
          // Si c'est juste une URL string
          return {
            url: photo,
            category: index === 0 ? 'hero' : 'exterior_1',
            isPrimary: index === 0,
            caption: ''
          } as CategorizedPhoto;
        } else if (photo.category) {
          // Si c'est déjà au bon format
          return {
            url: photo.url || '',
            category: photo.category,
            isPrimary: photo.isPrimary || false,
            caption: photo.caption || ''
          } as CategorizedPhoto;
        } else {
          // Si c'est un objet avec url mais sans category
          return {
            url: photo.url || '',
            category: index === 0 ? 'hero' : 'exterior_1',
            isPrimary: photo.isPrimary || index === 0,
            caption: photo.caption || ''
          } as CategorizedPhoto;
        }
      });
  }
  
  // Si photos est un objet avec des catégories (ancien format)
  if (photos && typeof photos === 'object' && !Array.isArray(photos)) {
    const result: CategorizedPhoto[] = [];
    
    // Convertir exterior
    if (photos.exterior && Array.isArray(photos.exterior)) {
      photos.exterior.forEach((photo: any, index: number) => {
        if (photo && (photo.url || typeof photo === 'string')) {
          result.push({
            url: typeof photo === 'string' ? photo : photo.url,
            category: index === 0 ? 'hero' : index === 1 ? 'exterior_1' : 'exterior_2',
            isPrimary: index === 0,
            caption: typeof photo === 'object' ? (photo.caption || '') : ''
          });
        }
      });
    }
    
    // Convertir interior
    if (photos.interior && Array.isArray(photos.interior)) {
      photos.interior.forEach((photo: any, index: number) => {
        if (photo && (photo.url || typeof photo === 'string')) {
          result.push({
            url: typeof photo === 'string' ? photo : photo.url,
            category: index === 0 ? 'interior_1' : 'interior_2',
            isPrimary: false,
            caption: typeof photo === 'object' ? (photo.caption || '') : ''
          });
        }
      });
    }
    
    // Convertir kitchen
    if (photos.kitchen && Array.isArray(photos.kitchen)) {
      photos.kitchen.forEach((photo: any) => {
        if (photo && (photo.url || typeof photo === 'string')) {
          result.push({
            url: typeof photo === 'string' ? photo : photo.url,
            category: 'kitchen',
            isPrimary: false,
            caption: typeof photo === 'object' ? (photo.caption || '') : ''
          });
        }
      });
    }
    
    // Convertir bedroom
    if (photos.bedroom && Array.isArray(photos.bedroom)) {
      photos.bedroom.forEach((photo: any) => {
        if (photo && (photo.url || typeof photo === 'string')) {
          result.push({
            url: typeof photo === 'string' ? photo : photo.url,
            category: 'bedroom',
            isPrimary: false,
            caption: typeof photo === 'object' ? (photo.caption || '') : ''
          });
        }
      });
    }
    
    // Convertir bathroom
    if (photos.bathroom && Array.isArray(photos.bathroom)) {
      photos.bathroom.forEach((photo: any) => {
        if (photo && (photo.url || typeof photo === 'string')) {
          result.push({
            url: typeof photo === 'string' ? photo : photo.url,
            category: 'bathroom',
            isPrimary: false,
            caption: typeof photo === 'object' ? (photo.caption || '') : ''
          });
        }
      });
    }
    
    // Convertir amenities
    if (photos.amenities && Array.isArray(photos.amenities)) {
      photos.amenities.forEach((photo: any) => {
        if (photo && (photo.url || typeof photo === 'string')) {
          result.push({
            url: typeof photo === 'string' ? photo : photo.url,
            category: 'amenities',
            isPrimary: false,
            caption: typeof photo === 'object' ? (photo.caption || '') : ''
          });
        }
      });
    }
    
    // Convertir views
    if (photos.views && Array.isArray(photos.views)) {
      photos.views.forEach((photo: any, index: number) => {
        if (photo && (photo.url || typeof photo === 'string')) {
          let category: CategorizedPhoto['category'] = 'panoramic_view';
          
          // Déterminer le type de vue basé sur la caption
          if (typeof photo === 'object' && photo.caption) {
            const caption = photo.caption.toLowerCase();
            if (caption.includes('sea') || caption.includes('mer')) {
              category = 'sea_view';
            } else if (caption.includes('mountain') || caption.includes('montagne')) {
              category = 'mountain_view';
            }
          }
          
          result.push({
            url: typeof photo === 'string' ? photo : photo.url,
            category: category,
            isPrimary: false,
            caption: typeof photo === 'object' ? (photo.caption || '') : ''
          });
        }
      });
    }
    
    // Convertir balcony
    if (photos.balcony && Array.isArray(photos.balcony)) {
      photos.balcony.forEach((photo: any) => {
        if (photo && (photo.url || typeof photo === 'string')) {
          result.push({
            url: typeof photo === 'string' ? photo : photo.url,
            category: 'balcony',
            isPrimary: false,
            caption: typeof photo === 'object' ? (photo.caption || '') : ''
          });
        }
      });
    }
    
    // Convertir garden
    if (photos.garden && Array.isArray(photos.garden)) {
      photos.garden.forEach((photo: any) => {
        if (photo && (photo.url || typeof photo === 'string')) {
          result.push({
            url: typeof photo === 'string' ? photo : photo.url,
            category: 'garden',
            isPrimary: false,
            caption: typeof photo === 'object' ? (photo.caption || '') : ''
          });
        }
      });
    }
    
    // Convertir plans
    if (photos.plans && Array.isArray(photos.plans)) {
      photos.plans.forEach((photo: any) => {
        if (photo && (photo.url || typeof photo === 'string')) {
          result.push({
            url: typeof photo === 'string' ? photo : photo.url,
            category: 'plans',
            isPrimary: false,
            caption: typeof photo === 'object' ? (photo.caption || '') : ''
          });
        }
      });
    }
    
    console.log('✅ Photos converted to categorized format:', result);
    return result;
  }
  
  // Si photos est une string JSON, essayer de la parser
  if (typeof photos === 'string') {
    try {
      const parsed = JSON.parse(photos);
      return convertPhotosToCategorized(parsed);
    } catch (e) {
      console.error('❌ Cannot parse photos string:', e);
      return [];
    }
  }
  
  // Par défaut, retourner un tableau vide
  console.log('⚠️ No valid photos found, returning empty array');
  return [];
}

// Fonction pour préparer les surrounding amenities
export function prepareSurroundingAmenities(amenities: any[]): any[] {
  if (!amenities || !Array.isArray(amenities)) {
    return [];
  }
  
  return amenities.filter(item => 
    item && 
    typeof item === 'object' && 
    item.name && 
    item.type
  );
}
