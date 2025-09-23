import React, { useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { MapPin, Navigation } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface LocationSectionProps {
  form: UseFormReturn<any>;
}

// Zones de Chypre avec leurs codes postaux
const CYPRUS_ZONES = {
  limassol: { name: 'Limassol', postalRange: '3000-3999' },
  paphos: { name: 'Paphos', postalRange: '8000-8999' },
  larnaca: { name: 'Larnaca', postalRange: '6000-7999' },
  nicosia: { name: 'Nicosia', postalRange: '1000-2999' },
  famagusta: { name: 'Famagusta', postalRange: '5000-5999' }
};

// Fonction pour déterminer la zone selon le code postal
function detectZoneFromPostalCode(postalCode: string): string {
  if (!postalCode) return '';
  
  const code = parseInt(postalCode);
  if (isNaN(code)) return '';
  
  if (code >= 3000 && code <= 3999) return 'limassol';
  if (code >= 8000 && code <= 8999) return 'paphos';
  if (code >= 6000 && code <= 7999) return 'larnaca';
  if (code >= 1000 && code <= 2999) return 'nicosia';
  if (code >= 5000 && code <= 5999) return 'famagusta';
  
  return '';
}

// Fonction pour déterminer la ville selon le code postal
function detectCityFromPostalCode(postalCode: string): string {
  const zone = detectZoneFromPostalCode(postalCode);
  if (!zone) return '';
  
  return CYPRUS_ZONES[zone as keyof typeof CYPRUS_ZONES]?.name || '';
}

export const LocationSection: React.FC<LocationSectionProps> = ({ form }) => {
  const postalCode = form.watch('postal_code');
  
  // Auto-détection de la ville et zone quand le code postal change
  useEffect(() => {
    if (postalCode && postalCode.length === 4) {
      const detectedCity = detectCityFromPostalCode(postalCode);
      const detectedZone = detectZoneFromPostalCode(postalCode);
      
      if (detectedCity && !form.getValues('city')) {
        form.setValue('city', detectedCity);
      }
      
      if (detectedZone) {
        form.setValue('cyprus_zone', detectedZone);
        form.setValue('auto_detected_zone', true);
      }
    }
  }, [postalCode, form]);

  return (
    <div className="space-y-6">
      {/* Adresse principale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Adresse du projet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Adresse de rue */}
          <FormField
            control={form.control}
            name="street_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse de rue</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: 25 Makarios Avenue"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Numéro et nom de la rue
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Code postal */}
            <FormField
              control={form.control}
              name="postal_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code postal *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: 3012"
                      maxLength={4}
                      pattern="[0-9]*"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    4 chiffres (détection auto ville/zone)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ville */}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ville *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: Limassol"
                      {...field}
                      className={form.watch('auto_detected_zone') ? 'bg-green-50' : ''}
                    />
                  </FormControl>
                  <FormDescription>
                    {form.watch('auto_detected_zone') && '✓ Détecté automatiquement'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Zone/District */}
            <FormField
              control={form.control}
              name="cyprus_zone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zone/District *</FormLabel>
                  <Select 
                    value={field.value} 
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue('auto_detected_zone', false);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className={form.watch('auto_detected_zone') ? 'bg-green-50' : ''}>
                        <SelectValue placeholder="Sélectionner la zone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(CYPRUS_ZONES).map(([key, zone]) => (
                        <SelectItem key={key} value={key}>
                          {zone.name} ({zone.postalRange})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {form.watch('auto_detected_zone') && '✓ Zone détectée depuis le code postal'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Quartier */}
            <FormField
              control={form.control}
              name="neighborhood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quartier</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: Tourist Area, Marina"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Region */}
          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Région</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: Germasogeia, Kato Paphos"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Municipalité ou sous-région
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Coordonnées GPS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="w-5 h-5" />
            Localisation GPS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="gps_latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      step="0.000001"
                      placeholder="Ex: 34.6741"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormDescription>
                    Entre -90 et 90
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gps_longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      step="0.000001"
                      placeholder="Ex: 33.0413"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormDescription>
                    Entre -180 et 180
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 Astuce : Utilisez Google Maps pour obtenir les coordonnées exactes. 
              Faites un clic droit sur l'emplacement et copiez les coordonnées.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Proximités */}
      <Card>
        <CardHeader>
          <CardTitle>Distances stratégiques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="proximity_sea_km"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Distance de la mer (km)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      step="0.1"
                      placeholder="Ex: 0.5"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="proximity_airport_km"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Distance de l'aéroport (km)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      step="0.1"
                      placeholder="Ex: 15"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="proximity_city_center_km"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Distance du centre-ville (km)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      step="0.1"
                      placeholder="Ex: 3"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="proximity_highway_km"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Distance de l'autoroute (km)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      step="0.1"
                      placeholder="Ex: 1"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Description du quartier */}
      <Card>
        <CardHeader>
          <CardTitle>Description du quartier</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="neighborhood_description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea 
                    placeholder="Décrivez l'environnement, les commodités à proximité, l'ambiance du quartier..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Cette description aidera les clients à mieux comprendre l'emplacement
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
};
