-- Ajouter des projets de test avec des données complètes
INSERT INTO public.projects (
    title, 
    subtitle, 
    description, 
    location, 
    price_from, 
    completion_date, 
    status, 
    furniture_status, 
    livability, 
    features, 
    amenities, 
    units,
    photos
) VALUES 
(
    'Les Jardins d''Eden',
    'A serene coastal retreat in the heart of Limassol',
    'Les Jardins d''Eden combines modern architecture with lush greenery, offering a sanctuary of calm in Limassol''s vibrant coast. This exclusive residential complex features energy-efficient design and smart home integration.',
    'Limassol',
    '€250,000',
    'Q4 2026',
    'under_construction',
    'customizable',
    false,
    ARRAY['Energy-efficient design', 'Proximity to Limassol Marina', 'Smart home integration', 'Furnished showrooms available'],
    ARRAY['pool', 'gym', 'gardens', 'security', 'parking', 'sea_view'],
    ARRAY[
        '{"type": "Apartment", "price": "€300,000", "status": "available", "description": "2-bedroom apartment with sea view", "furniture_status": "customizable", "livability": false}'::jsonb,
        '{"type": "Villa", "price": "€750,000", "status": "available", "description": "4-bedroom villa with private pool", "furniture_status": "fully_furnished", "livability": false}'::jsonb
    ],
    ARRAY['https://picsum.photos/800/600?random=1', 'https://picsum.photos/800/600?random=2', 'https://picsum.photos/800/600?random=3']
),
(
    'Marina Heights',
    'Luxury living by the marina',
    'An upscale residential tower offering panoramic views of the Mediterranean Sea and Limassol Marina. Features include premium finishes, concierge services, and world-class amenities.',
    'Limassol',
    '€400,000',
    'Q2 2025',
    'ready_to_move',
    'fully_furnished',
    true,
    ARRAY['Marina views', 'Concierge service', 'Premium finishes', 'Underground parking'],
    ARRAY['pool', 'gym', 'concierge_service', 'parking', 'sea_view', 'security'],
    ARRAY[
        '{"type": "Penthouse", "price": "€950,000", "status": "available", "description": "3-bedroom penthouse with private terrace", "furniture_status": "fully_furnished", "livability": true}'::jsonb
    ],
    ARRAY['https://picsum.photos/800/600?random=4', 'https://picsum.photos/800/600?random=5']
),
(
    'Cyprus Green Valley',
    'Sustainable living in nature',
    'An eco-friendly residential project nestled in the rolling hills of Paphos. Features solar panels, rainwater harvesting, and sustainable materials throughout.',
    'Paphos',
    '€180,000',
    'Q1 2025',
    'completed',
    'semi_furnished',
    true,
    ARRAY['Solar panels', 'Rainwater harvesting', 'Sustainable materials', 'Hiking trails access'],
    ARRAY['gardens', 'solar_panels', 'rainwater_harvesting', 'sustainable_materials', 'cycle_paths'],
    ARRAY[
        '{"type": "Villa", "price": "€350,000", "status": "sold", "description": "3-bedroom eco-villa", "furniture_status": "semi_furnished", "livability": true}'::jsonb,
        '{"type": "Apartment", "price": "€180,000", "status": "available", "description": "1-bedroom eco-apartment", "furniture_status": "unfurnished", "livability": true}'::jsonb
    ],
    ARRAY['https://picsum.photos/800/600?random=6', 'https://picsum.photos/800/600?random=7', 'https://picsum.photos/800/600?random=8']
),
(
    'Sunset Villas Paphos',
    'Luxury villas with stunning sunset views',
    'Premium collection of villas offering breathtaking sunset views over the Mediterranean. Each villa features private pools, spacious terraces, and high-end finishes.',
    'Paphos',
    '€650,000',
    'Q3 2025',
    'pre_launch',
    'unfurnished',
    false,
    ARRAY['Private pools', 'Sunset views', 'Premium finishes', 'Spacious terraces'],
    ARRAY['pool', 'sea_view', 'gardens', 'parking', 'security'],
    ARRAY[
        '{"type": "Villa", "price": "€650,000", "status": "available", "description": "4-bedroom luxury villa", "furniture_status": "unfurnished", "livability": false}'::jsonb,
        '{"type": "Villa", "price": "€850,000", "status": "available", "description": "5-bedroom premium villa", "furniture_status": "unfurnished", "livability": false}'::jsonb
    ],
    ARRAY['https://picsum.photos/800/600?random=9', 'https://picsum.photos/800/600?random=10']
),
(
    'City Center Residences',
    'Modern living in the heart of Nicosia',
    'Contemporary apartments in the vibrant center of Nicosia, offering easy access to business districts, shopping, and cultural attractions.',
    'Nicosia',
    '€120,000',
    'Q1 2024',
    'sold_out',
    'semi_furnished',
    true,
    ARRAY['City center location', 'Modern amenities', 'Cultural attractions nearby', 'Business district access'],
    ARRAY['gym', 'parking', 'security', 'balconies'],
    ARRAY[
        '{"type": "Apartment", "price": "€120,000", "status": "sold", "description": "1-bedroom city apartment", "furniture_status": "semi_furnished", "livability": true}'::jsonb,
        '{"type": "Apartment", "price": "€180,000", "status": "sold", "description": "2-bedroom city apartment", "furniture_status": "semi_furnished", "livability": true}'::jsonb
    ],
    ARRAY['https://picsum.photos/800/600?random=11', 'https://picsum.photos/800/600?random=12']
)
ON CONFLICT (id) DO NOTHING;

-- Vérification des données insérées
SELECT 
    title, 
    status, 
    livability, 
    furniture_status,
    array_length(amenities, 1) as amenities_count,
    array_length(units, 1) as units_count
FROM public.projects
ORDER BY created_at DESC;