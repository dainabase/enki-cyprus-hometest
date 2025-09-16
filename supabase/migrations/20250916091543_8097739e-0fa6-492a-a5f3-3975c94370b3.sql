-- Drop existing constraint for statut_travaux
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_statut_travaux_check;

-- Recreate constraint with "termine" instead of "pret_a_emmenager"
ALTER TABLE public.projects ADD CONSTRAINT projects_statut_travaux_check 
CHECK (statut_travaux IN ('preparation_chantier', 'travaux_en_cours', 'achevement', 'termine'));