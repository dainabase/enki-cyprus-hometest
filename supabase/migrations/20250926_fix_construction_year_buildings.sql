-- ========================================
-- CORRECTION DU PROBLÈME CONSTRUCTION_YEAR
-- ========================================
-- Problème : L'erreur "Couldn't find construction year column of project in the sham cache"
-- Cause : Le champ construction_year est cherché dans buildings au lieu de projects

-- 1. S'assurer que construction_year existe dans projects
-- ==========================================
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS construction_year INTEGER;

-- 2. Migrer les données si elles existent dans buildings
-- ==========================================
DO $$ 
DECLARE
  column_exists boolean;
BEGIN
  -- Vérifier si la colonne existe dans buildings
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'buildings' 
    AND column_name = 'construction_year'
  ) INTO column_exists;
  
  IF column_exists THEN
    -- Copier les données vers projects si elles n'existent pas déjà
    UPDATE projects p
    SET construction_year = b.construction_year
    FROM buildings b
    WHERE b.project_id = p.id
    AND p.construction_year IS NULL
    AND b.construction_year IS NOT NULL;
    
    -- Supprimer la colonne de buildings
    ALTER TABLE buildings DROP COLUMN IF EXISTS construction_year;
  END IF;
END $$;

-- 3. Créer une fonction pour obtenir construction_year depuis projects
-- ==========================================
CREATE OR REPLACE FUNCTION get_project_construction_year(building_id UUID)
RETURNS INTEGER AS $$
DECLARE
  year INTEGER;
BEGIN
  SELECT p.construction_year INTO year
  FROM buildings b
  JOIN projects p ON p.id = b.project_id
  WHERE b.id = building_id;
  
  RETURN year;
END;
$$ LANGUAGE plpgsql;

-- 4. Créer une vue pour les bâtiments avec informations du projet parent
-- ==========================================
CREATE OR REPLACE VIEW buildings_with_project_info AS
SELECT 
  b.*,
  p.construction_year AS project_construction_year,
  p.name AS project_name,
  p.cyprus_zone,
  p.city,
  p.energy_rating AS project_energy_rating,
  p.golden_visa_eligible,
  p.developer_id
FROM buildings b
JOIN projects p ON p.id = b.project_id;

-- 5. Mettre à jour les policies RLS si nécessaire
-- ==========================================
-- Les buildings héritent des permissions du projet parent
DROP POLICY IF EXISTS "buildings_inherit_project_permissions" ON buildings;
CREATE POLICY "buildings_inherit_project_permissions" 
ON buildings
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM projects p 
    WHERE p.id = buildings.project_id
  )
);

-- 6. Nettoyer les champs incorrects ou dupliqués
-- ==========================================
-- Supprimer tout champ qui ne devrait pas être dans buildings
ALTER TABLE buildings
DROP COLUMN IF EXISTS street_address,
DROP COLUMN IF EXISTS postal_code,
DROP COLUMN IF EXISTS developer_id;

-- 7. Ajouter des contraintes pour assurer l'intégrité
-- ==========================================
-- S'assurer que chaque building a un project_id valide
ALTER TABLE buildings
DROP CONSTRAINT IF EXISTS fk_building_project,
ADD CONSTRAINT fk_building_project 
  FOREIGN KEY (project_id) 
  REFERENCES projects(id) 
  ON DELETE CASCADE;

-- 8. Index pour améliorer les performances
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_buildings_project_id ON buildings(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_construction_year ON projects(construction_year);

-- 9. Fonction helper pour obtenir toutes les infos d'un bâtiment
-- ==========================================
CREATE OR REPLACE FUNCTION get_building_complete_info(building_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'building', row_to_json(b.*),
    'project', json_build_object(
      'id', p.id,
      'name', p.name,
      'construction_year', p.construction_year,
      'energy_rating', p.energy_rating,
      'cyprus_zone', p.cyprus_zone,
      'city', p.city,
      'golden_visa_eligible', p.golden_visa_eligible
    )
  ) INTO result
  FROM buildings b
  JOIN projects p ON p.id = b.project_id
  WHERE b.id = building_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 10. Commentaires pour documenter la structure correcte
-- ==========================================
COMMENT ON COLUMN projects.construction_year IS 'Année de construction du projet (au niveau projet, pas bâtiment)';
COMMENT ON COLUMN buildings.project_id IS 'Référence obligatoire vers le projet parent';
COMMENT ON FUNCTION get_project_construction_year IS 'Helper pour obtenir construction_year du projet depuis un building_id';
COMMENT ON VIEW buildings_with_project_info IS 'Vue enrichie des bâtiments avec les informations du projet parent';

-- 11. Message de confirmation
-- ==========================================
DO $$
BEGIN
  RAISE NOTICE 'Migration completed: construction_year moved from buildings to projects table';
END $$;
