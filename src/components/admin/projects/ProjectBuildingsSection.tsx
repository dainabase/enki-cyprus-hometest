import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Building {
  id: string;
  name: string;
  total_floors?: number;
  units?: number;
  status?: string;
}

interface ProjectBuildingsSectionProps {
  projectId?: string;
  buildings?: Building[];
  onAddBuilding?: () => void;
  t: any;
}

export const ProjectBuildingsSection: React.FC<ProjectBuildingsSectionProps> = ({
  projectId,
  buildings = [],
  onAddBuilding,
  t
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            {t('projectForm.buildings') || 'Bâtiments'}
            <Badge variant="secondary">
              {buildings.length} {t('projectForm.building' + (buildings.length > 1 ? 's' : ''))}
            </Badge>
          </div>
          {projectId && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onAddBuilding}
            >
              <Plus className="h-4 w-4 mr-1" />
              {t('projectForm.addBuilding') || 'Ajouter un bâtiment'}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!projectId ? (
          <p className="text-sm text-muted-foreground">
            {t('projectForm.saveProjectToAddBuildings') || 'Enregistrez le projet pour ajouter des bâtiments'}
          </p>
        ) : buildings.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              {t('projectForm.noBuildingsYet') || 'Aucun bâtiment ajouté'}
            </p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onAddBuilding}
            >
              <Plus className="h-4 w-4 mr-1" />
              {t('projectForm.addFirstBuilding') || 'Ajouter le premier bâtiment'}
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {buildings.map((building) => (
                <div
                  key={building.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{building.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {building.total_floors && `${building.total_floors} ${t('projectForm.floors') || 'étages'}`}
                        {building.units && ` • ${building.units} ${t('projectForm.units') || 'unités'}`}
                      </p>
                    </div>
                  </div>
                  {building.status && (
                    <Badge variant={building.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                      {t(`status.${building.status}`) || building.status}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
            <div className="pt-3 text-xs text-muted-foreground">
              {t('projectForm.buildingsManagementHint') || 'Gérez les bâtiments depuis l\'onglet Bâtiments du menu principal'}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
