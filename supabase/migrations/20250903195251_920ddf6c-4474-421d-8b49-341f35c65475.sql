-- Create promoters table
CREATE TABLE public.promoters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact JSONB NOT NULL DEFAULT '{}',
  projects UUID[] NOT NULL DEFAULT '{}',
  commission_rate DECIMAL(3,2) NOT NULL DEFAULT 0.05,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create commissions table
CREATE TABLE public.commissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  promoter_id UUID NOT NULL,
  user_id UUID,
  project_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.promoters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;

-- Create policies for promoters (admin only)
CREATE POLICY "Admins can manage all promoters" 
ON public.promoters 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

-- Create policies for commissions (admin only)
CREATE POLICY "Admins can manage all commissions" 
ON public.commissions 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

-- Create triggers for updated_at
CREATE TRIGGER update_promoters_updated_at
BEFORE UPDATE ON public.promoters
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_commissions_updated_at
BEFORE UPDATE ON public.commissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert mock promoters data
INSERT INTO public.promoters (name, contact, projects, commission_rate) VALUES
('Agence Premium Chypre', '{"email": "contact@premium.cy", "phone": "+357 25 123456", "website": "premium.cy"}', '{}', 0.05),
('Mediterranean Properties', '{"email": "info@medprop.com", "phone": "+357 24 789012", "address": "Limassol Marina"}', '{}', 0.04),
('Cyprus Elite Real Estate', '{"email": "sales@cypruse.com", "phone": "+357 26 345678"}', '{}', 0.06),
('Golden Coast Realty', '{"email": "hello@goldencoast.cy", "phone": "+357 23 456789"}', '{}', 0.05),
('Sunshine Properties Ltd', '{"email": "contact@sunshine.cy", "phone": "+357 25 567890"}', '{}', 0.045);

-- Insert mock commissions data
INSERT INTO public.commissions (promoter_id, project_id, amount, status, date) 
SELECT 
  p.id,
  (SELECT id FROM projects ORDER BY RANDOM() LIMIT 1),
  (RANDOM() * 50000 + 5000)::NUMERIC(10,2),
  CASE WHEN RANDOM() > 0.7 THEN 'paid' ELSE 'pending' END,
  NOW() - (RANDOM() * INTERVAL '90 days')
FROM promoters p
CROSS JOIN generate_series(1, 3) s;