-- Security Fix: Secure Analytics Events and A/B Test Assignments
-- Update RLS policies to prevent data pollution from unauthenticated users

-- Fix analytics_events table - require authentication for inserts
DROP POLICY IF EXISTS "Authenticated users can insert analytics events" ON public.analytics_events;

CREATE POLICY "Only authenticated users can insert analytics events" 
ON public.analytics_events 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Fix ab_test_assignments table - require authentication or valid session for inserts
DROP POLICY IF EXISTS "Anyone can insert assignments" ON public.ab_test_assignments;

CREATE POLICY "Authenticated users or valid sessions can insert assignments" 
ON public.ab_test_assignments 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL OR 
  user_session IS NOT NULL
);