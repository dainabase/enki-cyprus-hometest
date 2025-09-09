UPDATE projects 
SET categorized_photos = '[
  {"url": "/lovable-uploads/marina-bay-hero.jpg", "category": "hero", "isPrimary": true, "caption": "Vue d''ensemble Marina Bay Residences"},
  {"url": "/lovable-uploads/marina-bay-exterior-1.jpg", "category": "exterior_1", "isPrimary": false, "caption": "Façade principale et entrée"},
  {"url": "/lovable-uploads/marina-bay-exterior-2.jpg", "category": "exterior_2", "isPrimary": false, "caption": "Jardins et espaces extérieurs"},
  {"url": "/lovable-uploads/marina-bay-interior-1.jpg", "category": "interior_1", "isPrimary": false, "caption": "Salon principal avec vue mer"},
  {"url": "/lovable-uploads/marina-bay-interior-3.jpg", "category": "interior_2", "isPrimary": false, "caption": "Chambre principale avec terrasse"},
  {"url": "/lovable-uploads/marina-bay-kitchen-luxury.jpg", "category": "kitchen", "isPrimary": false, "caption": "Cuisine équipée haut de gamme"},
  {"url": "/lovable-uploads/marina-bay-bedroom.jpg", "category": "bedroom", "isPrimary": false, "caption": "Suite parentale vue mer"},
  {"url": "/lovable-uploads/marina-bay-bathroom.jpg", "category": "bathroom", "isPrimary": false, "caption": "Salle de bain marbre de Carrare"},
  {"url": "/lovable-uploads/marina-bay-balcony.jpg", "category": "balcony", "isPrimary": false, "caption": "Terrasse panoramique"},
  {"url": "/lovable-uploads/marina-bay-garden.jpg", "category": "garden", "isPrimary": false, "caption": "Jardins paysagers privés"},
  {"url": "/lovable-uploads/marina-bay-panoramic.jpg", "category": "panoramic_view", "isPrimary": false, "caption": "Vue panoramique 360°"},
  {"url": "/lovable-uploads/marina-bay-sea-view.jpg", "category": "sea_view", "isPrimary": false, "caption": "Vue mer depuis le penthouse"},
  {"url": "/lovable-uploads/marina-bay-mountain-view.jpg", "category": "mountain_view", "isPrimary": false, "caption": "Vue sur les montagnes de Troodos"},
  {"url": "/lovable-uploads/marina-bay-amenities-pool.jpg", "category": "amenities", "isPrimary": false, "caption": "Piscine à débordement et spa"},
  {"url": "/lovable-uploads/marina-bay-floor-plan.jpg", "category": "plans", "isPrimary": false, "caption": "Plan d''étage type appartement 3 chambres"}
]'::jsonb
WHERE id = 'dd01cefb-6eb7-49c1-bf18-6a56a0951105';