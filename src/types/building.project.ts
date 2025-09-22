export interface ProjectBuilding {
  id?: string;
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
  has_cctv?: boolean;
  has_concierge?: boolean;
  has_pool?: boolean;
  has_gym?: boolean;
  has_spa?: boolean;
  has_playground?: boolean;
  has_garden?: boolean;
  has_parking?: boolean;
  parking_type?: 'underground' | 'outdoor' | 'covered';
  display_order?: number;
}

// Champs qui appartiennent au niveau PROPRIÉTÉ (à retirer du formulaire projet)
export interface PropertyLevelFields {
  // Ces champs ne doivent PAS être dans le formulaire projet
  suite_parentale: boolean;
  loggia: boolean;
  veranda: boolean;
  bibliotheque: boolean;
  cave: boolean;
  garage_individuel: boolean;
  jardin_prive: boolean;
  terrasse_privee: boolean;
  balcon_prive: boolean;
}

// Champs qui restent au niveau PROJET (communs à tout le projet)
export interface ProjectLevelFields {
  // Commodités communes du projet
  piscine_commune: boolean;
  parking_visiteurs: boolean;
  espace_vert_commun: boolean;
  hall_accueil: boolean;
  
  // Avantages de localisation
  proximite_plage: boolean;
  proximite_commerces: boolean;
  proximite_ecoles: boolean;
  proximite_transport: boolean;
  
  // Sécurité commune
  gardien_24h: boolean;
  acces_securise: boolean;
  cameras_surveillance: boolean;
}