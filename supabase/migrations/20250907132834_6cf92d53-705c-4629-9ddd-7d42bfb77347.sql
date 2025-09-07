-- Migration pour créer la structure hiérarchique Enki Reality
-- Développeurs → Projets → Bâtiments → Unités (properties)

-- 1. Table des développeurs
CREATE TABLE IF NOT EXISTS developers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo TEXT,
  contact_info JSONB DEFAULT '{}',
  website TEXT,
  commission_rate DECIMAL(4,2) DEFAULT 3.00,
  payment_terms TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table des bâtiments
CREATE TABLE IF NOT EXISTS buildings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  building_type TEXT DEFAULT 'residential',
  total_floors INTEGER DEFAULT 1,
  total_units INTEGER DEFAULT 1,
  construction_status TEXT DEFAULT 'planned' CHECK (construction_status IN ('planned', 'construction', 'completed')),
  energy_rating TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enrichir la table projects existante
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS developer_id UUID REFERENCES developers(id),
ADD COLUMN IF NOT EXISTS total_units INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS units_sold INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS units_available INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS construction_start DATE,
ADD COLUMN IF NOT EXISTS project_status TEXT DEFAULT 'planned' CHECK (project_status IN ('planned', 'construction', 'completed'));

-- 4. Enrichir la table projects pour les champs spécifiques aux unités
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS building_id UUID REFERENCES buildings(id),
ADD COLUMN IF NOT EXISTS floor_number INTEGER,
ADD COLUMN IF NOT EXISTS unit_number TEXT,
ADD COLUMN IF NOT EXISTS construction_phase TEXT DEFAULT 'planned',
ADD COLUMN IF NOT EXISTS title_deed_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS vat_rate DECIMAL(4,2) DEFAULT 5.00,
ADD COLUMN IF NOT EXISTS transfer_fee DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS commission_rate DECIMAL(4,2),
ADD COLUMN IF NOT EXISTS reservation_status TEXT DEFAULT 'available' CHECK (reservation_status IN ('available', 'reserved', 'sold')),
ADD COLUMN IF NOT EXISTS meta_title VARCHAR(60),
ADD COLUMN IF NOT EXISTS meta_description VARCHAR(160),
ADD COLUMN IF NOT EXISTS url_slug TEXT,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS featured_property BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}';

-- 5. Trigger pour Golden Visa automatique
CREATE OR REPLACE FUNCTION check_golden_visa()
RETURNS TRIGGER AS $$
BEGIN
  NEW.golden_visa_eligible = (NEW.price >= 300000);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS golden_visa_check ON projects;
CREATE TRIGGER golden_visa_check
  BEFORE INSERT OR UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION check_golden_visa();

-- 6. Trigger pour mettre à jour updated_at
CREATE TRIGGER update_developers_updated_at
  BEFORE UPDATE ON developers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buildings_updated_at
  BEFORE UPDATE ON buildings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 7. Activer RLS sur les nouvelles tables
ALTER TABLE developers ENABLE ROW LEVEL SECURITY;
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;

-- 8. Policies RLS pour les développeurs
CREATE POLICY "Admins can manage all developers" ON developers
FOR ALL TO authenticated
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Public can view active developers" ON developers
FOR SELECT TO public
USING (status = 'active');

-- 9. Policies RLS pour les bâtiments
CREATE POLICY "Admins can manage all buildings" ON buildings
FOR ALL TO authenticated
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Public can view buildings" ON buildings
FOR SELECT TO public
USING (true);

-- 10. Index pour performance
CREATE INDEX IF NOT EXISTS idx_projects_developer_id ON projects(developer_id);
CREATE INDEX IF NOT EXISTS idx_buildings_project_id ON buildings(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_building_id ON projects(building_id);
CREATE INDEX IF NOT EXISTS idx_projects_reservation_status ON projects(reservation_status);
CREATE INDEX IF NOT EXISTS idx_projects_golden_visa ON projects(golden_visa_eligible);
CREATE INDEX IF NOT EXISTS idx_projects_price_range ON projects(price) WHERE price >= 300000;

-- 11. Données de test pour développeurs
INSERT INTO developers (name, contact_info, commission_rate, status) VALUES
('Limassol Marina', '{"email": "sales@limassolmarina.com", "phone": "+357 25 030 300"}', 4.00, 'active'),
('Leptos Group', '{"email": "info@leptos.com", "phone": "+357 26 820 000"}', 3.50, 'active'),
('Aristo Developers', '{"email": "info@aristodevelopers.com", "phone": "+357 25 325 555"}', 3.00, 'active');