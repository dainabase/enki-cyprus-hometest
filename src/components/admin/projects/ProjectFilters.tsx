import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface FilterState {
  developerId: string;
  zone: string;
  status: string;
  goldenVisaOnly: boolean;
}

interface ProjectFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  developers: any[];
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({ filters, onFiltersChange, developers }) => {
  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      developerId: '',
      zone: '',
      status: '',
      goldenVisaOnly: false
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    typeof value === 'boolean' ? value : value !== ''
  );

  return (
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
              <SelectItem value="">Tous les développeurs</SelectItem>
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
              <SelectItem value="">Toutes les zones</SelectItem>
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
              <SelectItem value="">Tous les statuts</SelectItem>
              <SelectItem value="planning">Planification</SelectItem>
              <SelectItem value="under_construction">En construction</SelectItem>
              <SelectItem value="delivered">Livré</SelectItem>
              <SelectItem value="available">Disponible</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Golden Visa Filter */}
        <div className="space-y-2">
          <Label htmlFor="golden-visa-filter">Golden Visa uniquement</Label>
          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="golden-visa-filter"
              checked={filters.goldenVisaOnly}
              onCheckedChange={(checked) => updateFilter('goldenVisaOnly', checked)}
            />
            <Label htmlFor="golden-visa-filter" className="text-sm">
              Projets éligibles uniquement
            </Label>
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <span className="text-sm text-muted-foreground">Filtres actifs:</span>
          {filters.developerId && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
              Développeur: {developers.find(d => d.id === filters.developerId)?.name}
            </span>
          )}
          {filters.zone && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
              Zone: {filters.zone.charAt(0).toUpperCase() + filters.zone.slice(1)}
            </span>
          )}
          {filters.status && (
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
  );
};

export default ProjectFilters;