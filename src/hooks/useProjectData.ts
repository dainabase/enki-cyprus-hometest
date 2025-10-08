import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
  photos: any[];
  photos_categorized: {
    exterior: any[];
    interior: any[];
    aerial: any[];
    plans: any[];
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
  payment_plan_details: any;
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
  buildings: any[];
  properties: any[];
  availableUnits: any[];
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

      // Mapper project_images vers photos[] avec tri intelligent (is_primary first)
      const photosFromProjectImages = project.project_images
        ?.sort((a: any, b: any) => {
          // Primary images en premier
          if (a.is_primary && !b.is_primary) return -1;
          if (!a.is_primary && b.is_primary) return 1;
          // Sinon tri par display_order
          return (a.display_order || 0) - (b.display_order || 0);
        })
        .map((img: any) => img.url) || [];

      // Fallback vers les anciens champs JSONB pour compatibilité
      const photoGallery = photosFromProjectImages.length > 0
        ? photosFromProjectImages
        : (Array.isArray(project.photo_gallery_urls) 
            ? project.photo_gallery_urls 
            : (project.photos ? (Array.isArray(project.photos) ? project.photos : []) : []));

      const availableUnits = project.properties?.filter(
        (p: any) => p.sale_status === 'available'
      ) || [];

      const prices = project.properties?.map((p: any) => p.price_including_vat).filter(Boolean) || [];
      const priceRange = {
        min: prices.length > 0 ? Math.min(...prices) : project.price_from || 0,
        max: prices.length > 0 ? Math.max(...prices) : project.price_to || 0
      };

      const bedroomTypes = [
        ...new Set(
          project.properties?.map((p: any) => p.bedrooms_count).filter(Boolean) || []
        )
      ].sort((a, b) => a - b);

      const photos_categorized = {
        exterior: photoGallery.filter((img: any) => img.category === 'exterior' || img.type === 'exterior') || [],
        interior: photoGallery.filter((img: any) => img.category === 'interior' || img.type === 'interior') || [],
        aerial: photoGallery.filter((img: any) => img.category === 'aerial' || img.type === 'aerial') || [],
        plans: photoGallery.filter((img: any) => img.category === 'floor_plan' || img.type === 'floor_plan') || []
      };

      const amenitiesHierarchy = {
        project: project.amenities || [],
        buildings: project.buildings?.flatMap((b: any) => b.building_amenities || []) || []
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
        payment_plan_details: project.payment_plans,
        finance_available: project.financing_available,
        project_highlights: project.unique_selling_points || []
      } as ProjectData;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,  // 5 minutes - données considérées fraîches
    gcTime: 30 * 60 * 1000,    // 30 minutes - garde en cache mémoire
  });
}
