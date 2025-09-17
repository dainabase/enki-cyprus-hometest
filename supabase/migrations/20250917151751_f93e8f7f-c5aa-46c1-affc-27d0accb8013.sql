-- Migration: Add financial and Golden Visa fields to properties table
-- Ajoute tous les champs financiers avec calculs automatiques

-- SECTION 8A: PRIX ET TVA
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS vat_rate DECIMAL(5, 2) DEFAULT 5.00 CHECK (vat_rate IN (5.00, 19.00, 0)),
ADD COLUMN IF NOT EXISTS vat_amount DECIMAL(12, 2) GENERATED ALWAYS AS (
  COALESCE(price_excluding_vat, 0) * COALESCE(vat_rate, 0) / 100
) STORED,
ADD COLUMN IF NOT EXISTS price_including_vat DECIMAL(12, 2) GENERATED ALWAYS AS (
  COALESCE(price_excluding_vat, 0) + (COALESCE(price_excluding_vat, 0) * COALESCE(vat_rate, 0) / 100)
) STORED,
ADD COLUMN IF NOT EXISTS price_per_sqm DECIMAL(10, 2) GENERATED ALWAYS AS (
  CASE 
    WHEN COALESCE(internal_area, 0) > 0 THEN COALESCE(price_excluding_vat, 0) / internal_area
    ELSE NULL
  END
) STORED,
ADD COLUMN IF NOT EXISTS original_price DECIMAL(12, 2),
ADD COLUMN IF NOT EXISTS current_price DECIMAL(12, 2),
ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(12, 2),
ADD COLUMN IF NOT EXISTS discount_percentage DECIMAL(5, 2);

-- SECTION 8B: GOLDEN VISA
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS golden_visa_eligible BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS investment_type VARCHAR(50) DEFAULT 'residential' CHECK (investment_type IN (
  'residential', 'commercial', 'mixed'
)),
ADD COLUMN IF NOT EXISTS minimum_investment_met BOOLEAN DEFAULT FALSE;

-- SECTION 8C: COMMISSIONS
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS commission_rate DECIMAL(5, 2) DEFAULT 5.00,
ADD COLUMN IF NOT EXISTS commission_amount DECIMAL(12, 2) GENERATED ALWAYS AS (
  COALESCE(price_excluding_vat, 0) * COALESCE(commission_rate, 0) / 100
) STORED,
ADD COLUMN IF NOT EXISTS referral_commission DECIMAL(12, 2),
ADD COLUMN IF NOT EXISTS referral_commission_rate DECIMAL(5, 2);

-- SECTION 8D: CONDITIONS DE PAIEMENT
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS payment_plan_available BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS payment_plan_details JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS deposit_amount DECIMAL(12, 2),
ADD COLUMN IF NOT EXISTS deposit_percentage DECIMAL(5, 2) DEFAULT 30.00,
ADD COLUMN IF NOT EXISTS reservation_fee DECIMAL(12, 2) DEFAULT 5000.00,
ADD COLUMN IF NOT EXISTS finance_available BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS minimum_cash_required DECIMAL(12, 2);

-- SECTION 9: DOCUMENTS LÉGAUX
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS title_deed_status VARCHAR(50) DEFAULT 'pending' CHECK (title_deed_status IN (
  'available', 'pending', 'in_process', 'transferred'
)),
ADD COLUMN IF NOT EXISTS planning_permit_number VARCHAR(100),
ADD COLUMN IF NOT EXISTS building_permit_number VARCHAR(100),
ADD COLUMN IF NOT EXISTS occupancy_certificate VARCHAR(100),
ADD COLUMN IF NOT EXISTS energy_certificate_number VARCHAR(100),
ADD COLUMN IF NOT EXISTS energy_rating VARCHAR(10) CHECK (energy_rating IN (
  'A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'
));

-- SECTION 9B: CHARGES ET TAXES
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS annual_property_tax DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS communal_fees_monthly DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS maintenance_fee_monthly DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS estimated_utility_costs DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS transfer_fee_percentage DECIMAL(5, 2) DEFAULT 3.00,
ADD COLUMN IF NOT EXISTS transfer_fee_amount DECIMAL(12, 2) GENERATED ALWAYS AS (
  COALESCE(price_excluding_vat, 0) * COALESCE(transfer_fee_percentage, 0) / 100
) STORED;

-- Trigger pour calculer automatiquement Golden Visa eligibility
CREATE OR REPLACE FUNCTION public.check_golden_visa_eligibility()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  -- Golden Visa eligible si prix TTC >= 300,000€
  NEW.golden_visa_eligible = (
    COALESCE(NEW.price_excluding_vat, 0) + 
    (COALESCE(NEW.price_excluding_vat, 0) * COALESCE(NEW.vat_rate, 0) / 100)
  ) >= 300000;
  
  NEW.minimum_investment_met = NEW.golden_visa_eligible;
  
  -- Mettre à jour current_price si non défini
  IF NEW.current_price IS NULL THEN
    NEW.current_price = NEW.price_excluding_vat;
  END IF;
  
  -- Calculer le discount si applicable
  IF NEW.original_price IS NOT NULL AND NEW.original_price > 0 AND NEW.price_excluding_vat IS NOT NULL THEN
    NEW.discount_amount = NEW.original_price - NEW.price_excluding_vat;
    NEW.discount_percentage = ((NEW.original_price - NEW.price_excluding_vat) / NEW.original_price) * 100;
  END IF;
  
  -- Calculer le dépôt si pourcentage défini
  IF NEW.deposit_percentage IS NOT NULL AND NEW.price_excluding_vat IS NOT NULL THEN
    NEW.deposit_amount = NEW.price_excluding_vat * NEW.deposit_percentage / 100;
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS check_golden_visa_trigger ON public.properties;
CREATE TRIGGER check_golden_visa_trigger
  BEFORE INSERT OR UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.check_golden_visa_eligibility();

-- Fonction pour valider le payment_plan_details JSONB
CREATE OR REPLACE FUNCTION public.validate_payment_plan()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  -- Si payment_plan_available est true, vérifier que payment_plan_details contient des données
  IF NEW.payment_plan_available = TRUE AND 
     (NEW.payment_plan_details IS NULL OR NEW.payment_plan_details = '{}'::jsonb) THEN
    RAISE WARNING 'Payment plan enabled but no details provided';
  END IF;
  
  -- Valider que payment_plan_details est un objet JSON valide
  IF NEW.payment_plan_details IS NOT NULL AND jsonb_typeof(NEW.payment_plan_details) != 'object' THEN
    RAISE EXCEPTION 'payment_plan_details must be a JSON object';
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_payment_plan_trigger ON public.properties;
CREATE TRIGGER validate_payment_plan_trigger
  BEFORE INSERT OR UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_payment_plan();

-- Index pour recherches financières
CREATE INDEX IF NOT EXISTS idx_properties_golden_visa ON public.properties(golden_visa_eligible) 
  WHERE golden_visa_eligible = TRUE;
CREATE INDEX IF NOT EXISTS idx_properties_price_range ON public.properties(price_including_vat);
CREATE INDEX IF NOT EXISTS idx_properties_payment_plan ON public.properties(payment_plan_available) 
  WHERE payment_plan_available = TRUE;
CREATE INDEX IF NOT EXISTS idx_properties_title_deed ON public.properties(title_deed_status);
CREATE INDEX IF NOT EXISTS idx_properties_energy_rating ON public.properties(energy_rating);

-- Contraintes supplémentaires pour cohérence financière
DO $$
BEGIN
  -- Contraintes sur les prix
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'check_financial_coherence' 
    AND table_name = 'properties'
  ) THEN
    ALTER TABLE public.properties 
    ADD CONSTRAINT check_financial_coherence CHECK (
      (original_price IS NULL OR original_price >= 0) AND
      (current_price IS NULL OR current_price >= 0) AND
      (discount_amount IS NULL OR discount_amount >= 0) AND
      (discount_percentage IS NULL OR (discount_percentage >= 0 AND discount_percentage <= 100)) AND
      (deposit_amount IS NULL OR deposit_amount >= 0) AND
      (deposit_percentage IS NULL OR (deposit_percentage >= 0 AND deposit_percentage <= 100)) AND
      (commission_rate IS NULL OR (commission_rate >= 0 AND commission_rate <= 50)) AND
      (transfer_fee_percentage IS NULL OR (transfer_fee_percentage >= 0 AND transfer_fee_percentage <= 20))
    );
  END IF;
END $$;

-- Commentaires pour documentation
COMMENT ON COLUMN public.properties.vat_rate IS 'Taux TVA: 5% résidentiel, 19% commercial, 0% exemption';
COMMENT ON COLUMN public.properties.golden_visa_eligible IS 'Automatiquement TRUE si prix TTC >= 300,000€';
COMMENT ON COLUMN public.properties.payment_plan_details IS 'JSON détaillant les modalités de paiement échelonné (ex: {"installments": 24, "initial_payment": 50000})';
COMMENT ON COLUMN public.properties.transfer_fee_percentage IS 'Frais de transfert Chypre: 3-8% selon la valeur';
COMMENT ON COLUMN public.properties.commission_rate IS 'Taux de commission agence (généralement 5% à Chypre)';
COMMENT ON COLUMN public.properties.price_including_vat IS 'Prix TTC calculé automatiquement (prix HT + TVA)';
COMMENT ON COLUMN public.properties.price_per_sqm IS 'Prix par m² calculé automatiquement (prix HT / surface)';
COMMENT ON COLUMN public.properties.commission_amount IS 'Montant commission calculé automatiquement';
COMMENT ON COLUMN public.properties.transfer_fee_amount IS 'Frais de transfert calculés automatiquement';
COMMENT ON COLUMN public.properties.investment_type IS 'Type d''investissement pour Golden Visa: residential, commercial, mixed';
COMMENT ON COLUMN public.properties.minimum_investment_met IS 'Seuil minimum Golden Visa atteint (≥300k€)';