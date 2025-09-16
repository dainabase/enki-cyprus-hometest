-- Fix statut_commercial constraint with correct spelling
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_statut_commercial_check;

ALTER TABLE public.projects ADD CONSTRAINT projects_statut_commercial_check 
CHECK (statut_commercial IS NULL OR statut_commercial IN ('pre_lancement', 'lancement_commercial', 'en_commercialisation', 'dernieres_opportunites'));