-- Migration simplifiée pour ajouter les nouvelles tables Enki Reality

-- 1. Créer table developers si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'developers') THEN
        CREATE TABLE developers (
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
    END IF;
END $$;

-- 2. Créer table buildings si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'buildings') THEN
        CREATE TABLE buildings (
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
    END IF;
END $$;

-- 3. Ajouter nouvelles colonnes à projects
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'developer_id') THEN
        ALTER TABLE projects ADD COLUMN developer_id UUID REFERENCES developers(id);
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'golden_visa_eligible') THEN
        ALTER TABLE projects ADD COLUMN golden_visa_eligible BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'reservation_status') THEN
        ALTER TABLE projects ADD COLUMN reservation_status TEXT DEFAULT 'available' CHECK (reservation_status IN ('available', 'reserved', 'sold'));
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'vat_rate') THEN
        ALTER TABLE projects ADD COLUMN vat_rate DECIMAL(4,2) DEFAULT 5.00;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'commission_rate') THEN
        ALTER TABLE projects ADD COLUMN commission_rate DECIMAL(4,2);
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'cyprus_zone') THEN
        ALTER TABLE projects ADD COLUMN cyprus_zone TEXT DEFAULT 'limassol' CHECK (cyprus_zone IN ('limassol', 'paphos', 'larnaca', 'nicosia', 'famagusta', 'kyrenia'));
    END IF;
END $$;

-- 4. Insérer données test pour développeurs
INSERT INTO developers (name, contact_info, commission_rate, status) 
SELECT 'Limassol Marina', '{"email": "sales@limassolmarina.com", "phone": "+357 25 030 300"}', 4.00, 'active'
WHERE NOT EXISTS (SELECT 1 FROM developers WHERE name = 'Limassol Marina');

INSERT INTO developers (name, contact_info, commission_rate, status) 
SELECT 'Leptos Group', '{"email": "info@leptos.com", "phone": "+357 26 820 000"}', 3.50, 'active'
WHERE NOT EXISTS (SELECT 1 FROM developers WHERE name = 'Leptos Group');