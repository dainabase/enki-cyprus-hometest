-- Migration pour ajouter les champs manquants et corriger les structures

-- 1. Ajouter les champs manquants dans la table projects si pas déjà présents
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS energy_rating VARCHAR(10),
ADD COLUMN IF NOT EXISTS construction_materials TEXT[],
ADD COLUMN IF NOT EXISTS design_style VARCHAR(255),
ADD COLUMN IF NOT EXISTS building_certification VARCHAR(255),
ADD COLUMN IF NOT EXISTS construction_year INTEGER;

-- 2. Ajouter des colonnes pour une meilleure structure d'adresse
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS street_address VARCHAR(255),
ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20),
ADD COLUMN IF NOT EXISTS auto_detected_zone BOOLEAN DEFAULT false;

-- 3. Créer un index pour améliorer les performances de recherche par zone
CREATE INDEX IF NOT EXISTS idx_projects_cyprus_zone ON projects(cyprus_zone);
CREATE INDEX IF NOT EXISTS idx_projects_postal_code ON projects(postal_code);
CREATE INDEX IF NOT EXISTS idx_projects_city ON projects(city);

-- 4. Ajouter une fonction pour détecter automatiquement la zone à partir de la ville
CREATE OR REPLACE FUNCTION detect_cyprus_zone(city_name TEXT)
RETURNS TEXT AS $$
BEGIN
  city_name := LOWER(TRIM(city_name));
  
  -- Limassol et environs
  IF city_name IN ('limassol', 'lemesos', 'agios athanasios', 'mesa geitonia', 'agios tychonas', 'germasogeia', 'kato polemidia') THEN
    RETURN 'limassol';
  
  -- Paphos et environs
  ELSIF city_name IN ('paphos', 'pafos', 'kato paphos', 'chloraka', 'peyia', 'tala', 'kissonerga', 'geroskipou') THEN
    RETURN 'paphos';
  
  -- Larnaca et environs
  ELSIF city_name IN ('larnaca', 'larnaka', 'oroklini', 'livadia', 'dhekelia', 'pyla', 'tersefanou', 'kiti') THEN
    RETURN 'larnaca';
  
  -- Nicosia et environs
  ELSIF city_name IN ('nicosia', 'lefkosia', 'strovolos', 'lakatamia', 'engomi', 'agios dometios', 'latsia', 'geri') THEN
    RETURN 'nicosia';
  
  -- Famagusta et environs
  ELSIF city_name IN ('famagusta', 'ammochostos', 'paralimni', 'ayia napa', 'protaras', 'deryneia', 'sotira', 'frenaros') THEN
    RETURN 'famagusta';
  
  ELSE
    -- Par défaut, retourner Limassol si la ville n'est pas reconnue
    RETURN 'limassol';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 5. Créer un trigger pour auto-détecter la zone lors de l'insertion/mise à jour
CREATE OR REPLACE FUNCTION auto_detect_zone_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.city IS NOT NULL AND (NEW.cyprus_zone IS NULL OR NEW.cyprus_zone = '') THEN
    NEW.cyprus_zone := detect_cyprus_zone(NEW.city);
    NEW.auto_detected_zone := true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS auto_detect_zone ON projects;
CREATE TRIGGER auto_detect_zone
  BEFORE INSERT OR UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION auto_detect_zone_trigger();

-- 6. Fonction pour obtenir la ville à partir du code postal
CREATE OR REPLACE FUNCTION get_city_from_postal_code(postal_code TEXT)
RETURNS TEXT AS $$
BEGIN
  postal_code := TRIM(postal_code);
  
  -- Codes postaux Limassol (3000-3199, 4000-4199)
  IF postal_code ~ '^(3[0-1][0-9]{2}|4[0-1][0-9]{2})$' THEN
    RETURN 'Limassol';
  
  -- Codes postaux Paphos (8000-8199)
  ELSIF postal_code ~ '^8[0-1][0-9]{2}$' THEN
    RETURN 'Paphos';
  
  -- Codes postaux Larnaca (6000-6199, 7000-7199)
  ELSIF postal_code ~ '^(6[0-1][0-9]{2}|7[0-1][0-9]{2})$' THEN
    RETURN 'Larnaca';
  
  -- Codes postaux Nicosia (1000-2999)
  ELSIF postal_code ~ '^[1-2][0-9]{3}$' THEN
    RETURN 'Nicosia';
  
  -- Codes postaux Famagusta (5000-5999)
  ELSIF postal_code ~ '^5[0-9]{3}$' THEN
    RETURN 'Famagusta';
  
  ELSE
    RETURN NULL;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 7. Créer une vue pour faciliter l'affichage des projets avec leurs adresses complètes
CREATE OR REPLACE VIEW projects_with_full_address AS
SELECT 
  p.*,
  CONCAT_WS(', ', 
    p.street_address,
    p.postal_code,
    p.city,
    p.cyprus_zone,
    'Cyprus'
  ) AS formatted_full_address,
  CASE 
    WHEN p.golden_visa_eligible = true THEN '🏆 Golden Visa'
    ELSE ''
  END AS golden_visa_badge
FROM projects p;

-- 8. Ajouter des commentaires pour documenter les colonnes
COMMENT ON COLUMN projects.energy_rating IS 'Classe énergétique du bâtiment (A+, A, B, C, D, E, F, G)';
COMMENT ON COLUMN projects.construction_materials IS 'Matériaux de construction utilisés (tableau)';
COMMENT ON COLUMN projects.design_style IS 'Style architectural du projet';
COMMENT ON COLUMN projects.building_certification IS 'Certifications du bâtiment (LEED, BREEAM, etc.)';
COMMENT ON COLUMN projects.construction_year IS 'Année de construction';
COMMENT ON COLUMN projects.street_address IS 'Adresse de rue (numéro et nom de rue)';
COMMENT ON COLUMN projects.postal_code IS 'Code postal';
COMMENT ON COLUMN projects.auto_detected_zone IS 'Indique si la zone a été auto-détectée';
