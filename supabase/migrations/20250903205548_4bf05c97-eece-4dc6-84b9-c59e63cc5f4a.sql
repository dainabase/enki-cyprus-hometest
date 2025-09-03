-- Fix infinite recursion in profiles RLS policy
-- Create security definer function to get current user role safely

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Fix all remaining functions with search_path
CREATE OR REPLACE FUNCTION public.trigger_notification_on_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Only trigger on inserts (new users)
  IF TG_OP = 'INSERT' THEN
    PERFORM net.http_post(
      url := 'https://ccsakftsslurjgnjwdci.supabase.co/functions/v1/db-trigger',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := json_build_object(
        'table', 'profiles',
        'record', row_to_json(NEW),
        'event_type', TG_OP
      )::text
    );
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.trigger_notification_on_checklist()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Only trigger on updates, not inserts
  IF TG_OP = 'UPDATE' THEN
    PERFORM net.http_post(
      url := 'https://ccsakftsslurjgnjwdci.supabase.co/functions/v1/db-trigger',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := json_build_object(
        'table', 'checklists',
        'record', row_to_json(NEW),
        'old_record', row_to_json(OLD),
        'event_type', TG_OP
      )::text
    );
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.trigger_notification_on_commission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Call the edge function to send notification
  PERFORM net.http_post(
    url := 'https://ccsakftsslurjgnjwdci.supabase.co/functions/v1/db-trigger',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := json_build_object(
      'table', 'commissions',
      'record', row_to_json(NEW),
      'old_record', row_to_json(OLD),
      'event_type', TG_OP
    )::text
  );
  RETURN NEW;
END;
$function$;

-- Fix RLS policies using security definer function
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.get_current_user_role() = 'admin');