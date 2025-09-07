-- Restore admin role for the user but keep client access blocked
UPDATE profiles 
SET role = 'admin'
WHERE email = 'jmd@hypervisual.ch';