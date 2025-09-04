-- Fix RLS policies for analytics_events to allow authenticated users
DROP POLICY IF EXISTS "Only authenticated users can insert analytics events" ON analytics_events;
DROP POLICY IF EXISTS "Admins can view all analytics events" ON analytics_events;

CREATE POLICY "Authenticated users can insert analytics events" 
ON analytics_events 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can view their own analytics events" 
ON analytics_events 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Admins can view all analytics events" 
ON analytics_events 
FOR SELECT 
TO authenticated
USING (get_current_user_role() = 'admin');

-- Fix analytics_rate_limits constraints
ALTER TABLE analytics_rate_limits 
ADD CONSTRAINT unique_user_session_window 
UNIQUE (user_id, session_id, window_start);

-- Fix ab_test_assignments duplicates with better conflict handling
CREATE OR REPLACE FUNCTION upsert_ab_test_assignment(
  p_test_id uuid,
  p_user_session text,
  p_variant text
) RETURNS void AS $$
BEGIN
  INSERT INTO ab_test_assignments (test_id, user_session, variant)
  VALUES (p_test_id, p_user_session, p_variant)
  ON CONFLICT (test_id, user_session) 
  DO UPDATE SET variant = EXCLUDED.variant;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create dossiers table for saved searches
CREATE TABLE public.dossiers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  title text NOT NULL DEFAULT 'Mon dossier immobilier',
  query text NOT NULL,
  biens uuid[] NOT NULL DEFAULT '{}',
  lexaia_outputs jsonb NOT NULL DEFAULT '{}',
  pdf_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on dossiers
ALTER TABLE public.dossiers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for dossiers
CREATE POLICY "Users can manage their own dossiers" 
ON public.dossiers 
FOR ALL 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create trigger for updated_at on dossiers
CREATE TRIGGER update_dossiers_updated_at
BEFORE UPDATE ON public.dossiers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();