-- Fix RLS policies for analytics tables to prevent violations
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Analytics events require authentication" ON public.analytics_events;
DROP POLICY IF EXISTS "Rate limits require authentication" ON public.analytics_rate_limits;

-- Create proper RLS policies for analytics_events
CREATE POLICY "Allow analytics events insertion" 
ON public.analytics_events 
FOR INSERT 
USING (true);

CREATE POLICY "Allow analytics events selection for admins" 
ON public.analytics_events 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create proper RLS policies for analytics_rate_limits
CREATE POLICY "Allow rate limit operations" 
ON public.analytics_rate_limits 
FOR ALL 
USING (true);

-- Update analytics_rate_limits table structure to handle upserts correctly
ALTER TABLE public.analytics_rate_limits 
ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY;

-- Create unique constraint for proper upsert operations
CREATE UNIQUE INDEX IF NOT EXISTS analytics_rate_limits_unique_window 
ON public.analytics_rate_limits (COALESCE(user_id::text, ''), COALESCE(session_id, ''), window_start);