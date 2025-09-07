import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useSupabaseQuery<TData = any, TError = Error>(
  key: (string | number | object)[],
  query: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: key,
    queryFn: query,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    ...options
  });
}

export function useSupabaseMutation<TData = any, TError = Error, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: any
) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn,
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries();
    },
    ...options
  });
}

// Helper function for pagination
export function getPaginationRange(pagination: { pageIndex: number; pageSize: number }) {
  const from = pagination.pageIndex * pagination.pageSize;
  const to = from + pagination.pageSize - 1;
  return { from, to };
}