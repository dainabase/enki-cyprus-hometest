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
    { value: 'title', label: t('admin.sorting.title') },
    { value: 'developer', label: t('admin.sorting.developer') },
    { value: 'city', label: t('admin.sorting.city') },
    { value: 'neighborhood', label: t('admin.sorting.neighborhood') },
    { value: 'price', label: t('admin.sorting.price') },
    { value: 'status', label: t('admin.sorting.status') },
    { value: 'zone', label: t('admin.sorting.zone') },
    { value: 'completion_date', label: t('admin.sorting.completionDate') },
    { value: 'created_at', label: t('admin.sorting.createdDate') }
  ];

  const toggleSortDirection = () => {
    onSortChange(sortField, sortDirection === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">{t('admin.buttons.sortBy')}:</span>
      <Select
        value={sortField}
        onValueChange={(value) => onSortChange(value as ProjectSortField, sortDirection)}
      >
        <SelectTrigger className="w-48">
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
        className="h-8 w-8 p-0"
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