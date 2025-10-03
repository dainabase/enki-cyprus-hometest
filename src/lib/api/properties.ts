import { supabase } from '@/integrations/supabase/client';
import { Property, PropertyFormData } from '@/types/property';

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

export const updateProperty = async (id: string, propertyData: Partial<PropertyFormData>): Promise<Property> => {
  let updateData: any = { ...propertyData };

  // Supprimer les champs qui n'existent pas en base
  delete updateData.ownership_type;
  delete updateData.sale_type;
  delete updateData.property_sub_type;

  // Nettoyer les valeurs null/undefined problématiques
  // Convertir empty string en null pour les champs optionnels
  Object.keys(updateData).forEach(key => {
    if (updateData[key] === '' || updateData[key] === undefined) {
      updateData[key] = null;
    }
  });

  // Forcer payment_plan_details à être un array si c'est un object
  if (updateData.payment_plan_details && typeof updateData.payment_plan_details === 'object' && !Array.isArray(updateData.payment_plan_details)) {
    updateData.payment_plan_details = [];
  }

  // Recalculer TVA si prix change
  if (propertyData.price_excluding_vat) {
    const vatRate = propertyData.vat_rate || 5.0;
    const vatAmount = (propertyData.price_excluding_vat * vatRate) / 100;
    updateData = {
      ...updateData,
      vat_amount: vatAmount,
      price_including_vat: propertyData.price_excluding_vat + vatAmount,
      golden_visa_eligible: propertyData.price_excluding_vat >= 300000
    };

    if (propertyData.internal_area) {
      updateData.price_per_sqm = propertyData.price_excluding_vat / propertyData.internal_area;
    }
  }

  console.log('[updateProperty] Cleaned data to send:', updateData);

  const { data, error } = await supabase
    .from('properties')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[updateProperty] Supabase error:', error);
    throw error;
  }

  console.log('[updateProperty] ✅ Update successful, received:', data);
  return data as Property;
};

export const deleteProperty = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id);

  if (error) throw error;
};