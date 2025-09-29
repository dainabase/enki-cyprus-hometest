import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BuildingFormData } from '@/types/building';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';

interface SecurityStepProps {
  form: UseFormReturn<BuildingFormData>;
}

export const SecurityStep: React.FC<SecurityStepProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
          <Shield className="h-6 w-6 text-blue-500" />
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
          { name: 'has_concierge', label: 'Concierge' },
          { name: 'has_security_door', label: 'Porte sécurisée' },
          { name: 'concierge_service', label: 'Service de conciergerie' }
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
  );
};