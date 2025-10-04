-- Migration: 005 - Create awards table
-- Priority: P0 - CRITICAL for Section 10 (Social Proof)
-- Date: 2025-01-04

CREATE TABLE IF NOT EXISTS awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id UUID REFERENCES developers(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  
  name TEXT NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2100),
  category TEXT,
  organization TEXT,
  
  image_url TEXT,
  logo_url TEXT,
  certificate_url TEXT,
  
  description TEXT,
  
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_awards_developer ON awards(developer_id);
CREATE INDEX IF NOT EXISTS idx_awards_project ON awards(project_id);
CREATE INDEX IF NOT EXISTS idx_awards_year ON awards(year DESC);

-- Add comments
COMMENT ON TABLE awards IS 'Prix et certifications promoteur/projet pour crédibilité';
COMMENT ON COLUMN awards.organization IS 'Organisation décernant prix (ex: Cyprus Property Awards)';

DO $$
BEGIN
  RAISE NOTICE '✅ Migration 005 completed: Awards table created';
END $$;