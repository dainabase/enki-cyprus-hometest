import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Trash2, Building2, Layers, Users, Zap, Shield } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { ProjectFormData } from '@/schemas/projectSchema';
import { ProjectBuilding } from '@/types/building.project';

interface BuildingSectionProps {
  building: ProjectBuilding;
  index: number;
  form: UseFormReturn<ProjectFormData>;
  onChange: (index: number, building: ProjectBuilding) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

export const BuildingSection: React.FC<BuildingSectionProps> = ({
  building,
  index,
  form,
  onChange,
  onRemove,
  canRemove
}) => {
  const updateBuilding = (field: keyof ProjectBuilding, value: any) => {
    onChange(index, { ...building, [field]: value });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      planned: { label: 'Planifié', className: 'bg-blue-100 text-blue-800' },
      construction: { label: 'En construction', className: 'bg-orange-100 text-orange-800' },
      delivered: { label: 'Livré', className: 'bg-green-100 text-green-800' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.planned;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <Card className="border-2 border-slate-300 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Bâtiment {index + 1}
            {building.building_name && ` - ${building.building_name}`}
          </CardTitle>
          <div className="flex items-center gap-2">
            {getStatusBadge(building.construction_status)}
            {canRemove && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => onRemove(index)}
                className="h-8 w-8 p-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Informations de base */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">
              Nom du bâtiment *
            </label>
            <Input
              placeholder="Ex: Tour A, Villa Marina..."
              value={building.building_name}
              onChange={(e) => updateBuilding('building_name', e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">
              Code bâtiment
            </label>
            <Input
              placeholder="Ex: BLD-001"
              value={building.building_code || ''}
              onChange={(e) => updateBuilding('building_code', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">
              Type de bâtiment *
            </label>
            <Select 
              value={building.building_type} 
              onValueChange={(value) => updateBuilding('building_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment_building">Immeuble d'appartements</SelectItem>
                <SelectItem value="villa_complex">Complexe de villas</SelectItem>
                <SelectItem value="mixed_residence">Résidence mixte</SelectItem>
                <SelectItem value="residential">Résidentiel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">
              Statut construction *
            </label>
            <Select 
              value={building.construction_status} 
              onValueChange={(value) => updateBuilding('construction_status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planned">Planifié</SelectItem>
                <SelectItem value="construction">En construction</SelectItem>
                <SelectItem value="delivered">Livré</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Caractéristiques physiques */}
        <Card className="bg-slate-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Layers className="w-4 h-4" />
              Caractéristiques physiques
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                  Nombre d'étages
                </label>
                <Input
                  type="number"
                  min="0"
                  placeholder="Ex: 5"
                  value={building.total_floors || ''}
                  onChange={(e) => updateBuilding('total_floors', parseInt(e.target.value) || 0)}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                  Unités totales
                </label>
                <Input
                  type="number"
                  min="0"
                  placeholder="Ex: 24"
                  value={building.total_units || ''}
                  onChange={(e) => updateBuilding('total_units', parseInt(e.target.value) || 0)}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                  Unités disponibles
                </label>
                <Input
                  type="number"
                  min="0"
                  placeholder="Ex: 12"
                  value={building.units_available || ''}
                  onChange={(e) => updateBuilding('units_available', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                  Classe énergétique
                </label>
                <Select 
                  value={building.building_class || ''} 
                  onValueChange={(value) => updateBuilding('building_class', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Classe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                  Nombre d'ascenseurs
                </label>
                <Input
                  type="number"
                  min="0"
                  placeholder="Ex: 2"
                  value={building.elevator_count || ''}
                  onChange={(e) => updateBuilding('elevator_count', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Équipements bâtiment */}
        <Card className="bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="w-4 h-4" />
              Équipements du bâtiment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <Switch
                  checked={building.has_generator || false}
                  onCheckedChange={(checked) => updateBuilding('has_generator', checked)}
                />
                <label className="text-sm font-medium">Générateur</label>
              </div>

              <div className="flex items-center space-x-3">
                <Switch
                  checked={building.has_pool || false}
                  onCheckedChange={(checked) => updateBuilding('has_pool', checked)}
                />
                <label className="text-sm font-medium">Piscine</label>
              </div>

              <div className="flex items-center space-x-3">
                <Switch
                  checked={building.has_gym || false}
                  onCheckedChange={(checked) => updateBuilding('has_gym', checked)}
                />
                <label className="text-sm font-medium">Salle de sport</label>
              </div>

              <div className="flex items-center space-x-3">
                <Switch
                  checked={building.has_spa || false}
                  onCheckedChange={(checked) => updateBuilding('has_spa', checked)}
                />
                <label className="text-sm font-medium">Spa</label>
              </div>

              <div className="flex items-center space-x-3">
                <Switch
                  checked={building.has_playground || false}
                  onCheckedChange={(checked) => updateBuilding('has_playground', checked)}
                />
                <label className="text-sm font-medium">Aire de jeux</label>
              </div>

              <div className="flex items-center space-x-3">
                <Switch
                  checked={building.has_garden || false}
                  onCheckedChange={(checked) => updateBuilding('has_garden', checked)}
                />
                <label className="text-sm font-medium">Jardin</label>
              </div>
            </div>

            {/* Parking */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Switch
                  checked={building.has_parking || false}
                  onCheckedChange={(checked) => updateBuilding('has_parking', checked)}
                />
                <label className="text-sm font-medium">Parking</label>
              </div>

              {building.has_parking && (
                <div className="ml-6">
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Type de parking
                  </label>
                  <Select 
                    value={building.parking_type || ''} 
                    onValueChange={(value) => updateBuilding('parking_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="underground">Souterrain</SelectItem>
                      <SelectItem value="outdoor">Extérieur</SelectItem>
                      <SelectItem value="covered">Couvert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sécurité */}
        <Card className="bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="w-4 h-4" />
              Sécurité du bâtiment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <Switch
                  checked={building.has_security_system || false}
                  onCheckedChange={(checked) => updateBuilding('has_security_system', checked)}
                />
                <label className="text-sm font-medium">Système de sécurité</label>
              </div>

              <div className="flex items-center space-x-3">
                <Switch
                  checked={building.has_cctv || false}
                  onCheckedChange={(checked) => updateBuilding('has_cctv', checked)}
                />
                <label className="text-sm font-medium">Vidéosurveillance</label>
              </div>

              <div className="flex items-center space-x-3">
                <Switch
                  checked={building.has_concierge || false}
                  onCheckedChange={(checked) => updateBuilding('has_concierge', checked)}
                />
                <label className="text-sm font-medium">Concierge</label>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};