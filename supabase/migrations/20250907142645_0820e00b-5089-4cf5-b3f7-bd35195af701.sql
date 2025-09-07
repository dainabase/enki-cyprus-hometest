-- Fix the function search path security issue
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;