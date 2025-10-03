/*
  # Phase 1.3 : Compteurs agrégés CASCADE (Type 4 - Remontée)

  ## Objectif
  Mettre à jour automatiquement les compteurs des niveaux supérieurs :

  ### PROJECTS (remontent depuis PROPERTIES)
  - total_units = COUNT(properties)
  - units_available = COUNT(WHERE status = 'available')
  - units_sold = COUNT(WHERE status = 'sold')
  - price_from = MIN(price_excluding_vat)
  - price_to = MAX(price_excluding_vat)

  ### BUILDINGS (remontent depuis PROPERTIES)
  - total_units = COUNT(properties)
  - units_available = COUNT(WHERE status = 'available')
  - taux_occupation = (total_units - units_available) / total_units * 100

  ## Logique
  - Triggers AFTER INSERT/UPDATE/DELETE sur properties
  - Mise à jour des compteurs en temps réel
  - Gestion des cas NULL et division par zéro

  ## Sécurité
  - Utilise COALESCE pour éviter NULL
  - Gère les DELETE (OLD vs NEW)
  - Transactions atomiques
*/

BEGIN;

-- =====================================================
-- 1. FONCTION : Mise à jour compteurs PROJECT
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_project_statistics()
RETURNS TRIGGER AS $$
DECLARE
  v_project_id UUID;
BEGIN
  -- Déterminer le project_id concerné (gère INSERT/UPDATE/DELETE)
  IF TG_OP = 'DELETE' THEN
    v_project_id := OLD.project_id;
  ELSE
    v_project_id := NEW.project_id;
  END IF;

  -- Ne rien faire si project_id est NULL
  IF v_project_id IS NULL THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  -- Mise à jour des compteurs du project
  UPDATE public.projects
  SET
    total_units = (
      SELECT COUNT(*)
      FROM public.properties
      WHERE project_id = v_project_id
    ),
    units_available = (
      SELECT COUNT(*)
      FROM public.properties
      WHERE project_id = v_project_id
        AND property_status = 'available'
        AND is_available = true
    ),
    units_sold = (
      SELECT COUNT(*)
      FROM public.properties
      WHERE project_id = v_project_id
        AND property_status = 'sold'
    ),
    price_from = (
      SELECT MIN(price_excluding_vat)
      FROM public.properties
      WHERE project_id = v_project_id
        AND price_excluding_vat IS NOT NULL
        AND property_status = 'available'
    ),
    price_to = (
      SELECT MAX(price_excluding_vat)
      FROM public.properties
      WHERE project_id = v_project_id
        AND price_excluding_vat IS NOT NULL
        AND property_status = 'available'
    ),
    updated_at = NOW()
  WHERE id = v_project_id;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Créer trigger sur INSERT/UPDATE/DELETE
DROP TRIGGER IF EXISTS trigger_update_project_statistics ON public.properties;
CREATE TRIGGER trigger_update_project_statistics
  AFTER INSERT OR UPDATE OF property_status, is_available, price_excluding_vat OR DELETE
  ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_project_statistics();

-- =====================================================
-- 2. FONCTION : Mise à jour compteurs BUILDING
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_building_statistics()
RETURNS TRIGGER AS $$
DECLARE
  v_building_id UUID;
  v_total INTEGER;
  v_available INTEGER;
BEGIN
  -- Déterminer le building_id concerné (gère INSERT/UPDATE/DELETE)
  IF TG_OP = 'DELETE' THEN
    v_building_id := OLD.building_id;
  ELSE
    v_building_id := NEW.building_id;
  END IF;

  -- Ne rien faire si building_id est NULL
  IF v_building_id IS NULL THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  -- Compter les unités
  SELECT
    COUNT(*),
    COUNT(*) FILTER (WHERE property_status = 'available' AND is_available = true)
  INTO v_total, v_available
  FROM public.properties
  WHERE building_id = v_building_id;

  -- Mise à jour des compteurs du building
  UPDATE public.buildings
  SET
    total_units = v_total,
    units_available = v_available,
    taux_occupation = CASE
      WHEN v_total > 0 THEN ROUND((v_total - v_available)::DECIMAL / v_total * 100, 2)
      ELSE 0
    END,
    updated_at = NOW()
  WHERE id = v_building_id;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Supprimer ancien trigger
DROP TRIGGER IF EXISTS update_building_occupancy ON public.properties;
DROP TRIGGER IF EXISTS trigger_update_building_statistics ON public.properties;

-- Créer nouveau trigger sur INSERT/UPDATE/DELETE
CREATE TRIGGER trigger_update_building_statistics
  AFTER INSERT OR UPDATE OF property_status, is_available OR DELETE
  ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_building_statistics();

-- =====================================================
-- 3. BACKFILL : Recalculer tous les compteurs
-- =====================================================

-- Recalculer compteurs PROJECTS
UPDATE public.projects p
SET
  total_units = (
    SELECT COUNT(*)
    FROM public.properties
    WHERE project_id = p.id
  ),
  units_available = (
    SELECT COUNT(*)
    FROM public.properties
    WHERE project_id = p.id
      AND property_status = 'available'
      AND is_available = true
  ),
  units_sold = (
    SELECT COUNT(*)
    FROM public.properties
    WHERE project_id = p.id
      AND property_status = 'sold'
  ),
  price_from = (
    SELECT MIN(price_excluding_vat)
    FROM public.properties
    WHERE project_id = p.id
      AND price_excluding_vat IS NOT NULL
      AND property_status = 'available'
  ),
  price_to = (
    SELECT MAX(price_excluding_vat)
    FROM public.properties
    WHERE project_id = p.id
      AND price_excluding_vat IS NOT NULL
      AND property_status = 'available'
  );

-- Recalculer compteurs BUILDINGS
UPDATE public.buildings b
SET
  total_units = (
    SELECT COUNT(*)
    FROM public.properties
    WHERE building_id = b.id
  ),
  units_available = (
    SELECT COUNT(*)
    FROM public.properties
    WHERE building_id = b.id
      AND property_status = 'available'
      AND is_available = true
  ),
  taux_occupation = (
    SELECT
      CASE
        WHEN COUNT(*) > 0
        THEN ROUND(
          (COUNT(*) - COUNT(*) FILTER (WHERE property_status = 'available' AND is_available = true))::DECIMAL
          / COUNT(*) * 100,
          2
        )
        ELSE 0
      END
    FROM public.properties
    WHERE building_id = b.id
  );

COMMIT;

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Vérifier compteurs PROJECTS
-- SELECT
--   p.title as project_name,
--   p.total_units,
--   p.units_available,
--   p.units_sold,
--   p.price_from,
--   p.price_to,
--   (SELECT COUNT(*) FROM properties WHERE project_id = p.id) as actual_total,
--   (SELECT COUNT(*) FROM properties WHERE project_id = p.id AND property_status = 'available') as actual_available
-- FROM projects p
-- WHERE p.total_units > 0
-- ORDER BY p.total_units DESC
-- LIMIT 10;

-- Vérifier compteurs BUILDINGS
-- SELECT
--   b.building_name,
--   b.total_units,
--   b.units_available,
--   b.taux_occupation,
--   (SELECT COUNT(*) FROM properties WHERE building_id = b.id) as actual_total,
--   (SELECT COUNT(*) FROM properties WHERE building_id = b.id AND property_status = 'available') as actual_available
-- FROM buildings b
-- WHERE b.total_units > 0
-- ORDER BY b.taux_occupation DESC
-- LIMIT 10;

-- Comparer compteurs vs réalité (détection erreurs)
-- SELECT
--   'PROJECT' as level,
--   p.id,
--   p.title as name,
--   p.total_units as stored_total,
--   (SELECT COUNT(*) FROM properties WHERE project_id = p.id) as actual_total,
--   p.total_units - (SELECT COUNT(*) FROM properties WHERE project_id = p.id) as difference
-- FROM projects p
-- WHERE p.total_units != (SELECT COUNT(*) FROM properties WHERE project_id = p.id)
-- UNION ALL
-- SELECT
--   'BUILDING' as level,
--   b.id,
--   b.building_name as name,
--   b.total_units as stored_total,
--   (SELECT COUNT(*) FROM properties WHERE building_id = b.id) as actual_total,
--   b.total_units - (SELECT COUNT(*) FROM properties WHERE building_id = b.id) as difference
-- FROM buildings b
-- WHERE b.total_units != (SELECT COUNT(*) FROM properties WHERE building_id = b.id);
