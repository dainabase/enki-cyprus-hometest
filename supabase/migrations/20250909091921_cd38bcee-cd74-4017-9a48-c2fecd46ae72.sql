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
    {"category": "exterieure", "urls": ["/lovable-uploads/marina-bay-exterior-1.jpg", "/lovable-uploads/marina-bay-1.jpg"]},
    {"category": "interieure", "urls": ["/lovable-uploads/marina-bay-interior-1.jpg", "/lovable-uploads/marina-bay-2.jpg"]},
    {"category": "chambre", "urls": ["/lovable-uploads/marina-bay-bedroom.jpg"]},
    {"category": "salle_de_bain", "urls": ["/lovable-uploads/marina-bay-3.jpg"]},
    {"category": "balcon", "urls": ["/lovable-uploads/marina-bay-balcony.jpg"]},
    {"category": "jardin", "urls": ["/lovable-uploads/marina-bay-4.jpg"]},
    {"category": "vue_panoramique", "urls": ["/lovable-uploads/marina-bay-amenities.jpg"]}
  ]'::jsonb
WHERE title = 'Marina Bay Residences';