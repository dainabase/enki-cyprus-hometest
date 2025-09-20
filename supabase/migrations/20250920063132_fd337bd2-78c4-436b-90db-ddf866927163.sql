-- CORRECTION FINALE DES PROBLÈMES DE SÉCURITÉ
-- =============================================

-- 1. ACTIVER RLS SUR LA TABLE BACKUP
ALTER TABLE backup_complete_20250120 ENABLE ROW LEVEL SECURITY;

-- 2. POLITIQUE RESTRICTIVE POUR LES BACKUPS (admin seulement)
CREATE POLICY "Only admins can access backup data" ON backup_complete_20250120
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- 3. CORRIGER LES 2 DERNIÈRES FONCTIONS SANS search_path
-- (Il semble qu'il y en ait encore 2 selon le linter)

-- Vérifier et corriger la fonction update_updated_at_column si elle existe déjà
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;