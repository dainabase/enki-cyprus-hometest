import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface FilterState {
  projectId: string;
  constructionStatus: string;
  minFloors: string;
  maxFloors: string;
}

interface BuildingFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  projects: any[];
}

const BuildingFilters: React.FC<BuildingFiltersProps> = ({ filters, onFiltersChange, projects }) => {
  const updateFilter = (key: keyof FilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      projectId: '',
      constructionStatus: '',
      minFloors: '',
      maxFloors: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

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
        {/* Project Filter */}
        <div className="space-y-2">
          <Label htmlFor="project-filter">Projet</Label>
          <Select
            value={filters.projectId}
            onValueChange={(value) => updateFilter('projectId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tous les projets" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les projets</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Construction Status Filter */}
        <div className="space-y-2">
          <Label htmlFor="status-filter">Statut construction</Label>
          <Select
            value={filters.constructionStatus}
            onValueChange={(value) => updateFilter('constructionStatus', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les statuts</SelectItem>
              <SelectItem value="planning">Planification</SelectItem>
              <SelectItem value="foundation">Fondations</SelectItem>
              <SelectItem value="structure">Structure</SelectItem>
              <SelectItem value="finishing">Finitions</SelectItem>
              <SelectItem value="completed">Terminé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Min Floors Filter */}
        <div className="space-y-2">
          <Label htmlFor="min-floors-filter">Étages minimum</Label>
          <Input
            id="min-floors-filter"
            type="number"
            placeholder="Min"
            value={filters.minFloors}
            onChange={(e) => updateFilter('minFloors', e.target.value)}
            min="1"
          />
        </div>

        {/* Max Floors Filter */}
        <div className="space-y-2">
          <Label htmlFor="max-floors-filter">Étages maximum</Label>
          <Input
            id="max-floors-filter"
            type="number"
            placeholder="Max"
            value={filters.maxFloors}
            onChange={(e) => updateFilter('maxFloors', e.target.value)}
            min="1"
          />
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <span className="text-sm text-muted-foreground">Filtres actifs:</span>
          {filters.projectId && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
              Projet: {projects.find(p => p.id === filters.projectId)?.title}
            </span>
          )}
          {filters.constructionStatus && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
              Statut: {filters.constructionStatus}
            </span>
          )}
          {filters.minFloors && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
              Min étages: {filters.minFloors}
            </span>
          )}
          {filters.maxFloors && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
              Max étages: {filters.maxFloors}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default BuildingFilters;