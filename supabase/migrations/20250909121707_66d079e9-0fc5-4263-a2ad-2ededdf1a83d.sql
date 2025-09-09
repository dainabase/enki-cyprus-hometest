-- Create developer_drafts table for temporary developer form data
CREATE TABLE public.developer_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  developer_id UUID NULL,
  form_data JSONB NOT NULL DEFAULT '{}',
  current_step TEXT NOT NULL DEFAULT 'basics',
  step_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_id TEXT NULL,
  auto_save_enabled BOOLEAN NOT NULL DEFAULT true
);

-- Indexes for performance
CREATE INDEX idx_developer_drafts_user_id ON public.developer_drafts(user_id);
CREATE INDEX idx_developer_drafts_developer_id ON public.developer_drafts(developer_id) WHERE developer_id IS NOT NULL;
CREATE INDEX idx_developer_drafts_updated_at ON public.developer_drafts(updated_at);

-- Unique constraints to support safe upserts
CREATE UNIQUE INDEX uniq_dev_drafts_user_dev 
  ON public.developer_drafts(user_id, developer_id) 
  WHERE developer_id IS NOT NULL;

CREATE UNIQUE INDEX uniq_dev_drafts_user_session 
  ON public.developer_drafts(user_id, session_id) 
  WHERE developer_id IS NULL AND session_id IS NOT NULL;

-- Enable Row Level Security
ALTER TABLE public.developer_drafts ENABLE ROW LEVEL SECURITY;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_developer_drafts_updated_at
  BEFORE UPDATE ON public.developer_drafts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();