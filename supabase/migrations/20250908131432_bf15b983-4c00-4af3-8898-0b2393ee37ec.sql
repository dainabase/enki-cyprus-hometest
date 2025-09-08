-- ========================================
-- MIGRATION PHASE 2 : Tables amenities et contraintes
-- ========================================

-- Créer la table des amenities disponibles
CREATE TABLE IF NOT EXISTS amenities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category TEXT NOT NULL CHECK (category IN (
        'essential', 'recreation', 'wellness', 'security', 
        'business', 'lifestyle', 'connectivity', 'outdoor'
    )),
    name TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL, -- nom de l'icône (ex: 'Swimming', 'Dumbbell')
    name_el TEXT, -- Nom en grec
    name_ru TEXT, -- Nom en russe
    description TEXT,
    is_premium BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table de liaison projets-amenities
CREATE TABLE IF NOT EXISTS project_amenities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    amenity_id UUID NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
    details TEXT, -- Détails spécifiques (ex: "2 piscines olympiques")
    is_available BOOLEAN DEFAULT true,
    is_paid BOOLEAN DEFAULT false, -- Si c'est payant
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, amenity_id)
);

-- Insérer les amenities de base
INSERT INTO amenities (category, name, icon, name_el, name_ru, sort_order, is_premium) VALUES
-- ESSENTIAL
('essential', 'Swimming Pool', 'Waves', 'Πισίνα', 'Бассейн', 10, false),
('essential', 'Parking', 'Car', 'Στάθμευση', 'Парковка', 20, false),
('essential', 'Storage', 'Package', 'Αποθήκη', 'Кладовая', 30, false),
('essential', 'Elevator', 'ArrowUpSquare', 'Ανελκυστήρας', 'Лифт', 40, false),

-- RECREATION
('recreation', 'Gym/Fitness', 'Dumbbell', 'Γυμναστήριο', 'Фитнес-зал', 50, false),
('recreation', 'Tennis Court', 'Circle', 'Γήπεδο Τένις', 'Теннисный корт', 60, true),
('recreation', 'Children Playground', 'Baby', 'Παιδική Χαρά', 'Детская площадка', 70, false),
('recreation', 'Games Room', 'Gamepad2', 'Αίθουσα Παιχνιδιών', 'Игровая комната', 80, false),

-- WELLNESS
('wellness', 'Spa', 'Sparkles', 'Σπα', 'Спа', 90, true),
('wellness', 'Sauna', 'Thermometer', 'Σάουνα', 'Сауна', 100, true),
('wellness', 'Jacuzzi', 'Droplets', 'Τζακούζι', 'Джакузи', 110, true),
('wellness', 'Yoga Studio', 'Heart', 'Στούντιο Γιόγκα', 'Студия йоги', 120, true),

-- SECURITY
('security', '24/7 Security', 'Shield', '24ωρη Ασφάλεια', 'Охрана 24/7', 130, false),
('security', 'CCTV', 'Camera', 'Κάμερες', 'Видеонаблюдение', 140, false),
('security', 'Gated Community', 'Lock', 'Περιφραγμένη Κοινότητα', 'Закрытая территория', 150, false),
('security', 'Video Intercom', 'Video', 'Θυροτηλεόραση', 'Видеодомофон', 160, false),

-- BUSINESS
('business', 'Co-working Space', 'Briefcase', 'Χώρος Συνεργασίας', 'Коворкинг', 170, true),
('business', 'Meeting Room', 'Users', 'Αίθουσα Συσκέψεων', 'Переговорная', 180, true),
('business', 'Business Center', 'Building', 'Επιχειρηματικό Κέντρο', 'Бизнес-центр', 190, true),

-- LIFESTYLE
('lifestyle', 'Concierge', 'UserCheck', 'Θυρωρείο', 'Консьерж', 200, true),
('lifestyle', 'Cleaning Service', 'Sparkle', 'Υπηρεσία Καθαρισμού', 'Клининг', 210, true),
('lifestyle', 'Pet Friendly', 'Heart', 'Φιλικό προς Κατοικίδια', 'Можно с животными', 220, false),
('lifestyle', 'Restaurant/Cafe', 'Coffee', 'Εστιατόριο/Καφέ', 'Ресторан/Кафе', 230, false),

-- CONNECTIVITY
('connectivity', 'High-Speed Internet', 'Wifi', 'Internet Υψηλής Ταχύτητας', 'Высокоскоростной интернет', 240, false),
('connectivity', 'Fiber Optic', 'Cable', 'Οπτική Ίνα', 'Оптоволокно', 250, false),
('connectivity', 'Smart Home Ready', 'Home', 'Έξυπνο Σπίτι', 'Умный дом', 260, true),

-- OUTDOOR
('outdoor', 'BBQ Area', 'Flame', 'Χώρος BBQ', 'Зона барбекю', 270, false),
('outdoor', 'Garden', 'Trees', 'Κήπος', 'Сад', 280, false),
('outdoor', 'Roof Terrace', 'Sun', 'Ταράτσα', 'Терраса на крыше', 290, true),
('outdoor', 'Beach Access', 'Umbrella', 'Πρόσβαση στην Παραλία', 'Доступ к пляжу', 300, true),
('outdoor', 'Marina', 'Anchor', 'Μαρίνα', 'Марина', 310, true)
ON CONFLICT (name) DO NOTHING;

-- Créer les index pour optimisation
CREATE INDEX IF NOT EXISTS idx_projects_property_category ON projects(property_category);
CREATE INDEX IF NOT EXISTS idx_projects_project_phase ON projects(project_phase);
CREATE INDEX IF NOT EXISTS idx_projects_city ON projects(city);
CREATE INDEX IF NOT EXISTS idx_projects_golden_visa ON projects(golden_visa_eligible_new) WHERE golden_visa_eligible_new = true;
CREATE INDEX IF NOT EXISTS idx_projects_price_range ON projects(price_from_new, price_to);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured_new) WHERE featured_new = true;
CREATE INDEX IF NOT EXISTS idx_projects_gps ON projects(gps_latitude, gps_longitude);
CREATE INDEX IF NOT EXISTS idx_project_amenities_project ON project_amenities(project_id);
CREATE INDEX IF NOT EXISTS idx_project_amenities_amenity ON project_amenities(amenity_id);

-- Enable RLS on new tables
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_amenities ENABLE ROW LEVEL SECURITY;

-- Create policies for amenities (public read, admin write)
CREATE POLICY "Public can view amenities" ON amenities FOR SELECT USING (true);
CREATE POLICY "Admins can manage amenities" ON amenities FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Create policies for project_amenities (public read, admin write)
CREATE POLICY "Public can view project amenities" ON project_amenities FOR SELECT USING (true);
CREATE POLICY "Admins can manage project amenities" ON project_amenities FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);