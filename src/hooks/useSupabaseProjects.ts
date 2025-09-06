import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseProjectsOptions {
  propertyType?: string;
  budgetMin?: number;
  budgetMax?: number;
  location?: string;
}

export const useSupabaseProjects = (options: UseProjectsOptions = {}) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize the query key to prevent unnecessary re-fetches
  const queryKey = useMemo(() => 
    JSON.stringify(options), 
    [options.propertyType, options.budgetMin, options.budgetMax, options.location]
  );

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from('projects').select('*');

      // Filtrage par type
      console.log('🔍 Filter options:', options);
      if (options.propertyType && options.propertyType !== 'Tous') {
        query = query.eq('type', options.propertyType);
      }

      // Filtrage par budget
      if (options.budgetMin !== undefined) {
        query = query.gte('price', options.budgetMin);
      }
      if (options.budgetMax !== undefined) {
        query = query.lte('price', options.budgetMax);
      }

      // Filtrage par localisation
      if (options.location) {
        query = query.ilike('location->city', `%${options.location}%`);
      }

      const { data, error: supabaseError } = await query.order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      console.log('📊 Raw data from Supabase:', data?.length, 'projects');
      setProjects(data || []);
    } catch (err) {
      console.error('❌ Erreur lors du chargement des projets:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [queryKey]);

  useEffect(() => {
    fetchProjects();
  }, [queryKey, fetchProjects]);

  return { projects, loading, error, refetch: fetchProjects };
};

export const useSupabaseProject = (id: string | undefined) => {
  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();

        if (supabaseError) {
          throw supabaseError;
        }

        setProject(data);
      } catch (err) {
        console.error('Erreur lors du chargement du projet:', err);
        setError(err instanceof Error ? err.message : 'Projet non trouvé');
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  return { project, loading, error };
};

// Hook de compatibilité pour l'ancien code
export const useSupabaseProperties = (options: UseProjectsOptions = {}) => {
  const { projects, loading, error, refetch } = useSupabaseProjects(options);
  
  return {
    properties: projects,
    loading,
    error,
    refetch
  };
};

export const useSupabaseProperty = (id: string | undefined) => {
  const { project, loading, error } = useSupabaseProject(id);
  
  return {
    property: project,
    loading,
    error
  };
};