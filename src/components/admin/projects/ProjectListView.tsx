import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Edit, MapPin, Building, Calendar, Euro, Star, Crown, Eye, Trash2 } from 'lucide-react';

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
    <div className="space-y-3">
      {projects.map(project => (
        <div key={project.id} className="group bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:bg-white transition-all duration-300 hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 flex-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                {project.photos && project.photos[0] ? (
                  <img 
                    src={project.photos[0]} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl flex items-center justify-center">
                    <Building className="h-6 w-6 text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-4 mb-2">
                  <Checkbox
                    checked={selectedProjects.includes(project.id)}
                    onCheckedChange={(checked) => 
                      handleProjectSelect(project.id, checked as boolean)
                    }
                  />
                  <h4 className="text-xl font-bold text-slate-900">{project.title}</h4>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status === 'available' && 'Disponible'}
                    {project.status === 'under_construction' && 'En construction'}
                    {project.status === 'delivered' && 'Livré'}
                    {project.status === 'sold' && 'Vendu'}
                  </Badge>
                  
                  <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-green-50 px-3 py-1 rounded-full border border-emerald-200">
                    <Euro className="h-4 w-4 text-emerald-600" />
                    <span className="font-bold text-emerald-800">
                      {formatPrice(project.price || project.price_from || 0)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-slate-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Building className="h-3 w-3 text-slate-700" />
                    </div>
                    <span className="font-medium text-slate-700">{getDeveloperName(project.developer)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center">
                      <MapPin className="h-3 w-3 text-slate-700" />
                    </div>
                    <span className="font-medium text-slate-700">
                      {project.city || 'Ville non définie'}
                      {project.neighborhood && `, ${project.neighborhood}`}
                    </span>
                  </div>
                  
                  {project.completion_date && (
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Calendar className="h-3 w-3 text-slate-700" />
                      </div>
                      <span className="font-medium text-slate-700">Livraison: {project.completion_date}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    {(project.golden_visa_eligible || project.golden_visa_eligible_new) && (
                      <div className="flex items-center gap-1 text-xs text-amber-600">
                        <Star className="h-3 w-3" />
                        <span>Golden Visa</span>
                      </div>
                    )}
                    {project.exclusive_commercialization && (
                      <Crown className="h-4 w-4 text-purple-600" />
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 ml-6">
              <Button 
                variant="outline" 
                size="sm"
                className="border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
              >
                <Eye className="h-4 w-4 mr-2" />
                Voir
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-700 hover:text-blue-800 transition-all duration-200"
                onClick={() => onEdit(project)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600 hover:text-red-700 transition-all duration-200"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};