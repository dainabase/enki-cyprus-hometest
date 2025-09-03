-- Fix Security Definer View Issue

-- Drop the security definer view and replace with a function-based approach
DROP VIEW IF EXISTS public.audit_log_view;

-- Create a secure function to retrieve audit logs instead of a view
CREATE OR REPLACE FUNCTION public.get_audit_logs(
  p_limit INTEGER DEFAULT 100,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE(
  id UUID,
  admin_user_id UUID,
  action TEXT,
  resource_type TEXT,
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  admin_email TEXT,
  admin_name TEXT,
  seconds_ago NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow admins to view audit logs
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  RETURN QUERY
  SELECT 
    al.id,
    al.admin_user_id,
    al.action,
    al.resource_type,
    al.resource_id,
    al.details,
    al.ip_address,
    al.user_agent,
    al.created_at,
    p.email as admin_email,
    p.profile->>'name' as admin_name,
    EXTRACT(EPOCH FROM (now() - al.created_at)) as seconds_ago
  FROM public.admin_audit_log al
  LEFT JOIN public.profiles p ON al.admin_user_id = p.id
  ORDER BY al.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- Remove the can_view_audit_logs function as it's no longer needed
DROP FUNCTION IF EXISTS public.can_view_audit_logs();