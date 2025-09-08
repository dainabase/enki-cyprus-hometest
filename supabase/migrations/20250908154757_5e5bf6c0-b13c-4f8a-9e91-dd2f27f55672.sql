-- Ajouter les nouveaux champs pour les médias catégorisés
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS categorized_photos JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS project_presentation_url TEXT,
ADD COLUMN IF NOT EXISTS youtube_tour_url TEXT,
ADD COLUMN IF NOT EXISTS vimeo_tour_url TEXT;