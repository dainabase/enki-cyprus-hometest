-- ================================================
-- PHASE 2: SEED PHOTOS UNSPLASH HAUTE QUALITÉ
-- ================================================
-- Date: 7 octobre 2025
-- Objectif: Ajouter des photos professionnelles Unsplash
--           pour les 4 projets existants en production
-- ================================================

-- Vérifier les projets existants
DO $$
BEGIN
  RAISE NOTICE 'Projets existants:';
  RAISE NOTICE '1. Marina Bay Residences';
  RAISE NOTICE '2. Azure Marina Paradise';
  RAISE NOTICE '3. Mountain View Villas';
  RAISE NOTICE '4. Skyline Tower';
END $$;

-- ================================================
-- 1. MARINA BAY RESIDENCES (Limassol)
-- ================================================
-- Thème: Résidence front de mer luxe, moderne

INSERT INTO project_images (project_id, url, is_primary, display_order, caption)
SELECT 
  id,
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=90&fit=crop',
  true,
  1,
  'Vue extérieure Marina Bay Residences - Front de mer Limassol'
FROM projects WHERE url_slug = 'marina-bay-residences-limassol' OR title ILIKE '%Marina Bay%'
ON CONFLICT DO NOTHING;

INSERT INTO project_images (project_id, url, is_primary, display_order, caption)
SELECT 
  id,
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=90&fit=crop',
  false,
  2,
  'Piscine commune infinity avec vue mer panoramique'
FROM projects WHERE url_slug = 'marina-bay-residences-limassol' OR title ILIKE '%Marina Bay%'
ON CONFLICT DO NOTHING;

INSERT INTO project_images (project_id, url, is_primary, display_order, caption)
SELECT 
  id,
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=90&fit=crop',
  false,
  3,
  'Lobby d''entrée luxueux avec réception 24/7'
FROM projects WHERE url_slug = 'marina-bay-residences-limassol' OR title ILIKE '%Marina Bay%'
ON CONFLICT DO NOTHING;

INSERT INTO project_images (project_id, url, is_primary, display_order, caption)
SELECT 
  id,
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1920&q=90&fit=crop',
  false,
  4,
  'Vue nocturne de la résidence illuminée'
FROM projects WHERE url_slug = 'marina-bay-residences-limassol' OR title ILIKE '%Marina Bay%'
ON CONFLICT DO NOTHING;

-- ================================================
-- 2. AZURE MARINA PARADISE (Germasogeia)
-- ================================================
-- Thème: Complexe moderne bord de mer, architecture contemporaine

INSERT INTO project_images (project_id, url, is_primary, display_order, caption)
SELECT 
  id,
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&q=90&fit=crop',
  true,
  1,
  'Vue aérienne Azure Marina Paradise - Germasogeia'
FROM projects WHERE url_slug = 'azure-marina-paradise-limassol' OR title ILIKE '%Azure%'
ON CONFLICT DO NOTHING;

INSERT INTO project_images (project_id, url, is_primary, display_order, caption)
SELECT 
  id,
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=90&fit=crop',
  false,
  2,
  'Façade moderne avec balcons vue mer'
FROM projects WHERE url_slug = 'azure-marina-paradise-limassol' OR title ILIKE '%Azure%'
ON CONFLICT DO NOTHING;

INSERT INTO project_images (project_id, url, is_primary, display_order, caption)
SELECT 
  id,
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1920&q=90&fit=crop',
  false,
  3,
  'Espaces communs extérieurs avec piscine'
FROM projects WHERE url_slug = 'azure-marina-paradise-limassol' OR title ILIKE '%Azure%'
ON CONFLICT DO NOTHING;

INSERT INTO project_images (project_id, url, is_primary, display_order, caption)
SELECT 
  id,
  'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1920&q=90&fit=crop',
  false,
  4,
  'Vue depuis une terrasse d''appartement'
FROM projects WHERE url_slug = 'azure-marina-paradise-limassol' OR title ILIKE '%Azure%'
ON CONFLICT DO NOTHING;

-- ================================================
-- 3. MOUNTAIN VIEW VILLAS (Limassol Hills)
-- ================================================
-- Thème: Villas de luxe avec vue montagne/mer

INSERT INTO project_images (project_id, url, is_primary, display_order, caption)
SELECT 
  id,
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1920&q=90&fit=crop',
  true,
  1,
  'Mountain View Villas - Architecture moderne en hauteur'
FROM projects WHERE url_slug = 'mountain-view-villas-limassol' OR title ILIKE '%Mountain View%'
ON CONFLICT DO NOTHING;

INSERT INTO project_images (project_id, url, is_primary, display_order, caption)
SELECT 
  id,
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1920&q=90&fit=crop',
  false,
  2,
  'Villa avec piscine privée et jardin paysager'
FROM projects WHERE url_slug = 'mountain-view-villas-limassol' OR title ILIKE '%Mountain View%'
ON CONFLICT DO NOTHING;

INSERT INTO project_images (project_id, url, is_primary, display_order, caption)
SELECT 
  id,
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1920&q=90&fit=crop',
  false,
  3,
  'Vue panoramique montagne et mer Méditerranée'
FROM projects WHERE url_slug = 'mountain-view-villas-limassol' OR title ILIKE '%Mountain View%'
ON CONFLICT DO NOTHING;

INSERT INTO project_images (project_id, url, is_primary, display_order, caption)
SELECT 
  id,
  'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=1920&q=90&fit=crop',
  false,
  4,
  'Intérieur spacieux avec grandes baies vitrées'
FROM projects WHERE url_slug = 'mountain-view-villas-limassol' OR title ILIKE '%Mountain View%'
ON CONFLICT DO NOTHING;

-- ================================================
-- 4. SKYLINE TOWER (Nicosia)
-- ================================================
-- Thème: Tour moderne urbaine, appartements standing

INSERT INTO project_images (project_id, url, is_primary, display_order, caption)
SELECT 
  id,
  'https://images.unsplash.com/photo-1486718448742-163732cd1544?w=1920&q=90&fit=crop',
  true,
  1,
  'Skyline Tower - Gratte-ciel moderne Nicosia'
FROM projects WHERE url_slug = 'skyline-tower-nicosia' OR title ILIKE '%Skyline%'
ON CONFLICT DO NOTHING;

INSERT INTO project_images (project_id, url, is_primary, display_order, caption)
SELECT 
  id,
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&q=90&fit=crop',
  false,
  2,
  'Vue aérienne de la tour dans le centre-ville'
FROM projects WHERE url_slug = 'skyline-tower-nicosia' OR title ILIKE '%Skyline%'
ON CONFLICT DO NOTHING;

INSERT INTO project_images (project_id, url, is_primary, display_order, caption)
SELECT 
  id,
  'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=1920&q=90&fit=crop',
  false,
  3,
  'Lobby de la tour avec concierge premium'
FROM projects WHERE url_slug = 'skyline-tower-nicosia' OR title ILIKE '%Skyline%'
ON CONFLICT DO NOTHING;

INSERT INTO project_images (project_id, url, is_primary, display_order, caption)
SELECT 
  id,
  'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1920&q=90&fit=crop',
  false,
  4,
  'Appartement penthouse avec terrasse panoramique'
FROM projects WHERE url_slug = 'skyline-tower-nicosia' OR title ILIKE '%Skyline%'
ON CONFLICT DO NOTHING;

-- ================================================
-- PHOTOS GÉNÉRIQUES FALLBACK (si projets non trouvés)
-- ================================================
-- Si les URL slugs ne matchent pas, utiliser les IDs directement

-- Marina Bay Residences
INSERT INTO project_images (project_id, url, is_primary, display_order, caption)
SELECT 
  p.id,
  urls.url,
  (urls.display_order = 1) as is_primary,
  urls.display_order,
  urls.caption
FROM projects p
CROSS JOIN (
  VALUES 
    ('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=90', 1, 'Vue extérieure front de mer'),
    ('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=90', 2, 'Piscine commune'),
    ('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=90', 3, 'Lobby luxueux'),
    ('https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1920&q=90', 4, 'Vue nocturne')
) AS urls(url, display_order, caption)
WHERE p.title ILIKE '%Marina Bay%'
  AND NOT EXISTS (
    SELECT 1 FROM project_images pi WHERE pi.project_id = p.id
  )
ON CONFLICT DO NOTHING;

-- ================================================
-- RAPPORT FINAL
-- ================================================
DO $$
DECLARE
  total_images INTEGER;
  projects_with_images INTEGER;
BEGIN
  -- Compter total images
  SELECT COUNT(*) INTO total_images FROM project_images;
  
  -- Compter projets avec images
  SELECT COUNT(DISTINCT project_id) INTO projects_with_images FROM project_images;
  
  RAISE NOTICE '================================================';
  RAISE NOTICE 'RÉSULTATS SEED PHOTOS UNSPLASH';
  RAISE NOTICE '================================================';
  RAISE NOTICE 'Total images insérées: %', total_images;
  RAISE NOTICE 'Projets avec photos: %', projects_with_images;
  RAISE NOTICE '================================================';
  
  -- Afficher détails par projet
  FOR rec IN 
    SELECT 
      p.title,
      p.url_slug,
      COUNT(pi.id) as photo_count,
      STRING_AGG(pi.caption, ', ' ORDER BY pi.display_order) as captions
    FROM projects p
    LEFT JOIN project_images pi ON pi.project_id = p.id
    GROUP BY p.id, p.title, p.url_slug
    ORDER BY p.title
  LOOP
    RAISE NOTICE '✅ % (%): % photos', rec.title, rec.url_slug, rec.photo_count;
  END LOOP;
  
  RAISE NOTICE '================================================';
END $$;