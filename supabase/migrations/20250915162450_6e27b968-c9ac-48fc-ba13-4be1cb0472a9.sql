-- Remove blockedClient flag from user profile to restore admin access
UPDATE profiles 
SET profile = jsonb_set(
  COALESCE(profile, '{}'), 
  '{blockedClient}', 
  'false'
) 
WHERE email = 'jmd@hypervisual.ch';