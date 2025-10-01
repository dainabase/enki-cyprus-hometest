export interface Building {
  id: string;
  project_id: string;
  building_name: string;
  building_type: 'apartment_building' | 'villa_complex' | 'mixed_residence' | 'residential';
  building_code?: string;
  total_floors?: number;
  total_units?: number;
  units_available?: number;
  construction_status: 'planned' | 'construction' | 'delivered';
  expected_completion?: string;
  actual_completion?: string;
  building_class?: 'A+' | 'A' | 'B' | 'C';
  energy_certificate?: string;
  elevator_count?: number;
  has_generator?: boolean;
  has_security_system?: boolean;
  has_security_24_7?: boolean;
  has_cctv?: boolean;
  has_concierge?: boolean;
  has_pool?: boolean;
  has_gym?: boolean;
  has_spa?: boolean;
  has_playground?: boolean;
  has_garden?: boolean;
  has_parking?: boolean;
  parking_type?: 'underground' | 'outdoor' | 'covered';
  
  // Additional technical fields
  has_elevator?: boolean;
  has_solar_panels?: boolean;
  energy_rating?: string;
  central_vacuum_system?: boolean;
  water_softener_system?: boolean;
  water_purification_system?: boolean;
  smart_building_system?: boolean;
  intercom_system?: boolean;
  has_intercom?: boolean;
  
  // Services & Commerce
  restaurant?: boolean;
  cafe?: boolean;
  mini_market?: boolean;
  business_center?: boolean;
  kids_club?: boolean;
  coworking_space?: boolean;
  club_house?: boolean;
  has_tennis_court?: boolean;
  beach_access?: boolean;
  marina_access?: boolean;
  golf_course?: boolean;
  sports_facilities?: boolean;
  wellness_center?: boolean;
  has_security_door?: boolean;
  concierge_service?: boolean;
  package_room?: boolean;
  bike_storage?: boolean;
  pet_washing_station?: boolean;
  car_wash_area?: boolean;
  shuttle_service?: boolean;

  // Accessibility
  wheelchair_accessible?: boolean;
  braille_signage?: boolean;
  audio_assistance?: boolean;
  accessible_bathrooms?: number;
  disabled_parking_spaces?: number;
  ramp_access?: boolean;
  wide_doorways?: boolean;
  accessible_elevator?: boolean;

  // Floor plan URLs
  typical_floor_plan_url?: string;
  model_3d_url?: string;
  building_brochure_url?: string;

  // JSONB fields
  floor_plans?: any;
  building_amenities?: any;
  common_areas?: any;
  security_features?: any;
  wellness_facilities?: any;
  infrastructure?: any;
  outdoor_facilities?: any;

  // === NOUVEAUX CHAMPS CRITIQUES ===
  
  // 1️⃣ STRUCTURE & DIMENSIONS
  surface_totale_batiment?: number;
  hauteur_batiment?: number;
  nombre_logements_type?: {
    studios?: number;
    t2?: number;
    t3?: number;
    t4?: number;
    t5?: number;
    penthouse?: number;
    duplex?: number;
    [key: string]: number | undefined;
  };

  // 2️⃣ POSITIONNEMENT & ORIENTATION  
  position_dans_projet?: string;
  orientation_principale?: string;
  vues_principales?: string[];

  // 3️⃣ PARKINGS DÉTAILLÉS
  nombre_places_parking?: number;
  parking_visiteurs?: number;

  // 4️⃣ COMMERCIALISATION
  prix_moyen_m2?: number;
  fourchette_prix_min?: number;
  fourchette_prix_max?: number;
  taux_occupation?: number;
  date_mise_en_vente?: string;

  // 5️⃣ RÉPARTITION PAR ÉTAGE
  configuration_etages?: {
    [etage: string]: {
      [type: string]: number;
    };
  };

  // 7️⃣ ASPECTS TECHNIQUES
  type_chauffage?: string;
  type_climatisation?: string;
  annee_construction?: number;
  annee_renovation?: number;
  norme_construction?: string;

  // 8️⃣ LOCAUX ANNEXES
  nombre_caves?: number;
  surface_caves?: number;
  local_velos?: boolean;
  local_poussettes?: boolean;
  nombre_box_fermes?: number;

  // 9️⃣ CHARGES & COPROPRIÉTÉ
  nombre_lots?: number;

  // Relations
  project?: any;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  display_order?: number;
}

export interface BuildingFormData {
  // Section de base
  project_id: string;
  building_name: string;
  building_type: 'apartment_building' | 'villa_complex' | 'mixed_residence' | 'residential' | 'commercial' | 'mixed' | 'office' | 'hotel';
  building_code?: string;
  display_order?: number;
  building_class: 'A+' | 'A' | 'B' | 'C';

  // Section structure
  total_floors: number;
  total_units: number;
  units_available: number;
  construction_status: 'planning' | 'approved' | 'construction' | 'completed' | 'delivered' | 'planned';
  expected_completion?: string;
  actual_completion?: string;
  energy_certificate: 'A+' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  energy_rating?: string;
  elevator_count: number;
  has_elevator: boolean;

  // Section infrastructure
  has_generator: boolean;
  has_solar_panels: boolean;
  central_vacuum_system: boolean;
  water_softener_system: boolean;
  water_purification_system: boolean;
  smart_building_system: boolean;
  intercom_system?: boolean;
  has_intercom: boolean;
  package_room: boolean;
  bike_storage?: boolean;
  pet_washing_station: boolean;
  car_wash_area: boolean;

  // Section sécurité
  has_security_system: boolean;
  has_security_24_7: boolean;
  has_cctv: boolean;
  has_concierge?: boolean;
  has_security_door: boolean;
  concierge_service: boolean;

  // Section équipements
  has_pool: boolean;
  has_gym: boolean;
  has_spa: boolean;
  has_playground: boolean;
  has_garden: boolean;
  has_parking: boolean;
  parking_type: 'underground' | 'covered' | 'outdoor' | 'mixed';
  disabled_parking_spaces: number;
  shuttle_service: boolean;

  // Section services
  restaurant: boolean;
  cafe: boolean;
  mini_market: boolean;
  business_center: boolean;
  kids_club: boolean;
  coworking_space: boolean;
  club_house: boolean;

  // Section accessibilité
  wheelchair_accessible: boolean;
  braille_signage: boolean;
  audio_assistance: boolean;
  accessible_bathrooms: number;
  ramp_access: boolean;
  wide_doorways: boolean;
  accessible_elevator: boolean;

  // Section loisirs
  has_tennis_court: boolean;
  beach_access: boolean;
  marina_access: boolean;
  golf_course: boolean;
  sports_facilities: boolean;
  wellness_center: boolean;

  // Section documents
  typical_floor_plan_url?: string;
  model_3d_url?: string;
  building_brochure_url?: string;

  // Section avancée (JSONB)
  building_amenities: any;
  common_areas: any;
  security_features: any;
  wellness_facilities: any;
  infrastructure: any;
  outdoor_facilities: any;
  floor_plans: any;

  // === NOUVEAUX CHAMPS CRITIQUES ===
  
  // 1️⃣ STRUCTURE & DIMENSIONS
  surface_totale_batiment?: number;
  hauteur_batiment?: number;
  nombre_logements_type?: {
    studios?: number;
    t2?: number;
    t3?: number;
    t4?: number;
    t5?: number;
    penthouse?: number;
    duplex?: number;
    [key: string]: number | undefined;
  };

  // 2️⃣ POSITIONNEMENT & ORIENTATION
  position_dans_projet?: string;
  orientation_principale?: string;
  vues_principales?: string[];

  // 3️⃣ PARKINGS DÉTAILLÉS
  nombre_places_parking?: number;
  parking_visiteurs?: number;

  // 4️⃣ COMMERCIALISATION
  prix_moyen_m2?: number;
  fourchette_prix_min?: number;
  fourchette_prix_max?: number;
  taux_occupation?: number;
  date_mise_en_vente?: string;

  // 5️⃣ RÉPARTITION PAR ÉTAGE
  configuration_etages?: {
    [etage: string]: {
      [type: string]: number;
    };
  };

  // 7️⃣ ASPECTS TECHNIQUES
  type_chauffage?: string;
  type_climatisation?: string;
  annee_construction?: number;
  annee_renovation?: number;
  norme_construction?: string;

  // 8️⃣ LOCAUX ANNEXES
  nombre_caves?: number;
  surface_caves?: number;
  local_velos?: boolean;
  local_poussettes?: boolean;
  nombre_box_fermes?: number;

  // 9️⃣ CHARGES & COPROPRIÉTÉ
  nombre_lots?: number;
}