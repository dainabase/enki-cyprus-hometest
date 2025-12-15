import type React from 'react';

export interface Project {
  // Identification
  id: string;
  title: string;
  description?: string;
  url_slug?: string;
  tagline?: string;

  // Location
  location: string | ProjectLocation;
  type?: string;
  city?: string;
  district?: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  latitude?: number;
  longitude?: number;
  proximity_sea_km?: number;

  // Pricing
  price_from?: number;
  price_to?: number;
  currency?: string;
  price?: number; // Legacy field for backward compatibility
  detailed_description?: string; // Legacy field for backward compatibility

  // Status & Dates
  status?: 'planning' | 'construction' | 'completed' | 'delivered' | 'active' | 'inactive' | 'sold_out' | 'coming_soon';
  completion_date?: string;
  expected_completion?: string;
  construction_year?: number;

  // Units
  total_units?: number;
  available_units?: number;
  units_sold?: number;

  // Developer
  developer_id?: string;
  developer?: Developer;

  // Features
  property_type?: string;
  unique_selling_points?: string[] | string;
  amenities?: string[];
  nearby_amenities?: NearbyAmenity[];
  features?: string[];

  // Amenities (boolean flags)
  swimming_pool?: boolean;
  gym?: boolean;
  parking?: boolean;
  garden?: boolean;
  sea_view?: boolean;

  // Investment
  roi_annual?: number;
  rental_guarantee?: boolean;
  golden_visa_eligible?: boolean;

  // Certifications
  energy_certificate?: string;

  // Media
  project_images?: ProjectImage[];
  hero_image?: string;
  gallery_images?: string[];
  photos?: Array<{ url: string }>;
  photo_gallery_urls?: string[];
  virtual_tour_url?: string;
  floor_plans?: string[];
  documents?: ProjectDocument[];

  // Relations
  buildings?: Building[] | { count: number };

  // Metadata
  created_at?: string;
  updated_at?: string;
  featured?: boolean;
  is_new?: boolean;
  views?: number;

  // Contact
  website_url?: string;
  contact_email?: string;
  contact_phone?: string;

  // SEO
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
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
  logo?: string;
  logo_url?: string;
  description?: string;
  website?: string;
  founded_year?: number;
  total_projects?: number;
  contact_email?: string;
  contact_phone?: string;
  email?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

// Building interface
export interface Building {
  id: string;
  project_id: string;
  name: string;
  total_units?: number;
  units_sold?: number;
  floors?: number;
  created_at?: string;
  count?: number;
}

// Category Types
export type CategoryType =
  | 'all'
  | 'featured'
  | 'residence'
  | 'villas'
  | 'apartments'
  | 'new'
  | 'ready';

export interface Category {
  id: CategoryType;
  label: string;
  count?: number;
}

// Testimonial
export interface Testimonial {
  id: string;
  name: string;
  nationality: string;
  propertyType: string;
  rating: number;
  quote: string;
  avatar?: string;
  video_url?: string;
  project_id?: string;
  is_featured?: boolean;
  created_at?: string;
}

// Statistic
export interface Statistic {
  icon: React.ElementType;
  label: string;
  value: string;
}

// Benefit
export interface Benefit {
  icon: React.ElementType;
  title: string;
  description: string;
  highlight: string;
}

// Filters
export interface ProjectFilters {
  priceMin?: number;
  priceMax?: number;
  bedrooms?: number[];
  propertyTypes?: string[];
  amenities?: string[];
  distanceToBeach?: number;
  goldenVisaEligible?: boolean;
  featured?: boolean;
}

// Sort Options
export type SortOption = 'date' | 'price-asc' | 'price-desc' | 'popularity' | 'distance' | 'roi';

// Component Props
export interface ProjectCardProps {
  project: Project;
  index?: number;
  onToggleFavorite?: (id: string) => void;
  isFavorite?: boolean;
}

export interface FeaturedProjectCardProps {
  project: Project;
  index?: number;
}

export interface CategoryNavProps {
  categories: Category[];
  activeCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
}

export interface TestimonialCardProps {
  testimonial: Testimonial;
  index?: number;
}
