/**
 * Utilitaire pour gérer les spécificités des adresses chypriotes
 * À Chypre, la structure est : Numéro + Rue, Municipalité, Code postal, District
 */

// Mapping complet des municipalités vers leurs districts
export const CYPRUS_MUNICIPALITY_TO_DISTRICT: Record<string, string> = {
  // District de Limassol
  'Limassol': 'limassol',
  'Lemesos': 'limassol',
  'Λεμεσός': 'limassol',
  'Germasogeia': 'limassol',
  'Germasogeia Municipality': 'limassol',
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
  'Kolossi': 'limassol',
  'Trachoni': 'limassol',
  'Episkopi': 'limassol',
  'Pissouri': 'limassol',
  
  // District de Paphos
  'Paphos': 'paphos',
  'Pafos': 'paphos',
  'Πάφος': 'paphos',
  'Kato Paphos': 'paphos',
  'Peyia': 'paphos',
  'Pegeia': 'paphos',
  'Coral Bay': 'paphos',
  'Chloraka': 'paphos',
  'Kissonerga': 'paphos',
  'Tala': 'paphos',
  'Emba': 'paphos',
  'Konia': 'paphos',
  'Kouklia': 'paphos',
  'Polis Chrysochous': 'paphos',
  'Latchi': 'paphos',
  'Mandria': 'paphos',
  'Anarita': 'paphos',
  
  // District de Larnaca
  'Larnaca': 'larnaca',
  'Larnaka': 'larnaca',
  'Λάρνακα': 'larnaca',
  'Oroklini': 'larnaca',
  'Voroklini': 'larnaca',
  'Pyla': 'larnaca',
  'Livadia': 'larnaca',
  'Dromolaxia': 'larnaca',
  'Meneou': 'larnaca',
  'Kiti': 'larnaca',
  'Pervolia': 'larnaca',
  'Tersefanou': 'larnaca',
  'Xylophagou': 'larnaca',
  'Xylotymvou': 'larnaca',
  'Ormideia': 'larnaca',
  
  // District de Nicosia
  'Nicosia': 'nicosia',
  'Lefkosia': 'nicosia',
  'Λευκωσία': 'nicosia',
  'Strovolos': 'nicosia',
  'Lakatamia': 'nicosia',
  'Latsia': 'nicosia',
  'Engomi': 'nicosia',
  'Agios Dometios': 'nicosia',
  'Aglantzia': 'nicosia',
  'Dasoupoli': 'nicosia',
  'Anthoupoli': 'nicosia',
  'Geri': 'nicosia',
  'Tseri': 'nicosia',
  'Dali': 'nicosia',
  'Kokkinotrimithia': 'nicosia',
  'Paliometocho': 'nicosia',
  
  // District de Famagusta (Ammochostos)
  'Famagusta': 'famagusta',
  'Ammochostos': 'famagusta',
  'Αμμόχωστος': 'famagusta',
  'Paralimni': 'famagusta',
  'Ayia Napa': 'famagusta',
  'Agia Napa': 'famagusta',
  'Protaras': 'famagusta',
  'Deryneia': 'famagusta',
  'Sotira': 'famagusta',
  'Frenaros': 'famagusta',
  'Vrysoulles': 'famagusta',
  'Kapparis': 'famagusta',
  'Pernera': 'famagusta',
  
  // District de Kyrenia (zone nord)
  'Kyrenia': 'kyrenia',
  'Girne': 'kyrenia',
  'Κερύνεια': 'kyrenia',
  'Karavas': 'kyrenia',
  'Lapithos': 'kyrenia',
  'Bellapais': 'kyrenia',
  'Ozankoy': 'kyrenia',
  'Catalkoy': 'kyrenia',
  'Alsancak': 'kyrenia',
  'Lapta': 'kyrenia',
};

// Districts principaux de Chypre
export const CYPRUS_DISTRICTS = {
  'limassol': 'Limassol',
  'paphos': 'Paphos',
  'larnaca': 'Larnaca',
  'nicosia': 'Nicosia',
  'famagusta': 'Famagusta',
  'kyrenia': 'Kyrenia'
};

/**
 * Extrait le district depuis une municipalité
 */
export function getMunicipalityDistrict(municipality: string): string {
  if (!municipality) return '';
  
  // Recherche directe
  const directMatch = CYPRUS_MUNICIPALITY_TO_DISTRICT[municipality];
  if (directMatch) return directMatch;
  
  // Recherche insensible à la casse
  const lowerMunicipality = municipality.toLowerCase().trim();
  for (const [key, district] of Object.entries(CYPRUS_MUNICIPALITY_TO_DISTRICT)) {
    if (key.toLowerCase() === lowerMunicipality) {
      return district;
    }
  }
  
  // Recherche partielle
  for (const [key, district] of Object.entries(CYPRUS_MUNICIPALITY_TO_DISTRICT)) {
    if (lowerMunicipality.includes(key.toLowerCase()) || 
        key.toLowerCase().includes(lowerMunicipality)) {
      return district;
    }
  }
  
  return '';
}

/**
 * Analyse une adresse complète et extrait ses composants
 * Format attendu: "45 Poseidonos Avenue, Germasogeia, 4048 Limassol, Cyprus"
 */
export function parseCompleteAddress(address: string) {
  const result = {
    streetNumber: '',
    streetName: '',
    municipality: '',
    postalCode: '',
    district: '',
    country: 'Cyprus'
  };
  
  if (!address) return result;
  
  // Enlever "Cyprus" ou "Chypre" de la fin si présent
  const cleanAddress = address
    .replace(/,?\s*(Cyprus|Chypre|Κύπρος)\s*$/i, '')
    .trim();
  
  // Séparer par virgules
  const parts = cleanAddress.split(',').map(p => p.trim());
  
  if (parts.length > 0) {
    // Première partie : numéro et rue
    const streetPart = parts[0];
    const streetMatch = streetPart.match(/^(\d+[A-Za-z]?)\s+(.+)$/);
    if (streetMatch) {
      result.streetNumber = streetMatch[1];
      result.streetName = streetMatch[2];
    } else {
      // Pas de numéro détecté, tout est le nom de rue
      result.streetName = streetPart;
    }
  }
  
  if (parts.length > 1) {
    // Deuxième partie : municipalité
    result.municipality = parts[1];
  }
  
  if (parts.length > 2) {
    // Troisième partie : code postal et possiblement district
    const thirdPart = parts[2];
    
    // Extraire le code postal (4 chiffres)
    const postalMatch = thirdPart.match(/\b(\d{4})\b/);
    if (postalMatch) {
      result.postalCode = postalMatch[1];
    }
    
    // Le reste après le code postal pourrait être le district
    const remainingAfterPostal = thirdPart.replace(/\b\d{4}\b/, '').trim();
    if (remainingAfterPostal) {
      const detectedDistrict = getMunicipalityDistrict(remainingAfterPostal);
      if (detectedDistrict) {
        result.district = detectedDistrict;
      }
    }
  }
  
  // Si pas de district trouvé, essayer avec la municipalité
  if (!result.district && result.municipality) {
    result.district = getMunicipalityDistrict(result.municipality);
  }
  
  return result;
}

/**
 * Détermine la ville principale en fonction de la municipalité et du district
 * En pratique, on garde la municipalité comme ville et le district comme zone
 */
export function determineCityFromMunicipality(
  municipality: string, 
  district: string
): { city: string; zone: string } {
  // Si la municipalité est identique au nom du district principal, 
  // utiliser le district comme ville
  const districtName = CYPRUS_DISTRICTS[district as keyof typeof CYPRUS_DISTRICTS];
  
  if (municipality && districtName) {
    // Vérifier si la municipalité est le district lui-même
    if (municipality.toLowerCase() === districtName.toLowerCase() ||
        municipality.toLowerCase() === district.toLowerCase()) {
      return { city: districtName, zone: district };
    }
    
    // Sinon, garder la municipalité comme ville
    return { city: municipality, zone: district };
  }
  
  return { city: municipality || '', zone: district || '' };
}

/**
 * Analyse les composants d'adresse Google Places
 */
export function parseGooglePlaceComponents(addressComponents: any[]) {
  const result = {
    streetNumber: '',
    streetName: '',
    municipality: '',
    city: '',
    district: '',
    postalCode: '',
    country: ''
  };
  
  addressComponents.forEach(component => {
    const types = component.types || [];
    
    // Numéro de rue
    if (types.includes('street_number')) {
      result.streetNumber = component.long_name;
    }
    
    // Nom de rue
    if (types.includes('route')) {
      result.streetName = component.long_name;
    }
    
    // Municipalité/Localité
    if (types.includes('locality')) {
      result.municipality = component.long_name;
      result.city = component.long_name; // Par défaut, la ville est la localité
    }
    
    // Zone administrative niveau 1 (pourrait être le district)
    if (types.includes('administrative_area_level_1')) {
      const potentialDistrict = getMunicipalityDistrict(component.long_name);
      if (potentialDistrict) {
        result.district = potentialDistrict;
      }
    }
    
    // Quartier/Sous-localité
    if (types.includes('neighborhood') || 
        types.includes('sublocality_level_1') ||
        types.includes('sublocality')) {
      // Si on n'a pas encore de municipalité, utiliser le quartier
      if (!result.municipality) {
        result.municipality = component.long_name;
      }
    }
    
    // Code postal
    if (types.includes('postal_code')) {
      result.postalCode = component.long_name;
    }
    
    // Pays
    if (types.includes('country')) {
      result.country = component.long_name;
    }
  });
  
  // Déterminer le district depuis la municipalité si pas encore trouvé
  if (!result.district && result.municipality) {
    result.district = getMunicipalityDistrict(result.municipality);
  }
  
  // Ajuster ville/municipalité selon le contexte chypriote
  const { city, zone } = determineCityFromMunicipality(result.municipality, result.district);
  result.city = city;
  result.district = zone;
  
  return result;
}
