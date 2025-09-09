import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
        <h3 className="text-lg font-medium">{t('admin.filters.title')}</h3>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters} className="gap-2">
            <X className="w-4 h-4" />
            {t('admin.filters.clearFilters')}
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Developer Filter */}
        <div className="space-y-2">
          <Label htmlFor="developer-filter">{t('admin.filters.developer')}</Label>
          <Select
            value={filters.developerId}
            onValueChange={(value) => updateFilter('developerId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('admin.filters.allDevelopers')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t('admin.filters.allDevelopers')}</SelectItem>
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
          <Label htmlFor="zone-filter">{t('admin.filters.zone')}</Label>
          <Select
            value={filters.zone}
            onValueChange={(value) => updateFilter('zone', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('admin.filters.allZones')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t('admin.filters.allZones')}</SelectItem>
              <SelectItem value="limassol">{t('zones.limassol')}</SelectItem>
              <SelectItem value="paphos">{t('zones.paphos')}</SelectItem>
              <SelectItem value="larnaca">{t('zones.larnaca')}</SelectItem>
              <SelectItem value="nicosia">{t('zones.nicosia')}</SelectItem>
              <SelectItem value="famagusta">{t('zones.famagusta')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <Label htmlFor="status-filter">{t('admin.filters.status')}</Label>
          <Select
            value={filters.status}
            onValueChange={(value) => updateFilter('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('admin.filters.allStatuses')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t('admin.filters.allStatuses')}</SelectItem>
              <SelectItem value="planning">{t('status.planning')}</SelectItem>
              <SelectItem value="under_construction">{t('status.under_construction')}</SelectItem>
              <SelectItem value="delivered">{t('status.delivered')}</SelectItem>
              <SelectItem value="available">{t('status.available')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Golden Visa Filter */}
        <div className="space-y-2">
          <Label htmlFor="golden-visa-filter">{t('admin.filters.goldenVisaOnly')}</Label>
          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="golden-visa-filter"
              checked={filters.goldenVisaOnly}
              onCheckedChange={(checked) => updateFilter('goldenVisaOnly', checked)}
            />
            <Label htmlFor="golden-visa-filter" className="text-sm">
              {t('admin.filters.goldenVisaEligible')}
            </Label>
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <span className="text-sm text-muted-foreground">{t('admin.filters.activeFilters')}:</span>
          {filters.developerId && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
              {t('admin.filters.developer')}: {developers.find(d => d.id === filters.developerId)?.name}
            </span>
          )}
          {filters.zone && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
              {t('admin.filters.zone')}: {t(`zones.${filters.zone}`)}
            </span>
          )}
          {filters.status && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
              {t('admin.filters.status')}: {t(`status.${filters.status}`)}
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