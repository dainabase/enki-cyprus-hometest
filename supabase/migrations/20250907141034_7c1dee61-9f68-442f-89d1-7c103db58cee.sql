-- Create storage buckets for media files
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('projects', 'projects', true),
  ('buildings', 'buildings', true),
  ('properties', 'properties', true);

-- Create storage policies for public read access
CREATE POLICY "Public read access for projects bucket" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'projects');

CREATE POLICY "Public read access for buildings bucket" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'buildings');

CREATE POLICY "Public read access for properties bucket" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'properties');

-- Create storage policies for authenticated upload
CREATE POLICY "Authenticated users can upload to projects bucket" 
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'projects');

CREATE POLICY "Authenticated users can upload to buildings bucket" 
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'buildings');

CREATE POLICY "Authenticated users can upload to properties bucket" 
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'properties');

-- Create storage policies for authenticated delete
CREATE POLICY "Authenticated users can delete from projects bucket" 
ON storage.objects FOR DELETE 
TO authenticated
USING (bucket_id = 'projects');

CREATE POLICY "Authenticated users can delete from buildings bucket" 
ON storage.objects FOR DELETE 
TO authenticated
USING (bucket_id = 'buildings');

CREATE POLICY "Authenticated users can delete from properties bucket" 
ON storage.objects FOR DELETE 
TO authenticated
USING (bucket_id = 'properties');

-- Table project_images
CREATE TABLE public.project_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for project_images
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;

-- RLS policies for project_images
CREATE POLICY "Public can view project images" 
ON public.project_images FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage project images" 
ON public.project_images FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'
));

-- Table building_images
CREATE TABLE public.building_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  building_id UUID REFERENCES public.buildings(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for building_images
ALTER TABLE public.building_images ENABLE ROW LEVEL SECURITY;

-- RLS policies for building_images
CREATE POLICY "Public can view building images" 
ON public.building_images FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage building images" 
ON public.building_images FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'
));

-- Create indexes for better performance
CREATE INDEX idx_project_images_project_id ON public.project_images(project_id);
CREATE INDEX idx_project_images_display_order ON public.project_images(display_order);
CREATE INDEX idx_building_images_building_id ON public.building_images(building_id);
CREATE INDEX idx_building_images_display_order ON public.building_images(display_order);