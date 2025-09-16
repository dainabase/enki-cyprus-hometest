-- Ajouter la colonne statut du projet à la table projects
ALTER TABLE public.projects 
ADD COLUMN status_project text DEFAULT 'disponible' CHECK (
  status_project IN ('disponible', 'en_construction', 'livre', 'pret_a_emmenager')
);

-- Commentaire pour la colonne
COMMENT ON COLUMN public.projects.status_project IS 'Statut du projet: disponible, en_construction, livre, pret_a_emmenager';