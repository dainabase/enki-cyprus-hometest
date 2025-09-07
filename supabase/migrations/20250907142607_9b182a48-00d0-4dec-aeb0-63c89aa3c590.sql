-- Table commission_payments (si elle n'existe pas déjà)
CREATE TABLE IF NOT EXISTS public.commission_payments (
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

-- Enable RLS for commission_payments if not already enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'commission_payments' AND schemaname = 'public'
  ) THEN
    ALTER TABLE public.commission_payments ENABLE ROW LEVEL SECURITY;
    
    -- RLS policies for commission_payments
    CREATE POLICY "Admins can manage all commission payments" 
    ON public.commission_payments FOR ALL 
    USING (EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    ));
  END IF;
END $$;

-- Create or replace the commission calculation trigger
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

-- Drop existing trigger if it exists and recreate
DROP TRIGGER IF EXISTS trigger_calculate_commission ON public.projects;
CREATE TRIGGER trigger_calculate_commission
AFTER UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.calculate_commission();

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_commission_payments_commission_id ON public.commission_payments(commission_id);