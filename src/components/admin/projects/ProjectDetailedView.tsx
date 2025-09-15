import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { PDFExportButton } from '@/components/admin/properties/PDFExportButton';
import { Separator } from '@/components/ui/separator';
import { 
  Edit, 
  MapPin, 
  Building, 
  Calendar, 
  Euro, 
  Star, 
  Home, 
  Ruler,
  Users,
  Car,
  Zap,
  Crown,
  Award,
  Eye,
  Trash2
} from 'lucide-react';

interface ProjectDetailedViewProps {
  projects: any[];
  onEdit: (project: any) => void;
  selectedProjects: string[];
  onSelectionChange: (ids: string[]) => void;
}

export const ProjectDetailedView = ({ 
  projects, 
  onEdit, 
  selectedProjects, 
  onSelectionChange 
}: ProjectDetailedViewProps) => {
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
    <div className="space-y-6">
      {projects.map((project) => (
        <div key={project.id} className="relative">
          {/* Checkbox positioned in top-left corner of card */}
          <div className="absolute top-4 left-4 z-10">
            <Checkbox
              checked={selectedProjects.includes(project.id)}
              onCheckedChange={(checked) => 
                handleProjectSelect(project.id, checked as boolean)
              }
              className="bg-white border-2 border-slate-300 shadow-lg"
            />
          </div>
          
          <div className="group bg-white/90 backdrop-blur-sm border-2 border-slate-200 rounded-2xl p-8 hover:shadow-2xl hover:bg-white hover:border-slate-300 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start space-x-6 flex-1">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-lg flex-shrink-0">
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
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl flex items-center justify-center" style={{ display: project.photos && project.photos.length > 0 && project.photos[0] ? 'none' : 'flex' }}>
                    <Building className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-2xl font-bold text-slate-900">{project.title}</h3>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status === 'available' && 'Disponible'}
                      {project.status === 'under_construction' && 'En construction'}
                      {project.status === 'delivered' && 'Livré'}
                      {project.status === 'sold' && 'Vendu'}
                    </Badge>
                    
                    <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-2 rounded-full border border-emerald-200">
                      <Euro className="h-5 w-5 text-emerald-600" />
                      <span className="font-bold text-emerald-800 text-lg">
                        {formatPrice(project.price || project.price_from || 0)}
                      </span>
                    </div>
                  </div>
                
                {project.description && (
                  <p className="text-slate-600 mb-4 line-clamp-2 text-lg leading-relaxed">
                    {project.description}
                  </p>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-600">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Building className="h-4 w-4 text-slate-700" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">Développeur</span>
                      <span className="font-semibold text-slate-700">{getDeveloperName(project.developer)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-slate-700" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">Localisation</span>
                      <span className="font-semibold text-slate-700">
                        {project.city || 'Ville non définie'}
                        {project.neighborhood && `, ${project.neighborhood}`}
                      </span>
                    </div>
                  </div>
                  
                  {project.completion_date && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-slate-700" />
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 block">Livraison</span>
                        <span className="font-semibold text-slate-700">{project.completion_date}</span>
                      </div>
                    </div>
                  )}
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

          {/* Détails techniques en grille */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-slate-50/50 rounded-xl border border-slate-100">
            {project.bedrooms_range && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <Home className="h-4 w-4 text-slate-700" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Chambres</span>
                  <span className="font-semibold text-slate-900">{project.bedrooms_range}</span>
                </div>
              </div>
            )}
            
            {project.built_area_m2 && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <Ruler className="h-4 w-4 text-slate-700" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Surface</span>
                  <span className="font-semibold text-slate-900">{project.built_area_m2} m²</span>
                </div>
              </div>
            )}
            
            {(project.total_units || project.total_units_new) && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <Users className="h-4 w-4 text-slate-700" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Unités</span>
                  <span className="font-semibold text-slate-900">
                    {project.total_units_new || project.total_units}
                  </span>
                </div>
              </div>
            )}
            
            {project.parking_spaces && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <Car className="h-4 w-4 text-slate-700" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Parking</span>
                  <span className="font-semibold text-slate-900">{project.parking_spaces}</span>
                </div>
              </div>
            )}
          </div>

          {/* Informations supplémentaires */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <span className="font-medium">Zone:</span>
                <span className="text-slate-900 font-semibold">{project.cyprus_zone || 'Non définie'}</span>
              </div>
              
              {project.energy_rating && (
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Classe énergétique:</span>
                  <span className="text-slate-900 font-semibold">{project.energy_rating}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {(project.golden_visa_eligible || project.golden_visa_eligible_new) && (
                <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-yellow-50 px-3 py-1 rounded-full border border-amber-200">
                  <Star className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-semibold text-amber-800">Golden Visa éligible</span>
                </div>
              )}
              
              {project.exclusive_commercialization && (
                <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-violet-50 px-3 py-1 rounded-full border border-purple-200">
                  <Crown className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-800">Exclusivité</span>
                </div>
              )}
            </div>
          </div>
          </div>
        </div>
      ))}
    </div>
  );
};