export interface Property {
  id: string;
  project_id: string;
  building_id: string;
  
  // Champs obligatoires
  property_code: string;
  unit_number: string;
  property_type: string;
  internal_area: number;
  price_excluding_vat: number;
  
  // Identification
  floor_number?: number;
  position_in_floor?: string;
  
  // Caractéristiques
  bedrooms_count?: number;
  bathrooms_count?: number;
  wc_count?: number;
  
  // Surfaces
  covered_verandas?: number;
  uncovered_verandas?: number;
  balcony_area?: number;
  terrace_area?: number;
  private_garden_area?: number;
  plot_area?: number;
  total_covered_area?: number;
  
  // Prix et TVA
  vat_rate?: number;
  vat_amount?: number;
  price_including_vat?: number;
  price_per_sqm?: number;
  
  // Statuts
  sale_status?: string;
  property_status?: string;
  availability_status?: string;
  
  // Features booléennes
  has_parking?: boolean;
  has_storage_unit?: boolean;
  has_balcony?: boolean;
  has_terrace?: boolean;
  has_private_garden?: boolean;
  has_private_pool?: boolean;
  has_sea_view?: boolean;
  has_mountain_view?: boolean;
  
  // Golden Visa
  golden_visa_eligible?: boolean;
  
  // Parking
  parking_spaces?: number;
  parking_type?: string;
  
  // Metadata
  created_at?: string;
  updated_at?: string;
}

export interface PropertyFormData {
  building_id: string;
  property_code: string;
  unit_number: string;
  property_type: string;
  floor_number?: number;
  bedrooms_count?: number;
  bathrooms_count?: number;
  internal_area: number;
  covered_verandas?: number;
  uncovered_verandas?: number;
  price_excluding_vat: number;
  vat_rate?: number;
  sale_status?: string;
  has_parking?: boolean;
  parking_spaces?: number;
  has_storage_unit?: boolean;
  has_balcony?: boolean;
  has_terrace?: boolean;
  has_private_garden?: boolean;
  has_private_pool?: boolean;
  has_sea_view?: boolean;
}