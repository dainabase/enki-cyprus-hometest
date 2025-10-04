import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { ProjectUnitType } from '@/types/property';

export function useProjectTypologies(projectId: string) {
  return useQuery({
    queryKey: ['project-typologies', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_unit_types')
        .select('*')
        .eq('project_id', projectId)
        .order('property_type')
        .order('bedrooms_count');

      if (error) throw error;
      return data as ProjectUnitType[];
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
}
