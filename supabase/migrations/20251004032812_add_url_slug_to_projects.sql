/*
  # Ajout de la colonne url_slug et fonction de génération automatique
  
  1. Modifications
    - Ajout de la colonne `url_slug` (text, unique, not null)
    - Création d'une fonction pour générer des slugs à partir du titre
    - Création d'un trigger pour remplir automatiquement url_slug
    - Index sur url_slug pour performances
  
  2. Sécurité
    - Contrainte d'unicité sur url_slug
    - Génération automatique pour éviter les erreurs
*/

-- Fonction pour générer un slug à partir d'un texte
CREATE OR REPLACE FUNCTION generate_slug(text_input TEXT)
RETURNS TEXT AS $$
DECLARE
  slug TEXT;
BEGIN
  -- Convertir en minuscules, remplacer espaces et caractères spéciaux
  slug := lower(text_input);
  slug := regexp_replace(slug, '[^a-z0-9\s-]', '', 'g');
  slug := regexp_replace(slug, '\s+', '-', 'g');
  slug := regexp_replace(slug, '-+', '-', 'g');
  slug := trim(both '-' from slug);
  
  RETURN slug;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Ajouter la colonne url_slug si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'url_slug'
  ) THEN
    ALTER TABLE projects ADD COLUMN url_slug TEXT;
  END IF;
END $$;

-- Remplir les slugs pour les projets existants
UPDATE projects
SET url_slug = generate_slug(title) || '-' || substring(id::text from 1 for 8)
WHERE url_slug IS NULL;

-- Rendre la colonne NOT NULL après avoir rempli les données
ALTER TABLE projects ALTER COLUMN url_slug SET NOT NULL;

-- Créer un index unique sur url_slug
CREATE UNIQUE INDEX IF NOT EXISTS projects_url_slug_unique_idx ON projects(url_slug);

-- Fonction trigger pour générer automatiquement le slug
CREATE OR REPLACE FUNCTION set_project_url_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.url_slug IS NULL OR NEW.url_slug = '' THEN
    NEW.url_slug := generate_slug(NEW.title) || '-' || substring(NEW.id::text from 1 for 8);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger si il n'existe pas
DROP TRIGGER IF EXISTS trigger_set_project_url_slug ON projects;
CREATE TRIGGER trigger_set_project_url_slug
  BEFORE INSERT OR UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION set_project_url_slug();