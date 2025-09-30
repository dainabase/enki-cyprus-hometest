import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BuildingFormData } from '@/types/building';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accessibility } from 'lucide-react';

interface AccessibilityStepProps {
  form: UseFormReturn<BuildingFormData>;
}

export const AccessibilityStep: React.FC<AccessibilityStepProps> = ({ form }) => {
  return (
    <div className="space-y-8">
      <Card className="border-2 border-slate-300 shadow-lg hover:shadow-xl transition-all duration-200">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-3">
            <Accessibility className="h-6 w-6 text-blue-500" />
            Accessibilité PMR
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Équipements d'accessibilité pour personnes à mobilité réduite
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'wheelchair_accessible', label: 'Accessible en fauteuil roulant' },
              { name: 'braille_signage', label: 'Signalétique braille' },
              { name: 'audio_assistance', label: 'Assistance audio' },
              { name: 'ramp_access', label: 'Accès rampe' },
              { name: 'wide_doorways', label: 'Portes larges' },
              { name: 'accessible_elevator', label: 'Ascenseur accessible' }
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

            <Card className="border-2 border-slate-200">
              <CardContent className="p-6">
                <FormField
                  control={form.control}
                  name="accessible_bathrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-slate-700">Salles de bain accessibles</FormLabel>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
