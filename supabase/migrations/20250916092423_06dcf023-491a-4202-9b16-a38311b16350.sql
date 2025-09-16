-- Update existing data to match expected values
UPDATE public.projects 
SET statut_commercial = 'dernieres_opportunites' 
WHERE statut_commercial = 'derniere_opportunite';

-- Drop existing constraint
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_statut_commercial_check;

-- Recreate constraint with correct values (note: adding missing 'lancement_commercial')
ALTER TABLE public.projects ADD CONSTRAINT projects_statut_commercial_check 
CHECK (statut_commercial IS NULL OR statut_commercial IN ('pre_lancement', 'lancement_commercial', 'en_commercialisation', 'dernieres_opportunites'));