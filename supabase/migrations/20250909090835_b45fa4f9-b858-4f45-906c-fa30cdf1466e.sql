-- Update Marina Bay Residences with complete realistic data
UPDATE projects SET
  title = 'Marina Bay Residences',
  project_code = 'MBR-2024-001',
  developer_id = 'bae5f53e-cf73-439e-99c6-3b78a5a2477b',
  property_category = 'residential',
  property_sub_type = ARRAY['apartment', 'penthouse'],
  project_phase = 'under-construction',
  launch_date = '2024-03-01',
  completion_date_new = '2026-09-01',
  description = 'Marina Bay Residences redéfinit le luxe résidentiel à Limassol avec 186 appartements et penthouses d''exception face à la mer. Architecture contemporaine signée par des maîtres internationaux.',
  detailed_description = 'Marina Bay Residences représente l''aboutissement du savoir-faire architectural méditerranéen moderne. Cette tour résidentielle de 42 étages offre 186 unités luxueuses, des studios aux penthouses de 4 chambres, toutes dotées de terrasses privées avec vue panoramique sur la Méditerranée. Chaque appartement bénéficie de finitions haut de gamme : sols en marbre italien, cuisines équipées Miele, domotique intégrée et systèmes de climatisation individuels. Les espaces communs comprennent un spa de 800m², une piscine à débordement de 25m, un centre de fitness ultramoderne, un concierge 24h/7j et un service de valet parking.',
  exclusive_commercialization = true,
  unique_selling_points = ARRAY['Tour la plus haute de Limassol', 'Vue mer à 360°', 'Spa privatif de 800m²', 'Concierge de luxe 24h/7j', 'Plage privée exclusive'],
  
  -- Location details
  full_address = '28 Amathountos Avenue, Marina District, 4532 Limassol, Cyprus',
  city = 'Limassol',
  region = 'Limassol District',
  neighborhood = 'Marina District',
  neighborhood_description = 'Le quartier le plus prestigieux de Limassol, au cœur de la marina moderne avec restaurants étoilés, boutiques de luxe et yacht club exclusif.',
  gps_latitude = 34.6851,
  gps_longitude = 33.0384,
  proximity_sea_km = 0.0,
  proximity_airport_km = 65.5,
  proximity_city_center_km = 2.1,
  proximity_highway_km = 1.8,
  cyprus_zone = 'limassol',
  
  -- Specifications
  land_area_m2 = 4500.0,
  built_area_m2 = 28500.0,
  total_units_new = 186,
  units_available_new = 142,
  bedrooms_range = '1-4',
  bathrooms_range = '1-4',
  floors_total = 42,
  parking_spaces = 220,
  storage_spaces = 186,
  
  -- Pricing
  price = 350000,
  price_from_new = 350000,
  price_to = 2800000,
  price_per_m2 = 7200,
  vat_rate_new = 5.0,
  vat_included = false,
  golden_visa_eligible_new = true,
  roi_estimate_percent = 8.5,
  rental_yield_percent = 5.8,
  financing_available = true,
  financing_options = '{"bank_partnerships": ["Bank of Cyprus", "Hellenic Bank"], "down_payment_min": 30, "max_term_years": 25}',
  payment_plan = '{"reservation": 5000, "contract": "30%", "construction_milestones": "60%", "completion": "10%"}',
  incentives = ARRAY['Frais notaire offerts', 'Mobilier design inclus', 'Service concierge 1 an gratuit'],
  
  -- Media with new photos
  categorized_photos = '[
    {"url": "/src/assets/marina-bay-hero.jpg", "category": "hero", "isPrimary": true, "caption": "Marina Bay Residences - Tour principale"},
    {"url": "/src/assets/marina-bay-exterior-1.jpg", "category": "exterior_1", "isPrimary": false, "caption": "Façade moderne et terrasses panoramiques"},
    {"url": "/src/assets/marina-bay-interior-1.jpg", "category": "interior_1", "isPrimary": false, "caption": "Salon avec vue mer panoramique"},
    {"url": "/src/assets/marina-bay-kitchen.jpg", "category": "kitchen", "isPrimary": false, "caption": "Cuisine équipée haut de gamme"},
    {"url": "/src/assets/marina-bay-bedroom.jpg", "category": "bedroom", "isPrimary": false, "caption": "Chambre principale avec dressing"},
    {"url": "/src/assets/marina-bay-balcony.jpg", "category": "balcony", "isPrimary": false, "caption": "Terrasse privée vue mer"},
    {"url": "/src/assets/marina-bay-amenities.jpg", "category": "amenities", "isPrimary": false, "caption": "Piscine à débordement et espaces détente"}
  ]'::jsonb,
  virtual_tour_url_new = 'https://virtualtour.marinabayresidences.com',
  project_presentation_url = 'https://brochure.marinabayresidences.com/fr',
  youtube_tour_url = 'https://youtube.com/watch?v=marinabay-tour',
  
  -- Construction
  construction_materials = ARRAY['Béton armé haute performance', 'Façade en verre double vitrage', 'Marbre de Carrare', 'Acier inoxydable marine'],
  finishing_level = 'luxury',
  design_style = 'Contemporary Mediterranean',
  architect_name = 'Foster + Partners',
  builder_name = 'J&P AVAX Construction',
  energy_rating = 'A+',
  sustainability_certifications = ARRAY['LEED Gold', 'BREEAM Very Good'],
  warranty_years = 10,
  
  -- Marketing
  project_narrative = 'Marina Bay Residences incarne l''excellence résidentielle méditerranéenne. Cette tour iconique de 42 étages redéfinit le skyline de Limassol en offrant un art de vivre inégalé. Chaque détail a été pensé pour créer une expérience résidentielle d''exception : depuis les matériaux nobles sélectionnés par nos architectes jusqu''aux services sur-mesure de notre concierge privé. Que vous recherchiez une résidence principale, une pied-à-terre de luxe ou un investissement patrimonial, Marina Bay Residences représente l''opportunité unique de posséder un appartement dans l''adresse la plus prestigieuse de Chypre. Éligible Golden Visa, avec vue mer garantie et services hôteliers intégrés.',
  meta_title_new = 'Marina Bay Residences Limassol - Appartements de Luxe Vue Mer | Golden Visa | ENKI Realty',
  meta_description_new = 'Découvrez Marina Bay Residences : 186 appartements et penthouses de luxe face à la mer à Limassol. Tour de 42 étages, spa privé, concierge 24h/7j. Dès 350 000€. Éligible Golden Visa.',
  meta_keywords = ARRAY['Marina Bay Residences', 'Appartement luxe Limassol', 'Golden Visa Chypre', 'Immobilier prestige Cyprus', 'Tour résidentielle mer'],
  marketing_highlights = ARRAY['Plus haute tour résidentielle de Limassol', 'Spa privatif 800m²', 'Plage privée exclusive', 'Concierge de palace', 'Rendement locatif 5,8%'],
  target_audience = ARRAY['Investisseurs internationaux', 'Familles expatriées', 'Résidents Golden Visa', 'Amateurs de luxe'],
  
  -- Features & Amenities  
  features = ARRAY['Vue mer panoramique', 'Spa privatif 800m²', 'Piscine à débordement', 'Concierge 24h/7j', 'Plage privée', 'Valet parking', 'Domotique intégrée', 'Cuisine équipée Miele'],
  
  -- Status
  status = 'under_construction',
  featured_new = true,
  
  -- Update timestamp
  updated_at = NOW()
  
WHERE id = 'dd01cefb-6eb7-49c1-bf18-6a56a0951105';