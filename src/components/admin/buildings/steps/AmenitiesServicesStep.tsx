import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BuildingFormData } from '@/types/building';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Home, Coffee, Waves, Car as ParkingCircle } from 'lucide-react';

interface AmenitiesServicesStepProps {
  form: UseFormReturn<BuildingFormData>;
}

export const AmenitiesServicesStep: React.FC<AmenitiesServicesStepProps> = ({ form }) => {
  const hasParking = form.watch('has_parking');

  return (
    <div className="space-y-8">
      {/* Section Parking Consolidée */}
      <Card className="border-2 border-slate-300 shadow-lg hover:shadow-xl transition-all duration-200">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-3">
            <ParkingCircle className="h-6 w-6 text-blue-500" />
            Parking
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Configuration complète du parking
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          {/* Switch principal parking */}
          <Card className="border-2 border-slate-200">
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="has_parking"
                render={({ field: formField }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel className="text-base cursor-pointer font-semibold">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-2 border-slate-200">
                <CardContent className="p-6">
                  <FormField
                    control={form.control}
                    name="parking_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-slate-700">Type de parking</FormLabel>
                        <FormControl>
                          <Select value={field.value || ''} onValueChange={field.onChange}>
                            <SelectTrigger className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm">
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

              <Card className="border-2 border-slate-200">
                <CardContent className="p-6">
                  <FormField
                    control={form.control}
                    name="nombre_places_parking"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-slate-700">Nombre total de places</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min="0"
                            value={field.value || ''}
                            placeholder="50"
                            className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="border-2 border-slate-200">
                <CardContent className="p-6">
                  <FormField
                    control={form.control}
                    name="parking_visiteurs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-slate-700">Places visiteurs</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min="0"
                            value={field.value || ''}
                            placeholder="10"
                            className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="border-2 border-slate-200">
                <CardContent className="p-6">
                  <FormField
                    control={form.control}
                    name="disabled_parking_spaces"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-slate-700">Places handicapés (PMR)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min="0"
                            value={field.value || ''}
                            placeholder="2"
                            className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="border-2 border-slate-200">
                <CardContent className="p-6">
                  <FormField
                    control={form.control}
                    name="nombre_box_fermes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-slate-700">Box fermés</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min="0"
                            value={field.value || ''}
                            placeholder="20"
                            className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
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
        </CardContent>
      </Card>

      {/* Section Équipements communs */}
      <Card className="border-2 border-slate-300 shadow-lg hover:shadow-xl transition-all duration-200">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-3">
            <Home className="h-6 w-6 text-green-500" />
            Équipements communs
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Équipements et installations partagés
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'has_pool', label: 'Piscine' },
              { name: 'has_gym', label: 'Salle de sport' },
              { name: 'has_spa', label: 'Spa & Bien-être' },
              { name: 'has_playground', label: 'Aire de jeux' },
              { name: 'has_garden', label: 'Jardin' },
              { name: 'shuttle_service', label: 'Service navette' }
            ].map((field) => (
              <Card key={field.name} className="border-2 border-slate-200 hover:border-primary hover:shadow-md transition-all">
                <CardContent className="p-4">
                  <FormField
                    control={form.control}
                    name={field.name as keyof BuildingFormData}
                    render={({ field: formField }) => (
                      <FormItem className="flex items-center justify-between">
                        <FormLabel className="flex-1 cursor-pointer text-sm font-medium">
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
        </CardContent>
      </Card>

      {/* Section Services & Commerce */}
      <Card className="border-2 border-slate-300 shadow-lg hover:shadow-xl transition-all duration-200">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-3">
            <Coffee className="h-6 w-6 text-orange-500" />
            Services & Commerce
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Services et commerces disponibles
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8">
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
              <Card key={field.name} className="border-2 border-slate-200 hover:border-primary hover:shadow-md transition-all">
                <CardContent className="p-4">
                  <FormField
                    control={form.control}
                    name={field.name as keyof BuildingFormData}
                    render={({ field: formField }) => (
                      <FormItem className="flex items-center justify-between">
                        <FormLabel className="flex-1 cursor-pointer text-sm font-medium">
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
        </CardContent>
      </Card>

      {/* Section Loisirs & Sports */}
      <Card className="border-2 border-slate-300 shadow-lg hover:shadow-xl transition-all duration-200">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-3">
            <Waves className="h-6 w-6 text-cyan-500" />
            Loisirs & Sports
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Installations de loisirs et sportives
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'has_tennis_court', label: 'Court de tennis' },
              { name: 'beach_access', label: 'Accès plage' },
              { name: 'marina_access', label: 'Accès marina' },
              { name: 'golf_course', label: 'Golf' },
              { name: 'sports_facilities', label: 'Installations sportives' }
            ].map((field) => (
              <Card key={field.name} className="border-2 border-slate-200 hover:border-primary hover:shadow-md transition-all">
                <CardContent className="p-4">
                  <FormField
                    control={form.control}
                    name={field.name as keyof BuildingFormData}
                    render={({ field: formField }) => (
                      <FormItem className="flex items-center justify-between">
                        <FormLabel className="flex-1 cursor-pointer text-sm font-medium">
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
        </CardContent>
      </Card>
    </div>
  );
};
