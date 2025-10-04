-- Migration: 003 - Create testimonials table
-- Priority: P0 - CRITICAL for Section 10 (Social Proof)
-- Date: 2025-01-04

CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  developer_id UUID REFERENCES developers(id) ON DELETE CASCADE,
  
  -- Client identity
  name TEXT NOT NULL,
  nationality TEXT,
  flag_emoji TEXT,
  photo_url TEXT,
  
  -- Testimonial content
  text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  date DATE DEFAULT CURRENT_DATE,
  
  -- Video (CRITICAL for conversion +68%)
  video_url TEXT,
  video_thumbnail_url TEXT,
  video_duration INTEGER,
  
  -- Purchase context
  property_type TEXT,
  location TEXT,
  
  -- Validation
  verified BOOLEAN DEFAULT false,
  verification_method TEXT,
  
  -- Display
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  language TEXT DEFAULT 'fr',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_testimonials_project ON testimonials(project_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_developer ON testimonials(developer_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials(rating DESC);

-- Add comments
COMMENT ON TABLE testimonials IS 'Témoignages clients avec vidéos pour preuve sociale (+68% conversion)';
COMMENT ON COLUMN testimonials.video_url IS 'URL vidéo YouTube/Vimeo - CRITIQUE pour conversion';
COMMENT ON COLUMN testimonials.verified IS 'Témoignage vérifié authentique par équipe';
COMMENT ON COLUMN testimonials.verification_method IS 'Méthode validation: video_call, document, in_person';

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON testimonials
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DO $$
BEGIN
  RAISE NOTICE '✅ Migration 003 completed: Testimonials table created';
END $$;