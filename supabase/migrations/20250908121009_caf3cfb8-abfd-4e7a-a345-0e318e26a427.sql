-- Redistribute all projects evenly and randomly among active developers (round-robin)
WITH devs AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS rn, COUNT(*) OVER() AS cnt
  FROM developers
  WHERE status = 'active'
),
projs AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY RANDOM()) AS rn
  FROM projects
)
UPDATE projects p
SET developer_id = d.id
FROM projs pr
JOIN devs d 
  ON ((pr.rn - 1) % d.cnt) + 1 = d.rn
WHERE p.id = pr.id;