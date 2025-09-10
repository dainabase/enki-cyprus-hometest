-- Fix security vulnerability in leads table RLS policies
-- Remove public read access and ensure only authorized users can access lead data

-- First, drop the problematic policies that allow too broad access
DROP POLICY IF EXISTS "Anonymous users can create new leads" ON public.leads;
DROP POLICY IF EXISTS "Users can create their own leads" ON public.leads;

-- Create more secure policies

-- Allow anonymous users to create leads but only with minimal data
CREATE POLICY "Allow anonymous lead creation with limited data" 
ON public.leads 
FOR INSERT 
WITH CHECK (
  -- Only allow creation with basic contact info and no sensitive data
  assigned_to IS NULL 
  AND score IS NULL 
  AND status = 'new'::character varying
  AND notes IS NULL
  AND last_contact_date IS NULL
);

-- Ensure only authenticated users with proper roles can read leads
CREATE POLICY "Only authorized staff can read leads" 
ON public.leads 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'sales')
  )
  OR 
  assigned_to = auth.uid()
);

-- Ensure only authorized staff can update leads
CREATE POLICY "Only authorized staff can update leads" 
ON public.leads 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'sales')
  )
  OR 
  assigned_to = auth.uid()
);

-- Ensure only authorized staff can delete leads
CREATE POLICY "Only authorized staff can delete leads" 
ON public.leads 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Add audit logging for lead access
CREATE OR REPLACE FUNCTION public.log_lead_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log access to leads for security monitoring
  INSERT INTO public.analytics_events (
    event_name,
    user_id,
    page_url,
    event_data
  ) VALUES (
    'lead_access',
    auth.uid(),
    '/admin/leads',
    jsonb_build_object(
      'lead_id', COALESCE(NEW.id, OLD.id),
      'operation', TG_OP,
      'lead_email', COALESCE(NEW.email, OLD.email),
      'access_time', NOW()
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for audit logging
DROP TRIGGER IF EXISTS audit_lead_access_trigger ON public.leads;
CREATE TRIGGER audit_lead_access_trigger
  AFTER SELECT OR INSERT OR UPDATE OR DELETE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.log_lead_access();