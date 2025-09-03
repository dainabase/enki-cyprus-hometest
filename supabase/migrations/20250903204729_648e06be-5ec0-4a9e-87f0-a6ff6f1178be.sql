-- Fix security warnings for database functions
-- Set search_path for all custom functions

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Fix ab_test_assignments RLS policy - restrict read access to own assignments only
DROP POLICY IF EXISTS "Users can read their own assignments" ON public.ab_test_assignments;

CREATE POLICY "Users can read their own assignments" 
ON public.ab_test_assignments 
FOR SELECT 
USING (auth.uid() = user_id OR user_session = current_setting('request.headers', true)::json->>'x-session-id');

-- Ensure profiles table is properly secured
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Add policy for admins to view profiles if needed
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'
));