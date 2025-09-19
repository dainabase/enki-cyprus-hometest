import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PropertyDBData } from '@/schemas/property-db.schema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

interface PropertyConfigurationStepProps {
  form: UseFormReturn<PropertyDBData>;
}

export const PropertyConfigurationStep: React.FC<PropertyConfigurationStepProps> = ({ form }) => {
  return (
    <div className="space-y-8">
      
      {/* Pièces principales */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Pièces principales</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <FormField
            control={form.control}
            name="bedrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chambres</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    {...field} 
                    onChange={e => field.onChange(parseInt(e.target.value) || undefined)}
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
                <FormLabel>Salles de bain</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    {...field} 
                    onChange={e => field.onChange(parseInt(e.target.value) || undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="wc_separate"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>WC séparés</FormLabel>
                </div>
                <FormControl>
                  <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Surfaces */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Surfaces (m²)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <FormField
            control={form.control}
            name="internal_area_m2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Surface interne</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.1" 
                    {...field} 
                    onChange={e => field.onChange(parseFloat(e.target.value) || undefined)}
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
                <FormLabel>Véranda couverte</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.1" 
                    {...field} 
                    onChange={e => field.onChange(parseFloat(e.target.value) || undefined)}
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
                <FormLabel>Véranda découverte</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.1" 
                    {...field} 
                    onChange={e => field.onChange(parseFloat(e.target.value) || undefined)}
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
                <FormLabel>Jardin privé</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.1" 
                    {...field} 
                    onChange={e => field.onChange(parseFloat(e.target.value) || undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="roof_terrace_m2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Terrasse toit</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.1" 
                    {...field} 
                    onChange={e => field.onChange(parseFloat(e.target.value) || undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="storage_area_m2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Surface stockage</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.1" 
                    {...field} 
                    onChange={e => field.onChange(parseFloat(e.target.value) || undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Caractéristiques */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Caractéristiques</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          
          <FormField
            control={form.control}
            name="has_balcony"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <FormLabel className="text-sm">Balcon</FormLabel>
                <FormControl>
                  <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="has_terrace"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <FormLabel className="text-sm">Terrasse</FormLabel>
                <FormControl>
                  <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="has_garden"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <FormLabel className="text-sm">Jardin</FormLabel>
                <FormControl>
                  <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="has_private_pool"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <FormLabel className="text-sm">Piscine privée</FormLabel>
                <FormControl>
                  <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="has_jacuzzi"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <FormLabel className="text-sm">Jacuzzi</FormLabel>
                <FormControl>
                  <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="has_fireplace"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <FormLabel className="text-sm">Cheminée</FormLabel>
                <FormControl>
                  <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="has_storage_room"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <FormLabel className="text-sm">Débarras</FormLabel>
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
                <FormLabel className="text-sm">Chambre service</FormLabel>
                <FormControl>
                  <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Parking */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Parking</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <FormField
            control={form.control}
            name="has_parking_space"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <FormLabel>Place de parking</FormLabel>
                <FormControl>
                  <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="parking_spaces_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de places</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    {...field} 
                    onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};