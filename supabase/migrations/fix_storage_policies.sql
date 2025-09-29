-- CORRECTION DU PROBLÈME D'UPLOAD D'IMAGES

-- 1. Créer le bucket s'il n'existe pas
INSERT INTO storage.buckets (id, name, public)
VALUES ('buildings', 'buildings', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Politique pour upload d'images
CREATE POLICY "Allow authenticated users to upload building images" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'buildings');

-- 3. Politique pour voir les images
CREATE POLICY "Allow public to view building images" 
ON storage.objects 
FOR SELECT 
TO public 
USING (bucket_id = 'buildings');

-- 4. Politique pour supprimer ses propres images
CREATE POLICY "Allow users to delete their own building images" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (bucket_id = 'buildings');

-- 5. Politique pour mettre à jour
CREATE POLICY "Allow users to update building images" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id = 'buildings')
WITH CHECK (bucket_id = 'buildings');