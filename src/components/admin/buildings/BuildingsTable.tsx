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
import { useTranslation } from 'react-i18next';

interface BuildingsTableProps {
  buildings: any[];
  onEdit: (building: any) => void;
  onRefetch: () => void;
  isLoading: boolean;
}

const BuildingsTable: React.FC<BuildingsTableProps> = React.memo(({ buildings, onEdit, onRefetch, isLoading }) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleDelete = async (buildingId: string, buildingName: string) => {
    try {
      // Check for dependencies first
      const dependencies = await checkBuildingDependencies(buildingId);
      
      let confirmMessage = t('messages.deleteBuildingConfirm', { defaultValue: 'Are you sure you want to delete the building "{{name}}"?', name: buildingName });
      
      if (dependencies.count > 0) {
        confirmMessage = t('messages.deleteBuildingConfirmWithDeps', { defaultValue: '⚠️ WARNING ⚠️\n\nThe building "{{name}}" has dependencies:\n{{details}}\n\nDeleting it will also remove these items.\n\nAre you sure you want to continue?', name: buildingName, details: dependencies.details });
      }
      
      if (!confirm(confirmMessage)) {
        return;
      }

      const { error } = await supabase
        .from('buildings_enhanced')
        .delete()
        .eq('id', buildingId);

      if (error) throw error;

      toast({
        title: t('messages.buildingDeletedTitle', { defaultValue: 'Building deleted' }),
        description: t('messages.buildingDeleted', { defaultValue: 'The building has been deleted successfully' })
      });
      onRefetch();
    } catch (error: any) {
      console.error('Error deleting building:', error);
      toast({
        variant: 'destructive',
        title: t('messages.error', { defaultValue: 'Error' }),
        description: t('messages.deleteBuildingError', { defaultValue: 'Unable to delete the building' })
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'planning': { label: t('status.planning', { defaultValue: 'Planning' }), variant: 'secondary' as const, color: 'bg-blue-100 text-blue-800' },
      'foundation': { label: t('status.foundation', { defaultValue: 'Foundation' }), variant: 'default' as const, color: 'bg-yellow-100 text-yellow-800' },
      'structure': { label: t('status.structure', { defaultValue: 'Structure' }), variant: 'default' as const, color: 'bg-orange-100 text-orange-800' },
      'finishing': { label: t('status.finishing', { defaultValue: 'Finishing' }), variant: 'default' as const, color: 'bg-purple-100 text-purple-800' },
      'completed': { label: t('status.completed', { defaultValue: 'Completed' }), variant: 'outline' as const, color: 'bg-green-100 text-green-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'secondary' as const, color: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getProject = (project: any) => {
    if (!project || typeof project !== 'object') return { title: t('admin.common.unassigned', { defaultValue: 'Unassigned' }), zone: '' };
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
            <TableHead>{t('fields.buildingName', { defaultValue: 'Building Name' })}</TableHead>
            <TableHead>{t('fields.project', { defaultValue: 'Project' })}</TableHead>
            <TableHead>{t('fields.floors', { defaultValue: 'Floors' })}</TableHead>
            <TableHead>{t('fields.totalUnits', { defaultValue: 'Total Units' })}</TableHead>
            <TableHead>{t('fields.available', { defaultValue: 'Available' })}</TableHead>
            <TableHead>{t('fields.constructionStatus', { defaultValue: 'Construction Status' })}</TableHead>
            <TableHead className="text-right">{t('actions.actions', { defaultValue: 'Actions' })}</TableHead>
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
                          {t('admin.buildings.soldOut', { defaultValue: 'SOLD OUT' })}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t('admin.buildings.outOf', { defaultValue: 'of {{total}} ({{rate}}% occupied)', total: units.total, rate: units.occupancyRate })}
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
                {t('admin.common.noBuildingsFound', { defaultValue: 'No buildings found' })}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.buildings.length === nextProps.buildings.length &&
         prevProps.buildings.every((building, index) => building.id === nextProps.buildings[index]?.id) &&
         prevProps.isLoading === nextProps.isLoading;
});

BuildingsTable.displayName = 'BuildingsTable';

export default BuildingsTable;