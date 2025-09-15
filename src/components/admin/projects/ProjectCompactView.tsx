import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Star, Crown, Eye, Trash2, Building } from 'lucide-react';

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
    <div className="space-y-2">
      {projects.map(project => (
        <div 
          key={project.id}
          className="group bg-white border border-slate-200 rounded-xl p-4 hover:shadow-lg hover:border-slate-300 transition-all duration-300 hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-4">
            <Checkbox
              checked={selectedProjects.includes(project.id)}
              onCheckedChange={(checked) => 
                handleProjectSelect(project.id, checked as boolean)
              }
            />
            
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden border border-white shadow-sm flex-shrink-0">
              {project.photos && project.photos[0] ? (
                <img 
                  src={project.photos[0]} 
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-slate-900 to-slate-700 rounded-lg flex items-center justify-center">
                  <Building className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0 grid grid-cols-5 gap-4 items-center text-sm">
              <div className="truncate font-bold text-slate-900">
                {project.title}
              </div>
              
              <div className="truncate font-semibold text-slate-700">
                {getDeveloperName(project.developer)}
              </div>
              
              <div className="truncate text-slate-600">
                {project.city || 'N/A'}
                {project.neighborhood && ` - ${project.neighborhood}`}
              </div>
              
              <div className="font-bold text-emerald-700">
                {formatPrice(project.price || project.price_from || 0)}
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className={`${getStatusColor(project.status)} text-xs border`}>
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
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="h-8 w-8 p-0 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
              >
                <Eye className="h-3 w-3" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEdit(project)}
                className="h-8 w-8 p-0 border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-700 hover:text-blue-800 transition-all duration-200"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="h-8 w-8 p-0 border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600 hover:text-red-700 transition-all duration-200"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};