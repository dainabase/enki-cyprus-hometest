import { Eye, Edit, Trash2, Building, Mail, Phone, Globe } from 'lucide-react';
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
    <div className="space-y-3">
      {developers.map(dev => (
        <div key={dev.id} className="group bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:bg-white transition-all duration-300 hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 flex-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                {getLogo(dev) ? (
                  <img 
                    src={getLogo(dev)} 
                    alt={`${dev.name} logo`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {dev.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-4 mb-2">
                  <h4 className="text-xl font-bold text-slate-900">{dev.name}</h4>
                  <Badge 
                    variant={dev.status === 'active' ? 'default' : 'secondary'}
                    className={`
                      ${dev.status === 'active' 
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                      }
                    `}
                  >
                    {dev.status === 'active' ? 'Actif' : 'Inactif'}
                  </Badge>
                  
                  {dev.rating_score && (
                    <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-yellow-50 px-3 py-1 rounded-full border border-amber-200">
                      <span className="text-amber-600">⭐</span>
                      <span className="font-bold text-amber-800">{dev.rating_score}/10</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-6 text-slate-600">
                  {dev.main_city && (
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Building className="h-3 w-3 text-slate-700" />
                      </div>
                      <span className="font-medium text-slate-700">{dev.main_city}</span>
                    </div>
                  )}
                  
                  {dev.contact_info?.email && (
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Mail className="h-3 w-3 text-slate-700" />
                      </div>
                      <span className="font-medium text-slate-700 truncate max-w-64">{dev.contact_info.email}</span>
                    </div>
                  )}
                  
                  {dev.contact_info?.phone && (
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Phone className="h-3 w-3 text-slate-700" />
                      </div>
                      <span className="font-medium text-slate-700">{dev.contact_info.phone}</span>
                    </div>
                  )}
                  
                  {dev.website && (
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Globe className="h-3 w-3 text-slate-700" />
                      </div>
                      <a 
                        href={dev.website.startsWith('http') ? dev.website : `https://${dev.website}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-slate-700 hover:text-slate-900 font-medium truncate max-w-40 transition-colors"
                      >
                        {dev.website}
                      </a>
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
                onClick={() => onViewDetails(dev)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Voir
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-700 hover:text-blue-800 transition-all duration-200"
                onClick={() => onEdit(dev)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600 hover:text-red-700 transition-all duration-200"
                onClick={() => onDelete(dev)}
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