import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useProjectBuildings = (projectId: string | undefined) => {
  return useQuery({
    queryKey: ['project-buildings', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      
      const { data, error } = await supabase
        .from('buildings')
        .select('*')
        .eq('project_id', projectId)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!projectId
  });
};