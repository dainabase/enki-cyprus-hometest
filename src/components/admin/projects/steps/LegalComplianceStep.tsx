import React from 'react';
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

export const LegalComplianceStep: React.FC<LegalComplianceStepProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Titre de propriété</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title_deed_available"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm">Titre disponible</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="title_deed_timeline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Délai d'obtention du titre</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: 6 mois après la livraison" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="land_title_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Statut du titre foncier</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: En cours, Obtenu, En attente" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
            <h3 className="text-sm font-medium">Statut légal</h3>
            <FormField
              control={form.control}
              name="legal_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Statut légal du projet</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Conforme, En cours de régularisation" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Construction & Garanties</h3>
            <FormField
              control={form.control}
              name="construction_company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Entreprise de construction</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nom de l'entreprise" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Frais inclus</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="legal_fees_included"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm">Frais juridiques inclus</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LegalComplianceStep;
