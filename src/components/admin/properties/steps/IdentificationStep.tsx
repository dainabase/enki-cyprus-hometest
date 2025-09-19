import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { PropertyFormData } from '@/schemas/property.schema';

interface IdentificationStepProps {
  form: UseFormReturn<PropertyFormData>;
}

export const IdentificationStep: React.FC<IdentificationStepProps> = ({ form }) => {
  const selectedProjectId = form.watch('project_id');

  // Fetch projects
  const { data: projects = [] } = useQuery({
    queryKey: ['projects-for-property'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, title')
        .order('title');
      if (error) throw error;
      return data;
    }
  });

  // Fetch buildings filtered by project
  const { data: buildings = [] } = useQuery({
    queryKey: ['buildings-for-property', selectedProjectId],
    queryFn: async () => {
      if (!selectedProjectId) return [];
      const { data, error } = await supabase
        .from('buildings')
        .select('id, name, building_name')
        .eq('project_id', selectedProjectId)
        .order('name');
      if (error) throw error;
      return data;
    },
    enabled: !!selectedProjectId
  });

  return (
    <div className="space-y-8">
      <Card className="border-2 border-slate-300 shadow-lg hover:shadow-xl transition-all duration-200">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
          <CardTitle className="text-xl font-semibold text-foreground">Identification</CardTitle>
          <CardDescription className="text-muted-foreground">Informations de base de la propriété</CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          {/* Projet et Bâtiment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormField
          control={form.control}
          name="project_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Projet *</FormLabel>
              <Select 
                onValueChange={(value) => field.onChange(value || null)} 
                value={field.value || ""}
              >
                <FormControl>
                  <SelectTrigger className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm">
                    <SelectValue placeholder="Sélectionner un projet" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="building_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bâtiment</FormLabel>
              <Select 
                onValueChange={(value) => field.onChange(value === "none" ? null : value)} 
                value={field.value || "none"}
                disabled={!selectedProjectId}
              >
                <FormControl>
                  <SelectTrigger className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm">
                    <SelectValue placeholder="Sélectionner un bâtiment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Aucun (villa individuelle)</SelectItem>
                  {buildings.map(building => (
                    <SelectItem key={building.id} value={building.id}>
                      {building.building_name || building.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Laissez vide pour une villa individuelle
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
          </div>

          {/* Unité et Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormField
          control={form.control}
          name="unit_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro d'unité *</FormLabel>
              <FormControl>
                <Input placeholder="Ex: A-101, Villa 5" {...field} className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm" />
              </FormControl>
              <FormDescription>
                Format: Bloc-Étage-Numéro ou nom de villa
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="property_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code propriété</FormLabel>
              <FormControl>
                <Input placeholder="Ex: MT-A101-2025" {...field} className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm" />
              </FormControl>
              <FormDescription>
                Code interne pour référence
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
          </div>

          {/* Type et Statut */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name="property_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de propriété *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="apartment">Appartement</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="penthouse">Penthouse</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="townhouse">Maison de ville</SelectItem>
                  <SelectItem value="duplex">Duplex</SelectItem>
                  <SelectItem value="triplex">Triplex</SelectItem>
                  <SelectItem value="maisonette">Maisonette</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="property_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Statut *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="available">Disponible</SelectItem>
                  <SelectItem value="reserved">Réservé</SelectItem>
                  <SelectItem value="sold">Vendu</SelectItem>
                  <SelectItem value="rented">Loué</SelectItem>
                  <SelectItem value="unavailable">Indisponible</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sale_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de vente</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="sale">Vente uniquement</SelectItem>
                  <SelectItem value="rent">Location uniquement</SelectItem>
                  <SelectItem value="both">Vente et location</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
          </div>

          {/* Ownership Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormField
          control={form.control}
          name="ownership_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de propriété</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="freehold">Pleine propriété</SelectItem>
                  <SelectItem value="leasehold">Bail emphytéotique</SelectItem>
                  <SelectItem value="shared_ownership">Copropriété</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="property_sub_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sous-type</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Luxe, Standard, Économique" {...field} className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm" />
              </FormControl>
              <FormDescription>
                Catégorie ou niveau de finition
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};