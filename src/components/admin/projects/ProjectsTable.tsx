import React from 'react';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2, Eye, MapPin, Building, Award, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { checkProjectDependencies } from '@/lib/supabase/integrity';
import { ProjectStatusActions } from '@/components/admin/ProjectStatusActions';

interface ProjectBuilding {
  total_units?: number | null;
  [key: string]: unknown;
}

interface ProjectRow {
  id: string;
  title?: string | null;
  status?: string | null;
  cyprus_zone?: string | null;
  zone?: string | null;
  price_from?: number | null;
  total_units?: number | null;
  total_units_new?: number | null;
  units_available?: number | null;
  units_available_new?: number | null;
  golden_visa_eligible?: boolean | null;
  buildings?: ProjectBuilding[];
  [key: string]: unknown;
}

interface ProjectsTableProps {
  projects: ProjectRow[];
  onEdit: (project: ProjectRow) => void;
  onRefetch: () => void;
  selectedProjects: string[];
  onSelectionChange: (selectedIds: string[]) => void;
}

const ProjectsTable: React.FC<ProjectsTableProps> = React.memo(({ projects, onEdit, onRefetch, selectedProjects, onSelectionChange }) => {
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
      
      let confirmMessage = t('messages.deleteProjectConfirm', { defaultValue: 'Are you sure you want to delete the project "{{title}}"?', title: projectTitle });
      
      if (dependencies.count > 0) {
        confirmMessage = t('messages.deleteProjectConfirmWithDeps', { defaultValue: '⚠️ WARNING ⚠️\n\nThe project "{{title}}" has dependencies:\n{{details}}\n\nDeleting it will also remove these items.\n\nAre you sure you want to continue?', title: projectTitle, details: dependencies.details });
      }
      
      if (!confirm(confirmMessage)) {
        return;
      }

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      toast.success('Projet supprimé', {
        description: 'Le projet a été supprimé avec succès.'
      });
      onRefetch();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Erreur', {
        description: 'Impossible de supprimer le projet.'
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
        {t(`zones.${zone}`, { defaultValue: zone ? zone.charAt(0).toUpperCase() + zone.slice(1) : 'N/A' })}
      </span>
    );
  };

  const formatPrice = (price: number) => {
    if (!price) return 'N/A';
    return `€${price.toLocaleString()}`;
  };

  const calculateUnits = (project: ProjectRow) => {
    const buildings = Array.isArray(project.buildings) ? project.buildings : [];
    const totalFromBuildings = buildings.reduce((sum: number, building: ProjectBuilding) => {
      return sum + (building.total_units ?? 0);
    }, 0);

    const available = project.units_available_new ?? project.units_available ?? Math.floor(totalFromBuildings * 0.3) ?? 0;
    const total = project.total_units_new ?? totalFromBuildings ?? project.total_units ?? 0;

    return `${available}/${total}`;
  };

  return (
    <div className="rounded-md border">
      <Table className="table-fixed">
        <colgroup>
          <col style={{ width: "48px" }} />
          <col style={{ width: "250px" }} />
          <col style={{ width: "150px" }} />
          <col style={{ width: "120px" }} />
          <col style={{ width: "120px" }} />
          <col style={{ width: "80px" }} />
          <col style={{ width: "120px" }} />
          <col style={{ width: "60px" }} />
          <col style={{ width: "120px" }} />
        </colgroup>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 flex-shrink-0">
              <Checkbox
                aria-label={t('actions.selectAll', { defaultValue: 'Select all' })}
                checked={isAllSelected ? true : isIndeterminate ? "indeterminate" : false}
                onCheckedChange={(checked) => handleSelectAll(checked === true)}
              />
            </TableHead>
            <TableHead className="w-[250px]">{t('fields.name', { defaultValue: 'Name' })}</TableHead>
            <TableHead className="w-[150px]">{t('fields.developer', { defaultValue: 'Developer' })}</TableHead>
            <TableHead className="w-[120px]">{t('fields.zone', { defaultValue: 'Zone' })}</TableHead>
            <TableHead className="w-[120px]">{t('fields.status', { defaultValue: 'Status' })}</TableHead>
            <TableHead className="w-[80px] text-center">{t('fields.units', { defaultValue: 'Units' })}</TableHead>
            <TableHead className="w-[120px]">{t('fields.priceMax', { defaultValue: 'Max Price' })}</TableHead>
            <TableHead className="w-[60px] text-center">{t('admin.projects.headers.gv', { defaultValue: 'GV' })}</TableHead>
            <TableHead className="w-[120px] text-right">{t('actions.actions', { defaultValue: 'Actions' })}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id} className={selectedProjects.includes(project.id) ? "bg-primary/5" : undefined}>
          <TableCell className="w-12">
            <Checkbox
              aria-label={t('actions.selectItem', { defaultValue: 'Select' })}
              checked={selectedProjects.includes(project.id)}
              onCheckedChange={(checked) => handleSelectProject(project.id, checked === true)}
            />
          </TableCell>
              <TableCell className="w-[250px]">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold truncate" title={project.title}>
                      {project.title}
                    </div>
                    {project.subtitle && (
                      <div className="text-sm text-muted-foreground truncate" title={project.subtitle}>
                        {project.subtitle}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
            <TableCell className="w-[150px]">
              <div className="text-sm font-medium truncate" title={project.developer?.name || t('admin.common.unassigned', { defaultValue: 'Unassigned' })}>
                {project.developer?.name || t('admin.common.unassigned', { defaultValue: 'Unassigned' })}
              </div>
            </TableCell>
              <TableCell className="w-[120px]">
                {getZoneBadge(project.cyprus_zone)}
              </TableCell>
              <TableCell className="w-[120px]">
                <ProjectStatusActions 
                  project={{
                    id: project.id,
                    title: project.title,
                    status: project.status
                  }}
                  compact={true}
                />
              </TableCell>
              <TableCell className="w-[80px] text-center">
                <span className="font-mono text-sm">
                  {calculateUnits(project)}
                </span>
              </TableCell>
              <TableCell className="w-[120px]">
                <span className="font-semibold text-primary">
                  {formatPrice((project.price_to ?? project.price) as number)}
                </span>
              </TableCell>
              <TableCell className="w-[60px] text-center">
                <div className="flex items-center justify-center gap-1">
                  {(project.golden_visa_eligible || project.golden_visa_eligible_new) && (
                    <div title={t('admin.projects.flags.goldenVisa', { defaultValue: 'Golden Visa Eligible' })}>
                      <Award className="w-4 h-4 text-yellow-600" />
                    </div>
                  )}
                  {project.exclusive_commercialization && (
                    <div title={t('admin.projects.flags.exclusive', { defaultValue: 'Exclusive Commercialization' })}>
                      <Crown className="w-4 h-4 text-purple-600" />
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="w-[120px] text-right">
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
                {t('admin.common.noProjectsFound', { defaultValue: 'No projects found' })}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}, (prevProps, nextProps) => {
  // Re-render when selection changes
  if (prevProps.selectedProjects.length !== nextProps.selectedProjects.length) return false;
  const prevSet = new Set(prevProps.selectedProjects);
  for (const id of nextProps.selectedProjects) {
    if (!prevSet.has(id)) return false;
  }
  // Preserve optimization for stable project lists
  return (
    prevProps.projects.length === nextProps.projects.length &&
    prevProps.projects.every((project, index) => project.id === nextProps.projects[index]?.id)
  );
});

ProjectsTable.displayName = 'ProjectsTable';

export default ProjectsTable;