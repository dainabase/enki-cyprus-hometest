import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProjectBuildingsSection } from './ProjectBuildingsSection';

interface ProjectFormTempProps {
  projectId?: string;
}

// Composant temporaire pour voir les changements GitHub
export const ProjectFormTemp: React.FC<ProjectFormTempProps> = ({ projectId }) => {
  const handleAddBuilding = () => {
    console.log('Add building clicked');
  };

  const mockBuildings = [
    {
      id: '1',
      name: 'Bâtiment A',
      total_floors: 5,
      units: 20,
      status: 'construction'
    },
    {
      id: '2', 
      name: 'Bâtiment B',
      total_floors: 8,
      units: 32,
      status: 'delivered'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Formulaire Projet - Version Temporaire</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Cette version temporaire permet de voir les changements récents du formulaire projet.
          </p>
        </CardContent>
      </Card>

      <Separator />

      {/* Section des bâtiments */}
      <ProjectBuildingsSection
        projectId={projectId}
        buildings={mockBuildings}
        onAddBuilding={handleAddBuilding}
        t={(key: string) => key} // Mock function pour les traductions
      />

      <Card>
        <CardHeader>
          <CardTitle>État du Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="default">Section Bâtiments</Badge>
              <span className="text-sm text-green-600">✅ Intégrée</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default">Section SEO</Badge>
              <span className="text-sm text-orange-600">⚠️ En attente des types</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Push GitHub</Badge>
              <span className="text-sm text-blue-600">🔄 Automatique</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};