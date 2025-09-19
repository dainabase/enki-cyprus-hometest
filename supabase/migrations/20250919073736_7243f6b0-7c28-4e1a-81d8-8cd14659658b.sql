-- PHASE 2: CRÉATION NOUVELLE STRUCTURE RELATIONNELLE OPTIMISÉE
-- Tables propres avec hiérarchie claire et sécurité RLS

-- 2.1 Table projects_clean - Programme immobilier (niveau projet)
CREATE TABLE projects_clean (
    -- CORE
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id UUID REFERENCES developers(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    subtitle VARCHAR(500),
    
    -- LOCATION
    city VARCHAR(100),
    region VARCHAR(100),
    zone VARCHAR(100),
    address TEXT,
    postal_code VARCHAR(20),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    distance_beach INTEGER,
    distance_airport INTEGER,
    district VARCHAR(100),
    
    -- MARKETING
    photos TEXT[],
    plans TEXT[],
    virtual_tour_url TEXT,
    video_url TEXT,
    brochure_url TEXT,
    meta_title VARCHAR(160),
    meta_description VARCHAR(320),
    keywords TEXT[],
    featured_image TEXT,
    marketing_highlights TEXT[],
    unique_selling_points TEXT[],
    
    -- BUSINESS
    status VARCHAR(50) DEFAULT 'planning',
    phase VARCHAR(50),
    launch_date DATE,
    completion_date DATE,
    total_investment DECIMAL(15,2),
    expected_roi DECIMAL(5,2),
    price_range_min DECIMAL(12,2),
    price_range_max DECIMAL(12,2),
    commission_structure JSONB,
    referral_program JSONB,
    
    -- AMENITIES PROJET
    has_beach_access BOOLEAN DEFAULT FALSE,
    has_golf_course BOOLEAN DEFAULT FALSE,
    has_tennis_courts BOOLEAN DEFAULT FALSE,
    has_spa_resort BOOLEAN DEFAULT FALSE,
    has_shopping_mall BOOLEAN DEFAULT FALSE,
    has_restaurants BOOLEAN DEFAULT FALSE,
    has_concierge BOOLEAN DEFAULT FALSE,
    has_security_24h BOOLEAN DEFAULT FALSE,
    has_kids_club BOOLEAN DEFAULT FALSE,
    project_amenities TEXT[],
    
    -- CYPRUS SPECIFIC
    golden_visa_eligible BOOLEAN DEFAULT FALSE,
    citizenship_eligible BOOLEAN DEFAULT FALSE,
    permanent_residency_eligible BOOLEAN DEFAULT FALSE,
    minimum_investment DECIMAL(12,2),
    vat_scheme VARCHAR(50),
    title_deeds_guaranteed BOOLEAN DEFAULT FALSE,
    developer_bank_guarantee BOOLEAN DEFAULT FALSE,
    cyprus_government_approved BOOLEAN DEFAULT FALSE,
    
    -- SEO/AI
    ai_description TEXT,
    schema_markup JSONB,
    translations JSONB,
    view_count INTEGER DEFAULT 0,
    engagement_score DECIMAL(5,2),
    conversion_rate DECIMAL(5,2),
    search_ranking INTEGER,
    
    -- TIMESTAMPS
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS pour projects_clean
ALTER TABLE projects_clean ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view projects" ON projects_clean
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage projects" ON projects_clean
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Index pour performance
CREATE INDEX idx_projects_clean_developer_id ON projects_clean(developer_id);
CREATE INDEX idx_projects_clean_status ON projects_clean(status);
CREATE INDEX idx_projects_clean_zone ON projects_clean(zone);