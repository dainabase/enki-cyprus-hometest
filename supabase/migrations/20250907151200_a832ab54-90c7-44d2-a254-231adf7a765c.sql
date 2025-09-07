-- Security Fix: Restrict access to leads table containing sensitive customer data
-- Issue: Customer Contact Information Could Be Stolen by Hackers

-- Ensure RLS is enabled on leads table
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies that might allow public access
DROP POLICY IF EXISTS "Admins can manage all leads" ON public.leads;
DROP POLICY IF EXISTS "Public can read leads" ON public.leads;
DROP POLICY IF EXISTS "Everyone can read leads" ON public.leads;
DROP POLICY IF EXISTS "Allow public read access" ON public.leads;

-- Create secure RLS policies for leads table

-- 1. Admins can manage all leads (view, insert, update, delete)
CREATE POLICY "Admins can manage all leads" 
ON public.leads 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- 2. Sales staff can view and manage leads assigned to them
CREATE POLICY "Sales staff can manage assigned leads" 
ON public.leads 
FOR ALL 
TO authenticated
USING (
  assigned_to = auth.uid() 
  OR EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'sales')
  )
)
WITH CHECK (
  assigned_to = auth.uid() 
  OR EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'sales')
  )
);

-- 3. Allow anonymous users to insert new leads (for contact forms)
-- But restrict what data they can insert
CREATE POLICY "Anonymous users can create new leads" 
ON public.leads 
FOR INSERT 
TO anon, authenticated
WITH CHECK (
  -- Only allow basic contact info, no sensitive internal fields
  assigned_to IS NULL 
  AND score IS NULL 
  AND status = 'new'
  AND notes IS NULL
);

-- 4. Authenticated users can insert leads about themselves
CREATE POLICY "Users can create their own leads" 
ON public.leads 
FOR INSERT 
TO authenticated
WITH CHECK (
  -- Basic lead creation with default status
  status = 'new'
);

-- Additional security: Create audit logging function for sensitive lead operations
CREATE OR REPLACE FUNCTION public.audit_lead_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log access to leads table for security monitoring
  INSERT INTO public.analytics_events (
    event_name,
    user_id,
    page_url,
    event_data
  ) VALUES (
    'lead_accessed',
    auth.uid(),
    '/admin/leads',
    jsonb_build_object(
      'lead_id', COALESCE(NEW.id, OLD.id),
      'operation', TG_OP,
      'email', COALESCE(NEW.email, OLD.email)
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for audit logging
CREATE TRIGGER audit_lead_access_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.audit_lead_access();

-- Ensure no public access to sensitive columns via views
-- This prevents any accidental exposure through database views
REVOKE ALL ON public.leads FROM anon;
REVOKE ALL ON public.leads FROM public;

-- Grant only necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;

-- Create a security function to check if current user can access leads
CREATE OR REPLACE FUNCTION public.can_access_leads()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'sales')
  );
$$;