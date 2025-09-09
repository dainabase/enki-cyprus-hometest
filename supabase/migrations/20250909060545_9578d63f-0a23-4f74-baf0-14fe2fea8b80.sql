-- Mettre à jour Marina Bay Residence avec de nouvelles photos
UPDATE projects 
SET photos = ARRAY[
  '/src/assets/marina-bay-1.jpg',
  '/src/assets/marina-bay-2.jpg', 
  '/src/assets/marina-bay-3.jpg',
  '/src/assets/marina-bay-4.jpg'
]
WHERE title = 'Marina Bay Residence';

-- Mettre à jour Mountain View Villas avec de nouvelles photos
UPDATE projects 
SET photos = ARRAY[
  '/src/assets/mountain-villa-1.jpg',
  '/src/assets/mountain-villa-2.jpg',
  '/src/assets/mountain-villa-3.jpg', 
  '/src/assets/mountain-villa-5.jpg'
]
WHERE title = 'Mountain View Villas';

-- Mettre à jour Skyline Towers avec de nouvelles photos
UPDATE projects 
SET photos = ARRAY[
  '/src/assets/skyline-tower-1.jpg',
  '/src/assets/skyline-tower-2.jpg',
  '/src/assets/skyline-tower-3.jpg',
  '/src/assets/skyline-tower-4.jpg'
]
WHERE title = 'Skyline Towers';