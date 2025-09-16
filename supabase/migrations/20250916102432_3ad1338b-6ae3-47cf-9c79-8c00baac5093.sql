-- Supprimer les colonnes de statut de la table projects
ALTER TABLE public.projects 
DROP COLUMN IF EXISTS statut_commercial,
DROP COLUMN IF EXISTS statut_travaux,
DROP COLUMN IF EXISTS avancement_travaux;