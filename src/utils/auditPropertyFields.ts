import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export async function auditPropertyFields() {
  logger.info('=== AUDIT DES CHAMPS PROPERTIES ===\n');

  // 1. Récupérer une propriété existante pour voir les champs disponibles
  const { data: sampleProperty, error: fetchError } = await supabase
    .from('properties')
    .select('*')
    .limit(1)
    .single();

  if (fetchError) {
    console.error('❌ Erreur lecture properties:', fetchError);
    return;
  }

  if (!sampleProperty) {
    logger.info('⚠️  Aucune propriété trouvée en base');
    return;
  }

  const dbColumns = Object.keys(sampleProperty).sort();
  logger.info('📊 COLONNES EN BASE DE DONNÉES (' + dbColumns.length + ' colonnes):');
  logger.info(dbColumns);
  logger.info('\n');

  // 2. Lister les champs du formulaire (PropertyFormData)
  const formFields = [
    'project_id',
    'building_id',
    'unit_number',
    'property_code',
    'property_type',
    'property_sub_type',
    'property_status',
    'sale_type',
    'ownership_type',
    'bedrooms_count',
    'bathrooms_count',
    'wc_count',
    'internal_area',
    'covered_verandas',
    'uncovered_verandas',
    'private_garden_area',
    'roof_garden_area',
    'floor_number',
    'position_in_floor',
    'orientation',
    'has_office',
    'has_maid_room',
    'has_dressing_room',
    'has_playroom',
    'has_wine_cellar',
    'has_pantry',
    'has_laundry_room',
    'total_rooms',
    'kitchen_type',
    'kitchen_brand',
    'has_kitchen_appliances',
    'appliances_list',
    'hvac_type',
    'heating_type',
    'flooring_type',
    'windows_type',
    'doors_type',
    'smart_home_features',
    'security_features',
    'balcony_count',
    'balcony_area',
    'terrace_count',
    'terrace_area',
    'has_private_garden',
    'has_private_pool',
    'pool_type',
    'parking_spaces',
    'parking_type',
    'storage_spaces',
    'storage_area',
    'view_type',
    'price_excluding_vat',
    'vat_rate',
    'commission_rate',
    'original_price',
    'current_price',
    'deposit_percentage',
    'reservation_fee',
    'payment_plan_available',
    'payment_plan_details',
    'finance_available',
    'minimum_cash_required',
    'annual_property_tax',
    'communal_fees_monthly',
    'maintenance_fee_monthly',
    'title_deed_status',
    'planning_permit_number',
    'building_permit_number',
    'occupancy_certificate',
    'energy_certificate_number',
    'energy_rating',
    'cadastral_reference',
    'internal_notes',
    'public_description'
  ].sort();

  logger.info('📝 CHAMPS DU FORMULAIRE (' + formFields.length + ' champs):');
  logger.info(formFields);
  logger.info('\n');

  // 3. Comparer
  const missingInDb = formFields.filter(field => !dbColumns.includes(field));
  const extraInDb = dbColumns.filter(col => !formFields.includes(col));

  logger.info('❌ CHAMPS DANS LE FORMULAIRE MAIS PAS EN BASE (' + missingInDb.length + '):');
  if (missingInDb.length > 0) {
    missingInDb.forEach(field => logger.info('  - ' + field));
  } else {
    logger.info('  ✅ Aucun');
  }
  logger.info('\n');

  logger.info('⚠️  CHAMPS EN BASE MAIS PAS DANS LE FORMULAIRE (' + extraInDb.length + '):');
  if (extraInDb.length > 0) {
    extraInDb.forEach(col => logger.info('  - ' + col));
  } else {
    logger.info('  ✅ Aucun');
  }
  logger.info('\n');

  // 4. Tester un UPDATE avec les champs problématiques
  logger.info('🧪 TEST UPDATE AVEC DONNÉES SAMPLE...');

  const testData = {
    unit_number: 'TEST-AUDIT',
    internal_area: 100,
    bedrooms_count: 2,
    bathrooms_count: 1,
    price_excluding_vat: 200000,
    property_type: 'apartment',
    property_status: 'available'
  };

  const { error: updateError } = await supabase
    .from('properties')
    .update(testData)
    .eq('id', sampleProperty.id);

  if (updateError) {
    console.error('❌ Erreur UPDATE test:', updateError);
  } else {
    logger.info('✅ UPDATE test réussi');
  }

  // 5. Afficher les types de données
  logger.info('\n📋 TYPES DES VALEURS ACTUELLES:');
  Object.entries(sampleProperty).slice(0, 20).forEach(([key, value]) => {
    logger.info(`  ${key}: ${typeof value} = ${value}`);
  });

  return {
    dbColumns,
    formFields,
    missingInDb,
    extraInDb
  };
}
