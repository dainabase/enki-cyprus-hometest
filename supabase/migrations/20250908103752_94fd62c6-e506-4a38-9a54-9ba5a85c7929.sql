-- Ajouter le logo Quality Group
UPDATE developers 
SET logo = '/lovable-uploads/2a8288f1-3cc0-4f74-8b35-98081859219e.png'
WHERE name ILIKE '%Quality Group%' OR name ILIKE '%Quality%';