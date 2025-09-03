import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Filter, X, Bed, Euro } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useSearch } from '@/contexts/SearchContext';
import { useGoogleMapsContext } from '@/contexts/GoogleMapsContext';
import { cn } from '@/lib/utils';

interface AdvancedSearchFormProps {
  className?: string;
  showTitle?: boolean;
  variant?: 'sidebar' | 'accordion' | 'inline';
}

const AdvancedSearchForm: React.FC<AdvancedSearchFormProps> = ({
  className,
  showTitle = true,
  variant = 'sidebar'
}) => {
  const { state, setPropertyType, setBudgetRange, setLocation, setBedrooms, setSearchQuery, resetFilters } = useSearch();
  const { isLoaded } = useGoogleMapsContext();
  const [locationInput, setLocationInput] = useState(state.filters.location);

  const formatPrice = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M €`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k €`;
    }
    return `${value} €`;
  };

  const handleLocationChange = useCallback((value: string) => {
    setLocationInput(value);
    setLocation(value);
  }, [setLocation]);

  const handleBudgetChange = useCallback((values: number[]) => {
    setBudgetRange([values[0], values[1]]);
  }, [setBudgetRange]);

  const handleClearFilters = () => {
    setLocationInput('');
    resetFilters();
  };

  const hasActiveFilters = 
    state.filters.propertyType !== 'all' ||
    state.filters.budgetRange[0] > 0 ||
    state.filters.budgetRange[1] < 3000000 ||
    state.filters.location !== '' ||
    state.filters.bedrooms !== null ||
    state.filters.searchQuery !== '';

  const filterCount = [
    state.filters.propertyType !== 'all',
    state.filters.budgetRange[0] > 0 || state.filters.budgetRange[1] < 3000000,
    state.filters.location !== '',
    state.filters.bedrooms !== null,
    state.filters.searchQuery !== ''
  ].filter(Boolean).length;

  const SearchContent = () => (
    <div className="space-y-6">
      {/* Search Query */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Recherche générale</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher par titre, description..."
            value={state.filters.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Localisation</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Ville, quartier, région..."
            value={locationInput}
            onChange={(e) => handleLocationChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Property Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Type de bien</label>
        <Select value={state.filters.propertyType} onValueChange={setPropertyType}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un type" />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="appartement">Appartement</SelectItem>
            <SelectItem value="maison">Maison</SelectItem>
            <SelectItem value="villa">Villa</SelectItem>
            <SelectItem value="penthouse">Penthouse</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Budget Range */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Euro className="w-4 h-4 text-muted-foreground" />
          <label className="text-sm font-medium text-foreground">Budget</label>
        </div>
        <div className="px-3">
          <Slider
            value={state.filters.budgetRange}
            onValueChange={handleBudgetChange}
            max={3000000}
            min={0}
            step={50000}
            className="w-full"
          />
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{formatPrice(state.filters.budgetRange[0])}</span>
          <span>{formatPrice(state.filters.budgetRange[1])}</span>
        </div>
      </div>

      {/* Bedrooms */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Bed className="w-4 h-4 text-muted-foreground" />
          <label className="text-sm font-medium text-foreground">Chambres</label>
        </div>
        <Select 
          value={state.filters.bedrooms?.toString() || 'all'} 
          onValueChange={(value) => setBedrooms(value === 'all' ? null : parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Nombre de chambres" />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="1">1 chambre</SelectItem>
            <SelectItem value="2">2 chambres</SelectItem>
            <SelectItem value="3">3 chambres</SelectItem>
            <SelectItem value="4">4 chambres</SelectItem>
            <SelectItem value="5">5+ chambres</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button 
          variant="outline" 
          onClick={handleClearFilters}
          className="w-full flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Effacer les filtres
        </Button>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Filtres actifs:</p>
          <div className="flex flex-wrap gap-2">
            {state.filters.propertyType !== 'all' && (
              <Badge variant="secondary" className="text-xs">
                {state.filters.propertyType}
              </Badge>
            )}
            {state.filters.bedrooms && (
              <Badge variant="secondary" className="text-xs">
                {state.filters.bedrooms} ch.
              </Badge>
            )}
            {(state.filters.budgetRange[0] > 0 || state.filters.budgetRange[1] < 3000000) && (
              <Badge variant="secondary" className="text-xs">
                {formatPrice(state.filters.budgetRange[0])} - {formatPrice(state.filters.budgetRange[1])}
              </Badge>
            )}
            {state.filters.location && (
              <Badge variant="secondary" className="text-xs">
                📍 {state.filters.location}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {state.isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Recherche en cours...
          </div>
        ) : (
          `${state.filteredProperties.length} bien${state.filteredProperties.length > 1 ? 's' : ''} trouvé${state.filteredProperties.length > 1 ? 's' : ''}`
        )}
      </div>
    </div>
  );

  if (variant === 'accordion') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("w-full", className)}
      >
        <Accordion type="single" collapsible defaultValue="search">
          <AccordionItem value="search">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-primary" />
                <span className="font-semibold">Filtres de recherche</span>
                {filterCount > 0 && (
                  <Badge variant="default" className="ml-2">
                    {filterCount}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <SearchContent />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </motion.div>
    );
  }

  if (variant === 'inline') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("w-full", className)}
      >
        <SearchContent />
      </motion.div>
    );
  }

  // Default sidebar variant
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn("w-full", className)}
    >
      <Card className="w-full">
        {showTitle && (
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-primary" />
              Recherche avancée
              {filterCount > 0 && (
                <Badge variant="default" className="ml-2">
                  {filterCount}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
        )}
        <CardContent className={showTitle ? "pt-0" : ""}>
          <SearchContent />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdvancedSearchForm;