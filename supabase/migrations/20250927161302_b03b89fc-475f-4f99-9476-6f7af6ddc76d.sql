-- Ajouter les colonnes street_number et street_name à la table projects
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS street_number TEXT,
ADD COLUMN IF NOT EXISTS street_name TEXT;

COMMENT ON COLUMN projects.street_number IS 'Numéro de rue (ex: 45, 12A)';
COMMENT ON COLUMN projects.street_name IS 'Nom de la rue (ex: Poseidonos Avenue)';