-- Ajouter le champ commercialisation en exclusivité à la table projects
ALTER TABLE public.projects 
ADD COLUMN exclusive_commercialization BOOLEAN DEFAULT false;