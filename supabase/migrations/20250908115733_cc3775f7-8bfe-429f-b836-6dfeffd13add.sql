-- Add Island Blue logo to developers
UPDATE developers 
SET logo = '/lovable-uploads/861197ca-75d2-4e8d-aeb1-63050614bece.png'
WHERE name ILIKE '%Island Blue%' OR name ILIKE '%island blue%';