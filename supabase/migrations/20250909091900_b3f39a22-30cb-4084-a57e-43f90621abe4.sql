-- Update Marina Bay Residences with complete data
UPDATE projects SET 
  developer_id = '99bac398-58fb-4f1a-a591-586620811114', -- Crona Property
  city = 'Limassol',
  region = 'Limassol District', 
  neighborhood = 'Marina',
  cyprus_zone = 'limassol',
  floors_total = 10,
  roi_estimate_percent = 8.5,
  rental_yield_percent = 6.2,
  categorized_photos = '[
    {"category": "principale", "urls": ["/lovable-uploads/marina-bay-hero.jpg"]},
    {"category": "exterieure", "urls": ["/lovable-uploads/marina-bay-exterior-1.jpg", "/lovable-uploads/marina-bay-exterior-2.jpg"]},
    {"category": "interieure", "urls": ["/lovable-uploads/marina-bay-interior-1.jpg", "/lovable-uploads/marina-bay-interior-2.jpg"]},
    {"category": "chambre", "urls": ["/lovable-uploads/marina-bay-bedroom.jpg"]},
    {"category": "salle_de_bain", "urls": ["/lovable-uploads/marina-bay-bathroom.jpg"]},
    {"category": "balcon", "urls": ["/lovable-uploads/marina-bay-balcony.jpg"]},
    {"category": "jardin", "urls": ["/lovable-uploads/marina-bay-garden.jpg"]},
    {"category": "vue_panoramique", "urls": ["/lovable-uploads/marina-bay-panoramic.jpg"]}
  ]'::jsonb
WHERE title = 'Marina Bay Residences';

-- Insert project amenities for Marina Bay Residences
INSERT INTO project_amenities (project_id, amenity_id, is_available, is_paid, details)
SELECT 
  p.id,
  a.id,
  true,
  false,
  'Inclus dans la résidence'
FROM projects p
CROSS JOIN amenities a 
WHERE p.title = 'Marina Bay Residences'
AND a.name IN (
  'Coworking Space', 'Business Center', 'High Speed Internet', 'Smart Home Ready',
  'Swimming Pool', 'Storage Space', 'Elevator', 'Parking', 'Cleaning Service',
  'Pet Friendly', 'Concierge', 'Barbecue Area', 'Garden', 'Roof Terrace',
  'Beach Access', 'Marina Access', 'Gym/Fitness', 'Tennis Court', 
  'Children Playground', 'Games Room', 'Video Intercom', '24/7 Security',
  'Spa', 'Sauna', 'Jacuzzi', 'Yoga Studio'
);

-- Insert nearby amenities for Marina Bay Residences
INSERT INTO project_nearby_amenities (project_id, nearby_amenity_id, distance_km, distance_minutes_walk, distance_minutes_drive, quantity, details)
SELECT 
  p.id,
  na.id,
  CASE 
    WHEN na.category = 'restaurants' THEN 0.5
    WHEN na.category = 'education' THEN 1.2
    WHEN na.category = 'healthcare' THEN 0.8
    WHEN na.category = 'entertainment' THEN 0.3
    WHEN na.category = 'nature' THEN 0.2
    WHEN na.category = 'services' THEN 0.4
    WHEN na.category = 'shopping' THEN 0.6
    WHEN na.category = 'transport' THEN 0.1
    ELSE 1.0
  END,
  CASE 
    WHEN na.category = 'restaurants' THEN 6
    WHEN na.category = 'education' THEN 15
    WHEN na.category = 'healthcare' THEN 10
    WHEN na.category = 'entertainment' THEN 4
    WHEN na.category = 'nature' THEN 3
    WHEN na.category = 'services' THEN 5
    WHEN na.category = 'shopping' THEN 8
    WHEN na.category = 'transport' THEN 2
    ELSE 12
  END,
  CASE 
    WHEN na.category = 'restaurants' THEN 2
    WHEN na.category = 'education' THEN 8
    WHEN na.category = 'healthcare' THEN 4
    WHEN na.category = 'entertainment' THEN 2
    WHEN na.category = 'nature' THEN 1
    WHEN na.category = 'services' THEN 3
    WHEN na.category = 'shopping' THEN 4
    WHEN na.category = 'transport' THEN 1
    ELSE 5
  END,
  CASE 
    WHEN na.category IN ('restaurants', 'education', 'healthcare', 'entertainment', 'nature', 'services', 'shopping') THEN 2
    WHEN na.category = 'transport' THEN 3
    ELSE 1
  END,
  'À proximité immédiate'
FROM projects p
CROSS JOIN nearby_amenities na 
WHERE p.title = 'Marina Bay Residences'
AND na.category IN ('restaurants', 'education', 'healthcare', 'entertainment', 'nature', 'services', 'shopping', 'transport')
AND na.id IN (
  SELECT id FROM nearby_amenities 
  WHERE category = 'restaurants' 
  ORDER BY sort_order 
  LIMIT 2
  UNION ALL
  SELECT id FROM nearby_amenities 
  WHERE category = 'education' 
  ORDER BY sort_order 
  LIMIT 2
  UNION ALL
  SELECT id FROM nearby_amenities 
  WHERE category = 'healthcare' 
  ORDER BY sort_order 
  LIMIT 2
  UNION ALL
  SELECT id FROM nearby_amenities 
  WHERE category = 'entertainment' 
  ORDER BY sort_order 
  LIMIT 2
  UNION ALL
  SELECT id FROM nearby_amenities 
  WHERE category = 'nature' 
  ORDER BY sort_order 
  LIMIT 2
  UNION ALL
  SELECT id FROM nearby_amenities 
  WHERE category = 'services' 
  ORDER BY sort_order 
  LIMIT 3
  UNION ALL
  SELECT id FROM nearby_amenities 
  WHERE category = 'shopping' 
  ORDER BY sort_order 
  LIMIT 2
  UNION ALL
  SELECT id FROM nearby_amenities 
  WHERE category = 'transport' 
  ORDER BY sort_order 
  LIMIT 3
);