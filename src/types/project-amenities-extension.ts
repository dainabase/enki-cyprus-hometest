/**
 * Extension des types pour les champs d'amenities ajoutés à la table projects
 * Date: 2025-09-27
 * Étape 4/10 du refactoring buildings/projects
 * 
 * Ces champs ont été ajoutés à la table projects pour centraliser
 * les équipements au niveau du projet plutôt qu'au niveau building.
 */

/**
 * Extension de l'interface Project avec les nouveaux champs amenities
 * Ces champs correspondent aux colonnes ajoutées dans la migration add_amenities_to_projects
 */
export interface ProjectAmenitiesExtension {
  // Équipements de base (boolean)
  has_pool?: boolean | null;           // Piscine
  has_gym?: boolean | null;            // Salle de sport
  has_spa?: boolean | null;            // Spa
  has_playground?: boolean | null;     // Aire de jeux
  has_garden?: boolean | null;         // Jardin
  
  // Sécurité (boolean)
  has_security_system?: boolean | null;  // Système de sécurité
  has_cctv?: boolean | null;             // Vidéosurveillance
  has_concierge?: boolean | null;        // Conciergerie
  
  // Infrastructure (boolean)
  has_generator?: boolean | null;      // Générateur
  has_solar_panels?: boolean | null;   // Panneaux solaires
  has_parking?: boolean | null;        // Parking disponible
  
  // Type de parking (text)
  parking_type?: string | null;        // Type de parking (covered, underground, etc.)
  
  // Objets JSONB pour des détails complexes
  security_features?: any | null;      // Caractéristiques de sécurité détaillées
  wellness_facilities?: any | null;    // Installations de bien-être détaillées
  outdoor_facilities?: any | null;     // Installations extérieures détaillées
}

/**
 * Type complet d'un projet avec les extensions d'amenities
 * À utiliser pour les formulaires et affichages
 */
export type ProjectWithAmenities = {
  id: string;
  developer_id?: string | null;
  title: string;
  description?: string | null;
  status?: string | null;
  cyprus_zone?: string | null;
  city?: string | null;
  // ... autres champs existants ...
} & ProjectAmenitiesExtension;

/**
 * Type pour le formulaire de projet avec amenities
 * Utilisé pour la création et modification
 */
export interface ProjectFormDataWithAmenities {
  // Champs de base du projet
  title: string;
  description?: string;
  developer_id?: string;
  status?: string;
  cyprus_zone?: string;
  city?: string;
  
  // Nouveaux champs amenities
  has_pool?: boolean;
  has_gym?: boolean;
  has_spa?: boolean;
  has_playground?: boolean;
  has_garden?: boolean;
  has_security_system?: boolean;
  has_cctv?: boolean;
  has_concierge?: boolean;
  has_generator?: boolean;
  has_solar_panels?: boolean;
  has_parking?: boolean;
  parking_type?: string;
  security_features?: {
    access_control?: boolean;
    guard_24_7?: boolean;
    gated_community?: boolean;
    alarm_system?: boolean;
    [key: string]: any;
  };
  wellness_facilities?: {
    sauna?: boolean;
    steam_room?: boolean;
    jacuzzi?: boolean;
    massage_room?: boolean;
    [key: string]: any;
  };
  outdoor_facilities?: {
    bbq_area?: boolean;
    tennis_court?: boolean;
    basketball_court?: boolean;
    running_track?: boolean;
    [key: string]: any;
  };
}

/**
 * Valeurs par défaut pour les nouveaux champs amenities
 */
export const defaultProjectAmenities: ProjectAmenitiesExtension = {
  has_pool: false,
  has_gym: false,
  has_spa: false,
  has_playground: false,
  has_garden: false,
  has_security_system: false,
  has_cctv: false,
  has_concierge: false,
  has_generator: false,
  has_solar_panels: false,
  has_parking: false,
  parking_type: null,
  security_features: {},
  wellness_facilities: {},
  outdoor_facilities: {}
};

/**
 * Helper pour vérifier si un projet a des amenities premium
 */
export const hasPremiumAmenities = (project: ProjectAmenitiesExtension): boolean => {
  return !!(
    project.has_spa ||
    project.has_concierge ||
    project.has_gym ||
    project.has_pool
  );
};

/**
 * Helper pour compter le nombre total d'amenities
 */
export const countProjectAmenities = (project: ProjectAmenitiesExtension): number => {
  const booleanAmenities = [
    project.has_pool,
    project.has_gym,
    project.has_spa,
    project.has_playground,
    project.has_garden,
    project.has_security_system,
    project.has_cctv,
    project.has_concierge,
    project.has_generator,
    project.has_solar_panels,
    project.has_parking
  ];
  
  return booleanAmenities.filter(Boolean).length;
};

/**
 * Mapping des labels pour affichage
 */
export const amenityLabels: Record<keyof ProjectAmenitiesExtension, string> = {
  has_pool: 'Swimming Pool',
  has_gym: 'Gym / Fitness Center',
  has_spa: 'Spa & Wellness',
  has_playground: 'Children\'s Playground',
  has_garden: 'Garden / Green Spaces',
  has_security_system: 'Security System',
  has_cctv: 'CCTV Surveillance',
  has_concierge: 'Concierge Service',
  has_generator: 'Backup Generator',
  has_solar_panels: 'Solar Panels',
  has_parking: 'Parking Available',
  parking_type: 'Parking Type',
  security_features: 'Security Features',
  wellness_facilities: 'Wellness Facilities',
  outdoor_facilities: 'Outdoor Facilities'
};

/**
 * Catégories d'amenities pour regroupement dans l'UI
 */
export const amenityCategories = {
  wellness: ['has_pool', 'has_gym', 'has_spa'],
  family: ['has_playground', 'has_garden'],
  security: ['has_security_system', 'has_cctv', 'has_concierge'],
  infrastructure: ['has_generator', 'has_solar_panels', 'has_parking']
} as const;

/**
 * Type guard pour vérifier si un objet a les champs amenities
 */
export function hasAmenityFields(obj: any): obj is ProjectAmenitiesExtension {
  return typeof obj === 'object' && obj !== null && (
    'has_pool' in obj ||
    'has_gym' in obj ||
    'has_spa' in obj ||
    'has_playground' in obj ||
    'has_garden' in obj
  );
}
