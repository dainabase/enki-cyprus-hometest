// Mapping entre l'ancien format francais et les codes anglais
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

export function convertLegacyAmenities(legacyAmenities: string[]): string[] {
  if (!legacyAmenities || !Array.isArray(legacyAmenities)) {
    return [];
  }

  return legacyAmenities
    .map(amenity => {
      if (amenity.includes('_')) {
        return amenity;
      }
      return amenitiesLegacyToCode[amenity] || amenity;
    })
    .filter(Boolean);
}

export interface CategorizedPhoto {
  url: string;
  category: 'hero' | 'exterior_1' | 'exterior_2' | 'interior_1' | 'interior_2' |
            'panoramic_view' | 'sea_view' | 'mountain_view' | 'amenities' |
            'plans' | 'kitchen' | 'bedroom' | 'bathroom' | 'balcony' | 'garden';
  isPrimary?: boolean;
  caption?: string;
}

type RawPhoto = {
  url?: string;
  category?: CategorizedPhoto['category'];
  isPrimary?: boolean;
  caption?: string;
};

type CategorizedPhotosInput = {
  exterior?: Array<string | RawPhoto>;
  interior?: Array<string | RawPhoto>;
  kitchen?: Array<string | RawPhoto>;
  bedroom?: Array<string | RawPhoto>;
  bathroom?: Array<string | RawPhoto>;
  amenities?: Array<string | RawPhoto>;
  views?: Array<string | RawPhoto>;
  balcony?: Array<string | RawPhoto>;
  garden?: Array<string | RawPhoto>;
  plans?: Array<string | RawPhoto>;
};

type PhotosInput =
  | Array<string | RawPhoto>
  | CategorizedPhotosInput
  | string
  | null
  | undefined;

function coerceToUrl(photo: string | RawPhoto): string | null {
  if (typeof photo === 'string') return photo;
  if (photo && typeof photo === 'object' && typeof photo.url === 'string') return photo.url;
  return null;
}

function coerceToCaption(photo: string | RawPhoto): string {
  if (typeof photo === 'object' && photo !== null && typeof photo.caption === 'string') {
    return photo.caption;
  }
  return '';
}

export function convertPhotosToCategorized(photos: PhotosInput): CategorizedPhoto[] {
  if (Array.isArray(photos)) {
    return photos
      .map((photo, index): CategorizedPhoto | null => {
        const url = coerceToUrl(photo);
        if (!url) return null;

        if (typeof photo === 'object' && photo !== null && photo.category) {
          return {
            url,
            category: photo.category,
            isPrimary: photo.isPrimary ?? false,
            caption: coerceToCaption(photo)
          };
        }

        return {
          url,
          category: index === 0 ? 'hero' : 'exterior_1',
          isPrimary: index === 0,
          caption: coerceToCaption(photo)
        };
      })
      .filter((p): p is CategorizedPhoto => p !== null);
  }

  if (photos && typeof photos === 'object' && !Array.isArray(photos)) {
    const result: CategorizedPhoto[] = [];

    const pushCategory = (
      list: Array<string | RawPhoto> | undefined,
      categoryResolver: (index: number) => CategorizedPhoto['category'] | null,
      isPrimaryResolver: (index: number) => boolean = () => false
    ) => {
      if (!Array.isArray(list)) return;
      list.forEach((photo, index) => {
        const url = coerceToUrl(photo);
        if (!url) return;
        const category = categoryResolver(index);
        if (!category) return;
        result.push({
          url,
          category,
          isPrimary: isPrimaryResolver(index),
          caption: coerceToCaption(photo)
        });
      });
    };

    pushCategory(
      photos.exterior,
      (i) => (i === 0 ? 'hero' : i === 1 ? 'exterior_1' : 'exterior_2'),
      (i) => i === 0
    );
    pushCategory(photos.interior, (i) => (i === 0 ? 'interior_1' : 'interior_2'));
    pushCategory(photos.kitchen, () => 'kitchen');
    pushCategory(photos.bedroom, () => 'bedroom');
    pushCategory(photos.bathroom, () => 'bathroom');
    pushCategory(photos.amenities, () => 'amenities');
    pushCategory(photos.views, (_, ) => 'panoramic_view');
    pushCategory(photos.balcony, () => 'balcony');
    pushCategory(photos.garden, () => 'garden');
    pushCategory(photos.plans, () => 'plans');

    if (Array.isArray(photos.views)) {
      const viewStart = result.length - photos.views.length;
      photos.views.forEach((photo, i) => {
        if (typeof photo !== 'object' || photo === null) return;
        const caption = (photo.caption ?? '').toLowerCase();
        const entry = result[viewStart + i];
        if (!entry) return;
        if (caption.includes('sea') || caption.includes('mer')) {
          entry.category = 'sea_view';
        } else if (caption.includes('mountain') || caption.includes('montagne')) {
          entry.category = 'mountain_view';
        }
      });
    }

    return result;
  }

  if (typeof photos === 'string') {
    try {
      const parsed = JSON.parse(photos) as PhotosInput;
      return convertPhotosToCategorized(parsed);
    } catch {
      return [];
    }
  }

  return [];
}

export interface SurroundingAmenity {
  name: string;
  type: string;
  distance?: number | string;
  unit?: string;
}

export function prepareSurroundingAmenities(amenities: unknown[]): SurroundingAmenity[] {
  if (!amenities || !Array.isArray(amenities)) {
    return [];
  }

  return amenities.filter((item): item is SurroundingAmenity => {
    return (
      typeof item === 'object' &&
      item !== null &&
      'name' in item &&
      'type' in item &&
      typeof (item as SurroundingAmenity).name === 'string' &&
      typeof (item as SurroundingAmenity).type === 'string'
    );
  });
}
