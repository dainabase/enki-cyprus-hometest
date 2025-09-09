-- Update Marina Bay Residences basic data
UPDATE projects SET 
  developer_id = '99bac398-58fb-4f1a-a591-586620811114',
  city = 'Limassol',
  region = 'Limassol District', 
  neighborhood = 'Marina',
  cyprus_zone = 'limassol',
  floors_total = 10,
  roi_estimate_percent = 8.5,
  rental_yield_percent = 6.2
WHERE title = 'Marina Bay Residences';