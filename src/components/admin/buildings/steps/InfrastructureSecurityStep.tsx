import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BuildingFormData } from '@/types/building';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Zap, Shield } from 'lucide-react';

interface InfrastructureSecurityStepProps {
  form: UseFormReturn<BuildingFormData>;
}

export const InfrastructureSecurityStep: React.FC<InfrastructureSecurityStepProps> = ({ form }) => {
  return (
    <div className="space-y-8">
      {/* Section Infrastructure */}
      <Card className="border-2 border-slate-300 shadow-lg hover:shadow-xl transition-all duration-200">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-3">
            <Zap className="h-6 w-6 text-blue-500" />
            Infrastructure technique
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Systèmes et équipements techniques du bâtiment
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'has_generator', label: 'Générateur' },
              { name: 'has_solar_panels', label: 'Panneaux solaires' },
              { name: 'central_vacuum_system', label: 'Aspiration centralisée' },
              { name: 'water_softener_system', label: 'Adoucisseur d\'eau' },
              { name: 'water_purification_system', label: 'Purification d\'eau' },
              { name: 'smart_building_system', label: 'Bâtiment intelligent' },
              { name: 'has_intercom', label: 'Interphone' },
              { name: 'package_room', label: 'Salle de colis' },
              { name: 'local_velos', label: 'Local vélos' },
              { name: 'local_poussettes', label: 'Local poussettes' },
              { name: 'pet_washing_station', label: 'Station lavage animaux' },
              { name: 'car_wash_area', label: 'Zone lavage voiture' }
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
          </div>
        </CardContent>
      </Card>

      {/* Section Sécurité - MÊME STYLE QUE INFRASTRUCTURE */}
      <Card className="border-2 border-slate-300 shadow-lg hover:shadow-xl transition-all duration-200">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-3">
            <Shield className="h-6 w-6 text-red-500" />
            Sécurité
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Systèmes et services de sécurité
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'has_security_system', label: 'Système de sécurité' },
              { name: 'has_security_24_7', label: 'Sécurité 24/7' },
              { name: 'has_cctv', label: 'Vidéosurveillance (CCTV)' },
              { name: 'has_security_door', label: 'Porte sécurisée' },
              { name: 'concierge_service', label: 'Service de conciergerie' }
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
