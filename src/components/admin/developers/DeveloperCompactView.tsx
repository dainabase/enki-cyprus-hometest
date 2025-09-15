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
    <div className="space-y-2">
      {developers.map((dev, index) => (
        <div 
          key={dev.id} 
          className={`
            flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5
            ${index % 2 === 0 
              ? 'bg-white border-slate-200' 
              : 'bg-slate-50/80 border-slate-100'
            }
          `}
        >
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
              {getLogo(dev) ? (
                <img 
                  src={getLogo(dev)} 
                  alt={`${dev.name} logo`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-slate-700 font-bold text-sm">
                  {dev.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3">
                <span className="font-bold text-slate-900 truncate">{dev.name}</span>
                <Badge 
                  variant={dev.status === 'active' ? 'default' : 'secondary'}
                  className={`
                    text-xs px-2 py-1
                    ${dev.status === 'active' 
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                    }
                  `}
                >
                  {dev.status === 'active' ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              {dev.main_city && (
                <span className="hidden sm:inline text-slate-600 font-medium">{dev.main_city}</span>
              )}
              {dev.rating_score && (
                <div className="flex items-center gap-1">
                  <span className="text-amber-500">⭐</span>
                  <span className="font-bold text-amber-800">{dev.rating_score}/10</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2 ml-4">
            <Button 
              variant="outline" 
              size="sm"
              className="h-8 w-8 p-0 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
              onClick={() => onViewDetails(dev)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="h-8 w-8 p-0 border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-700 hover:text-blue-800 transition-all duration-200"
              onClick={() => onEdit(dev)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="h-8 w-8 p-0 border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600 hover:text-red-700 transition-all duration-200"
              onClick={() => onDelete(dev)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};