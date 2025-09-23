import { googleMapsAgent } from '@/services/googleMapsAgent';

export async function testGoogleMapsConnection() {
  console.log('🧪 Test de connexion Google Maps...');
  
  try {
    const result = await googleMapsAgent.findNearbyPlaces('Limassol Marina, Cyprus', 1);
    console.log('✅ Test réussi:', result);
    return result;
  } catch (error) {
    console.error('❌ Test échoué:', error);
    throw error;
  }
}

// Pour tester dans la console du navigateur:
// window.testGoogleMaps = testGoogleMapsConnection;