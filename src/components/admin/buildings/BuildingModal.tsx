import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { Building, BuildingFormData } from '@/types/building';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Home, Zap, Shield, Car, TreePine } from 'lucide-react';

interface BuildingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  building?: Building | null;
  onSave: (data: BuildingFormData) => Promise<void>;
  isLoading?: boolean;
}

export function BuildingModal({
  open,
  onOpenChange,
  building,
  onSave,
  isLoading = false,
}: BuildingModalProps) {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<BuildingFormData>();

  // Fetch all projects for dropdown
  const { data: projects = [] } = useQuery({
    queryKey: ['all-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, title, city')
        .order('title');
      
      if (error) throw error;
      return data || [];
    }
  });

  useEffect(() => {
    if (building) {
      reset({
        project_id: building.project_id,
        building_name: building.building_name,
        building_code: building.building_code,
        building_type: building.building_type,
        total_floors: building.total_floors,
        construction_status: building.construction_status,
        expected_completion: building.expected_completion ? new Date(building.expected_completion).toISOString().split('T')[0] : '',
        elevator_count: building.elevator_count || 0,
        has_generator: building.has_generator,
        has_generator: building.has_generator,
        has_security_system: building.has_security_system,
        has_cctv: building.has_cctv,
        has_concierge: building.has_concierge,
        has_pool: building.has_pool,
        has_gym: building.has_gym,
        has_spa: building.has_spa,
        has_playground: building.has_playground,
        has_garden: building.has_garden,
        has_parking: building.has_parking,
        parking_type: building.parking_type,
      });
    } else {
      reset({
        building_type: 'residential',
        total_floors: 1,
        construction_status: 'planned',
        elevator_count: 0,
        has_generator: false,
        has_solar_panels: false,
        has_security_system: false,
        has_cctv: false,
        has_concierge: false,
        has_pool: false,
        has_gym: false,
        has_spa: false,
        has_playground: false,
        has_garden: false,
        has_parking: false,
      });
    }
  }, [building, reset]);

  const onSubmit = async (data: BuildingFormData) => {
    await onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {building ? 'Modifier le bâtiment' : 'Nouveau bâtiment'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Project Selection - REQUIRED FIRST */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Projet parent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Projet *</Label>
                <Select 
                  value={watch('project_id')} 
                  onValueChange={(value) => setValue('project_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un projet" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.title} ({project.city})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.project_id && (
                  <p className="text-sm text-red-500">Projet requis</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Informations de base
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nom du bâtiment *</Label>
                  <Input 
                    {...register('building_name', { required: 'Nom requis' })} 
                    placeholder="Ex: Bâtiment A, Tour Marina..."
                  />
                  {errors.building_name && (
                    <p className="text-sm text-red-500">{errors.building_name.message}</p>
                  )}
                </div>

                <div>
                  <Label>Code bâtiment</Label>
                  <Input 
                    {...register('building_code')} 
                    placeholder="Ex: A, B, MAIN..."
                  />
                </div>

                <div>
                  <Label>Type de bâtiment</Label>
                  <Select 
                    value={watch('building_type')} 
                    onValueChange={(value) => setValue('building_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Résidentiel</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="mixed">Mixte</SelectItem>
                      <SelectItem value="office">Bureau</SelectItem>
                      <SelectItem value="hotel">Hôtel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Nombre d'étages</Label>
                  <Input 
                    type="number" 
                    {...register('total_floors', { valueAsNumber: true, min: 1 })} 
                    min="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Statut de construction</Label>
                  <Select 
                    value={watch('construction_status')} 
                    onValueChange={(value) => setValue('construction_status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">En planification</SelectItem>
                      <SelectItem value="approved">Approuvé</SelectItem>
                      <SelectItem value="construction">En construction</SelectItem>
                      <SelectItem value="completed">Terminé</SelectItem>
                      <SelectItem value="delivered">Livré</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Date de livraison prévue</Label>
                  <Input 
                    type="date" 
                    {...register('expected_completion')} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Infrastructure */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Infrastructure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nombre d'ascenseurs</Label>
                  <Input 
                    type="number" 
                    {...register('elevator_count', { valueAsNumber: true, min: 0 })} 
                    min="0"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label className="cursor-pointer" htmlFor="generator">Générateur de secours</Label>
                  <Switch 
                    id="generator"
                    checked={watch('has_generator')} 
                    onCheckedChange={(checked) => setValue('has_generator', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label className="cursor-pointer" htmlFor="solar">Panneaux solaires</Label>
                  <Switch 
                    id="solar"
                    checked={watch('has_solar_panels')} 
                    onCheckedChange={(checked) => setValue('has_solar_panels', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label className="cursor-pointer" htmlFor="security">Système de sécurité</Label>
                  <Switch 
                    id="security"
                    checked={watch('has_security_system')} 
                    onCheckedChange={(checked) => setValue('has_security_system', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label className="cursor-pointer" htmlFor="cctv">Vidéosurveillance</Label>
                  <Switch 
                    id="cctv"
                    checked={watch('has_cctv')} 
                    onCheckedChange={(checked) => setValue('has_cctv', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label className="cursor-pointer" htmlFor="concierge">Concierge</Label>
                  <Switch 
                    id="concierge"
                    checked={watch('has_concierge')} 
                    onCheckedChange={(checked) => setValue('has_concierge', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TreePine className="h-5 w-5" />
                Équipements communs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label className="cursor-pointer" htmlFor="pool">Piscine commune</Label>
                  <Switch 
                    id="pool"
                    checked={watch('has_pool')} 
                    onCheckedChange={(checked) => setValue('has_pool', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label className="cursor-pointer" htmlFor="gym">Salle de sport</Label>
                  <Switch 
                    id="gym"
                    checked={watch('has_gym')} 
                    onCheckedChange={(checked) => setValue('has_gym', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label className="cursor-pointer" htmlFor="spa">Spa</Label>
                  <Switch 
                    id="spa"
                    checked={watch('has_spa')} 
                    onCheckedChange={(checked) => setValue('has_spa', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label className="cursor-pointer" htmlFor="playground">Aire de jeux</Label>
                  <Switch 
                    id="playground"
                    checked={watch('has_playground')} 
                    onCheckedChange={(checked) => setValue('has_playground', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label className="cursor-pointer" htmlFor="garden">Jardins</Label>
                  <Switch 
                    id="garden"
                    checked={watch('has_garden')} 
                    onCheckedChange={(checked) => setValue('has_garden', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Parking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <Label className="cursor-pointer" htmlFor="parking">Parking disponible</Label>
                <Switch 
                  id="parking"
                  checked={watch('has_parking')} 
                  onCheckedChange={(checked) => setValue('has_parking', checked)}
                />
              </div>

              {watch('has_parking') && (
                <div>
                  <Label>Type de parking</Label>
                  <Select 
                    value={watch('parking_type')} 
                    onValueChange={(value) => setValue('parking_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="underground">Souterrain</SelectItem>
                      <SelectItem value="covered">Couvert</SelectItem>
                      <SelectItem value="open">Extérieur</SelectItem>
                      <SelectItem value="mixed">Mixte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Enregistrement...' : building ? 'Modifier' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}