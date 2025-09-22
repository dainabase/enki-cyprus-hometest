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

// Fonction pour convertir les photos simples en format catégorisé
export function convertPhotosToCategorized(photos: string[] | any): any {
  // Si c'est déjà un objet catégorisé, on le retourne
  if (photos && typeof photos === 'object' && !Array.isArray(photos)) {
    return photos;
  }
  
  // Si c'est un array de strings (ancien format)
  if (Array.isArray(photos) && photos.length > 0 && typeof photos[0] === 'string') {
    return {
      exterior: photos.map((url, index) => ({
        url,
        caption: `Photo ${index + 1}`,
        is_primary: index === 0
      }))
    };
  }
  
  // Si c'est un array d'objets avec url
  if (Array.isArray(photos) && photos.length > 0 && typeof photos[0] === 'object') {
    return {
      exterior: photos.filter(p => p && p.url)
    };
  }
  
  return {
    exterior: [],
    interior: [],
    amenities: [],
    views: [],
    plans: []
  };
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
