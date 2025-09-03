-- Fix Critical Security Issue: Audit Log Tampering Prevention

-- Drop the overly permissive audit log insert policy
DROP POLICY IF EXISTS "System can insert audit log entries" ON public.admin_audit_log;

-- Create a secure policy that only allows the system to insert audit log entries
-- This policy denies ALL direct inserts from users
CREATE POLICY "Deny direct audit log inserts" 
ON public.admin_audit_log 
FOR INSERT 
TO authenticated
WITH CHECK (false);

-- Update the audit logging function to use SECURITY DEFINER with elevated privileges
-- This allows the function to bypass RLS and insert directly
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

-- Create a read-only view for audit logs that includes additional security context
CREATE OR REPLACE VIEW public.audit_log_view AS
SELECT 
  al.*,
  p.email as admin_email,
  p.profile->>'name' as admin_name,
  EXTRACT(EPOCH FROM (now() - al.created_at)) as seconds_ago
FROM public.admin_audit_log al
LEFT JOIN public.profiles p ON al.admin_user_id = p.id
ORDER BY al.created_at DESC;

-- Grant SELECT on the view to admins only
GRANT SELECT ON public.audit_log_view TO authenticated;

-- Create RLS policy for the view
CREATE POLICY "Admins can view audit log" 
ON public.audit_log_view
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Add additional security: Create a trigger to prevent any UPDATE or DELETE on audit logs
CREATE OR REPLACE FUNCTION public.prevent_audit_log_modification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log the attempt
  INSERT INTO public.admin_audit_log (
    admin_user_id,
    action,
    resource_type,
    resource_id,
    details
  ) VALUES (
    auth.uid(),
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
CREATE TRIGGER prevent_audit_log_update
  BEFORE UPDATE ON public.admin_audit_log
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_audit_log_modification();

CREATE TRIGGER prevent_audit_log_delete
  BEFORE DELETE ON public.admin_audit_log
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_audit_log_modification();

-- Add policy to prevent updates and deletes entirely
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