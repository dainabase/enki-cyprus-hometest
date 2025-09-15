import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export type ProjectSortField = 'title' | 'developer' | 'city' | 'neighborhood' | 'price' | 'status' | 'zone' | 'completion_date' | 'created_at';
export type SortDirection = 'asc' | 'desc';

interface ProjectSorterProps {
  sortField: ProjectSortField;
  sortDirection: SortDirection;
  onSortChange: (field: ProjectSortField, direction: SortDirection) => void;
}

export const ProjectSorter = ({ sortField, sortDirection, onSortChange }: ProjectSorterProps) => {
  const { t } = useTranslation();
  
  const sortOptions = [
    { value: 'title', label: 'Titre' },
    { value: 'developer', label: 'Développeur' },
    { value: 'city', label: 'Ville' },
    { value: 'neighborhood', label: 'Quartier' },
    { value: 'price', label: 'Prix' },
    { value: 'status', label: 'Statut' },
    { value: 'zone', label: 'Zone' },
    { value: 'completion_date', label: 'Date de livraison' },
    { value: 'created_at', label: 'Date de création' }
  ];

  const toggleSortDirection = () => {
    onSortChange(sortField, sortDirection === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl shadow-sm px-3 py-2">
      <span className="text-sm text-slate-600 font-medium">Trier par:</span>
      <Select
        value={sortField}
        onValueChange={(value) => onSortChange(value as ProjectSortField, sortDirection)}
      >
        <SelectTrigger className="w-40 h-8 border-slate-200">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="sm"
        onClick={toggleSortDirection}
        className="h-8 w-8 p-0 border-slate-200 hover:bg-slate-50"
        title={`Tri ${sortDirection === 'asc' ? 'croissant' : 'décroissant'}`}
      >
        {sortDirection === 'asc' ? (
          <ArrowUp className="h-4 w-4" />
        ) : (
          <ArrowDown className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};