import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, Edit, Trash2, Plus, Home } from 'lucide-react';

interface BuildingCardsProps {
  buildings: any[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  onAdd: () => void;
}

export const BuildingCards: React.FC<BuildingCardsProps> = ({
  buildings,
  onEdit,
  onDelete,
  onAdd
}) => {
  return (
    <div className="space-y-4">
      {/* Grille de cartes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {buildings.map((building, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-primary" />
                  <CardTitle className="text-base">
                    {building.building_name || `Bâtiment ${index + 1}`}
                  </CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(index)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(index)}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Étages :</span>
                  <span className="ml-1 font-medium">{building.floors_count || 0}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Unités :</span>
                  <span className="ml-1 font-medium">{building.total_units || 0}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Type :</span>
                  <span className="ml-1 font-medium">
                    {building.building_type === 'apartment' ? 'Appartements' :
                     building.building_type === 'villa' ? 'Villas' :
                     building.building_type || 'Non défini'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Classe :</span>
                  <Badge variant="outline" className="ml-1">
                    {building.energy_class || 'N/A'}
                  </Badge>
                </div>
              </div>
              
              {building.building_amenities && building.building_amenities.length > 0 && (
                <div className="pt-2 border-t">
                  <div className="flex items-center gap-1">
                    <Home className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {building.building_amenities.length} équipements
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Bouton ajouter */}
      <Button
        onClick={onAdd}
        className="w-full"
        variant="outline"
      >
        <Plus className="w-4 h-4 mr-2" />
        Ajouter un nouveau bâtiment
      </Button>
    </div>
  );
};