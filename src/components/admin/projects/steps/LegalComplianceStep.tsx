import { UseFormReturn } from 'react-hook-form';
import { ProjectFormData } from '@/schemas/projectSchema';
import { Card, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface LegalComplianceStepProps {
  form: UseFormReturn<ProjectFormData>;
}

export function LegalComplianceStep({ form }: LegalComplianceStepProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Permis & Autorisations</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="planning_permit_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">N° permis de construire</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: PC-2024-12345" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="building_permit_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">N° permis d'aménagement</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: BP-2024-67890" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Construction & Garanties</h3>
            <FormField
              control={form.control}
              name="construction_warranty_details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Détails des garanties</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Décrivez les garanties de construction (garantie décennale, etc.)"
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
