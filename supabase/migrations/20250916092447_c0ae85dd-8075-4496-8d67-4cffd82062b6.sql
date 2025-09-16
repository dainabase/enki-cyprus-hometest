-- Temporarily remove constraint to allow data correction
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_statut_commercial_check;

-- Update data to match schema (plural form)
UPDATE public.projects 
SET statut_commercial = 'dernieres_opportunites' 
WHERE statut_commercial = 'derniere_opportunite';

-- Recreate constraint with correct plural form
ALTER TABLE public.projects ADD CONSTRAINT projects_statut_commercial_check 
CHECK (statut_commercial IS NULL OR statut_commercial IN ('pre_lancement', 'lancement_commercial', 'en_commercialisation', 'dernieres_opportunites'));