-- Migration: 011 - Create construction timeline table
-- Priority: P1 - Important for Section 9 (Timeline)
-- Date: 2025-01-04

CREATE TABLE IF NOT EXISTS construction_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  phase_name TEXT NOT NULL,
  phase_order INTEGER NOT NULL,
  
  status TEXT CHECK (status IN ('upcoming', 'in_progress', 'completed', 'delayed')),
  
  start_date DATE,
  end_date DATE,
  completion_percentage INTEGER CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  
  milestones JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_project_phase_order UNIQUE (project_id, phase_order)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_phases_project ON construction_phases(project_id);
CREATE INDEX IF NOT EXISTS idx_phases_order ON construction_phases(phase_order);
CREATE INDEX IF NOT EXISTS idx_phases_status ON construction_phases(status);

-- Add comments
COMMENT ON TABLE construction_phases IS 'Phases construction et avancement projet';
COMMENT ON COLUMN construction_phases.milestones IS 'JSON array: [{description, date, completed: boolean}]';

-- Create updated_at trigger
CREATE TRIGGER update_phases_updated_at
BEFORE UPDATE ON construction_phases
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create function to calculate overall project completion
CREATE OR REPLACE FUNCTION calculate_project_completion(project_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  avg_completion INTEGER;
BEGIN
  SELECT COALESCE(AVG(completion_percentage)::INTEGER, 0)
  INTO avg_completion
  FROM construction_phases
  WHERE project_id = project_uuid;
  
  RETURN avg_completion;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION calculate_project_completion IS 'Calcule avancement global projet (moyenne phases)';

DO $$
BEGIN
  RAISE NOTICE '✅ Migration 011 completed: Construction timeline table created';
END $$;