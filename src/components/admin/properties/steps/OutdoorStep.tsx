import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { PropertyFormData } from '@/schemas/property.schema';

interface OutdoorStepProps {
  form: UseFormReturn<PropertyFormData>;
}

const viewTypes = [
  { value: 'sea', label: 'Vue mer' },
  { value: 'mountain', label: 'Vue montagne' },
  { value: 'city', label: 'Vue ville' },
  { value: 'garden', label: 'Vue jardin' },
  { value: 'pool', label: 'Vue piscine' },
  { value: 'street', label: 'Vue rue' }
];

export const OutdoorStep: React.FC<OutdoorStepProps> = ({ form }) => {
  const selectedViewTypes = form.watch('view_type') || [];

  const handleViewTypeChange = (viewType: string, checked: boolean) => {
    const current = selectedViewTypes;
    if (checked) {
      form.setValue('view_type', [...current, viewType] as any);
    } else {
      form.setValue('view_type', current.filter(item => item !== viewType) as any);
    }
  };

  return (
    <div className="space-y-6">
      {/* Balcons et Terrasses */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-4">Balcons et terrasses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="balcony_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de balcons</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    max="10" 
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
            name="balcony_area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Surface des balcons (m²)</FormLabel>
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
            name="terrace_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de terrasses</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    max="10" 
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
            name="terrace_area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Surface des terrasses (m²)</FormLabel>
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
      </div>

      {/* Jardin et Piscine */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-4">Jardin et piscine</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="has_private_garden"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Jardin privé</FormLabel>
                  <FormDescription>
                    La propriété dispose d'un jardin privé
                  </FormDescription>
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
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Piscine privée</FormLabel>
                  <FormDescription>
                    La propriété dispose d'une piscine privée
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {form.watch('has_private_pool') && (
          <div className="mt-4">
            <FormField
              control={form.control}
              name="pool_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de piscine</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="private">Privée</SelectItem>
                      <SelectItem value="shared">Partagée</SelectItem>
                      <SelectItem value="communal">Communale</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>

      {/* Parking et Stockage */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-4">Parking et stockage</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="parking_spaces"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de places de parking</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    max="10" 
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
            name="parking_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de parking</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="garage">Garage fermé</SelectItem>
                    <SelectItem value="covered">Couvert</SelectItem>
                    <SelectItem value="uncovered">Découvert</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="storage_spaces"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de caves/débarras</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    max="10" 
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
            name="storage_area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Surface de stockage (m²)</FormLabel>
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
      </div>

      {/* Vues */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-4">Types de vues</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {viewTypes.map((viewType) => (
            <div key={viewType.value} className="flex items-center space-x-2">
              <Checkbox
                id={viewType.value}
                checked={selectedViewTypes.includes(viewType.value as any)}
                onCheckedChange={(checked) => handleViewTypeChange(viewType.value, checked as boolean)}
              />
              <label htmlFor={viewType.value} className="text-sm font-medium">
                {viewType.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};