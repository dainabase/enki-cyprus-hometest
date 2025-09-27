import React, { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { MapPin, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { 
  parseCompleteAddress, 
  parseGooglePlaceComponents,
  determineCityFromMunicipality,
  CYPRUS_DISTRICTS
} from '@/utils/cyprusAddressHelper';

interface AddressExtractionProps {
  form: UseFormReturn<any>;
  onExtractComplete?: () => void;
}

export const AddressExtraction: React.FC<AddressExtractionProps> = ({ form, onExtractComplete }) => {
  const [isExtracting, setIsExtracting] = useState(false);

  // Initialiser l'autocomplete Google Places
  useEffect(() => {
    if (window.google) {
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
            const lat = place.geometry.location?.lat();
            const lng = place.geometry.location?.lng();
            
            // Utiliser le helper pour parser les composants
            const parsedAddress = parseGooglePlaceComponents(place.address_components || []);
            
            // Mise à jour de l'adresse complète
            form.setValue('full_address', place.formatted_address);
            
            // Mise à jour des coordonnées GPS
            if (lat && lng) {
              form.setValue('gps_latitude', lat);
              form.setValue('gps_longitude', lng);
            }
            
            // Mise à jour de la ville (municipalité)
            if (parsedAddress.city) {
              form.setValue('city', parsedAddress.city);
            }
            
            // Mise à jour du district (zone géographique)
            if (parsedAddress.district) {
              form.setValue('cyprus_zone', parsedAddress.district);
              const districtName = CYPRUS_DISTRICTS[parsedAddress.district as keyof typeof CYPRUS_DISTRICTS];
              toast.success(`✅ District détecté: ${districtName || parsedAddress.district}`, {
                description: parsedAddress.municipality && parsedAddress.municipality !== parsedAddress.city
                  ? `Municipalité: ${parsedAddress.municipality}` 
                  : undefined
              });
            } else {
              toast.warning('District non détecté', {
                description: 'Veuillez sélectionner le district manuellement'
              });
            }
            
            // Mise à jour de l'adresse rue (concaténation pour la DB)
            const fullStreetAddress = parsedAddress.streetNumber && parsedAddress.streetName 
              ? `${parsedAddress.streetNumber} ${parsedAddress.streetName}` 
              : parsedAddress.streetName || '';
            
            if (fullStreetAddress) {
              form.setValue('street_address', fullStreetAddress);
              // Séparer aussi dans les champs individuels
              form.setValue('street_number', parsedAddress.streetNumber || '');
              form.setValue('street_name', parsedAddress.streetName || '');
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
  }, [form]);

  // Fonction d'extraction manuelle
  const handleExtractAddressDetails = async () => {
    const address = form.getValues('full_address');
    if (!address) {
      toast.error('Veuillez entrer une adresse');
      return;
    }

    setIsExtracting(true);

    try {
      // D'abord essayer le parsing manuel de l'adresse
      const manualParsed = parseCompleteAddress(address);
      
      // Variables pour stocker les valeurs finales
      let finalCity = '';
      let finalDistrict = '';
      let finalStreetAddress = '';
      let finalPostalCode = '';
      let finalNeighborhood = '';
      
      // Si on a extrait des infos depuis le parsing manuel
      if (manualParsed.streetNumber || manualParsed.municipality || manualParsed.postalCode) {
        // Mise à jour de l'adresse rue
        finalStreetAddress = manualParsed.streetNumber && manualParsed.streetName
          ? `${manualParsed.streetNumber} ${manualParsed.streetName}`
          : manualParsed.streetName;
          
        finalPostalCode = manualParsed.postalCode;
        finalDistrict = manualParsed.district;
        
        // Déterminer la ville selon le contexte chypriote
        if (manualParsed.municipality) {
          const { city, zone } = determineCityFromMunicipality(
            manualParsed.municipality, 
            manualParsed.district
          );
          
          finalCity = city;
          finalDistrict = zone || finalDistrict;
          
          // Si la municipalité est différente de la ville principale, 
          // la stocker comme quartier
          if (manualParsed.municipality !== city) {
            finalNeighborhood = manualParsed.municipality;
          }
        }
      }
      
      // Ensuite, utiliser Google Geocoding pour compléter/valider
      if (window.google && window.google.maps) {
        const geocoder = new window.google.maps.Geocoder();
        
        await new Promise<void>((resolve) => {
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
              finalCity = finalCity || googleParsed.city;
              
              if (!finalStreetAddress) {
                const googleStreetAddress = googleParsed.streetNumber && googleParsed.streetName
                  ? `${googleParsed.streetNumber} ${googleParsed.streetName}`
                  : googleParsed.streetName;
                
                finalStreetAddress = googleStreetAddress;
                
                if (googleParsed.streetNumber) {
                  form.setValue('street_number', googleParsed.streetNumber);
                }
                if (googleParsed.streetName) {
                  form.setValue('street_name', googleParsed.streetName);
                }
              } else {
                // Séparer l'adresse existante
                const match = finalStreetAddress.match(/^(\d+[A-Za-z]?)\s+(.+)$/);
                if (match) {
                  form.setValue('street_number', match[1]);
                  form.setValue('street_name', match[2]);
                } else {
                  form.setValue('street_name', finalStreetAddress);
                }
              }
              
              finalPostalCode = finalPostalCode || googleParsed.postalCode;
              finalDistrict = finalDistrict || googleParsed.district;
              
              if (!finalNeighborhood && googleParsed.municipality && 
                  googleParsed.municipality !== googleParsed.city) {
                finalNeighborhood = googleParsed.municipality;
              }
            }
            resolve();
          });
        });
      }
      
      // Mise à jour finale des champs
      if (finalCity) form.setValue('city', finalCity);
      if (finalStreetAddress) form.setValue('street_address', finalStreetAddress);
      if (finalPostalCode) form.setValue('postal_code', finalPostalCode);
      if (finalDistrict) form.setValue('cyprus_zone', finalDistrict);
      if (finalNeighborhood) form.setValue('neighborhood', finalNeighborhood);
      
      // Notification de succès avec détails
      const districtName = finalDistrict ? CYPRUS_DISTRICTS[finalDistrict as keyof typeof CYPRUS_DISTRICTS] : null;
      toast.success('✅ Détails extraits avec succès', {
        description: `Ville: ${finalCity || 'N/A'} | District: ${districtName || 'N/A'} | Code: ${finalPostalCode || 'N/A'}`
      });
      
      if (onExtractComplete) {
        onExtractComplete();
      }
      
    } catch (error) {
      console.error('Erreur extraction:', error);
      toast.error('Erreur lors de l\'extraction');
    } finally {
      setIsExtracting(false);
    }
  };

  // Fonction pour synchroniser street_number et street_name avec street_address
  const syncStreetAddress = (number?: string, name?: string) => {
    const streetNumber = number ?? form.getValues('street_number') ?? '';
    const streetName = name ?? form.getValues('street_name') ?? '';
    
    const fullAddress = streetNumber && streetName
      ? `${streetNumber} ${streetName}`
      : streetName;
      
    form.setValue('street_address', fullAddress);
  };

  return (
    <div className="space-y-4">
      {/* Adresse avec autocomplétion */}
      <FormField
        control={form.control}
        name="full_address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Adresse complète *</FormLabel>
            <div className="flex gap-2">
              <FormControl>
                <Input 
                  id="address-autocomplete"
                  placeholder="Commencez à taper ou collez une adresse complète..."
                  {...field}
                  className="flex-1"
                />
              </FormControl>
              <Button
                type="button"
                onClick={handleExtractAddressDetails}
                disabled={!field.value || isExtracting}
                variant="outline"
                size="default"
              >
                {isExtracting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Extraction...
                  </>
                ) : (
                  <>
                    <MapPin className="mr-2 h-4 w-4" />
                    Extraire
                  </>
                )}
              </Button>
            </div>
            <FormDescription>
              Exemple: "45 Poseidonos Avenue, Germasogeia, 4048 Limassol, Cyprus"
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Numéro et rue - champs séparés mais synchronisés */}
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
                    syncStreetAddress(e.target.value, undefined);
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
                    syncStreetAddress(undefined, e.target.value);
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
    </div>
  );
};

export default AddressExtraction;