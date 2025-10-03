/*
  # Phase 0.1 : Correction du trigger Golden Visa

  ## Problème identifié
  Le trigger actuel cible `projects.price` qui n'existe pas.
  PROJECTS a `price_from` et `price_to` (fourchette), pas `price`.

  Le Golden Visa doit être calculé au niveau PROPERTY (≥300,000€).

  ## Actions
  1. Supprimer l'ancien trigger cassé sur projects
  2. Créer le nouveau trigger sur properties.price_including_vat
  3. Backfill des données existantes

  ## Sécurité
  - Utilise IF EXISTS pour éviter erreurs
  - Backfill sécurisé avec WHERE clause
  - Pas de suppression de données
*/

BEGIN;

-- =====================================================
-- 1. SUPPRIMER ANCIEN TRIGGER CASSÉ
-- =====================================================

-- Supprimer trigger sur projects.price (qui n'existe pas)
DROP TRIGGER IF EXISTS trg_set_golden_visa_flag ON public.projects;
DROP TRIGGER IF EXISTS golden_visa_check ON public.projects;

-- Supprimer ancienne fonction
DROP FUNCTION IF EXISTS public.set_golden_visa_flag();
DROP FUNCTION IF EXISTS public.check_golden_visa();

-- =====================================================
-- 2. CRÉER NOUVELLE FONCTION POUR PROPERTIES
-- =====================================================

CREATE OR REPLACE FUNCTION public.calculate_golden_visa_property()
RETURNS TRIGGER AS $$
BEGIN
  -- Golden Visa eligible si prix TTC >= 300,000€
  IF NEW.price_including_vat IS NOT NULL AND NEW.price_including_vat >= 300000 THEN
    NEW.golden_visa_eligible := true;
  ELSIF NEW.price_including_vat IS NOT NULL AND NEW.price_including_vat < 300000 THEN
    NEW.golden_visa_eligible := false;
  ELSE
    -- Si prix TTC NULL, laisser NULL ou false
    NEW.golden_visa_eligible := COALESCE(NEW.golden_visa_eligible, false);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- =====================================================
-- 3. CRÉER TRIGGER SUR PROPERTIES
-- =====================================================

-- Trigger sur INSERT ou UPDATE de price_including_vat
CREATE TRIGGER trigger_calculate_golden_visa
  BEFORE INSERT OR UPDATE OF price_including_vat, price_excluding_vat, vat_amount
  ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_golden_visa_property();

-- =====================================================
-- 4. BACKFILL DONNÉES EXISTANTES
-- =====================================================

-- Recalculer Golden Visa pour toutes les properties avec un prix
UPDATE public.properties
SET golden_visa_eligible = (
  CASE
    WHEN price_including_vat IS NOT NULL AND price_including_vat >= 300000 THEN true
    ELSE false
  END
)
WHERE price_including_vat IS NOT NULL;

-- =====================================================
-- 5. GÉRER projects.golden_visa_eligible
-- =====================================================

-- Note : projects.golden_visa_eligible existe mais ne devrait pas être calculé automatiquement
-- C'est un flag marketing manuel pour indiquer qu'il y a des properties Golden Visa dans le projet
-- On le laisse en place mais sans trigger

COMMIT;

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Compter les properties Golden Visa eligible
-- SELECT COUNT(*) as total_golden_visa
-- FROM properties
-- WHERE golden_visa_eligible = true;

-- Voir les properties avec prix TTC >= 300k
-- SELECT
--   property_code,
--   price_excluding_vat,
--   price_including_vat,
--   golden_visa_eligible
-- FROM properties
-- WHERE price_including_vat >= 300000
-- ORDER BY price_including_vat DESC
-- LIMIT 10;
