import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CreditCard as Edit, MapPin, Building2, Euro, Chrome as Home, Bed, Bath, Maximize, Eye, Trash2 } from 'lucide-react';

interface PropertyDetailedViewProps {
  properties: Array<Record<string, unknown>>;
  onEdit: (property: Record<string, unknown>) => void;
  onDelete: (id: string) => void;
  selectedProperties: string[];
  onSelectionChange: (ids: string[]) => void;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export const PropertyDetailedView = ({
  properties,
  onEdit,
  onDelete,
  selectedProperties,
  onSelectionChange,
  getStatusColor,
  getStatusLabel
}: PropertyDetailedViewProps) => {
  const handlePropertySelect = (propertyId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedProperties, propertyId]);
    } else {
      onSelectionChange(selectedProperties.filter(id => id !== propertyId));
    }
  };

  return (
    <div className="space-y-6">
      {properties.map((property) => (
        <div key={property.id} className="relative">
          <div className="absolute top-4 right-4 z-10">
            <Checkbox
              checked={selectedProperties.includes(property.id)}
              onCheckedChange={(checked) =>
                handlePropertySelect(property.id, checked as boolean)
              }
              className="bg-white/95 border-2 border-slate-300 shadow-lg backdrop-blur-sm"
            />
          </div>

          <div className="group bg-white/90 backdrop-blur-sm border-2 border-slate-200 rounded-2xl p-8 hover:shadow-2xl hover:bg-white hover:border-slate-300 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start space-x-6 flex-1">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center border-2 border-white shadow-lg flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-[hsl(199,63%,59%)] to-[hsl(199,63%,65%)] rounded-xl flex items-center justify-center">
                    <Home className="h-8 w-8 text-white" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-2xl font-bold text-slate-900">{property.property_code || property.unit_number}</h3>
                    <Badge className={getStatusColor(property.sale_status)}>
                      {getStatusLabel(property.sale_status)}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-2 rounded-full border border-emerald-200 inline-flex mb-4">
                    <Euro className="h-5 w-5 text-emerald-600" />
                    <span className="font-bold text-emerald-800 text-lg">
                      €{(property.price_including_vat || 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-600">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-slate-700" />
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 block">Bâtiment</span>
                        <span className="font-semibold text-slate-700">{property.building?.building_name || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-slate-700" />
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 block">Projet</span>
                        <span className="font-semibold text-slate-700">
                          {property.building?.project?.title || 'N/A'}
                        </span>
                      </div>
                    </div>

                    {property.building?.project?.city && (
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-slate-700" />
                        </div>
                        <div>
                          <span className="text-xs text-slate-500 block">Ville</span>
                          <span className="font-semibold text-slate-700">{property.building.project.city}</span>
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
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-slate-50/50 rounded-xl border border-slate-100">
              {property.bedrooms && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <Bed className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Chambres</span>
                    <span className="font-semibold text-slate-900">{property.bedrooms}</span>
                  </div>
                </div>
              )}

              {property.bathrooms && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <Bath className="h-4 w-4 text-purple-500" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Salles de bain</span>
                    <span className="font-semibold text-slate-900">{property.bathrooms}</span>
                  </div>
                </div>
              )}

              {property.covered_area_m2 && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <Maximize className="h-4 w-4 text-orange-500" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Surface</span>
                    <span className="font-semibold text-slate-900">{property.covered_area_m2} m²</span>
                  </div>
                </div>
              )}

              {property.property_type && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <Home className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Type</span>
                    <span className="font-semibold text-slate-900 capitalize">{property.property_type}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
