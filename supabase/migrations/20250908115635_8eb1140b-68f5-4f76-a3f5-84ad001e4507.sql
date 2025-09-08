-- Add Cyfield logo to developers
UPDATE developers 
SET logo = '/lovable-uploads/05694454-206c-437a-8d8f-0f611218a26f.png'
WHERE name ILIKE '%Cyfield%' OR name ILIKE '%Cyfiled%';