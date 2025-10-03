/*
  # Phase 1.1 : Héritage CASCADE automatique (Type 1)

  ## Objectif
  Implémenter les 3 héritages automatiques de la hiérarchie :
  1. commission_rate : DEVELOPER → PROPERTY
  2. vat_rate : PROJECT → PROPERTY
  3. energy_rating : BUILDING → PROPERTY

  ## Logique
  - Si la property n'a pas de valeur spécifique, elle hérite du niveau supérieur
  - Si la property a une valeur, elle est conservée (override)
  - Triggers BEFORE INSERT/UPDATE pour éviter valeurs NULL

  ## Sécurité
  - Utilise COALESCE pour gérer les NULL
  - Ne modifie que si valeur NULL
  - Gère les cas où developer_id, project_id, building_id sont NULL
*/

BEGIN;

-- =====================================================
-- 1. TRIGGER : Héritage commission_rate (DEVELOPER → PROPERTY)
-- =====================================================

CREATE OR REPLACE FUNCTION public.inherit_commission_rate()
RETURNS TRIGGER AS $$
DECLARE
  developer_commission DECIMAL(5,2);
BEGIN
  -- Si commission_rate est NULL ou égal au DEFAULT (5.0), hériter du developer
  IF (NEW.commission_rate IS NULL OR NEW.commission_rate = 5.0) AND NEW.developer_id IS NOT NULL THEN
    -- Récupérer commission_rate du developer
    SELECT commission_rate INTO developer_commission
    FROM public.developers
    WHERE id = NEW.developer_id;

    -- Si developer a une commission, l'utiliser
    IF developer_commission IS NOT NULL THEN
      NEW.commission_rate := developer_commission;
    ELSE
      -- Fallback: garder 5.0 si developer n'a pas de commission
      NEW.commission_rate := COALESCE(NEW.commission_rate, 5.0);
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Créer trigger
DROP TRIGGER IF EXISTS trigger_inherit_commission_rate ON public.properties;
CREATE TRIGGER trigger_inherit_commission_rate
  BEFORE INSERT OR UPDATE OF developer_id, commission_rate
  ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.inherit_commission_rate();

-- =====================================================
-- 2. TRIGGER : Héritage vat_rate (PROJECT → PROPERTY)
-- =====================================================

CREATE OR REPLACE FUNCTION public.inherit_vat_rate()
RETURNS TRIGGER AS $$
DECLARE
  project_vat DECIMAL(5,2);
BEGIN
  -- Si vat_rate est NULL ou égal au DEFAULT (5.0), hériter du project
  IF (NEW.vat_rate IS NULL OR NEW.vat_rate = 5.0) AND NEW.project_id IS NOT NULL THEN
    -- Récupérer vat_rate du project
    SELECT vat_rate INTO project_vat
    FROM public.projects
    WHERE id = NEW.project_id;

    -- Si project a un vat_rate, l'utiliser
    IF project_vat IS NOT NULL THEN
      NEW.vat_rate := project_vat;
    ELSE
      -- Fallback: garder 5.0 si project n'a pas de vat_rate
      NEW.vat_rate := COALESCE(NEW.vat_rate, 5.0);
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Créer trigger
DROP TRIGGER IF EXISTS trigger_inherit_vat_rate ON public.properties;
CREATE TRIGGER trigger_inherit_vat_rate
  BEFORE INSERT OR UPDATE OF project_id, vat_rate
  ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.inherit_vat_rate();

-- =====================================================
-- 3. TRIGGER : Héritage energy_rating (BUILDING → PROPERTY)
-- =====================================================

CREATE OR REPLACE FUNCTION public.inherit_energy_rating()
RETURNS TRIGGER AS $$
DECLARE
  building_energy VARCHAR(2);
BEGIN
  -- Si energy_rating est NULL, hériter du building
  IF NEW.energy_rating IS NULL AND NEW.building_id IS NOT NULL THEN
    -- Récupérer energy_rating du building
    SELECT energy_rating INTO building_energy
    FROM public.buildings
    WHERE id = NEW.building_id;

    -- Si building a un energy_rating, l'utiliser
    IF building_energy IS NOT NULL THEN
      NEW.energy_rating := building_energy;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Créer trigger
DROP TRIGGER IF EXISTS trigger_inherit_energy_rating ON public.properties;
CREATE TRIGGER trigger_inherit_energy_rating
  BEFORE INSERT OR UPDATE OF building_id, energy_rating
  ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.inherit_energy_rating();

-- =====================================================
-- 4. BACKFILL : Appliquer l'héritage aux données existantes
-- =====================================================

-- Hériter commission_rate des developers
UPDATE public.properties p
SET commission_rate = d.commission_rate
FROM public.developers d
WHERE p.developer_id = d.id
  AND (p.commission_rate IS NULL OR p.commission_rate = 5.0)
  AND d.commission_rate IS NOT NULL
  AND d.commission_rate != 5.0;

-- Hériter vat_rate des projects
UPDATE public.properties p
SET vat_rate = pr.vat_rate
FROM public.projects pr
WHERE p.project_id = pr.id
  AND (p.vat_rate IS NULL OR p.vat_rate = 5.0)
  AND pr.vat_rate IS NOT NULL
  AND pr.vat_rate != 5.0;

-- Hériter energy_rating des buildings
UPDATE public.properties p
SET energy_rating = b.energy_rating
FROM public.buildings b
WHERE p.building_id = b.id
  AND p.energy_rating IS NULL
  AND b.energy_rating IS NOT NULL;

COMMIT;

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Compter properties avec commission héritée
-- SELECT
--   COUNT(*) as total_properties,
--   COUNT(CASE WHEN commission_rate IS NOT NULL THEN 1 END) as with_commission,
--   COUNT(CASE WHEN commission_rate != 5.0 THEN 1 END) as with_custom_commission
-- FROM properties;

-- Voir exemples d'héritage
-- SELECT
--   p.property_code,
--   d.name as developer_name,
--   d.commission_rate as dev_commission,
--   p.commission_rate as property_commission,
--   pr.vat_rate as project_vat,
--   p.vat_rate as property_vat,
--   b.energy_rating as building_energy,
--   p.energy_rating as property_energy
-- FROM properties p
-- LEFT JOIN developers d ON p.developer_id = d.id
-- LEFT JOIN projects pr ON p.project_id = pr.id
-- LEFT JOIN buildings b ON p.building_id = b.id
-- LIMIT 10;
