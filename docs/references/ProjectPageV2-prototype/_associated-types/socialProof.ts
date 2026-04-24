export interface Testimonial {
  id: string;
  project_id: string;
  developer_id: string | null;
  client_name: string;
  client_title: string | null;
  client_location: string | null;
  client_photo_url: string | null;
  testimonial_text: string;
  rating: number;
  video_url: string | null;
  video_thumbnail_url: string | null;
  purchase_type: string | null;
  purchase_date: string | null;
  unit_type: string | null;
  featured: boolean;
  display_order: number;
  is_verified: boolean;
}

export interface Award {
  id: string;
  developer_id: string;
  project_id: string | null;
  award_name: string;
  award_category: string | null;
  issuing_organization: string;
  award_date: string;
  description: string | null;
  award_level: string | null;
  certificate_url: string | null;
  award_logo_url: string | null;
  featured: boolean;
  display_order: number;
}

export interface PressMention {
  id: string;
  developer_id: string;
  project_id: string | null;
  publication_name: string;
  publication_logo_url: string | null;
  publication_type: string | null;
  article_title: string;
  article_url: string | null;
  article_excerpt: string | null;
  author_name: string | null;
  published_date: string;
  article_category: string | null;
  featured: boolean;
  display_order: number;
  sentiment: string | null;
}

export interface Certification {
  name: string;
  organization: string;
  year: number;
  logo_url?: string;
}

export interface DeveloperStats {
  revenue_annual: number | null;
  employees_count: number | null;
  families_satisfied: number | null;
  units_delivered: number | null;
  years_experience: number | null;
  projects_completed: number | null;
  certifications: Certification[] | null;
  accreditations: Certification[] | null;
  average_customer_rating: number | null;
  total_reviews: number | null;
  repeat_customer_rate: number | null;
}

export interface ProjectSocialProof {
  testimonials: Testimonial[];
  awards: Award[];
  press_mentions: PressMention[];
  developer_stats: DeveloperStats | null;
}
