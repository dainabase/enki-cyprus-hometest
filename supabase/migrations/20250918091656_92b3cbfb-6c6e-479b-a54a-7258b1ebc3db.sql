-- Migration pour synchroniser les champs du formulaire avec la base de données properties

-- 1. Corrections de noms de colonnes existantes (en vérifiant d'abord leur existence)
DO $$
BEGIN
    -- Renommer property_subtype si elle existe
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'property_subtype') THEN
        ALTER TABLE public.properties RENAME COLUMN property_subtype TO property_sub_type;
    END IF;
    
    -- Renommer position_on_floor si elle existe  
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'position_on_floor') THEN
        ALTER TABLE public.properties RENAME COLUMN position_on_floor TO position_in_floor;
    END IF;
    
    -- Renommer covered_veranda_area si elle existe
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'covered_veranda_area') THEN
        ALTER TABLE public.properties RENAME COLUMN covered_veranda_area TO covered_verandas;
    END IF;
    
    -- Renommer uncovered_veranda_area si elle existe
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'uncovered_veranda_area') THEN
        ALTER TABLE public.properties RENAME COLUMN uncovered_veranda_area TO uncovered_verandas;
    END IF;
    
    -- Renommer garden_area si elle existe
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'garden_area') THEN
        ALTER TABLE public.properties RENAME COLUMN garden_area TO private_garden_area;
    END IF;
    
    -- Renommer roof_terrace_area si elle existe
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'roof_terrace_area') THEN
        ALTER TABLE public.properties RENAME COLUMN roof_terrace_area TO roof_garden_area;
    END IF;
    
    -- Renommer air_conditioning_type si elle existe (et hvac_type n'existe pas)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'air_conditioning_type') 
    AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'hvac_type') THEN
        ALTER TABLE public.properties RENAME COLUMN air_conditioning_type TO hvac_type;
    END IF;
END $$;

-- 2. Ajout des champs manquants
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS balcony_area NUMERIC;

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS terrace_count INTEGER DEFAULT 0;

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS terrace_area NUMERIC;

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS pool_type TEXT;

-- Corriger le nom de la colonne parking_type (différent de parking_type_unit)
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS parking_type TEXT;

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS storage_spaces INTEGER DEFAULT 0;

-- Vues en tant qu'array
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS view_type JSONB DEFAULT '[]';

-- Champs de sécurité en tant qu'array
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS security_features JSONB DEFAULT '[]';

-- Documentation
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS internal_notes TEXT;

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS public_description TEXT;