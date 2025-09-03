-- Script SQL pour créer la table projects dans Supabase
-- À exécuter dans l'éditeur SQL de Supabase

-- Création de la table projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  detailed_description TEXT,
  type TEXT NOT NULL CHECK (type IN ('apartment', 'villa', 'penthouse', 'maison', 'commercial')),
  price NUMERIC NOT NULL,
  location JSONB NOT NULL,
  features TEXT[] DEFAULT '{}',
  detailed_features TEXT[] DEFAULT '{}',
  photos TEXT[] DEFAULT '{}',
  plans TEXT[] DEFAULT '{}',
  virtual_tour TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activation de RLS (Row Level Security)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Politique pour lecture publique
CREATE POLICY "Allow public read access" ON projects
FOR SELECT TO public
USING (true);

-- Politique pour écriture admin-only (à adapter selon vos besoins d'authentification)
CREATE POLICY "Allow authenticated insert" ON projects
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON projects
FOR UPDATE TO authenticated
USING (true);

CREATE POLICY "Allow authenticated delete" ON projects
FOR DELETE TO authenticated
USING (true);

-- Index pour améliorer les performances de recherche
CREATE INDEX IF NOT EXISTS idx_projects_type ON projects(type);
CREATE INDEX IF NOT EXISTS idx_projects_price ON projects(price);
CREATE INDEX IF NOT EXISTS idx_projects_location_city ON projects USING GIN ((location->>'city'));

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insertion des données de test (seed data)
INSERT INTO projects (title, description, detailed_description, type, price, location, features, detailed_features, photos, plans, virtual_tour) VALUES
(
  'Mersini Beach Apartment',
  'Appartement moderne vue mer à Paphos',
  'Découvrez cet appartement exceptionnel de 80m² situé dans le prestigieux complexe Mersini Beach à Paphos. Avec sa vue imprenable sur la mer Méditerranée, cet appartement moderne de 2 chambres offre un cadre de vie idyllique. Les finitions haut de gamme, la terrasse spacieuse et l''accès direct à la plage en font un investissement de choix à Chypre.',
  'apartment',
  250000,
  '{"lat": 34.7768, "lng": 32.4245, "city": "Paphos"}',
  ARRAY['Vue mer', 'Terrasse', 'Parking', 'Piscine commune'],
  ARRAY['Surface: 80m²', '2 chambres', '1 salle de bain', 'Cuisine équipée', 'Climatisation', 'Terrasse 15m²', 'Vue mer panoramique', 'Accès plage privée'],
  ARRAY['https://images.unsplash.com/photo-1565623833408-d77e39b88af6?w=800&h=600', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600', 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&h=600'],
  ARRAY['https://placehold.co/800x600/4a90e2/ffffff?text=Plan+RDC', 'https://placehold.co/800x600/7b68ee/ffffff?text=Plan+1er+Étage'],
  'https://my.matterport.com/show/?m=mersini-beach-apt'
),
(
  'Villa Luxury Limassol',
  'Villa de luxe avec piscine privée',
  'Villa exceptionnelle de 200m² avec 4 chambres et piscine privée dans un quartier résidentiel calme de Limassol.',
  'villa',
  450000,
  '{"lat": 34.6851, "lng": 33.0432, "city": "Limassol"}',
  ARRAY['Piscine privée', 'Jardin', 'Garage', '4 chambres'],
  ARRAY['Surface: 200m²', '4 chambres', '3 salles de bain', 'Piscine 8x4m', 'Jardin 500m²', 'Garage 2 voitures'],
  ARRAY['https://images.unsplash.com/photo-1505843795480-5cfb3c03f6ff?w=800&h=600', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600'],
  ARRAY['https://placehold.co/800x600/e74c3c/ffffff?text=Plan+Villa'],
  'https://my.matterport.com/show/?m=villa-limassol'
),
(
  'Penthouse Modern Nicosia',
  'Penthouse moderne au centre-ville',
  'Penthouse de standing avec terrasse panoramique de 120m² au cœur de Nicosie.',
  'penthouse',
  380000,
  '{"lat": 35.1856, "lng": 33.3823, "city": "Nicosia"}',
  ARRAY['Terrasse panoramique', 'Centre-ville', 'Ascenseur', 'Vue 360°'],
  ARRAY['Surface: 120m²', '3 chambres', '2 salles de bain', 'Terrasse 40m²', 'Vue panoramique'],
  ARRAY['https://images.unsplash.com/photo-1522444195799-478538b28823?w=800&h=600'],
  ARRAY['https://placehold.co/800x600/f39c12/ffffff?text=Plan+Penthouse'],
  'https://my.matterport.com/show/?m=penthouse-nicosia'
),
(
  'Appartement Front de Mer',
  'Appartement neuf face à la mer',
  'Appartement de 95m² en première ligne de mer avec balcon et vue exceptionnelle.',
  'apartment',
  320000,
  '{"lat": 34.9833, "lng": 33.7333, "city": "Famagusta"}',
  ARRAY['Front de mer', 'Neuf', 'Balcon', 'Vue mer'],
  ARRAY['Surface: 95m²', '2 chambres', '2 salles de bain', 'Balcon 12m²'],
  ARRAY['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600'],
  ARRAY['https://placehold.co/800x600/27ae60/ffffff?text=Plan+Appartement'],
  'https://my.matterport.com/show/?m=apt-famagusta'
),
(
  'Maison Traditionnelle',
  'Maison chypriote rénovée',
  'Charmante maison traditionnelle entièrement rénovée avec jardin méditerranéen.',
  'maison',
  180000,
  '{"lat": 34.9167, "lng": 33.6297, "city": "Larnaca"}',
  ARRAY['Rénovée', 'Jardin', 'Caractère', 'Proche aéroport'],
  ARRAY['Surface: 150m²', '3 chambres', '2 salles de bain', 'Jardin 300m²'],
  ARRAY['https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&h=600'],
  ARRAY['https://placehold.co/800x600/8e44ad/ffffff?text=Plan+Maison'],
  'https://my.matterport.com/show/?m=maison-larnaca'
);