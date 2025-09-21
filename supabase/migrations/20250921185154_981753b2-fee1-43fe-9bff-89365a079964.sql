-- Table pour stocker la configuration des agents IA
CREATE TABLE ai_agents_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_name TEXT NOT NULL UNIQUE,
  agent_type TEXT NOT NULL, -- 'seo', 'marketing', 'valuation', 'customer_service'
  provider TEXT NOT NULL, -- 'openai', 'anthropic', 'google', 'custom'
  api_key_encrypted TEXT, -- Clé API encryptée
  model_name TEXT DEFAULT 'gpt-4-turbo-preview',
  temperature DECIMAL DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 1000,
  system_prompt TEXT,
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  settings JSONB DEFAULT '{}', -- Paramètres spécifiques par agent
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table pour logger l'utilisation des agents
CREATE TABLE ai_agents_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES ai_agents_config(id),
  entity_type TEXT, -- 'project', 'property', 'lead'
  entity_id UUID,
  input_data JSONB,
  output_data JSONB,
  tokens_used INTEGER,
  cost_estimate DECIMAL,
  duration_ms INTEGER,
  status TEXT, -- 'success', 'error', 'timeout'
  error_message TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE ai_agents_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agents_logs ENABLE ROW LEVEL SECURITY;

-- Policies pour les admins uniquement
CREATE POLICY "Admins can manage AI agents config" ON ai_agents_config
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can view AI agents logs" ON ai_agents_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_ai_agents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ai_agents_config_updated_at
  BEFORE UPDATE ON ai_agents_config
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_agents_updated_at();

-- Insérer la configuration par défaut du SEO Agent
INSERT INTO ai_agents_config (
  agent_name,
  agent_type,
  provider,
  model_name,
  system_prompt,
  is_active
) VALUES (
  'seo-generator',
  'seo',
  'openai',
  'gpt-4-turbo-preview',
  'You are a real estate SEO expert specializing in Cyprus properties. Generate compelling, keyword-rich content that appeals to international investors. Focus on Golden Visa eligibility when applicable (≥€300,000). Highlight location benefits, ROI potential, and lifestyle aspects. Use power words and create urgency while remaining factual.',
  false
);