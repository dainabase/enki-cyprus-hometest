import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PropertyFormStepsProps {
  form: UseFormReturn<any>;
  currentStep: string;
}

export const PropertyFormSteps: React.FC<PropertyFormStepsProps> = ({ form, currentStep }) => {
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
            <label className="text-sm font-medium">Projet *</label>
            <Select
              value={form.watch('project_id') || ''}
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
            <label className="text-sm font-medium">Bâtiment *</label>
            <Select
              value={form.watch('building_id') || ''}
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
            <label className="text-sm font-medium">Numéro d'unité *</label>
            <Input
              {...form.register('unit_number')}
              placeholder="ex: A101"
            />
          </div>

          {/* Property Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Type de propriété *</label>
            <Select
              value={form.watch('property_type') || ''}
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
            <label className="text-sm font-medium">Étage</label>
            <Input
              type="number"
              {...form.register('floor_number', { valueAsNumber: true })}
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
            <label className="text-sm font-medium">Surface (m²)</label>
            <Input
              type="number"
              step="0.01"
              {...form.register('surface_area', { valueAsNumber: true })}
              placeholder="100.00"
            />
          </div>

          {/* Bedrooms */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Chambres</label>
            <Input
              type="number"
              {...form.register('bedrooms', { valueAsNumber: true })}
              placeholder="2"
            />
          </div>

          {/* Bathrooms */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Salles de bain</label>
            <Input
              type="number"
              {...form.register('bathrooms', { valueAsNumber: true })}
              placeholder="1"
            />
          </div>
        </div>

        {/* Additional Features */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Caractéristiques supplémentaires</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { key: 'furnished', label: 'Meublé' },
              { key: 'balcony', label: 'Balcon' },
              { key: 'terrace', label: 'Terrasse' },
              { key: 'parking', label: 'Parking' },
              { key: 'storage', label: 'Rangement' },
              { key: 'air_conditioning', label: 'Climatisation' },
              { key: 'heating', label: 'Chauffage' },
              { key: 'elevator', label: 'Ascenseur' },
              { key: 'fireplace', label: 'Cheminée' }
            ].map((feature) => (
              <div key={feature.key} className="flex items-center space-x-2">
                <Checkbox
                  checked={form.watch(feature.key) || false}
                  onCheckedChange={(checked) => form.setValue(feature.key, checked)}
                />
                <label className="text-sm">{feature.label}</label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderEquipmentStep = () => (
    <Card>
      <CardHeader>
        <CardTitle>Équipements et commodités</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { key: 'swimming_pool', label: 'Piscine' },
            { key: 'gym', label: 'Salle de sport' },
            { key: 'spa', label: 'Spa' },
            { key: 'concierge', label: 'Concierge' },
            { key: 'security', label: 'Sécurité' },
            { key: 'gated_community', label: 'Résidence fermée' },
            { key: 'golf_course', label: 'Golf' },
            { key: 'tennis_court', label: 'Tennis' },
            { key: 'marina', label: 'Marina' }
          ].map((feature) => (
            <div key={feature.key} className="flex items-center space-x-2">
              <Checkbox
                checked={form.watch(feature.key) || false}
                onCheckedChange={(checked) => form.setValue(feature.key, checked)}
              />
              <label className="text-sm">{feature.label}</label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderOutdoorStep = () => (
    <Card>
      <CardHeader>
        <CardTitle>Espaces extérieurs et vues</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Vues disponibles</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { key: 'sea_view', label: 'Vue mer' },
              { key: 'mountain_view', label: 'Vue montagne' },
              { key: 'city_view', label: 'Vue ville' },
              { key: 'garden_view', label: 'Vue jardin' },
              { key: 'pool_view', label: 'Vue piscine' }
            ].map((view) => (
              <div key={view.key} className="flex items-center space-x-2">
                <Checkbox
                  checked={form.watch(view.key) || false}
                  onCheckedChange={(checked) => form.setValue(view.key, checked)}
                />
                <label className="text-sm">{view.label}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium">Espaces extérieurs privés</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={form.watch('has_private_garden') || false}
                onCheckedChange={(checked) => form.setValue('has_private_garden', checked)}
              />
              <label className="text-sm">Jardin privé</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={form.watch('has_private_pool') || false}
                onCheckedChange={(checked) => form.setValue('has_private_pool', checked)}
              />
              <label className="text-sm">Piscine privée</label>
            </div>
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
            <label className="text-sm font-medium">Prix (€)</label>
            <Input
              type="number"
              step="0.01"
              {...form.register('price', { valueAsNumber: true })}
              placeholder="300000.00"
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Statut</label>
            <Select
              value={form.watch('status') || ''}
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

        <div className="flex items-center space-x-2">
          <Checkbox
            checked={form.watch('finance_available') || false}
            onCheckedChange={(checked) => form.setValue('finance_available', checked)}
          />
          <label className="text-sm">Financement disponible</label>
        </div>
      </CardContent>
    </Card>
  );

  const renderDocumentationStep = () => (
    <Card>
      <CardHeader>
        <CardTitle>Documentation et statut légal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Statut titre de propriété</label>
          <Select
            value={form.watch('title_deed_status') || ''}
            onValueChange={(value) => form.setValue('title_deed_status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Statut du titre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="available">Disponible</SelectItem>
              <SelectItem value="in_process">En cours</SelectItem>
              <SelectItem value="issued">Émis</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );

  switch (currentStep) {
    case 'identification':
      return renderIdentificationStep();
    case 'configuration':
      return renderConfigurationStep();
    case 'equipment':
      return renderEquipmentStep();
    case 'outdoor':
      return renderOutdoorStep();
    case 'financial':
      return renderFinancialStep();
    case 'documentation':
      return renderDocumentationStep();
    default:
      return <div>Étape non trouvée</div>;
  }
};