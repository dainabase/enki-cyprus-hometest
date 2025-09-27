import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useProjectBuildings = (projectId: string | undefined) => {
  return useQuery({
    queryKey: ['project-buildings', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      
      // Utilisation de la vue buildings_with_project_info pour éviter les problèmes de cache
      // et avoir accès à construction_year du projet parent
      const { data, error } = await supabase
        .from('buildings_with_project_info')
        .select('*')
        .eq('project_id', projectId)
        .order('display_order', { ascending: true });
      
      if (error) {
        console.error('Erreur lors de la récupération des bâtiments:', error);
        // Fallback sur la table buildings directement si la vue n'est pas disponible
        const fallbackQuery = await supabase
          .from('buildings')
          .select('*')
          .eq('project_id', projectId)
          .order('display_order', { ascending: true });
          
        if (fallbackQuery.error) throw fallbackQuery.error;
        return fallbackQuery.data || [];
      }
      
      return data || [];
    },
    enabled: !!projectId,
    staleTime: 5000, // Cache pour 5 secondes
    refetchOnWindowFocus: true
  });
};
