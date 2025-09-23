-- Migration pour corriger les problèmes de structure et champs manquants
-- Date: 2025-09-23

-- 1. Corriger la structure des adresses dans projects
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS street_address TEXT,
ADD COLUMN IF NOT EXISTS postal_code VARCHAR(10),
ADD COLUMN IF NOT EXISTS auto_detected_zone BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS district VARCHAR(50),
ADD COLUMN IF NOT EXISTS municipality VARCHAR(100);

-- Migrer les données existantes de full_address vers les nouveaux champs
UPDATE projects
SET 
  street_address = COALESCE(
    SPLIT_PART(full_address, ',', 1),
    full_address
  ),
  postal_code = CASE 
    WHEN full_address LIKE '%[0-9][0-9][0-9][0-9]%' 
    THEN REGEXP_REPLACE(full_address, '.*([0-9]{4}).*', '\1')
    ELSE NULL
  END
WHERE full_address IS NOT NULL 
  AND street_address IS NULL;

-- 2. Ajouter les champs manquants dans les spécifications projet
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS energy_rating VARCHAR(2),
ADD COLUMN IF NOT EXISTS construction_materials TEXT[],
ADD COLUMN IF NOT EXISTS design_style VARCHAR(100),
ADD COLUMN IF NOT EXISTS building_certification VARCHAR(255),
ADD COLUMN IF NOT EXISTS construction_year INTEGER,
ADD COLUMN IF NOT EXISTS architect_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS architect_license_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS builder_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS renovation_year INTEGER,
ADD COLUMN IF NOT EXISTS maintenance_fees_yearly DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS property_tax_yearly DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS hoa_fees_monthly DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS building_insurance VARCHAR(255),
ADD COLUMN IF NOT EXISTS seismic_rating VARCHAR(10),
ADD COLUMN IF NOT EXISTS accessibility_features TEXT[],
ADD COLUMN IF NOT EXISTS internet_speed_mbps INTEGER,
ADD COLUMN IF NOT EXISTS pet_policy VARCHAR(20),
ADD COLUMN IF NOT EXISTS smoking_policy VARCHAR(20),
ADD COLUMN IF NOT EXISTS sustainability_certifications TEXT[],
ADD COLUMN IF NOT EXISTS warranty_years INTEGER,
ADD COLUMN IF NOT EXISTS finishing_level VARCHAR(20);

-- 3. Ajouter une contrainte de vérification pour energy_rating
ALTER TABLE projects
DROP CONSTRAINT IF EXISTS check_energy_rating;

ALTER TABLE projects
ADD CONSTRAINT check_energy_rating 
CHECK (energy_rating IN ('A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'));

-- 4. Ajouter les contraintes pour les politiques
ALTER TABLE projects
DROP CONSTRAINT IF EXISTS check_pet_policy;

ALTER TABLE projects
ADD CONSTRAINT check_pet_policy 
CHECK (pet_policy IN ('allowed', 'restricted', 'forbidden', NULL));

ALTER TABLE projects
DROP CONSTRAINT IF EXISTS check_smoking_policy;

ALTER TABLE projects
ADD CONSTRAINT check_smoking_policy 
CHECK (smoking_policy IN ('allowed', 'restricted', 'forbidden', NULL));

ALTER TABLE projects
DROP CONSTRAINT IF EXISTS check_finishing_level;

ALTER TABLE projects
ADD CONSTRAINT check_finishing_level 
CHECK (finishing_level IN ('basic', 'standard', 'premium', 'luxury', NULL));

-- 5. Créer une fonction pour détecter automatiquement la zone selon le code postal
CREATE OR REPLACE FUNCTION detect_cyprus_zone_from_postal(postal_code TEXT)
RETURNS TEXT AS $$
BEGIN
  IF postal_code IS NULL THEN
    RETURN 'limassol';
  END IF;
  
  -- Codes postaux de Chypre par zone
  CASE 
    WHEN postal_code BETWEEN '3000' AND '3999' THEN RETURN 'limassol';
    WHEN postal_code BETWEEN '8000' AND '8999' THEN RETURN 'paphos';
    WHEN postal_code BETWEEN '6000' AND '6999' THEN RETURN 'larnaca';
    WHEN postal_code BETWEEN '7000' AND '7999' THEN RETURN 'larnaca';
    WHEN postal_code BETWEEN '1000' AND '2999' THEN RETURN 'nicosia';
    WHEN postal_code BETWEEN '5000' AND '5999' THEN RETURN 'famagusta';
    ELSE RETURN 'limassol'; -- Default
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- 6. Créer une fonction pour détecter la ville depuis le code postal
CREATE OR REPLACE FUNCTION detect_city_from_postal(postal_code TEXT)
RETURNS TEXT AS $$
BEGIN
  IF postal_code IS NULL THEN
    RETURN NULL;
  END IF;
  
  CASE 
    WHEN postal_code BETWEEN '3000' AND '3999' THEN RETURN 'Limassol';
    WHEN postal_code BETWEEN '8000' AND '8999' THEN RETURN 'Paphos';
    WHEN postal_code BETWEEN '6000' AND '6999' THEN RETURN 'Larnaca';
    WHEN postal_code BETWEEN '7000' AND '7999' THEN RETURN 'Larnaca';
    WHEN postal_code BETWEEN '1000' AND '2999' THEN RETURN 'Nicosia';
    WHEN postal_code BETWEEN '5000' AND '5999' THEN RETURN 'Famagusta';
    ELSE RETURN NULL;
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- 7. Trigger pour auto-détecter la zone et la ville
CREATE OR REPLACE FUNCTION auto_detect_location()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-détecter la zone si postal_code existe et auto_detected_zone est true
  IF NEW.postal_code IS NOT NULL AND (NEW.auto_detected_zone = true OR NEW.cyprus_zone IS NULL) THEN
    NEW.cyprus_zone := detect_cyprus_zone_from_postal(NEW.postal_code);
    NEW.auto_detected_zone := true;
  END IF;
  
  -- Auto-détecter la ville si postal_code existe et city est vide
  IF NEW.postal_code IS NOT NULL AND NEW.city IS NULL THEN
    NEW.city := detect_city_from_postal(NEW.postal_code);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auto_detect_location ON projects;
CREATE TRIGGER trigger_auto_detect_location
  BEFORE INSERT OR UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION auto_detect_location();

-- 8. Corriger les bâtiments - supprimer toute référence à construction_year
-- car ce champ est au niveau du projet, pas du bâtiment
ALTER TABLE buildings
DROP COLUMN IF EXISTS construction_year;

-- 9. Ajouter des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_projects_postal_code ON projects(postal_code);
CREATE INDEX IF NOT EXISTS idx_projects_cyprus_zone ON projects(cyprus_zone);
CREATE INDEX IF NOT EXISTS idx_projects_city ON projects(city);
CREATE INDEX IF NOT EXISTS idx_projects_golden_visa ON projects(golden_visa_eligible);

-- 10. Mise à jour des projets existants pour appliquer la détection automatique
UPDATE projects
SET auto_detected_zone = true
WHERE postal_code IS NOT NULL;

COMMENT ON COLUMN projects.street_address IS 'Adresse de rue (numéro et nom de rue)';
COMMENT ON COLUMN projects.postal_code IS 'Code postal pour détection automatique de zone';
COMMENT ON COLUMN projects.auto_detected_zone IS 'Zone détectée automatiquement depuis le code postal';
COMMENT ON COLUMN projects.construction_year IS 'Année de construction du projet';
COMMENT ON COLUMN buildings.construction_status IS 'Statut de construction du bâtiment individuel';
