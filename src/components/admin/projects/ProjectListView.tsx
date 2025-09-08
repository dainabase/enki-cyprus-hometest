import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Edit, MapPin, Building, Calendar, Euro, Star } from 'lucide-react';

interface ProjectListViewProps {
  projects: any[];
  onEdit: (project: any) => void;
  selectedProjects: string[];
  onSelectionChange: (ids: string[]) => void;
}

export const ProjectListView = ({ 
  projects, 
  onEdit, 
  selectedProjects, 
  onSelectionChange 
}: ProjectListViewProps) => {
  const handleProjectSelect = (projectId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedProjects, projectId]);
    } else {
      onSelectionChange(selectedProjects.filter(id => id !== projectId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'under_construction': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-blue-100 text-blue-800';
      case 'sold': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getDeveloperName = (developer: any) => {
    if (!developer || typeof developer !== 'object') return 'Non défini';
    return developer.name || 'Non défini';
  };

  return (
    <div className="space-y-1">
      {projects.map((project, index) => (
        <div key={project.id}>
          <div className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
            <Checkbox
              checked={selectedProjects.includes(project.id)}
              onCheckedChange={(checked) => 
                handleProjectSelect(project.id, checked as boolean)
              }
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg truncate pr-4">
                  {project.title}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(project.status)}>
                    {project.status === 'available' && 'Disponible'}
                    {project.status === 'under_construction' && 'En construction'}
                    {project.status === 'delivered' && 'Livré'}
                    {project.status === 'sold' && 'Vendu'}
                  </Badge>
                  {project.golden_visa_eligible && (
                    <div className="flex items-center gap-1 text-xs text-amber-600">
                      <Star className="h-3 w-3" />
                      <span>Golden Visa</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span>{getDeveloperName(project.developer)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {project.city || 'Ville non définie'}
                    {project.neighborhood && `, ${project.neighborhood}`}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Euro className="h-4 w-4 text-green-600" />
                  <span className="font-semibold text-green-600">
                    {formatPrice(project.price || project.price_from || 0)}
                  </span>
                </div>
              </div>

              {project.completion_date && (
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Livraison: {project.completion_date}</span>
                </div>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(project)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          {index < projects.length - 1 && <Separator />}
        </div>
      ))}
    </div>
  );
};