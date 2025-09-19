-- 2.3 Table properties_final - Unités/Logements individuels (niveau propriété)
CREATE TABLE properties_final (
    -- RELATIONS
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects_clean(id) ON DELETE CASCADE,
    building_id UUID REFERENCES buildings_enhanced(id) ON DELETE CASCADE,
    unit_code VARCHAR(50) NOT NULL,
    
    -- SPECS
    property_type VARCHAR(50),
    floor_number INTEGER,
    bedrooms INTEGER,
    bathrooms INTEGER,
    wc_separate BOOLEAN DEFAULT FALSE,
    internal_area_m2 DECIMAL(10,2),
    covered_veranda_m2 DECIMAL(10,2),
    uncovered_veranda_m2 DECIMAL(10,2),
    garden_area_m2 DECIMAL(10,2),
    roof_terrace_m2 DECIMAL(10,2),
    storage_area_m2 DECIMAL(10,2),
    
    -- PRICING
    price DECIMAL(12,2),
    currency VARCHAR(10) DEFAULT 'EUR',
    vat_rate DECIMAL(5,2) DEFAULT 5.00,
    payment_plan JSONB,
    reservation_fee DECIMAL(10,2),
    down_payment_percent DECIMAL(5,2),
    financing_available BOOLEAN DEFAULT FALSE,
    bank_loan_eligible BOOLEAN DEFAULT FALSE,
    special_offer TEXT,
    discount_percentage DECIMAL(5,2),
    
    -- FEATURES
    view_type VARCHAR(100),
    orientation VARCHAR(50),
    has_balcony BOOLEAN DEFAULT FALSE,
    has_terrace BOOLEAN DEFAULT FALSE,
    has_garden BOOLEAN DEFAULT FALSE,
    has_private_pool BOOLEAN DEFAULT FALSE,
    has_jacuzzi BOOLEAN DEFAULT FALSE,
    has_fireplace BOOLEAN DEFAULT FALSE,
    has_parking_space BOOLEAN DEFAULT FALSE,
    parking_spaces_count INTEGER DEFAULT 0,
    has_storage_room BOOLEAN DEFAULT FALSE,
    has_maid_room BOOLEAN DEFAULT FALSE,
    kitchen_type VARCHAR(50),
    furniture_status VARCHAR(50),
    property_features TEXT[],
    
    -- STATUS
    status VARCHAR(50) DEFAULT 'available',
    availability_date DATE,
    reservation_expires DATE,
    title_deed_status VARCHAR(50),
    title_deed_number VARCHAR(100),
    ownership_type VARCHAR(50),
    is_resale BOOLEAN DEFAULT FALSE,
    previous_owners_count INTEGER DEFAULT 0,
    
    -- CYPRUS LEGAL
    title_deed_ready BOOLEAN DEFAULT FALSE,
    transfer_fee_percentage DECIMAL(5,2),
    transfer_fee_amount DECIMAL(10,2),
    stamp_duty DECIMAL(10,2),
    land_registry_fees DECIMAL(10,2),
    legal_check_completed BOOLEAN DEFAULT FALSE,
    encumbrance_check_date DATE,
    planning_permit_number VARCHAR(100),
    building_permit_number VARCHAR(100),
    occupancy_certificate_number VARCHAR(100),
    
    -- INVESTMENT
    rental_potential_monthly DECIMAL(10,2),
    rental_yield_percent DECIMAL(5,2),
    capital_appreciation_estimate DECIMAL(5,2),
    roi_5_years DECIMAL(5,2),
    management_fee_monthly DECIMAL(10,2),
    common_expenses_monthly DECIMAL(10,2),
    
    -- TIMESTAMPS
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    first_published_at TIMESTAMPTZ,
    last_viewed_at TIMESTAMPTZ,
    total_views INTEGER DEFAULT 0
);

-- RLS pour properties_final
ALTER TABLE properties_final ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view properties" ON properties_final
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage properties" ON properties_final
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Index pour performance
CREATE INDEX idx_properties_final_project_id ON properties_final(project_id);
CREATE INDEX idx_properties_final_building_id ON properties_final(building_id);
CREATE INDEX idx_properties_final_status ON properties_final(status);
CREATE INDEX idx_properties_final_price ON properties_final(price);

-- Sécuriser les tables de backup (RLS désactivé = lecture seule admin uniquement)
ALTER TABLE backup_projects_20250119 ENABLE ROW LEVEL SECURITY;
ALTER TABLE backup_developers_20250119 ENABLE ROW LEVEL SECURITY;
ALTER TABLE backup_buildings_20250119 ENABLE ROW LEVEL SECURITY;
ALTER TABLE backup_properties_20250119 ENABLE ROW LEVEL SECURITY;
ALTER TABLE backup_properties_test_20250119 ENABLE ROW LEVEL SECURITY;
ALTER TABLE migration_report_20250119 ENABLE ROW LEVEL SECURITY;

-- Policies restrictives pour les backups (admin seulement)
CREATE POLICY "Only admins can view backups" ON backup_projects_20250119
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Only admins can view dev backups" ON backup_developers_20250119
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Only admins can view building backups" ON backup_buildings_20250119
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Only admins can view prop backups" ON backup_properties_20250119
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Only admins can view prop test backups" ON backup_properties_test_20250119
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Only admins can view migration reports" ON migration_report_20250119
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );