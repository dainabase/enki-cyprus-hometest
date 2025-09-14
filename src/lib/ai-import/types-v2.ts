// Types pour le nouveau système d'extraction V2.0
export interface ExtractedDeveloper {
  name: string;
  phone: string;
  email: string;
  website: string;
}

export interface ExtractedProject {
  name: string;
  location: string;
  total_units: number;
  status: string;
}

export interface ExtractedBuilding {
  name: string;
  floors: number;
  units: number;
}

export interface ExtractedProperty {
  unit_number: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  size_m2: number;
  price: number;
}

export interface ExtractionStep {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  data?: any;
  error?: string;
}

export interface DocumentUpload {
  file: File;
  url: string;
  status: 'uploaded' | 'processing' | 'completed' | 'error';
}