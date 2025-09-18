-- Ajouter la colonne hvac_type à la table properties
ALTER TABLE public.properties 
ADD COLUMN hvac_type TEXT;

-- Ajouter un commentaire pour expliquer les valeurs possibles
COMMENT ON COLUMN public.properties.hvac_type IS 'Type de système de climatisation: central_ac, split_units, vrf_system, underfloor_heating';