-- 📊 BACKUP SQL - STRUCTURE ACTUELLE DES TABLES
-- Date: 27 septembre 2025
-- Projet: ENKI REALITY CYPRUS
-- Base: Supabase (ccsakftsslurjgnjwdci)

-- ============================================
-- TABLE: buildings
-- ============================================

CREATE TABLE IF NOT EXISTS public.buildings (
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    project_id UUID,
    building_code TEXT NOT NULL,
    building_name TEXT,
    display_order INTEGER DEFAULT 0,
    building_type TEXT DEFAULT 'residential',
    building_class TEXT,
    total_floors INTEGER NOT NULL,
    total_units INTEGER DEFAULT 0,
    units_available INTEGER DEFAULT 0,
    construction_status TEXT DEFAULT 'planning',
    expected_completion DATE,
    actual_completion DATE,
    energy_rating VARCHAR(2),
    energy_certificate TEXT,
    elevator_count INTEGER DEFAULT 0,
    has_generator BOOLEAN DEFAULT false,
    has_security_system BOOLEAN DEFAULT false,
    has_cctv BOOLEAN DEFAULT false,
    has_concierge BOOLEAN DEFAULT false,
    has_solar_panels BOOLEAN DEFAULT false,
    has_pool BOOLEAN DEFAULT false,
    has_gym BOOLEAN DEFAULT false,
    has_spa BOOLEAN DEFAULT false,
    has_playground BOOLEAN DEFAULT false,
    has_garden BOOLEAN DEFAULT false,
    has_parking BOOLEAN DEFAULT false,
    parking_type TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID,
    building_amenities JSONB DEFAULT '{}',
    common_areas JSONB DEFAULT '{}',
    security_features JSONB DEFAULT '{}',
    wellness_facilities JSONB DEFAULT '{}',
    infrastructure JSONB DEFAULT '{}',
    outdoor_facilities JSONB DEFAULT '{}',
    floor_plans JSONB DEFAULT '[]',
    typical_floor_plan_url TEXT,
    model_3d_url TEXT,
    building_brochure_url TEXT,
    wheelchair_accessible BOOLEAN DEFAULT false,
    disabled_parking_spaces INTEGER DEFAULT 0,
    braille_signage BOOLEAN DEFAULT false,
    audio_assistance BOOLEAN DEFAULT false,
    accessible_bathrooms INTEGER DEFAULT 0,
    ramp_access BOOLEAN DEFAULT false,
    wide_doorways BOOLEAN DEFAULT false,
    accessible_elevator BOOLEAN DEFAULT false,
    central_vacuum_system BOOLEAN DEFAULT false,
    water_softener_system BOOLEAN DEFAULT false,
    water_purification_system BOOLEAN DEFAULT false,
    smart_building_system BOOLEAN DEFAULT false,
    intercom_system BOOLEAN DEFAULT false,
    package_room BOOLEAN DEFAULT false,
    bike_storage BOOLEAN DEFAULT false,
    pet_washing_station BOOLEAN DEFAULT false,
    car_wash_area BOOLEAN DEFAULT false,
    PRIMARY KEY (id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Index sur project_id pour les performances
CREATE INDEX IF NOT EXISTS idx_buildings_project_id ON public.buildings(project_id);
CREATE INDEX IF NOT EXISTS idx_buildings_construction_status ON public.buildings(construction_status);

-- ============================================
-- TABLE: projects (champs pertinents seulement)
-- ============================================

-- Note: La table projects contient 200+ champs
-- Nous listons ici seulement les champs concernés par le refactoring

-- Champs amenities déjà présents dans projects:
-- has_pool BOOLEAN DEFAULT false
-- has_gym BOOLEAN DEFAULT false
-- has_spa BOOLEAN DEFAULT false
-- has_playground BOOLEAN DEFAULT false
-- has_garden BOOLEAN DEFAULT false
-- has_security_system BOOLEAN DEFAULT false
-- has_cctv BOOLEAN DEFAULT false
-- has_concierge BOOLEAN DEFAULT false
-- has_generator BOOLEAN DEFAULT false
-- has_solar_panels BOOLEAN DEFAULT false
-- has_parking BOOLEAN DEFAULT false
-- parking_type TEXT
-- security_features JSONB DEFAULT '{}'
-- wellness_facilities JSONB DEFAULT '{}'
-- outdoor_facilities JSONB DEFAULT '{}'

-- ============================================
-- RLS (Row Level Security)
-- ============================================

ALTER TABLE public.buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Policies buildings
CREATE POLICY "Buildings viewable by everyone" ON public.buildings
    FOR SELECT USING (true);

CREATE POLICY "Buildings editable by authenticated users" ON public.buildings
    FOR ALL USING (auth.uid() IS NOT NULL);

-- ============================================
-- TRIGGERS EXISTANTS
-- ============================================

-- Trigger updated_at sur buildings
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_buildings_updated_at BEFORE UPDATE ON public.buildings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- CONTRAINTES ET VALIDATIONS
-- ============================================

-- Contrainte sur construction_status
ALTER TABLE public.buildings ADD CONSTRAINT check_construction_status 
    CHECK (construction_status IN ('planning', 'construction', 'delivered'));

-- Contrainte sur building_type
ALTER TABLE public.buildings ADD CONSTRAINT check_building_type 
    CHECK (building_type IN ('residential', 'apartment_building', 'villa_complex', 'mixed_residence'));

-- Contrainte sur building_class
ALTER TABLE public.buildings ADD CONSTRAINT check_building_class 
    CHECK (building_class IN ('A+', 'A', 'B', 'C'));

-- Contrainte sur parking_type
ALTER TABLE public.buildings ADD CONSTRAINT check_parking_type 
    CHECK (parking_type IN ('underground', 'outdoor', 'covered'));

-- ============================================
-- DONNÉES EXISTANTES (COMPTEURS)
-- ============================================

-- SELECT COUNT(*) FROM buildings; -- À exécuter pour connaître le nombre d'enregistrements
-- SELECT COUNT(*) FROM projects; -- À exécuter pour connaître le nombre d'enregistrements

-- ============================================
-- FIN DU BACKUP
-- ============================================
