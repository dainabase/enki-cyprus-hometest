-- Assign random developers to projects for tracking and testing
UPDATE projects 
SET developer_id = (
  SELECT id 
  FROM developers 
  WHERE status = 'active' 
  ORDER BY RANDOM() 
  LIMIT 1
)
WHERE developer_id IS NULL;