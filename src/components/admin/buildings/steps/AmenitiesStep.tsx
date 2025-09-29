import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BuildingFormData } from '@/types/building';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Home } from 'lucide-react';

interface AmenitiesStepProps {
  form: UseFormReturn<BuildingFormData>;
}

export const AmenitiesStep: React.FC<AmenitiesStepProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
          <Home className="h-6 w-6 text-blue-500" />
          Équipements communs
        </h2>
        <p className="text-slate-500 mt-2">
          Équipements et installations partagés
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { name: 'has_pool', label: 'Piscine' },
          { name: 'has_gym', label: 'Salle de sport' },
          { name: 'has_spa', label: 'Spa' },
          { name: 'has_playground', label: 'Aire de jeux' },
          { name: 'has_garden', label: 'Jardin' },
          { name: 'has_parking', label: 'Parking' },
          { name: 'shuttle_service', label: 'Service navette' }
        ].map((field) => (
          <Card key={field.name}>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name={field.name as keyof BuildingFormData}
                render={({ field: formField }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4 bg-slate-50">
                    <FormLabel className="text-base cursor-pointer">
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

        <Card>
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="parking_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de parking</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
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
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="disabled_parking_spaces"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Places parking PMR</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      placeholder="2"
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};