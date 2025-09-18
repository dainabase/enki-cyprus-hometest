import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PropertyFormStepsSimpleProps {
  form: UseFormReturn<any>;
  currentStep: string;
}

export const PropertyFormStepsSimple: React.FC<PropertyFormStepsSimpleProps> = ({ form, currentStep }) => {
  // Fetch projects
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, title')
        .order('title');
      if (error) throw error;
      return data;
    }
  });

  // Fetch buildings
  const { data: buildings = [] } = useQuery({
    queryKey: ['buildings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('buildings')
        .select('id, name, building_name')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  const renderIdentificationStep = () => (
    <Card>
      <CardHeader>
        <CardTitle>Identification de la propriété</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Project Selection */}
          <div className="space-y-2">
            <Label htmlFor="project_id">Projet *</Label>
            <Select
              value={form.watch('project_id')}
              onValueChange={(value) => form.setValue('project_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un projet" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Building Selection */}
          <div className="space-y-2">
            <Label htmlFor="building_id">Bâtiment *</Label>
            <Select
              value={form.watch('building_id')}
              onValueChange={(value) => form.setValue('building_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un bâtiment" />
              </SelectTrigger>
              <SelectContent>
                {buildings.map((building) => (
                  <SelectItem key={building.id} value={building.id}>
                    {building.building_name || building.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Unit Number */}
          <div className="space-y-2">
            <Label htmlFor="unit_number">Numéro d'unité *</Label>
            <Input
              id="unit_number"
              {...form.register('unit_number')}
              placeholder="ex: A101"
            />
          </div>

          {/* Property Type */}
          <div className="space-y-2">
            <Label htmlFor="property_type">Type de propriété *</Label>
            <Select
              value={form.watch('property_type')}
              onValueChange={(value) => form.setValue('property_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">Appartement</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="penthouse">Penthouse</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
                <SelectItem value="townhouse">Maison de ville</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Floor */}
          <div className="space-y-2">
            <Label htmlFor="floor">Étage</Label>
            <Input
              id="floor"
              type="number"
              {...form.register('floor', { valueAsNumber: true })}
              placeholder="1"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderConfigurationStep = () => (
    <Card>
      <CardHeader>
        <CardTitle>Configuration de la propriété</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Surface Area */}
          <div className="space-y-2">
            <Label htmlFor="surface_area">Surface (m²)</Label>
            <Input
              id="surface_area"
              type="number"
              step="0.01"
              {...form.register('surface_area', { valueAsNumber: true })}
              placeholder="100.00"
            />
          </div>

          {/* Bedrooms */}
          <div className="space-y-2">
            <Label htmlFor="bedrooms">Chambres</Label>
            <Input
              id="bedrooms"
              type="number"
              {...form.register('bedrooms', { valueAsNumber: true })}
              placeholder="2"
            />
          </div>

          {/* Bathrooms */}
          <div className="space-y-2">
            <Label htmlFor="bathrooms">Salles de bain</Label>
            <Input
              id="bathrooms"
              type="number"
              {...form.register('bathrooms', { valueAsNumber: true })}
              placeholder="1"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderFinancialStep = () => (
    <Card>
      <CardHeader>
        <CardTitle>Informations financières</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Prix (€)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              {...form.register('price', { valueAsNumber: true })}
              placeholder="300000.00"
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select
              value={form.watch('status')}
              onValueChange={(value) => form.setValue('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Disponible</SelectItem>
                <SelectItem value="sold">Vendu</SelectItem>
                <SelectItem value="reserved">Réservé</SelectItem>
                <SelectItem value="under_construction">En construction</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  switch (currentStep) {
    case 'identification':
      return renderIdentificationStep();
    case 'configuration':
      return renderConfigurationStep();
    case 'financial':
      return renderFinancialStep();
    default:
      return <div>Étape non trouvée</div>;
  }
};