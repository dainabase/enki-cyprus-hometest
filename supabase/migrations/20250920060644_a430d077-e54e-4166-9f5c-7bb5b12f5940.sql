-- ÉTAPE 1/3 : MIGRATION COMPLÈTE BASE DE DONNÉES - NOUVELLE ARCHITECTURE CASCADE
-- =====================================================================================

-- 1. BACKUP COMPLET AVANT MIGRATION
CREATE TABLE backup_complete_20250120 AS 
SELECT 'developers' as table_name, row_to_json(d.*) as data FROM developers d
UNION ALL
SELECT 'projects', row_to_json(p.*) FROM projects p
UNION ALL  
SELECT 'buildings', row_to_json(b.*) FROM buildings b
UNION ALL
SELECT 'properties', row_to_json(p.*) FROM properties p;

-- 2. SUPPRESSION TABLES ACTUELLES (dans l'ordre inverse des dépendances)
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS buildings CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS developers CASCADE;

-- 3. CRÉATION TABLE DEVELOPERS (32 champs)
CREATE TABLE developers (
  -- Identité
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo TEXT,
  founded_year INTEGER,
  company_registration_number TEXT,
  vat_number TEXT,
  license_number TEXT,
  
  -- Contacts
  website TEXT,
  phone_numbers JSONB DEFAULT '[]',
  email_primary TEXT,
  email_sales TEXT,
  email_marketing TEXT,
  main_city TEXT,
  addresses JSONB DEFAULT '[]',
  
  -- Réputation
  years_experience INTEGER,
  total_projects INTEGER DEFAULT 0,
  key_projects JSONB DEFAULT '[]',
  reputation_reviews JSONB DEFAULT '[]',
  rating_score DECIMAL(3,2) CHECK (rating_score >= 0 AND rating_score <= 5),
  rating_justification TEXT,
  
  -- Financier
  commission_rate DECIMAL(5,2) DEFAULT 5.0,
  payment_terms TEXT,
  financial_stability TEXT,
  insurance_coverage DECIMAL(15,2),
  bank_guarantee DECIMAL(15,2),
  
  -- Métadonnées
  history TEXT,
  main_activities TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  contact_info JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CRÉATION TABLE PROJECTS (85+ champs)
CREATE TABLE projects (
  -- Identité
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id UUID REFERENCES developers(id) ON DELETE CASCADE,
  project_code TEXT UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  
  -- Localisation
  city TEXT NOT NULL,
  region TEXT,
  neighborhood TEXT,
  neighborhood_description TEXT,
  full_address TEXT,
  cyprus_zone TEXT CHECK (cyprus_zone IN ('Limassol', 'Paphos', 'Larnaca', 'Nicosia', 'Famagusta')),
  municipality TEXT,
  district TEXT,
  gps_latitude DECIMAL(10,8),
  gps_longitude DECIMAL(11,8),
  
  -- Proximités
  proximity_sea_km DECIMAL(5,2),
  proximity_airport_km DECIMAL(5,2),
  proximity_city_center_km DECIMAL(5,2),
  proximity_highway_km DECIMAL(5,2),
  surrounding_amenities JSONB DEFAULT '[]',
  
  -- Descriptions
  description TEXT,
  detailed_description TEXT,
  project_narrative TEXT,
  unique_selling_points JSONB DEFAULT '[]',
  marketing_highlights JSONB DEFAULT '[]',
  target_audience TEXT,
  
  -- Dimensions
  land_area_m2 DECIMAL(10,2),
  built_area_m2 DECIMAL(10,2),
  total_units INTEGER DEFAULT 0,
  units_available INTEGER DEFAULT 0,
  units_sold INTEGER DEFAULT 0,
  
  -- Prestations communes
  amenities JSONB DEFAULT '[]',
  lifestyle_amenities JSONB DEFAULT '[]',
  community_features JSONB DEFAULT '[]',
  wellness_features JSONB DEFAULT '[]',
  seasonal_features JSONB DEFAULT '[]',
  smart_home_features JSONB DEFAULT '[]',
  accessibility_features JSONB DEFAULT '[]',
  pet_policy TEXT,
  smoking_policy TEXT,
  
  -- Statuts
  status TEXT DEFAULT 'planning',
  project_status TEXT,
  statut_commercial TEXT,
  project_phase TEXT,
  construction_phase TEXT,
  launch_date DATE,
  construction_start DATE,
  completion_date DATE,
  expected_completion DATE,
  
  -- Design & Construction
  architect_name TEXT,
  builder_name TEXT,
  design_style TEXT,
  construction_materials JSONB DEFAULT '[]',
  finishing_level TEXT,
  sustainability_certifications JSONB DEFAULT '[]',
  building_certification JSONB DEFAULT '[]',
  
  -- Financier
  price_from DECIMAL(15,2),
  price_to DECIMAL(15,2),
  price_per_m2 DECIMAL(10,2),
  golden_visa_eligible BOOLEAN DEFAULT false,
  roi_estimate_percent DECIMAL(5,2),
  rental_yield_percent DECIMAL(5,2),
  payment_plan JSONB DEFAULT '[]',
  incentives JSONB DEFAULT '[]',
  pricing_strategy_notes TEXT,
  vat_rate DECIMAL(5,2) DEFAULT 5.0 CHECK (vat_rate IN (5, 19)),
  
  -- Garanties
  warranty_years INTEGER DEFAULT 10,
  after_sales_service TEXT,
  exclusive_commercialization BOOLEAN DEFAULT false,
  maintenance_fees_yearly DECIMAL(10,2),
  property_tax_yearly DECIMAL(10,2),
  hoa_fees_monthly DECIMAL(10,2),
  building_insurance DECIMAL(10,2),
  
  -- Légal OBLIGATOIRE
  title_deed_available BOOLEAN DEFAULT false,
  title_deed_timeline TEXT,
  legal_status TEXT,
  permits_obtained JSONB DEFAULT '[]',
  compliance_certifications JSONB DEFAULT '[]',
  planning_permit_number TEXT,
  building_permit_number TEXT,
  
  -- Médias
  photos JSONB DEFAULT '[]',
  photo_gallery_urls JSONB DEFAULT '[]',
  photo_count INTEGER DEFAULT 0,
  categorized_photos JSONB DEFAULT '{}',
  video_url TEXT,
  video_tour_urls JSONB DEFAULT '[]',
  youtube_tour_url TEXT,
  vimeo_tour_url TEXT,
  drone_footage_urls JSONB DEFAULT '[]',
  virtual_tour_url TEXT,
  vr_tour_url TEXT,
  ar_experience_url TEXT,
  interactive_map_url TEXT,
  map_image TEXT,
  project_presentation_url TEXT,
  bim_model_url TEXT,
  model_3d_urls JSONB DEFAULT '[]',
  
  -- SEO OBLIGATOIRE
  meta_title VARCHAR(60),
  meta_description VARCHAR(160),
  meta_keywords TEXT,
  url_slug TEXT UNIQUE,
  og_image_url TEXT,
  schema_markup JSONB,
  
  -- IA & Analytics
  ai_chatbot_enabled BOOLEAN DEFAULT false,
  ai_description TEXT,
  ai_generated_at TIMESTAMPTZ,
  ai_generated_content JSONB DEFAULT '{}',
  ai_content_disclosure TEXT,
  
  -- Tracking
  view_count INTEGER DEFAULT 0,
  inquiry_count INTEGER DEFAULT 0,
  favorite_count INTEGER DEFAULT 0,
  featured_property BOOLEAN DEFAULT false,
  featured_until DATE,
  search_ranking_weight INTEGER DEFAULT 5,
  last_price_update TIMESTAMPTZ,
  social_proof_stats JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CRÉATION TABLE BUILDINGS (35 champs)
CREATE TABLE buildings (
  -- Identité
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  building_code TEXT NOT NULL,
  building_name TEXT,
  display_order INTEGER DEFAULT 0,
  
  -- Caractéristiques
  building_type TEXT DEFAULT 'residential',
  building_class TEXT CHECK (building_class IN ('A', 'B', 'C')),
  total_floors INTEGER NOT NULL,
  total_units INTEGER DEFAULT 0,
  units_available INTEGER DEFAULT 0,
  construction_year INTEGER,
  
  -- Statuts
  construction_status TEXT DEFAULT 'planning',
  expected_completion DATE,
  actual_completion DATE,
  
  -- Certifications OBLIGATOIRES
  energy_rating VARCHAR(2) CHECK (energy_rating IN ('A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G')),
  energy_certificate TEXT,
  
  -- Équipements bâtiment
  elevator_count INTEGER DEFAULT 0,
  has_generator BOOLEAN DEFAULT false,
  has_security_system BOOLEAN DEFAULT false,
  has_cctv BOOLEAN DEFAULT false,
  has_concierge BOOLEAN DEFAULT false,
  has_solar_panels BOOLEAN DEFAULT false,
  
  -- Espaces communs bâtiment
  has_pool BOOLEAN DEFAULT false,
  has_gym BOOLEAN DEFAULT false,
  has_spa BOOLEAN DEFAULT false,
  has_playground BOOLEAN DEFAULT false,
  has_garden BOOLEAN DEFAULT false,
  
  -- Parking
  has_parking BOOLEAN DEFAULT false,
  parking_type TEXT,
  
  -- Métadonnées
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  
  CONSTRAINT unique_building_code_per_project UNIQUE(project_id, building_code)
);

-- 6. CRÉATION TABLE PROPERTIES (130+ champs)
CREATE TABLE properties (
  -- Identité
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  building_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
  developer_id UUID REFERENCES developers(id) ON DELETE CASCADE,
  property_code TEXT UNIQUE NOT NULL,
  unit_number TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  
  -- Type & Statut
  property_type TEXT NOT NULL CHECK (property_type IN ('apartment', 'penthouse', 'villa', 'townhouse', 'studio', 'duplex', 'office', 'shop')),
  property_sub_type TEXT,
  property_status TEXT DEFAULT 'available' CHECK (property_status IN ('available', 'reserved', 'sold', 'rented')),
  is_available BOOLEAN DEFAULT true,
  reservation_status TEXT,
  reservation_date DATE,
  reservation_fee DECIMAL(10,2),
  sold_date DATE,
  
  -- Localisation dans bâtiment
  floor_number INTEGER,
  position_in_floor TEXT,
  orientation TEXT CHECK (orientation IN ('N', 'S', 'E', 'W', 'NE', 'NW', 'SE', 'SW')),
  facing TEXT,
  distance_to_elevator DECIMAL(5,2),
  distance_to_stairs DECIMAL(5,2),
  entrance_type TEXT,
  
  -- Surfaces OBLIGATOIRES
  internal_area DECIMAL(8,2) NOT NULL,
  living_room_area DECIMAL(8,2),
  kitchen_area DECIMAL(8,2),
  master_bedroom_area DECIMAL(8,2),
  covered_verandas DECIMAL(8,2),
  uncovered_verandas DECIMAL(8,2),
  balcony_area DECIMAL(8,2),
  terrace_area DECIMAL(8,2),
  private_garden_area DECIMAL(8,2),
  roof_garden_area DECIMAL(8,2),
  basement_area DECIMAL(8,2),
  storage_area DECIMAL(8,2),
  total_covered_area DECIMAL(8,2),
  plot_area DECIMAL(8,2),
  
  -- Configuration
  bedrooms_count INTEGER DEFAULT 0,
  bathrooms_count INTEGER DEFAULT 1,
  wc_count INTEGER DEFAULT 0,
  en_suite_count INTEGER DEFAULT 0,
  total_rooms INTEGER,
  ceiling_height DECIMAL(3,2),
  
  -- Pièces spéciales
  has_office BOOLEAN DEFAULT false,
  has_maid_room BOOLEAN DEFAULT false,
  has_laundry_room BOOLEAN DEFAULT false,
  has_storage_room BOOLEAN DEFAULT false,
  has_dressing_room BOOLEAN DEFAULT false,
  has_pantry BOOLEAN DEFAULT false,
  has_wine_cellar BOOLEAN DEFAULT false,
  has_playroom BOOLEAN DEFAULT false,
  has_guest_wc BOOLEAN DEFAULT false,
  
  -- Extérieurs privatifs
  has_balcony BOOLEAN DEFAULT false,
  balcony_count INTEGER DEFAULT 0,
  has_terrace BOOLEAN DEFAULT false,
  terrace_count INTEGER DEFAULT 0,
  has_roof_terrace BOOLEAN DEFAULT false,
  has_private_garden BOOLEAN DEFAULT false,
  garden_type TEXT,
  has_private_pool BOOLEAN DEFAULT false,
  pool_type TEXT,
  pool_size TEXT,
  has_bbq_area BOOLEAN DEFAULT false,
  has_outdoor_kitchen BOOLEAN DEFAULT false,
  has_pergola BOOLEAN DEFAULT false,
  has_automatic_irrigation BOOLEAN DEFAULT false,
  
  -- Parking & Stockage
  parking_spaces INTEGER DEFAULT 0,
  parking_included BOOLEAN DEFAULT false,
  parking_type_unit TEXT,
  parking_location TEXT,
  has_storage_unit BOOLEAN DEFAULT false,
  storage_location TEXT,
  storage_spaces INTEGER DEFAULT 0,
  
  -- Cuisine
  kitchen_type TEXT,
  kitchen_brand TEXT,
  has_kitchen_appliances BOOLEAN DEFAULT false,
  appliances_list JSONB DEFAULT '[]',
  countertop_material TEXT,
  
  -- Technique
  heating_type TEXT,
  hvac_type TEXT,
  has_underfloor_heating BOOLEAN DEFAULT false,
  has_fireplace BOOLEAN DEFAULT false,
  fireplace_type TEXT,
  
  -- Finitions
  flooring_type TEXT,
  windows_type TEXT,
  doors_type TEXT,
  bathroom_fixtures_brand TEXT,
  wall_finish TEXT,
  
  -- Sécurité
  has_alarm_system BOOLEAN DEFAULT false,
  has_video_intercom BOOLEAN DEFAULT false,
  has_safe BOOLEAN DEFAULT false,
  has_security_door BOOLEAN DEFAULT false,
  security_features JSONB DEFAULT '[]',
  
  -- Tech
  has_smart_home BOOLEAN DEFAULT false,
  smart_home_features JSONB DEFAULT '[]',
  internet_ready BOOLEAN DEFAULT true,
  has_fiber_optic BOOLEAN DEFAULT false,
  has_satellite_tv BOOLEAN DEFAULT false,
  
  -- Luxe
  has_jacuzzi BOOLEAN DEFAULT false,
  has_sauna BOOLEAN DEFAULT false,
  has_home_cinema BOOLEAN DEFAULT false,
  has_wine_fridge BOOLEAN DEFAULT false,
  has_electric_shutters BOOLEAN DEFAULT false,
  has_water_softener BOOLEAN DEFAULT false,
  has_central_vacuum BOOLEAN DEFAULT false,
  has_electric_car_charger BOOLEAN DEFAULT false,
  has_private_elevator BOOLEAN DEFAULT false,
  has_disabled_access BOOLEAN DEFAULT false,
  has_solar_panels BOOLEAN DEFAULT false,
  
  -- Vues
  has_sea_view BOOLEAN DEFAULT false,
  has_mountain_view BOOLEAN DEFAULT false,
  has_city_view BOOLEAN DEFAULT false,
  has_garden_view BOOLEAN DEFAULT false,
  has_pool_view BOOLEAN DEFAULT false,
  view_type JSONB DEFAULT '[]',
  view_quality TEXT,
  
  -- Meublé
  is_furnished BOOLEAN DEFAULT false,
  furniture_package_value DECIMAL(10,2),
  
  -- Prix & Fiscalité
  price_excluding_vat DECIMAL(15,2) NOT NULL,
  vat_rate DECIMAL(5,2) DEFAULT 5.0,
  vat_amount DECIMAL(15,2),
  price_including_vat DECIMAL(15,2),
  price_per_sqm DECIMAL(10,2),
  original_price DECIMAL(15,2),
  current_price DECIMAL(15,2),
  discount_amount DECIMAL(10,2),
  discount_percentage DECIMAL(5,2),
  
  -- Golden Visa
  golden_visa_eligible BOOLEAN DEFAULT false,
  investment_type TEXT,
  minimum_investment_met BOOLEAN DEFAULT false,
  
  -- Commissions
  commission_rate DECIMAL(5,2) DEFAULT 5.0,
  commission_amount DECIMAL(10,2),
  referral_commission DECIMAL(10,2),
  referral_commission_rate DECIMAL(5,2),
  
  -- Financement
  payment_plan_available BOOLEAN DEFAULT false,
  payment_plan_details JSONB DEFAULT '[]',
  deposit_amount DECIMAL(10,2),
  deposit_percentage DECIMAL(5,2),
  finance_available BOOLEAN DEFAULT false,
  minimum_cash_required DECIMAL(10,2),
  
  -- Documents légaux
  title_deed_status TEXT,
  planning_permit_number TEXT,
  building_permit_number TEXT,
  occupancy_certificate TEXT,
  energy_certificate_number TEXT,
  energy_rating VARCHAR(2),
  cadastral_reference TEXT,
  title_deed_number TEXT,
  
  -- Charges
  annual_property_tax DECIMAL(10,2),
  communal_fees_monthly DECIMAL(10,2),
  maintenance_fee_monthly DECIMAL(10,2),
  estimated_utility_costs DECIMAL(10,2),
  
  -- Transfert
  transfer_fee_percentage DECIMAL(5,2),
  transfer_fee_amount DECIMAL(10,2),
  
  -- Médias
  photos JSONB DEFAULT '[]',
  plans JSONB DEFAULT '[]',
  floor_plan_urls JSONB DEFAULT '[]',
  floor_plan_3d_urls JSONB DEFAULT '[]',
  virtual_tour TEXT,
  
  -- Descriptions
  public_description TEXT,
  internal_notes TEXT,
  translations JSONB DEFAULT '{}',
  
  -- Métadonnées
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  
  CONSTRAINT unique_unit_per_building UNIQUE(building_id, unit_number)
);

-- Index pour performance
CREATE INDEX idx_properties_project ON properties(project_id);
CREATE INDEX idx_properties_building ON properties(building_id);
CREATE INDEX idx_properties_developer ON properties(developer_id);
CREATE INDEX idx_properties_status ON properties(property_status);
CREATE INDEX idx_properties_golden_visa ON properties(golden_visa_eligible);
CREATE INDEX idx_properties_price ON properties(price_excluding_vat);

-- 7. TRIGGERS CASCADE

-- FONCTION: Cascade commission_rate du developer
CREATE OR REPLACE FUNCTION cascade_developer_commission()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.commission_rate IS NULL THEN
    SELECT commission_rate INTO NEW.commission_rate
    FROM developers
    WHERE id = NEW.developer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_commission_rate_on_property
BEFORE INSERT ON properties
FOR EACH ROW
EXECUTE FUNCTION cascade_developer_commission();

-- FONCTION: Cascade vat_rate du project
CREATE OR REPLACE FUNCTION cascade_project_vat()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.vat_rate IS NULL THEN
    SELECT vat_rate INTO NEW.vat_rate
    FROM projects
    WHERE id = NEW.project_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_vat_rate_on_property
BEFORE INSERT ON properties
FOR EACH ROW
EXECUTE FUNCTION cascade_project_vat();

-- FONCTION: Cascade energy_rating du building
CREATE OR REPLACE FUNCTION cascade_building_energy()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.energy_rating IS NULL THEN
    SELECT energy_rating, energy_certificate
    INTO NEW.energy_rating, NEW.energy_certificate_number
    FROM buildings
    WHERE id = NEW.building_id;
  END IF;
  
  -- Cascade aussi les permis du project
  IF NEW.planning_permit_number IS NULL THEN
    SELECT planning_permit_number, building_permit_number, title_deed_available::TEXT
    INTO NEW.planning_permit_number, NEW.building_permit_number, NEW.title_deed_status
    FROM projects
    WHERE id = NEW.project_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_building_data_on_property
BEFORE INSERT ON properties
FOR EACH ROW
EXECUTE FUNCTION cascade_building_energy();

-- FONCTION: Calculs automatiques pour properties
CREATE OR REPLACE FUNCTION calculate_property_values()
RETURNS TRIGGER AS $$
BEGIN
  -- Calcul automatique TVA et prix TTC
  NEW.vat_amount = NEW.price_excluding_vat * COALESCE(NEW.vat_rate, 5.0) / 100;
  NEW.price_including_vat = NEW.price_excluding_vat + NEW.vat_amount;
  
  -- Calcul prix au m²
  IF NEW.internal_area > 0 THEN
    NEW.price_per_sqm = NEW.price_excluding_vat / NEW.internal_area;
  END IF;
  
  -- Golden Visa eligibility
  NEW.golden_visa_eligible = (NEW.price_including_vat >= 300000);
  NEW.minimum_investment_met = NEW.golden_visa_eligible;
  
  -- Commission
  IF NEW.commission_rate > 0 THEN
    NEW.commission_amount = NEW.price_excluding_vat * NEW.commission_rate / 100;
  END IF;
  
  -- Total rooms
  NEW.total_rooms = NEW.bedrooms_count + 
                    CASE WHEN NEW.has_office THEN 1 ELSE 0 END +
                    CASE WHEN NEW.has_maid_room THEN 1 ELSE 0 END +
                    CASE WHEN NEW.has_playroom THEN 1 ELSE 0 END +
                    CASE WHEN NEW.has_wine_cellar THEN 1 ELSE 0 END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_property_values_trigger
BEFORE INSERT OR UPDATE ON properties
FOR EACH ROW
EXECUTE FUNCTION calculate_property_values();

-- FONCTION: Mise à jour automatique des compteurs
CREATE OR REPLACE FUNCTION update_units_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- Update building counts
  IF TG_OP = 'DELETE' THEN
    UPDATE buildings b
    SET units_available = (
      SELECT COUNT(*) FROM properties 
      WHERE building_id = b.id AND property_status = 'available'
    ),
    total_units = (
      SELECT COUNT(*) FROM properties 
      WHERE building_id = b.id
    )
    WHERE b.id = OLD.building_id;
    
    -- Update project counts
    UPDATE projects p
    SET units_available = (
      SELECT COUNT(*) FROM properties 
      WHERE project_id = p.id AND property_status = 'available'
    ),
    units_sold = (
      SELECT COUNT(*) FROM properties 
      WHERE project_id = p.id AND property_status = 'sold'
    ),
    total_units = (
      SELECT COUNT(*) FROM properties 
      WHERE project_id = p.id
    ),
    price_from = (
      SELECT MIN(price_excluding_vat) FROM properties 
      WHERE project_id = p.id AND property_status = 'available'
    ),
    price_to = (
      SELECT MAX(price_excluding_vat) FROM properties 
      WHERE project_id = p.id
    )
    WHERE p.id = OLD.project_id;
    
    RETURN OLD;
  ELSE
    UPDATE buildings b
    SET units_available = (
      SELECT COUNT(*) FROM properties 
      WHERE building_id = b.id AND property_status = 'available'
    ),
    total_units = (
      SELECT COUNT(*) FROM properties 
      WHERE building_id = b.id
    )
    WHERE b.id = NEW.building_id;
    
    -- Update project counts
    UPDATE projects p
    SET units_available = (
      SELECT COUNT(*) FROM properties 
      WHERE project_id = p.id AND property_status = 'available'
    ),
    units_sold = (
      SELECT COUNT(*) FROM properties 
      WHERE project_id = p.id AND property_status = 'sold'
    ),
    total_units = (
      SELECT COUNT(*) FROM properties 
      WHERE project_id = p.id
    ),
    price_from = (
      SELECT MIN(price_excluding_vat) FROM properties 
      WHERE project_id = p.id AND property_status = 'available'
    ),
    price_to = (
      SELECT MAX(price_excluding_vat) FROM properties 
      WHERE project_id = p.id
    )
    WHERE p.id = NEW.project_id;
    
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_counts_on_property_change
AFTER INSERT OR UPDATE OR DELETE ON properties
FOR EACH ROW
EXECUTE FUNCTION update_units_counts();

-- FONCTION: Update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_developers_timestamp
BEFORE UPDATE ON developers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_timestamp
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buildings_timestamp
BEFORE UPDATE ON buildings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_timestamp
BEFORE UPDATE ON properties
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 8. ACTIVATION RLS
ALTER TABLE developers ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Policies basiques pour commencer
CREATE POLICY "Allow all for authenticated users" ON developers
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all for authenticated users" ON projects
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all for authenticated users" ON buildings
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all for authenticated users" ON properties
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies lecture publique pour l'affichage
CREATE POLICY "Allow public read access" ON developers
  FOR SELECT TO public
  USING (status = 'active');

CREATE POLICY "Allow public read access" ON projects
  FOR SELECT TO public
  USING (true);

CREATE POLICY "Allow public read access" ON buildings
  FOR SELECT TO public
  USING (true);

CREATE POLICY "Allow public read access" ON properties
  FOR SELECT TO public
  USING (property_status IN ('available', 'reserved'));