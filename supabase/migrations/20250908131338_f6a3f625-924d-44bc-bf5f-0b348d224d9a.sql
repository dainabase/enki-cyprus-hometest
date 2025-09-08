-- ========================================
-- MIGRATION PHASE 1 : Structure des champs
-- Date: 2025-01-27
-- Table: projects
-- ========================================

ALTER TABLE projects
-- IDENTIFICATION & BASICS
ADD COLUMN IF NOT EXISTS project_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS property_category TEXT CHECK (property_category IN ('residential', 'commercial', 'mixed', 'industrial')),
ADD COLUMN IF NOT EXISTS property_sub_type TEXT CHECK (property_sub_type IN ('villa', 'apartment', 'penthouse', 'townhouse', 'studio', 'duplex', 'office', 'retail', 'warehouse')),
ADD COLUMN IF NOT EXISTS project_phase TEXT CHECK (project_phase IN ('off-plan', 'under-construction', 'completed', 'ready-to-move')),
ADD COLUMN IF NOT EXISTS launch_date DATE,
ADD COLUMN IF NOT EXISTS completion_date_new DATE,
ADD COLUMN IF NOT EXISTS unique_selling_points TEXT[],

-- LOCATION & GEOGRAPHY
ADD COLUMN IF NOT EXISTS full_address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS region TEXT,
ADD COLUMN IF NOT EXISTS neighborhood TEXT,
ADD COLUMN IF NOT EXISTS neighborhood_description TEXT,
ADD COLUMN IF NOT EXISTS gps_latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS gps_longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS proximity_sea_km DECIMAL(5, 2),
ADD COLUMN IF NOT EXISTS proximity_airport_km DECIMAL(5, 2),
ADD COLUMN IF NOT EXISTS proximity_city_center_km DECIMAL(5, 2),
ADD COLUMN IF NOT EXISTS proximity_highway_km DECIMAL(5, 2),
ADD COLUMN IF NOT EXISTS interactive_map_url TEXT,
ADD COLUMN IF NOT EXISTS surrounding_amenities JSONB,

-- SIZE & SPECIFICATIONS
ADD COLUMN IF NOT EXISTS land_area_m2 DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS built_area_m2 DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS total_units_new INTEGER,
ADD COLUMN IF NOT EXISTS units_available_new INTEGER,
ADD COLUMN IF NOT EXISTS bedrooms_range TEXT,
ADD COLUMN IF NOT EXISTS bathrooms_range TEXT,
ADD COLUMN IF NOT EXISTS floors_total INTEGER,
ADD COLUMN IF NOT EXISTS parking_spaces INTEGER,
ADD COLUMN IF NOT EXISTS storage_spaces INTEGER,
ADD COLUMN IF NOT EXISTS smart_home_features JSONB,

-- MEDIA & VISUALS
ADD COLUMN IF NOT EXISTS photo_gallery_urls TEXT[],
ADD COLUMN IF NOT EXISTS photo_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS video_tour_urls TEXT[],
ADD COLUMN IF NOT EXISTS floor_plan_urls TEXT[],
ADD COLUMN IF NOT EXISTS floor_plan_3d_urls TEXT[],
ADD COLUMN IF NOT EXISTS virtual_tour_url_new TEXT,
ADD COLUMN IF NOT EXISTS vr_tour_url TEXT,
ADD COLUMN IF NOT EXISTS ar_experience_url TEXT,
ADD COLUMN IF NOT EXISTS drone_footage_urls TEXT[],
ADD COLUMN IF NOT EXISTS model_3d_urls TEXT[],
ADD COLUMN IF NOT EXISTS metaverse_preview_url TEXT,
ADD COLUMN IF NOT EXISTS ai_generated_content JSONB,
ADD COLUMN IF NOT EXISTS ai_content_disclosure TEXT,

-- FINANCIAL & INVESTMENT
ADD COLUMN IF NOT EXISTS price_from_new DECIMAL(12, 2),
ADD COLUMN IF NOT EXISTS price_to DECIMAL(12, 2),
ADD COLUMN IF NOT EXISTS price_per_m2 DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS vat_rate_new DECIMAL(4, 2) DEFAULT 5.00,
ADD COLUMN IF NOT EXISTS vat_included BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS golden_visa_eligible_new BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS roi_estimate_percent DECIMAL(5, 2),
ADD COLUMN IF NOT EXISTS rental_yield_percent DECIMAL(5, 2),
ADD COLUMN IF NOT EXISTS financing_available BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS financing_options JSONB,
ADD COLUMN IF NOT EXISTS payment_plan JSONB,
ADD COLUMN IF NOT EXISTS incentives TEXT[],
ADD COLUMN IF NOT EXISTS nft_ownership_available BOOLEAN DEFAULT false,

-- CONSTRUCTION & QUALITY
ADD COLUMN IF NOT EXISTS construction_materials TEXT[],
ADD COLUMN IF NOT EXISTS finishing_level TEXT CHECK (finishing_level IN ('basic', 'standard', 'premium', 'luxury')),
ADD COLUMN IF NOT EXISTS design_style TEXT,
ADD COLUMN IF NOT EXISTS architect_name TEXT,
ADD COLUMN IF NOT EXISTS builder_name TEXT,
ADD COLUMN IF NOT EXISTS energy_rating TEXT CHECK (energy_rating IN ('A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G')),
ADD COLUMN IF NOT EXISTS sustainability_certifications TEXT[],
ADD COLUMN IF NOT EXISTS warranty_years INTEGER,
ADD COLUMN IF NOT EXISTS after_sales_service BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS bim_model_url TEXT,

-- MARKETING & SEO
ADD COLUMN IF NOT EXISTS project_narrative TEXT,
ADD COLUMN IF NOT EXISTS meta_title_new TEXT,
ADD COLUMN IF NOT EXISTS meta_description_new TEXT,
ADD COLUMN IF NOT EXISTS meta_keywords TEXT[],
ADD COLUMN IF NOT EXISTS og_image_url TEXT,
ADD COLUMN IF NOT EXISTS marketing_highlights TEXT[],
ADD COLUMN IF NOT EXISTS target_audience TEXT[],
ADD COLUMN IF NOT EXISTS testimonials JSONB,
ADD COLUMN IF NOT EXISTS social_proof_stats JSONB,
ADD COLUMN IF NOT EXISTS marketing_strategy JSONB,
ADD COLUMN IF NOT EXISTS pricing_strategy_notes TEXT,

-- LEGAL & COMPLIANCE
ADD COLUMN IF NOT EXISTS title_deed_available BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS title_deed_timeline TEXT,
ADD COLUMN IF NOT EXISTS legal_status TEXT,
ADD COLUMN IF NOT EXISTS permits_obtained TEXT[],
ADD COLUMN IF NOT EXISTS compliance_certifications TEXT[],

-- ANALYTICS & TRACKING
ADD COLUMN IF NOT EXISTS view_count_new INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS inquiry_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS favorite_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_price_update TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS featured_new BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS featured_until DATE,
ADD COLUMN IF NOT EXISTS search_ranking_weight INTEGER DEFAULT 5,

-- AI & INNOVATION
ADD COLUMN IF NOT EXISTS ai_chatbot_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ai_description TEXT,
ADD COLUMN IF NOT EXISTS ai_generated_at TIMESTAMP WITH TIME ZONE,

-- SEASONAL & LIFESTYLE
ADD COLUMN IF NOT EXISTS seasonal_features JSONB,
ADD COLUMN IF NOT EXISTS lifestyle_amenities TEXT[],
ADD COLUMN IF NOT EXISTS community_features TEXT[],
ADD COLUMN IF NOT EXISTS wellness_features TEXT[];

-- Ajouter les commentaires pour documentation
COMMENT ON COLUMN projects.project_code IS 'Code unique du projet pour référence interne';
COMMENT ON COLUMN projects.property_category IS 'Catégorie principale: residential, commercial, mixed, industrial';
COMMENT ON COLUMN projects.property_sub_type IS 'Sous-type spécifique de propriété';
COMMENT ON COLUMN projects.project_phase IS 'Phase actuelle du projet';
COMMENT ON COLUMN projects.unique_selling_points IS 'Points de vente uniques du projet';
COMMENT ON COLUMN projects.golden_visa_eligible_new IS 'Éligible au programme Golden Visa (>300k€)';
COMMENT ON COLUMN projects.smart_home_features IS 'Fonctionnalités domotiques en JSON';
COMMENT ON COLUMN projects.ai_generated_content IS 'Contenu généré par IA avec métadonnées';
COMMENT ON COLUMN projects.sustainability_certifications IS 'Certifications écologiques obtenues';