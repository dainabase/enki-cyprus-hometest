/**
 * Patch pour améliorer l'extraction d'adresse dans ProjectFormSteps
 * Ce fichier contient les parties modifiées pour une meilleure gestion des adresses chypriotes
 */

import { 
  parseCompleteAddress, 
  parseGooglePlaceComponents,
  getMunicipalityDistrict,
  determineCityFromMunicipality 
} from '@/utils/cyprusAddressHelper';

// ===============================================
// SECTION 1: AMÉLIORATION DE L'AUTOCOMPLETE GOOGLE PLACES
// Remplacer la section useEffect pour l'autocomplete (environ ligne 2000)
// ===============================================

export const improvedGoogleAutocomplete = `
  useEffect(() => {
    if (currentStep === 'location' && window.google) {
      const input = document.getElementById('address-autocomplete');
      if (input) {
        const autocomplete = new window.google.maps.places.Autocomplete(input as HTMLInputElement, {
          types: ['address'],
          componentRestrictions: { country: 'cy' },
          fields: ['address_components', 'geometry', 'formatted_address']
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.geometry) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            
            // Utiliser le nouveau helper pour parser les composants
            const parsedAddress = parseGooglePlaceComponents(place.address_components || []);
            
            // Mise à jour de l'adresse complète
            form.setValue('full_address', place.formatted_address);
            
            // Mise à jour des coordonnées GPS
            form.setValue('gps_latitude', lat);
            form.setValue('gps_longitude', lng);
            
            // Mise à jour de la ville (municipalité)
            if (parsedAddress.city) {
              form.setValue('city', parsedAddress.city);
            }
            
            // Mise à jour du district (zone géographique)
            if (parsedAddress.district) {
              form.setValue('cyprus_zone', parsedAddress.district);
              toast.success(\`✅ District détecté: \${parsedAddress.district}\`, {
                description: parsedAddress.municipality ? \`Municipalité: \${parsedAddress.municipality}\` : undefined
              });
            }
            
            // Mise à jour de l'adresse rue (concaténation pour la DB)
            const fullStreetAddress = parsedAddress.streetNumber && parsedAddress.streetName 
              ? \`\${parsedAddress.streetNumber} \${parsedAddress.streetName}\` 
              : parsedAddress.streetName || '';
            
            if (fullStreetAddress) {
              form.setValue('street_address', fullStreetAddress);
            }
            
            // Mise à jour du code postal
            if (parsedAddress.postalCode) {
              form.setValue('postal_code', parsedAddress.postalCode);
            }
            
            // Si on a une municipalité différente de la ville principale, 
            // l'utiliser comme quartier
            if (parsedAddress.municipality && 
                parsedAddress.municipality !== parsedAddress.city) {
              form.setValue('neighborhood', parsedAddress.municipality);
            }
          }
        });
      }
    }
  }, [currentStep, form]);
`;

// ===============================================
// SECTION 2: AMÉLIORATION DE LA FONCTION EXTRACT DETAILS
// Remplacer handleExtractAddressDetails (environ ligne 2200)
// ===============================================

export const improvedExtractFunction = `
  const handleExtractAddressDetails = async () => {
    const address = form.watch('full_address');
    if (!address) {
      toast.error('Veuillez entrer une adresse');
      return;
    }

    try {
      // D'abord essayer le parsing manuel de l'adresse
      const manualParsed = parseCompleteAddress(address);
      
      // Si on a extrait des infos depuis le parsing manuel
      if (manualParsed.streetNumber || manualParsed.municipality || manualParsed.postalCode) {
        // Mise à jour de l'adresse rue
        const fullStreetAddress = manualParsed.streetNumber && manualParsed.streetName
          ? \`\${manualParsed.streetNumber} \${manualParsed.streetName}\`
          : manualParsed.streetName;
          
        if (fullStreetAddress) {
          form.setValue('street_address', fullStreetAddress);
        }
        
        if (manualParsed.postalCode) {
          form.setValue('postal_code', manualParsed.postalCode);
        }
        
        if (manualParsed.district) {
          form.setValue('cyprus_zone', manualParsed.district);
        }
        
        // Déterminer la ville selon le contexte chypriote
        if (manualParsed.municipality) {
          const { city, zone } = determineCityFromMunicipality(
            manualParsed.municipality, 
            manualParsed.district
          );
          
          form.setValue('city', city);
          
          // Si la municipalité est différente de la ville principale, 
          // la stocker comme quartier
          if (manualParsed.municipality !== city) {
            form.setValue('neighborhood', manualParsed.municipality);
          }
        }
      }
      
      // Ensuite, utiliser Google Geocoding pour compléter/valider
      const geocoder = new window.google.maps.Geocoder();
      
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const place = results[0];
          
          // Parser avec le helper
          const googleParsed = parseGooglePlaceComponents(place.address_components || []);
          
          // Mise à jour GPS
          if (place.geometry && place.geometry.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            form.setValue('gps_latitude', lat);
            form.setValue('gps_longitude', lng);
          }
          
          // Compléter les champs manquants avec les données Google
          if (!form.watch('city') && googleParsed.city) {
            form.setValue('city', googleParsed.city);
          }
          
          if (!form.watch('street_address')) {
            const googleStreetAddress = googleParsed.streetNumber && googleParsed.streetName
              ? \`\${googleParsed.streetNumber} \${googleParsed.streetName}\`
              : googleParsed.streetName;
            
            if (googleStreetAddress) {
              form.setValue('street_address', googleStreetAddress);
            }
          }
          
          if (!form.watch('postal_code') && googleParsed.postalCode) {
            form.setValue('postal_code', googleParsed.postalCode);
          }
          
          if (!form.watch('cyprus_zone') && googleParsed.district) {
            form.setValue('cyprus_zone', googleParsed.district);
          }
          
          if (!form.watch('neighborhood') && googleParsed.municipality && 
              googleParsed.municipality !== googleParsed.city) {
            form.setValue('neighborhood', googleParsed.municipality);
          }
          
          // Notification de succès avec détails
          toast.success('✅ Détails extraits avec succès', {
            description: \`
              Ville: \${form.watch('city') || 'N/A'}, 
              District: \${CYPRUS_DISTRICTS[form.watch('cyprus_zone')] || 'N/A'}, 
              Code postal: \${form.watch('postal_code') || 'N/A'}
            \`.trim()
          });
          
        } else {
          // Si Google ne trouve pas, utiliser uniquement le parsing manuel
          if (manualParsed.municipality || manualParsed.district) {
            toast.warning('Extraction partielle', {
              description: 'Certains détails ont été extraits manuellement. Vérifiez les champs.'
            });
          } else {
            toast.error('Impossible d\\'extraire tous les détails', {
              description: 'Vérifiez que l\\'adresse est complète et valide'
            });
          }
        }
      });
      
    } catch (error) {
      console.error('Erreur extraction:', error);
      toast.error('Erreur lors de l\\'extraction');
    }
  };
`;

// ===============================================
// SECTION 3: MISE À JOUR DES CHAMPS STREET NUMBER ET STREET NAME
// Remplacer la section dans renderLocationStep (environ ligne 2400)
// ===============================================

export const improvedStreetFields = `
  {/* Numéro et rue - NOUVEAU: champs séparés mais liés */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <FormField
      control={form.control}
      name="street_number"
      render={({ field }) => (
        <FormItem className="md:col-span-1">
          <FormLabel>Numéro</FormLabel>
          <FormControl>
            <Input 
              placeholder="Ex: 45"
              {...field}
              onChange={(e) => {
                field.onChange(e.target.value);
                // Mettre à jour street_address automatiquement
                const streetName = form.watch('street_name') || '';
                const fullAddress = e.target.value && streetName
                  ? \`\${e.target.value} \${streetName}\`
                  : streetName;
                form.setValue('street_address', fullAddress);
              }}
              className="bg-gray-50"
            />
          </FormControl>
          <FormDescription>N° de rue</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="street_name"
      render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Rue</FormLabel>
          <FormControl>
            <Input 
              placeholder="Ex: Poseidonos Avenue"
              {...field}
              onChange={(e) => {
                field.onChange(e.target.value);
                // Mettre à jour street_address automatiquement
                const streetNumber = form.watch('street_number') || '';
                const fullAddress = streetNumber && e.target.value
                  ? \`\${streetNumber} \${e.target.value}\`
                  : e.target.value;
                form.setValue('street_address', fullAddress);
              }}
              className="bg-gray-50"
            />
          </FormControl>
          <FormDescription>Nom de la rue</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>

  {/* Champ caché pour stocker l'adresse complète pour la DB */}
  <input 
    type="hidden" 
    {...form.register('street_address')}
  />
`;

// ===============================================
// SECTION 4: INITIALISATION DES CHAMPS AU CHARGEMENT
// Ajouter après les imports
// ===============================================

export const initializeAddressFields = `
  // Initialiser les champs street_number et street_name depuis street_address si nécessaire
  useEffect(() => {
    const streetAddress = form.watch('street_address');
    if (streetAddress && !form.watch('street_number') && !form.watch('street_name')) {
      const match = streetAddress.match(/^(\\d+[A-Za-z]?)\\s+(.+)$/);
      if (match) {
        form.setValue('street_number', match[1]);
        form.setValue('street_name', match[2]);
      } else {
        form.setValue('street_name', streetAddress);
      }
    }
  }, [form.watch('street_address')]);
`;

// Export des constantes pour réutilisation
export { CYPRUS_DISTRICTS } from '@/utils/cyprusAddressHelper';
