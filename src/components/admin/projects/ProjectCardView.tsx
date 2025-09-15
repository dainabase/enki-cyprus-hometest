import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
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

  // Group projects by developer
  const groupedByDeveloper = projects.reduce((acc, project) => {
    const developerName = getDeveloperName(project.developer);
    if (!acc[developerName]) acc[developerName] = [];
    acc[developerName].push(project);
    return acc;
  }, {} as Record<string, any[]>);

  const sortedDevelopers = Object.keys(groupedByDeveloper).sort();

  return (
    <div className="space-y-10">
      {sortedDevelopers.map(developerName => (
        <div key={developerName} className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-slate-900 to-slate-600 rounded-full"></div>
            <h3 className="text-xl font-bold text-slate-900">{developerName}</h3>
            <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {groupedByDeveloper[developerName].length} projet{groupedByDeveloper[developerName].length !== 1 ? 's' : ''}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {groupedByDeveloper[developerName].map(project => (
              <div key={project.id} className="relative">
          {/* Checkbox positioned in top-right corner for better UX */}
          <div className="absolute top-3 right-3 z-10">
            <Checkbox
              checked={selectedProjects.includes(project.id)}
              onCheckedChange={(checked) => 
                handleProjectSelect(project.id, checked as boolean)
              }
              className="bg-white/95 border-2 border-slate-300 shadow-lg backdrop-blur-sm"
            />
          </div>
                
                <Card className="group hover:shadow-xl transition-all duration-300 border-2 border-slate-200 bg-white hover:border-slate-300 hover:-translate-y-1 flex flex-col h-full">
                  <CardHeader className="pb-4">
                    <div className="flex items-start space-x-4 h-20">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                        {project.photos && project.photos.length > 0 && project.photos[0] ? (
                          <img 
                            src={project.photos[0]} 
                            alt={project.title}
                            className="w-full h-full object-cover rounded-xl"
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl flex items-center justify-center" style={{ display: project.photos && project.photos.length > 0 && project.photos[0] ? 'none' : 'flex' }}>
                          <Building className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 h-full flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-slate-900 text-lg leading-tight line-clamp-2">{project.title}</h4>
                          <p className="text-slate-500 font-medium mt-1">
                            {project.city || 'Ville non définie'}
                            {project.neighborhood && `, ${project.neighborhood}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-auto">
                          <Badge className={getStatusColor(project.status)}>
                            {project.status === 'available' && 'Disponible'}
                            {project.status === 'under_construction' && 'En construction'}
                            {project.status === 'delivered' && 'Livré'}
                            {project.status === 'sold' && 'Vendu'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                
                <CardContent className="space-y-4 flex-1">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                    <span className="text-sm font-medium text-emerald-800">Prix</span>
                    <span className="font-bold text-emerald-800">
                      {formatPrice(project.price || project.price_from || 0)}
                    </span>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-slate-700" />
                      </div>
                      <span className="text-slate-700 font-medium truncate">
                        Zone: {project.cyprus_zone || 'Non définie'}
                      </span>
                    </div>
                    
                    {project.completion_date && (
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-slate-700" />
                        </div>
                        <span className="text-slate-700 font-medium">Livraison: {project.completion_date}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
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
                </CardContent>
                
                <CardFooter className="pt-4 border-t border-slate-100 mt-auto">
                  <div className="flex gap-2 w-full">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Voir
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-700 hover:text-blue-800 transition-all duration-200"
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
                </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};