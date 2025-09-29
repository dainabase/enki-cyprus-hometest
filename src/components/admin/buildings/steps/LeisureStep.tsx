import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BuildingFormData } from '@/types/building';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Waves, Zap, Sailboat, TreePine, Dumbbell, Sparkles, Sun } from 'lucide-react';

interface LeisureStepProps {
  form: UseFormReturn<BuildingFormData>;
}

export const LeisureStep: React.FC<LeisureStepProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
          <Waves className="h-6 w-6 text-blue-500" />
          Loisirs & Sports
        </h2>
        <p className="text-slate-500 mt-2">
          Installations de loisirs et sportives
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { name: 'has_tennis_court', label: 'Court de tennis', icon: Zap },
          { name: 'beach_access', label: 'Accès plage', icon: Sun },
          { name: 'marina_access', label: 'Accès marina', icon: Sailboat },
          { name: 'golf_course', label: 'Golf', icon: TreePine },
          { name: 'sports_facilities', label: 'Installations sportives', icon: Dumbbell },
          { name: 'wellness_center', label: 'Centre de bien-être', icon: Sparkles }
        ].map((field) => (
          <Card key={field.name} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name={field.name as keyof BuildingFormData}
                render={({ field: formField }) => (
                  <FormItem className="flex items-center space-x-3">
                    <field.icon className="h-5 w-5 text-blue-500" />
                    <FormLabel className="flex-1 cursor-pointer text-base">
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
  );
};