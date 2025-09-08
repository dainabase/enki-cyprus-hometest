import React from 'react';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2, Eye, MapPin, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { checkProjectDependencies } from '@/lib/supabase/integrity';

interface ProjectsTableProps {
  projects: any[];
  onEdit: (project: any) => void;
  onRefetch: () => void;
  selectedProjects: string[];
  onSelectionChange: (selectedIds: string[]) => void;
}

const ProjectsTable: React.FC<ProjectsTableProps> = React.memo(({ projects, onEdit, onRefetch, selectedProjects, onSelectionChange }) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Gestion de la sélection (par groupe + tri-state)
  const projectIdsSet = React.useMemo(() => new Set(projects.map(p => p.id)), [projects]);
  const selectedInGroup = React.useMemo(() => selectedProjects.filter(id => projectIdsSet.has(id)), [selectedProjects, projectIdsSet]);

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    const others = selectedProjects.filter(id => !projectIdsSet.has(id));
    if (checked === true) {
      onSelectionChange([...others, ...Array.from(projectIdsSet)]);
    } else {
      onSelectionChange(others);
    }
  };

  const handleSelectProject = (projectId: string, checked: boolean) => {
    if (checked) {
      const next = new Set(selectedProjects);
      next.add(projectId);
      onSelectionChange(Array.from(next));
    } else {
      onSelectionChange(selectedProjects.filter(id => id !== projectId));
    }
  };

  const isAllSelected = projects.length > 0 && selectedInGroup.length === projects.length;
  const isIndeterminate = selectedInGroup.length > 0 && selectedInGroup.length < projects.length;
  const handleDelete = async (projectId: string, projectTitle: string) => {
    try {
      // Check for dependencies first
      const dependencies = await checkProjectDependencies(projectId);
      
      let confirmMessage = `Êtes-vous sûr de vouloir supprimer le projet "${projectTitle}" ?`;
      
      if (dependencies.count > 0) {
        confirmMessage = `⚠️ ATTENTION ⚠️\n\nLe projet "${projectTitle}" a des dépendances :\n${dependencies.details}\n\nLa suppression supprimera aussi ces éléments.\n\nÊtes-vous sûr de vouloir continuer ?`;
      }
      
      if (!confirm(confirmMessage)) {
        return;
      }

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: 'Projet supprimé',
        description: 'Le projet a été supprimé avec succès'
      });
      onRefetch();
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || 'Impossible de supprimer le projet'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusText = t(`status.${status}`, status);
    const statusConfig = {
      'planning': { variant: 'secondary' as const },
      'under_construction': { variant: 'default' as const },
      'delivered': { variant: 'outline' as const },
      'available': { variant: 'secondary' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'secondary' as const };
    return <Badge variant={config.variant}>{statusText}</Badge>;
  };

  const getZoneBadge = (zone: string) => {
    const zoneColors = {
      'limassol': 'bg-blue-100 text-blue-800',
      'paphos': 'bg-green-100 text-green-800',
      'larnaca': 'bg-yellow-100 text-yellow-800',
      'nicosia': 'bg-purple-100 text-purple-800',
      'famagusta': 'bg-red-100 text-red-800'
    };
    
    const colorClass = zoneColors[zone as keyof typeof zoneColors] || 'bg-gray-100 text-gray-800';
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        <MapPin className="w-3 h-3 mr-1" />
        {zone?.charAt(0).toUpperCase() + zone?.slice(1) || 'N/A'}
      </span>
    );
  };

  const formatPrice = (price: number) => {
    if (!price) return 'N/A';
    return `€${price.toLocaleString()}`;
  };

  const calculateUnits = (project: any) => {
    // Calculate from buildings data if available
    const buildings = Array.isArray(project.buildings) ? project.buildings : [];
    const totalFromBuildings = buildings.reduce((sum: number, building: any) => {
      return sum + (building.total_units || 0);
    }, 0);
    
    // Use buildings data if available, otherwise fall back to project data
    const available = project.units_available || Math.floor(totalFromBuildings * 0.3);
    const total = totalFromBuildings || project.total_units || 0;
    
    return `${available}/${total}`;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                aria-label={t('actions.selectAll') || 'Tout sélectionner'}
                checked={isAllSelected ? true : isIndeterminate ? "indeterminate" : false}
                onCheckedChange={(checked) => handleSelectAll(checked === true)}
              />
            </TableHead>
            <TableHead>{t('fields.name')}</TableHead>
            <TableHead>{t('fields.developer')}</TableHead>
            <TableHead>{t('fields.zone')}</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>{t('fields.units')}</TableHead>
            <TableHead>{t('fields.minPrice')}</TableHead>
            <TableHead>Golden Visa</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id} className={selectedProjects.includes(project.id) ? "bg-primary/5" : undefined}>
              <TableCell>
                <Checkbox
                  aria-label={t('actions.selectItem') || 'Sélectionner'}
                  checked={selectedProjects.includes(project.id)}
                  onCheckedChange={(checked) => handleSelectProject(project.id, checked === true)}
                />
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">{project.title}</div>
                    {project.subtitle && (
                      <div className="text-sm text-muted-foreground">{project.subtitle}</div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {project.developer?.name || 'Non assigné'}
                </div>
              </TableCell>
              <TableCell>
                {getZoneBadge(project.cyprus_zone)}
              </TableCell>
              <TableCell>
                {getStatusBadge(project.status)}
              </TableCell>
              <TableCell>
                <span className="font-mono text-sm">
                  {calculateUnits(project)}
                </span>
              </TableCell>
              <TableCell>
                <span className="font-semibold text-primary">
                  {formatPrice(project.price)}
                </span>
              </TableCell>
              <TableCell>
                {project.golden_visa_eligible && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    ✨ {t('fields.goldenVisa')}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/admin/projects/${project.id}`)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(project)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(project.id, project.title)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {projects.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                Aucun projet trouvé
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.projects.length === nextProps.projects.length &&
         prevProps.projects.every((project, index) => project.id === nextProps.projects[index]?.id);
});

ProjectsTable.displayName = 'ProjectsTable';

export default ProjectsTable;