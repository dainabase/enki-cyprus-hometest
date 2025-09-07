-- Table commissions
CREATE TABLE public.commissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  developer_id UUID REFERENCES public.developers(id),
  sale_price DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(4,2) NOT NULL, -- Pourcentage (ex: 3.50 pour 3.5%)
  commission_amount DECIMAL(10,2) NOT NULL, -- Montant calculé
  vat_amount DECIMAL(10,2), -- TVA sur commission si applicable
  status VARCHAR(20) DEFAULT 'pending', -- pending, paid, cancelled
  sale_date DATE NOT NULL,
  due_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table commission_payments
CREATE TABLE public.commission_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  commission_id UUID REFERENCES public.commissions(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method VARCHAR(50), -- bank_transfer, check, other
  reference VARCHAR(100),
  notes TEXT,
  created_by UUID, -- Pour audit trail
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for commissions
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for commissions
CREATE POLICY "Admins can manage all commissions" 
ON public.commissions FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'
));

-- Enable RLS for commission_payments
ALTER TABLE public.commission_payments ENABLE ROW LEVEL SECURITY;

-- RLS policies for commission_payments
CREATE POLICY "Admins can manage all commission payments" 
ON public.commission_payments FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'
));

-- Trigger pour calculer automatiquement les commissions
CREATE OR REPLACE FUNCTION public.calculate_commission()
RETURNS TRIGGER AS $$
BEGIN
  -- Vérifier si le statut change vers "sold" (pour les projets)
  IF NEW.status = 'sold' AND (OLD.status IS NULL OR OLD.status != 'sold') THEN
    INSERT INTO public.commissions (
      property_id,
      developer_id,
      sale_price,
      commission_rate,
      commission_amount,
      sale_date,
      due_date
    )
    SELECT 
      NEW.id,
      NEW.developer_id,
      NEW.price,
      COALESCE(d.commission_rate, 3.00), -- Default 3% si pas défini
      NEW.price * (COALESCE(d.commission_rate, 3.00) / 100),
      CURRENT_DATE,
      CURRENT_DATE + INTERVAL '30 days'
    FROM public.developers d
    WHERE d.id = NEW.developer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_commission
AFTER UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.calculate_commission();

-- Create indexes for better performance
CREATE INDEX idx_commissions_property_id ON public.commissions(property_id);
CREATE INDEX idx_commissions_developer_id ON public.commissions(developer_id);
CREATE INDEX idx_commissions_status ON public.commissions(status);
CREATE INDEX idx_commissions_sale_date ON public.commissions(sale_date);
CREATE INDEX idx_commission_payments_commission_id ON public.commission_payments(commission_id);

-- Add updated_at trigger for commissions
CREATE TRIGGER update_commissions_updated_at
BEFORE UPDATE ON public.commissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();