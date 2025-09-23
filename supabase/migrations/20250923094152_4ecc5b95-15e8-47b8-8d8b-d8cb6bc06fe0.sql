-- Add missing brochure_pdf column to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS brochure_pdf TEXT;

-- Add comment for documentation
COMMENT ON COLUMN projects.brochure_pdf IS 'URL du PDF de la brochure du projet';