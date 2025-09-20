-- CORRECTION DES PROBLÈMES DE SÉCURITÉ DÉTECTÉS
-- ==============================================

-- 1. CORRECTION DES FONCTIONS SANS search_path SÉCURISÉ
-- Mettre à jour toutes les fonctions créées pour ajouter SET search_path = public

CREATE OR REPLACE FUNCTION cascade_developer_commission()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.commission_rate IS NULL THEN
    SELECT commission_rate INTO NEW.commission_rate
    FROM developers
    WHERE id = NEW.developer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION cascade_project_vat()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.vat_rate IS NULL THEN
    SELECT vat_rate INTO NEW.vat_rate
    FROM projects
    WHERE id = NEW.project_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION cascade_building_energy()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.energy_rating IS NULL THEN
    SELECT energy_rating, energy_certificate
    INTO NEW.energy_rating, NEW.energy_certificate_number
    FROM buildings
    WHERE id = NEW.building_id;
  END IF;
  
  -- Cascade aussi les permis du project
  IF NEW.planning_permit_number IS NULL THEN
    SELECT planning_permit_number, building_permit_number, title_deed_available::TEXT
    INTO NEW.planning_permit_number, NEW.building_permit_number, NEW.title_deed_status
    FROM projects
    WHERE id = NEW.project_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION calculate_property_values()
RETURNS TRIGGER AS $$
BEGIN
  -- Calcul automatique TVA et prix TTC
  NEW.vat_amount = NEW.price_excluding_vat * COALESCE(NEW.vat_rate, 5.0) / 100;
  NEW.price_including_vat = NEW.price_excluding_vat + NEW.vat_amount;
  
  -- Calcul prix au m²
  IF NEW.internal_area > 0 THEN
    NEW.price_per_sqm = NEW.price_excluding_vat / NEW.internal_area;
  END IF;
  
  -- Golden Visa eligibility
  NEW.golden_visa_eligible = (NEW.price_including_vat >= 300000);
  NEW.minimum_investment_met = NEW.golden_visa_eligible;
  
  -- Commission
  IF NEW.commission_rate > 0 THEN
    NEW.commission_amount = NEW.price_excluding_vat * NEW.commission_rate / 100;
  END IF;
  
  -- Total rooms
  NEW.total_rooms = NEW.bedrooms_count + 
                    CASE WHEN NEW.has_office THEN 1 ELSE 0 END +
                    CASE WHEN NEW.has_maid_room THEN 1 ELSE 0 END +
                    CASE WHEN NEW.has_playroom THEN 1 ELSE 0 END +
                    CASE WHEN NEW.has_wine_cellar THEN 1 ELSE 0 END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION update_units_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- Update building counts
  IF TG_OP = 'DELETE' THEN
    UPDATE buildings b
    SET units_available = (
      SELECT COUNT(*) FROM properties 
      WHERE building_id = b.id AND property_status = 'available'
    ),
    total_units = (
      SELECT COUNT(*) FROM properties 
      WHERE building_id = b.id
    )
    WHERE b.id = OLD.building_id;
    
    -- Update project counts
    UPDATE projects p
    SET units_available = (
      SELECT COUNT(*) FROM properties 
      WHERE project_id = p.id AND property_status = 'available'
    ),
    units_sold = (
      SELECT COUNT(*) FROM properties 
      WHERE project_id = p.id AND property_status = 'sold'
    ),
    total_units = (
      SELECT COUNT(*) FROM properties 
      WHERE project_id = p.id
    ),
    price_from = (
      SELECT MIN(price_excluding_vat) FROM properties 
      WHERE project_id = p.id AND property_status = 'available'
    ),
    price_to = (
      SELECT MAX(price_excluding_vat) FROM properties 
      WHERE project_id = p.id
    )
    WHERE p.id = OLD.project_id;
    
    RETURN OLD;
  ELSE
    UPDATE buildings b
    SET units_available = (
      SELECT COUNT(*) FROM properties 
      WHERE building_id = b.id AND property_status = 'available'
    ),
    total_units = (
      SELECT COUNT(*) FROM properties 
      WHERE building_id = b.id
    )
    WHERE b.id = NEW.building_id;
    
    -- Update project counts
    UPDATE projects p
    SET units_available = (
      SELECT COUNT(*) FROM properties 
      WHERE project_id = p.id AND property_status = 'available'
    ),
    units_sold = (
      SELECT COUNT(*) FROM properties 
      WHERE project_id = p.id AND property_status = 'sold'
    ),
    total_units = (
      SELECT COUNT(*) FROM properties 
      WHERE project_id = p.id
    ),
    price_from = (
      SELECT MIN(price_excluding_vat) FROM properties 
      WHERE project_id = p.id AND property_status = 'available'
    ),
    price_to = (
      SELECT MAX(price_excluding_vat) FROM properties 
      WHERE project_id = p.id
    )
    WHERE p.id = NEW.project_id;
    
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. ACTIVER RLS SUR LES TABLES QUI EN MANQUENT (erreur critique détectée)
-- Vérifier d'abord quelles tables n'ont pas RLS activé

-- Activer RLS sur toutes les tables publiques qui en manquent
DO $$
DECLARE
    table_record RECORD;
BEGIN
    FOR table_record IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT LIKE 'backup_%'
        AND tablename NOT IN ('developers', 'projects', 'buildings', 'properties')
    LOOP
        EXECUTE 'ALTER TABLE ' || table_record.tablename || ' ENABLE ROW LEVEL SECURITY';
    END LOOP;
END;
$$;