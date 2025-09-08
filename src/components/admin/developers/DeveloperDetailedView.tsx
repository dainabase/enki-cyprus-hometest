import { Eye, Edit, Trash2, Building, Mail, Phone, Globe, MapPin, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface Developer {
  id: string;
  name: string;
  logo?: string;
  main_city?: string;
  status?: string;
  commission_rate?: number;
  contact_info?: any;
  total_projects?: number;
  rating_score?: number;
  founded_year?: number;
  years_experience?: number;
  main_activities?: string;
  key_projects?: string;
  website?: string;
  financial_stability?: string;
  payment_terms?: string;
}

interface DeveloperDetailedViewProps {
  developers: Developer[];
  getLogo: (dev: Developer) => string | undefined;
  onEdit: (dev: Developer) => void;
  onDelete: (dev: Developer) => void;
  onViewDetails: (dev: Developer) => void;
}

export const DeveloperDetailedView = ({ 
  developers, 
  getLogo, 
  onEdit, 
  onDelete, 
  onViewDetails 
}: DeveloperDetailedViewProps) => {
  return (
    <div className="space-y-6">
      {developers.map(dev => (
        <Card key={dev.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                  {getLogo(dev) ? (
                    <img 
                      src={getLogo(dev)} 
                      alt={`${dev.name} logo`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center">
                      <span className="text-primary font-bold text-lg">
                        {dev.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold">{dev.name}</h3>
                    <Badge variant={dev.status === 'active' ? 'default' : 'secondary'}>
                      {dev.status === 'active' ? 'Actif' : 'Inactif'}
                    </Badge>
                    {dev.rating_score && (
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{dev.rating_score}/10</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    {dev.main_city && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{dev.main_city}</span>
                      </div>
                    )}
                    
                    {dev.founded_year && (
                      <div className="flex items-center space-x-1">
                        <Building className="h-4 w-4" />
                        <span>Fondé en {dev.founded_year}</span>
                      </div>
                    )}
                    
                    {dev.years_experience && (
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>{dev.years_experience} ans d'expérience</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onViewDetails(dev)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Détails
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEdit(dev)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onDelete(dev)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Contact */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Contact</h4>
                <div className="space-y-2">
                  {dev.contact_info?.email && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{dev.contact_info.email}</span>
                    </div>
                  )}
                  
                  {dev.contact_info?.phone && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{dev.contact_info.phone}</span>
                    </div>
                  )}
                  
                  {dev.website && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a href={dev.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                        {dev.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Statistiques */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Statistiques</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Stabilité financière:</span>
                    <span className="font-medium">{dev.financial_stability || 'N/A'}</span>
                  </div>
                  {dev.rating_score && (
                    <div className="flex justify-between text-sm">
                      <span>Note:</span>
                      <span className="font-medium">⭐ {dev.rating_score}/10</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Activités */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Activités</h4>
                <div className="space-y-2">
                  {dev.main_activities && (
                    <p className="text-sm">{dev.main_activities}</p>
                  )}
                  {dev.payment_terms && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Conditions de paiement:</span>
                      <span className="ml-2">{dev.payment_terms}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {dev.key_projects && (
              <div className="border-t pt-4">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-2">Projets clés</h4>
                <p className="text-sm">{dev.key_projects}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};