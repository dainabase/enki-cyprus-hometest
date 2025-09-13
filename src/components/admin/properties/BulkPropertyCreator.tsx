import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useMutation } from '@tanstack/react-query';
import { Copy } from 'lucide-react';

interface BulkPropertyCreatorProps {
  developerId: string;
  projectId: string;
  buildingId: string;
  onSuccess: (count: number) => void;
}

interface BulkTemplate {
  unitPrefix: string;
  startFloor: number;
  endFloor: number;
  unitsPerFloor: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  size_m2: number;
  basePrice: number;
  priceIncrementPerFloor: number;
  skipFloors: number[];
}

export default function BulkPropertyCreator({ developerId, projectId, buildingId, onSuccess }: BulkPropertyCreatorProps) {
  const [template, setTemplate] = useState<BulkTemplate>({
    unitPrefix: 'A',
    startFloor: 1,
    endFloor: 10,
    unitsPerFloor: 2,
    type: '2bed',
    bedrooms: 2,
    bathrooms: 1,
    size_m2: 85,
    basePrice: 250000,
    priceIncrementPerFloor: 5000,
    skipFloors: []
  });

  const totalUnits = (() => {
    const floors = [];
    for (let f = template.startFloor; f <= template.endFloor; f++) {
      if (!template.skipFloors.includes(f)) {
        floors.push(f);
      }
    }
    return floors.length * template.unitsPerFloor;
  })();

  const createMutation = useMutation({
    mutationFn: async () => {
      const properties = [];
      
      for (let floor = template.startFloor; floor <= template.endFloor; floor++) {
        if (template.skipFloors.includes(floor)) continue;
        
        for (let unit = 1; unit <= template.unitsPerFloor; unit++) {
          const unitNumber = `${template.unitPrefix}${floor.toString().padStart(2, '0')}${unit.toString().padStart(2, '0')}`;
          const price = template.basePrice + ((floor - template.startFloor) * template.priceIncrementPerFloor);
          
          properties.push({
            developer_id: developerId,
            project_id: projectId,
            building_id: buildingId,
            unit_number: unitNumber,
            floor: floor,
            type: template.type,
            bedrooms: template.bedrooms,
            bathrooms: template.bathrooms,
            size_m2: template.size_m2,
            price: price,
            status: 'available',
            parking_spaces: 1,
            orientation: unit === 1 ? 'E' : 'W', // Exemple: alternance Est/Ouest
          });
        }
      }

      const { error } = await supabase
        .from('properties')
        .insert(properties);
      
      if (error) throw error;
      return properties.length;
    },
    onSuccess: (count) => onSuccess(count)
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Création en Masse de Propriétés</CardTitle>
          <CardDescription>
            Créez plusieurs propriétés similaires en une seule opération
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Configuration de base */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Préfixe d'unité</Label>
              <Input 
                value={template.unitPrefix}
                onChange={(e) => setTemplate({...template, unitPrefix: e.target.value})}
                placeholder="A, B, C..."
              />
            </div>
            
            <div>
              <Label>Étage début</Label>
              <Input 
                type="number"
                value={template.startFloor}
                onChange={(e) => setTemplate({...template, startFloor: parseInt(e.target.value)})}
              />
            </div>
            
            <div>
              <Label>Étage fin</Label>
              <Input 
                type="number"
                value={template.endFloor}
                onChange={(e) => setTemplate({...template, endFloor: parseInt(e.target.value)})}
              />
            </div>
          </div>

          {/* Configuration des unités */}
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label>Unités par étage</Label>
              <Input 
                type="number"
                value={template.unitsPerFloor}
                onChange={(e) => setTemplate({...template, unitsPerFloor: parseInt(e.target.value)})}
              />
            </div>
            
            <div>
              <Label>Type</Label>
              <Select 
                value={template.type} 
                onValueChange={(value) => {
                  // Mise à jour automatique des chambres selon le type
                  const bedroomsMap: Record<string, number> = {
                    'studio': 0,
                    '1bed': 1,
                    '2bed': 2,
                    '3bed': 3,
                    '4bed': 4
                  };
                  setTemplate({
                    ...template, 
                    type: value,
                    bedrooms: bedroomsMap[value] || template.bedrooms
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="1bed">T1</SelectItem>
                  <SelectItem value="2bed">T2</SelectItem>
                  <SelectItem value="3bed">T3</SelectItem>
                  <SelectItem value="4bed">T4</SelectItem>
                  <SelectItem value="penthouse">Penthouse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Chambres</Label>
              <Input 
                type="number"
                value={template.bedrooms}
                onChange={(e) => setTemplate({...template, bedrooms: parseInt(e.target.value)})}
              />
            </div>

            <div>
              <Label>Surface (m²)</Label>
              <Input 
                type="number"
                value={template.size_m2}
                onChange={(e) => setTemplate({...template, size_m2: parseFloat(e.target.value)})}
              />
            </div>
          </div>

          {/* Configuration des prix */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Prix de base (€)</Label>
              <Input 
                type="number"
                value={template.basePrice}
                onChange={(e) => setTemplate({...template, basePrice: parseInt(e.target.value)})}
              />
              <div className="text-xs text-gray-500 mt-1">
                {template.basePrice >= 300000 && '✨ Golden Visa eligible'}
              </div>
            </div>
            
            <div>
              <Label>Augmentation par étage (€)</Label>
              <Input 
                type="number"
                value={template.priceIncrementPerFloor}
                onChange={(e) => setTemplate({...template, priceIncrementPerFloor: parseInt(e.target.value)})}
              />
            </div>
          </div>

          {/* Exemples de prix */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-gray-50 p-2 rounded">
              <div className="font-medium">Étage {template.startFloor}</div>
              <div>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(template.basePrice)}</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="font-medium">Étage {Math.ceil((template.startFloor + template.endFloor) / 2)}</div>
              <div>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
                template.basePrice + ((Math.ceil((template.startFloor + template.endFloor) / 2) - template.startFloor) * template.priceIncrementPerFloor)
              )}</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="font-medium">Étage {template.endFloor}</div>
              <div>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
                template.basePrice + ((template.endFloor - template.startFloor) * template.priceIncrementPerFloor)
              )}</div>
            </div>
          </div>

          {/* Résumé */}
          <Card className="bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{totalUnits} propriétés</p>
                  <p className="text-sm text-gray-600">seront créées</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Prix moyen</p>
                  <p className="text-lg font-semibold">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
                      template.basePrice + ((template.endFloor - template.startFloor) / 2 * template.priceIncrementPerFloor)
                    )}
                  </p>
                </div>
              </div>
              
              {/* Prédiction unités Golden Visa */}
              <div className="mt-3 pt-3 border-t border-blue-200">
                <div className="text-sm text-gray-600">
                  Golden Visa: {
                    (() => {
                      let count = 0;
                      for (let floor = template.startFloor; floor <= template.endFloor; floor++) {
                        const price = template.basePrice + ((floor - template.startFloor) * template.priceIncrementPerFloor);
                        if (price >= 300000) count += template.unitsPerFloor;
                      }
                      return count;
                    })()
                  } / {totalUnits} propriétés éligibles
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={() => createMutation.mutate()} 
            className="w-full" 
            size="lg"
            disabled={createMutation.isPending || totalUnits === 0}
          >
            <Copy className="mr-2 h-4 w-4" />
            {createMutation.isPending ? `Création de ${totalUnits} propriétés...` : `Créer ${totalUnits} propriétés`}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}