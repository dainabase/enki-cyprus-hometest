import { Eye, Edit, Trash2, Building, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
  website?: string;
}

interface DeveloperListViewProps {
  developers: Developer[];
  getLogo: (dev: Developer) => string | undefined;
  onEdit: (dev: Developer) => void;
  onDelete: (dev: Developer) => void;
  onViewDetails: (dev: Developer) => void;
}

export const DeveloperListView = ({ 
  developers, 
  getLogo, 
  onEdit, 
  onDelete, 
  onViewDetails 
}: DeveloperListViewProps) => {
  return (
    <div className="space-y-2">
      {developers.map(dev => (
        <div key={dev.id} className="flex items-center justify-between p-4 bg-card rounded-lg border hover:shadow-sm transition-shadow">
          <div className="flex items-center space-x-4 flex-1">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
              {getLogo(dev) ? (
                <img 
                  src={getLogo(dev)} 
                  alt={`${dev.name} logo`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">
                    {dev.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3">
                <h4 className="font-medium">{dev.name}</h4>
                <Badge variant={dev.status === 'active' ? 'default' : 'secondary'}>
                  {dev.status === 'active' ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                {dev.main_city && (
                  <div className="flex items-center space-x-1">
                    <Building className="h-3 w-3" />
                    <span>{dev.main_city}</span>
                  </div>
                )}
                
                {dev.contact_info?.email && (
                  <div className="flex items-center space-x-1">
                    <Mail className="h-3 w-3" />
                    <span className="truncate max-w-48">{dev.contact_info.email}</span>
                  </div>
                )}
                
                {dev.contact_info?.phone && (
                  <div className="flex items-center space-x-1">
                    <Phone className="h-3 w-3" />
                    <span>{dev.contact_info.phone}</span>
                  </div>
                )}
                
                {dev.website && (
                  <div className="flex items-center space-x-1">
                    <Building className="h-3 w-3" />
                    <span className="truncate max-w-32">Site web</span>
                  </div>
                )}
              </div>
            </div>
            
            {dev.rating_score && (
              <div className="flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="font-medium">⭐ {dev.rating_score}/10</div>
                  <div className="text-xs text-muted-foreground">Note</div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex space-x-1 ml-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewDetails(dev)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit(dev)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDelete(dev)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};