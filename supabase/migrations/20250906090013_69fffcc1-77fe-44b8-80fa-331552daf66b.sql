-- Supprimer les biens immobiliers individuels qui ne sont pas des programmes
-- On garde seulement les projets qui ont des noms de programmes (pas de détails spécifiques comme "2 chambres", "3 chambres")
DELETE FROM projects 
WHERE title LIKE '%chambres%' 
   OR title LIKE '%Appartement%' 
   OR title LIKE '%Penthouse%' 
   OR title LIKE '%Villa%' 
   OR title LIKE '%Maison%'
   OR title ~ '\d+\s+(chambre|bedroom)'  -- Regex pour nombre + chambre
   OR description LIKE '%m²%';  -- Descriptions avec superficie spécifique

-- Mettre à jour les données pour avoir des prix corrects
UPDATE projects 
SET price_from = CASE 
  WHEN price_from IS NULL OR price_from = '' THEN '250000'
  ELSE price_from
END;