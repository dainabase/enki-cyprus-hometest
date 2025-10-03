export interface Project {
  id: string;
  title: string;
  description?: string;
  location: string | ProjectLocation;
  type?: string;
  price_from?: number;
  price_to?: number;
  status?: 'planning' | 'construction' | 'completed' | 'delivered';
  completion_date?: string;
  total_units?: number;
  available_units?: number;
  developer_id?: string;
  created_at?: string;
  updated_at?: string;
  project_images?: ProjectImage[];
  buildings?: any[];
  amenities?: string[];
  nearby_amenities?: NearbyAmenity[];
  features?: string[];
  hero_image?: string;
  gallery_images?: string[];
  virtual_tour_url?: string;
  floor_plans?: string[];
  documents?: ProjectDocument[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  city?: string;
  district?: string;
  address?: string;
  website_url?: string;
  contact_email?: string;
  contact_phone?: string;
}

export interface ProjectLocation {
  city?: string;
  name?: string;
  district?: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface ProjectImage {
  url: string;
  caption?: string;
  is_primary?: boolean;
  display_order?: number;
  category?: 'hero' | 'gallery' | 'amenities' | 'exterior' | 'interior' | 'floor_plan';
}

export interface ProjectDocument {
  id?: string;
  name: string;
  url: string;
  type: 'brochure' | 'floor_plan' | 'technical' | 'legal' | 'other';
  size?: number;
  uploaded_at?: string;
}

export interface NearbyAmenity {
  name: string;
  type: string;
  distance?: number;
  distance_unit?: 'meters' | 'km';
}

export interface ProjectInterest {
  name: string;
  link: string;
  desc: string;
}

export interface Developer {
  id: string;
  name: string;
  logo_url?: string;
  description?: string;
  website?: string;
  founded_year?: number;
  total_projects?: number;
  contact_email?: string;
  contact_phone?: string;
}
