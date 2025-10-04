/**
 * TypeScript Types for Mock Data Enrichment
 * Auto-generated types for enriched project data
 */

// ============================================
// SECTION 5 - UNIT TYPES
// ============================================

export interface UnitType {
  id: string;
  type: 'Apartment' | 'Penthouse' | 'Villa' | 'Townhouse' | 'Studio';
  name: string;
  bedrooms: number;
  bathrooms: number;
  
  // Floor Plans (MOCK added)
  floorPlan2D: string;
  floorPlan3D: string;
  floorPlanThumbnail: string;
  
  // Surfaces
  internalArea: number;
  coveredVerandas: number;
  uncoveredVerandas: number;
  surfaceTotal: number; // MOCK calculated
  
  // Pricing
  priceFrom: number;
  priceTo: number;
  pricePerSqm: number;
  
  // Availability (MOCK)
  totalUnits: number;
  availableCount: number;
  soldCount: number;
  reservedCount: number;
  status: 'Disponible' | 'Réservé' | 'Vendu';
  
  // Features
  orientation: string;
  parkingSpaces: number;
  storageRoom: boolean;
  features: string[];
}

// ============================================
// SECTION 7 - INVESTMENT & FINANCING
// ============================================

export interface GoldenVisaDetails {
  minimumInvestment: number;
  eligible: boolean;
  benefits: string[];
  requirements: string[];
  processingTime: string;
  applicationFee: number;
}

export interface TaxBenefit {
  type: string;
  description: string;
  savingEstimate: number; // percentage
}

export interface Investment {
  rentalYield: number;
  goldenVisa: boolean;
  rentalPriceMonthly: number; // MOCK
  appreciationHistorical: number; // MOCK
  goldenVisaDetails: GoldenVisaDetails; // MOCK
  taxBenefits: TaxBenefit[]; // MOCK
}

export interface BankPartner {
  name: string;
  logo: string;
  maxLTV: number;
  interestRate: number;
  termYears: number;
  description: string;
}

export interface PaymentStage {
  stage: string;
  percentage: number;
  amount: number;
  timing: string;
  description: string;
}

export interface Financing {
  partners: BankPartner[]; // MOCK
  aidsPTZ: boolean;
  paymentPlan: PaymentStage[]; // MOCK
  downPaymentMin: number;
  flexiblePayment: boolean;
  description: string;
}

export interface PriceFees {
  vat: number;
  transfer: number; // MOCK
  notary: number; // MOCK
  legal: number; // MOCK
  stamp: number; // MOCK
}

export interface TotalFeesEstimate {
  percentage: number;
  amount: number;
  breakdown: string;
}

export interface PriceWithFees {
  fees: PriceFees;
  totalFeesEstimate: TotalFeesEstimate;
}

// ============================================
// SECTION 10 - SOCIAL PROOF
// ============================================

export interface Testimonial {
  id: number;
  name: string;
  nationality: string;
  flag: string;
  photo: string;
  videoUrl?: string; // MOCK - CRITICAL
  videoThumbnail?: string;
  text: string;
  rating: 1 | 2 | 3 | 4 | 5;
  date: string;
  propertyType: string;
  location: string;
  verified: boolean;
}

export interface DeveloperStats {
  revenue: number; // MOCK
  employees: number; // MOCK
  projectsDelivered: number;
  familiesSatisfied: number; // MOCK
  unitsBuilt: number; // MOCK
  yearsFounded: number;
  satisfactionRate: number; // MOCK
}

export interface Award {
  name: string;
  year: number;
  category: string;
  image: string;
  description: string;
}

export interface PressArticle {
  mediaName: string;
  logo: string;
  articleUrl: string;
  title: string;
  date: string;
  excerpt: string;
}

export interface DeveloperEnriched {
  stats: DeveloperStats; // MOCK
  awards: Award[]; // MOCK
  press: PressArticle[]; // MOCK
}

// ============================================
// SECTION 4 - ARCHITECTURE
// ============================================

export interface Architecture {
  style: string;
  architect: string;
  architectLicense: string;
  description: string;
  designPrinciples: string[];
  renders3D: string[];
}

// ============================================
// SECTION 6 - LIFESTYLE
// ============================================

export interface Lifestyle {
  communityVibe: string;
  targetAudience: string;
  dailyLife: string[];
}

// ============================================
// SECTION 8 - SPECIFICATIONS
// ============================================

export interface KitchenSpec {
  brand: string;
  countertop: string;
  appliances: string[];
  finishLevel: string;
}

export interface BathroomSpec {
  brand: string;
  fixtures: string;
  features: string[];
}

export interface FlooringSpec {
  living: string;
  bedrooms: string;
  bathrooms: string;
}

export interface WindowsSpec {
  type: string;
  features: string[];
}

export interface HVACSpec {
  type: string;
  heating: string;
  control: string;
}

export interface SecuritySpec {
  door: string;
  intercom: string;
  alarm: string;
  cctv: string;
}

export interface Specifications {
  kitchen: KitchenSpec;
  bathrooms: BathroomSpec;
  flooring: FlooringSpec;
  windows: WindowsSpec;
  hvac: HVACSpec;
  security: SecuritySpec;
}

// ============================================
// SECTION 9 - TIMELINE
// ============================================

export interface ConstructionPhase {
  name: string;
  status: 'upcoming' | 'in_progress' | 'completed';
  startDate: string;
  endDate: string;
  completion: number;
  milestones: string[];
}

export interface NextMilestone {
  description: string;
  date: string;
  daysRemaining: number;
}

export interface PhotoUpdate {
  date: string;
  url: string;
  description: string;
}

export interface Timeline {
  phases: ConstructionPhase[];
  overallCompletion: number;
  onSchedule: boolean;
  nextMilestone: NextMilestone;
  photoUpdates: PhotoUpdate[];
}

// ============================================
// ENRICHED PROJECT - MAIN TYPE
// ============================================

export interface EnrichedProjectMetadata {
  lastEnriched: string;
  enrichmentVersion: string;
  mockDataSections: string[];
}

export interface EnrichedProject {
  // Base project fields (from Supabase)
  id: string;
  title: string;
  subtitle?: string;
  city: string;
  developer_id?: string;
  price_from?: number;
  price_to?: number;
  [key: string]: any; // Other base fields
  
  // MOCK ENRICHED SECTIONS
  unitTypes: UnitType[];
  investment: Investment;
  financing: Financing;
  price: PriceWithFees;
  testimonials: Testimonial[];
  developer: DeveloperEnriched;
  architecture: Architecture;
  lifestyle: Lifestyle;
  specifications: Specifications;
  timeline: Timeline;
  
  // Metadata
  meta: EnrichedProjectMetadata;
}

// ============================================
// HELPER TYPES
// ============================================

export type MockDataSection = 
  | 'unitTypes'
  | 'investment'
  | 'financing'
  | 'testimonials'
  | 'developer.stats'
  | 'developer.awards'
  | 'developer.press'
  | 'architecture'
  | 'lifestyle'
  | 'specifications'
  | 'timeline';

export interface MockHelpers {
  isMockData: (project: EnrichedProject) => boolean;
  logMockWarning: (project: EnrichedProject) => void;
}

// ============================================
// FUNCTION SIGNATURES
// ============================================

export type EnrichProjectDataFn = (baseProject: any) => EnrichedProject;
export type EnrichProjectDataMinimalFn = (baseProject: any) => Partial<EnrichedProject>;