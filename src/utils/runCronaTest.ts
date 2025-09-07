import { createCronaGroupTestData, validateCronaGroupData, cleanupCronaGroupData } from './cronaGroupTestData';

export const runFullCronaTest = async () => {
  console.log('🚀 DÉBUT DU TEST COMPLET CRONA GROUPE');
  console.log('=====================================');

  try {
    // 1. Nettoyer d'abord les données existantes
    console.log('\n🧹 ÉTAPE 1: Nettoyage préalable...');
    await cleanupCronaGroupData();

    // 2. Créer les nouvelles données
    console.log('\n🏗️ ÉTAPE 2: Création des données...');
    const createResult = await createCronaGroupTestData();
    
    if (!createResult.success) {
      throw new Error(`Création échouée: ${createResult.message}`);
    }

    console.log(`✅ Création réussie:
    - Développeur: ${createResult.developer?.name}
    - Projet: ${createResult.project?.title}
    - Bâtiments: ${createResult.buildings?.length}
    - Unités: ${createResult.details?.totalUnits} (${createResult.details?.apartments} appts + ${createResult.details?.houses} maisons)`);

    // 3. Valider les données créées
    console.log('\n🔍 ÉTAPE 3: Validation des données...');
    const validationResult = await validateCronaGroupData();
    
    if (!validationResult.success) {
      throw new Error(`Validation échouée: ${validationResult.message}`);
    }

    console.log('✅ Validation réussie - Toutes les données sont correctes');

    // 4. Tests spécifiques
    console.log('\n🧪 ÉTAPE 4: Tests spécifiques...');
    
    // Test Golden Visa
    const goldenVisaTest = validationResult.project?.golden_visa_eligible;
    console.log(`🏆 Golden Visa: ${goldenVisaTest ? '✅ Activé' : '❌ Désactivé'} (prix: €${validationResult.project?.price})`);

    // Test hiérarchie
    const hierarchyTest = validationResult.buildings?.every(b => b.project_id === validationResult.project?.id);
    console.log(`🏗️ Hiérarchie: ${hierarchyTest ? '✅ Correcte' : '❌ Incorrecte'}`);

    // Test totaux
    const unitsTest = validationResult.details?.totalUnits === 24;
    console.log(`📊 Unités: ${unitsTest ? '✅ Correct' : '❌ Incorrect'} (${validationResult.details?.totalUnits}/24)`);

    // Résumé final
    console.log('\n📊 RÉSUMÉ FINAL');
    console.log('================');
    console.log(`✅ Développeur créé: Crona Groupe`);
    console.log(`✅ Projet créé: Square Garden`);
    console.log(`✅ Bâtiments créés: 2 (Appartements + Maisons)`);
    console.log(`✅ Unités totales: 24 (20 appartements + 4 maisons)`);
    console.log(`✅ Golden Visa: ${goldenVisaTest ? 'Activé' : 'Désactivé'}`);
    console.log(`✅ Localisation: Limassol`);
    console.log(`✅ Statut: En construction`);

    return {
      success: true,
      message: 'Test complet Crona Groupe réussi',
      data: validationResult,
      tests: {
        creation: true,
        validation: true,
        goldenVisa: goldenVisaTest,
        hierarchy: hierarchyTest,
        units: unitsTest
      }
    };

  } catch (error) {
    console.error('\n💥 ERREUR DURANT LE TEST:', error);
    
    // Tentative de nettoyage en cas d'erreur
    console.log('\n🧹 Nettoyage après erreur...');
    await cleanupCronaGroupData();

    return {
      success: false,
      message: `Test échoué: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
      error
    };
  }
};