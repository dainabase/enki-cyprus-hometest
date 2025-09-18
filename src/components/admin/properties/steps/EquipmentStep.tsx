import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PropertyFormData } from '@/schemas/property.schema';

interface EquipmentStepProps {
  form: UseFormReturn<PropertyFormData>;
}

const kitchenAppliancesList = [
  'Réfrigérateur', 'Congélateur', 'Lave-vaisselle', 'Four', 'Micro-ondes', 
  'Plaque de cuisson', 'Hotte aspirante', 'Machine à café', 'Cave à vin'
];

const smartHomeFeaturesList = [
  'Système de sécurité', 'Caméras surveillance', 'Contrôle éclairage', 
  'Thermostat intelligent', 'Interphone vidéo', 'Domotique centralisée',
  'Alarme incendie', 'Détecteurs fumée'
];

export const EquipmentStep: React.FC<EquipmentStepProps> = ({ form }) => {
  const selectedAppliances = form.watch('appliances_list') || [];
  const selectedSmartFeatures = form.watch('smart_home_features') || [];

  const handleApplianceChange = (appliance: string, checked: boolean) => {
    const current = selectedAppliances;
    if (checked) {
      form.setValue('appliances_list', [...current, appliance]);
    } else {
      form.setValue('appliances_list', current.filter(item => item !== appliance));
    }
  };

  const handleSmartFeatureChange = (feature: string, checked: boolean) => {
    const current = selectedSmartFeatures;
    if (checked) {
      form.setValue('smart_home_features', [...current, feature]);
    } else {
      form.setValue('smart_home_features', current.filter(item => item !== feature));
    }
  };

  return (
    <div className="space-y-8">
      <Card className="border-2 border-slate-300 shadow-lg hover:shadow-xl transition-all duration-200">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
          <CardTitle className="text-xl font-semibold text-foreground">Équipement</CardTitle>
          <CardDescription className="text-muted-foreground">Configuration et équipements de la propriété</CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          {/* Cuisine */}
          <div>
            <h3 className="font-semibold mb-4">Cuisine</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <FormField
                control={form.control}
                name="kitchen_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de cuisine</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                  <SelectContent>
                    <SelectItem value="separate">Séparée</SelectItem>
                    <SelectItem value="open">Ouverte</SelectItem>
                    <SelectItem value="semi_open">Semi-ouverte</SelectItem>
                    <SelectItem value="kitchen_corner">Coin cuisine</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

              <FormField
                control={form.control}
                name="kitchen_brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marque cuisine</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Ikea, Schmidt, Nobilia" {...field} className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Checkbox pour électroménager inclus */}
            <FormField
              control={form.control}
              name="has_kitchen_appliances"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium">
                      Électroménager inclus dans le prix
                    </FormLabel>
                    <FormDescription className="text-xs text-muted-foreground">
                      Cochez si les appareils de cuisine sont inclus
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel className="text-sm font-medium">Électroménager inclus</FormLabel>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {kitchenAppliancesList.map((appliance) => (
                  <div key={appliance} className="flex items-center space-x-2">
                    <Checkbox
                      id={appliance}
                      checked={selectedAppliances.includes(appliance)}
                      onCheckedChange={(checked) => handleApplianceChange(appliance, checked as boolean)}
                    />
                    <label htmlFor={appliance} className="text-sm">
                      {appliance}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chauffage et Climatisation */}
          <div>
            <h3 className="font-semibold mb-4">Chauffage et climatisation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="hvac_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de climatisation</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="central_ac">Climatisation centrale</SelectItem>
                        <SelectItem value="split_units">Unités split</SelectItem>
                        <SelectItem value="vrf_system">Système VRF</SelectItem>
                        <SelectItem value="underfloor_heating">Chauffage au sol</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="heating_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de chauffage</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                  <SelectContent>
                    <SelectItem value="electric">Électrique</SelectItem>
                    <SelectItem value="gas">Gaz</SelectItem>
                    <SelectItem value="solar">Solaire</SelectItem>
                    <SelectItem value="heat_pump">Pompe à chaleur</SelectItem>
                    <SelectItem value="none">Aucun</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
            </div>
          </div>

          {/* Finitions */}
          <div>
            <h3 className="font-semibold mb-4">Finitions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="flooring_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de sol</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                  <SelectContent>
                    <SelectItem value="tiles">Carrelage</SelectItem>
                    <SelectItem value="marble">Marbre</SelectItem>
                    <SelectItem value="parquet">Parquet</SelectItem>
                    <SelectItem value="laminate">Stratifié</SelectItem>
                    <SelectItem value="vinyl">Vinyle</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

              <FormField
                control={form.control}
                name="windows_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de fenêtres</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                  <SelectContent>
                    <SelectItem value="aluminum">Aluminium</SelectItem>
                    <SelectItem value="upvc">PVC</SelectItem>
                    <SelectItem value="wooden">Bois</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

              <FormField
                control={form.control}
                name="doors_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de portes</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                  <SelectContent>
                    <SelectItem value="wooden">Bois</SelectItem>
                    <SelectItem value="security">Sécurité</SelectItem>
                    <SelectItem value="glass">Verre</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
            </div>
          </div>

          {/* Smart Home et Sécurité */}
          <div>
            <h3 className="font-semibold mb-4">Smart Home et Sécurité</h3>
            <div>
              <FormLabel className="text-sm font-medium">Caractéristiques intelligentes</FormLabel>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {smartHomeFeaturesList.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature}
                      checked={selectedSmartFeatures.includes(feature)}
                      onCheckedChange={(checked) => handleSmartFeatureChange(feature, checked as boolean)}
                    />
                    <label htmlFor={feature} className="text-sm">
                      {feature}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};