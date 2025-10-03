import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Home, Eye, Trash2 } from 'lucide-react';

interface PropertyCompactViewProps {
  properties: any[];
  onEdit: (property: any) => void;
  onDelete: (id: string) => void;
  selectedProperties: string[];
  onSelectionChange: (ids: string[]) => void;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export const PropertyCompactView = ({
  properties,
  onEdit,
  onDelete,
  selectedProperties,
  onSelectionChange,
  getStatusColor,
  getStatusLabel
}: PropertyCompactViewProps) => {
  const handlePropertySelect = (propertyId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedProperties, propertyId]);
    } else {
      onSelectionChange(selectedProperties.filter(id => id !== propertyId));
    }
  };

  return (
    <div className="space-y-2">
      {properties.map(property => (
        <div
          key={property.id}
          className="group bg-white border border-slate-200 rounded-xl hover:shadow-lg hover:border-slate-300 transition-all duration-300 hover:-translate-y-0.5 relative"
        >
          <div className="flex items-center gap-4 p-4">
            <div className="flex-shrink-0">
              <Checkbox
                checked={selectedProperties.includes(property.id)}
                onCheckedChange={(checked) =>
                  handlePropertySelect(property.id, checked as boolean)
                }
                className="bg-white border-2 border-slate-300"
              />
            </div>

            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center border border-white shadow-sm flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-[hsl(199,63%,59%)] to-[hsl(199,63%,65%)] rounded-lg flex items-center justify-center">
                <Home className="h-4 w-4 text-white" />
              </div>
            </div>

            <div className="flex-1 min-w-0 grid grid-cols-6 gap-4 items-center text-sm">
              <div className="truncate font-bold text-slate-900">
                {property.property_code || property.unit_number}
              </div>

              <div className="truncate font-semibold text-slate-700">
                {property.building?.building_name || 'N/A'}
              </div>

              <div className="truncate text-slate-600">
                {property.building?.project?.title || 'N/A'}
              </div>

              <div className="truncate text-slate-600">
                {property.bedrooms && `${property.bedrooms} ch`}
                {property.bedrooms && property.bathrooms && ' / '}
                {property.bathrooms && `${property.bathrooms} sdb`}
              </div>

              <div className="font-bold text-emerald-700">
                €{(property.price_including_vat || 0).toLocaleString('fr-FR', { notation: 'compact' })}
              </div>

              <div className="flex items-center gap-2">
                <Badge className={`${getStatusColor(property.sale_status)} text-xs border`}>
                  {getStatusLabel(property.sale_status)}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
              >
                <Eye className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(property)}
                className="h-8 w-8 p-0 border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-700 hover:text-blue-800 transition-all duration-200"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600 hover:text-red-700 transition-all duration-200"
                onClick={() => onDelete(property.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
