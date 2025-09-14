-- Rendre le bucket project-documents public pour permettre l'accès aux PDFs depuis les edge functions
UPDATE storage.buckets 
SET public = true 
WHERE id = 'project-documents';