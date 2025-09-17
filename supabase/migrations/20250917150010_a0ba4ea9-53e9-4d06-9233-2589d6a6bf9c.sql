-- Fix security warnings: Add search_path to functions
-- Corrige les avertissements de sécurité détectés

-- Correction pour inherit_developer_from_project
CREATE OR REPLACE FUNCTION public.inherit_developer_from_project()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  IF NEW.developer_id IS NULL THEN
    SELECT developer_id INTO NEW.developer_id 
    FROM public.projects 
    WHERE id = NEW.project_id;
  END IF;
  RETURN NEW;
END;
$$;

-- Correction pour update_building_units_count
CREATE OR REPLACE FUNCTION public.update_building_units_count()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  -- Mettre à jour le building concerné
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    -- Nouveau building_id
    IF NEW.building_id IS NOT NULL THEN
      UPDATE public.buildings 
      SET 
        total_units = (
          SELECT COUNT(*) 
          FROM public.properties 
          WHERE building_id = NEW.building_id
        ),
        units_available = (
          SELECT COUNT(*) 
          FROM public.properties 
          WHERE building_id = NEW.building_id 
          AND property_status = 'available'
        )
      WHERE id = NEW.building_id;
    END IF;
    
    -- Ancien building_id si changement
    IF TG_OP = 'UPDATE' AND OLD.building_id IS NOT NULL AND OLD.building_id != NEW.building_id THEN
      UPDATE public.buildings 
      SET 
        total_units = (
          SELECT COUNT(*) 
          FROM public.properties 
          WHERE building_id = OLD.building_id
        ),
        units_available = (
          SELECT COUNT(*) 
          FROM public.properties 
          WHERE building_id = OLD.building_id 
          AND property_status = 'available'
        )
      WHERE id = OLD.building_id;
    END IF;
  END IF;
  
  -- Gestion des suppressions
  IF TG_OP = 'DELETE' THEN
    IF OLD.building_id IS NOT NULL THEN
      UPDATE public.buildings 
      SET 
        total_units = (
          SELECT COUNT(*) 
          FROM public.properties 
          WHERE building_id = OLD.building_id
        ),
        units_available = (
          SELECT COUNT(*) 
          FROM public.properties 
          WHERE building_id = OLD.building_id 
          AND property_status = 'available'
        )
      WHERE id = OLD.building_id;
    END IF;
    RETURN OLD;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;