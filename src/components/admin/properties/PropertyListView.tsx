import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, MapPin, Building2, Euro, Home, Bed, Bath, Maximize, Eye, Trash2 } from 'lucide-react';

interface PropertyListViewProps {
  properties: any[];
  onEdit: (property: any) => void;
  onDelete: (id: string) => void;
  selectedProperties: string[];
  onSelectionChange: (ids: string[]) => void;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export const PropertyListView = ({
  properties,
  onEdit,
  onDelete,
  selectedProperties,
  onSelectionChange,
  getStatusColor,
  getStatusLabel
}: PropertyListViewProps) => {
  const handlePropertySelect = (propertyId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedProperties, propertyId]);
    } else {
      onSelectionChange(selectedProperties.filter(id => id !== propertyId));
    }
  };

  return (
    <div className="space-y-3">
      {properties.map(property => (
        <div key={property.id} className="group bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl hover:shadow-xl hover:bg-white transition-all duration-300 hover:-translate-y-0.5 relative">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-6 flex-1">
              <div className="flex-shrink-0">
                <Checkbox
                  checked={selectedProperties.includes(property.id)}
                  onCheckedChange={(checked) =>
                    handlePropertySelect(property.id, checked as boolean)
                  }
                  className="bg-white border-2 border-slate-300"
                />
              </div>

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center border-2 border-white shadow-sm flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-[hsl(199,63%,59%)] to-[hsl(199,63%,65%)] rounded-xl flex items-center justify-center">
                  <Home className="h-6 w-6 text-white" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-4 mb-2">
                  <h4 className="text-xl font-bold text-slate-900">{property.property_code || property.unit_number}</h4>
                  <Badge className={getStatusColor(property.sale_status)}>
                    {getStatusLabel(property.sale_status)}
                  </Badge>
                  <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-green-50 px-3 py-1 rounded-full border border-emerald-200">
                    <Euro className="h-4 w-4 text-emerald-600" />
                    <span className="font-bold text-emerald-800">
                      €{(property.price_including_vat || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-slate-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-3 w-3 text-slate-700" />
                    </div>
                    <span className="font-medium text-slate-700">{property.building?.building_name || 'N/A'}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center">
                      <MapPin className="h-3 w-3 text-blue-500" />
                    </div>
                    <span className="font-medium text-slate-700">{property.building?.project?.title || 'N/A'}</span>
                  </div>

                  {property.bedrooms && (
                    <div className="flex items-center space-x-2">
                      <Bed className="h-4 w-4 text-blue-500" />
                      <span className="font-medium text-slate-700">{property.bedrooms} ch</span>
                    </div>
                  )}

                  {property.bathrooms && (
                    <div className="flex items-center space-x-2">
                      <Bath className="h-4 w-4 text-purple-500" />
                      <span className="font-medium text-slate-700">{property.bathrooms} sdb</span>
                    </div>
                  )}

                  {property.covered_area_m2 && (
                    <div className="flex items-center space-x-2">
                      <Maximize className="h-4 w-4 text-orange-500" />
                      <span className="font-medium text-slate-700">{property.covered_area_m2} m²</span>
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
        </div>
      ))}
    </div>
  );
};
