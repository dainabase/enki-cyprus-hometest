import { toast } from '@/hooks/use-toast';

// Fonction pour extraire les détails depuis une adresse complète - VERSION CORRIGÉE
export const handleExtractAddressDetails = async (form: any) => {
  const address = form.watch('full_address');
  if (!address) return;

  try {
    // Utiliser l'API Google Geocoding
    const geocoder = new window.google.maps.Geocoder();
    
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const place = results[0];
        const addressComponents = place.address_components || [];
        
        // Variables pour stocker les informations extraites
        let city = '';
        let district = ''; // District principal (ex: Limassol)
        let postalCode = '';
        let streetNumber = '';
        let streetName = '';
        let neighborhood = '';
        let detectedZone = '';
        
        // Parcourir les composants d'adresse
        addressComponents.forEach(component => {
          const types = component.types;
          
          if (types.includes('locality')) {
            city = component.long_name;
          }
          // Pour Chypre, administrative_area_level_1 est le district principal
          if (types.includes('administrative_area_level_1')) {
            district = component.long_name;
          }
          if (!city && types.includes('administrative_area_level_2')) {
            city = component.long_name;
          }
          if (types.includes('postal_code')) {
            postalCode = component.long_name;
          }
          if (types.includes('street_number')) {
            streetNumber = component.long_name;
          }
          if (types.includes('route')) {
            streetName = component.long_name;
          }
          if (types.includes('neighborhood') || 
              types.includes('sublocality_level_1') ||
              types.includes('sublocality')) {
            neighborhood = component.long_name;
          }
        });
        
        // Construire l'adresse de rue
        const streetAddress = streetNumber && streetName 
          ? `${streetNumber} ${streetName}` 
          : streetName || '';
        
        // Zone mapping pour Chypre - COMPLET avec quartiers et municipalités
        const zoneMapping: { [key: string]: string } = {
          // Limassol District et toutes ses municipalités/quartiers
          'Limassol': 'limassol',
          'Limassol District': 'limassol',
          'Lemesos': 'limassol',
          'Λεμεσός': 'limassol',
          'Germasogeia': 'limassol',
          'Germasogeia Municipality': 'limassol',
          'Γερμασόγεια': 'limassol',
          'Yermasoyia': 'limassol',
          'Agios Tychon': 'limassol',
          'Agios Athanasios': 'limassol',
          'Mesa Geitonia': 'limassol',
          'Katholiki': 'limassol',
          'Zakaki': 'limassol',
          'Ypsonas': 'limassol',
          'Kato Polemidia': 'limassol',
          'Pano Polemidia': 'limassol',
          'Mouttagiaka': 'limassol',
          'Parekklisia': 'limassol',
          'Pyrgos': 'limassol',
          'Erimi': 'limassol',
          'Episkopi': 'limassol',
          'Trachoni': 'limassol',
          'Kolossi': 'limassol',
          
          // Paphos District
          'Paphos': 'paphos',
          'Paphos District': 'paphos',
          'Pafos': 'paphos',
          'Πάφος': 'paphos',
          'Kato Paphos': 'paphos',
          'Peyia': 'paphos',
          'Coral Bay': 'paphos',
          'Chloraka': 'paphos',
          'Kissonerga': 'paphos',
          'Tala': 'paphos',
          'Emba': 'paphos',
          'Konia': 'paphos',
          'Kouklia': 'paphos',
          'Mandria': 'paphos',
          
          // Larnaca District
          'Larnaca': 'larnaca',
          'Larnaca District': 'larnaca',
          'Larnaka': 'larnaca',
          'Λάρνακα': 'larnaca',
          'Oroklini': 'larnaca',
          'Pyla': 'larnaca',
          'Livadia': 'larnaca',
          'Dromolaxia': 'larnaca',
          'Meneou': 'larnaca',
          'Kiti': 'larnaca',
          'Tersefanou': 'larnaca',
          'Pervolia': 'larnaca',
          
          // Nicosia District
          'Nicosia': 'nicosia',
          'Nicosia District': 'nicosia',
          'Lefkosia': 'nicosia',
          'Λευκωσία': 'nicosia',
          'Strovolos': 'nicosia',
          'Lakatamia': 'nicosia',
          'Latsia': 'nicosia',
          'Engomi': 'nicosia',
          'Agios Dometios': 'nicosia',
          'Aglantzia': 'nicosia',
          'Dasoupoli': 'nicosia',
          'Geri': 'nicosia',
          'Tseri': 'nicosia',
          
          // Famagusta District
          'Famagusta': 'famagusta',
          'Famagusta District': 'famagusta',
          'Ammochostos': 'famagusta',
          'Αμμόχωστος': 'famagusta',
          'Paralimni': 'famagusta',
          'Ayia Napa': 'famagusta',
          'Protaras': 'famagusta',
          'Deryneia': 'famagusta',
          'Sotira': 'famagusta',
          'Frenaros': 'famagusta',
          'Vrysoulles': 'famagusta',
        };
        
        // Détecter la zone - Stratégie améliorée en 5 étapes
        // 1. D'abord vérifier si le district administratif correspond
        if (district) {
          for (const [name, zone] of Object.entries(zoneMapping)) {
            if (district.toLowerCase().includes(name.toLowerCase()) || 
                name.toLowerCase().includes(district.toLowerCase())) {
              detectedZone = zone;
              console.log('✅ Zone détectée par district:', district, '->', zone);
              break;
            }
          }
        }
        
        // 2. Si pas trouvé, vérifier le quartier/municipalité (ex: Germasogeia)
        if (!detectedZone && neighborhood) {
          for (const [name, zone] of Object.entries(zoneMapping)) {
            if (neighborhood.toLowerCase().includes(name.toLowerCase()) || 
                name.toLowerCase().includes(neighborhood.toLowerCase())) {
              detectedZone = zone;
              console.log('✅ Zone détectée par quartier:', neighborhood, '->', zone);
              // Si c'est un quartier de Limassol, forcer la ville principale
              if (zone === 'limassol' && !city.toLowerCase().includes('limassol')) {
                city = 'Limassol';
              }
              break;
            }
          }
        }
        
        // 3. Vérifier la ville (locality)
        if (!detectedZone && city) {
          for (const [name, zone] of Object.entries(zoneMapping)) {
            if (city.toLowerCase() === name.toLowerCase() || 
                city.toLowerCase().includes(name.toLowerCase()) || 
                name.toLowerCase().includes(city.toLowerCase())) {
              detectedZone = zone;
              console.log('✅ Zone détectée par ville:', city, '->', zone);
              break;
            }
          }
        }
        
        // 4. Analyser l'adresse complète formatée
        if (!detectedZone) {
          const fullAddress = place.formatted_address.toLowerCase();
          for (const [name, zone] of Object.entries(zoneMapping)) {
            if (fullAddress.includes(name.toLowerCase())) {
              detectedZone = zone;
              console.log('✅ Zone détectée dans adresse complète:', name, '->', zone);
              break;
            }
          }
        }
        
        // 5. Cas spécial : Si Germasogeia est détecté, c'est Limassol
        if (!detectedZone && (city === 'Germasogeia' || neighborhood === 'Germasogeia')) {
          detectedZone = 'limassol';
          city = 'Limassol'; // Afficher Limassol comme ville principale
          console.log('✅ Germasogeia détecté -> Zone: limassol');
        }
        
        // Mettre à jour les coordonnées GPS
        if (place.geometry && place.geometry.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          form.setValue('gps_latitude', lat);
          form.setValue('gps_longitude', lng);
        }
        
        // Mettre à jour tous les champs
        if (city) form.setValue('city', city);
        
        // Mettre à jour les champs de rue séparément
        if (streetNumber) form.setValue('street_number', streetNumber);
        if (streetName) form.setValue('street_name', streetName);
        
        // Aussi stocker dans street_address pour la DB (concaténation)
        if (streetAddress) form.setValue('street_address', streetAddress);
        
        if (postalCode) form.setValue('postal_code', postalCode);
        if (neighborhood) form.setValue('neighborhood', neighborhood);
        if (detectedZone) form.setValue('cyprus_zone', detectedZone);
        
        // Afficher une notification de succès avec plus de détails
        const extractedInfo = [];
        if (city) extractedInfo.push(`Ville: ${city}`);
        if (neighborhood && neighborhood !== city) extractedInfo.push(`Quartier: ${neighborhood}`);
        if (streetNumber || streetName) extractedInfo.push(`Rue: ${streetNumber} ${streetName}`.trim());
        if (postalCode) extractedInfo.push(`Code: ${postalCode}`);
        if (detectedZone) extractedInfo.push(`District: ${detectedZone.toUpperCase()}`);
        
        toast({
          title: '✅ Détails extraits avec succès',
          description: extractedInfo.join(', ') || 'Certains détails n\'ont pas pu être extraits'
        });
        
      } else {
        toast({
          title: 'Impossible d\'extraire les détails',
          description: 'Vérifiez que l\'adresse est complète et valide',
          variant: 'destructive'
        });
      }
    });
    
  } catch (error) {
    console.error('Erreur extraction:', error);
    toast({
      title: 'Erreur lors de l\'extraction',
      variant: 'destructive'
    });
  }
};
