import { Eye, Edit, Trash2 } from 'lucide-react';
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
    <div className="space-y-8">
      {sortedZones.map(zone => (
        <div key={zone} className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">{zone}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {groupedByZone[zone].map(dev => (
              <Card key={dev.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
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
                      <h4 className="font-medium text-sm truncate">{dev.name}</h4>
                      <p className="text-xs text-muted-foreground truncate">{dev.main_city}</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-2 pt-0">
                  <div className="flex items-center justify-between">
                    <Badge variant={dev.status === 'active' ? 'default' : 'secondary'}>
                      {dev.status === 'active' ? 'Actif' : 'Inactif'}
                    </Badge>
                    {dev.rating_score && (
                      <span className="text-xs text-muted-foreground">
                        ⭐ {dev.rating_score}/10
                      </span>
                    )}
                  </div>
                  
                  <div className="text-xs text-muted-foreground space-y-1">
                    {dev.contact_info?.email && (
                      <div className="truncate flex items-center">
                        <span className="mr-1">📧</span>
                        {dev.contact_info.email}
                      </div>
                    )}
                    {dev.contact_info?.phone && (
                      <div className="truncate flex items-center">
                        <span className="mr-1">📞</span>
                        {dev.contact_info.phone}
                      </div>
                    )}
                    {dev.website && (
                      <div className="truncate flex items-center">
                        <span className="mr-1">🌐</span>
                        <a 
                          href={dev.website.startsWith('http') ? dev.website : `https://${dev.website}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline truncate"
                        >
                          {dev.website}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="pt-3 border-t">
                  <div className="flex space-x-1 w-full">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => onViewDetails(dev)}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => onEdit(dev)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-destructive hover:text-destructive"
                      onClick={() => onDelete(dev)}
                    >
                      <Trash2 className="h-3 w-3" />
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