import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BuildingFormData } from '@/types/building';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Coffee, Waves, Car as ParkingCircle } from 'lucide-react';

interface AmenitiesServicesStepProps {
  form: UseFormReturn<BuildingFormData>;
}

export const AmenitiesServicesStep: React.FC<AmenitiesServicesStepProps> = ({ form }) => {
  const hasParking = form.watch('has_parking');

  return (
    <div className="space-y-8">
      {/* Section Parking Consolidée */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
            <ParkingCircle className="h-6 w-6 text-blue-500" />
            Parking
          </h2>
          <p className="text-slate-500 mt-2">
            Configuration complète du parking
          </p>
        </div>

        <div className="space-y-4">
          {/* Switch principal parking */}
          <Card>
            <CardContent className="p-4">
              <FormField
                control={form.control}
                name="has_parking"
                render={({ field: formField }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel className="flex-1 cursor-pointer text-sm">
                      Parking disponible
                    </FormLabel>
                    <FormControl>
                      <Switch
                        checked={formField.value as boolean}
                        onCheckedChange={formField.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Détails parking (affichés seulement si has_parking = true) */}
          {hasParking && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <FormField
                    control={form.control}
                    name="parking_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Type de parking</FormLabel>
                        <FormControl>
                          <Select value={field.value || ''} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="underground">Souterrain</SelectItem>
                              <SelectItem value="covered">Couvert</SelectItem>
                              <SelectItem value="outdoor">Extérieur</SelectItem>
                              <SelectItem value="mixed">Mixte</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <FormField
                    control={form.control}
                    name="nombre_places_parking"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Nombre total de places</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min="0"
                            value={field.value || ''}
                            placeholder="50"
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <FormField
                    control={form.control}
                    name="parking_visiteurs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Places visiteurs</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min="0"
                            value={field.value || ''}
                            placeholder="10"
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <FormField
                    control={form.control}
                    name="disabled_parking_spaces"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Places handicapés (PMR)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min="0"
                            value={field.value || ''}
                            placeholder="2"
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <FormField
                    control={form.control}
                    name="nombre_box_fermes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Box fermés</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min="0"
                            value={field.value || ''}
                            placeholder="20"
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Section Équipements communs */}
      <div className="space-y-6 pt-6 border-t">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
            <Home className="h-6 w-6 text-green-500" />
            Équipements communs
          </h2>
          <p className="text-slate-500 mt-2">
            Équipements et installations partagés
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'has_pool', label: 'Piscine' },
            { name: 'has_gym', label: 'Salle de sport' },
            { name: 'has_spa', label: 'Spa & Bien-être' },
            { name: 'has_playground', label: 'Aire de jeux' },
            { name: 'has_garden', label: 'Jardin' },
            { name: 'shuttle_service', label: 'Service navette' }
          ].map((field) => (
            <Card key={field.name}>
              <CardContent className="p-4">
                <FormField
                  control={form.control}
                  name={field.name as keyof BuildingFormData}
                  render={({ field: formField }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel className="flex-1 cursor-pointer text-sm">
                        {field.label}
                      </FormLabel>
                      <FormControl>
                        <Switch
                          checked={formField.value as boolean}
                          onCheckedChange={formField.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Section Services & Commerce */}
      <div className="space-y-6 pt-6 border-t">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
            <Coffee className="h-6 w-6 text-orange-500" />
            Services & Commerce
          </h2>
          <p className="text-slate-500 mt-2">
            Services et commerces disponibles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'restaurant', label: 'Restaurant' },
            { name: 'cafe', label: 'Café' },
            { name: 'mini_market', label: 'Supérette' },
            { name: 'business_center', label: 'Business center' },
            { name: 'kids_club', label: 'Club enfants' },
            { name: 'coworking_space', label: 'Espace coworking' },
            { name: 'club_house', label: 'Club house' }
          ].map((field) => (
            <Card key={field.name}>
              <CardContent className="p-4">
                <FormField
                  control={form.control}
                  name={field.name as keyof BuildingFormData}
                  render={({ field: formField }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel className="flex-1 cursor-pointer text-sm">
                        {field.label}
                      </FormLabel>
                      <FormControl>
                        <Switch
                          checked={formField.value as boolean}
                          onCheckedChange={formField.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Section Loisirs & Sports */}
      <div className="space-y-6 pt-6 border-t">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
            <Waves className="h-6 w-6 text-cyan-500" />
            Loisirs & Sports
          </h2>
          <p className="text-slate-500 mt-2">
            Installations de loisirs et sportives
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'has_tennis_court', label: 'Court de tennis' },
            { name: 'beach_access', label: 'Accès plage' },
            { name: 'marina_access', label: 'Accès marina' },
            { name: 'golf_course', label: 'Golf' },
            { name: 'sports_facilities', label: 'Installations sportives' }
          ].map((field) => (
            <Card key={field.name}>
              <CardContent className="p-4">
                <FormField
                  control={form.control}
                  name={field.name as keyof BuildingFormData}
                  render={({ field: formField }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel className="flex-1 cursor-pointer text-sm">
                        {field.label}
                      </FormLabel>
                      <FormControl>
                        <Switch
                          checked={formField.value as boolean}
                          onCheckedChange={formField.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
