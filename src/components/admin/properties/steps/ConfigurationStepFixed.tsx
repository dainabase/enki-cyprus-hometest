import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { UseFormReturn } from 'react-hook-form';

interface ConfigurationStepProps {
  form: UseFormReturn<any>;
}

export const ConfigurationStep: React.FC<ConfigurationStepProps> = ({ form }) => {
  return (
    <div className="space-y-8">
      {/* Configuration principale */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Configuration</CardTitle>
          <CardDescription>Chambres, surfaces et configuration générale</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Pièces principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="bedrooms"
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bathrooms"
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Surfaces */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="internal_area_m2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Surface interne (m²) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1" 
                      step="0.1"
                      {...field} 
                      onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="covered_veranda_m2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Véranda couverte (m²)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      step="0.1"
                      {...field} 
                      onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="uncovered_veranda_m2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Véranda découverte (m²)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      step="0.1"
                      {...field} 
                      onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="garden_area_m2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jardin (m²)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      step="0.1"
                      {...field} 
                      onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Orientation */}
          <FormField
            control={form.control}
            name="orientation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Orientation</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez l'orientation" />
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

        </CardContent>
      </Card>

      {/* Caractéristiques */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Caractéristiques</CardTitle>
          <CardDescription>Équipements et fonctionnalités spéciales</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="has_balcony"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <FormLabel className="font-medium">Balcon</FormLabel>
                    <p className="text-sm text-muted-foreground">Présence d'un balcon</p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="has_terrace"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <FormLabel className="font-medium">Terrasse</FormLabel>
                    <p className="text-sm text-muted-foreground">Présence d'une terrasse</p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="has_garden"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <FormLabel className="font-medium">Jardin privé</FormLabel>
                    <p className="text-sm text-muted-foreground">Jardin privé</p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="has_private_pool"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <FormLabel className="font-medium">Piscine privée</FormLabel>
                    <p className="text-sm text-muted-foreground">Piscine privée</p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="has_storage_room"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <FormLabel className="font-medium">Débarras</FormLabel>
                    <p className="text-sm text-muted-foreground">Local de rangement</p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="has_maid_room"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <FormLabel className="font-medium">Chambre de service</FormLabel>
                    <p className="text-sm text-muted-foreground">Chambre pour personnel</p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

        </CardContent>
      </Card>
    </div>
  );
};