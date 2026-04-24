import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { ProjectUnitType } from '@/types/property';

export function useProjectTypologies(projectId: string) {
  return useQuery({
    queryKey: ['project-typologies', projectId],
    queryFn: async () => {
      // Return empty array for non-existent table
      return [] as any[];
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
}
