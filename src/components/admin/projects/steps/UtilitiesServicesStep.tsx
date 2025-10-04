import { UseFormReturn } from 'react-hook-form';
import { ProjectFormData } from '@/schemas/projectSchema';
import { Card, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface UtilitiesServicesStepProps {
  form: UseFormReturn<ProjectFormData>;
}

export function UtilitiesServicesStep({ form }: UtilitiesServicesStepProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Raccordements</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gas_connection_available"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm">Gaz disponible</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fiber_optic_available"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm">Fibre optique disponible</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Frais de maintenance annuels</h3>
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="pool_maintenance_fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Entretien piscine (€)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="security_service_fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Service sécurité (€)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="garden_maintenance_fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Entretien espaces verts (€)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Ces frais seront répercutés aux propriétaires pour l'entretien des parties communes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
