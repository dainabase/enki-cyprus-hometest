-- 2.2 Table buildings_enhanced - Immeubles/Villas (niveau bâtiment)
CREATE TABLE buildings_enhanced (
    -- RELATIONS
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects_clean(id) ON DELETE CASCADE,
    building_code VARCHAR(50) NOT NULL,
    
    -- STRUCTURE
    building_type VARCHAR(50),
    total_floors INTEGER,
    ground_floor_units INTEGER,
    typical_floor_units INTEGER,
    total_units INTEGER,
    orientation VARCHAR(50),
    architectural_style VARCHAR(100),
    roof_type VARCHAR(50),
    foundation_type VARCHAR(50),
    structural_frame VARCHAR(50),
    year_built INTEGER,
    renovation_year INTEGER,
    
    -- DIMENSIONS
    plot_area_m2 DECIMAL(10,2),
    built_area_m2 DECIMAL(10,2),
    common_area_m2 DECIMAL(10,2),
    height_meters DECIMAL(6,2),
    facade_length DECIMAL(6,2),
    depth_meters DECIMAL(6,2),
    
    -- AMENITIES BÂTIMENT
    has_elevator BOOLEAN DEFAULT FALSE,
    has_gym BOOLEAN DEFAULT FALSE,
    has_pool BOOLEAN DEFAULT FALSE,
    has_sauna BOOLEAN DEFAULT FALSE,
    has_playground BOOLEAN DEFAULT FALSE,
    has_bbq_area BOOLEAN DEFAULT FALSE,
    has_rooftop_terrace BOOLEAN DEFAULT FALSE,
    has_underground_parking BOOLEAN DEFAULT FALSE,
    has_storage_units BOOLEAN DEFAULT FALSE,
    building_amenities TEXT[],
    
    -- TECHNIQUE
    energy_rating VARCHAR(10),
    insulation_type VARCHAR(100),
    heating_system VARCHAR(100),
    cooling_system VARCHAR(100),
    solar_panels BOOLEAN DEFAULT FALSE,
    smart_building_features TEXT[],
    disability_access BOOLEAN DEFAULT FALSE,
    emergency_exits INTEGER,
    
    -- STATUS
    construction_status VARCHAR(50) DEFAULT 'planning',
    construction_start DATE,
    expected_completion DATE,
    occupancy_permit_date DATE,
    units_available_count INTEGER DEFAULT 0,
    units_sold_count INTEGER DEFAULT 0,
    
    -- TIMESTAMPS
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS pour buildings_enhanced
ALTER TABLE buildings_enhanced ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view buildings" ON buildings_enhanced
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage buildings" ON buildings_enhanced
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Index pour performance
CREATE INDEX idx_buildings_enhanced_project_id ON buildings_enhanced(project_id);
CREATE INDEX idx_buildings_enhanced_status ON buildings_enhanced(construction_status);