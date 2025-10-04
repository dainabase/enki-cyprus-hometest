export interface GoldenVisaDetails {
  minimum_investment: number;
  benefits: string[];
  processing_time: string;
  fees: string;
  requirements: string[];
}

export interface TaxBenefit {
  vat_new_property: number;
  vat_resale: number;
  corporate_tax: number;
  inheritance_tax: number;
  wealth_tax: number;
  tax_treaties: number;
  non_dom_benefits: string[];
}

export interface BankFinancing {
  bank_name: string;
  bank_logo?: string;
  interest_rate_from: number;
  interest_rate_to: number;
  ltv_max: number;
  duration_years: number;
  requirements: string[];
  type: 'local' | 'international';
}

export interface FinancingOptions {
  banks: BankFinancing[];
  minimum_deposit: number;
  typical_interest_rate: number;
}

export interface ProjectFinancing {
  rental_price_monthly: number | null;
  rental_yield_percentage: number | null;
  capital_appreciation_5y: number | null;
  cap_rate: number | null;
  cash_on_cash_return: number | null;
  golden_visa_details: GoldenVisaDetails | null;
  tax_benefits: TaxBenefit | null;
  financing_options: FinancingOptions | null;
}
