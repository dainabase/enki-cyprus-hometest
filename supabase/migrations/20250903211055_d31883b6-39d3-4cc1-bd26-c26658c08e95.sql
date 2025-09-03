-- Critical Security Fixes Migration

-- 1. Tighten Projects Table RLS Policies
-- Drop overly permissive policies
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.projects;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.projects;
DROP POLICY IF EXISTS "Allow authenticated delete" ON public.projects;

-- Create more restrictive policies for projects
CREATE POLICY "Only admins can insert projects" 
ON public.projects 
FOR INSERT 
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Only admins can update projects" 
ON public.projects 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Only admins can delete projects" 
ON public.projects 
FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 2. Enhance Analytics Security
-- Drop the overly permissive analytics policy
DROP POLICY IF EXISTS "Anyone can insert analytics events" ON public.analytics_events;

-- Create more restrictive analytics policy
CREATE POLICY "Authenticated users can insert analytics events" 
ON public.analytics_events 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Create rate limiting table for analytics
CREATE TABLE IF NOT EXISTS public.analytics_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id TEXT,
  event_count INTEGER DEFAULT 0,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on rate limits table
ALTER TABLE public.analytics_rate_limits ENABLE ROW LEVEL SECURITY;

-- Create policies for rate limits
CREATE POLICY "Users can manage their own rate limits" 
ON public.analytics_rate_limits 
FOR ALL 
TO authenticated
USING (auth.uid() = user_id);

-- 3. Add Admin Access Audit Trail
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Create policies for audit log
CREATE POLICY "Only admins can read audit log" 
ON public.admin_audit_log 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "System can insert audit log entries" 
ON public.admin_audit_log 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- 4. Create Rate Limiting Function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_user_id UUID DEFAULT NULL,
  p_session_id TEXT DEFAULT NULL,
  p_limit INTEGER DEFAULT 100,
  p_window_minutes INTEGER DEFAULT 60
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_count INTEGER;
  window_start_time TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Calculate window start time
  window_start_time := now() - (p_window_minutes || ' minutes')::INTERVAL;
  
  -- Get current count for user or session
  SELECT COALESCE(SUM(event_count), 0) INTO current_count
  FROM public.analytics_rate_limits
  WHERE (p_user_id IS NOT NULL AND user_id = p_user_id OR 
         p_session_id IS NOT NULL AND session_id = p_session_id)
    AND window_start >= window_start_time;
  
  -- Return true if under limit
  RETURN current_count < p_limit;
END;
$$;

-- 5. Create Audit Logging Function
CREATE OR REPLACE FUNCTION public.log_admin_action(
  p_action TEXT,
  p_resource_type TEXT,
  p_resource_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT '{}'
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only log if user is admin
  IF EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    INSERT INTO public.admin_audit_log (
      admin_user_id,
      action,
      resource_type,
      resource_id,
      details
    ) VALUES (
      auth.uid(),
      p_action,
      p_resource_type,
      p_resource_id,
      p_details
    );
  END IF;
END;
$$;

-- 6. Update timestamp triggers
CREATE TRIGGER update_analytics_rate_limits_updated_at
  BEFORE UPDATE ON public.analytics_rate_limits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 7. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_rate_limits_user_window 
ON public.analytics_rate_limits(user_id, window_start);

CREATE INDEX IF NOT EXISTS idx_analytics_rate_limits_session_window 
ON public.analytics_rate_limits(session_id, window_start);

CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin_user 
ON public.admin_audit_log(admin_user_id, created_at);

CREATE INDEX IF NOT EXISTS idx_admin_audit_log_resource 
ON public.admin_audit_log(resource_type, resource_id);