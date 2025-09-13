import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useMutation } from '@tanstack/react-query';

const propertySchema = z.object({
  unit_number: z.string().min(1, 'Numéro d\'unité requis'),
  floor: z.number().min(0),
  type: z.enum(['studio', '1bed', '2bed', '3bed', '4bed', 'penthouse', 'villa', 'townhouse']),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0.5),
  size_m2: z.number().min(10),
  price: z.number().min(1000),
  status: z.enum(['available', 'reserved', 'sold']),
  view_type: z.string().optional(),
  orientation: z.enum(['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']).optional(),
  balcony_m2: z.number().optional(),
  parking_spaces: z.number().optional(),
  has_sea_view: z.boolean().optional(),
  has_pool_access: z.boolean().optional(),
});

type PropertyFormData = z.infer<typeof propertySchema>;

interface PropertyFormProps {
  developerId: string;
  projectId: string;
  buildingId: string;
  onSuccess: () => void;
}

export default function PropertyForm({ developerId, projectId, buildingId, onSuccess }: PropertyFormProps) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      status: 'available',
      bedrooms: 2,
      bathrooms: 1,
      floor: 1,
      parking_spaces: 1,
      has_sea_view: false,
      has_pool_access: false,
    }
  });

  const price = watch('price');
  const isGoldenVisa = price >= 300000;

  const createMutation = useMutation({
    mutationFn: async (data: PropertyFormData) => {
      const propertyData = {
        unit_number: data.unit_number,
        floor: data.floor,
        type: data.type,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        size_m2: data.size_m2,
        price: data.price,
        status: data.status,
        view_type: data.view_type || null,
        orientation: data.orientation || null,
        balcony_m2: data.balcony_m2 || 0,
        parking_spaces: data.parking_spaces || 0,
        has_sea_view: data.has_sea_view || false,
        has_pool_access: data.has_pool_access || false,
        developer_id: developerId,
        project_id: projectId,
        building_id: buildingId,
      };
      
      const { error } = await supabase
        .from('properties')
        .insert(propertyData);
      if (error) throw error;
    },
    onSuccess
  });

  const onSubmit = (data: PropertyFormData) => {
    createMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Numéro d'unité et Étage */}
        <div>
          <Label htmlFor="unit_number">Numéro d'unité *</Label>
          <Input {...register('unit_number')} placeholder="A101" />
          {errors.unit_number && (
            <p className="text-red-500 text-sm">{errors.unit_number.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="floor">Étage *</Label>
          <Input type="number" {...register('floor', { valueAsNumber: true })} />
        </div>

        {/* Type et Chambres */}
        <div>
          <Label htmlFor="type">Type *</Label>
          <Select onValueChange={(value) => setValue('type', value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="studio">Studio</SelectItem>
              <SelectItem value="1bed">T1</SelectItem>
              <SelectItem value="2bed">T2</SelectItem>
              <SelectItem value="3bed">T3</SelectItem>
              <SelectItem value="4bed">T4</SelectItem>
              <SelectItem value="penthouse">Penthouse</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="townhouse">Maison de ville</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="bedrooms">Chambres *</Label>
          <Input type="number" {...register('bedrooms', { valueAsNumber: true })} />
        </div>

        {/* Salles de bain et Surface */}
        <div>
          <Label htmlFor="bathrooms">Salles de bain *</Label>
          <Input type="number" step="0.5" {...register('bathrooms', { valueAsNumber: true })} />
        </div>

        <div>
          <Label htmlFor="size_m2">Surface (m²) *</Label>
          <Input type="number" step="0.01" {...register('size_m2', { valueAsNumber: true })} />
        </div>

        {/* Prix */}
        <div className="col-span-2">
          <Label htmlFor="price">
            Prix (€) * 
            {isGoldenVisa && (
              <span className="ml-2 text-sm text-yellow-600 font-semibold">
                ✨ Golden Visa Eligible
              </span>
            )}
          </Label>
          <Input type="number" {...register('price', { valueAsNumber: true })} />
        </div>

        {/* Statut et Vue */}
        <div>
          <Label htmlFor="status">Statut *</Label>
          <Select onValueChange={(value) => setValue('status', value as any)} defaultValue="available">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Disponible</SelectItem>
              <SelectItem value="reserved">Réservé</SelectItem>
              <SelectItem value="sold">Vendu</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="view_type">Type de vue</Label>
          <Input {...register('view_type')} placeholder="Mer, Montagne, Jardin..." />
        </div>

        {/* Orientation et Balcon */}
        <div>
          <Label htmlFor="orientation">Orientation</Label>
          <Select onValueChange={(value) => setValue('orientation', value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="N">Nord</SelectItem>
              <SelectItem value="NE">Nord-Est</SelectItem>
              <SelectItem value="E">Est</SelectItem>
              <SelectItem value="SE">Sud-Est</SelectItem>
              <SelectItem value="S">Sud</SelectItem>
              <SelectItem value="SW">Sud-Ouest</SelectItem>
              <SelectItem value="W">Ouest</SelectItem>
              <SelectItem value="NW">Nord-Ouest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="balcony_m2">Balcon (m²)</Label>
          <Input type="number" step="0.01" {...register('balcony_m2', { valueAsNumber: true })} />
        </div>

        <div>
          <Label htmlFor="parking_spaces">Places de parking</Label>
          <Input type="number" {...register('parking_spaces', { valueAsNumber: true })} />
        </div>
      </div>

      {/* Caractéristiques */}
      <div className="space-y-2">
        <Label>Caractéristiques</Label>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Checkbox 
              {...register('has_sea_view')}
              onCheckedChange={(checked) => setValue('has_sea_view', checked as boolean)}
            />
            <Label>Vue mer</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              {...register('has_pool_access')}
              onCheckedChange={(checked) => setValue('has_pool_access', checked as boolean)}
            />
            <Label>Accès piscine</Label>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={createMutation.isPending}>
        {createMutation.isPending ? 'Création...' : 'Créer la propriété'}
      </Button>
    </form>
  );
}