-- Insérer des projets de test simples
INSERT INTO public.projects (
    title, 
    description, 
    location, 
    price_from, 
    status, 
    features, 
    amenities
) VALUES 
(
    'Les Jardins d''Eden',
    'Un complexe résidentiel moderne avec espaces verts luxuriants dans le cœur vibrant de Limassol.',
    'Limassol',
    '€250,000',
    'under_construction',
    ARRAY['Design éco-énergétique', 'Proximité du port de Limassol', 'Intégration domotique'],
    ARRAY['pool', 'gym', 'gardens', 'security', 'parking', 'sea_view']
),
(
    'Marina Heights',
    'Tour résidentielle haut de gamme offrant des vues panoramiques sur la Méditerranée et le port de Limassol.',
    'Limassol',
    '€400,000',
    'ready_to_move',
    ARRAY['Vues sur le port', 'Service de conciergerie', 'Finitions premium'],
    ARRAY['pool', 'gym', 'concierge_service', 'parking', 'sea_view', 'security']
),
(
    'Cyprus Green Valley',
    'Projet immobilier écologique niché dans les collines verdoyantes de Paphos.',
    'Paphos',
    '€180,000',
    'completed',
    ARRAY['Panneaux solaires', 'Récupération eau de pluie', 'Matériaux durables'],
    ARRAY['gardens', 'solar_panels', 'rainwater_harvesting', 'sustainable_materials']
),
(
    'Sunset Villas Paphos',
    'Collection premium de villas offrant des vues spectaculaires sur les couchers de soleil.',
    'Paphos',
    '€650,000',
    'pre_launch',
    ARRAY['Piscines privées', 'Vues coucher de soleil', 'Finitions premium'],
    ARRAY['pool', 'sea_view', 'gardens', 'parking', 'security']
),
(
    'City Center Residences',
    'Appartements contemporains au centre vibrant de Nicosie.',
    'Nicosia',
    '€120,000',
    'sold_out',
    ARRAY['Localisation centre-ville', 'Équipements modernes', 'Accès quartier affaires'],
    ARRAY['gym', 'parking', 'security', 'balconies']
)
ON CONFLICT (title) DO NOTHING;

-- Ajouter des photos aux projets
UPDATE public.projects 
SET photos = ARRAY[
    'https://picsum.photos/800/600?random=1', 
    'https://picsum.photos/800/600?random=2', 
    'https://picsum.photos/800/600?random=3'
]
WHERE title = 'Les Jardins d''Eden';

UPDATE public.projects 
SET photos = ARRAY[
    'https://picsum.photos/800/600?random=4', 
    'https://picsum.photos/800/600?random=5'
]
WHERE title = 'Marina Heights';

UPDATE public.projects 
SET photos = ARRAY[
    'https://picsum.photos/800/600?random=6', 
    'https://picsum.photos/800/600?random=7'
]
WHERE title = 'Cyprus Green Valley';

-- Vérifier les données insérées
SELECT 
    title, 
    status, 
    price_from,
    array_length(features, 1) as features_count,
    array_length(amenities, 1) as amenities_count,
    array_length(photos, 1) as photos_count
FROM public.projects
ORDER BY created_at DESC;