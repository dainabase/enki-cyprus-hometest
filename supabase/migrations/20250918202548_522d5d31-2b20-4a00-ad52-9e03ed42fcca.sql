-- Create property_drafts table for autosave functionality
CREATE TABLE IF NOT EXISTS public.property_drafts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  property_id UUID NULL,
  session_id TEXT NULL,
  form_data JSONB NOT NULL DEFAULT '{}',
  current_step TEXT NOT NULL DEFAULT 'identification',
  auto_save_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.property_drafts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own property drafts" 
ON public.property_drafts 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all property drafts" 
ON public.property_drafts 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_property_drafts_updated_at
  BEFORE UPDATE ON public.property_drafts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();