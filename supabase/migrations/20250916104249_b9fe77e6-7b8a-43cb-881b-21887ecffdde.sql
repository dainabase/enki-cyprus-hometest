-- Add commercial status column to projects table
ALTER TABLE public.projects 
ADD COLUMN statut_commercial text DEFAULT 'prelancement' 
CHECK (statut_commercial IN ('prelancement', 'lancement_commercial', 'en_commercialisation', 'derniere_opportunite', 'vendu'));