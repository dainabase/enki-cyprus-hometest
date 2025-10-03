/*
  # Phase 1.2 : Calculs automatiques CASCADE (Type 2)

  ## Objectif
  Calculer automatiquement les champs financiers dérivés :
  1. vat_amount = price_excluding_vat × vat_rate / 100
  2. price_including_vat = price_excluding_vat + vat_amount
  3. commission_amount = price_including_vat × commission_rate / 100
  4. price_per_sqm = price_excluding_vat / internal_area
  5. golden_visa_eligible = (price_including_vat >= 300000)

  ## Logique
  - Trigger BEFORE INSERT/UPDATE sur tous les champs concernés
  - Calcule uniquement si les données sources sont présentes
  - Ne recalcule pas si valeur déjà présente (sauf si source change)

  ## Sécurité
  - Gère les divisions par zéro
  - Gère les valeurs NULL
  - Arrondit à 2 décimales
*/

BEGIN;

-- =====================================================
-- 1. FONCTION : Calculs automatiques financiers
-- =====================================================

CREATE OR REPLACE FUNCTION public.calculate_property_financials()
RETURNS TRIGGER AS $$
BEGIN
  -- ===== CALCUL TVA =====
  IF NEW.price_excluding_vat IS NOT NULL AND NEW.vat_rate IS NOT NULL THEN
    NEW.vat_amount := ROUND(NEW.price_excluding_vat * NEW.vat_rate / 100, 2);
    NEW.price_including_vat := ROUND(NEW.price_excluding_vat + NEW.vat_amount, 2);
  ELSIF NEW.price_excluding_vat IS NOT NULL THEN
    -- Si pas de vat_rate, considérer 0% (cas terrains)
    NEW.vat_amount := 0;
    NEW.price_including_vat := NEW.price_excluding_vat;
  END IF;

  -- ===== CALCUL COMMISSION =====
  IF NEW.price_including_vat IS NOT NULL AND NEW.commission_rate IS NOT NULL THEN
    NEW.commission_amount := ROUND(NEW.price_including_vat * NEW.commission_rate / 100, 2);
  END IF;

  -- ===== CALCUL PRIX PAR M² =====
  -- Utilise internal_area (obligatoire) pour le calcul
  IF NEW.price_excluding_vat IS NOT NULL AND NEW.internal_area IS NOT NULL AND NEW.internal_area > 0 THEN
    NEW.price_per_sqm := ROUND(NEW.price_excluding_vat / NEW.internal_area, 2);
  END IF;

  -- ===== CALCUL GOLDEN VISA =====
  -- Golden Visa si prix TTC >= 300,000€
  IF NEW.price_including_vat IS NOT NULL THEN
    NEW.golden_visa_eligible := (NEW.price_including_vat >= 300000);
  ELSE
    NEW.golden_visa_eligible := false;
  END IF;

  -- ===== MISE À JOUR current_price =====
  -- current_price suit price_excluding_vat si pas de discount
  IF NEW.current_price IS NULL AND NEW.price_excluding_vat IS NOT NULL THEN
    NEW.current_price := NEW.price_excluding_vat;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- =====================================================
-- 2. CRÉER TRIGGER SUR PROPERTIES
-- =====================================================

-- Supprimer ancien trigger Golden Visa (déjà géré dans Phase 0)
DROP TRIGGER IF EXISTS trigger_calculate_golden_visa ON public.properties;

-- Créer nouveau trigger complet
DROP TRIGGER IF EXISTS trigger_calculate_property_financials ON public.properties;
CREATE TRIGGER trigger_calculate_property_financials
  BEFORE INSERT OR UPDATE OF
    price_excluding_vat,
    vat_rate,
    vat_amount,
    commission_rate,
    internal_area
  ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_property_financials();

-- =====================================================
-- 3. BACKFILL : Recalculer tous les montants existants
-- =====================================================

-- Recalculer pour toutes les properties avec un prix
UPDATE public.properties
SET
  vat_amount = ROUND(price_excluding_vat * COALESCE(vat_rate, 0) / 100, 2),
  price_including_vat = ROUND(price_excluding_vat + (price_excluding_vat * COALESCE(vat_rate, 0) / 100), 2),
  commission_amount = ROUND(
    (price_excluding_vat + (price_excluding_vat * COALESCE(vat_rate, 0) / 100)) * COALESCE(commission_rate, 0) / 100,
    2
  ),
  price_per_sqm = CASE
    WHEN internal_area > 0 THEN ROUND(price_excluding_vat / internal_area, 2)
    ELSE NULL
  END,
  golden_visa_eligible = (
    price_excluding_vat + (price_excluding_vat * COALESCE(vat_rate, 0) / 100)
  ) >= 300000,
  current_price = COALESCE(current_price, price_excluding_vat)
WHERE price_excluding_vat IS NOT NULL;

COMMIT;

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Vérifier les calculs sur un échantillon
-- SELECT
--   property_code,
--   price_excluding_vat as prix_ht,
--   vat_rate as tva_pct,
--   vat_amount as montant_tva,
--   price_including_vat as prix_ttc,
--   commission_rate as com_pct,
--   commission_amount as montant_com,
--   internal_area as surface,
--   price_per_sqm as prix_m2,
--   golden_visa_eligible as golden_visa
-- FROM properties
-- WHERE price_excluding_vat IS NOT NULL
-- ORDER BY price_including_vat DESC
-- LIMIT 10;

-- Compter les properties Golden Visa
-- SELECT
--   COUNT(*) as total_properties,
--   COUNT(CASE WHEN golden_visa_eligible = true THEN 1 END) as golden_visa_count,
--   ROUND(
--     COUNT(CASE WHEN golden_visa_eligible = true THEN 1 END)::DECIMAL / COUNT(*) * 100,
--     2
--   ) as golden_visa_percentage
-- FROM properties
-- WHERE price_including_vat IS NOT NULL;

-- Vérifier cohérence calculs
-- SELECT
--   property_code,
--   price_excluding_vat,
--   vat_amount,
--   price_excluding_vat * vat_rate / 100 as vat_calculated,
--   price_including_vat,
--   price_excluding_vat + vat_amount as price_ttc_calculated,
--   CASE
--     WHEN ABS(vat_amount - (price_excluding_vat * vat_rate / 100)) > 0.01 THEN 'ERREUR VAT'
--     WHEN ABS(price_including_vat - (price_excluding_vat + vat_amount)) > 0.01 THEN 'ERREUR TTC'
--     ELSE 'OK'
--   END as status
-- FROM properties
-- WHERE price_excluding_vat IS NOT NULL
--   AND vat_rate IS NOT NULL
-- LIMIT 20;
