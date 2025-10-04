import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { ProjectFinancing } from '@/types/financing';

export function useProjectFinancing(projectId: string) {
  return useQuery({
    queryKey: ['project-financing', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          rental_price_monthly,
          rental_yield_percentage,
          capital_appreciation_5y,
          cap_rate,
          cash_on_cash_return,
          golden_visa_details,
          tax_benefits,
          financing_options
        `)
        .eq('id', projectId)
        .maybeSingle();

      if (error) throw error;

      return data as ProjectFinancing | null;
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  });
}
