-- Create multiple draft tables for all forms

-- 1. Building Form Drafts
CREATE TABLE public.building_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  building_id UUID NULL,
  form_data JSONB NOT NULL DEFAULT '{}',
  current_step TEXT NOT NULL DEFAULT 'basics',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_id TEXT NULL,
  auto_save_enabled BOOLEAN NOT NULL DEFAULT true
);

-- 2. Contact Form Drafts (for logged in users)
CREATE TABLE public.contact_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NULL, -- Nullable for anonymous users
  form_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_id TEXT NOT NULL, -- Required for anonymous users
  auto_save_enabled BOOLEAN NOT NULL DEFAULT true
);

-- 3. Registration Form Drafts (for non-complete registrations)
CREATE TABLE public.registration_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_id TEXT NOT NULL,
  auto_save_enabled BOOLEAN NOT NULL DEFAULT true,
  email_attempted TEXT NULL -- To link back to partial registrations
);

-- 4. Lexaia Calculator Drafts
CREATE TABLE public.lexaia_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NULL,
  form_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_id TEXT NOT NULL,
  auto_save_enabled BOOLEAN NOT NULL DEFAULT true
);

-- 5. Search Form Drafts
CREATE TABLE public.search_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NULL,
  form_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_id TEXT NOT NULL,
  auto_save_enabled BOOLEAN NOT NULL DEFAULT true
);

-- Indexes for performance
CREATE INDEX idx_building_drafts_user_id ON public.building_drafts(user_id);
CREATE INDEX idx_building_drafts_building_id ON public.building_drafts(building_id) WHERE building_id IS NOT NULL;
CREATE INDEX idx_contact_drafts_session_id ON public.contact_drafts(session_id);
CREATE INDEX idx_contact_drafts_user_id ON public.contact_drafts(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_registration_drafts_session_id ON public.registration_drafts(session_id);
CREATE INDEX idx_registration_drafts_email ON public.registration_drafts(email_attempted) WHERE email_attempted IS NOT NULL;
CREATE INDEX idx_lexaia_drafts_session_id ON public.lexaia_drafts(session_id);
CREATE INDEX idx_search_drafts_session_id ON public.search_drafts(session_id);

-- Enable RLS
ALTER TABLE public.building_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lexaia_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_drafts ENABLE ROW LEVEL SECURITY;

-- Auto-update triggers
CREATE TRIGGER update_building_drafts_updated_at
  BEFORE UPDATE ON public.building_drafts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contact_drafts_updated_at
  BEFORE UPDATE ON public.contact_drafts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_registration_drafts_updated_at
  BEFORE UPDATE ON public.registration_drafts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lexaia_drafts_updated_at
  BEFORE UPDATE ON public.lexaia_drafts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_search_drafts_updated_at
  BEFORE UPDATE ON public.search_drafts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();