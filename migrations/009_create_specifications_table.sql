-- Migration: 009 - Create project specifications table
-- Priority: P1 - Important for Section 8 (Finitions)
-- Date: 2025-01-04

CREATE TABLE IF NOT EXISTS project_specifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Kitchen
  kitchen_brand TEXT,
  kitchen_countertop TEXT,
  kitchen_appliances JSONB DEFAULT '[]'::jsonb,
  
  -- Bathroom
  bathroom_brand TEXT,
  bathroom_fixtures TEXT,
  bathroom_features JSONB DEFAULT '[]'::jsonb,
  
  -- Flooring
  flooring_living TEXT,
  flooring_bedrooms TEXT,
  flooring_bathrooms TEXT,
  
  -- Windows & Doors
  windows_type TEXT,
  windows_features JSONB DEFAULT '[]'::jsonb,
  doors_type TEXT,
  
  -- HVAC
  hvac_type TEXT,
  hvac_heating TEXT,
  hvac_control TEXT,
  
  -- Security
  security_door TEXT,
  security_intercom TEXT,
  security_alarm TEXT,
  security_cctv TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_project_specs UNIQUE (project_id)
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_specifications_project ON project_specifications(project_id);

-- Add comments
COMMENT ON TABLE project_specifications IS 'Spécifications techniques et finitions projet';
COMMENT ON COLUMN project_specifications.kitchen_appliances IS 'JSON array: ["Four encastré", "Plaque induction", "Hotte", "Lave-vaisselle"]';
COMMENT ON COLUMN project_specifications.bathroom_features IS 'JSON array: ["Douche pluie", "Robinetterie thermostatique"]';
COMMENT ON COLUMN project_specifications.windows_features IS 'JSON array: ["Isolation thermique A+", "Isolation acoustique"]';

-- Create updated_at trigger
CREATE TRIGGER update_specifications_updated_at
BEFORE UPDATE ON project_specifications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DO $$
BEGIN
  RAISE NOTICE '✅ Migration 009 completed: Project specifications table created';
END $$;