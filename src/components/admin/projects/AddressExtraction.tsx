// Fonction améliorée pour l'extraction d'adresse
// Ce fichier contient la logique corrigée pour extraire les détails d'adresse

export const extractAddressDetails = (place: any, form: any) => {
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
  addressComponents.forEach((component: any) => {
    const types = component.types;
    
    if (types.includes('locality')) {
      city = component.long_name;
    }
    // Pour Chypre, administrative_area_level_1 est le district principal
    if (types.includes('administrative_area_level_1')) {
      district = component.long_name;
    }
    // Alternative pour la ville (municipalité)
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
  
  // Zone mapping pour Chypre - ENRICHI avec quartiers et municipalités
  const zoneMapping: { [key: string]: string } = {
    // Limassol et tous ses quartiers/municipalités
    'Limassol': 'limassol',
    'Lemesos': 'limassol',
    'Λεμεσός': 'limassol',
    'Limassol District': 'limassol',
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
    'Mouttagiaka': 'limassol',
    'Parekklisia': 'limassol',
    'Pyrgos': 'limassol',
    'Erimi': 'limassol',
    'Kolossi': 'limassol',
    'Trachoni': 'limassol',
    
    // Paphos et environs
    'Paphos': 'paphos',
    'Pafos': 'paphos',
    'Πάφος': 'paphos',
    'Paphos District': 'paphos',
    'Kato Paphos': 'paphos',
    'Peyia': 'paphos',
    'Coral Bay': 'paphos',
    'Chloraka': 'paphos',
    'Kissonerga': 'paphos',
    'Tala': 'paphos',
    'Emba': 'paphos',
    'Konia': 'paphos',
    'Kouklia': 'paphos',
    
    // Larnaca et environs
    'Larnaca': 'larnaca',
    'Larnaka': 'larnaca',
    'Λάρνακα': 'larnaca',
    'Larnaca District': 'larnaca',
    'Oroklini': 'larnaca',
    'Pyla': 'larnaca',
    'Livadia': 'larnaca',
    'Dromolaxia': 'larnaca',
    'Meneou': 'larnaca',
    'Kiti': 'larnaca',
    'Tersefanou': 'larnaca',
    
    // Nicosia et environs
    'Nicosia': 'nicosia',
    'Lefkosia': 'nicosia',
    'Λευκωσία': 'nicosia',
    'Nicosia District': 'nicosia',
    'Strovolos': 'nicosia',
    'Lakatamia': 'nicosia',
    'Latsia': 'nicosia',
    'Engomi': 'nicosia',
    'Agios Dometios': 'nicosia',
    'Aglantzia': 'nicosia',
    'Dasoupoli': 'nicosia',
    'Geri': 'nicosia',
    
    // Famagusta et environs
    'Famagusta': 'famagusta',
    'Ammochostos': 'famagusta',
    'Αμμόχωστος': 'famagusta',
    'Famagusta District': 'famagusta',
    'Paralimni': 'famagusta',
    'Ayia Napa': 'famagusta',
    'Protaras': 'famagusta',
    'Deryneia': 'famagusta',
    'Sotira': 'famagusta',
    'Frenaros': 'famagusta',
    
    // Kyrenia et environs (zone nord)
    'Kyrenia': 'kyrenia',
    'Girne': 'kyrenia',
    'Κερύνεια': 'kyrenia',
    'Kyrenia District': 'kyrenia',
    'Karavas': 'kyrenia',
    'Lapithos': 'kyrenia'
  };
  
  // Détecter la zone - Stratégie améliorée en 4 étapes
  
  // 1. D'abord vérifier si le district administratif correspond
  if (district) {
    for (const [name, zone] of Object.entries(zoneMapping)) {
      if (district.toLowerCase().includes(name.toLowerCase()) || 
          name.toLowerCase().includes(district.toLowerCase())) {
        detectedZone = zone;
        break;
      }
    }
  }
  
  // 2. Si pas trouvé, vérifier le quartier (neighborhood)
  // C'est ici qu'on gère Germasogeia -> Limassol
  if (!detectedZone && neighborhood) {
    for (const [name, zone] of Object.entries(zoneMapping)) {
      if (neighborhood.toLowerCase() === name.toLowerCase() || 
          neighborhood.toLowerCase().includes(name.toLowerCase()) || 
          name.toLowerCase().includes(neighborhood.toLowerCase())) {
        detectedZone = zone;
        // Si c'est un quartier de Limassol comme Germasogeia, on force Limassol comme ville
        if (zone === 'limassol' && ['germasogeia', 'yermasoyia', 'agios tychon', 'agios athanasios'].includes(neighborhood.toLowerCase())) {
          city = 'Limassol'; // Forcer la ville principale
        }
        break;
      }
    }
  }
  
  // 3. Si toujours pas trouvé, vérifier la ville (city)
  if (!detectedZone && city) {
    for (const [name, zone] of Object.entries(zoneMapping)) {
      if (city.toLowerCase() === name.toLowerCase() || 
          city.toLowerCase().includes(name.toLowerCase()) || 
          name.toLowerCase().includes(city.toLowerCase())) {
        detectedZone = zone;
        break;
      }
    }
  }
  
  // 4. Dernier recours : chercher dans l'adresse complète
  if (!detectedZone && place.formatted_address) {
    const fullAddress = place.formatted_address.toLowerCase();
    for (const [name, zone] of Object.entries(zoneMapping)) {
      if (fullAddress.includes(name.toLowerCase())) {
        detectedZone = zone;
        break;
      }
    }
  }
  
  // Mettre à jour les coordonnées GPS
  if (place.geometry && place.geometry.location) {
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    form.setValue('gps_latitude', lat);
    form.setValue('gps_longitude', lng);
  }
  
  // Mettre à jour tous les champs
  
  // Ville (avec correction pour Germasogeia)
  if (city) {
    form.setValue('city', city);
  } else if (neighborhood && detectedZone === 'limassol' && 
             ['germasogeia', 'yermasoyia', 'agios tychon', 'agios athanasios'].includes(neighborhood.toLowerCase())) {
    // Cas spécial : quartiers de Limassol
    form.setValue('city', 'Limassol');
  }
  
  // Champs de rue SÉPARÉS
  if (streetNumber) {
    form.setValue('street_number', streetNumber);
  }
  if (streetName) {
    form.setValue('street_name', streetName);
  }
  
  // Concaténation pour la DB (street_address)
  const streetAddress = streetNumber && streetName 
    ? `${streetNumber} ${streetName}` 
    : streetName || '';
  if (streetAddress) {
    form.setValue('street_address', streetAddress);
  }
  
  // Autres champs
  if (postalCode) {
    form.setValue('postal_code', postalCode);
  }
  
  if (neighborhood) {
    form.setValue('neighborhood', neighborhood);
  }
  
  if (detectedZone) {
    form.setValue('cyprus_zone', detectedZone);
  }
  
  // Retourner les informations extraites pour le toast de notification
  return {
    city: city || (neighborhood && detectedZone === 'limassol' ? 'Limassol' : ''),
    district: detectedZone,
    streetNumber,
    streetName,
    postalCode,
    neighborhood
  };
};

// Export du mapping des zones pour réutilisation
export const CYPRUS_ZONE_MAPPING = {
  // Limassol et tous ses quartiers/municipalités
  'Limassol': 'limassol',
  'Lemesos': 'limassol',
  'Λεμεσός': 'limassol',
  'Limassol District': 'limassol',
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
  'Mouttagiaka': 'limassol',
  'Parekklisia': 'limassol',
  'Pyrgos': 'limassol',
  'Erimi': 'limassol',
  'Kolossi': 'limassol',
  'Trachoni': 'limassol',
  
  // Paphos et environs
  'Paphos': 'paphos',
  'Pafos': 'paphos',
  'Πάφος': 'paphos',
  'Paphos District': 'paphos',
  'Kato Paphos': 'paphos',
  'Peyia': 'paphos',
  'Coral Bay': 'paphos',
  'Chloraka': 'paphos',
  'Kissonerga': 'paphos',
  'Tala': 'paphos',
  'Emba': 'paphos',
  'Konia': 'paphos',
  'Kouklia': 'paphos',
  
  // Larnaca et environs
  'Larnaca': 'larnaca',
  'Larnaka': 'larnaca',
  'Λάρνακα': 'larnaca',
  'Larnaca District': 'larnaca',
  'Oroklini': 'larnaca',
  'Pyla': 'larnaca',
  'Livadia': 'larnaca',
  'Dromolaxia': 'larnaca',
  'Meneou': 'larnaca',
  'Kiti': 'larnaca',
  'Tersefanou': 'larnaca',
  
  // Nicosia et environs
  'Nicosia': 'nicosia',
  'Lefkosia': 'nicosia',
  'Λευκωσία': 'nicosia',
  'Nicosia District': 'nicosia',
  'Strovolos': 'nicosia',
  'Lakatamia': 'nicosia',
  'Latsia': 'nicosia',
  'Engomi': 'nicosia',
  'Agios Dometios': 'nicosia',
  'Aglantzia': 'nicosia',
  'Dasoupoli': 'nicosia',
  'Geri': 'nicosia',
  
  // Famagusta et environs
  'Famagusta': 'famagusta',
  'Ammochostos': 'famagusta',
  'Αμμόχωστος': 'famagusta',
  'Famagusta District': 'famagusta',
  'Paralimni': 'famagusta',
  'Ayia Napa': 'famagusta',
  'Protaras': 'famagusta',
  'Deryneia': 'famagusta',
  'Sotira': 'famagusta',
  'Frenaros': 'famagusta',
  
  // Kyrenia et environs (zone nord)
  'Kyrenia': 'kyrenia',
  'Girne': 'kyrenia',
  'Κερύνεια': 'kyrenia',
  'Kyrenia District': 'kyrenia',
  'Karavas': 'kyrenia',
  'Lapithos': 'kyrenia'
};
