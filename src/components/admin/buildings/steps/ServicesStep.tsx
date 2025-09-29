import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BuildingFormData } from '@/types/building';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Coffee, Utensils, ShoppingCart, Briefcase, Baby, Laptop, Building } from 'lucide-react';

interface ServicesStepProps {
  form: UseFormReturn<BuildingFormData>;
}

export const ServicesStep: React.FC<ServicesStepProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
          <Coffee className="h-6 w-6 text-blue-500" />
          Services & Commerce
        </h2>
        <p className="text-slate-500 mt-2">
          Services et commerces disponibles dans le bâtiment
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { name: 'restaurant', label: 'Restaurant', icon: Utensils },
          { name: 'cafe', label: 'Café', icon: Coffee },
          { name: 'mini_market', label: 'Supérette', icon: ShoppingCart },
          { name: 'business_center', label: 'Business center', icon: Briefcase },
          { name: 'kids_club', label: 'Club enfants', icon: Baby },
          { name: 'coworking_space', label: 'Espace coworking', icon: Laptop },
          { name: 'club_house', label: 'Club house', icon: Building }
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