-- Nettoyer les doublons de projets en gardant seulement le plus récent de chaque titre
WITH duplicate_projects AS (
  SELECT id, title, 
         ROW_NUMBER() OVER (PARTITION BY title ORDER BY created_at DESC) as rn
  FROM projects
)
DELETE FROM projects 
WHERE id IN (
  SELECT id FROM duplicate_projects WHERE rn > 1
);