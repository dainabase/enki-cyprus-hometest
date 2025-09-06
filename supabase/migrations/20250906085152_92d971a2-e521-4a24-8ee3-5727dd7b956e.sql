-- Insérer des projets de test (compatibles avec le schéma actuel)
-- location est de type jsonb, description/type/price sont NOT NULL

INSERT INTO public.projects (
  title, description, type, price, location, price_from, status, photos, amenities
) VALUES
(
  'Les Jardins d''Eden',
  'Un complexe résidentiel moderne avec espaces verts luxuriants dans le cœur vibrant de Limassol.',
  'Residential',
  250000,
  '{"city":"Limassol"}'::jsonb,
  '€250,000',
  'under_construction',
  ARRAY['https://picsum.photos/800/600?random=101','https://picsum.photos/800/600?random=102'],
  ARRAY['pool','gym','gardens','security','parking','sea_view']
),
(
  'Marina Heights',
  'Tour résidentielle haut de gamme avec vues panoramiques sur la Méditerranée et la marina.',
  'Residential',
  400000,
  '{"city":"Limassol"}'::jsonb,
  '€400,000',
  'ready_to_move',
  ARRAY['https://picsum.photos/800/600?random=103','https://picsum.photos/800/600?random=104'],
  ARRAY['pool','gym','concierge_service','parking','sea_view','security']
),
(
  'Cyprus Green Valley',
  'Projet écologique niché dans les collines de Paphos, matériaux durables et panneaux solaires.',
  'Eco-Residential',
  180000,
  '{"city":"Paphos"}'::jsonb,
  '€180,000',
  'completed',
  ARRAY['https://picsum.photos/800/600?random=105','https://picsum.photos/800/600?random=106'],
  ARRAY['gardens','solar_panels','rainwater_harvesting','sustainable_materials']
),
(
  'Sunset Villas Paphos',
  'Villas premium avec vues spectaculaires sur les couchers de soleil et piscines privées.',
  'Luxury',
  650000,
  '{"city":"Paphos"}'::jsonb,
  '€650,000',
  'pre_launch',
  ARRAY['https://picsum.photos/800/600?random=107','https://picsum.photos/800/600?random=108'],
  ARRAY['pool','sea_view','gardens','parking','security']
),
(
  'City Center Residences',
  'Appartements contemporains au centre vibrant de Nicosie, proches des affaires et commerces.',
  'Urban',
  120000,
  '{"city":"Nicosia"}'::jsonb,
  '€120,000',
  'sold_out',
  ARRAY['https://picsum.photos/800/600?random=109','https://picsum.photos/800/600?random=110'],
  ARRAY['gym','parking','security','balconies']
);