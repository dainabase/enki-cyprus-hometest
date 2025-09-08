-- Assigner un développeur aléatoire aux projets sans développeur
UPDATE projects
SET developer_id = (
  SELECT id FROM developers ORDER BY random() LIMIT 1
)
WHERE developer_id IS NULL;
