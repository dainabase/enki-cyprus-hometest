-- Update existing user to admin role
UPDATE public.profiles 
SET role = 'admin', updated_at = now()
WHERE email = 'jmd@hypervisual.ch';

-- Verify the update
SELECT id, email, role, created_at, updated_at 
FROM public.profiles 
WHERE email = 'jmd@hypervisual.ch';