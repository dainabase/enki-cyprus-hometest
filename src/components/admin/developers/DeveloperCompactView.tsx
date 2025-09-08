import { Eye, Edit, Trash2 } from 'lucide-react';
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
}

interface DeveloperCompactViewProps {
  developers: Developer[];
  getLogo: (dev: Developer) => string | undefined;
  onEdit: (dev: Developer) => void;
  onDelete: (dev: Developer) => void;
  onViewDetails: (dev: Developer) => void;
}

export const DeveloperCompactView = ({ 
  developers, 
  getLogo, 
  onEdit, 
  onDelete, 
  onViewDetails 
}: DeveloperCompactViewProps) => {
  return (
    <div className="space-y-1">
      {developers.map(dev => (
        <div key={dev.id} className="flex items-center justify-between p-2 bg-card rounded border hover:shadow-sm transition-shadow">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="w-8 h-8 rounded bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
              {getLogo(dev) ? (
                <img 
                  src={getLogo(dev)} 
                  alt={`${dev.name} logo`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-primary font-bold text-xs">
                  {dev.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-medium truncate">{dev.name}</span>
                <Badge 
                  variant={dev.status === 'active' ? 'default' : 'secondary'}
                  className="text-xs px-1 py-0"
                >
                  {dev.status === 'active' ? 'A' : 'I'}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              {dev.main_city && (
                <span className="hidden sm:inline">{dev.main_city}</span>
              )}
              {dev.rating_score && (
                <span>⭐{dev.rating_score}/10</span>
              )}
            </div>
          </div>
          
          <div className="flex space-x-1 ml-2">
            <Button 
              variant="outline" 
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => onViewDetails(dev)}
            >
              <Eye className="h-3 w-3" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => onEdit(dev)}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="h-7 w-7 p-0 text-destructive hover:text-destructive"
              onClick={() => onDelete(dev)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};