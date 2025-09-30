import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BuildingFormData } from '@/types/building';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Shield } from 'lucide-react';

interface InfrastructureSecurityStepProps {
  form: UseFormReturn<BuildingFormData>;
}

export const InfrastructureSecurityStep: React.FC<InfrastructureSecurityStepProps> = ({ form }) => {
  return (
    <div className="space-y-8">
      {/* Section Infrastructure */}
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
            { name: 'has_intercom', label: 'Interphone' }, // ✅ GARDÉ (supprimé intercom_system)
            { name: 'package_room', label: 'Salle de colis' },
            { name: 'local_velos', label: 'Local vélos' }, // ✅ GARDÉ (supprimé bike_storage)
            { name: 'local_poussettes', label: 'Local poussettes' },
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

      {/* Section Sécurité */}
      <div className="space-y-6 pt-6 border-t">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
            <Shield className="h-6 w-6 text-red-500" />
            Sécurité
          </h2>
          <p className="text-slate-500 mt-2">
            Systèmes et services de sécurité
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'has_security_system', label: 'Système de sécurité' },
            { name: 'has_security_24_7', label: 'Sécurité 24/7' },
            { name: 'has_cctv', label: 'Vidéosurveillance (CCTV)' },
            { name: 'has_security_door', label: 'Porte sécurisée' },
            { name: 'concierge_service', label: 'Service de conciergerie' } // ✅ GARDÉ (supprimé has_concierge)
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
        </div>
      </div>
    </div>
  );
};
