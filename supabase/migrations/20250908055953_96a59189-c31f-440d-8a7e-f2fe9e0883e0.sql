-- Supprimer les doublons dans la table developers
-- Garder seulement l'entrée la plus récente pour chaque nom de développeur

WITH duplicates AS (
  SELECT id, 
         ROW_NUMBER() OVER (PARTITION BY name ORDER BY created_at DESC) as rn
  FROM developers
)
DELETE FROM developers 
WHERE id IN (
  SELECT id 
  FROM duplicates 
  WHERE rn > 1
);