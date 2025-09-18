-- Finaliser la synchronisation complète entre formulaire et DB

-- 1. Supprimer l'ancienne colonne air_conditioning_type puisqu'on a hvac_type
ALTER TABLE public.properties DROP COLUMN IF EXISTS air_conditioning_type;

-- 2. Corriger les types de données JSONB pour correspondre au schéma Zod
-- appliances_list doit être JSONB pour un array de strings  
-- smart_home_features doit être JSONB pour un array de strings
-- security_features doit être JSONB pour un array de strings 
-- view_type doit être JSONB pour un array d'enums
-- payment_plan_details doit être JSONB pour un objet

-- Ces colonnes existent déjà mais vérifions qu'elles sont bien JSONB
DO $$
BEGIN
    -- Vérifier et corriger le type de appliances_list si nécessaire
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND column_name = 'appliances_list' 
        AND data_type = 'jsonb'
    ) THEN
        ALTER TABLE public.properties 
        ALTER COLUMN appliances_list TYPE JSONB USING appliances_list::JSONB;
    END IF;
    
    -- Vérifier et corriger le type de smart_home_features si nécessaire
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND column_name = 'smart_home_features' 
        AND data_type = 'jsonb'
    ) THEN
        ALTER TABLE public.properties 
        ALTER COLUMN smart_home_features TYPE JSONB USING smart_home_features::JSONB;
    END IF;
END $$;

-- 3. Ajouter les champs manquants si ils n'existent pas
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS uncovered_verandas NUMERIC;