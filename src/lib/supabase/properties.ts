import { supabase } from '@/integrations/supabase/client';

export interface PropertyFilters {
  projectId?: string;
  buildingId?: string;
  status?: string;
  goldenVisaOnly?: boolean;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface PropertyFormData {
  project_id: string;
  building_id?: string;
  unit_code: string;
  property_type: string;
  floor_number?: number;
  bedrooms?: number;
  bathrooms?: number;
  internal_area_m2?: number;
  price?: number;
  status: string;
  view_type?: string;
  furniture_status?: string;
  title_deed_status?: string;
  [key: string]: any;
}

// Fetch properties by building
export async function getPropertiesByBuilding(buildingId: string) {
  const { data, error } = await supabase
    .from('properties_final')
    .select(`
      *,
      project:projects_clean(title, city),
      building:buildings_enhanced(building_code, building_type)
    `)
    .eq('building_id', buildingId)
    .order('unit_code');

  if (error) throw error;
  return data;
}

// Fetch properties by project
export async function getPropertiesByProject(projectId: string) {
  const { data, error } = await supabase
    .from('properties_final')
    .select(`
      *,
      project:projects_clean(title, city),
      building:buildings_enhanced(building_code, building_type)
    `)
    .eq('project_id', projectId)
    .order('unit_code');

  if (error) throw error;
  return data;
}

// Fetch all properties with filters
export async function fetchProperties(filters: PropertyFilters = {}) {
  let query = supabase
    .from('properties_final')
    .select(`
      *,
      project:projects_clean(title, city, zone),
      building:buildings_enhanced(building_code, building_type)
    `)
    .order('project_id', { ascending: true })
    .order('unit_code', { ascending: true });

  // Apply filters
  if (filters.projectId) {
    query = query.eq('project_id', filters.projectId);
  }
  if (filters.buildingId) {
    query = query.eq('building_id', filters.buildingId);
  }
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  if (filters.propertyType) {
    query = query.eq('property_type', filters.propertyType);
  }
  if (filters.goldenVisaOnly) {
    query = query.eq('golden_visa_eligible', true);
  }
  if (filters.minPrice) {
    query = query.gte('price', filters.minPrice);
  }
  if (filters.maxPrice) {
    query = query.lte('price', filters.maxPrice);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// Create new property
export async function createProperty(data: PropertyFormData) {
  const { data: property, error } = await supabase
    .from('properties_final')
    .insert(data)
    .select(`
      *,
      project:projects_clean(title, city),
      building:buildings_enhanced(building_code, building_type)
    `)
    .single();

  if (error) throw error;
  return property;
}

// Update existing property
export async function updateProperty(id: string, data: Partial<PropertyFormData>) {
  const { data: property, error } = await supabase
    .from('properties_final')
    .update(data)
    .eq('id', id)
    .select(`
      *,
      project:projects_clean(title, city),
      building:buildings_enhanced(building_code, building_type)
    `)
    .single();

  if (error) throw error;
  return property;
}

// Delete property
export async function deleteProperty(id: string) {
  const { error } = await supabase
    .from('properties_final')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Get Golden Visa eligible properties
export async function getGoldenVisaProperties() {
  const { data, error } = await supabase
    .from('properties_final')
    .select(`
      *,
      project:projects_clean(title, city),
      building:buildings_enhanced(building_code)
    `)
    .eq('golden_visa_eligible', true)
    .eq('status', 'available')
    .order('price', { ascending: false });

  if (error) throw error;
  return data;
}

// Calculate property statistics
export const calculatePropertyStats = (properties: any[]) => {
  return {
    total: properties.length,
    available: properties.filter(p => p.status === 'available').length,
    reserved: properties.filter(p => p.status === 'reserved').length,
    sold: properties.filter(p => p.status === 'sold').length,
    goldenVisa: properties.filter(p => p.golden_visa_eligible).length,
    averagePrice: properties.length > 0 
      ? Math.round(properties.reduce((sum, p) => sum + (p.price || 0), 0) / properties.length)
      : 0,
    totalValue: properties.reduce((sum, p) => sum + (p.price || 0), 0)
  };
};

// Fetch projects for dropdowns
export const fetchProjectsForProperties = async () => {
  const { data, error } = await supabase
    .from('projects_clean')
    .select('id, title, zone')
    .order('title');
  
  if (error) throw error;
  return data;
};

// Fetch buildings for dropdowns
export const fetchBuildingsForProperties = async (projectId?: string) => {
  let query = supabase
    .from('buildings_enhanced')
    .select('id, building_code, building_type, project_id')
    .order('building_code');

  if (projectId) {
    query = query.eq('project_id', projectId);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
};