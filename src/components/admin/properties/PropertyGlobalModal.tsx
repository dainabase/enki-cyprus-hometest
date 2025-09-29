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
import { supabase } from '@/integrations/supabase/client';
import { Property, PropertyFormData } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Euro, Home, Bed, Bath, TreePine, Building2 } from 'lucide-react';

interface PropertyGlobalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property?: Property | null;
  onSave: (data: PropertyFormData) => Promise<void>;
  isLoading?: boolean;
}

export function PropertyGlobalModal({
  open,
  onOpenChange,
  property,
  onSave,
  isLoading = false,
}: PropertyGlobalModalProps) {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<PropertyFormData>();
  const [priceWithVat, setPriceWithVat] = useState(0);

  // Fetch all buildings with their projects for dropdown
  const { data: buildings = [] } = useQuery({
    queryKey: ['all-buildings-with-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('buildings')
        .select(`
          id,
          building_name,
          project:projects(id, title, city)
        `)
        .order('building_name');
      
      if (error) throw error;
      return data || [];
    }
  });

  useEffect(() => {
    if (property) {
      reset({
        building_id: property.building_id,
        property_code: property.property_code,
        unit_number: property.unit_number,
        property_type: property.property_type,
        floor_number: property.floor_number,
        bedrooms_count: property.bedrooms_count,
        bathrooms_count: property.bathrooms_count,
        internal_area: property.internal_area,
        covered_verandas: property.covered_verandas,
        uncovered_verandas: property.uncovered_verandas,
        price_excluding_vat: property.price_excluding_vat,
        vat_rate: property.vat_rate || 5,
        sale_status: property.sale_status,
        has_parking: property.has_parking,
        parking_spaces: property.parking_spaces,
        has_storage_unit: property.has_storage_unit,
        has_balcony: property.has_balcony,
        has_terrace: property.has_terrace,
        has_private_garden: property.has_private_garden,
        has_private_pool: property.has_private_pool,
        has_sea_view: property.has_sea_view,
      });
    } else {
      reset({
        property_type: 'apartment',
        bedrooms_count: 2,
        bathrooms_count: 1,
        vat_rate: 5,
        sale_status: 'available',
        parking_spaces: 0,
      });
    }
  }, [property, reset]);

  // Calculer le prix TTC en temps réel
  const priceExcludingVat = watch('price_excluding_vat');
  const vatRate = watch('vat_rate') || 5;
  
  useEffect(() => {
    if (priceExcludingVat) {
      const vat = (priceExcludingVat * vatRate) / 100;
      setPriceWithVat(priceExcludingVat + vat);
    }
  }, [priceExcludingVat, vatRate]);

  const onSubmit = async (data: PropertyFormData) => {
    await onSave(data);
    onOpenChange(false);
  };

  const selectedBuilding = buildings.find(b => b.id === watch('building_id'));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {property ? 'Modifier la propriété' : 'Nouvelle propriété'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Building Selection - REQUIRED FIRST */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Bâtiment parent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Bâtiment *</Label>
                <Select 
                  value={watch('building_id')} 
                  onValueChange={(value) => setValue('building_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un bâtiment" />
                  </SelectTrigger>
                  <SelectContent>
                    {buildings.map((building) => (
                      <SelectItem key={building.id} value={building.id}>
                        {building.building_name} - {building.project?.title} ({building.project?.city})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.building_id && (
                  <p className="text-sm text-red-500">Bâtiment requis</p>
                )}
                
                {selectedBuilding && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">
                      Projet: {selectedBuilding.project?.title}
                    </p>
                    <p className="text-xs text-blue-600">
                      Localisation: {selectedBuilding.project?.city}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">
                <Home className="w-4 h-4 mr-2" />
                Général
              </TabsTrigger>
              <TabsTrigger value="surfaces">
                <Bed className="w-4 h-4 mr-2" />
                Surfaces
              </TabsTrigger>
              <TabsTrigger value="pricing">
                <Euro className="w-4 h-4 mr-2" />
                Prix
              </TabsTrigger>
              <TabsTrigger value="features">
                <TreePine className="w-4 h-4 mr-2" />
                Équipements
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Code propriété *</Label>
                  <Input 
                    {...register('property_code', { required: 'Code requis' })} 
                    placeholder="Ex: A-301" 
                  />
                  {errors.property_code && (
                    <p className="text-sm text-red-500">{errors.property_code.message}</p>
                  )}
                </div>

                <div>
                  <Label>Numéro d'unité *</Label>
                  <Input 
                    {...register('unit_number', { required: 'Numéro requis' })} 
                    placeholder="Ex: 301" 
                  />
                  {errors.unit_number && (
                    <p className="text-sm text-red-500">{errors.unit_number.message}</p>
                  )}
                </div>

                <div>
                  <Label>Type de propriété *</Label>
                  <Select 
                    value={watch('property_type')} 
                    onValueChange={(value) => setValue('property_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Appartement</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="penthouse">Penthouse</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                      <SelectItem value="townhouse">Maison de ville</SelectItem>
                      <SelectItem value="bungalow">Bungalow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Étage</Label>
                  <Input 
                    type="number" 
                    {...register('floor_number', { valueAsNumber: true })} 
                    placeholder="0 pour RDC"
                  />
                </div>

                <div>
                  <Label>Chambres</Label>
                  <Input 
                    type="number" 
                    {...register('bedrooms_count', { valueAsNumber: true, min: 0 })} 
                  />
                </div>

                <div>
                  <Label>Salles de bain</Label>
                  <Input 
                    type="number" 
                    {...register('bathrooms_count', { valueAsNumber: true, min: 0 })} 
                  />
                </div>
              </div>

              <div>
                <Label>Statut de vente</Label>
                <Select 
                  value={watch('sale_status')} 
                  onValueChange={(value) => setValue('sale_status', value)}
                >
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
            </TabsContent>

            <TabsContent value="surfaces" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Surface intérieure (m²) *</Label>
                  <Input 
                    type="number" 
                    step="0.01"
                    {...register('internal_area', { 
                      required: 'Surface requise',
                      valueAsNumber: true, 
                      min: { value: 1, message: 'Minimum 1m²' }
                    })} 
                  />
                  {errors.internal_area && (
                    <p className="text-sm text-red-500">{errors.internal_area.message}</p>
                  )}
                </div>

                <div>
                  <Label>Vérandas couvertes (m²)</Label>
                  <Input 
                    type="number" 
                    step="0.01"
                    {...register('covered_verandas', { valueAsNumber: true })} 
                  />
                </div>

                <div>
                  <Label>Vérandas non couvertes (m²)</Label>
                  <Input 
                    type="number" 
                    step="0.01"
                    {...register('uncovered_verandas', { valueAsNumber: true })} 
                  />
                </div>

                <div>
                  <Label>Surface totale (m²)</Label>
                  <Input 
                    type="number" 
                    value={
                      (watch('internal_area') || 0) + 
                      (watch('covered_verandas') || 0) + 
                      (watch('uncovered_verandas') || 0)
                    }
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Prix HT (€) *</Label>
                  <Input 
                    type="number" 
                    {...register('price_excluding_vat', { 
                      required: 'Prix requis',
                      valueAsNumber: true, 
                      min: { value: 1, message: 'Prix invalide' }
                    })} 
                    placeholder="Prix hors TVA"
                  />
                  {errors.price_excluding_vat && (
                    <p className="text-sm text-red-500">{errors.price_excluding_vat.message}</p>
                  )}
                </div>

                <div>
                  <Label>Taux TVA (%)</Label>
                  <Select 
                    value={String(watch('vat_rate') || 5)} 
                    onValueChange={(value) => setValue('vat_rate', Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5% (Résidentiel)</SelectItem>
                      <SelectItem value="19">19% (Commercial)</SelectItem>
                      <SelectItem value="0">0% (Exonéré)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Prix TTC (€)</Label>
                  <Input 
                    type="number" 
                    value={priceWithVat.toFixed(2)}
                    disabled
                    className="bg-muted font-semibold"
                  />
                </div>

                <div>
                  <Label>Prix/m²</Label>
                  <Input 
                    type="number" 
                    value={
                      watch('internal_area') && watch('price_excluding_vat') 
                        ? (watch('price_excluding_vat') / watch('internal_area')).toFixed(2)
                        : 0
                    }
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>

              {priceWithVat >= 300000 && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-800">
                    ✅ Éligible Golden Visa (≥300,000€)
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Cette propriété répond aux critères d'investissement pour le programme Golden Visa de Chypre.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label className="cursor-pointer" htmlFor="parking">Parking</Label>
                    <Switch 
                      id="parking"
                      checked={watch('has_parking')} 
                      onCheckedChange={(checked) => setValue('has_parking', checked)}
                    />
                  </div>

                  {watch('has_parking') && (
                    <div>
                      <Label>Nombre de places</Label>
                      <Input 
                        type="number"
                        {...register('parking_spaces', { valueAsNumber: true })}
                        min="0"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label className="cursor-pointer" htmlFor="storage">Stockage/Cave</Label>
                    <Switch 
                      id="storage"
                      checked={watch('has_storage_unit')} 
                      onCheckedChange={(checked) => setValue('has_storage_unit', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label className="cursor-pointer" htmlFor="balcony">Balcon</Label>
                    <Switch 
                      id="balcony"
                      checked={watch('has_balcony')} 
                      onCheckedChange={(checked) => setValue('has_balcony', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label className="cursor-pointer" htmlFor="terrace">Terrasse</Label>
                    <Switch 
                      id="terrace"
                      checked={watch('has_terrace')} 
                      onCheckedChange={(checked) => setValue('has_terrace', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label className="cursor-pointer" htmlFor="garden">Jardin privé</Label>
                    <Switch 
                      id="garden"
                      checked={watch('has_private_garden')} 
                      onCheckedChange={(checked) => setValue('has_private_garden', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label className="cursor-pointer" htmlFor="pool">Piscine privée</Label>
                    <Switch 
                      id="pool"
                      checked={watch('has_private_pool')} 
                      onCheckedChange={(checked) => setValue('has_private_pool', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label className="cursor-pointer" htmlFor="seaview">Vue mer</Label>
                    <Switch 
                      id="seaview"
                      checked={watch('has_sea_view')} 
                      onCheckedChange={(checked) => setValue('has_sea_view', checked)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

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
              {isLoading ? 'Enregistrement...' : property ? 'Modifier' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}