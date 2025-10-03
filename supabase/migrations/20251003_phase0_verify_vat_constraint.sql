/*
  # Phase 0.2 : Vérification et correction contrainte VAT

  ## Problème identifié
  - Migration 20250920062524 définit CHECK (vat_rate IN (5, 19))
  - Migration 20251003_fix_vat_rate_constraint définit CHECK (vat_rate IN (0, 5, 19))
  - Risque de conflit entre contrainte inline et contrainte nommée

  ## Actions
  1. Supprimer toutes les contraintes VAT existantes
  2. Créer UNE SEULE contrainte propre avec (0, 5, 19)
  3. Appliquer sur PROJECTS et PROPERTIES

  ## Sécurité
  - Vérifie les données existantes avant modification
  - Ne supprime pas les contraintes si données invalides
*/

BEGIN;

-- =====================================================
-- 1. VÉRIFIER DONNÉES EXISTANTES
-- =====================================================

-- Vérifier qu'il n'y a pas de vat_rate en dehors de (0, 5, 19)
DO $$
DECLARE
  invalid_count_projects INTEGER;
  invalid_count_properties INTEGER;
BEGIN
  -- Compter vat_rate invalides dans projects
  SELECT COUNT(*) INTO invalid_count_projects
  FROM public.projects
  WHERE vat_rate IS NOT NULL
    AND vat_rate NOT IN (0, 5, 19);

  -- Compter vat_rate invalides dans properties
  SELECT COUNT(*) INTO invalid_count_properties
  FROM public.properties
  WHERE vat_rate IS NOT NULL
    AND vat_rate NOT IN (0, 5, 19);

  -- Lever erreur si données invalides
  IF invalid_count_projects > 0 THEN
    RAISE EXCEPTION 'ERREUR: % projects ont un vat_rate invalide (ni 0, ni 5, ni 19). Corriger les données d''abord.', invalid_count_projects;
  END IF;

  IF invalid_count_properties > 0 THEN
    RAISE EXCEPTION 'ERREUR: % properties ont un vat_rate invalide (ni 0, ni 5, ni 19). Corriger les données d''abord.', invalid_count_properties;
  END IF;

  RAISE NOTICE 'Vérification OK : Toutes les vat_rate sont valides (0, 5 ou 19)';
END $$;

-- =====================================================
-- 2. SUPPRIMER ANCIENNES CONTRAINTES (PROJECTS)
-- =====================================================

-- Supprimer contrainte inline si elle existe
ALTER TABLE public.projects
  DROP CONSTRAINT IF EXISTS projects_vat_rate_check CASCADE;

-- Supprimer toutes les contraintes CHECK contenant 'vat_rate'
DO $$
DECLARE
  constraint_rec RECORD;
BEGIN
  FOR constraint_rec IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'public.projects'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) LIKE '%vat_rate%'
  LOOP
    EXECUTE format('ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS %I CASCADE', constraint_rec.conname);
    RAISE NOTICE 'Suppression contrainte projects: %', constraint_rec.conname;
  END LOOP;
END $$;

-- =====================================================
-- 3. SUPPRIMER ANCIENNES CONTRAINTES (PROPERTIES)
-- =====================================================

DO $$
DECLARE
  constraint_rec RECORD;
BEGIN
  FOR constraint_rec IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'public.properties'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) LIKE '%vat_rate%'
  LOOP
    EXECUTE format('ALTER TABLE public.properties DROP CONSTRAINT IF EXISTS %I CASCADE', constraint_rec.conname);
    RAISE NOTICE 'Suppression contrainte properties: %', constraint_rec.conname;
  END LOOP;
END $$;

-- =====================================================
-- 4. CRÉER NOUVELLES CONTRAINTES PROPRES
-- =====================================================

-- PROJECTS : VAT rate accepte 0, 5 ou 19
ALTER TABLE public.projects
  ADD CONSTRAINT projects_vat_rate_valid
  CHECK (vat_rate IS NULL OR vat_rate IN (0, 5, 19));

-- PROPERTIES : VAT rate accepte 0, 5 ou 19
ALTER TABLE public.properties
  ADD CONSTRAINT properties_vat_rate_valid
  CHECK (vat_rate IS NULL OR vat_rate IN (0, 5, 19));

-- =====================================================
-- 5. DOCUMENTER LES TAUX VAT CHYPRE
-- =====================================================

COMMENT ON CONSTRAINT projects_vat_rate_valid ON public.projects IS
'TVA à Chypre: 0% (terrains, Golden Visa dans certains cas), 5% (résidentiel première main), 19% (commercial, hôtellerie, seconde main)';

COMMENT ON CONSTRAINT properties_vat_rate_valid ON public.properties IS
'TVA à Chypre: 0% (terrains, Golden Visa dans certains cas), 5% (résidentiel première main), 19% (commercial, hôtellerie, seconde main)';

COMMIT;

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Vérifier les contraintes créées
-- SELECT
--   conname as constraint_name,
--   pg_get_constraintdef(oid) as constraint_definition
-- FROM pg_constraint
-- WHERE conrelid IN ('public.projects'::regclass, 'public.properties'::regclass)
--   AND conname LIKE '%vat%'
-- ORDER BY conrelid::regclass::text, conname;

-- Compter les différents taux VAT utilisés
-- SELECT
--   'projects' as table_name,
--   vat_rate,
--   COUNT(*) as count
-- FROM public.projects
-- WHERE vat_rate IS NOT NULL
-- GROUP BY vat_rate
-- UNION ALL
-- SELECT
--   'properties' as table_name,
--   vat_rate,
--   COUNT(*) as count
-- FROM public.properties
-- WHERE vat_rate IS NOT NULL
-- GROUP BY vat_rate
-- ORDER BY table_name, vat_rate;
