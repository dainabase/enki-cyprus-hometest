-- Fonction pour mettre à jour les unités disponibles dans les projets
CREATE OR REPLACE FUNCTION update_project_units_available()
RETURNS TRIGGER AS $$
BEGIN
  -- Mettre à jour le projet concerné
  UPDATE projects
  SET 
    units_available = (
      SELECT COUNT(*) 
      FROM properties 
      WHERE project_id = COALESCE(NEW.project_id, OLD.project_id)
      AND property_status = 'available'
    ),
    total_units = (
      SELECT COUNT(*) 
      FROM properties 
      WHERE project_id = COALESCE(NEW.project_id, OLD.project_id)
    )
  WHERE id = COALESCE(NEW.project_id, OLD.project_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger pour les mises à jour de projets
DROP TRIGGER IF EXISTS trigger_update_project_units ON properties;
CREATE TRIGGER trigger_update_project_units
  AFTER INSERT OR UPDATE OR DELETE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_project_units_available();

-- Fonction pour mettre à jour les unités dans les bâtiments
CREATE OR REPLACE FUNCTION update_building_units()
RETURNS TRIGGER AS $$
BEGIN
  -- Mettre à jour le bâtiment concerné si c'est lié à un bâtiment
  IF COALESCE(NEW.building_id, OLD.building_id) IS NOT NULL THEN
    UPDATE buildings
    SET 
      total_units = (
        SELECT COUNT(*) 
        FROM properties 
        WHERE building_id = COALESCE(NEW.building_id, OLD.building_id)
      ),
      units_available = (
        SELECT COUNT(*) 
        FROM properties 
        WHERE building_id = COALESCE(NEW.building_id, OLD.building_id)
        AND property_status = 'available'
      )
    WHERE id = COALESCE(NEW.building_id, OLD.building_id);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger pour les mises à jour de bâtiments
DROP TRIGGER IF EXISTS trigger_update_building_units ON properties;
CREATE TRIGGER trigger_update_building_units
  AFTER INSERT OR UPDATE OR DELETE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_building_units();

-- Fonction pour calculer l'éligibilité Golden Visa automatiquement
CREATE OR REPLACE FUNCTION calculate_golden_visa_eligibility()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculer le prix TTC
  NEW.price_including_vat = NEW.price_excluding_vat + (NEW.price_excluding_vat * COALESCE(NEW.vat_rate, 5) / 100);
  
  -- Vérifier l'éligibilité Golden Visa (≥ 300,000€ TTC)
  NEW.golden_visa_eligible = (NEW.price_including_vat >= 300000);
  
  -- Calculer le prix au m²
  IF NEW.internal_area > 0 THEN
    NEW.price_per_sqm = NEW.price_excluding_vat / NEW.internal_area;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger pour le calcul automatique Golden Visa
DROP TRIGGER IF EXISTS trigger_calculate_golden_visa ON properties;
CREATE TRIGGER trigger_calculate_golden_visa
  BEFORE INSERT OR UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION calculate_golden_visa_eligibility();

-- Fonction pour valider les contraintes métier
CREATE OR REPLACE FUNCTION validate_property_constraints()
RETURNS TRIGGER AS $$
DECLARE
  building_max_units INTEGER;
  current_units_count INTEGER;
BEGIN
  -- Vérifier que le nombre d'unités ne dépasse pas le maximum du bâtiment
  IF NEW.building_id IS NOT NULL THEN
    SELECT total_units INTO building_max_units
    FROM buildings
    WHERE id = NEW.building_id;
    
    SELECT COUNT(*) INTO current_units_count
    FROM properties
    WHERE building_id = NEW.building_id
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid);
    
    IF current_units_count >= building_max_units THEN
      RAISE EXCEPTION 'Cannot add more units: building capacity (%) reached', building_max_units;
    END IF;
  END IF;
  
  -- Valider que le projet_id est obligatoire
  IF NEW.project_id IS NULL OR NEW.project_id = '' THEN
    RAISE EXCEPTION 'project_id is required for all properties';
  END IF;
  
  -- Valider que le property_type est obligatoire
  IF NEW.property_type IS NULL OR NEW.property_type = '' THEN
    RAISE EXCEPTION 'property_type is required for all properties';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger pour valider les contraintes
DROP TRIGGER IF EXISTS trigger_validate_property_constraints ON properties;
CREATE TRIGGER trigger_validate_property_constraints
  BEFORE INSERT OR UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION validate_property_constraints();

-- Fonction pour empêcher la suppression de projets/bâtiments avec propriétés
CREATE OR REPLACE FUNCTION prevent_deletion_with_properties()
RETURNS TRIGGER AS $$
DECLARE
  properties_count INTEGER;
BEGIN
  IF TG_TABLE_NAME = 'projects' THEN
    SELECT COUNT(*) INTO properties_count
    FROM properties
    WHERE project_id = OLD.id;
    
    IF properties_count > 0 THEN
      RAISE EXCEPTION 'Cannot delete project: % properties still exist', properties_count;
    END IF;
  END IF;
  
  IF TG_TABLE_NAME = 'buildings' THEN
    SELECT COUNT(*) INTO properties_count
    FROM properties
    WHERE building_id = OLD.id;
    
    IF properties_count > 0 THEN
      RAISE EXCEPTION 'Cannot delete building: % properties still exist', properties_count;
    END IF;
  END IF;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Triggers pour empêcher la suppression
DROP TRIGGER IF EXISTS trigger_prevent_project_deletion ON projects;
CREATE TRIGGER trigger_prevent_project_deletion
  BEFORE DELETE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION prevent_deletion_with_properties();

DROP TRIGGER IF EXISTS trigger_prevent_building_deletion ON buildings;
CREATE TRIGGER trigger_prevent_building_deletion
  BEFORE DELETE ON buildings
  FOR EACH ROW
  EXECUTE FUNCTION prevent_deletion_with_properties();