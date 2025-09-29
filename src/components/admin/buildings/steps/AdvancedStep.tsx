import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BuildingFormData } from '@/types/building';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Settings } from 'lucide-react';

interface AdvancedStepProps {
  form: UseFormReturn<BuildingFormData>;
}

export const AdvancedStep: React.FC<AdvancedStepProps> = ({ form }) => {
  const handleJsonChange = (fieldName: keyof BuildingFormData, value: string) => {
    try {
      const parsed = value ? JSON.parse(value) : {};
      form.setValue(fieldName, parsed);
    } catch (error) {
      console.error(`JSON parsing error for ${fieldName}:`, error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
          <Settings className="h-6 w-6 text-blue-500" />
          Données avancées
        </h2>
        <p className="text-slate-500 mt-2">
          Données JSONB pour des informations structurées complexes
        </p>
      </div>

      <div className="space-y-6">
        {[
          { name: 'building_amenities', label: 'Équipements du bâtiment', placeholder: '{"wifi": true, "air_conditioning": "central"}' },
          { name: 'common_areas', label: 'Espaces communs', placeholder: '{"lobby": "luxurious", "rooftop": "terrace"}' },
          { name: 'security_features', label: 'Caractéristiques de sécurité', placeholder: '{"cameras": 24, "guards": 3}' },
          { name: 'wellness_facilities', label: 'Installations de bien-être', placeholder: '{"sauna": true, "hammam": false}' },
          { name: 'infrastructure', label: 'Infrastructure', placeholder: '{"fiber_optic": true, "water_tanks": 3}' },
          { name: 'outdoor_facilities', label: 'Installations extérieures', placeholder: '{"bbq_area": true, "jogging_track": "500m"}' },
          { name: 'floor_plans', label: 'Plans d\'étage', placeholder: '{"ground": "commercial", "1-5": "residential"}' }
        ].map((field) => (
          <Card key={field.name}>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name={field.name as keyof BuildingFormData}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      {field.label} (JSON)
                    </FormLabel>
                    <FormDescription>
                      Données structurées au format JSON
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        value={JSON.stringify(formField.value, null, 2)}
                        onChange={(e) => handleJsonChange(field.name as keyof BuildingFormData, e.target.value)}
                        placeholder={field.placeholder}
                        rows={4}
                        className="font-mono text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};