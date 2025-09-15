import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Star, Crown, Eye, Trash2 } from 'lucide-react';

interface ProjectCompactViewProps {
  projects: any[];
  onEdit: (project: any) => void;
  selectedProjects: string[];
  onSelectionChange: (ids: string[]) => void;
}

export const ProjectCompactView = ({ 
  projects, 
  onEdit, 
  selectedProjects, 
  onSelectionChange 
}: ProjectCompactViewProps) => {
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
      maximumFractionDigits: 0,
      notation: 'compact'
    }).format(price);
  };

  const getDeveloperName = (developer: any) => {
    if (!developer || typeof developer !== 'object') return 'Non défini';
    return developer.name || 'Non défini';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      {projects.map((project) => (
        <div 
          key={project.id}
          className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
        >
          <Checkbox
            checked={selectedProjects.includes(project.id)}
            onCheckedChange={(checked) => 
              handleProjectSelect(project.id, checked as boolean)
            }
          />
          
          <div className="flex-1 min-w-0 grid grid-cols-5 gap-4 items-center text-sm">
            <div className="truncate font-semibold text-slate-900">
              {project.title}
            </div>
            
            <div className="truncate text-slate-600 font-medium">
              {getDeveloperName(project.developer)}
            </div>
            
            <div className="truncate text-slate-600">
              {project.city || 'N/A'}
              {project.neighborhood && ` - ${project.neighborhood}`}
            </div>
            
            <div className="text-slate-900 font-semibold">
              {formatPrice(project.price || project.price_from || 0)}
            </div>
            
            <div className="flex items-center gap-2">
              <Badge className={`${getStatusColor(project.status)} text-xs`}>
                {project.status === 'available' && 'Dispo'}
                {project.status === 'under_construction' && 'Constr.'}
                {project.status === 'delivered' && 'Livré'}
                {project.status === 'sold' && 'Vendu'}
              </Badge>
              {(project.golden_visa_eligible || project.golden_visa_eligible_new) && (
                <Star className="h-3 w-3 text-amber-500" />
              )}
              {project.exclusive_commercialization && (
                <Crown className="h-3 w-3 text-purple-500" />
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-slate-600 hover:text-slate-900"
            >
              <Eye className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(project)}
              className="h-6 w-6 p-0 text-slate-600 hover:text-slate-900"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-slate-600 hover:text-red-600"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};