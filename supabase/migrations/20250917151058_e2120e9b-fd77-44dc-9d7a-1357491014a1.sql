-- Migration: Add equipment and features fields to properties table (FIXED)
-- Ajoute les équipements spécifiques à l'unité (pas de duplication avec projet)

-- SECTION 5A: CUISINE ET ÉLECTROMÉNAGER
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS kitchen_type VARCHAR(50) CHECK (kitchen_type IN (
  'open', 'closed', 'american', 'island', 'kitchenette'
)),
ADD COLUMN IF NOT EXISTS kitchen_brand VARCHAR(100),
ADD COLUMN IF NOT EXISTS has_kitchen_appliances BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS appliances_list JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS countertop_material VARCHAR(50) CHECK (countertop_material IN (
  'granite', 'quartz', 'marble', 'wood', 'laminate', 'ceramic', 'concrete'
));

-- SECTION 5B: CLIMATISATION & CHAUFFAGE (individuel)
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS air_conditioning_type VARCHAR(50) CHECK (air_conditioning_type IN (
  'central_vrv', 'split', 'cassette', 'ducted', 'window', 'portable'
)),
ADD COLUMN IF NOT EXISTS heating_type VARCHAR(50) CHECK (heating_type IN (
  'central', 'underfloor', 'electric', 'gas', 'heat_pump', 'fireplace_only'
)),
ADD COLUMN IF NOT EXISTS has_underfloor_heating BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_fireplace BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS fireplace_type VARCHAR(50) CHECK (fireplace_type IN (
  'wood', 'gas', 'electric', 'bioethanol'
));

-- SECTION 5C: FINITIONS ET MATÉRIAUX
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS flooring_type VARCHAR(50) CHECK (flooring_type IN (
  'parquet', 'tiles', 'marble', 'laminate', 'carpet', 'concrete', 'vinyl'
)),
ADD COLUMN IF NOT EXISTS windows_type VARCHAR(50) CHECK (windows_type IN (
  'double_glazing', 'triple_glazing', 'thermal_aluminum', 'pvc', 'wood'
)),
ADD COLUMN IF NOT EXISTS doors_type VARCHAR(50) CHECK (doors_type IN (
  'solid_wood', 'security', 'fire_rated', 'sliding', 'french'
)),
ADD COLUMN IF NOT EXISTS bathroom_fixtures_brand VARCHAR(100),
ADD COLUMN IF NOT EXISTS wall_finish VARCHAR(50) CHECK (wall_finish IN (
  'paint', 'wallpaper', 'stone', 'wood_panels', 'exposed_brick'
));

-- SECTION 5D: TECHNOLOGIE & SÉCURITÉ (unité)
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS has_smart_home BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS smart_home_features JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS has_alarm_system BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_video_intercom BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_safe BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_security_door BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS internet_ready BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_fiber_optic BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_satellite_tv BOOLEAN DEFAULT FALSE;

-- SECTION 5E: ÉQUIPEMENTS SPÉCIAUX
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS has_jacuzzi BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_sauna BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_home_cinema BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_wine_fridge BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_electric_shutters BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_solar_panels BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_water_softener BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_central_vacuum BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_electric_car_charger BOOLEAN DEFAULT FALSE;

-- SECTION 5F: ÉQUIPEMENTS EXTÉRIEURS PRIVÉS
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS has_bbq_area BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_outdoor_kitchen BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_pergola BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_automatic_irrigation BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS garden_type VARCHAR(50) CHECK (garden_type IN (
  'landscaped', 'lawn', 'mediterranean', 'rock', 'japanese'
));

-- SECTION 5G: CARACTÉRISTIQUES SUPPLÉMENTAIRES
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS is_furnished BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS furniture_package_value DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS has_sea_view BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_mountain_view BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_city_view BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_garden_view BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_pool_view BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS view_quality VARCHAR(50) CHECK (view_quality IN (
  'panoramic', 'partial', 'lateral', 'frontal'
));

-- Création d'index pour les recherches fréquentes
CREATE INDEX IF NOT EXISTS idx_properties_kitchen ON public.properties(has_kitchen_appliances);
CREATE INDEX IF NOT EXISTS idx_properties_smart_home ON public.properties(has_smart_home);
CREATE INDEX IF NOT EXISTS idx_properties_furnished ON public.properties(is_furnished);
CREATE INDEX IF NOT EXISTS idx_properties_views ON public.properties(has_sea_view, has_mountain_view);
CREATE INDEX IF NOT EXISTS idx_properties_fireplace ON public.properties(has_fireplace);
CREATE INDEX IF NOT EXISTS idx_properties_jacuzzi ON public.properties(has_jacuzzi);

-- Fonction pour valider les JSONB arrays
CREATE OR REPLACE FUNCTION public.validate_property_jsonb_arrays()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  -- Valider que appliances_list est un array
  IF NEW.appliances_list IS NOT NULL AND jsonb_typeof(NEW.appliances_list) != 'array' THEN
    RAISE EXCEPTION 'appliances_list must be a JSON array';
  END IF;
  
  -- Valider que smart_home_features est un array
  IF NEW.smart_home_features IS NOT NULL AND jsonb_typeof(NEW.smart_home_features) != 'array' THEN
    RAISE EXCEPTION 'smart_home_features must be a JSON array';
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_property_jsonb_trigger ON public.properties;
CREATE TRIGGER validate_property_jsonb_trigger
  BEFORE INSERT OR UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_property_jsonb_arrays();

-- Contraintes supplémentaires pour cohérence (syntax corrigée)
DO $$
BEGIN
  -- Supprimer la contrainte si elle existe
  ALTER TABLE public.properties DROP CONSTRAINT IF EXISTS check_furniture_value;
  
  -- Ajouter la nouvelle contrainte
  ALTER TABLE public.properties ADD CONSTRAINT check_furniture_value CHECK (
    furniture_package_value IS NULL OR furniture_package_value >= 0
  );
EXCEPTION
  WHEN duplicate_object THEN
    -- Contrainte existe déjà, ignorer
    NULL;
END;
$$;

-- Commentaires pour documentation
COMMENT ON COLUMN public.properties.appliances_list IS 'Liste JSON des électroménagers inclus dans l''unité (ex: ["refrigerator", "dishwasher", "oven", "microwave"])';
COMMENT ON COLUMN public.properties.smart_home_features IS 'Liste JSON des fonctionnalités domotiques de l''unité (ex: ["lighting_control", "climate_control", "security_system"])';
COMMENT ON COLUMN public.properties.has_kitchen_appliances IS 'Électroménager inclus dans l''unité (différent des équipements communs du projet)';
COMMENT ON COLUMN public.properties.has_smart_home IS 'Domotique spécifique à cette unité';
COMMENT ON COLUMN public.properties.has_jacuzzi IS 'Jacuzzi privé dans l''unité (différent du spa commun du projet)';
COMMENT ON COLUMN public.properties.has_sauna IS 'Sauna privé dans l''unité (différent du spa commun du projet)';
COMMENT ON COLUMN public.properties.kitchen_type IS 'Type de cuisine: open (ouverte), closed (fermée), american (américaine), island (îlot), kitchenette';
COMMENT ON COLUMN public.properties.air_conditioning_type IS 'Type de climatisation individuelle de l''unité';
COMMENT ON COLUMN public.properties.heating_type IS 'Type de chauffage individuel de l''unité';
COMMENT ON COLUMN public.properties.view_quality IS 'Qualité de la vue depuis l''unité: panoramic, partial, lateral, frontal';
COMMENT ON COLUMN public.properties.has_electric_car_charger IS 'Borne de recharge véhicule électrique privée';