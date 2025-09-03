-- Fix Critical Security Issue: Audit Log Tampering Prevention (Corrected)

-- Drop the overly permissive audit log insert policy
DROP POLICY IF EXISTS "System can insert audit log entries" ON public.admin_audit_log;

-- Create a secure policy that denies ALL direct inserts from users
CREATE POLICY "Deny direct audit log inserts" 
ON public.admin_audit_log 
FOR INSERT 
TO authenticated
WITH CHECK (false);

-- Update the audit logging function to use SECURITY DEFINER with elevated privileges
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
    -- Use INSERT with explicit bypassing of RLS for this function
    INSERT INTO public.admin_audit_log (
      admin_user_id,
      action,
      resource_type,
      resource_id,
      details,
      ip_address,
      user_agent
    ) VALUES (
      auth.uid(),
      p_action,
      p_resource_type,
      p_resource_id,
      p_details,
      inet_client_addr(),
      current_setting('request.headers', true)::json ->> 'user-agent'
    );
  END IF;
END;
$$;

-- Create a function to get audit logs (safer than direct table access)
CREATE OR REPLACE FUNCTION public.get_audit_logs(
  p_limit INTEGER DEFAULT 100,
  p_offset INTEGER DEFAULT 0
) RETURNS TABLE(
  id UUID,
  admin_user_id UUID,
  admin_email TEXT,
  admin_name TEXT,
  action TEXT,
  resource_type TEXT,
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  seconds_ago NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow admins to access audit logs
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Insufficient permissions: Admin access required';
  END IF;

  RETURN QUERY
  SELECT 
    al.id,
    al.admin_user_id,
    p.email as admin_email,
    p.profile->>'name' as admin_name,
    al.action,
    al.resource_type,
    al.resource_id,
    al.details,
    al.ip_address,
    al.user_agent,
    al.created_at,
    EXTRACT(EPOCH FROM (now() - al.created_at)) as seconds_ago
  FROM public.admin_audit_log al
  LEFT JOIN public.profiles p ON al.admin_user_id = p.id
  ORDER BY al.created_at DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$;

-- Add additional security: Create a trigger to prevent any UPDATE or DELETE on audit logs
CREATE OR REPLACE FUNCTION public.prevent_audit_log_modification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log the attempt (this will work because it uses the SECURITY DEFINER function)
  PERFORM public.log_admin_action(
    'ATTEMPTED_AUDIT_LOG_MODIFICATION',
    'audit_log',
    OLD.id,
    jsonb_build_object(
      'attempted_operation', TG_OP,
      'blocked_at', now(),
      'original_entry', row_to_json(OLD)
    )
  );
  
  -- Always deny the operation
  RAISE EXCEPTION 'Audit log modification is strictly forbidden. This incident has been logged.';
END;
$$;

-- Create triggers to prevent modification of audit logs
DROP TRIGGER IF EXISTS prevent_audit_log_update ON public.admin_audit_log;
DROP TRIGGER IF EXISTS prevent_audit_log_delete ON public.admin_audit_log;

CREATE TRIGGER prevent_audit_log_update
  BEFORE UPDATE ON public.admin_audit_log
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_audit_log_modification();

CREATE TRIGGER prevent_audit_log_delete
  BEFORE DELETE ON public.admin_audit_log
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_audit_log_modification();

-- Add policies to prevent updates and deletes entirely
CREATE POLICY "Deny all audit log modifications" 
ON public.admin_audit_log 
FOR UPDATE
TO authenticated
USING (false);

CREATE POLICY "Deny all audit log deletions" 
ON public.admin_audit_log 
FOR DELETE
TO authenticated
USING (false);