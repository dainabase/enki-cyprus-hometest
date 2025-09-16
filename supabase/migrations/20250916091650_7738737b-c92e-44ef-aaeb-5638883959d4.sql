-- First update existing data
UPDATE public.projects 
SET statut_travaux = 'termine' 
WHERE statut_travaux = 'pret_a_emmenager';

-- Drop existing constraint
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_statut_travaux_check;

-- Recreate constraint with "termine" instead of "pret_a_emmenager"
ALTER TABLE public.projects ADD CONSTRAINT projects_statut_travaux_check 
CHECK (statut_travaux IN ('preparation_chantier', 'travaux_en_cours', 'achevement', 'termine'));