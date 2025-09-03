import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, List, MapPin, Search, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSearch } from '@/contexts/SearchContext';
import PropertyCard from '@/components/ui/PropertyCard';
import { cn } from '@/lib/utils';

interface PropertySearchResultsProps {
  className?: string;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  showViewToggle?: boolean;
}

const PropertySearchResults: React.FC<PropertySearchResultsProps> = ({
  className,
  viewMode = 'grid',
  onViewModeChange,
  showViewToggle = true
}) => {
  const { state, selectProperty, resetFilters } = useSearch();
  const { filteredProperties, isLoading, selectedProperty } = state;

  const staggerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1
    }
  };

  const handlePropertyClick = (property: any) => {
    console.log(`🏠 Property selected from results: ${property.title}`);
    selectProperty(property);
  };

  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-muted rounded-full">
          <Search className="w-8 h-8 text-muted-foreground" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-foreground mb-2">
        Aucun bien trouvé
      </h3>
      
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Aucune propriété ne correspond à vos critères de recherche. 
        Essayez de modifier vos filtres ou de contacter nos experts.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={resetFilters} variant="default">
          Réinitialiser les filtres
        </Button>
        <Button variant="outline">
          Contacter un expert
        </Button>
      </div>
    </motion.div>
  );

  const LoadingState = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-card rounded-lg overflow-hidden animate-pulse"
        >
          <div className="w-full h-48 bg-muted" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );

  if (isLoading) {
    return <LoadingState />;
  }

  if (filteredProperties.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Header with results count and view toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-foreground">
            {filteredProperties.length} bien{filteredProperties.length > 1 ? 's' : ''} trouvé{filteredProperties.length > 1 ? 's' : ''}
          </h2>
          
          {state.filters.location && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {state.filters.location}
            </Badge>
          )}
        </div>

        {showViewToggle && onViewModeChange && (
          <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className="h-8 w-8 p-0"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className="h-8 w-8 p-0"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Results Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filteredProperties.length}
          variants={staggerVariants}
          initial="hidden"
          animate="show"
          className={cn(
            "grid gap-6",
            viewMode === 'grid' 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-1"
          )}
        >
          {filteredProperties.map((property, index) => (
            <motion.div
              key={property.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <PropertyCard
                property={property}
                index={index}
                onClick={() => handlePropertyClick(property)}
                className={cn(
                  "transition-all duration-200",
                  selectedProperty?.id === property.id && "ring-2 ring-primary",
                  viewMode === 'list' && "grid grid-cols-1 md:grid-cols-3 gap-4"
                )}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Load More (for future pagination) */}
      {filteredProperties.length >= 12 && (
        <div className="text-center pt-6">
          <Button variant="outline" className="px-8">
            Voir plus de biens
          </Button>
        </div>
      )}
    </div>
  );
};

export default PropertySearchResults;