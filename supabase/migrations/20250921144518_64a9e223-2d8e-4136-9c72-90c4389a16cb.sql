-- Tables pour stocker le code source de l'admin
CREATE TABLE IF NOT EXISTS admin_codebase (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_path TEXT NOT NULL UNIQUE,
  file_name TEXT NOT NULL,
  file_extension TEXT,
  file_content TEXT NOT NULL,
  file_size INTEGER,
  component_type TEXT CHECK (component_type IN ('page', 'component', 'layout', 'hook', 'util', 'style', 'config', 'type', 'service', 'other')),
  folder_structure TEXT,
  dependencies JSONB DEFAULT '[]'::jsonb,
  imports TEXT[],
  exports TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_admin_codebase_path ON admin_codebase(file_path);
CREATE INDEX idx_admin_codebase_type ON admin_codebase(component_type);

-- Table pour les métadonnées du codebase
CREATE TABLE IF NOT EXISTS admin_metadata (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  total_files INTEGER,
  total_components INTEGER,
  total_pages INTEGER,
  total_size_kb INTEGER,
  main_dependencies JSONB,
  ui_library TEXT,
  state_management TEXT,
  routing_library TEXT,
  styling_approach TEXT,
  typescript_enabled BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS policies pour sécuriser l'accès
ALTER TABLE admin_codebase ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage codebase" ON admin_codebase
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can manage metadata" ON admin_metadata
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);