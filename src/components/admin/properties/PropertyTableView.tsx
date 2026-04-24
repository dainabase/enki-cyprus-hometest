import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreditCard as Edit, MapPin, Building2, Eye, Trash2 } from 'lucide-react';

interface PropertyTableViewProps {
  properties: Array<Record<string, unknown>>;
  onEdit: (property: Record<string, unknown>) => void;
  onDelete: (id: string) => void;
  selectedProperties: string[];
  onSelectionChange: (ids: string[]) => void;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export const PropertyTableView = ({
  properties,
  onEdit,
  onDelete,
  selectedProperties,
  onSelectionChange,
  getStatusColor,
  getStatusLabel
}: PropertyTableViewProps) => {
  const handlePropertySelect = (propertyId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedProperties, propertyId]);
    } else {
      onSelectionChange(selectedProperties.filter(id => id !== propertyId));
    }
  };

  return (
    <div className="rounded-xl border-2 border-slate-200 overflow-hidden bg-white shadow-lg">
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-[hsl(199,63%,59%)] to-[hsl(199,63%,65%)] hover:from-[hsl(199,63%,55%)] hover:to-[hsl(199,63%,60%)]">
              <TableHead className="text-white font-bold w-12">
                <Checkbox
                  checked={selectedProperties.length === properties.length && properties.length > 0}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onSelectionChange(properties.map(p => p.id));
                    } else {
                      onSelectionChange([]);
                    }
                  }}
                  className="bg-white/20 border-white"
                />
              </TableHead>
              <TableHead className="text-white font-bold">Code</TableHead>
              <TableHead className="text-white font-bold">Unité</TableHead>
              <TableHead className="text-white font-bold">Bâtiment</TableHead>
              <TableHead className="text-white font-bold">Projet</TableHead>
              <TableHead className="text-white font-bold">Type</TableHead>
              <TableHead className="text-white font-bold">Surface</TableHead>
              <TableHead className="text-white font-bold">Prix TTC</TableHead>
              <TableHead className="text-white font-bold">Statut</TableHead>
              <TableHead className="text-right text-white font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property, index) => (
              <TableRow
                key={property.id}
                className={`hover:bg-blue-50/50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                }`}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedProperties.includes(property.id)}
                    onCheckedChange={(checked) =>
                      handlePropertySelect(property.id, checked as boolean)
                    }
                    className="border-2 border-slate-300"
                  />
                </TableCell>
                <TableCell className="font-bold text-slate-900">{property.property_code}</TableCell>
                <TableCell className="font-medium text-slate-700">{property.unit_number}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-slate-500" />
                    <span className="font-medium text-slate-700">{property.building?.building_name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <div>
                      <div className="font-medium text-slate-900">{property.building?.project?.title}</div>
                      <div className="text-sm text-slate-500">{property.building?.project?.city}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{property.property_type}</Badge>
                </TableCell>
                <TableCell className="font-medium text-slate-700">{property.covered_area_m2 || property.internal_area}m²</TableCell>
                <TableCell>
                  <div className="font-bold text-slate-900">€{property.price_including_vat?.toLocaleString()}</div>
                  {property.golden_visa_eligible && (
                    <div className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                      Golden Visa
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(property.sale_status)}>
                    {getStatusLabel(property.sale_status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 border-slate-200 hover:bg-slate-50"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Voir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(property)}
                      className="h-8 border-blue-200 hover:bg-blue-50 text-blue-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(property.id)}
                      className="h-8 border-red-200 hover:bg-red-50 text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {properties.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                  Aucune propriété trouvée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
