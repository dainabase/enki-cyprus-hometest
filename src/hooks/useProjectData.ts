import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

type ProjectImage = {
  url: string;
  is_primary: boolean | null;
  display_order: number | null;
  caption: string | null;
};

type BuildingLight = {
  id: string;
  building_name: string | null;
  building_amenities?: unknown;
};

type PropertyLight = {
  id: string;
  property_type: string | null;
  property_sub_type: string | null;
  bedrooms_count: number | null;
  bathrooms_count: number | null;
  internal_area: number | null;
  total_covered_area: number | null;
  price_excluding_vat: number | null;
  price_including_vat: number | null;
  sale_status: string | null;
  floor_number: number | null;
  has_sea_view: boolean | null;
};

type CategorizedPhoto = {
  url?: string;
  category?: string;
  type?: string;
};

export interface ProjectData {
  id: string;
  title: string;
  slug: string;
  description: string;
  detailed_description: string;
  city: string;
  region: string;
  full_address: string;
  latitude: number;
  longitude: number;
  hero_image: string;
  photos: string[];
  photos_categorized: {
    exterior: CategorizedPhoto[];
    interior: CategorizedPhoto[];
    aerial: CategorizedPhoto[];
    plans: CategorizedPhoto[];
  };
  price_from: number;
  price_to: number;
  units_available: number;
  total_units: number;
  completion_month: string;
  golden_visa_eligible: boolean;
  living_area_from: number;
  living_area_to: number;
  energy_rating: string;
  virtual_tour_url?: string;
  payment_plan_details: Record<string, unknown> | null;
  finance_available: boolean;
  proximity_sea_km: number;
  proximity_airport_km: number;
  proximity_city_center_km: number;
  proximity_highway_km: number;
  project_highlights: string[];
  architecture_style?: string;
  lifestyle_amenities: string[];
  surrounding_amenities: string[];
  property_category: string;
  meta_description: string;
  developer: {
    id: string;
    name: string;
    logo_url?: string;
    description?: string;
    rating_score: number;
    completed_projects_count?: number;
  };
  buildings: BuildingLight[];
  properties: PropertyLight[];
  availableUnits: PropertyLight[];
  priceRange: {
    min: number;
    max: number;
  };
  bedroomTypes: number[];
  amenitiesHierarchy: {
    project: string[];
    buildings: string[];
  };
}

export function useProjectData(slug: string) {
  return useQuery<ProjectData>({
    queryKey: ['project', slug],
    queryFn: async () => {
      const { data: project, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_images(url, is_primary, display_order, caption),
          developer:developers(
            id,
            name,
            logo,
            rating_score
          ),
          buildings:buildings(
            id,
            building_name
          ),
          properties:properties(
            id,
            property_type,
            property_sub_type,
            bedrooms_count,
            bathrooms_count,
            internal_area,
            total_covered_area,
            price_excluding_vat,
            price_including_vat,
            sale_status,
            floor_number,
            has_sea_view
          )
        `)
        .eq('url_slug', slug)
        .maybeSingle();

      if (error) throw error;
      if (!project) throw new Error('Project not found');

      const projectImages = (project.project_images ?? []) as ProjectImage[];
      const photosFromProjectImages = [...projectImages]
        .sort((a, b) => {
          if (a.is_primary && !b.is_primary) return -1;
          if (!a.is_primary && b.is_primary) return 1;
          return (a.display_order ?? 0) - (b.display_order ?? 0);
        })
        .map((img) => img.url);

      const photoGalleryRaw = Array.isArray(project.photo_gallery_urls)
        ? (project.photo_gallery_urls as unknown[])
        : Array.isArray(project.photos)
          ? (project.photos as unknown[])
          : [];

      const photoGallery: string[] = photosFromProjectImages.length > 0
        ? photosFromProjectImages
        : photoGalleryRaw.filter((x): x is string => typeof x === 'string');

      const photoGalleryObjects = photoGalleryRaw.filter(
        (x): x is CategorizedPhoto => typeof x === 'object' && x !== null
      );

      const projectProperties = (project.properties ?? []) as PropertyLight[];
      const projectBuildings = (project.buildings ?? []) as BuildingLight[];

      const availableUnits = projectProperties.filter(
        (p) => p.sale_status === 'available'
      );

      const prices = projectProperties
        .map((p) => p.price_including_vat)
        .filter((v): v is number => typeof v === 'number' && v > 0);

      const priceRange = {
        min: prices.length > 0 ? Math.min(...prices) : project.price_from ?? 0,
        max: prices.length > 0 ? Math.max(...prices) : project.price_to ?? 0
      };

      const bedroomTypes = [
        ...new Set(
          projectProperties
            .map((p) => p.bedrooms_count)
            .filter((v): v is number => typeof v === 'number')
        )
      ].sort((a, b) => a - b);

      const photos_categorized = {
        exterior: photoGalleryObjects.filter((img) => img.category === 'exterior' || img.type === 'exterior'),
        interior: photoGalleryObjects.filter((img) => img.category === 'interior' || img.type === 'interior'),
        aerial: photoGalleryObjects.filter((img) => img.category === 'aerial' || img.type === 'aerial'),
        plans: photoGalleryObjects.filter((img) => img.category === 'floor_plan' || img.type === 'floor_plan')
      };

      const projectAmenities = Array.isArray(project.amenities)
        ? (project.amenities as unknown[]).filter((x): x is string => typeof x === 'string')
        : [];

      const buildingAmenities = projectBuildings
        .flatMap((b) => Array.isArray(b.building_amenities) ? (b.building_amenities as unknown[]) : [])
        .filter((x): x is string => typeof x === 'string');

      const amenitiesHierarchy = {
        project: projectAmenities,
        buildings: buildingAmenities
      };

      return {
        ...project,
        latitude: project.gps_latitude,
        longitude: project.gps_longitude,
        hero_image: photoGallery[0] || '/placeholder.svg',
        photos: photoGallery,
        photos_categorized,
        availableUnits,
        priceRange,
        bedroomTypes,
        amenitiesHierarchy,
        units_available: availableUnits.length,
        slug: project.url_slug,
        living_area_from: project.square_meters_min,
        living_area_to: project.square_meters_max,
        energy_rating: project.energy_efficiency_class,
        payment_plan_details: project.payment_plans as Record<string, unknown> | null,
        finance_available: project.financing_available,
        project_highlights: Array.isArray(project.unique_selling_points)
          ? (project.unique_selling_points as unknown[]).filter((x): x is string => typeof x === 'string')
          : []
      } as unknown as ProjectData;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
