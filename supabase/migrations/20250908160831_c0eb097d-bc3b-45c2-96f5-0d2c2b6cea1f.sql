-- ========================================
-- CRÉATION TABLE COMMODITÉS DE PROXIMITÉ
-- ========================================

-- Table des commodités disponibles à proximité
CREATE TABLE IF NOT EXISTS nearby_amenities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category TEXT NOT NULL CHECK (category IN (
        'education', 'transport', 'health', 'shopping', 
        'leisure', 'services', 'dining', 'nature'
    )),
    name TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL,
    name_el TEXT, -- Nom en grec
    name_ru TEXT, -- Nom en russe
    description TEXT,
    importance_level INTEGER DEFAULT 5, -- 1-10 (10 = très important)
    sort_order INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table de liaison projets-commodités proximité
CREATE TABLE IF NOT EXISTS project_nearby_amenities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    nearby_amenity_id UUID NOT NULL REFERENCES nearby_amenities(id) ON DELETE CASCADE,
    distance_km DECIMAL(5, 2), -- Distance en kilomètres
    distance_minutes_walk INTEGER, -- Temps à pied en minutes
    distance_minutes_drive INTEGER, -- Temps en voiture en minutes
    quantity INTEGER DEFAULT 1, -- Nombre (ex: 3 écoles)
    details TEXT, -- Détails spécifiques (ex: "Lycée International de Paphos")
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, nearby_amenity_id)
);

-- Insérer les commodités de proximité essentielles
INSERT INTO nearby_amenities (category, name, icon, name_el, name_ru, importance_level, sort_order) VALUES
-- EDUCATION
('education', 'École primaire', 'GraduationCap', 'Δημοτικό Σχολείο', 'Начальная школа', 9, 10),
('education', 'École secondaire', 'School', 'Γυμνάσιο/Λύκειο', 'Средняя школа', 8, 20),
('education', 'École internationale', 'Globe', 'Διεθνές Σχολείο', 'Международная школа', 9, 30),
('education', 'Université', 'Building2', 'Πανεπιστήμιο', 'Университет', 7, 40),
('education', 'Crèche/Maternelle', 'Baby', 'Νηπιαγωγείο', 'Детский сад', 8, 50),
('education', 'École privée', 'UserCheck', 'Ιδιωτικό Σχολείο', 'Частная школа', 7, 60),

-- TRANSPORT
('transport', 'Arrêt de bus', 'Bus', 'Στάση Λεωφορείου', 'Автобусная остановка', 9, 70),
('transport', 'Autoroute', 'Route', 'Αυτοκινητόδρομος', 'Автомагистраль', 8, 80),
('transport', 'Aéroport', 'Plane', 'Αεροδρόμιο', 'Аэропорт', 10, 90),
('transport', 'Port/Marina', 'Anchor', 'Λιμάνι/Μαρίνα', 'Порт/Марина', 7, 100),
('transport', 'Station taxi', 'Car', 'Πιάτσα Ταξί', 'Стоянка такси', 6, 110),
('transport', 'Location véhicules', 'Key', 'Ενοικίαση Αυτοκινήτων', 'Прокат авто', 5, 120),

-- HEALTH
('health', 'Hôpital', 'Hospital', 'Νοσοκομείο', 'Больница', 10, 130),
('health', 'Centre médical', 'Heart', 'Ιατρικό Κέντρο', 'Медцентр', 9, 140),
('health', 'Pharmacie', 'Pill', 'Φαρμακείο', 'Аптека', 9, 150),
('health', 'Dentiste', 'Smile', 'Οδοντίατρος', 'Стоматолог', 7, 160),
('health', 'Vétérinaire', 'Stethoscope', 'Κτηνίατρος', 'Ветеринар', 5, 170),
('health', 'Centre d''urgence', 'Siren', 'Κέντρο Επειγόντων', 'Скорая помощь', 9, 180),

-- SHOPPING
('shopping', 'Supermarché', 'ShoppingCart', 'Σούπερ Μάρκετ', 'Супермаркет', 10, 190),
('shopping', 'Centre commercial', 'ShoppingBag', 'Εμπορικό Κέντρο', 'Торговый центр', 8, 200),
('shopping', 'Marché local', 'Store', 'Τοπική Αγορά', 'Местный рынок', 6, 210),
('shopping', 'Boulangerie', 'Croissant', 'Αρτοποιείο', 'Пекарня', 8, 220),
('shopping', 'Épicerie', 'Package', 'Παντοπωλείο', 'Продуктовый', 7, 230),
('shopping', 'Magasins', 'Store', 'Καταστήματα', 'Магазины', 7, 240),

-- LEISURE
('leisure', 'Plage', 'Waves', 'Παραλία', 'Пляж', 10, 250),
('leisure', 'Parc', 'Trees', 'Πάρκο', 'Парк', 8, 260),
('leisure', 'Cinéma', 'Film', 'Κινηματογράφος', 'Кинотеатр', 6, 270),
('leisure', 'Théâtre', 'Drama', 'Θέατρο', 'Театр', 5, 280),
('leisure', 'Musée', 'Landmark', 'Μουσείο', 'Музей', 5, 290),
('leisure', 'Centre sportif', 'Trophy', 'Αθλητικό Κέντρο', 'Спортцентр', 7, 300),
('leisure', 'Golf', 'Flag', 'Γκολφ', 'Гольф', 6, 310),
('leisure', 'Tennis club', 'Circle', 'Τένις', 'Теннис клуб', 5, 320),

-- SERVICES
('services', 'Banque', 'Banknote', 'Τράπεζα', 'Банк', 9, 330),
('services', 'ATM', 'CreditCard', 'ΑΤΜ', 'Банкомат', 8, 340),
('services', 'Poste', 'Mail', 'Ταχυδρομείο', 'Почта', 6, 350),
('services', 'Police', 'Shield', 'Αστυνομία', 'Полиция', 8, 360),
('services', 'Pompiers', 'Flame', 'Πυροσβεστική', 'Пожарная', 7, 370),
('services', 'Mairie', 'Building', 'Δημαρχείο', 'Мэрия', 5, 380),
('services', 'Station-service', 'Fuel', 'Βενζινάδικο', 'АЗС', 8, 390),

-- DINING
('dining', 'Restaurant', 'UtensilsCrossed', 'Εστιατόριο', 'Ресторан', 8, 400),
('dining', 'Café', 'Coffee', 'Καφετέρια', 'Кафе', 7, 410),
('dining', 'Bar', 'Wine', 'Μπαρ', 'Бар', 6, 420),
('dining', 'Fast-food', 'Pizza', 'Φαστ Φουντ', 'Фастфуд', 5, 430),
('dining', 'Taverne', 'ChefHat', 'Ταβέρνα', 'Таверна', 7, 440),

-- NATURE
('nature', 'Montagne', 'Mountain', 'Βουνό', 'Горы', 7, 450),
('nature', 'Forêt', 'TreePine', 'Δάσος', 'Лес', 6, 460),
('nature', 'Lac', 'Droplet', 'Λίμνη', 'Озеро', 5, 470),
('nature', 'Sentier randonnée', 'Footprints', 'Μονοπάτι Πεζοπορίας', 'Пешая тропа', 6, 480),
('nature', 'Zone protégée', 'Leaf', 'Προστατευόμενη Περιοχή', 'Заповедник', 5, 490)
ON CONFLICT (name) DO NOTHING;

-- Créer les index
CREATE INDEX IF NOT EXISTS idx_project_nearby_project ON project_nearby_amenities(project_id);
CREATE INDEX IF NOT EXISTS idx_project_nearby_amenity ON project_nearby_amenities(nearby_amenity_id);
CREATE INDEX IF NOT EXISTS idx_nearby_amenities_category ON nearby_amenities(category);
CREATE INDEX IF NOT EXISTS idx_nearby_amenities_importance ON nearby_amenities(importance_level DESC);

-- Activer RLS
ALTER TABLE nearby_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_nearby_amenities ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour nearby_amenities
CREATE POLICY "Public can view nearby amenities" ON nearby_amenities
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage nearby amenities" ON nearby_amenities
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Politiques RLS pour project_nearby_amenities
CREATE POLICY "Public can view project nearby amenities" ON project_nearby_amenities
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage project nearby amenities" ON project_nearby_amenities
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );