import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BuildingFormData } from '@/types/building';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap } from 'lucide-react';

interface InfrastructureStepProps {
  form: UseFormReturn<BuildingFormData>;
}

export const InfrastructureStep: React.FC<InfrastructureStepProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
          <Zap className="h-6 w-6 text-blue-500" />
          Infrastructure technique
        </h2>
        <p className="text-slate-500 mt-2">
          Systèmes et équipements techniques du bâtiment
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { name: 'has_generator', label: 'Générateur' },
          { name: 'has_solar_panels', label: 'Panneaux solaires' },
          { name: 'central_vacuum_system', label: 'Aspiration centralisée' },
          { name: 'water_softener_system', label: 'Adoucisseur d\'eau' },
          { name: 'water_purification_system', label: 'Purification d\'eau' },
          { name: 'smart_building_system', label: 'Bâtiment intelligent' },
          { name: 'intercom_system', label: 'Système interphone' },
          { name: 'has_intercom', label: 'Interphone' },
          { name: 'package_room', label: 'Salle de colis' },
          { name: 'bike_storage', label: 'Stockage vélos' },
          { name: 'pet_washing_station', label: 'Station lavage animaux' },
          { name: 'car_wash_area', label: 'Zone lavage voiture' }
        ].map((field) => (
          <Card key={field.name}>
            <CardContent className="p-4">
              <FormField
                control={form.control}
                name={field.name as keyof BuildingFormData}
                render={({ field: formField }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel className="flex-1 cursor-pointer">
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