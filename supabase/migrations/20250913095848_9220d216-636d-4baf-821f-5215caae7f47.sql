-- Créer la table properties pour les unités individuelles
CREATE TABLE IF NOT EXISTS properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Relations hiérarchiques (obligatoires)
    building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    developer_id UUID NOT NULL REFERENCES developers(id) ON DELETE CASCADE,
    
    -- Identification unique de l'unité
    unit_number VARCHAR(50) NOT NULL,
    floor INTEGER NOT NULL,
    
    -- Type et caractéristiques de base
    type VARCHAR(50) NOT NULL CHECK (type IN ('studio', '1bed', '2bed', '3bed', '4bed', 'penthouse', 'villa', 'townhouse')),
    bedrooms INTEGER NOT NULL,
    bathrooms DECIMAL(2,1) NOT NULL,
    size_m2 DECIMAL(10,2) NOT NULL,
    
    -- Prix et statut
    price DECIMAL(12,2) NOT NULL,
    vat_rate DECIMAL(4,2) DEFAULT 5.00,
    price_with_vat DECIMAL(12,2) GENERATED ALWAYS AS (price * (1 + vat_rate/100)) STORED,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold')),
    
    -- Golden Visa automatique
    is_golden_visa BOOLEAN GENERATED ALWAYS AS (price >= 300000) STORED,
    
    -- Caractéristiques premium
    view_type VARCHAR(100),
    orientation VARCHAR(20) CHECK (orientation IN ('N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW')),
    balcony_m2 DECIMAL(6,2) DEFAULT 0,
    terrace_m2 DECIMAL(6,2) DEFAULT 0,
    garden_m2 DECIMAL(8,2) DEFAULT 0,
    parking_spaces INTEGER DEFAULT 0,
    storage_units INTEGER DEFAULT 0,
    
    -- Amenities
    has_pool_access BOOLEAN DEFAULT FALSE,
    has_gym_access BOOLEAN DEFAULT FALSE,
    has_sea_view BOOLEAN DEFAULT FALSE,
    has_mountain_view BOOLEAN DEFAULT FALSE,
    is_furnished BOOLEAN DEFAULT FALSE,
    
    -- Agent et commission
    assigned_agent_id UUID REFERENCES profiles(id),
    commission_rate DECIMAL(4,2) DEFAULT 3.00,
    
    -- Images et documents
    featured_image TEXT,
    gallery_images TEXT[], 
    floor_plan_url TEXT,
    virtual_tour_url TEXT,
    
    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Contrainte d'unicité
    UNIQUE(building_id, unit_number)
);

-- Index pour performances optimales
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_golden_visa ON properties(is_golden_visa);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_project ON properties(project_id);
CREATE INDEX idx_properties_building ON properties(building_id);
CREATE INDEX idx_properties_developer ON properties(developer_id);

-- Trigger pour updated_at
CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Policy: Tout le monde peut voir les propriétés
CREATE POLICY "Properties are viewable by everyone" ON properties
    FOR SELECT USING (true);

-- Policy: Seuls les admins peuvent créer/modifier/supprimer
CREATE POLICY "Only admins can insert properties" ON properties
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Only admins can update properties" ON properties
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Only admins can delete properties" ON properties
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Insérer des données d'exemple (10 propriétés minimum)
INSERT INTO properties (
    building_id, project_id, developer_id,
    unit_number, floor, type, bedrooms, bathrooms, size_m2,
    price, status, view_type, orientation,
    balcony_m2, parking_spaces, has_sea_view
) 
SELECT 
    b.id as building_id,
    p.id as project_id,
    p.developer_id,
    'A' || LPAD((ROW_NUMBER() OVER())::text, 3, '0') as unit_number,
    ((ROW_NUMBER() OVER() - 1) % 10) + 1 as floor,
    CASE 
        WHEN (ROW_NUMBER() OVER()) % 5 = 1 THEN '1bed'
        WHEN (ROW_NUMBER() OVER()) % 5 = 2 THEN '2bed'
        WHEN (ROW_NUMBER() OVER()) % 5 = 3 THEN '3bed'
        WHEN (ROW_NUMBER() OVER()) % 5 = 4 THEN 'penthouse'
        ELSE 'villa'
    END as type,
    CASE 
        WHEN (ROW_NUMBER() OVER()) % 5 = 1 THEN 1
        WHEN (ROW_NUMBER() OVER()) % 5 = 2 THEN 2
        WHEN (ROW_NUMBER() OVER()) % 5 = 3 THEN 3
        WHEN (ROW_NUMBER() OVER()) % 5 = 4 THEN 4
        ELSE 5
    END as bedrooms,
    CASE 
        WHEN (ROW_NUMBER() OVER()) % 5 = 1 THEN 1.0
        WHEN (ROW_NUMBER() OVER()) % 5 = 2 THEN 1.5
        WHEN (ROW_NUMBER() OVER()) % 5 = 3 THEN 2.0
        WHEN (ROW_NUMBER() OVER()) % 5 = 4 THEN 3.0
        ELSE 4.0
    END as bathrooms,
    CASE 
        WHEN (ROW_NUMBER() OVER()) % 5 = 1 THEN 55.0
        WHEN (ROW_NUMBER() OVER()) % 5 = 2 THEN 85.0
        WHEN (ROW_NUMBER() OVER()) % 5 = 3 THEN 110.0
        WHEN (ROW_NUMBER() OVER()) % 5 = 4 THEN 180.0
        ELSE 280.0
    END as size_m2,
    CASE 
        WHEN (ROW_NUMBER() OVER()) % 5 = 1 THEN 195000
        WHEN (ROW_NUMBER() OVER()) % 5 = 2 THEN 285000
        WHEN (ROW_NUMBER() OVER()) % 5 = 3 THEN 385000
        WHEN (ROW_NUMBER() OVER()) % 5 = 4 THEN 750000
        ELSE 950000
    END as price,
    CASE 
        WHEN (ROW_NUMBER() OVER()) % 3 = 1 THEN 'available'
        WHEN (ROW_NUMBER() OVER()) % 3 = 2 THEN 'reserved'
        ELSE 'sold'
    END as status,
    CASE 
        WHEN (ROW_NUMBER() OVER()) % 4 = 1 THEN 'Sea'
        WHEN (ROW_NUMBER() OVER()) % 4 = 2 THEN 'Mountain'
        WHEN (ROW_NUMBER() OVER()) % 4 = 3 THEN 'Garden'
        ELSE 'City'
    END as view_type,
    CASE 
        WHEN (ROW_NUMBER() OVER()) % 8 = 1 THEN 'N'
        WHEN (ROW_NUMBER() OVER()) % 8 = 2 THEN 'NE'
        WHEN (ROW_NUMBER() OVER()) % 8 = 3 THEN 'E'
        WHEN (ROW_NUMBER() OVER()) % 8 = 4 THEN 'SE'
        WHEN (ROW_NUMBER() OVER()) % 8 = 5 THEN 'S'
        WHEN (ROW_NUMBER() OVER()) % 8 = 6 THEN 'SW'
        WHEN (ROW_NUMBER() OVER()) % 8 = 7 THEN 'W'
        ELSE 'NW'
    END as orientation,
    CASE 
        WHEN (ROW_NUMBER() OVER()) % 5 = 4 THEN 45.0
        WHEN (ROW_NUMBER() OVER()) % 5 = 3 THEN 22.0
        ELSE 12.0
    END as balcony_m2,
    CASE 
        WHEN (ROW_NUMBER() OVER()) % 5 = 4 THEN 3
        WHEN (ROW_NUMBER() OVER()) % 5 = 5 THEN 4
        ELSE ((ROW_NUMBER() OVER()) % 3) + 1
    END as parking_spaces,
    CASE 
        WHEN (ROW_NUMBER() OVER()) % 4 = 1 THEN true
        ELSE false
    END as has_sea_view
FROM buildings b
CROSS JOIN projects p
WHERE p.developer_id IS NOT NULL
LIMIT 15;