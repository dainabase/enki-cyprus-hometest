-- Table pipeline_stages (pour personnalisation future)
CREATE TABLE IF NOT EXISTS pipeline_stages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stage_key VARCHAR(50) UNIQUE NOT NULL, -- new, contacted, qualified, etc.
  display_name VARCHAR(100) NOT NULL,
  display_order INTEGER NOT NULL,
  color VARCHAR(7), -- Hex color
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE pipeline_stages ENABLE ROW LEVEL SECURITY;

-- RLS Policy for pipeline_stages
CREATE POLICY "Admins can manage pipeline stages" 
ON pipeline_stages FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

CREATE POLICY "Everyone can view active pipeline stages" 
ON pipeline_stages FOR SELECT 
USING (is_active = true);

-- Insérer les étapes par défaut
INSERT INTO pipeline_stages (stage_key, display_name, display_order, color) VALUES
('new', 'Nouveau', 1, '#3B82F6'),
('contacted', 'Contacté', 2, '#EAB308'),
('qualified', 'Qualifié', 3, '#10B981'),
('opportunity', 'Opportunité', 4, '#8B5CF6'),
('converted', 'Converti', 5, '#059669'),
('lost', 'Perdu', 6, '#EF4444');

-- Ajouter une colonne pour tracker le changement de statut
ALTER TABLE leads ADD COLUMN IF NOT EXISTS status_changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Trigger pour mettre à jour status_changed_at
CREATE OR REPLACE FUNCTION update_status_changed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD IS NULL OR NEW.status != OLD.status THEN
    NEW.status_changed_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS trigger_update_status_changed_at ON leads;

-- Create trigger
CREATE TRIGGER trigger_update_status_changed_at
BEFORE INSERT OR UPDATE ON leads
FOR EACH ROW
EXECUTE FUNCTION update_status_changed_at();