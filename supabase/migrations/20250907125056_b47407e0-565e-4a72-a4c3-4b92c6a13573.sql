-- Mark user as blocked from client space
UPDATE profiles
SET profile = COALESCE(profile, '{}'::jsonb) || jsonb_build_object('blockedClient', true)
WHERE email = 'jmd@hypervisual.ch';