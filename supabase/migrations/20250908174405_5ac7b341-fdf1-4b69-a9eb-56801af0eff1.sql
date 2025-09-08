-- Supprimer tous les projets existants et leurs dépendances
DELETE FROM project_amenities;
DELETE FROM project_nearby_amenities;
DELETE FROM project_images;
DELETE FROM project_documents;
DELETE FROM project_ai_imports;
DELETE FROM favorites;
DELETE FROM commissions WHERE project_id IN (SELECT id FROM projects);
DELETE FROM projects;

-- Insérer 3 nouveaux projets avec champs essentiels seulement
INSERT INTO projects (
  title,
  description,
  price,
  location,
  city,
  developer_id,
  status,
  photos,
  features,
  amenities,
  url_slug,
  featured_new,
  golden_visa_eligible_new
) VALUES 
(
  'Marina Bay Residences',
  'Découvrez Marina Bay Residences, un projet résidentiel de prestige offrant des appartements luxueux avec vue panoramique sur la mer Méditerranée.',
  450000,
  '{"address": "123 Marina Boulevard", "city": "Limassol", "country": "Cyprus", "coordinates": {"lat": 34.6751, "lng": 33.0431}}',
  'Limassol',
  (SELECT id FROM developers WHERE name = 'Crona Group' LIMIT 1),
  'under_construction',
  ARRAY['https://example.com/marina1.jpg', 'https://example.com/marina2.jpg', 'https://example.com/marina3.jpg'],
  ARRAY['sea_view', 'private_beach', 'modern_design', 'smart_home', 'concierge'],
  ARRAY['swimming_pool', 'spa', 'gym', 'private_beach', 'parking'],
  'marina-bay-residences-limassol',
  true,
  true
),
(
  'Skyline Tower',
  'Skyline Tower représente l''innovation architecturale à Nicosie avec ses appartements modernes et ses vues panoramiques sur la capitale.',
  320000,
  '{"address": "456 Central Avenue", "city": "Nicosia", "country": "Cyprus", "coordinates": {"lat": 35.1856, "lng": 33.3823}}',
  'Nicosia',
  (SELECT id FROM developers WHERE name = 'LemonMaria Developers' LIMIT 1),
  'under_construction',
  ARRAY['https://example.com/skyline1.jpg', 'https://example.com/skyline2.jpg', 'https://example.com/skyline3.jpg'],
  ARRAY['city_view', 'mountain_view', 'modern_design', 'rooftop_pool', 'smart_home'],
  ARRAY['rooftop_pool', 'fitness_center', 'coworking', 'automated_parking', 'security'],
  'skyline-tower-nicosia',
  true,
  true
),
(
  'Mountain View Villas',
  'Mountain View Villas offre des villas exclusives dans un cadre naturel exceptionnel, alliant luxe moderne et authenticité chypriote.',
  950000,
  '{"address": "789 Mountain Road", "city": "Limassol Hills", "country": "Cyprus", "coordinates": {"lat": 34.7041, "lng": 32.9984}}',
  'Limassol Hills',
  null,
  'pre_launch',
  ARRAY['https://example.com/mountain1.jpg', 'https://example.com/mountain2.jpg', 'https://example.com/mountain3.jpg'],
  ARRAY['mountain_view', 'sea_view', 'private_pool', 'garden', 'eco_design'],
  ARRAY['private_pool', 'garden', 'bbq_area', 'garage', 'solar_panels'],
  'mountain-view-villas-limassol',
  true,
  true
);