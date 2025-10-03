/*
  # Phase 1.4 : Fonction d'agrégation amenities (Type 3)

  ## Objectif
  Créer une fonction SQL qui retourne TOUS les équipements d'une property :
  1. Équipements PRIVÉS de la property (jacuzzi, terrace privée, etc.)
  2. Équipements PRIVÉS du building (piscine privée villa, etc.)
  3. Équipements TECHNIQUES du building (ascenseur, énergie, etc.)
  4. Équipements COMMUNS du project (piscine commune, gym, spa, etc.)
  5. Liste de highlights (top 10 équipements)

  ## Format retour
  JSONB avec structure hiérarchique claire

  ## Sécurité
  - Fonction STABLE (lecture seule)
  - Gère les NULL et jointures LEFT JOIN
  - Retourne {} si property inexistante
*/

BEGIN;

-- =====================================================
-- 1. FONCTION : Récupérer tous les équipements d'une property
-- =====================================================

CREATE OR REPLACE FUNCTION public.get_property_complete_amenities(p_property_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
BEGIN
  -- Construire le JSON hiérarchique avec tous les équipements
  SELECT jsonb_build_object(
    -- ===== NIVEAU 1 : Équipements PRIVÉS PROPERTY =====
    'property_private', jsonb_build_object(
      'has_jacuzzi', COALESCE(p.has_jacuzzi, false),
      'has_sauna', COALESCE(p.has_sauna, false),
      'has_home_cinema', COALESCE(p.has_home_cinema, false),
      'has_fireplace', COALESCE(p.has_fireplace, false),
      'has_wine_cellar', COALESCE(p.has_wine_cellar, false),
      'has_private_terrace', COALESCE(p.has_terrace, false),
      'has_balcony', COALESCE(p.has_balcony, false),
      'has_roof_terrace', COALESCE(p.has_roof_terrace, false),
      'has_office', COALESCE(p.has_office, false),
      'has_dressing_room', COALESCE(p.has_dressing_room, false)
    ),

    -- ===== NIVEAU 2 : Équipements PRIVÉS BUILDING =====
    'building_private', jsonb_build_object(
      'has_private_pool', COALESCE(b.has_pool, false),
      'has_private_gym', COALESCE(b.has_gym, false),
      'has_private_spa', COALESCE(b.has_spa, false),
      'has_private_garden', COALESCE(p.has_private_garden, false)
    ),

    -- ===== NIVEAU 3 : Équipements TECHNIQUES BUILDING =====
    'building_technical', jsonb_build_object(
      'elevator_count', COALESCE(b.elevator_count, 0),
      'has_elevator', COALESCE(b.elevator_count > 0, false),
      'energy_rating', COALESCE(b.energy_rating, p.energy_rating),
      'parking_type', COALESCE(b.parking_type, 'none'),
      'has_parking', COALESCE(b.has_parking, false),
      'has_generator', COALESCE(b.has_generator, false),
      'has_security_system', COALESCE(b.has_security_system, false),
      'has_cctv', COALESCE(b.has_cctv, false),
      'has_concierge', COALESCE(b.has_concierge, false),
      'has_solar_panels', COALESCE(b.has_solar_panels, false)
    ),

    -- ===== NIVEAU 4 : Équipements COMMUNS PROJECT =====
    'project_shared', jsonb_build_object(
      'amenities', COALESCE(pr.amenities, '[]'::jsonb),
      'lifestyle_amenities', COALESCE(pr.lifestyle_amenities, '[]'::jsonb),
      'community_features', COALESCE(pr.community_features, '[]'::jsonb),
      'wellness_features', COALESCE(pr.wellness_features, '[]'::jsonb),
      'smart_home_features', COALESCE(pr.smart_home_features, '[]'::jsonb),
      'accessibility_features', COALESCE(pr.accessibility_features, '[]'::jsonb)
    ),

    -- ===== NIVEAU 5 : Résumé projet =====
    'project_info', jsonb_build_object(
      'title', pr.title,
      'city', pr.city,
      'status', pr.status,
      'completion_date', pr.completion_date
    ),

    -- ===== NIVEAU 6 : HIGHLIGHTS (Top équipements) =====
    'highlights', (
      SELECT jsonb_agg(highlight ORDER BY priority)
      FROM (
        -- Équipements privés property (priorité haute)
        SELECT 1 as priority, 'Jacuzzi privé' as highlight WHERE p.has_jacuzzi = true
        UNION ALL SELECT 1, 'Sauna privé' WHERE p.has_sauna = true
        UNION ALL SELECT 1, 'Cinéma privé' WHERE p.has_home_cinema = true
        UNION ALL SELECT 1, 'Cave à vin' WHERE p.has_wine_cellar = true
        UNION ALL SELECT 1, 'Terrasse toit' WHERE p.has_roof_terrace = true

        -- Équipements privés building
        UNION ALL SELECT 2, 'Piscine privée' WHERE b.has_pool = true
        UNION ALL SELECT 2, 'Gym privé' WHERE b.has_gym = true
        UNION ALL SELECT 2, 'Spa privé' WHERE b.has_spa = true
        UNION ALL SELECT 2, 'Jardin privé' WHERE p.has_private_garden = true

        -- Vues exceptionnelles
        UNION ALL SELECT 3, 'Vue mer' WHERE p.has_sea_view = true
        UNION ALL SELECT 3, 'Vue montagne' WHERE p.has_mountain_view = true

        -- Certification
        UNION ALL SELECT 4, 'Certification énergétique A+' WHERE COALESCE(b.energy_rating, p.energy_rating) IN ('A+', 'A')

        -- Équipements communs (depuis JSONB)
        UNION ALL SELECT 5, 'Piscine commune' WHERE pr.amenities ? 'pool'
        UNION ALL SELECT 5, 'Gym commun' WHERE pr.amenities ? 'gym'
        UNION ALL SELECT 5, 'Spa & Hammam' WHERE pr.amenities ? 'spa'
        UNION ALL SELECT 5, 'Tennis' WHERE pr.amenities ? 'tennis'
        UNION ALL SELECT 5, 'Golf' WHERE pr.lifestyle_amenities ? 'golf'
        UNION ALL SELECT 5, 'Plage privée' WHERE pr.lifestyle_amenities ? 'private_beach'
        UNION ALL SELECT 5, 'Marina' WHERE pr.lifestyle_amenities ? 'marina'

        -- Services
        UNION ALL SELECT 6, 'Sécurité 24/7' WHERE pr.community_features ? 'security_24_7'
        UNION ALL SELECT 6, 'Concierge' WHERE b.has_concierge = true OR pr.community_features ? 'concierge'
        UNION ALL SELECT 6, 'Club house' WHERE pr.community_features ? 'club_house'
        UNION ALL SELECT 6, 'Restaurant' WHERE pr.community_features ? 'restaurant'

        LIMIT 15
      ) highlights
    ),

    -- ===== NIVEAU 7 : Résumé COUNT =====
    'summary', jsonb_build_object(
      'total_private_amenities', (
        SELECT COUNT(*)
        FROM (
          SELECT 1 WHERE p.has_jacuzzi = true
          UNION ALL SELECT 1 WHERE p.has_sauna = true
          UNION ALL SELECT 1 WHERE p.has_home_cinema = true
          UNION ALL SELECT 1 WHERE p.has_fireplace = true
          UNION ALL SELECT 1 WHERE p.has_wine_cellar = true
          UNION ALL SELECT 1 WHERE b.has_pool = true
          UNION ALL SELECT 1 WHERE b.has_gym = true
          UNION ALL SELECT 1 WHERE b.has_spa = true
        ) counts
      ),
      'total_shared_amenities', (
        SELECT COUNT(*)
        FROM jsonb_array_elements_text(COALESCE(pr.amenities, '[]'::jsonb))
      )
    )
  ) INTO result
  FROM public.properties p
  LEFT JOIN public.buildings b ON p.building_id = b.id
  LEFT JOIN public.projects pr ON p.project_id = pr.id
  WHERE p.id = p_property_id;

  -- Retourner le résultat (ou {} si property inexistante)
  RETURN COALESCE(result, '{}'::jsonb);
END;
$$;

-- =====================================================
-- 2. FONCTION SIMPLIFIÉE : Highlights uniquement
-- =====================================================

CREATE OR REPLACE FUNCTION public.get_property_highlights(p_property_id UUID)
RETURNS TEXT[]
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ARRAY(
    SELECT highlight
    FROM (
      SELECT 1 as priority, 'Jacuzzi privé' as highlight
      FROM properties p WHERE p.id = p_property_id AND p.has_jacuzzi = true
      UNION ALL
      SELECT 1, 'Sauna privé'
      FROM properties p WHERE p.id = p_property_id AND p.has_sauna = true
      UNION ALL
      SELECT 2, 'Piscine privée'
      FROM properties p
      JOIN buildings b ON p.building_id = b.id
      WHERE p.id = p_property_id AND b.has_pool = true
      UNION ALL
      SELECT 3, 'Vue mer'
      FROM properties p WHERE p.id = p_property_id AND p.has_sea_view = true
      UNION ALL
      SELECT 4, 'Certification A+'
      FROM properties p
      LEFT JOIN buildings b ON p.building_id = b.id
      WHERE p.id = p_property_id
        AND COALESCE(b.energy_rating, p.energy_rating) IN ('A+', 'A')
      UNION ALL
      SELECT 5, 'Piscine commune'
      FROM properties p
      JOIN projects pr ON p.project_id = pr.id
      WHERE p.id = p_property_id AND pr.amenities ? 'pool'
      UNION ALL
      SELECT 5, 'Gym commun'
      FROM properties p
      JOIN projects pr ON p.project_id = pr.id
      WHERE p.id = p_property_id AND pr.amenities ? 'gym'
      UNION ALL
      SELECT 6, 'Sécurité 24/7'
      FROM properties p
      JOIN projects pr ON p.project_id = pr.id
      WHERE p.id = p_property_id AND pr.community_features ? 'security_24_7'
      ORDER BY priority
      LIMIT 10
    ) highlights
  );
$$;

-- =====================================================
-- 3. DOCUMENTATION
-- =====================================================

COMMENT ON FUNCTION public.get_property_complete_amenities(UUID) IS
'Retourne TOUS les équipements d''une property en JSON hiérarchique : privés (property/building), techniques (building), communs (project), highlights';

COMMENT ON FUNCTION public.get_property_highlights(UUID) IS
'Retourne un array TEXT[] des top 10 highlights d''une property (version simplifiée)';

COMMIT;

-- =====================================================
-- TESTS
-- =====================================================

-- Test fonction complète (remplacer uuid par un vrai)
-- SELECT get_property_complete_amenities('00000000-0000-0000-0000-000000000000');

-- Test fonction highlights
-- SELECT get_property_highlights('00000000-0000-0000-0000-000000000000');

-- Test sur toutes les properties (résumé)
-- SELECT
--   p.property_code,
--   p.property_type,
--   jsonb_array_length((get_property_complete_amenities(p.id)->'highlights')::jsonb) as highlights_count,
--   get_property_highlights(p.id) as highlights_array
-- FROM properties p
-- LIMIT 5;
