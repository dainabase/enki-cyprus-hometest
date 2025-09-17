-- Migration: Create properties table (structure de base)
-- Les propriétés héritent des prestations du projet parent

-- Créer la table properties avec structure de base
CREATE TABLE IF NOT EXISTS public.properties (
  -- Identifiants primaires
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Relations hiérarchiques (hérite des prestations du projet)
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  building_id UUID REFERENCES public.buildings(id) ON DELETE CASCADE,
  developer_id UUID REFERENCES public.developers(id) ON DELETE CASCADE,
  
  -- SECTION 1: IDENTIFICATION & CLASSIFICATION
  unit_number VARCHAR(50) NOT NULL,
  cadastral_reference VARCHAR(100),
  title_deed_number VARCHAR(100),
  property_code VARCHAR(50),
  
  -- Type et classification
  property_type VARCHAR(50) NOT NULL CHECK (property_type IN (
    'apartment', 'villa', 'penthouse', 'studio', 
    'townhouse', 'duplex', 'triplex', 'maisonette'
  )),
  property_subtype VARCHAR(100),
  
  -- Statut
  property_status VARCHAR(50) DEFAULT 'available' CHECK (property_status IN (
    'available', 'reserved', 'sold', 'rented', 'unavailable'
  )),
  sale_type VARCHAR(50) DEFAULT 'new' CHECK (sale_type IN ('new', 'resale')),
  ownership_type VARCHAR(50) DEFAULT 'freehold' CHECK (ownership_type IN (
    'freehold', 'leasehold'
  )),
  
  -- SECTION 2: LOCALISATION & POSITION
  floor_number INTEGER,
  position_on_floor VARCHAR(50) CHECK (position_on_floor IN (
    'front', 'back', 'left', 'right', 'corner'
  )),
  orientation VARCHAR(50) CHECK (orientation IN (
    'north', 'south', 'east', 'west', 
    'north_east', 'north_west', 'south_east', 'south_west'
  )),
  facing TEXT[], -- Vue multiple (mer, jardin, etc.)
  
  -- SECTION 3: SURFACES (basique pour l'instant)
  internal_area DECIMAL(10, 2),
  
  -- SECTION 4: CONFIGURATION (basique)
  bedrooms_count INTEGER DEFAULT 0,
  bathrooms_count INTEGER DEFAULT 0,
  
  -- Prix de base
  price_excluding_vat DECIMAL(12, 2),
  
  -- Statut de disponibilité
  is_available BOOLEAN DEFAULT TRUE,
  reservation_date TIMESTAMPTZ,
  sold_date TIMESTAMPTZ,
  
  -- Ordre d'affichage
  display_order INTEGER DEFAULT 0,
  
  -- Métadonnées
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  
  -- Contraintes uniques
  CONSTRAINT unique_property_code UNIQUE(property_code),
  CONSTRAINT unique_unit_in_building UNIQUE(building_id, unit_number),
  CONSTRAINT unique_unit_in_project UNIQUE(project_id, unit_number),
  
  -- Contraintes de cohérence
  CONSTRAINT check_positive_area CHECK (internal_area > 0 OR internal_area IS NULL),
  CONSTRAINT check_positive_bedrooms CHECK (bedrooms_count >= 0),
  CONSTRAINT check_positive_bathrooms CHECK (bathrooms_count >= 0),
  CONSTRAINT check_positive_price CHECK (price_excluding_vat > 0 OR price_excluding_vat IS NULL)
);

-- Trigger pour updated_at
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger pour hériter developer_id du projet
CREATE OR REPLACE FUNCTION public.inherit_developer_from_project()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.developer_id IS NULL THEN
    SELECT developer_id INTO NEW.developer_id 
    FROM public.projects 
    WHERE id = NEW.project_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER inherit_developer_trigger
  BEFORE INSERT OR UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.inherit_developer_from_project();

-- Index pour performance
CREATE INDEX idx_properties_project_id ON public.properties(project_id);
CREATE INDEX idx_properties_building_id ON public.properties(building_id);
CREATE INDEX idx_properties_developer_id ON public.properties(developer_id);
CREATE INDEX idx_properties_status ON public.properties(property_status);
CREATE INDEX idx_properties_type ON public.properties(property_type);
CREATE INDEX idx_properties_available ON public.properties(is_available);
CREATE INDEX idx_properties_display_order ON public.properties(display_order);

-- Trigger pour compter les unités dans buildings
CREATE OR REPLACE FUNCTION public.update_building_units_count()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_building_units_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_building_units_count();

-- Politiques RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Admins peuvent tout gérer
CREATE POLICY "Admins can manage all properties" 
ON public.properties 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Lecture publique pour les propriétés disponibles
CREATE POLICY "Public can view available properties" 
ON public.properties 
FOR SELECT 
USING (is_available = true);

-- Commentaires pour documentation
COMMENT ON TABLE public.properties IS 'Table des propriétés/unités - hérite des prestations du projet parent';
COMMENT ON COLUMN public.properties.project_id IS 'Référence au projet parent (hérite des prestations)';
COMMENT ON COLUMN public.properties.building_id IS 'Référence au bâtiment (optionnel pour villas)';
COMMENT ON COLUMN public.properties.developer_id IS 'Hérité automatiquement du projet';
COMMENT ON COLUMN public.properties.unit_number IS 'Numéro de l''unité (ex: A101, Villa-3)';
COMMENT ON COLUMN public.properties.facing IS 'Vues multiples: mer, jardin, montagne, etc.';
COMMENT ON COLUMN public.properties.internal_area IS 'Surface intérieure en m²';
COMMENT ON COLUMN public.properties.price_excluding_vat IS 'Prix hors TVA';