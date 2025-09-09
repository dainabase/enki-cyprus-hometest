import React, { useState, useRef, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Search } from 'lucide-react';
import { useGoogleMapsGlobal } from '@/hooks/useGoogleMaps';

interface AddressAutocompleteProps {
  form: any;
  onAddressSelect?: (addressData: AddressData) => void;
}

interface AddressData {
  fullAddress: string;
  city: string;
  region: string;
  neighborhood: string;
  postalCode: string;
  country: string;
  latitude: number;
  longitude: number;
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({ 
  form, 
  onAddressSelect 
}) => {
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const autocompleteRef = useRef<HTMLInputElement>(null);
  const { isLoaded } = useGoogleMapsGlobal();

  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);

  useEffect(() => {
    if (isLoaded && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      
      // Create a dummy div for PlacesService
      const mapDiv = document.createElement('div');
      const map = new window.google.maps.Map(mapDiv);
      placesService.current = new window.google.maps.places.PlacesService(map);
    }
  }, [isLoaded]);

  useEffect(() => {
    // Initialize with current value from form
    const currentAddress = form.getValues('full_address');
    if (currentAddress) {
      setInputValue(currentAddress);
    }
  }, [form]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    form.setValue('full_address', value);

    if (value.length > 2 && autocompleteService.current) {
      const request = {
        input: value,
        componentRestrictions: { country: 'cy' }, // Restrict to Cyprus
        types: ['address']
      };

      autocompleteService.current.getPlacePredictions(request, (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setPredictions(predictions);
          setShowPredictions(true);
        } else {
          setPredictions([]);
          setShowPredictions(false);
        }
      });
    } else {
      setShowPredictions(false);
    }
  };

  const selectPrediction = (prediction: google.maps.places.AutocompletePrediction) => {
    if (!placesService.current) return;

    const request = {
      placeId: prediction.place_id,
      fields: ['address_components', 'formatted_address', 'geometry', 'name']
    };

    placesService.current.getDetails(request, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
        const addressData = parseGooglePlaceResult(place);
        
        // Update form fields
        setInputValue(addressData.fullAddress);
        form.setValue('full_address', addressData.fullAddress);
        form.setValue('city', addressData.city);
        form.setValue('region', addressData.region);
        form.setValue('neighborhood', addressData.neighborhood);
        form.setValue('gps_latitude', addressData.latitude);
        form.setValue('gps_longitude', addressData.longitude);
        
        // Map region to cyprus_zone
        const cyprusZone = mapRegionToCyprusZone(addressData.region, addressData.city);
        form.setValue('cyprus_zone', cyprusZone);

        setShowPredictions(false);
        
        if (onAddressSelect) {
          onAddressSelect(addressData);
        }
      }
    });
  };

  const parseGooglePlaceResult = (place: google.maps.places.PlaceResult): AddressData => {
    const components = place.address_components || [];
    let city = '';
    let region = '';
    let neighborhood = '';
    let postalCode = '';
    let country = '';

    components.forEach(component => {
      const types = component.types;
      
      if (types.includes('locality') || types.includes('administrative_area_level_3')) {
        city = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        region = component.long_name;
      } else if (types.includes('sublocality') || types.includes('neighborhood')) {
        neighborhood = component.long_name;
      } else if (types.includes('postal_code')) {
        postalCode = component.long_name;
      } else if (types.includes('country')) {
        country = component.long_name;
      }
    });

    return {
      fullAddress: place.formatted_address || '',
      city: city || extractCityFromAddress(place.formatted_address || ''),
      region: region || 'Cyprus',
      neighborhood: neighborhood || '',
      postalCode: postalCode || '',
      country: country || 'Cyprus',
      latitude: place.geometry?.location?.lat() || 0,
      longitude: place.geometry?.location?.lng() || 0
    };
  };

  const extractCityFromAddress = (address: string): string => {
    // Simple extraction for Cyprus cities
    const cyprusCities = ['Limassol', 'Paphos', 'Larnaca', 'Nicosia', 'Famagusta', 'Kyrenia'];
    const foundCity = cyprusCities.find(city => address.includes(city));
    return foundCity || '';
  };

  const mapRegionToCyprusZone = (region: string, city: string): string => {
    const cityLower = city.toLowerCase();
    
    if (cityLower.includes('limassol')) return 'limassol';
    if (cityLower.includes('paphos')) return 'paphos';
    if (cityLower.includes('larnaca')) return 'larnaca';
    if (cityLower.includes('nicosia') || cityLower.includes('lefkosia')) return 'nicosia';
    if (cityLower.includes('famagusta') || cityLower.includes('ammochostos')) return 'famagusta';
    if (cityLower.includes('kyrenia') || cityLower.includes('girne')) return 'kyrenia';
    
    return 'limassol'; // Default fallback
  };

  if (!isLoaded) {
    return (
      <FormField
        control={form.control}
        name="full_address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Adresse complète</FormLabel>
            <FormControl>
              <Input 
                placeholder="Chargement de l'autocomplétion..." 
                disabled 
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  return (
    <div className="relative">
      <FormField
        control={form.control}
        name="full_address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Adresse complète *
              <span className="text-xs text-muted-foreground">(remplit automatiquement les champs ci-dessous)</span>
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  ref={autocompleteRef}
                  placeholder="Tapez pour rechercher une adresse à Chypre..."
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onFocus={() => {
                    if (predictions.length > 0) {
                      setShowPredictions(true);
                    }
                  }}
                  className="pr-10"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Predictions Dropdown */}
      {showPredictions && predictions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {predictions.map((prediction) => (
            <Button
              key={prediction.place_id}
              variant="ghost"
              className="w-full justify-start p-3 h-auto text-left hover:bg-gray-50"
              onClick={() => selectPrediction(prediction)}
            >
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm">
                    {prediction.structured_formatting.main_text}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {prediction.structured_formatting.secondary_text}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};