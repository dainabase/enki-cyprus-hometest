import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, MapPin, Building2, Euro, Home, Bed, Bath, Maximize, Eye, Trash2 } from 'lucide-react';

interface PropertyCardViewProps {
  properties: any[];
  onEdit: (property: any) => void;
  onDelete: (id: string) => void;
  selectedProperties: string[];
  onSelectionChange: (ids: string[]) => void;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export const PropertyCardView = ({
  properties,
  onEdit,
  onDelete,
  selectedProperties,
  onSelectionChange,
  getStatusColor,
  getStatusLabel
}: PropertyCardViewProps) => {
  const handlePropertySelect = (propertyId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedProperties, propertyId]);
    } else {
      onSelectionChange(selectedProperties.filter(id => id !== propertyId));
    }
  };

  const groupedByBuilding = properties.reduce((acc, property) => {
    const buildingName = property.building?.building_name || 'Sans bâtiment';
    if (!acc[buildingName]) acc[buildingName] = [];
    acc[buildingName].push(property);
    return acc;
  }, {} as Record<string, any[]>);

  const sortedBuildings = Object.keys(groupedByBuilding).sort();

  return (
    <div className="space-y-10">
      {sortedBuildings.map(buildingName => (
        <div key={buildingName} className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-[hsl(199,63%,59%)] to-[hsl(199,63%,65%)] rounded-full"></div>
            <h3 className="text-xl font-bold text-slate-900">{buildingName}</h3>
            <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {groupedByBuilding[buildingName].length} propriété{groupedByBuilding[buildingName].length !== 1 ? 's' : ''}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {groupedByBuilding[buildingName].map(property => (
              <div key={property.id} className="relative">
                <div className="absolute top-3 right-3 z-10">
                  <Checkbox
                    checked={selectedProperties.includes(property.id)}
                    onCheckedChange={(checked) =>
                      handlePropertySelect(property.id, checked as boolean)
                    }
                    className="bg-white/95 border-2 border-slate-300 shadow-lg backdrop-blur-sm"
                  />
                </div>

                <Card className="group hover:shadow-xl transition-all duration-300 border-2 border-slate-200 bg-white hover:border-slate-300 hover:-translate-y-1 flex flex-col h-full">
                  <CardHeader className="bg-gradient-to-br from-slate-50 to-blue-50/30 pb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center border-2 border-white shadow-sm flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-[hsl(199,63%,59%)] to-[hsl(199,63%,65%)] rounded-xl flex items-center justify-center">
                          <Home className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-bold text-slate-900 line-clamp-1">
                          {property.property_code || property.unit_number}
                        </CardTitle>
                        <p className="text-sm text-slate-600 font-medium mt-1 line-clamp-1">
                          Unité: {property.unit_number}
                        </p>
                        <Badge className={`${getStatusColor(property.sale_status)} mt-2`}>
                          {getStatusLabel(property.sale_status)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 flex-1 pt-6">
                    <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                      <Euro className="h-5 w-5 text-emerald-600" />
                      <span className="font-bold text-emerald-800 text-lg">
                        €{(property.price_including_vat || 0).toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {property.bedrooms && (
                        <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Bed className="h-4 w-4 text-blue-500" />
                          </div>
                          <div>
                            <span className="text-xs text-slate-500 block">Chambres</span>
                            <span className="font-bold text-slate-900">{property.bedrooms}</span>
                          </div>
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                          <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                            <Bath className="h-4 w-4 text-purple-500" />
                          </div>
                          <div>
                            <span className="text-xs text-slate-500 block">Salles de bain</span>
                            <span className="font-bold text-slate-900">{property.bathrooms}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 text-sm">
                      {property.covered_area_m2 && (
                        <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                          <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                            <Maximize className="h-4 w-4 text-orange-500" />
                          </div>
                          <span className="text-slate-700 font-medium">{property.covered_area_m2} m²</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-slate-500" />
                        </div>
                        <span className="text-slate-700 font-medium truncate">
                          {property.building?.project?.title || 'N/A'}
                        </span>
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
                        onClick={() => onEdit(property)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600 hover:text-red-700 transition-all duration-200"
                        onClick={() => onDelete(property.id)}
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
