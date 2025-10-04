-- Migration: 010 - Create energy performance table
-- Priority: P1 - Important for Section 8 (Specifications)
-- Date: 2025-01-04

CREATE TABLE IF NOT EXISTS project_energy_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Certification
  rating_class VARCHAR(2) CHECK (rating_class IN ('A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G')),
  dpe_score INTEGER,
  
  -- Consumption
  consumption_kwh_per_m2 NUMERIC,
  consumption_co2_kg_per_m2 NUMERIC,
  
  -- Systems
  has_solar_panels BOOLEAN DEFAULT false,
  solar_capacity_kw NUMERIC,
  has_heat_pump BOOLEAN DEFAULT false,
  has_thermal_insulation BOOLEAN DEFAULT true,
  insulation_rating TEXT,
  
  -- Certifications
  certifications JSONB DEFAULT '[]'::jsonb,
  
  -- Certificate details
  certificate_number TEXT,
  certificate_date DATE,
  certificate_url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_project_energy UNIQUE (project_id)
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_energy_project ON project_energy_performance(project_id);
CREATE INDEX IF NOT EXISTS idx_energy_rating ON project_energy_performance(rating_class);

-- Add comments
COMMENT ON TABLE project_energy_performance IS 'Performance énergétique et certifications environnementales';
COMMENT ON COLUMN project_energy_performance.rating_class IS 'Classe énergétique européenne (A+ à G)';
COMMENT ON COLUMN project_energy_performance.certifications IS 'JSON array: [{name, date, issuer, url}]';

DO $$
BEGIN
  RAISE NOTICE '✅ Migration 010 completed: Energy performance table created';
END $$;