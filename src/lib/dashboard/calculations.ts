export interface DashboardKPIs {
  // Inventory Metrics
  totalProperties: number;
  goldenVisaProperties: number;
  goldenVisaPercentage: number;
  availableProperties: number;
  soldProperties: number;
  
  // Financial Metrics
  totalRevenue: number;
  averagePricePerSqm: number;
  totalCommissions: number;
  averageCommissionRate: number;
  
  // Performance Metrics
  averageDaysOnMarket: number;
  conversionRate: number;
  propertiesSoldThisMonth: number;
  
  // Cyprus Specific
  vatCollected5Percent: number;
  vatCollected19Percent: number;
  transferFeesTotal: number;
  
  // Zone Distribution
  limassol: number;
  paphos: number;
  larnaca: number;
  nicosia: number;
}

export interface PropertyData {
  id: string;
  price: number;
  status: string;
  golden_visa_eligible: boolean;
  created_at: string;
  updated_at?: string;
  built_area_m2?: number;
  vat_rate?: number;
  commission_rate?: number;
  cyprus_zone?: string;
  transfer_fee?: number;
}

export interface LeadData {
  id: string;
  status: string;
  created_at: string;
  budget_max?: number;
  golden_visa_interest?: boolean;
}

export interface CommissionData {
  id: string;
  amount: number;
  status: string;
  created_at: string;
}

export const calculateKPIs = (
  properties: PropertyData[] = [],
  leads: LeadData[] = [],
  commissions: CommissionData[] = []
): DashboardKPIs => {
  
  // Basic counts
  const totalProperties = properties.length;
  const goldenVisaProperties = properties.filter(p => p.golden_visa_eligible).length;
  const goldenVisaPercentage = totalProperties > 0 ? (goldenVisaProperties / totalProperties) * 100 : 0;
  const availableProperties = properties.filter(p => p.status === 'available').length;
  const soldProperties = properties.filter(p => p.status === 'sold').length;
  
  // Financial calculations
  const totalRevenue = properties
    .filter(p => p.status === 'sold')
    .reduce((sum, p) => sum + (p.price || 0), 0);
  
  const totalArea = properties.reduce((sum, p) => sum + (p.built_area_m2 || 0), 0);
  const averagePricePerSqm = totalArea > 0 ? totalRevenue / totalArea : 0;
  
  const totalCommissions = commissions.reduce((sum, c) => sum + (c.amount || 0), 0);
  const validCommissionRates = properties
    .filter(p => p.commission_rate && p.commission_rate > 0)
    .map(p => p.commission_rate);
  const averageCommissionRate = validCommissionRates.length > 0 
    ? validCommissionRates.reduce((sum, rate) => sum + rate, 0) / validCommissionRates.length 
    : 3.5;
  
  // Performance metrics
  const currentMonth = new Date();
  currentMonth.setDate(1);
  const propertiesSoldThisMonth = properties.filter(p => 
    p.status === 'sold' && 
    p.updated_at && 
    new Date(p.updated_at) >= currentMonth
  ).length;
  
  const convertedLeads = leads.filter(l => l.status === 'converted').length;
  const conversionRate = leads.length > 0 ? (convertedLeads / leads.length) * 100 : 0;
  
  // Calculate average days on market (simplified)
  const soldPropertiesWithDates = properties.filter(p => 
    p.status === 'sold' && p.created_at && p.updated_at
  );
  const averageDaysOnMarket = soldPropertiesWithDates.length > 0
    ? soldPropertiesWithDates.reduce((sum, p) => {
        const daysDiff = Math.floor(
          (new Date(p.updated_at!).getTime() - new Date(p.created_at).getTime()) / (1000 * 60 * 60 * 24)
        );
        return sum + daysDiff;
      }, 0) / soldPropertiesWithDates.length
    : 0;
  
  // Cyprus-specific VAT calculations
  const soldPropertiesWithVAT = properties.filter(p => p.status === 'sold' && p.vat_rate);
  const vatCollected5Percent = soldPropertiesWithVAT
    .filter(p => p.vat_rate === 5)
    .reduce((sum, p) => sum + (p.price * 0.05), 0);
  
  const vatCollected19Percent = soldPropertiesWithVAT
    .filter(p => p.vat_rate === 19)
    .reduce((sum, p) => sum + (p.price * 0.19), 0);
  
  // Transfer fees (typically 3-8% in Cyprus)
  const transferFeesTotal = soldProperties > 0
    ? properties
        .filter(p => p.status === 'sold')
        .reduce((sum, p) => sum + (p.price * 0.05), 0) // Default 5%
    : 0;
  
  // Zone distribution
  const limassol = properties.filter(p => p.cyprus_zone === 'limassol').length;
  const paphos = properties.filter(p => p.cyprus_zone === 'paphos').length;
  const larnaca = properties.filter(p => p.cyprus_zone === 'larnaca').length;
  const nicosia = properties.filter(p => p.cyprus_zone === 'nicosia').length;
  
  return {
    totalProperties,
    goldenVisaProperties,
    goldenVisaPercentage,
    availableProperties,
    soldProperties,
    totalRevenue,
    averagePricePerSqm,
    totalCommissions,
    averageCommissionRate,
    averageDaysOnMarket,
    conversionRate,
    propertiesSoldThisMonth,
    vatCollected5Percent,
    vatCollected19Percent,
    transferFeesTotal,
    limassol,
    paphos,
    larnaca,
    nicosia
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('fr-FR').format(num);
};

export const formatPercentage = (num: number): string => {
  return `${num.toFixed(1)}%`;
};