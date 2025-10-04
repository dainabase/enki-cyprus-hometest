-- Migration: 002 - Add investment and financing fields to projects
-- Priority: P0 - CRITICAL for Section 7 (Financing)
-- Date: 2025-01-04

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS rental_price_monthly_estimate NUMERIC,
ADD COLUMN IF NOT EXISTS appreciation_historical_percent NUMERIC,
ADD COLUMN IF NOT EXISTS golden_visa_details JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS tax_benefits JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS financing_options JSONB DEFAULT '{}'::jsonb;

-- Add comments
COMMENT ON COLUMN projects.rental_price_monthly_estimate IS 'Estimation loyer mensuel pour calcul rendement';
COMMENT ON COLUMN projects.appreciation_historical_percent IS 'Appréciation moyenne annuelle zone (historique 5 ans)';
COMMENT ON COLUMN projects.golden_visa_details IS 'JSON: {minimumInvestment, benefits[], requirements[], processingTime, applicationFee}';
COMMENT ON COLUMN projects.tax_benefits IS 'JSON array: [{type, description, savingEstimate%}]';
COMMENT ON COLUMN projects.financing_options IS 'JSON: {partners[], downPaymentMin%, flexiblePayment}';

-- Example data structure for golden_visa_details
COMMENT ON COLUMN projects.golden_visa_details IS '
Structure JSON exemple:
{
  "minimumInvestment": 300000,
  "eligible": true,
  "benefits": [
    "Résidence permanente UE pour toute la famille",
    "Liberté circulation Espace Schengen"
  ],
  "requirements": [
    "Achat immobilier minimum €300,000",
    "Visite Cyprus tous les 2 ans"
  ],
  "processingTime": "2-3 mois",
  "applicationFee": 500
}';

-- Example data structure for tax_benefits
COMMENT ON COLUMN projects.tax_benefits IS '
Structure JSON exemple:
[
  {
    "type": "Plus-value",
    "description": "Exonération totale si détention >5 ans",
    "savingEstimate": 20
  },
  {
    "type": "Revenus locatifs",
    "description": "Imposition 20% flat (vs 45% France)",
    "savingEstimate": 25
  }
]';

DO $$
BEGIN
  RAISE NOTICE '✅ Migration 002 completed: Investment fields added to projects';
END $$;