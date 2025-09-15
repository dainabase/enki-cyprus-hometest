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
  Award
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
        <Card key={project.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedProjects.includes(project.id)}
                  onCheckedChange={(checked) => 
                    handleProjectSelect(project.id, checked as boolean)
                  }
                />
                <div>
                  <CardTitle className="text-xl">
                    {project.title}
                  </CardTitle>
                  {project.description && (
                    <p className="text-muted-foreground mt-1 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(project.status)}>
                    {project.status === 'available' && 'Disponible'}
                    {project.status === 'under_construction' && 'En construction'}
                    {project.status === 'delivered' && 'Livré'}
                    {project.status === 'sold' && 'Vendu'}
                  </Badge>
                  {(project.golden_visa_eligible || project.golden_visa_eligible_new) && (
                    <div title="Golden Visa Eligible">
                      <Award className="h-4 w-4 text-yellow-600" />
                    </div>
                  )}
                  {project.exclusive_commercialization && (
                    <div title="Commercialisation Exclusive">
                      <Crown className="h-4 w-4 text-purple-600" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <PDFExportButton 
                    propertyId={project.id}
                    variant="ghost"
                    size="sm"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(project)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Informations principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Développeur :</span>
                <span className="font-medium">{getDeveloperName(project.developer)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Localisation :</span>
                <span className="font-medium">
                  {project.city || 'Ville non définie'}
                  {project.neighborhood && `, ${project.neighborhood}`}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Euro className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Prix :</span>
                <span className="font-semibold text-green-600">
                  {formatPrice(project.price || project.price_from || 0)}
                </span>
              </div>
            </div>

            <Separator />

            {/* Détails techniques */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
              {project.bedrooms_range && (
                <div className="flex items-start gap-2">
                  <Home className="h-4 w-4 text-slate-900 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-600 block">Chambres :</span>
                    <span className="text-sm font-medium text-slate-900">{project.bedrooms_range}</span>
                  </div>
                </div>
              )}
              
              {project.built_area_m2 && (
                <div className="flex items-start gap-2">
                  <Ruler className="h-4 w-4 text-slate-900 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-600 block">Surface :</span>
                    <span className="text-sm font-medium text-slate-900">{project.built_area_m2} m²</span>
                  </div>
                </div>
              )}
              
              {(project.total_units || project.total_units_new) && (
                <div className="flex items-start gap-2">
                  <Users className="h-4 w-4 text-slate-900 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-600 block">Unités :</span>
                    <span className="text-sm font-medium text-slate-900">
                      {project.total_units_new || project.total_units}
                    </span>
                  </div>
                </div>
              )}
              
              {project.parking_spaces && (
                <div className="flex items-start gap-2">
                  <Car className="h-4 w-4 text-slate-900 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-600 block">Parking :</span>
                    <span className="text-sm font-medium text-slate-900">{project.parking_spaces}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Informations supplémentaires */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                {project.completion_date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Livraison: {project.completion_date}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Zone:</span>
                  <span>{project.cyprus_zone || 'Non définie'}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {(project.golden_visa_eligible || project.golden_visa_eligible_new) && (
                  <div className="flex items-center gap-1 text-amber-600">
                    <Star className="h-4 w-4" />
                    <span className="text-sm">Golden Visa éligible</span>
                  </div>
                )}
                
                {project.energy_rating && (
                  <div className="flex items-center gap-1 text-green-600">
                    <Zap className="h-4 w-4" />
                    <span className="text-sm">Classe énergétique {project.energy_rating}</span>
                  </div>
                )}
                
                {project.exclusive_commercialization && (
                  <div className="flex items-center gap-1 text-purple-600">
                    <Crown className="h-4 w-4" />
                    <span className="text-sm">Exclusivité</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};