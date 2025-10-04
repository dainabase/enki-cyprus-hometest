-- Migration: 004 - Add developer stats and credibility fields
-- Priority: P0 - CRITICAL for Section 10 (Social Proof)
-- Date: 2025-01-04

ALTER TABLE developers
ADD COLUMN IF NOT EXISTS revenue_annual BIGINT,
ADD COLUMN IF NOT EXISTS employees_count INTEGER,
ADD COLUMN IF NOT EXISTS families_satisfied INTEGER,
ADD COLUMN IF NOT EXISTS units_built INTEGER,
ADD COLUMN IF NOT EXISTS satisfaction_rate NUMERIC(4,2);

-- Add comments
COMMENT ON COLUMN developers.revenue_annual IS 'CA annuel (€) pour crédibilité financière';
COMMENT ON COLUMN developers.employees_count IS 'Nombre employés équipe';
COMMENT ON COLUMN developers.families_satisfied IS 'Nombre familles ayant acheté (social proof)';
COMMENT ON COLUMN developers.units_built IS 'Nombre unités construites total historique';
COMMENT ON COLUMN developers.satisfaction_rate IS 'Taux satisfaction client % (0-100)';

DO $$
BEGIN
  RAISE NOTICE '✅ Migration 004 completed: Developer stats added';
END $$;