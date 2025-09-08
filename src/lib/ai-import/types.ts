export interface AIImportDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
  uploadUrl?: string;
  status: 'pending' | 'uploading' | 'uploaded' | 'error';
  error?: string;
}

export interface AIImportSession {
  id: string;
  documents: AIImportDocument[];
  status: 'uploading' | 'analyzing' | 'ready' | 'completed' | 'error';
  rawExtraction?: any;
  mappedData?: any;
  errorMessage?: string;
}

export interface ExtractedFieldData {
  value: any;
  confidence: number;
  source: string;
  documentName: string;
}

export interface PrefilledFormData {
  [fieldName: string]: ExtractedFieldData;
}

export const DOCUMENT_TYPES = {
  descriptif: 'Descriptif',
  legal: 'Légal',
  mandat: 'Mandat',
  autre: 'Autre'
} as const;

export type DocumentType = keyof typeof DOCUMENT_TYPES;