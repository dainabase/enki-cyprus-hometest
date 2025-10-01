import React, { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BuildingFormData } from '@/types/building';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, TrendingUp, Euro, Plus, Trash2, Home } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CommercializationStepProps {
  form: UseFormReturn<BuildingFormData>;
}

interface FloorConfig {
  name: string;
  units: { type: string; count: number }[];
}

export const CommercializationStep: React.FC<CommercializationStepProps> = ({ form }) => {
  const totalUnits = form.watch('total_units') || 0;
  const unitsAvailable = form.watch('units_available') || 0;
  
  // Calculer automatiquement le taux d'occupation
  const tauxOccupation = totalUnits > 0 
    ? Math.round(((totalUnits - unitsAvailable) / totalUnits) * 100)
    : 0;

  // Mettre à jour le taux d'occupation automatiquement
  useEffect(() => {
    form.setValue('taux_occupation', tauxOccupation);
  }, [totalUnits, unitsAvailable, tauxOccupation, form]);

  // État local pour la configuration par étage
  const [floors, setFloors] = useState<FloorConfig[]>([
    { name: 'Rez-de-chaussée', units: [] }
  ]);

  // Charger la configuration existante
  useEffect(() => {
    const existingConfig = form.getValues('configuration_etages');
    if (existingConfig && typeof existingConfig === 'object' && Object.keys(existingConfig).length > 0) {
      const loadedFloors: FloorConfig[] = [];
      Object.entries(existingConfig).forEach(([floorName, config]: [string, any]) => {
        const units: { type: string; count: number }[] = [];
        if (config && typeof config === 'object') {
          Object.entries(config).forEach(([type, count]: [string, any]) => {
            units.push({ type, count: Number(count) || 0 });
          });
        }
        loadedFloors.push({ name: floorName, units });
      });
      if (loadedFloors.length > 0) {
        setFloors(loadedFloors);
      }
    }
  }, [form]);

  // Sauvegarder la configuration dans le formulaire
  const saveConfiguration = () => {
    const config: any = {};
    floors.forEach(floor => {
      config[floor.name] = {};
      floor.units.forEach(unit => {
        config[floor.name][unit.type] = unit.count;
      });
    });
    form.setValue('configuration_etages', config);
  };

  // Ajouter un étage
  const addFloor = () => {
    const totalFloors = form.getValues('total_floors') || 1;
    const newFloorNumber = floors.length;
    if (newFloorNumber < totalFloors) {
      setFloors([...floors, { name: `Étage ${newFloorNumber}`, units: [] }]);
    }
  };

  // Supprimer un étage
  const removeFloor = (index: number) => {
    setFloors(floors.filter((_, i) => i !== index));
  };

  // Ajouter une unité à un étage
  const addUnitToFloor = (floorIndex: number) => {
    const newFloors = [...floors];
    newFloors[floorIndex].units.push({ type: 'Studio', count: 1 });
    setFloors(newFloors);
    saveConfiguration();
  };

  // Supprimer une unité d'un étage
  const removeUnitFromFloor = (floorIndex: number, unitIndex: number) => {
    const newFloors = [...floors];
    newFloors[floorIndex].units.splice(unitIndex, 1);
    setFloors(newFloors);
    saveConfiguration();
  };

  // Mettre à jour une unité
  const updateUnit = (floorIndex: number, unitIndex: number, field: 'type' | 'count', value: string | number) => {
    const newFloors = [...floors];
    if (field === 'type') {
      newFloors[floorIndex].units[unitIndex].type = value as string;
    } else {
      newFloors[floorIndex].units[unitIndex].count = value as number;
    }
    setFloors(newFloors);
    saveConfiguration();
  };
  
  return (
    <div className="space-y-6">
      {/* Titre de l'étape */}
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-blue-500" />
          Commercialisation
        </h2>
        <p className="text-slate-500 mt-2">
          Informations sur les prix et l'état de commercialisation
        </p>
      </div>

      {/* Indicateur de taux d'occupation AUTOMATIQUE */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Taux d'occupation calculé automatiquement</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{tauxOccupation}%</p>
              <p className="text-xs text-slate-600 mt-1">
                Basé sur {totalUnits - unitsAvailable} unités occupées sur {totalUnits} au total
              </p>
            </div>
            <div className="flex gap-2">
              {tauxOccupation < 30 && <Badge className="bg-green-100 text-green-800">Forte disponibilité</Badge>}
              {tauxOccupation >= 30 && tauxOccupation < 70 && <Badge className="bg-yellow-100 text-yellow-800">Disponibilité moyenne</Badge>}
              {tauxOccupation >= 70 && <Badge className="bg-red-100 text-red-800">Peu de disponibilité</Badge>}
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 mt-4">
            <div 
              className="bg-slate-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${tauxOccupation}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prix moyen au m² */}
        <Card>
          <CardContent className="p-4">
            <FormField
              control={form.control}
              name="prix_moyen_m2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">
                    Prix moyen au m²
                  </FormLabel>
                  <FormDescription>
                    Prix de vente moyen par mètre carré
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      step="100"
                      placeholder="3500"
                      value={field.value || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === '' ? '' : parseFloat(val) || 0);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Fourchette de prix minimum */}
        <Card>
          <CardContent className="p-4">
            <FormField
              control={form.control}
              name="fourchette_prix_min"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">
                    Prix minimum
                  </FormLabel>
                  <FormDescription>
                    Prix le plus bas dans le bâtiment
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      step="1000"
                      placeholder="150000"
                      value={field.value || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === '' ? '' : parseFloat(val) || 0);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Fourchette de prix maximum */}
        <Card>
          <CardContent className="p-4">
            <FormField
              control={form.control}
              name="fourchette_prix_max"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">
                    Prix maximum
                  </FormLabel>
                  <FormDescription>
                    Prix le plus élevé dans le bâtiment
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      step="1000"
                      placeholder="750000"
                      value={field.value || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === '' ? '' : parseFloat(val) || 0);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Date de mise en vente */}
        <Card>
          <CardContent className="p-4">
            <FormField
              control={form.control}
              name="date_mise_en_vente"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">
                    Date de mise en vente
                  </FormLabel>
                  <FormDescription>
                    Début de la commercialisation
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </div>

      {/* Répartition par type de logement */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-base font-semibold mb-4">Nombre de logements par type</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Studio', 'T1', 'T2', 'T3', 'T4', 'T5+', 'Penthouse', 'Duplex'].map((type) => {
              const fieldKey = type.toLowerCase().replace('+', 'plus');
              return (
                <FormField
                  key={fieldKey}
                  control={form.control}
                  name={`nombre_logements_type.${fieldKey}` as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">{type}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          placeholder="0"
                          value={field.value || ''}
                          onChange={(e) => {
                            const value = e.target.value === '' ? 0 : parseInt(e.target.value) || 0;
                            const currentTypes = form.getValues('nombre_logements_type') || {};
                            form.setValue('nombre_logements_type', {
                              ...currentTypes,
                              [fieldKey]: value
                            });
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Configuration par étage */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <Home className="h-5 w-5 text-blue-500" />
              Configuration par étage
            </h3>
            <Button
              type="button"
              onClick={addFloor}
              size="sm"
              disabled={floors.length >= (form.getValues('total_floors') || 1)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Ajouter un étage
            </Button>
          </div>
          
          <div className="space-y-4">
            {floors.map((floor, floorIndex) => (
              <Card key={floorIndex} className="bg-slate-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-slate-700">{floor.name}</h4>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={() => addUnitToFloor(floorIndex)}
                        size="sm"
                        variant="outline"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Ajouter unité
                      </Button>
                      {floors.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeFloor(floorIndex)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {floor.units.length === 0 ? (
                    <p className="text-sm text-slate-500 italic">Aucune unité configurée</p>
                  ) : (
                    <div className="space-y-2">
                      {floor.units.map((unit, unitIndex) => (
                        <div key={unitIndex} className="flex items-center gap-2">
                          <Select
                            value={unit.type}
                            onValueChange={(value) => updateUnit(floorIndex, unitIndex, 'type', value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Studio">Studio</SelectItem>
                              <SelectItem value="T1">T1</SelectItem>
                              <SelectItem value="T2">T2</SelectItem>
                              <SelectItem value="T3">T3</SelectItem>
                              <SelectItem value="T4">T4</SelectItem>
                              <SelectItem value="T5+">T5+</SelectItem>
                              <SelectItem value="Penthouse">Penthouse</SelectItem>
                              <SelectItem value="Duplex">Duplex</SelectItem>
                              <SelectItem value="Commerce">Commerce</SelectItem>
                              <SelectItem value="Bureau">Bureau</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            type="number"
                            min="0"
                            value={unit.count}
                            onChange={(e) => updateUnit(floorIndex, unitIndex, 'count', parseInt(e.target.value) || 0)}
                            className="w-20"
                            placeholder="0"
                          />
                          <span className="text-sm text-slate-600">unité(s)</span>
                          <Button
                            type="button"
                            onClick={() => removeUnitFromFloor(floorIndex, unitIndex)}
                            size="sm"
                            variant="ghost"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
