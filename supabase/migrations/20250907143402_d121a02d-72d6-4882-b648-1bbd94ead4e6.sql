-- Table leads
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Informations de base
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  
  -- Informations qualification
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  urgency VARCHAR(20), -- immediate, 3_months, 6_months, 1_year, exploring
  property_type VARCHAR(50), -- apartment, house, villa, commercial
  zones TEXT[], -- Array des zones d'intérêt
  
  -- Gestion du lead
  status VARCHAR(20) DEFAULT 'new', -- new, contacted, qualified, opportunity, converted, lost
  score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 5),
  source VARCHAR(50), -- website, referral, agent, social_media, other
  assigned_to UUID REFERENCES developers(id),
  
  -- Golden Visa
  golden_visa_interest BOOLEAN DEFAULT false,
  
  -- Notes et tracking
  notes TEXT,
  last_contact_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table lead_activities
CREATE TABLE IF NOT EXISTS lead_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL, -- call, email, meeting, note, status_change
  description TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for leads
CREATE POLICY "Admins can manage all leads" 
ON leads FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

-- RLS Policies for lead_activities  
CREATE POLICY "Admins can manage all lead activities" 
ON lead_activities FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned ON leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score DESC);

-- Fonction pour calculer automatiquement le score
CREATE OR REPLACE FUNCTION calculate_lead_score()
RETURNS TRIGGER AS $$
DECLARE
  score_value INTEGER := 0;
BEGIN
  -- Score basé sur le budget (0-3 points)
  IF NEW.budget_max >= 300000 THEN
    score_value := score_value + 3;
  ELSIF NEW.budget_max >= 200000 THEN
    score_value := score_value + 2;
  ELSIF NEW.budget_max >= 100000 THEN
    score_value := score_value + 1;
  END IF;
  
  -- Score basé sur l'urgence (0-2 points)
  IF NEW.urgency = 'immediate' THEN
    score_value := score_value + 2;
  ELSIF NEW.urgency IN ('3_months', '6_months') THEN
    score_value := score_value + 1;
  END IF;
  
  NEW.score := score_value;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger pour calculer le score automatiquement
DROP TRIGGER IF EXISTS trigger_calculate_lead_score ON leads;
CREATE TRIGGER trigger_calculate_lead_score
BEFORE INSERT OR UPDATE ON leads
FOR EACH ROW
EXECUTE FUNCTION calculate_lead_score();

-- Trigger pour updated_at
CREATE TRIGGER update_leads_updated_at
BEFORE UPDATE ON leads
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();