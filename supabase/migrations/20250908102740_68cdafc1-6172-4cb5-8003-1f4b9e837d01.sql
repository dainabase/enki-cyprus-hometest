-- Ajouter les logos pour BBF et D.ZAVOS GROUP

-- BBF logo
UPDATE developers 
SET logo = '/lovable-uploads/b5ced174-3c3d-4a14-ac08-3d9c466c25c0.png'
WHERE name ILIKE '%BBF%' OR name ILIKE '%Bespoke Building Franchise%';

-- D.ZAVOS GROUP logo  
UPDATE developers 
SET logo = '/lovable-uploads/ecbada79-fdcc-4174-9a11-f5d951be818f.png'
WHERE name ILIKE '%D. Zavos%' OR name ILIKE '%Zavos%';