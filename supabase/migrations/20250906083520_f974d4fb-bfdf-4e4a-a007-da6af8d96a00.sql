-- Migration pour mettre à jour la table projects avec le schéma complet ENKI-REALTY

-- Créer ou mettre à jour la table projects
DO $$ 
BEGIN
    -- Vérifier si la table existe et la créer si nécessaire
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'projects') THEN
        CREATE TABLE public.projects (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            title TEXT NOT NULL,
            subtitle TEXT,
            description TEXT,
            location TEXT NOT NULL,
            price_from TEXT,
            completion_date TEXT,
            status TEXT NOT NULL DEFAULT 'under_construction',
            furniture_status TEXT,
            livability BOOLEAN DEFAULT false,
            video_url TEXT,
            photos TEXT[] DEFAULT array[]::TEXT[],
            features TEXT[] DEFAULT array[]::TEXT[],
            amenities TEXT[] DEFAULT array[]::TEXT[],
            units JSONB[] DEFAULT array[]::JSONB[],
            virtual_tour_url TEXT,
            map_image TEXT,
            interests JSONB[] DEFAULT array[]::JSONB[],
            developer_id UUID,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
    ELSE
        -- Ajouter les nouvelles colonnes si elles n'existent pas
        BEGIN
            ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS subtitle TEXT;
            ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS price_from TEXT;
            ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS completion_date TEXT;
            ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'under_construction';
            ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS furniture_status TEXT;
            ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS livability BOOLEAN DEFAULT false;
            ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS video_url TEXT;
            ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS amenities TEXT[] DEFAULT array[]::TEXT[];
            ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS units JSONB[] DEFAULT array[]::JSONB[];
            ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS virtual_tour_url TEXT;
            ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS map_image TEXT;
            ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS interests JSONB[] DEFAULT array[]::JSONB[];
            ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS developer_id UUID;
            
            -- Mettre à jour les colonnes existantes pour s'assurer qu'elles ont les bonnes contraintes
            ALTER TABLE public.projects ALTER COLUMN status SET DEFAULT 'under_construction';
            UPDATE public.projects SET status = 'under_construction' WHERE status IS NULL;
            ALTER TABLE public.projects ALTER COLUMN status SET NOT NULL;
            
            -- S'assurer que les colonnes array ont les bonnes valeurs par défaut
            UPDATE public.projects SET photos = array[]::TEXT[] WHERE photos IS NULL;
            UPDATE public.projects SET features = array[]::TEXT[] WHERE features IS NULL;
            UPDATE public.projects SET amenities = array[]::TEXT[] WHERE amenities IS NULL;
            UPDATE public.projects SET units = array[]::JSONB[] WHERE units IS NULL;
            UPDATE public.projects SET interests = array[]::JSONB[] WHERE interests IS NULL;
            
            ALTER TABLE public.projects ALTER COLUMN photos SET DEFAULT array[]::TEXT[];
            ALTER TABLE public.projects ALTER COLUMN features SET DEFAULT array[]::TEXT[];
            ALTER TABLE public.projects ALTER COLUMN amenities SET DEFAULT array[]::TEXT[];
            ALTER TABLE public.projects ALTER COLUMN units SET DEFAULT array[]::JSONB[];
            ALTER TABLE public.projects ALTER COLUMN interests SET DEFAULT array[]::JSONB[];
        EXCEPTION
            WHEN others THEN
                RAISE NOTICE 'Erreur lors de l''ajout des colonnes: %', SQLERRM;
        END;
    END IF;
END $$;

-- Ajouter les contraintes CHECK
DO $$
BEGIN
    -- Contrainte pour le statut du projet
    IF NOT EXISTS (SELECT FROM information_schema.check_constraints WHERE constraint_name = 'projects_status_check') THEN
        ALTER TABLE public.projects ADD CONSTRAINT projects_status_check 
        CHECK (status IN ('pre_launch', 'under_construction', 'ready_for_delivery', 'completed', 'ready_to_move', 'sold_out'));
    END IF;

    -- Contrainte pour le statut de l'ameublement
    IF NOT EXISTS (SELECT FROM information_schema.check_constraints WHERE constraint_name = 'projects_furniture_status_check') THEN
        ALTER TABLE public.projects ADD CONSTRAINT projects_furniture_status_check 
        CHECK (furniture_status IS NULL OR furniture_status IN ('fully_furnished', 'semi_furnished', 'unfurnished', 'customizable'));
    END IF;
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Erreur lors de l''ajout des contraintes CHECK: %', SQLERRM;
END $$;

-- Créer les index pour les performances
CREATE INDEX IF NOT EXISTS idx_projects_location ON public.projects USING gin(to_tsvector('english', location));
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects (status);
CREATE INDEX IF NOT EXISTS idx_projects_livability ON public.projects (livability);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects (created_at DESC);

-- Activer RLS sur la table
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Admin CRUD access" ON public.projects;
DROP POLICY IF EXISTS "Public read access" ON public.projects;
DROP POLICY IF EXISTS "Admins can manage all projects" ON public.projects;
DROP POLICY IF EXISTS "Allow public read access" ON public.projects;

-- Créer les politiques RLS
CREATE POLICY "Admins can manage all projects" ON public.projects
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

CREATE POLICY "Allow public read access" ON public.projects
FOR SELECT USING (true);

-- Créer ou remplacer la fonction de mise à jour du timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Créer le trigger pour updated_at
DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insérer quelques projets de test avec des données variées
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
    units
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
    ]
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
    ]
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
    ]
)
ON CONFLICT (id) DO NOTHING;

-- Vérification des données
DO $$
DECLARE
    project_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO project_count FROM public.projects;
    RAISE NOTICE 'Nombre total de projets dans la table: %', project_count;
    
    -- Vérifier les politiques RLS
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND schemaname = 'public') THEN
        RAISE NOTICE 'Politiques RLS configurées avec succès';
    ELSE
        RAISE WARNING 'Aucune politique RLS trouvée pour la table projects';
    END IF;
END $$;