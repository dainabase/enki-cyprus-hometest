-- Migration: Add surfaces and configuration fields to properties table
-- Ajoute les champs surfaces détaillées et configuration des pièces

-- SECTION 3: SURFACES DÉTAILLÉES
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS covered_veranda_area DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS uncovered_veranda_area DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS total_covered_area DECIMAL(10, 2) GENERATED ALWAYS AS (
  COALESCE(internal_area, 0) + COALESCE(covered_veranda_area, 0)
) STORED,
ADD COLUMN IF NOT EXISTS plot_area DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS garden_area DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS roof_terrace_area DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS basement_area DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS storage_area DECIMAL(10, 2);

-- Dimensions spécifiques
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS ceiling_height DECIMAL(4, 2),
ADD COLUMN IF NOT EXISTS living_room_area DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS kitchen_area DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS master_bedroom_area DECIMAL(10, 2);

-- SECTION 4: CONFIGURATION DES PIÈCES
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS wc_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS en_suite_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_rooms INTEGER DEFAULT 0;

-- Pièces additionnelles (booléens)
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS has_office BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_maid_room BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_laundry_room BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_storage_room BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_dressing_room BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_pantry BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_wine_cellar BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_playroom BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_guest_wc BOOLEAN DEFAULT FALSE;

-- SECTION 2 (complément): POSITION ET ACCÈS
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS entrance_type VARCHAR(50) CHECK (entrance_type IN (
  'private', 'common', 'both'
)),
ADD COLUMN IF NOT EXISTS has_private_elevator BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_disabled_access BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS distance_to_elevator INTEGER,
ADD COLUMN IF NOT EXISTS distance_to_stairs INTEGER;

-- SECTION 6: ESPACES EXTÉRIEURS SPÉCIFIQUES À L'UNITÉ
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS has_balcony BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS balcony_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS has_terrace BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_roof_terrace BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_private_garden BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_private_pool BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS pool_size VARCHAR(50);

-- SECTION 7: PARKING & STOCKAGE SPÉCIFIQUE À L'UNITÉ
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS parking_spaces INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS parking_included BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS parking_type_unit VARCHAR(50) CHECK (parking_type_unit IN (
  'underground', 'outdoor', 'covered', 'garage', 'carport'
)),
ADD COLUMN IF NOT EXISTS parking_location VARCHAR(100),
ADD COLUMN IF NOT EXISTS has_storage_unit BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS storage_location VARCHAR(100);

-- Trigger pour calculer automatiquement total_rooms
CREATE OR REPLACE FUNCTION public.calculate_total_rooms()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  NEW.total_rooms = NEW.bedrooms_count + 
                    CASE WHEN NEW.has_office THEN 1 ELSE 0 END +
                    CASE WHEN NEW.has_maid_room THEN 1 ELSE 0 END +
                    CASE WHEN NEW.has_playroom THEN 1 ELSE 0 END +
                    CASE WHEN NEW.has_wine_cellar THEN 1 ELSE 0 END;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS calculate_total_rooms_trigger ON public.properties;
CREATE TRIGGER calculate_total_rooms_trigger
  BEFORE INSERT OR UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_total_rooms();

-- Ajout de contraintes de validation
ALTER TABLE public.properties
DROP CONSTRAINT IF EXISTS check_positive_areas,
ADD CONSTRAINT check_positive_areas CHECK (
  (internal_area IS NULL OR internal_area >= 0) AND
  (covered_veranda_area IS NULL OR covered_veranda_area >= 0) AND
  (uncovered_veranda_area IS NULL OR uncovered_veranda_area >= 0) AND
  (plot_area IS NULL OR plot_area >= 0) AND
  (garden_area IS NULL OR garden_area >= 0) AND
  (roof_terrace_area IS NULL OR roof_terrace_area >= 0) AND
  (basement_area IS NULL OR basement_area >= 0) AND
  (storage_area IS NULL OR storage_area >= 0)
);

ALTER TABLE public.properties
DROP CONSTRAINT IF EXISTS check_positive_rooms,
ADD CONSTRAINT check_positive_rooms CHECK (
  bedrooms_count >= 0 AND
  bathrooms_count >= 0 AND
  wc_count >= 0 AND
  en_suite_count >= 0 AND
  balcony_count >= 0 AND
  parking_spaces >= 0
);

ALTER TABLE public.properties
DROP CONSTRAINT IF EXISTS check_ceiling_height,
ADD CONSTRAINT check_ceiling_height CHECK (
  ceiling_height IS NULL OR (ceiling_height >= 2.0 AND ceiling_height <= 10.0)
);

-- Index pour performance sur les nouveaux champs
CREATE INDEX IF NOT EXISTS idx_properties_total_rooms ON public.properties(total_rooms);
CREATE INDEX IF NOT EXISTS idx_properties_parking_spaces ON public.properties(parking_spaces);
CREATE INDEX IF NOT EXISTS idx_properties_has_private_pool ON public.properties(has_private_pool);

-- Commentaires pour documentation
COMMENT ON COLUMN public.properties.total_covered_area IS 'Surface couverte totale calculée automatiquement (intérieur + véranda couverte)';
COMMENT ON COLUMN public.properties.entrance_type IS 'Type d''entrée: private, common, both';
COMMENT ON COLUMN public.properties.total_rooms IS 'Nombre total de pièces calculé automatiquement';
COMMENT ON COLUMN public.properties.has_private_pool IS 'Piscine privée spécifique à cette unité (différente de la piscine commune du projet)';
COMMENT ON COLUMN public.properties.parking_type_unit IS 'Type de parking spécifique à cette unité';
COMMENT ON COLUMN public.properties.covered_veranda_area IS 'Surface véranda couverte en m²';
COMMENT ON COLUMN public.properties.uncovered_veranda_area IS 'Surface véranda non couverte/terrasse en m²';
COMMENT ON COLUMN public.properties.plot_area IS 'Surface du terrain privé en m² (pour villas)';
COMMENT ON COLUMN public.properties.garden_area IS 'Surface jardin privé en m²';
COMMENT ON COLUMN public.properties.ceiling_height IS 'Hauteur sous plafond en mètres';
COMMENT ON COLUMN public.properties.has_private_garden IS 'Jardin privé spécifique à cette unité';