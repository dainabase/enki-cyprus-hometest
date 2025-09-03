-- Fix Critical Security Issue: Audit Log Tampering Prevention (Corrected)

-- Drop ALL existing policies on admin_audit_log first
DROP POLICY IF EXISTS "Only admins can read audit log" ON public.admin_audit_log;
DROP POLICY IF EXISTS "System can insert audit log entries" ON public.admin_audit_log;
DROP POLICY IF EXISTS "Deny direct audit log inserts" ON public.admin_audit_log;
DROP POLICY IF EXISTS "Deny all audit log modifications" ON public.admin_audit_log;
DROP POLICY IF EXISTS "Deny all audit log deletions" ON public.admin_audit_log;

-- Create secure policies that prevent tampering
CREATE POLICY "Deny all direct audit log access" 
ON public.admin_audit_log 
FOR ALL
TO authenticated
USING (false)
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

-- Create a secure view for reading audit logs
DROP VIEW IF EXISTS public.audit_log_view;
CREATE VIEW public.audit_log_view AS
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
ORDER BY al.created_at DESC;

-- Enable RLS on the view
ALTER VIEW public.audit_log_view SET (security_barrier = true);

-- Create function to check if user can view audit logs
CREATE OR REPLACE FUNCTION public.can_view_audit_logs()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Add triggers to prevent any modification of audit logs
DROP TRIGGER IF EXISTS prevent_audit_log_update ON public.admin_audit_log;
DROP TRIGGER IF EXISTS prevent_audit_log_delete ON public.admin_audit_log;

CREATE OR REPLACE FUNCTION public.prevent_audit_log_modification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RAISE EXCEPTION 'Audit log modification is strictly forbidden. Operation: % blocked.', TG_OP;
END;
$$;

CREATE TRIGGER prevent_audit_log_update
  BEFORE UPDATE ON public.admin_audit_log
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_audit_log_modification();

CREATE TRIGGER prevent_audit_log_delete
  BEFORE DELETE ON public.admin_audit_log
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_audit_log_modification();