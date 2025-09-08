-- Corriger la localisation des développeurs mal placés
UPDATE developers 
SET main_city = 'Nicosia'
WHERE name IN ('Seafield Group', 'Imperio Properties');