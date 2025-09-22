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
    
    // Fetch all data in parallel - CORRECTING FIELD NAMES
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
    
    if (propertiesResult.error) {
      console.error('Properties error:', propertiesResult.error);
      throw propertiesResult.error;
    }
    if (leadsResult.error) {
      console.error('Leads error:', leadsResult.error);
      throw leadsResult.error;
    }
    if (commissionsResult.error) {
      console.error('Commissions error:', commissionsResult.error);
      throw commissionsResult.error;
    }
    
    // Transform properties data to match expected format
    const transformedProperties = (propertiesResult.data || []).map((p: any) => ({
      ...p,
      price: p.price_from || p.price_to || 0, // Use price_from or price_to as price
      commission_rate: 3.5 // Default commission rate since it's not in projects table
    }));
    
    // Calculate KPIs with transformed data
    const calculatedMetrics = calculateKPIs(
      transformedProperties,
      leadsResult.data || [],
      commissionsResult.data || []
    );
    
    console.log('📈 Calculated metrics:', calculatedMetrics);
    
    return calculatedMetrics;
    
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    // Return default metrics to prevent crashes
    return {
      totalProperties: 0,
      goldenVisaProperties: 0,
      goldenVisaPercentage: 0,
      availableProperties: 0,
      soldProperties: 0,
      totalRevenue: 0,
      averagePricePerSqm: 0,
      totalCommissions: 0,
      averageCommissionRate: 3.5,
      averageDaysOnMarket: 0,
      conversionRate: 0,
      propertiesSoldThisMonth: 0,
      vatCollected5Percent: 0,
      vatCollected19Percent: 0,
      transferFeesTotal: 0,
      limassol: 0,
      paphos: 0,
      larnaca: 0,
      nicosia: 0
    };
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
    retry: 2, // Retry twice on failure
    retryDelay: 1000 // Wait 1 second before retry
  });
};
