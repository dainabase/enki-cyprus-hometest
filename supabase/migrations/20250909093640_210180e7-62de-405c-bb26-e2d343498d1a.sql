-- Ensure we target the correct project by ID
DO $$ BEGIN
  -- Basic fields
  UPDATE projects SET 
    developer_id = '99bac398-58fb-4f1a-a591-586620811114',
    city = 'Limassol',
    region = 'Limassol District', 
    neighborhood = 'Marina',
    cyprus_zone = 'limassol',
    floors_total = 10,
    roi_estimate_percent = 8.5,
    rental_yield_percent = 6.2
  WHERE id = 'dd01cefb-6eb7-49c1-bf18-6a56a0951105';
END $$;

-- Reset and insert project images
DELETE FROM project_images WHERE project_id = 'dd01cefb-6eb7-49c1-bf18-6a56a0951105';
INSERT INTO project_images (project_id, url, caption, is_primary, display_order) VALUES
('dd01cefb-6eb7-49c1-bf18-6a56a0951105', '/lovable-uploads/marina-bay-hero.jpg', 'Image principale', true, 1),
('dd01cefb-6eb7-49c1-bf18-6a56a0951105', '/lovable-uploads/marina-bay-exterior-1.jpg', 'Extérieur 1', false, 2),
('dd01cefb-6eb7-49c1-bf18-6a56a0951105', '/lovable-uploads/marina-bay-exterior-2.jpg', 'Extérieur 2', false, 3),
('dd01cefb-6eb7-49c1-bf18-6a56a0951105', '/lovable-uploads/marina-bay-interior-1.jpg', 'Intérieur 1', false, 4),
('dd01cefb-6eb7-49c1-bf18-6a56a0951105', '/lovable-uploads/marina-bay-interior-2.jpg', 'Intérieur 2', false, 5),
('dd01cefb-6eb7-49c1-bf18-6a56a0951105', '/lovable-uploads/marina-bay-bedroom.jpg', 'Chambre', false, 6),
('dd01cefb-6eb7-49c1-bf18-6a56a0951105', '/lovable-uploads/marina-bay-bathroom.jpg', 'Salle de bain', false, 7),
('dd01cefb-6eb7-49c1-bf18-6a56a0951105', '/lovable-uploads/marina-bay-balcony.jpg', 'Balcon', false, 8),
('dd01cefb-6eb7-49c1-bf18-6a56a0951105', '/lovable-uploads/marina-bay-garden.jpg', 'Jardin', false, 9),
('dd01cefb-6eb7-49c1-bf18-6a56a0951105', '/lovable-uploads/marina-bay-panoramic.jpg', 'Vue panoramique', false, 10);

-- Insert amenities (ignore if name not found)
INSERT INTO project_amenities (project_id, amenity_id, is_available, is_paid)
SELECT 'dd01cefb-6eb7-49c1-bf18-6a56a0951105', a.id, true, false
FROM amenities a
WHERE a.name IN (
  'Coworking Space','Business Center','High Speed Internet','Smart Home Ready','Swimming Pool','Storage Space','Elevator','Parking','Cleaning Service','Pet Friendly','Concierge',
  'Barbecue Area','Garden','Roof Terrace','Beach Access','Marina Access',
  'Gym/Fitness','Tennis Court','Children Playground','Games Room',
  'Video Intercom','24/7 Security',
  'Spa','Sauna','Jacuzzi','Yoga Studio'
)
AND NOT EXISTS (
  SELECT 1 FROM project_amenities pa WHERE pa.project_id = 'dd01cefb-6eb7-49c1-bf18-6a56a0951105' AND pa.amenity_id = a.id
);

-- Nearby amenities: per-category selection
-- Restaurants (2)
INSERT INTO project_nearby_amenities (project_id, nearby_amenity_id, distance_km, distance_minutes_walk, distance_minutes_drive, quantity, details)
SELECT 'dd01cefb-6eb7-49c1-bf18-6a56a0951105', na.id, 0.5, 6, 2, 2, 'À proximité immédiate'
FROM nearby_amenities na WHERE na.category='restaurants' ORDER BY sort_order NULLS LAST LIMIT 2;
-- Education (2)
INSERT INTO project_nearby_amenities (project_id, nearby_amenity_id, distance_km, distance_minutes_walk, distance_minutes_drive, quantity, details)
SELECT 'dd01cefb-6eb7-49c1-bf18-6a56a0951105', na.id, 1.2, 15, 8, 2, 'À proximité immédiate'
FROM nearby_amenities na WHERE na.category='education' ORDER BY sort_order NULLS LAST LIMIT 2;
-- Healthcare (2)
INSERT INTO project_nearby_amenities (project_id, nearby_amenity_id, distance_km, distance_minutes_walk, distance_minutes_drive, quantity, details)
SELECT 'dd01cefb-6eb7-49c1-bf18-6a56a0951105', na.id, 0.8, 10, 4, 2, 'À proximité immédiate'
FROM nearby_amenities na WHERE na.category='healthcare' ORDER BY sort_order NULLS LAST LIMIT 2;
-- Entertainment (2)
INSERT INTO project_nearby_amenities (project_id, nearby_amenity_id, distance_km, distance_minutes_walk, distance_minutes_drive, quantity, details)
SELECT 'dd01cefb-6eb7-49c1-bf18-6a56a0951105', na.id, 0.3, 4, 2, 2, 'À proximité immédiate'
FROM nearby_amenities na WHERE na.category='entertainment' ORDER BY sort_order NULLS LAST LIMIT 2;
-- Nature (2)
INSERT INTO project_nearby_amenities (project_id, nearby_amenity_id, distance_km, distance_minutes_walk, distance_minutes_drive, quantity, details)
SELECT 'dd01cefb-6eb7-49c1-bf18-6a56a0951105', na.id, 0.2, 3, 1, 2, 'À proximité immédiate'
FROM nearby_amenities na WHERE na.category='nature' ORDER BY sort_order NULLS LAST LIMIT 2;
-- Services (3)
INSERT INTO project_nearby_amenities (project_id, nearby_amenity_id, distance_km, distance_minutes_walk, distance_minutes_drive, quantity, details)
SELECT 'dd01cefb-6eb7-49c1-bf18-6a56a0951105', na.id, 0.4, 5, 3, 3, 'À proximité immédiate'
FROM nearby_amenities na WHERE na.category='services' ORDER BY sort_order NULLS LAST LIMIT 3;
-- Shopping (2)
INSERT INTO project_nearby_amenities (project_id, nearby_amenity_id, distance_km, distance_minutes_walk, distance_minutes_drive, quantity, details)
SELECT 'dd01cefb-6eb7-49c1-bf18-6a56a0951105', na.id, 0.6, 8, 4, 2, 'À proximité immédiate'
FROM nearby_amenities na WHERE na.category='shopping' ORDER BY sort_order NULLS LAST LIMIT 2;
-- Transport (3)
INSERT INTO project_nearby_amenities (project_id, nearby_amenity_id, distance_km, distance_minutes_walk, distance_minutes_drive, quantity, details)
SELECT 'dd01cefb-6eb7-49c1-bf18-6a56a0951105', na.id, 0.1, 2, 1, 3, 'À proximité immédiate'
FROM nearby_amenities na WHERE na.category='transport' ORDER BY sort_order NULLS LAST LIMIT 3;