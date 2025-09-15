import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { PDFExportButton } from '@/components/admin/properties/PDFExportButton';
import { Edit, MapPin, Building, Calendar, Euro, Star, Crown, Eye, Trash2 } from 'lucide-react';

interface ProjectCardViewProps {
  projects: any[];
  onEdit: (project: any) => void;
  selectedProjects: string[];
  onSelectionChange: (ids: string[]) => void;
}

export const ProjectCardView = ({ 
  projects, 
  onEdit, 
  selectedProjects, 
  onSelectionChange 
}: ProjectCardViewProps) => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card key={project.id} className="group bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
          <CardHeader className="p-6 pb-4 flex flex-col h-24">
            <div className="flex items-start justify-between h-full">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <Checkbox
                  checked={selectedProjects.includes(project.id)}
                  onCheckedChange={(checked) => 
                    handleProjectSelect(project.id, checked as boolean)
                  }
                  className="mt-1 flex-shrink-0"
                />
                <CardTitle className="text-lg font-semibold text-slate-900 line-clamp-2 leading-tight">
                  {project.title}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 pt-0 space-y-4 flex-1">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Building className="h-4 w-4 text-slate-900" />
                <span className="font-medium">{getDeveloperName(project.developer)}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="h-4 w-4 text-slate-900" />
                <span>
                  {project.city || 'Ville non définie'}
                  {project.neighborhood && `, ${project.neighborhood}`}
                </span>
              </div>

              {project.completion_date && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="h-4 w-4 text-slate-900" />
                  <span>Livraison: {project.completion_date}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Euro className="h-4 w-4 text-slate-900" />
                <span className="font-semibold text-slate-900">
                  {formatPrice(project.price || project.price_from || 0)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Badge className={getStatusColor(project.status)}>
                {project.status === 'available' && 'Disponible'}
                {project.status === 'under_construction' && 'En construction'}
                {project.status === 'delivered' && 'Livré'}
                {project.status === 'sold' && 'Vendu'}
              </Badge>
              
              <div className="flex items-center gap-2">
                {(project.golden_visa_eligible || project.golden_visa_eligible_new) && (
                  <div className="flex items-center gap-1 text-xs text-amber-600">
                    <Star className="h-3 w-3" />
                    <span>Golden Visa</span>
                  </div>
                )}
                {project.exclusive_commercialization && (
                  <div title="Exclusivité">
                    <Crown className="h-4 w-4 text-purple-600" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="text-xs text-slate-500">
                Zone: {project.cyprus_zone || 'Non définie'}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-slate-600 hover:text-slate-900"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(project)}
                  className="h-8 w-8 p-0 text-slate-600 hover:text-slate-900"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-slate-600 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};