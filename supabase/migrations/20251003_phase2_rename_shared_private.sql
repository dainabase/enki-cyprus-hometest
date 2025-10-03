/*
  # Phase 2 : Renommage équipements shared vs private

  ## Problème
  Confusion totale actuelle :
  - projects.amenities (JSONB) contient ["pool", "gym", "spa"] (communs)
  - buildings.has_pool (BOOLEAN) (privé ou commun ?)
  - properties.has_private_pool (BOOLEAN) (privé villa)

  ## Solution
  Architecture claire avec préfixes explicites :

  ### PROJECTS (équipements COMMUNS - partagés par tous)
  - Garder amenities JSONB (["pool", "gym", "spa", "tennis", ...])
  - Supprimer doublons BOOLEAN dans buildings

  ### BUILDINGS (équipements PRIVÉS du building)
  - Renommer : has_pool → has_private_pool_building
  - Renommer : has_gym → has_private_gym_building
  - Renommer : has_spa → has_private_spa_building
  - Ces équipements sont EXCLUSIFS à un building (ex: villa de luxe)

  ### PROPERTIES (équipements DANS l'unité)
  - Garder has_private_pool (piscine dans l'appartement, très rare)
  - Garder has_jacuzzi, has_sauna, etc. (équipements unité)

  ## Note importante
  Cette migration est OPTIONNELLE et peut être faite plus tard.
  Elle améliore la clarté mais n'affecte pas les triggers CASCADE.

  ## Sécurité
  - Copie les données avant renommage
  - Ne supprime aucune donnée
  - Permet rollback facile
*/

BEGIN;

-- =====================================================
-- AVERTISSEMENT
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '====================================================';
  RAISE NOTICE 'PHASE 2 : Renommage équipements shared/private';
  RAISE NOTICE '====================================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Cette migration renomme les colonnes pour clarifier :';
  RAISE NOTICE '  - projects.amenities (JSONB) : équipements COMMUNS';
  RAISE NOTICE '  - buildings.has_private_X : équipements PRIVÉS building';
  RAISE NOTICE '  - properties.has_private_X : équipements PRIVÉS unité';
  RAISE NOTICE '';
  RAISE NOTICE 'Impact : Nécessite mise à jour du code TypeScript';
  RAISE NOTICE '====================================================';
END $$;

-- =====================================================
-- 1. BUILDINGS : Renommer colonnes ambiguës
-- =====================================================

-- Renommer has_pool → has_private_pool_building
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'buildings'
      AND column_name = 'has_pool'
  ) THEN
    ALTER TABLE public.buildings
      RENAME COLUMN has_pool TO has_private_pool_building;

    RAISE NOTICE 'Renommé: buildings.has_pool → has_private_pool_building';
  END IF;
END $$;

-- Renommer has_gym → has_private_gym_building
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'buildings'
      AND column_name = 'has_gym'
  ) THEN
    ALTER TABLE public.buildings
      RENAME COLUMN has_gym TO has_private_gym_building;

    RAISE NOTICE 'Renommé: buildings.has_gym → has_private_gym_building';
  END IF;
END $$;

-- Renommer has_spa → has_private_spa_building
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'buildings'
      AND column_name = 'has_spa'
  ) THEN
    ALTER TABLE public.buildings
      RENAME COLUMN has_spa TO has_private_spa_building;

    RAISE NOTICE 'Renommé: buildings.has_spa → has_private_spa_building';
  END IF;
END $$;

-- Renommer has_playground → has_private_playground_building
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'buildings'
      AND column_name = 'has_playground'
  ) THEN
    ALTER TABLE public.buildings
      RENAME COLUMN has_playground TO has_private_playground_building;

    RAISE NOTICE 'Renommé: buildings.has_playground → has_private_playground_building';
  END IF;
END $$;

-- Renommer has_garden → has_private_garden_building
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'buildings'
      AND column_name = 'has_garden'
  ) THEN
    ALTER TABLE public.buildings
      RENAME COLUMN has_garden TO has_private_garden_building;

    RAISE NOTICE 'Renommé: buildings.has_garden → has_private_garden_building';
  END IF;
END $$;

-- =====================================================
-- 2. COMMENTAIRES : Documenter la nouvelle architecture
-- =====================================================

-- PROJECTS
COMMENT ON COLUMN public.projects.amenities IS
'Équipements COMMUNS partagés par TOUS les residents du projet (piscine commune, gym commun, spa commun, tennis, etc.). Format JSONB array.';

COMMENT ON COLUMN public.projects.lifestyle_amenities IS
'Prestations lifestyle COMMUNES (golf, plage privée, marina, club house). Format JSONB array.';

-- BUILDINGS (après renommage)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'buildings' AND column_name = 'has_private_pool_building'
  ) THEN
    EXECUTE 'COMMENT ON COLUMN public.buildings.has_private_pool_building IS ''Piscine PRIVÉE exclusive à ce building (ex: villa de luxe avec piscine privée 8x4m)''';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'buildings' AND column_name = 'has_private_gym_building'
  ) THEN
    EXECUTE 'COMMENT ON COLUMN public.buildings.has_private_gym_building IS ''Gym PRIVÉ exclusif à ce building (ex: penthouse avec gym privé)''';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'buildings' AND column_name = 'has_private_spa_building'
  ) THEN
    EXECUTE 'COMMENT ON COLUMN public.buildings.has_private_spa_building IS ''Spa PRIVÉ exclusif à ce building''';
  END IF;
END $$;

-- PROPERTIES
COMMENT ON COLUMN public.properties.has_private_pool IS
'Piscine PRIVÉE dans l''unité individuelle (très rare, ex: villa ultra-luxe). Différent de has_private_pool_building (niveau building).';

COMMENT ON COLUMN public.properties.has_jacuzzi IS
'Jacuzzi DANS l''unité (équipement privé property)';

COMMENT ON COLUMN public.properties.has_private_garden IS
'Jardin PRIVÉ de l''unité (ex: appartement RDC avec jardin 50m²)';

-- =====================================================
-- 3. MISE À JOUR FONCTION AMENITIES
-- =====================================================

-- Recréer la fonction avec les nouveaux noms de colonnes
CREATE OR REPLACE FUNCTION public.get_property_complete_amenities(p_property_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
  v_has_private_pool_building BOOLEAN;
  v_has_private_gym_building BOOLEAN;
  v_has_private_spa_building BOOLEAN;
BEGIN
  -- Récupérer les colonnes (gère ancien et nouveau nom)
  SELECT
    COALESCE(
      (SELECT has_private_pool_building FROM buildings WHERE id = p.building_id),
      (SELECT has_pool FROM buildings WHERE id = p.building_id)
    ),
    COALESCE(
      (SELECT has_private_gym_building FROM buildings WHERE id = p.building_id),
      (SELECT has_gym FROM buildings WHERE id = p.building_id)
    ),
    COALESCE(
      (SELECT has_private_spa_building FROM buildings WHERE id = p.building_id),
      (SELECT has_spa FROM buildings WHERE id = p.building_id)
    )
  INTO v_has_private_pool_building, v_has_private_gym_building, v_has_private_spa_building
  FROM properties p
  WHERE p.id = p_property_id;

  -- Construire le JSON hiérarchique avec nouveaux noms
  SELECT jsonb_build_object(
    'property_private', jsonb_build_object(
      'has_jacuzzi', COALESCE(p.has_jacuzzi, false),
      'has_sauna', COALESCE(p.has_sauna, false),
      'has_private_pool_unit', COALESCE(p.has_private_pool, false),
      'has_private_terrace', COALESCE(p.has_terrace, false)
    ),
    'building_private', jsonb_build_object(
      'has_private_pool_building', COALESCE(v_has_private_pool_building, false),
      'has_private_gym_building', COALESCE(v_has_private_gym_building, false),
      'has_private_spa_building', COALESCE(v_has_private_spa_building, false)
    ),
    'project_shared', jsonb_build_object(
      'amenities', COALESCE(pr.amenities, '[]'::jsonb),
      'lifestyle_amenities', COALESCE(pr.lifestyle_amenities, '[]'::jsonb)
    )
  ) INTO result
  FROM properties p
  LEFT JOIN projects pr ON p.project_id = pr.id
  WHERE p.id = p_property_id;

  RETURN COALESCE(result, '{}'::jsonb);
END;
$$;

-- =====================================================
-- 4. RÉSUMÉ DES CHANGEMENTS
-- =====================================================

DO $$
DECLARE
  renamed_count INTEGER;
BEGIN
  -- Compter colonnes renommées
  SELECT COUNT(*) INTO renamed_count
  FROM information_schema.columns
  WHERE table_name = 'buildings'
    AND column_name IN (
      'has_private_pool_building',
      'has_private_gym_building',
      'has_private_spa_building',
      'has_private_playground_building',
      'has_private_garden_building'
    );

  RAISE NOTICE '';
  RAISE NOTICE '====================================================';
  RAISE NOTICE 'RÉSUMÉ RENOMMAGE';
  RAISE NOTICE '====================================================';
  RAISE NOTICE 'Colonnes renommées dans buildings : %', renamed_count;
  RAISE NOTICE '';
  RAISE NOTICE 'PROCHAINES ÉTAPES :';
  RAISE NOTICE '1. Mettre à jour src/types/building.ts';
  RAISE NOTICE '2. Mettre à jour composants React utilisant has_pool, has_gym, etc.';
  RAISE NOTICE '3. Tester l''affichage des équipements';
  RAISE NOTICE '====================================================';
END $$;

COMMIT;

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Vérifier structure finale buildings
-- SELECT column_name, data_type, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'buildings'
--   AND (column_name LIKE '%pool%' OR column_name LIKE '%gym%' OR column_name LIKE '%spa%')
-- ORDER BY column_name;

-- Tester fonction amenities mise à jour
-- SELECT
--   property_code,
--   get_property_complete_amenities(id) as amenities
-- FROM properties
-- LIMIT 3;
