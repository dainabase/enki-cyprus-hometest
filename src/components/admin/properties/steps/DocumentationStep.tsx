import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PropertyFormData } from '@/schemas/property.schema';

interface DocumentationStepProps {
  form: UseFormReturn<PropertyFormData>;
}

export const DocumentationStep: React.FC<DocumentationStepProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      {/* Titre de propriété */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-4">Titre de propriété</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title_deed_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Statut titre de propriété</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="available">Disponible</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="in_process">En cours de traitement</SelectItem>
                    <SelectItem value="transferred">Transféré</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Statut actuel du titre de propriété
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cadastral_reference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Référence cadastrale</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 21/372E2/17" {...field} />
                </FormControl>
                <FormDescription>
                  Numéro de parcelle cadastrale
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Permis et certificats */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-4">Permis et certificats</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="planning_permit_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro permis de construire</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: ΟΔ/2023/001234" {...field} />
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
                <FormLabel>Numéro permis de bâtir</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: ΑΔ/2023/005678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="occupancy_certificate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certificat d'occupation</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: ΠΚ/2024/000123" {...field} />
                </FormControl>
                <FormDescription>
                  Certificat de conformité d'occupation
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="energy_certificate_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro certificat énergétique</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: CY123456789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-6">
          <FormField
            control={form.control}
            name="energy_rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Classe énergétique</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="A+">A+ (Très économe)</SelectItem>
                    <SelectItem value="A">A (Économe)</SelectItem>
                    <SelectItem value="B">B (Bon)</SelectItem>
                    <SelectItem value="C">C (Moyen)</SelectItem>
                    <SelectItem value="D">D (Médiocre)</SelectItem>
                    <SelectItem value="E">E (Peu économe)</SelectItem>
                    <SelectItem value="F">F (Consommateur)</SelectItem>
                    <SelectItem value="G">G (Très consommateur)</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Classification énergétique du bien
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Descriptions */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-4">Descriptions</h3>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="public_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description publique</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Description commerciale de la propriété visible par les clients..."
                    className="min-h-24"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Cette description sera visible par les clients potentiels
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="internal_notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes internes</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Notes à usage interne (historique, remarques, contacts spéciaux...)..."
                    className="min-h-24"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Ces notes ne sont visibles que par l'équipe interne
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};