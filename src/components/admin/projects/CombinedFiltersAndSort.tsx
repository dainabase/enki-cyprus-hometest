import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  
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

  const hasActiveFilters = Object.values(filters).some(value => 
    typeof value === 'boolean' ? value : (value !== '' && value !== 'all')
  );

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
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Filtres</h3>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters} className="gap-2">
              <X className="w-4 h-4" />
              Effacer les filtres
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Developer Filter */}
          <div className="space-y-2">
            <Label htmlFor="developer-filter">Développeur</Label>
            <Select
              value={filters.developerId}
              onValueChange={(value) => updateFilter('developerId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tous les développeurs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les développeurs</SelectItem>
                {developers.map((developer) => (
                  <SelectItem key={developer.id} value={developer.id}>
                    {developer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Zone Filter */}
          <div className="space-y-2">
            <Label htmlFor="zone-filter">Zone</Label>
            <Select
              value={filters.zone}
              onValueChange={(value) => updateFilter('zone', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Toutes les zones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les zones</SelectItem>
                <SelectItem value="limassol">Limassol</SelectItem>
                <SelectItem value="paphos">Paphos</SelectItem>
                <SelectItem value="larnaca">Larnaca</SelectItem>
                <SelectItem value="nicosia">Nicosia</SelectItem>
                <SelectItem value="famagusta">Famagusta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label htmlFor="status-filter">Statut</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => updateFilter('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="planning">En planification</SelectItem>
                <SelectItem value="under_construction">En construction</SelectItem>
                <SelectItem value="delivered">Livré</SelectItem>
                <SelectItem value="available">Disponible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Golden Visa Filter */}
          <div className="space-y-2">
            <Label htmlFor="golden-visa-filter">Golden Visa</Label>
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="golden-visa-filter"
                checked={filters.goldenVisaOnly}
                onCheckedChange={(checked) => updateFilter('goldenVisaOnly', checked)}
              />
              <Label htmlFor="golden-visa-filter" className="text-sm">
                Éligible Golden Visa uniquement
              </Label>
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            <span className="text-sm text-muted-foreground">Filtres actifs:</span>
            {filters.developerId && filters.developerId !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                Développeur: {developers.find(d => d.id === filters.developerId)?.name}
              </span>
            )}
            {filters.zone && filters.zone !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                Zone: {filters.zone}
              </span>
            )}
            {filters.status && filters.status !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                Statut: {filters.status}
              </span>
            )}
            {filters.goldenVisaOnly && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                ✨ Golden Visa
              </span>
            )}
          </div>
        )}
      </div>

      {/* Sort Section */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-medium">Tri</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
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
              title={`Tri ${sortDirection === 'asc' ? 'croissant' : 'décroissant'}`}
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
    </div>
  );
};

export default CombinedFiltersAndSort;