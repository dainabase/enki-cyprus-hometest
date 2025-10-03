import { Eye, CreditCard as Edit, Trash2, Mail, Phone, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

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

interface DeveloperCardViewProps {
  developers: Developer[];
  getLogo: (dev: Developer) => string | undefined;
  onEdit: (dev: Developer) => void;
  onDelete: (dev: Developer) => void;
  onViewDetails: (dev: Developer) => void;
}

export const DeveloperCardView = ({ 
  developers, 
  getLogo, 
  onEdit, 
  onDelete, 
  onViewDetails 
}: DeveloperCardViewProps) => {
  const groupedByZone = developers.reduce((acc, dev) => {
    const zone = dev.main_city || 'Non spécifié';
    if (!acc[zone]) acc[zone] = [];
    acc[zone].push(dev);
    return acc;
  }, {} as Record<string, Developer[]>);

  const zoneOrder = ['Limassol', 'Larnaca', 'Paphos', 'Famagusta', 'Kyrenia', 'Nicosia'];
  const sortedZones = Object.keys(groupedByZone).sort((a, b) => {
    const aIndex = zoneOrder.indexOf(a);
    const bIndex = zoneOrder.indexOf(b);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="space-y-10">
      {sortedZones.map(zone => (
        <div key={zone} className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-[hsl(199,63%,59%)] to-[hsl(199,63%,65%)] rounded-full"></div>
            <h3 className="text-xl font-bold text-slate-900">{zone}</h3>
            <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {groupedByZone[zone].length} développeur{groupedByZone[zone].length !== 1 ? 's' : ''}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {groupedByZone[zone].map(dev => (
              <Card key={dev.id} className="group hover:shadow-xl transition-all duration-300 border-2 border-slate-200 bg-white hover:border-slate-300 hover:-translate-y-1 flex flex-col h-full">
                <CardHeader className="pb-4 bg-gradient-to-br from-slate-50 to-blue-50/30">
                  <div className="flex items-start space-x-4 min-h-[80px]">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                      {getLogo(dev) ? (
                        <img
                          src={getLogo(dev)}
                          alt={`${dev.name} logo`}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-[hsl(199,63%,59%)] to-[hsl(199,63%,65%)] rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {dev.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg leading-tight line-clamp-2">{dev.name}</h4>
                        <p className="text-slate-500 font-medium mt-1">{dev.main_city}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant={dev.status === 'active' ? 'default' : 'secondary'}
                          className={dev.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                          }
                        >
                          {dev.status === 'active' ? 'Actif' : 'Inactif'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4 flex-1">
                  {dev.rating_score && (
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
                      <span className="text-sm font-medium text-amber-800">Note</span>
                      <div className="flex items-center gap-1">
                        <span className="text-lg">⭐</span>
                        <span className="font-bold text-amber-800">{dev.rating_score}/10</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-3 text-sm">
                    {dev.contact_info?.email && (
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                          <Mail className="h-4 w-4 text-slate-700" />
                        </div>
                        <span className="text-slate-700 font-medium truncate">{dev.contact_info.email}</span>
                      </div>
                    )}
                    {dev.contact_info?.phone && (
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                          <Phone className="h-4 w-4 text-slate-700" />
                        </div>
                        <span className="text-slate-700 font-medium">{dev.contact_info.phone}</span>
                      </div>
                    )}
                    {dev.website && (
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                          <Globe className="h-4 w-4 text-slate-700" />
                        </div>
                        <a 
                          href={dev.website.startsWith('http') ? dev.website : `https://${dev.website}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-slate-700 hover:text-slate-900 font-medium truncate transition-colors"
                        >
                          {dev.website}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="pt-4 border-t border-slate-100 mt-auto">
                  <div className="grid grid-cols-3 gap-2 w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                      onClick={() => onViewDetails(dev)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Voir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[hsl(199,63%,75%)] hover:bg-[hsl(199,63%,95%)] hover:border-[hsl(199,63%,65%)] text-[hsl(199,63%,40%)] hover:text-[hsl(199,63%,30%)] transition-all duration-200"
                      onClick={() => onEdit(dev)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
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
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};