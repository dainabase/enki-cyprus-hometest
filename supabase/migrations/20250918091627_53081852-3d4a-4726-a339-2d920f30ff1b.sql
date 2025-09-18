-- Migration pour synchroniser les champs du formulaire avec la base de données properties

-- Champs manquants identifiés dans l'analyse du formulaire vs DB :

-- 1. Corrections de noms de colonnes existantes
ALTER TABLE public.properties 
RENAME COLUMN property_subtype TO property_sub_type;

ALTER TABLE public.properties 
RENAME COLUMN position_on_floor TO position_in_floor;

ALTER TABLE public.properties 
RENAME COLUMN covered_veranda_area TO covered_verandas;

ALTER TABLE public.properties 
RENAME COLUMN uncovered_veranda_area TO uncovered_verandas;

ALTER TABLE public.properties 
RENAME COLUMN garden_area TO private_garden_area;

ALTER TABLE public.properties 
RENAME COLUMN roof_terrace_area TO roof_garden_area;

ALTER TABLE public.properties 
RENAME COLUMN air_conditioning_type TO hvac_type;

-- 2. Ajout des champs manquants

-- Espaces extérieurs
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS balcony_area NUMERIC;

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS terrace_count INTEGER DEFAULT 0;

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS terrace_area NUMERIC;

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS pool_type TEXT;

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS parking_type TEXT;

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS storage_spaces INTEGER DEFAULT 0;

-- Vues
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

-- Commentaires pour clarifier les colonnes
COMMENT ON COLUMN public.properties.hvac_type IS 'Type de climatisation: central_ac, split_units, vrf_system, underfloor_heating';
COMMENT ON COLUMN public.properties.parking_type IS 'Type de parking: garage, covered, uncovered';
COMMENT ON COLUMN public.properties.pool_type IS 'Type de piscine: private, shared, communal';
COMMENT ON COLUMN public.properties.view_type IS 'Types de vues (array): sea, mountain, city, garden, pool, street';
COMMENT ON COLUMN public.properties.security_features IS 'Fonctionnalités de sécurité (array JSON)';