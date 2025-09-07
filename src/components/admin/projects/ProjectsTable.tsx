import React from 'react';
import { Edit, Trash2, Eye, MapPin, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { checkProjectDependencies } from '@/lib/supabase/integrity';

interface ProjectsTableProps {
  projects: any[];
  onEdit: (project: any) => void;
  onRefetch: () => void;
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({ projects, onEdit, onRefetch }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

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
    const statusConfig = {
      'planning': { label: 'Planification', variant: 'secondary' as const },
      'under_construction': { label: 'Construction', variant: 'default' as const },
      'delivered': { label: 'Livré', variant: 'outline' as const },
      'available': { label: 'Disponible', variant: 'secondary' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'secondary' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
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
            <TableHead>Nom du projet</TableHead>
            <TableHead>Développeur</TableHead>
            <TableHead>Zone</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Unités</TableHead>
            <TableHead>Prix min</TableHead>
            <TableHead>Golden Visa</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
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
                    ✨ Golden Visa
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
              <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                Aucun projet trouvé
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectsTable;