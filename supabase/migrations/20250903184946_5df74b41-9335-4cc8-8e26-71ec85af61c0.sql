-- Create the projects table with all required fields
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  detailed_description TEXT,
  type TEXT NOT NULL CHECK (type IN ('apartment', 'villa', 'penthouse', 'commercial', 'maison')),
  price NUMERIC NOT NULL,
  location JSONB NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  detailed_features TEXT[] DEFAULT '{}',
  photos TEXT[] NOT NULL DEFAULT '{}',
  plans TEXT[] DEFAULT '{}',
  virtual_tour TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access" 
ON public.projects 
FOR SELECT 
USING (true);

-- Create policies for authenticated users (admin-only write)
CREATE POLICY "Allow authenticated insert" 
ON public.projects 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated update" 
ON public.projects 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated delete" 
ON public.projects 
FOR DELETE 
TO authenticated
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_projects_type ON public.projects(type);
CREATE INDEX idx_projects_price ON public.projects(price);
CREATE INDEX idx_projects_location_city ON public.projects USING GIN((location->>'city'));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert seed data with properties from mockData
INSERT INTO public.projects (id, title, description, detailed_description, type, price, location, features, detailed_features, photos, plans, virtual_tour) VALUES 
(gen_random_uuid(), 'Villa Méditerranéenne de Luxe', 'Magnifique villa avec vue panoramique sur la mer Méditerranée, située dans le quartier prestigieux de Limassol.', 'Cette villa d''exception de 320m² incarne l''art de vivre méditerranéen dans toute sa splendeur. Située dans le prestigieux quartier de Limassol Marina, elle offre une vue panoramique imprenable sur la mer Méditerranée.', 'villa', 1850000, '{"lat": 34.7071, "lng": 33.0226, "city": "Limassol Marina"}', '{"Vue mer", "Piscine privée", "Jardin paysager", "Garage double", "Climatisation"}', '{"Surface habitable de 320 m²", "4 chambres avec suites parentales", "3 salles de bains en marbre de Carrare", "Salon cathédrale avec baies vitrées", "Cuisine équipée Bulthaup", "Piscine infinity 12x6m"}', '{"https://placehold.co/1200x800/4A90E2/ffffff?text=Villa+Exterieur", "https://placehold.co/1200x800/2ECC71/ffffff?text=Salon+Panoramique", "https://placehold.co/1200x800/E74C3C/ffffff?text=Cuisine+Moderne"}', '{"https://placehold.co/800x600/34495E/ffffff?text=Plan+RDC+Villa+320m2", "https://placehold.co/800x600/2C3E50/ffffff?text=Plan+Etage+Villa+Chambres"}', 'https://my.matterport.com/show/?m=villa-limassol-luxury'),

(gen_random_uuid(), 'Penthouse Moderne Centre-Ville', 'Appartement de standing avec terrasse panoramique au cœur de Nicosie, finitions haut de gamme.', 'Penthouse d''exception au dernier étage d''une résidence moderne au cœur de Nicosie. Cet appartement de 180m² offre une vue panoramique à 360° sur la capitale chypriote.', 'penthouse', 750000, '{"lat": 35.1856, "lng": 33.3823, "city": "Nicosie"}', '{"Terrasse 60m²", "Vue panoramique", "Cuisine équipée", "Parking inclus"}', '{"Surface habitable de 180 m²", "3 chambres dont 1 suite parentale", "2 salles de bains avec douche italienne", "Salon/séjour open space 50m²", "Cuisine américaine équipée Siematic", "Terrasse panoramique 60m²"}', '{"https://placehold.co/1200x800/4A90E2/ffffff?text=Penthouse+Facade", "https://placehold.co/1200x800/2ECC71/ffffff?text=Salon+Open+Space", "https://placehold.co/1200x800/E74C3C/ffffff?text=Terrasse+Panoramique"}', '{"https://placehold.co/800x600/8E44AD/ffffff?text=Plan+Penthouse+180m2+Vue+360", "https://placehold.co/800x600/9B59B6/ffffff?text=Plan+Terrasse+60m2+Panoramique"}', 'https://my.matterport.com/show/?m=penthouse-nicosie-modern'),

(gen_random_uuid(), 'Appartement Vue Mer Paphos', 'Résidence moderne avec accès direct à la plage, dans un complexe sécurisé avec services.', 'Appartement moderne de 95m² situé dans la prestigieuse résidence de Coral Bay. Cet appartement bénéficie d''un accès direct à l''une des plus belles plages de Paphos.', 'apartment', 425000, '{"lat": 34.7720, "lng": 32.3588, "city": "Paphos"}', '{"Accès plage", "Piscine commune", "Sécurité 24h", "Balcon vue mer"}', '{"Surface habitable de 95 m²", "2 chambres avec placards intégrés", "2 salles de bains modernes", "Salon avec accès balcon mer", "Cuisine équipée et aménagée", "Balcon vue mer 15m²"}', '{"https://placehold.co/1200x800/4A90E2/ffffff?text=Residence+Coral+Bay", "https://placehold.co/1200x800/2ECC71/ffffff?text=Salon+Vue+Mer", "https://placehold.co/1200x800/E74C3C/ffffff?text=Balcon+Panoramique"}', '{"https://placehold.co/800x600/E74C3C/ffffff?text=Plan+Appartement+95m2+Vue+Mer", "https://placehold.co/800x600/C0392B/ffffff?text=Plan+Balcon+15m2+Coral+Bay"}', 'https://my.matterport.com/show/?m=coral-bay-apartment'),

('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Mersini Beach Apartment', 'Appartement moderne avec vue mer à quelques pas de la plage de Mersini, dans le quartier recherché de Paphos.', 'Appartement moderne de 80m² situé à Mersini Beach, l''un des quartiers les plus prisés de Paphos. À seulement 50 mètres de la magnifique plage de Mersini.', 'apartment', 250000, '{"lat": 34.7768, "lng": 32.4245, "city": "Paphos"}', '{"Vue mer", "Proche plage", "Balcon", "Parking", "Cuisine équipée"}', '{"Surface habitable de 80 m²", "2 chambres lumineuses", "1 salle de bain avec douche", "Salon/séjour avec accès balcon", "Cuisine équipée et fonctionnelle", "Balcon vue mer partielle 8m²"}', '{"https://placehold.co/1200x800/4A90E2/ffffff?text=Mersini+Beach+Apt", "https://placehold.co/1200x800/2ECC71/ffffff?text=Salon+Lumineux", "https://placehold.co/1200x800/E74C3C/ffffff?text=Balcon+Vue+Mer"}', '{"https://placehold.co/800x600/16A085/ffffff?text=Plan+Mersini+Beach+80m2+2Ch", "https://placehold.co/800x600/1ABC9C/ffffff?text=Plan+Balcon+Vue+Mer+8m2"}', 'https://my.matterport.com/show/?m=mersini-beach-apartment-9'),

(gen_random_uuid(), 'Villa de Prestige Ayia Napa', 'Villa exceptionnelle avec architecture contemporaine, équipements de luxe et jardins méditerranéens.', 'Villa d''exception de 450m² perchée sur les hauteurs d''Ayia Napa, offrant une vue panoramique sur la Méditerranée.', 'villa', 2200000, '{"lat": 34.9823, "lng": 34.0196, "city": "Ayia Napa"}', '{"Design contemporain", "Spa privé", "Cave à vin", "Domotique", "Héliport"}', '{"Surface habitable de 450 m²", "5 suites avec salles de bains privatives", "4 salles de bains en marbre italien", "Grand salon cathédrale 80m²", "Cuisine professionnelle Gaggenau", "Spa privé avec hammam et sauna"}', '{"https://placehold.co/1200x800/4A90E2/ffffff?text=Villa+Prestige+Facade", "https://placehold.co/1200x800/2ECC71/ffffff?text=Salon+Cathedrale", "https://placehold.co/1200x800/E74C3C/ffffff?text=Spa+Prive+Luxe"}', '{"https://placehold.co/800x600/D35400/ffffff?text=Plan+Villa+Prestige+450m2+5Ch", "https://placehold.co/800x600/E67E22/ffffff?text=Plan+Spa+Cave+Vin+Heliport"}', 'https://my.matterport.com/show/?m=villa-ayia-napa-prestige'),

(gen_random_uuid(), 'Local Commercial Premium', 'Espace commercial stratégiquement situé dans la zone touristique de Larnaca, idéal pour investissement.', 'Local commercial premium de 250m² idéalement situé dans la zone touristique de Larnaca.', 'commercial', 890000, '{"lat": 34.9229, "lng": 33.6276, "city": "Larnaca"}', '{"Emplacement premium", "Forte affluence", "Parking clients", "Climatisation"}', '{"Surface commerciale de 250 m²", "Rez-de-chaussée avec vitrine 15m", "Hauteur sous plafond 4m", "Espace stockage 50m²", "Cuisine professionnelle équipée", "Terrasse extérieure 40m²"}', '{"https://placehold.co/1200x800/4A90E2/ffffff?text=Local+Commercial+250m2", "https://placehold.co/1200x800/2ECC71/ffffff?text=Vitrine+15m+Premium", "https://placehold.co/1200x800/E74C3C/ffffff?text=Espace+Principal+RDC"}', '{"https://placehold.co/800x600/E74C3C/ffffff?text=Plan+Commercial+250m2+RDC", "https://placehold.co/800x600/C0392B/ffffff?text=Plan+Terrasse+Parking+20pl"}', 'https://my.matterport.com/show/?m=commercial-larnaca-premium'),

(gen_random_uuid(), 'Appartement Moderne Protaras', 'Résidence contemporaine avec vue sur la baie de Fig Tree, à quelques pas des plages dorées.', 'Appartement moderne de 85m² dans une résidence contemporaine face à la célèbre baie de Fig Tree.', 'apartment', 385000, '{"lat": 35.0123, "lng": 34.0591, "city": "Protaras"}', '{"Vue baie", "Balcon spacieux", "Proche plages", "Parking"}', '{"Surface habitable de 85 m²", "2 chambres avec rangements", "1 salle de bain avec baignoire", "Salon lumineux accès balcon", "Cuisine aménagée moderne", "Balcon spacieux vue baie 12m²"}', '{"https://placehold.co/1200x800/4A90E2/ffffff?text=Apt+Fig+Tree+Bay", "https://placehold.co/1200x800/2ECC71/ffffff?text=Vue+Baie+Exceptionnelle", "https://placehold.co/1200x800/E74C3C/ffffff?text=Balcon+Vue+Mer+12m2"}', '{"https://placehold.co/800x600/3498DB/ffffff?text=Plan+Appartement+85m2+Vue+Baie", "https://placehold.co/800x600/2980B9/ffffff?text=Plan+Balcon+12m2+Fig+Tree"}', 'https://my.matterport.com/show/?m=fig-tree-bay-apartment'),

(gen_random_uuid(), 'Villa Familiale Limassol', 'Villa spacieuse dans quartier résidentiel calme, parfaite pour familles avec enfants.', 'Villa familiale de 280m² située dans le quartier résidentiel prisé d''Agios Athanasios à Limassol.', 'villa', 1200000, '{"lat": 34.7142, "lng": 33.0039, "city": "Limassol"}', '{"Jardin privé", "Piscine", "Garage", "Quartier familial"}', '{"Surface habitable de 280 m²", "4 chambres dont 1 suite parentale", "3 salles de bains familiales", "Salon/séjour familial 45m²", "Cuisine familiale avec îlot central", "Bureau/salle de jeux"}', '{"https://placehold.co/1200x800/4A90E2/ffffff?text=Villa+Familiale+280m2", "https://placehold.co/1200x800/2ECC71/ffffff?text=Salon+Familial+45m2", "https://placehold.co/1200x800/E74C3C/ffffff?text=Cuisine+Ilot+Central"}', '{"https://placehold.co/800x600/27AE60/ffffff?text=Plan+Villa+Familiale+280m2+4Ch", "https://placehold.co/800x600/2ECC71/ffffff?text=Plan+Jardin+Piscine+600m2"}', 'https://my.matterport.com/show/?m=villa-limassol-familiale'),

(gen_random_uuid(), 'Penthouse Luxe Marina', 'Penthouse d''exception avec terrasse panoramique dans la prestigieuse marina de Limassol.', 'Penthouse de luxe de 220m² situé dans la tour la plus prestigieuse de Limassol Marina.', 'penthouse', 1650000, '{"lat": 34.7025, "lng": 33.0357, "city": "Limassol"}', '{"Marina prestigieuse", "Terrasse panoramique", "Conciergerie", "Spa résidence"}', '{"Surface habitable de 220 m²", "3 suites avec dressing", "3 salles de bains luxueuses", "Salon panoramique 60m²", "Cuisine design italiene", "Terrasse 80m² vue mer"}', '{"https://placehold.co/1200x800/4A90E2/ffffff?text=Penthouse+Marina+220m2", "https://placehold.co/1200x800/2ECC71/ffffff?text=Terrasse+80m2+Panoramique", "https://placehold.co/1200x800/E74C3C/ffffff?text=Salon+60m2+Vue+Mer"}', '{"https://placehold.co/800x600/8E44AD/ffffff?text=Plan+Penthouse+Marina+220m2", "https://placehold.co/800x600/9B59B6/ffffff?text=Plan+Terrasse+80m2+Prestige"}', 'https://my.matterport.com/show/?m=penthouse-marina-luxe'),

(gen_random_uuid(), 'Maison Traditionnelle Renovée', 'Charmante maison traditionnelle entièrement rénovée dans le village authentique de Lefkara.', 'Maison traditionnelle de 150m² entièrement restaurée avec respect du patrimoine architectural chypriote.', 'maison', 320000, '{"lat": 34.8667, "lng": 33.3167, "city": "Lefkara"}', '{"Architecture traditionnelle", "Rénovation complète", "Jardin méditerranéen", "Village authentique"}', '{"Surface habitable de 150 m²", "3 chambres traditionnelles", "2 salles de bains modernes", "Salon avec cheminée pierre", "Cuisine rustique équipée", "Jardin méditerranéen 300m²"}', '{"https://placehold.co/1200x800/4A90E2/ffffff?text=Maison+Traditionnelle+150m2", "https://placehold.co/1200x800/2ECC71/ffffff?text=Salon+Cheminee+Pierre", "https://placehold.co/1200x800/E74C3C/ffffff?text=Cuisine+Rustique+Equipee"}', '{"https://placehold.co/800x600/A0522D/ffffff?text=Plan+Maison+Traditionnelle+150m2", "https://placehold.co/800x600/8B4513/ffffff?text=Plan+Jardin+Mediterraneen+300m2"}', 'https://my.matterport.com/show/?m=maison-lefkara-traditionnelle');

-- Create storage bucket for media uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);

-- Create storage policies for media bucket
CREATE POLICY "Media files are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'media');

CREATE POLICY "Authenticated users can upload media" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'media');

CREATE POLICY "Authenticated users can update media" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (bucket_id = 'media');

CREATE POLICY "Authenticated users can delete media" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'media');