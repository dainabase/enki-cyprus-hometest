import React from 'react';
import { Edit, Trash2, Eye, Building2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { checkBuildingDependencies } from '@/lib/supabase/integrity';

interface BuildingsTableProps {
  buildings: any[];
  onEdit: (building: any) => void;
  onRefetch: () => void;
  isLoading: boolean;
}

const BuildingsTable: React.FC<BuildingsTableProps> = ({ buildings, onEdit, onRefetch, isLoading }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDelete = async (buildingId: string, buildingName: string) => {
    try {
      // Check for dependencies first
      const dependencies = await checkBuildingDependencies(buildingId);
      
      let confirmMessage = `Êtes-vous sûr de vouloir supprimer le bâtiment "${buildingName}" ?`;
      
      if (dependencies.count > 0) {
        confirmMessage = `⚠️ ATTENTION ⚠️\n\nLe bâtiment "${buildingName}" a des dépendances :\n${dependencies.details}\n\nLa suppression supprimera aussi ces éléments.\n\nÊtes-vous sûr de vouloir continuer ?`;
      }
      
      if (!confirm(confirmMessage)) {
        return;
      }

      const { error } = await supabase
        .from('buildings')
        .delete()
        .eq('id', buildingId);

      if (error) throw error;

      toast({
        title: 'Bâtiment supprimé',
        description: 'Le bâtiment a été supprimé avec succès'
      });
      onRefetch();
    } catch (error: any) {
      console.error('Error deleting building:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || 'Impossible de supprimer le bâtiment'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'planning': { label: 'Planification', variant: 'secondary' as const, color: 'bg-blue-100 text-blue-800' },
      'foundation': { label: 'Fondations', variant: 'default' as const, color: 'bg-yellow-100 text-yellow-800' },
      'structure': { label: 'Structure', variant: 'default' as const, color: 'bg-orange-100 text-orange-800' },
      'finishing': { label: 'Finitions', variant: 'default' as const, color: 'bg-purple-100 text-purple-800' },
      'completed': { label: 'Terminé', variant: 'outline' as const, color: 'bg-green-100 text-green-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'secondary' as const, color: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getProject = (project: any) => {
    if (!project || typeof project !== 'object') return { title: 'Non assigné', zone: '' };
    return project as { title?: string; cyprus_zone?: string; [key: string]: any };
  };

  const calculateAvailableUnits = (building: any) => {
    // Enhanced calculation with more details
    const total = building.total_units || 0;
    const available = Math.floor(total * 0.3); // Simulate 30% availability
    const sold = total - available;
    const occupancyRate = total > 0 ? Math.round((sold / total) * 100) : 0;
    
    return { 
      available, 
      total, 
      sold,
      occupancyRate,
      isSoldOut: available === 0 && total > 0
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom du bâtiment</TableHead>
            <TableHead>Projet</TableHead>
            <TableHead>Étages</TableHead>
            <TableHead>Unités totales</TableHead>
            <TableHead>Disponibles</TableHead>
            <TableHead>Statut construction</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {buildings.map((building) => {
            const project = getProject(building.project);
            const units = calculateAvailableUnits(building);
            
            return (
              <TableRow key={building.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-semibold">{building.name}</div>
                      {building.building_type && (
                        <div className="text-sm text-muted-foreground capitalize">
                          {building.building_type}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-sm">
                      {project.title}
                    </div>
                    {project.cyprus_zone && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3 mr-1" />
                        {project.cyprus_zone.charAt(0).toUpperCase() + project.cyprus_zone.slice(1)}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-sm">{building.total_floors}</span>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-sm">{building.total_units}</span>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-sm font-medium ${units.isSoldOut ? 'text-red-600' : 'text-green-600'}`}>
                        {units.available}
                      </span>
                      {units.isSoldOut && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                          SOLD OUT
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      sur {units.total} ({units.occupancyRate}% occupé)
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(building.construction_status)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/admin/buildings/${building.id}`)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(building)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(building.id, building.name)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
          {buildings.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                Aucun bâtiment trouvé
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BuildingsTable;