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

interface MutationOptions<TData, TError, TVariables> {
  queryKeysToInvalidate?: (string | (string | number | object)[])[];
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: TError, variables: TVariables) => void;
}

export function useSupabaseMutation<TData = unknown, TError = Error, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: MutationOptions<TData, TError, TVariables>
) {
  const queryClient = useQueryClient();
  const { queryKeysToInvalidate, ...restOptions } = options || {};

  return useMutation({
    mutationFn,
    onSuccess: (data, variables) => {
      // Invalidate specific queries if provided
      if (queryKeysToInvalidate && queryKeysToInvalidate.length > 0) {
        queryKeysToInvalidate.forEach(key => {
          const queryKey = Array.isArray(key) ? key : [key];
          queryClient.invalidateQueries({ queryKey });
        });
      }
      // Call custom onSuccess if provided
      restOptions.onSuccess?.(data, variables);
    },
    ...restOptions
  });
}

// Helper function for pagination
export function getPaginationRange(pagination: { pageIndex: number; pageSize: number }) {
  const from = pagination.pageIndex * pagination.pageSize;
  const to = from + pagination.pageSize - 1;
  return { from, to };
}