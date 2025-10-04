-- Migration: 006 - Create press mentions table
-- Priority: P0 - CRITICAL for Section 10 (Social Proof)
-- Date: 2025-01-04

CREATE TABLE IF NOT EXISTS press_mentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id UUID REFERENCES developers(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  
  media_name TEXT NOT NULL,
  media_logo_url TEXT,
  
  article_title TEXT NOT NULL,
  article_url TEXT NOT NULL,
  article_excerpt TEXT,
  
  publish_date DATE,
  
  display_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_press_developer ON press_mentions(developer_id);
CREATE INDEX IF NOT EXISTS idx_press_project ON press_mentions(project_id);
CREATE INDEX IF NOT EXISTS idx_press_date ON press_mentions(publish_date DESC);

-- Add comments
COMMENT ON TABLE press_mentions IS 'Articles presse médias reconnus pour crédibilité';
COMMENT ON COLUMN press_mentions.media_name IS 'Nom média (Financial Mirror, Cyprus Mail, etc.)';

DO $$
BEGIN
  RAISE NOTICE '✅ Migration 006 completed: Press mentions table created';
END $$;