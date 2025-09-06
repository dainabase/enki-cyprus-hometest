-- Fix security issue: Restrict access to analytics_rate_limits table
-- Remove public read access and implement proper access controls

-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Allow rate limit select and update" ON public.analytics_rate_limits;
DROP POLICY IF EXISTS "Allow rate limit update" ON public.analytics_rate_limits;

-- Create secure policies that properly restrict access
CREATE POLICY "Users can view their own rate limit data" 
ON public.analytics_rate_limits 
FOR SELECT 
USING (
  -- Allow authenticated users to see their own data
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) 
  OR 
  -- Allow session-based access for anonymous users to their own session data
  (auth.uid() IS NULL AND session_id IS NOT NULL AND session_id = ((current_setting('request.headers', true))::json ->> 'x-session-id'))
  OR
  -- Allow admins to see all data
  (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ))
);

CREATE POLICY "Users can update their own rate limit data" 
ON public.analytics_rate_limits 
FOR UPDATE 
USING (
  -- Allow authenticated users to update their own data
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) 
  OR 
  -- Allow session-based updates for anonymous users
  (auth.uid() IS NULL AND session_id IS NOT NULL AND session_id = ((current_setting('request.headers', true))::json ->> 'x-session-id'))
  OR
  -- Allow admins to update all data
  (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ))
);

-- Keep the existing insert policy as it's already secure
-- Keep the user management policy for authenticated users