-- Corriger la localisation de Cyfield Group
UPDATE developers 
SET main_city = 'Nicosia'
WHERE name ILIKE 'Cyfield Group%';