-- Create analytics events table for admin dashboards
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name TEXT NOT NULL,
  event_data JSONB NOT NULL DEFAULT '{}',
  user_id UUID,
  session_id TEXT,
  page_url TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create A/B tests table for test configurations
CREATE TABLE public.ab_tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  test_name TEXT NOT NULL UNIQUE,
  variant_a TEXT NOT NULL DEFAULT 'A',
  variant_b TEXT NOT NULL DEFAULT 'B',
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create A/B test assignments table
CREATE TABLE public.ab_test_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id UUID NOT NULL REFERENCES public.ab_tests(id) ON DELETE CASCADE,
  user_session TEXT NOT NULL,
  variant TEXT NOT NULL,
  user_id UUID,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(test_id, user_session)
);

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_test_assignments ENABLE ROW LEVEL SECURITY;

-- Analytics events policies
CREATE POLICY "Anyone can insert analytics events" 
ON public.analytics_events 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all analytics events" 
ON public.analytics_events 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

-- A/B tests policies  
CREATE POLICY "Everyone can read active A/B tests" 
ON public.ab_tests 
FOR SELECT 
USING (active = true);

CREATE POLICY "Admins can manage A/B tests" 
ON public.ab_tests 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

-- A/B test assignments policies
CREATE POLICY "Users can read their own assignments" 
ON public.ab_test_assignments 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert assignments" 
ON public.ab_test_assignments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all assignments" 
ON public.ab_test_assignments 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

-- Insert default A/B test for Hero CTA
INSERT INTO public.ab_tests (test_name, variant_a, variant_b, description, active)
VALUES (
  'hero_cta_button',
  'Découvrez Projets',
  'Trouvez Votre Bien',
  'Test CTA button text on hero section',
  true
);

-- Add trigger for updating timestamps
CREATE TRIGGER update_ab_tests_updated_at
BEFORE UPDATE ON public.ab_tests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();