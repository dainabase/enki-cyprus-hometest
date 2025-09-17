-- Migration pour mettre à jour la table buildings existante
-- La table buildings existe déjà, on ajoute les colonnes manquantes

-- Ajouter les nouvelles colonnes à la table buildings existante
ALTER TABLE public.buildings 
ADD COLUMN IF NOT EXISTS building_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS building_code VARCHAR(50),
ADD COLUMN IF NOT EXISTS units_available INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS expected_completion DATE,
ADD COLUMN IF NOT EXISTS actual_completion DATE,
ADD COLUMN IF NOT EXISTS building_class VARCHAR(10),
ADD COLUMN IF NOT EXISTS energy_certificate VARCHAR(10),
ADD COLUMN IF NOT EXISTS elevator_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS has_generator BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_security_system BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_cctv BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_concierge BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_pool BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_gym BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_spa BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_playground BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_garden BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_parking BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS parking_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS created_by UUID;

-- Mettre à jour building_name avec la valeur de name pour les enregistrements existants
UPDATE public.buildings 
SET building_name = name 
WHERE building_name IS NULL AND name IS NOT NULL;

-- Rendre building_name NOT NULL après avoir migré les données (seulement si des données existent)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.buildings WHERE building_name IS NOT NULL) THEN
    ALTER TABLE public.buildings ALTER COLUMN building_name SET NOT NULL;
  END IF;
END $$;

-- Supprimer les anciennes contraintes si elles existent
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'buildings' AND constraint_name = 'chk_building_type') THEN
    ALTER TABLE public.buildings DROP CONSTRAINT chk_building_type;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'buildings' AND constraint_name = 'chk_construction_status') THEN
    ALTER TABLE public.buildings DROP CONSTRAINT chk_construction_status;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'buildings' AND constraint_name = 'chk_building_class') THEN
    ALTER TABLE public.buildings DROP CONSTRAINT chk_building_class;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'buildings' AND constraint_name = 'chk_energy_certificate') THEN
    ALTER TABLE public.buildings DROP CONSTRAINT chk_energy_certificate;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'buildings' AND constraint_name = 'chk_parking_type') THEN
    ALTER TABLE public.buildings DROP CONSTRAINT chk_parking_type;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'buildings' AND constraint_name = 'unique_building_code') THEN
    ALTER TABLE public.buildings DROP CONSTRAINT unique_building_code;
  END IF;
END $$;

-- Ajouter les nouvelles contraintes CHECK
ALTER TABLE public.buildings 
ADD CONSTRAINT chk_building_type 
CHECK (building_type IN ('apartment_building', 'villa_complex', 'mixed_residence', 'residential'));

ALTER TABLE public.buildings 
ADD CONSTRAINT chk_construction_status 
CHECK (construction_status IN ('planning', 'construction', 'delivered', 'planned'));

ALTER TABLE public.buildings 
ADD CONSTRAINT chk_building_class 
CHECK (building_class IN ('A+', 'A', 'B', 'C'));

ALTER TABLE public.buildings 
ADD CONSTRAINT chk_energy_certificate 
CHECK (energy_certificate IN ('A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'));

ALTER TABLE public.buildings 
ADD CONSTRAINT chk_parking_type 
CHECK (parking_type IN ('underground', 'outdoor', 'covered'));

-- Ajouter la contrainte UNIQUE pour building_code
ALTER TABLE public.buildings 
ADD CONSTRAINT unique_building_code 
UNIQUE(project_id, building_code);

-- Créer les index pour optimisation
CREATE INDEX IF NOT EXISTS idx_buildings_project ON public.buildings(project_id);
CREATE INDEX IF NOT EXISTS idx_buildings_status ON public.buildings(construction_status);
CREATE INDEX IF NOT EXISTS idx_buildings_type ON public.buildings(building_type);

-- Fonction pour calculer le nombre total d'unités disponibles
CREATE OR REPLACE FUNCTION calculate_building_units()
RETURNS TRIGGER AS $$
BEGIN
  -- Cette fonction sera mise à jour quand on créera la table properties
  -- Pour l'instant, on retourne simplement NEW
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ajouter des commentaires pour documentation
COMMENT ON TABLE public.buildings IS 'Gestion des bâtiments dans les projets immobiliers';
COMMENT ON COLUMN public.buildings.building_type IS 'Type de bâtiment : apartment_building, villa_complex, mixed_residence';
COMMENT ON COLUMN public.buildings.construction_status IS 'Statut : planning, construction, delivered';
COMMENT ON COLUMN public.buildings.building_name IS 'Nom du bâtiment';
COMMENT ON COLUMN public.buildings.building_code IS 'Code unique du bâtiment dans le projet';
COMMENT ON COLUMN public.buildings.energy_certificate IS 'Certificat énergétique A+ à G';