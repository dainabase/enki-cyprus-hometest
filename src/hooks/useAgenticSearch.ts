import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { trackCustomEvent } from '@/lib/analytics';
import { AgenticSearchResult } from '@/types/search.types';

interface UseAgenticSearchProps {
  onSuccess?: (data: AgenticSearchResult) => void;
  onError?: (error: Error) => void;
}

export const useAgenticSearch = ({ onSuccess, onError }: UseAgenticSearchProps = {}) => {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async ({ query, consent }: { query: string; consent: boolean }) => {
      const { data, error } = await supabase.functions.invoke('agentic-search', {
        body: { query, consent }
      });
      if (error) throw error;
      return data as AgenticSearchResult;
    },
    onSuccess: (data) => {
      toast({
        title: "Recherche complétée",
        description: `${data.properties?.length || 0} propriétés trouvées avec analyse fiscale`,
        variant: "default",
      });
      trackCustomEvent('agentic_search_completed', {
        properties_found: data.properties?.length || 0,
      });
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la recherche. Veuillez réessayer.",
        variant: "destructive",
      });
      onError?.(error);
    },
  });

  return mutation;
};
