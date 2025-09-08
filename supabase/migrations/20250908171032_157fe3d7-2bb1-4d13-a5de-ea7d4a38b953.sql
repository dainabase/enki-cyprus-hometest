-- Table pour stocker les documents
CREATE TABLE project_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  document_name TEXT NOT NULL,
  document_type TEXT CHECK (document_type IN ('descriptif', 'legal', 'mandat', 'autre')),
  file_url TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  extracted_data JSONB,
  confidence_scores JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les sessions d'import IA
CREATE TABLE project_ai_imports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  session_id UUID NOT NULL,
  documents JSONB[],
  raw_extraction JSONB,
  mapped_data JSONB,
  status TEXT CHECK (status IN ('uploading', 'analyzing', 'ready', 'completed', 'error')),
  error_message TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Créer bucket pour les documents de projets
INSERT INTO storage.buckets (id, name, public) VALUES ('project-documents', 'project-documents', false);

-- RLS policies pour project_documents
ALTER TABLE project_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all project documents" 
ON project_documents 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

CREATE POLICY "Public can view project documents" 
ON project_documents 
FOR SELECT 
USING (true);

-- RLS policies pour project_ai_imports
ALTER TABLE project_ai_imports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all AI imports" 
ON project_ai_imports 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

-- Storage policies pour project-documents bucket
CREATE POLICY "Admins can upload project documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'project-documents' AND EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

CREATE POLICY "Admins can view project documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'project-documents' AND EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

CREATE POLICY "Admins can delete project documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'project-documents' AND EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

-- Trigger pour updated_at
CREATE TRIGGER update_project_documents_updated_at
BEFORE UPDATE ON project_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();