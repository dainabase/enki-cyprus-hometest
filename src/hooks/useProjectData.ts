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
  architecture_style: string;
  lifestyle_amenities: string[];
  surrounding_amenities: string[];
  property_category: string;
  meta_description: string;
  developer: {
    id: string;
    name: string;
    logo_url: string;
    description: string;
    rating_score: number;
    completed_projects_count: number;
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
          developer:developers(
            id,
            name,
            logo_url,
            description,
            rating_score,
            completed_projects_count
          ),
          buildings:buildings(
            id,
            building_name,
            energy_rating,
            building_amenities,
            building_equipments
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
            has_sea_view,
            property_images:property_images(url, category)
          ),
          project_images:project_images(
            url,
            caption,
            category,
            display_order
          )
        `)
        .eq('url_slug', slug)
        .maybeSingle();

      if (error) throw error;
      if (!project) throw new Error('Project not found');

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
        exterior: project.project_images?.filter((img: any) => img.category === 'exterior') || [],
        interior: project.project_images?.filter((img: any) => img.category === 'interior') || [],
        aerial: project.project_images?.filter((img: any) => img.category === 'aerial') || [],
        plans: project.project_images?.filter((img: any) => img.category === 'floor_plan') || []
      };

      const amenitiesHierarchy = {
        project: project.project_amenities || [],
        buildings: project.buildings?.flatMap((b: any) => b.building_amenities || []) || []
      };

      return {
        ...project,
        photos: project.project_images || [],
        photos_categorized,
        availableUnits,
        priceRange,
        bedroomTypes,
        amenitiesHierarchy,
        units_available: availableUnits.length,
        slug: project.url_slug
      } as ProjectData;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}
