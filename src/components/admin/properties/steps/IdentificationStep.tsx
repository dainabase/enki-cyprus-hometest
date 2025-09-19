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
  projects?: any[];
  buildings?: any[];
}

export const IdentificationStep: React.FC<IdentificationStepProps> = ({ form, projects: propsProjects, buildings: propsBuildings }) => {
  const selectedProjectId = form.watch('project_id');

  // Fetch projects if not provided via props
  const { data: fetchedProjects = [] } = useQuery({
    queryKey: ['projects-for-property'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects_clean')
        .select('id, title')
        .order('title');
      if (error) throw error;
      return data;
    },
    enabled: !propsProjects
  });

  // Fetch buildings if not provided via props
  const { data: fetchedBuildings = [] } = useQuery({
    queryKey: ['buildings-for-property', selectedProjectId],
    queryFn: async () => {
      if (!selectedProjectId) return [];
      const { data } = await supabase
        .from('buildings_enhanced')
        .select('id, building_code, building_type, project_id')
        .eq('project_id', selectedProjectId);
      return data || [];
    },
    enabled: !!selectedProjectId && !propsBuildings
  });

  // Use provided props or fetched data
  const availableProjects = propsProjects || fetchedProjects;
  const availableBuildings = propsBuildings || fetchedBuildings;

  return (
    <div className="space-y-8">
      <Card className="border-2 border-slate-300 shadow-lg hover:shadow-xl transition-all duration-200">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-t-lg border-b border-slate-200">
          <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
            🏗️ Identification de la Propriété
          </CardTitle>
          <CardDescription className="text-slate-600">
            Informations de base pour identifier de manière unique cette propriété
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          {/* Project Selection */}
          <FormField
            control={form.control}
            name="project_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-slate-700 flex items-center gap-2">
                  🏢 Projet *
                </FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value || null);
                    // Reset building when project changes
                    form.setValue('building_id', '');
                  }} 
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm">
                      <SelectValue placeholder="Sélectionner un projet" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableProjects.map(project => (
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

          {/* Building Selection */}
          <FormField
            control={form.control}
            name="building_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-slate-700 flex items-center gap-2">
                  🏢 Bâtiment
                </FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(value === 'none' ? null : value)} 
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
                    {availableBuildings.map(building => (
                      <SelectItem key={building.id} value={building.id}>
                        {building.building_code}
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

          {/* Unit Code */}
          <FormField
            control={form.control}
            name="unit_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-slate-700 flex items-center gap-2">
                  🔢 Code de l'Unité *
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: A101, B203, Villa-01" 
                    {...field}
                    className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                  />
                </FormControl>
                <FormDescription>
                  Code unique pour identifier cette unité (appartement, villa, etc.)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Property Type */}
          <FormField
            control={form.control}
            name="property_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-slate-700 flex items-center gap-2">
                  🏠 Type de Propriété *
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm">
                      <SelectValue placeholder="Choisir le type" />
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

          {/* Floor Number */}
          <FormField
            control={form.control}
            name="floor_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-slate-700 flex items-center gap-2">
                  🏗️ Étage
                </FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    placeholder="0 pour RDC, -1 pour sous-sol"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                    className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                  />
                </FormControl>
                <FormDescription>
                  Numéro d'étage (0 = rez-de-chaussée, -1 = sous-sol)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
};