import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PropertyFormData } from '@/schemas/property.schema';

interface ConfigurationStepProps {
  form: UseFormReturn<PropertyFormData>;
}

export const ConfigurationStep: React.FC<ConfigurationStepProps> = ({ form }) => {
  return (
    <div className="space-y-8">
      <Card className="border-2 border-slate-300 shadow-lg hover:shadow-xl transition-all duration-200">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
          <CardTitle className="text-xl font-semibold text-foreground">Configuration</CardTitle>
          <CardDescription className="text-muted-foreground">Agencement et caractéristiques de la propriété</CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          {/* Pièces principales */}
          <div>
            <h3 className="font-semibold mb-4">Pièces principales</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="bedrooms_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chambres *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        max="20" 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                        className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bathrooms_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salles de bain *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        max="20" 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                        className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="wc_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WC séparés</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        max="10" 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                        className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Surfaces */}
          <div>
            <h3 className="font-semibold mb-4">Surfaces (m²)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="internal_area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Surface interne *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1" 
                    step="0.1" 
                    {...field} 
                    onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                    className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                  />
                </FormControl>
                <FormDescription>Surface habitable intérieure</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

              <FormField
                control={form.control}
                name="covered_verandas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vérandas couvertes</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.1" 
                        {...field} 
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="uncovered_verandas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vérandas découvertes</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.1" 
                        {...field} 
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="private_garden_area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jardin privé</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.1" 
                        {...field} 
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Position et Orientation */}
          <div>
            <h3 className="font-semibold mb-4">Position et orientation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="floor_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Étage</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="-5" 
                        max="50" 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                        className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                      />
                    </FormControl>
                    <FormDescription>-1 pour sous-sol, 0 pour RDC</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position_in_floor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position dans l'étage</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Droite, Gauche, Centre" {...field} className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="orientation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Orientation</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="north">Nord</SelectItem>
                        <SelectItem value="south">Sud</SelectItem>
                        <SelectItem value="east">Est</SelectItem>
                        <SelectItem value="west">Ouest</SelectItem>
                        <SelectItem value="north_east">Nord-Est</SelectItem>
                        <SelectItem value="north_west">Nord-Ouest</SelectItem>
                        <SelectItem value="south_east">Sud-Est</SelectItem>
                        <SelectItem value="south_west">Sud-Ouest</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Pièces additionnelles */}
          <div>
            <h3 className="font-semibold mb-4">Pièces additionnelles</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="has_office"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Bureau</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="has_maid_room"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Chambre service</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="has_dressing_room"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Dressing</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="has_laundry_room"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Buanderie</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="has_playroom"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Salle de jeu</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="has_wine_cellar"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Cave à vin</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="has_pantry"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Garde-manger</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};