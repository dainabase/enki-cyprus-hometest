import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { calculateKPIs, type DashboardKPIs } from '@/lib/dashboard/calculations';

interface UseMetricsOptions {
  period?: 'day' | 'week' | 'month' | 'year';
  zone?: 'all' | 'limassol' | 'paphos' | 'larnaca' | 'nicosia';
}

const fetchDashboardMetrics = async (options: UseMetricsOptions = {}): Promise<DashboardKPIs> => {
  const { period = 'month', zone = 'all' } = options;
  
  // Calculate date range
  const endDate = new Date();
  const startDate = new Date();
  
  switch (period) {
    case 'day':
      startDate.setDate(endDate.getDate() - 1);
      break;
    case 'week':
      startDate.setDate(endDate.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(endDate.getMonth() - 1);
      break;
    case 'year':
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
  }
  
  // Build zone filter
  let zoneFilter = {};
  if (zone !== 'all') {
    zoneFilter = { cyprus_zone: zone };
  }
  
  try {
    console.log('🔍 Fetching dashboard metrics with options:', options);
    
    // Fetch all data in parallel
    const [propertiesResult, leadsResult, commissionsResult] = await Promise.all([
      supabase
        .from('projects')
        .select(`
          id,
          price_from,
          price_to,
          status,
          golden_visa_eligible,
          created_at,
          updated_at,
          built_area_m2,
          vat_rate,
          commission_rate,
          cyprus_zone
        `)
        .match(zoneFilter),
      
      supabase
        .from('leads')
        .select(`
          id,
          status,
          created_at,
          budget_max,
          golden_visa_interest
        `)
        .gte('created_at', startDate.toISOString()),
      
      supabase
        .from('commissions')
        .select(`
          id,
          amount,
          status,
          created_at
        `)
        .gte('created_at', startDate.toISOString())
    ]);
    
    console.log('📊 Raw data fetched:', { 
      properties: propertiesResult.data?.length || 0, 
      leads: leadsResult.data?.length || 0, 
      commissions: commissionsResult.data?.length || 0 
    });
    
    if (propertiesResult.error) throw propertiesResult.error;
    if (leadsResult.error) throw leadsResult.error;
    if (commissionsResult.error) throw commissionsResult.error;
    
    // Calculate KPIs
    const calculatedMetrics = calculateKPIs(
      (propertiesResult.data || []) as any[],
      leadsResult.data || [],
      commissionsResult.data || []
    );
    
    console.log('📈 Calculated metrics:', calculatedMetrics);
    
    return calculatedMetrics;
    
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    throw error;
  }
};

export const useDashboardMetrics = (options: UseMetricsOptions = {}) => {
  return useQuery({
    queryKey: ['dashboard-metrics', options],
    queryFn: () => fetchDashboardMetrics(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true,
    refetchInterval: 30 * 1000, // 30 seconds for real-time updates
  });
};