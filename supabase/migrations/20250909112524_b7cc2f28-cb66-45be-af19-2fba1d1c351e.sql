-- Créer une table pour les brouillons de projets
CREATE TABLE public.project_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID NULL, -- Pour les modifications de projets existants
  form_data JSONB NOT NULL DEFAULT '{}',
  current_step TEXT NOT NULL DEFAULT 'basics',
  step_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_id TEXT NULL, -- Pour identifier les sessions
  auto_save_enabled BOOLEAN NOT NULL DEFAULT true
);

-- Index pour performance
CREATE INDEX idx_project_drafts_user_id ON public.project_drafts(user_id);
CREATE INDEX idx_project_drafts_project_id ON public.project_drafts(project_id) WHERE project_id IS NOT NULL;
CREATE INDEX idx_project_drafts_updated_at ON public.project_drafts(updated_at);

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_project_drafts_updated_at
  BEFORE UPDATE ON public.project_drafts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS policies
ALTER TABLE public.project_drafts ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent gérer leurs propres brouillons
CREATE POLICY "Users can manage their own drafts" ON public.project_drafts
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Les admins peuvent voir tous les brouillons
CREATE POLICY "Admins can view all drafts" ON public.project_drafts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Fonction pour nettoyer les anciens brouillons (plus de 30 jours)
CREATE OR REPLACE FUNCTION public.cleanup_old_drafts()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.project_drafts 
  WHERE updated_at < (now() - INTERVAL '30 days');
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- Commentaires pour documentation
COMMENT ON TABLE public.project_drafts IS 'Stockage temporaire des brouillons de projets pour sauvegarde automatique';
COMMENT ON COLUMN public.project_drafts.form_data IS 'Données du formulaire en JSON';
COMMENT ON COLUMN public.project_drafts.current_step IS 'Étape courante du formulaire';
COMMENT ON COLUMN public.project_drafts.session_id IS 'ID de session pour identifier les sessions utilisateur';
COMMENT ON FUNCTION public.cleanup_old_drafts() IS 'Supprime les brouillons de plus de 30 jours';