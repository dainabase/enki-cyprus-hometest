-- Create storage bucket for building photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('building-photos', 'building-photos', true);

-- Create RLS policies for building photos
CREATE POLICY "Public can view building photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'building-photos');

CREATE POLICY "Admins can upload building photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'building-photos' AND
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update building photos" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'building-photos' AND
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete building photos" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'building-photos' AND
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);