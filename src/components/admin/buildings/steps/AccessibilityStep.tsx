import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BuildingFormData } from '@/types/building';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Accessibility } from 'lucide-react';

interface AccessibilityStepProps {
  form: UseFormReturn<BuildingFormData>;
}

export const AccessibilityStep: React.FC<AccessibilityStepProps> = ({ form }) => {
  return (
    <div className="space-y-8">
      {/* Style compact et professionnel comme Infrastructure */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
            <Accessibility className="h-6 w-6 text-blue-500" />
            Accessibilité PMR
          </h2>
          <p className="text-slate-500 mt-2">
            Équipements d'accessibilité pour personnes à mobilité réduite
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'wheelchair_accessible', label: 'Accessible en fauteuil roulant' },
            { name: 'braille_signage', label: 'Signalétique braille' },
            { name: 'audio_assistance', label: 'Assistance audio' },
            { name: 'ramp_access', label: 'Accès rampe' },
            { name: 'wide_doorways', label: 'Portes larges' },
            { name: 'accessible_elevator', label: 'Ascenseur accessible' }
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

          {/* Champ numérique intégré dans le même style */}
          <Card>
            <CardContent className="p-4">
              <FormField
                control={form.control}
                name="accessible_bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Salles de bain accessibles</FormLabel>
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
        </div>
      </div>
    </div>
  );
};
