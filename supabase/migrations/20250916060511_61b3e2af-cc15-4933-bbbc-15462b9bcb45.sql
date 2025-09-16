-- Add new status fields to projects table
ALTER TABLE public.projects 
ADD COLUMN statut_commercial text,
ADD COLUMN statut_travaux text,
ADD COLUMN avancement_travaux integer DEFAULT 0;

-- Add check constraints for valid values
ALTER TABLE public.projects 
ADD CONSTRAINT check_statut_commercial 
CHECK (statut_commercial IN ('pre_lancement', 'lancement_commercial', 'en_commercialisation', 'dernieres_opportunites', 'vendu'));

ALTER TABLE public.projects 
ADD CONSTRAINT check_statut_travaux 
CHECK (statut_travaux IN ('preparation_chantier', 'travaux_en_cours', 'achevement', 'pret_a_emmenager'));

ALTER TABLE public.projects 
ADD CONSTRAINT check_avancement_travaux 
CHECK (avancement_travaux >= 0 AND avancement_travaux <= 100);

-- Set default values for existing projects
UPDATE public.projects 
SET statut_commercial = 'en_commercialisation', 
    statut_travaux = 'travaux_en_cours', 
    avancement_travaux = 50 
WHERE statut_commercial IS NULL;