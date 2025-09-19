import React, { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PropertyDBData } from '@/schemas/property-db.schema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

interface PropertyIdentificationStepProps {
  form: UseFormReturn<PropertyDBData>;
}

interface Project {
  id: string;
  title: string;
}

interface Building {
  id: string;
  name: string;
}

export const PropertyIdentificationStep: React.FC<PropertyIdentificationStepProps> = ({ form }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loadingBuildings, setLoadingBuildings] = useState(false);

  const selectedProjectId = form.watch('project_id');

  // Charger les projets
  useEffect(() => {
    const loadProjects = async () => {
      const { data } = await supabase
        .from('projects_clean')
        .select('id, title')
        .order('title');
      
      if (data) setProjects(data);
    };
    
    loadProjects();
  }, []);

  // Charger les bâtiments quand un projet est sélectionné
  useEffect(() => {
    const loadBuildings = async () => {
      if (!selectedProjectId) {
        setBuildings([]);
        return;
      }
      
      setLoadingBuildings(true);
      const { data } = await supabase
        .from('buildings_enhanced')
        .select('id, building_code')
        .eq('project_id', selectedProjectId)
        .order('building_code');
      
      if (data) {
        setBuildings(data.map(b => ({ id: b.id, name: b.building_code || 'Sans nom' })));
      }
      setLoadingBuildings(false);
    };
    
    loadBuildings();
  }, [selectedProjectId]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Projet */}
        <FormField
          control={form.control}
          name="project_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Projet *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un projet" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {projects.map((project) => (
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

        {/* Bâtiment */}
        <FormField
          control={form.control}
          name="building_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bâtiment</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""} disabled={!selectedProjectId || loadingBuildings}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingBuildings ? "Chargement..." : "Sélectionner un bâtiment"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {buildings.map((building) => (
                    <SelectItem key={building.id} value={building.id}>
                      {building.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Code unité */}
        <FormField
          control={form.control}
          name="unit_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code unité *</FormLabel>
              <FormControl>
                <Input placeholder="ex: A101" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Type de propriété */}
        <FormField
          control={form.control}
          name="property_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de propriété</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
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

        {/* Étage */}
        <FormField
          control={form.control}
          name="floor_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Étage</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="ex: 1" 
                  {...field} 
                  onChange={e => field.onChange(parseInt(e.target.value) || undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Statut */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Statut</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || "available"}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="available">Disponible</SelectItem>
                  <SelectItem value="reserved">Réservé</SelectItem>
                  <SelectItem value="sold">Vendu</SelectItem>
                  <SelectItem value="rented">Loué</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};