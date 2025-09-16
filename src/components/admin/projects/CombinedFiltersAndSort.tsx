import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X, ArrowUp, ArrowDown } from 'lucide-react';

interface FilterState {
  developerId: string;
  zone: string;
  status: string;
  goldenVisaOnly: boolean;
}

export type ProjectSortField = 'title' | 'developer' | 'city' | 'neighborhood' | 'price' | 'status' | 'zone' | 'completion_date' | 'created_at';
export type SortDirection = 'asc' | 'desc';

interface CombinedFiltersAndSortProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  developers: any[];
  sortField: ProjectSortField;
  sortDirection: SortDirection;
  onSortChange: (field: ProjectSortField, direction: SortDirection) => void;
}

const CombinedFiltersAndSort: React.FC<CombinedFiltersAndSortProps> = ({ 
  filters, 
  onFiltersChange, 
  developers,
  sortField,
  sortDirection,
  onSortChange
}) => {
  
  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      developerId: 'all',
      zone: 'all',
      status: 'all',
      goldenVisaOnly: false
    });
  };

  const sortOptions = [
    { value: 'title', label: 'Titre' },
    { value: 'developer', label: 'Développeur' },
    { value: 'city', label: 'Ville' },
    { value: 'price', label: 'Prix' },
    { value: 'status', label: 'Statut' },
    { value: 'zone', label: 'Zone' }
  ];

  const toggleSortDirection = () => {
    onSortChange(sortField, sortDirection === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Filtres</h3>
          <Button variant="outline" size="sm" onClick={clearFilters} className="gap-2">
            <X className="w-4 h-4" />
            Effacer
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Developer Filter */}
          <div className="space-y-2">
            <Label>Développeur</Label>
            <Select
              value={filters.developerId || 'all'}
              onValueChange={(value) => updateFilter('developerId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tous" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les développeurs</SelectItem>
                {developers?.map((developer) => (
                  <SelectItem key={developer.id} value={developer.id}>
                    {developer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Zone Filter */}
          <div className="space-y-2">
            <Label>Zone</Label>
            <Select
              value={filters.zone || 'all'}
              onValueChange={(value) => updateFilter('zone', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Toutes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les zones</SelectItem>
                <SelectItem value="limassol">Limassol</SelectItem>
                <SelectItem value="paphos">Paphos</SelectItem>
                <SelectItem value="larnaca">Larnaca</SelectItem>
                <SelectItem value="nicosia">Nicosia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label>Statut</Label>
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) => updateFilter('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tous" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="planning">Planification</SelectItem>
                <SelectItem value="under_construction">Construction</SelectItem>
                <SelectItem value="delivered">Livré</SelectItem>
                <SelectItem value="available">Disponible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Golden Visa Filter */}
          <div className="space-y-2">
            <Label>Golden Visa</Label>
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                checked={filters.goldenVisaOnly}
                onCheckedChange={(checked) => updateFilter('goldenVisaOnly', checked)}
              />
              <Label className="text-sm">Éligible uniquement</Label>
            </div>
          </div>
        </div>
      </div>

      {/* Sort Section */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-medium">Tri</h3>
        <div className="flex items-center gap-4">
          <Label>Trier par:</Label>
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
            className="gap-2"
          >
            {sortDirection === 'asc' ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
            {sortDirection === 'asc' ? 'Croissant' : 'Décroissant'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CombinedFiltersAndSort;