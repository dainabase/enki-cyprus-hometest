import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase, DatabaseProperty, Property, transformDatabaseProperty } from '@/lib/supabase';

interface UsePropertiesOptions {
  propertyType?: string;
  budgetMin?: number;
  budgetMax?: number;
  location?: string;
}

export const useSupabaseProperties = (options: UsePropertiesOptions = {}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize the query key to prevent unnecessary re-fetches
  const queryKey = useMemo(() => 
    JSON.stringify(options), 
    [options.propertyType, options.budgetMin, options.budgetMax, options.location]
  );

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from('projects_clean').select('*');

      // Filtrage par type avec log pour debug
      console.log('🔍 Filter options:', options);
      if (options.propertyType && options.propertyType !== 'Tous') {
        const typeMapping: { [key: string]: string[] } = {
          'Villas': ['villa'],
          'Appartements': ['apartment'],
          'Penthouses': ['penthouse'],
          'Maisons': ['maison'],
          'Commercial': ['commercial']
        };
        
        const validTypes = typeMapping[options.propertyType] || [options.propertyType.toLowerCase()];
        console.log('🎯 Filtering by types:', validTypes);
        query = query.contains('property_sub_type', validTypes);
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

      const { data, error: supabaseError } = await query;

      if (supabaseError) {
        throw supabaseError;
      }

      console.log('📊 Raw data from Supabase:', data?.length, 'properties');
      const transformedProperties = (data as unknown as DatabaseProperty[]).map(transformDatabaseProperty);
      console.log('✨ Transformed properties:', transformedProperties.length);
      setProperties(transformedProperties);
    } catch (err) {
      console.error('❌ Erreur lors du chargement des propriétés:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [queryKey]);

  useEffect(() => {
    fetchProperties();
  }, [queryKey, fetchProperties]);

  return { properties, loading, error, refetch: fetchProperties };
};

export const useSupabaseProperty = (id: string | undefined) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from('projects_clean')
          .select('*')
          .eq('id', id)
          .single();

        if (supabaseError) {
          throw supabaseError;
        }

        if (data) {
          setProperty(transformDatabaseProperty(data as unknown as DatabaseProperty));
        } else {
          setProperty(null);
        }
      } catch (err) {
        console.error('Erreur lors du chargement de la propriété:', err);
        setError(err instanceof Error ? err.message : 'Propriété non trouvée');
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  return { property, loading, error };
};