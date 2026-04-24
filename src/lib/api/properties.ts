import { supabase } from '@/integrations/supabase/client';
import { Property, PropertyFormData } from '@/types/property';
import { logger } from '@/lib/logger';

export const fetchPropertiesByProject = async (projectId: string): Promise<Property[]> => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('project_id', projectId)
    .order('building_id')
    .order('floor_number')
    .order('unit_number');

  if (error) throw error;
  return data || [];
};

export const fetchPropertiesByBuilding = async (buildingId: string): Promise<Property[]> => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('building_id', buildingId)
    .order('floor_number')
    .order('unit_number');

  if (error) throw error;
  return data || [];
};

export const createProperty = async (projectId: string, propertyData: PropertyFormData): Promise<Property> => {
  // Calculer la TVA
  const vatRate = propertyData.vat_rate || 5.0;
  const priceExcludingVat = propertyData.price_excluding_vat;
  const vatAmount = (priceExcludingVat * vatRate) / 100;
  const priceIncludingVat = priceExcludingVat + vatAmount;

  const { data, error } = await supabase
    .from('properties')
    .insert([{
      project_id: projectId,
      building_id: propertyData.building_id,
      property_code: propertyData.property_code,
      unit_number: propertyData.unit_number,
      property_type: propertyData.property_type,
      floor_number: propertyData.floor_number,
      bedrooms_count: propertyData.bedrooms_count,
      bathrooms_count: propertyData.bathrooms_count,
      internal_area: propertyData.internal_area,
      covered_verandas: propertyData.covered_verandas,
      uncovered_verandas: propertyData.uncovered_verandas,
      price_excluding_vat: priceExcludingVat,
      vat_rate: vatRate,
      vat_amount: vatAmount,
      price_including_vat: priceIncludingVat,
      price_per_sqm: priceExcludingVat / propertyData.internal_area,
      sale_status: propertyData.sale_status || 'available',
      property_status: propertyData.sale_status || 'available',
      has_parking: propertyData.has_parking,
      parking_spaces: propertyData.parking_spaces,
      has_storage_unit: propertyData.has_storage_unit,
      has_balcony: propertyData.has_balcony,
      has_terrace: propertyData.has_terrace,
      has_private_garden: propertyData.has_private_garden,
      has_private_pool: propertyData.has_private_pool,
      has_sea_view: propertyData.has_sea_view,
      golden_visa_eligible: priceExcludingVat >= 300000,
      created_by: (await supabase.auth.getUser()).data.user?.id
    }])
    .select()
    .single();

  if (error) throw error;
  
  // Les triggers DB vont automatiquement mettre à jour :
  // - buildings.total_units et units_available  
  // - projects.total_units, price_from, price_to
  
  return data as Property;
};

// Liste EXHAUSTIVE des champs valides en base de données
const VALID_DB_FIELDS = new Set([
  'project_id', 'building_id', 'developer_id', 'property_code', 'unit_number',
  'property_type', 'property_status', 'floor_number', 'position_in_floor', 'orientation',
  'internal_area', 'covered_verandas', 'uncovered_verandas', 'balcony_area', 'terrace_area',
  'private_garden_area', 'roof_garden_area', 'bedrooms_count', 'bathrooms_count', 'wc_count',
  'has_office', 'has_maid_room', 'has_laundry_room', 'has_dressing_room', 'has_playroom',
  'has_wine_cellar', 'has_pantry', 'total_rooms', 'kitchen_type', 'kitchen_brand',
  'has_kitchen_appliances', 'appliances_list', 'hvac_type', 'heating_type',
  'flooring_type', 'windows_type', 'doors_type', 'smart_home_features', 'security_features',
  'balcony_count', 'terrace_count', 'has_private_garden', 'has_private_pool', 'pool_type',
  'parking_spaces', 'parking_type', 'storage_spaces', 'storage_area', 'view_type',
  'price_excluding_vat', 'vat_rate', 'commission_rate', 'original_price', 'current_price',
  'deposit_percentage', 'reservation_fee', 'payment_plan_available', 'payment_plan_details',
  'finance_available', 'minimum_cash_required', 'annual_property_tax', 'communal_fees_monthly',
  'maintenance_fee_monthly', 'title_deed_status', 'planning_permit_number', 'building_permit_number',
  'occupancy_certificate', 'energy_certificate_number', 'energy_rating', 'cadastral_reference',
  'internal_notes', 'public_description'
]);

export const updateProperty = async (id: string, propertyData: Partial<PropertyFormData>): Promise<Property> => {
  // FILTRER: ne garder QUE les champs valides en base
  const updateData: any = {};

  Object.keys(propertyData).forEach(key => {
    if (VALID_DB_FIELDS.has(key)) {
      let value = (propertyData as any)[key];

      // Convertir empty string en null
      if (value === '' || value === undefined) {
        value = null;
      }

      updateData[key] = value;
    } else {
      console.warn(`[updateProperty] ⚠️  Champ ignoré (n'existe pas en base): ${key}`);
    }
  });

  // Forcer payment_plan_details à être un array
  if (updateData.payment_plan_details && typeof updateData.payment_plan_details === 'object' && !Array.isArray(updateData.payment_plan_details)) {
    updateData.payment_plan_details = [];
  }

  // Mapper orientation: front-end (north) -> DB (N)
  const orientationMap: Record<string, string> = {
    'north': 'N',
    'south': 'S',
    'east': 'E',
    'west': 'W',
    'north_east': 'NE',
    'north_west': 'NW',
    'south_east': 'SE',
    'south_west': 'SW'
  };

  if (updateData.orientation && orientationMap[updateData.orientation]) {
    updateData.orientation = orientationMap[updateData.orientation];
  }

  // Recalculer TVA si prix change
  if (updateData.price_excluding_vat) {
    const vatRate = updateData.vat_rate || 5.0;
    const vatAmount = (updateData.price_excluding_vat * vatRate) / 100;
    updateData.vat_amount = vatAmount;
    updateData.price_including_vat = updateData.price_excluding_vat + vatAmount;
    updateData.golden_visa_eligible = updateData.price_including_vat >= 300000;

    if (updateData.internal_area) {
      updateData.price_per_sqm = updateData.price_excluding_vat / updateData.internal_area;
    }
  }

  logger.info('[updateProperty] ✅ Filtered fields:', Object.keys(updateData).sort());

  const { data, error } = await supabase
    .from('properties')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[updateProperty] ❌ Supabase error:', error);
    console.error('[updateProperty] 📋 Data sent:', updateData);
    throw error;
  }

  logger.info('[updateProperty] ✅ Update successful');
  return data as Property;
};

export const deleteProperty = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id);

  if (error) throw error;
};