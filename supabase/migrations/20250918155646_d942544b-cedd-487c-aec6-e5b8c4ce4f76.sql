-- Activer RLS sur properties_test
ALTER TABLE properties_test ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS pour properties_test
CREATE POLICY "Allow all operations for authenticated users" ON properties_test
    FOR ALL 
    USING (true) 
    WITH CHECK (true);

-- Pour s'assurer que les admins peuvent tout voir
CREATE POLICY "Admins can manage all properties_test" ON properties_test
    FOR ALL 
    USING (EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    ));