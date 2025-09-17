-- Supprimer la contrainte obsolète qui cause le conflit
ALTER TABLE buildings DROP CONSTRAINT IF EXISTS buildings_construction_status_check;

-- Mettre à jour la valeur par défaut pour être cohérente
ALTER TABLE buildings ALTER COLUMN construction_status SET DEFAULT 'planned';