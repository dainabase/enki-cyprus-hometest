-- =====================================================
-- AUDIT ET OPTIMISATION BASE DE DONNÉES ENKI REALITY (CORRECTED)
-- Date: 2025-01-13
-- Objectif: Ajouter les champs Cyprus manquants et optimiser la performance
-- =====================================================

-- 1. AJOUT DES CHAMPS CYPRUS-SPÉCIFIQUES MANQUANTS

-- PROPERTIES - Champs légaux et administratifs Cyprus
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS title_deed_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS energy_certificate_rating VARCHAR(2),
ADD COLUMN IF NOT EXISTS property_tax_yearly NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS transfer_fee_percentage DECIMAL(4,2) DEFAULT 3.00,
ADD COLUMN IF NOT EXISTS stamp_duty_percentage DECIMAL(4,2) DEFAULT 0.15,
ADD COLUMN IF NOT EXISTS legal_fees_percentage DECIMAL(4,2) DEFAULT 1.00,
ADD COLUMN IF NOT EXISTS immovable_property_tax NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS sewerage_levy NUMERIC(8,2);

-- PROPERTIES - Champs techniques Cyprus
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS plot_m2 NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS covered_veranda_m2 NUMERIC(8,2),
ADD COLUMN IF NOT EXISTS uncovered_veranda_m2 NUMERIC(8,2),
ADD COLUMN IF NOT EXISTS basement_m2 NUMERIC(8,2),
ADD COLUMN IF NOT EXISTS attic_m2 NUMERIC(8,2);

-- PROPERTIES - Features Cyprus-spécifiques  
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS has_underfloor_heating BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_central_heating BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_air_conditioning BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_solar_panels BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_pressurized_water BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_electric_gates BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_alarm_system BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS internet_ready BOOLEAN DEFAULT TRUE;

-- PROJECTS - Champs réglementaires Cyprus
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS planning_permit_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS building_permit_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS environmental_permit VARCHAR(50),
ADD COLUMN IF NOT EXISTS architect_license_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS engineer_license_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS municipality VARCHAR(100),
ADD COLUMN IF NOT EXISTS district VARCHAR(100);

-- PROJECTS - SEO et Marketing améliorés
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS meta_keywords TEXT[],
ADD COLUMN IF NOT EXISTS og_image_url TEXT,
ADD COLUMN IF NOT EXISTS schema_markup JSONB DEFAULT '{}';

-- DEVELOPERS - Informations légales Cyprus
ALTER TABLE developers
ADD COLUMN IF NOT EXISTS company_registration_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS vat_number VARCHAR(20),
ADD COLUMN IF NOT EXISTS license_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS insurance_coverage NUMERIC(12,2),
ADD COLUMN IF NOT EXISTS bank_guarantee BOOLEAN DEFAULT FALSE;

-- 2. INDEXES PERFORMANCE CRITIQUES
CREATE INDEX IF NOT EXISTS idx_properties_type_status ON properties(type, status);
CREATE INDEX IF NOT EXISTS idx_properties_bedrooms_price ON properties(bedrooms, price);
CREATE INDEX IF NOT EXISTS idx_properties_size_price ON properties(size_m2, price);
CREATE INDEX IF NOT EXISTS idx_projects_completion ON projects(completion_date_new);
CREATE INDEX IF NOT EXISTS idx_developers_commission ON developers(commission_rate);

-- 3. MISE À JOUR DES DONNÉES EXISTANTES
UPDATE properties 
SET vat_rate = CASE 
    WHEN size_m2 > 200 THEN 19.00 
    ELSE 5.00 
END
WHERE vat_rate IS NULL;

-- 4. ANALYSE PERFORMANCE
ANALYZE properties;
ANALYZE projects;
ANALYZE developers;
ANALYZE buildings;