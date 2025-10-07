'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Euro, Bed, Chrome as Home, MapPin, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { ProjectFilters } from '@/types/project.types';

interface AdvancedFiltersProps {
  filters: ProjectFilters;
  onFiltersChange: (filters: ProjectFilters) => void;
  onClose?: () => void;
}

export function AdvancedFilters({ filters, onFiltersChange, onClose }: AdvancedFiltersProps) {
  const [localFilters, setLocalFilters] = useState<ProjectFilters>(filters);
  const [isOpen, setIsOpen] = useState(false);

  const propertyTypes = [
    { value: 'apartment', label: 'Appartement' },
    { value: 'penthouse', label: 'Penthouse' },
    { value: 'villa', label: 'Villa' },
    { value: 'townhouse', label: 'Maison de ville' },
    { value: 'land', label: 'Terrain' },
  ];

  const amenities = [
    { value: 'swimming_pool', label: 'Piscine' },
    { value: 'gym', label: 'Salle de sport' },
    { value: 'parking', label: 'Parking' },
    { value: 'garden', label: 'Jardin' },
    { value: 'sea_view', label: 'Vue mer' },
  ];

  const bedroomOptions = [1, 2, 3, 4, 5];

  const handlePriceChange = (values: number[]) => {
    setLocalFilters({
      ...localFilters,
      priceMin: values[0] * 1000,
      priceMax: values[1] * 1000,
    });
  };

  const handleDistanceChange = (values: number[]) => {
    setLocalFilters({
      ...localFilters,
      distanceToBeach: values[0],
    });
  };

  const handlePropertyTypeToggle = (type: string) => {
    const current = localFilters.propertyTypes || [];
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    setLocalFilters({ ...localFilters, propertyTypes: updated });
  };

  const handleAmenityToggle = (amenity: string) => {
    const current = localFilters.amenities || [];
    const updated = current.includes(amenity)
      ? current.filter(a => a !== amenity)
      : [...current, amenity];
    setLocalFilters({ ...localFilters, amenities: updated });
  };

  const handleBedroomToggle = (bedroom: number) => {
    const current = localFilters.bedrooms || [];
    const updated = current.includes(bedroom)
      ? current.filter(b => b !== bedroom)
      : [...current, bedroom];
    setLocalFilters({ ...localFilters, bedrooms: updated });
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    setIsOpen(false);
    onClose?.();
  };

  const handleReset = () => {
    const resetFilters: ProjectFilters = {};
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const activeFiltersCount = Object.keys(localFilters).filter(key => {
    const value = localFilters[key as keyof ProjectFilters];
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null;
  }).length;

  return (
    <div className="relative">
      {/* Toggle Button */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Filter className="w-4 h-4 mr-2" />
        Filtres Avancés
        {activeFiltersCount > 0 && (
          <Badge className="ml-2 bg-black text-white" variant="secondary">
            {activeFiltersCount}
          </Badge>
        )}
      </Button>

      {/* Filters Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-4 right-0 w-[600px] max-w-[90vw] bg-white shadow-2xl border border-black/10 z-50"
          >
            <div className="p-8 space-y-8 max-h-[80vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-black/10">
                <div>
                  <h3 className="text-2xl font-light text-black">Filtres Avancés</h3>
                  <p className="text-sm text-black/60 mt-1">Affinez votre recherche</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-black/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Price Range */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Euro className="w-5 h-5 text-black/40" />
                  <Label className="text-base font-light">Fourchette de Prix</Label>
                </div>
                <div className="space-y-3">
                  <Slider
                    min={0}
                    max={5000}
                    step={50}
                    value={[
                      (localFilters.priceMin || 0) / 1000,
                      (localFilters.priceMax || 5000000) / 1000
                    ]}
                    onValueChange={handlePriceChange}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-black/60">
                    <span>€{((localFilters.priceMin || 0) / 1000).toFixed(0)}K</span>
                    <span>€{((localFilters.priceMax || 5000000) / 1000).toFixed(0)}K</span>
                  </div>
                </div>
              </div>

              {/* Bedrooms */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5 text-black/40" />
                  <Label className="text-base font-light">Nombre de Chambres</Label>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {bedroomOptions.map(num => (
                    <button
                      key={num}
                      onClick={() => handleBedroomToggle(num)}
                      className={`px-4 py-2 border transition-colors ${
                        localFilters.bedrooms?.includes(num)
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-black/20 hover:border-black/40'
                      }`}
                    >
                      {num} {num === 1 ? 'chambre' : 'chambres'}
                    </button>
                  ))}
                  <button
                    onClick={() => handleBedroomToggle(6)}
                    className={`px-4 py-2 border transition-colors ${
                      localFilters.bedrooms?.includes(6)
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-black/20 hover:border-black/40'
                    }`}
                  >
                    5+
                  </button>
                </div>
              </div>

              {/* Property Types */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-black/40" />
                  <Label className="text-base font-light">Type de Bien</Label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {propertyTypes.map(type => (
                    <div key={type.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type.value}`}
                        checked={localFilters.propertyTypes?.includes(type.value)}
                        onCheckedChange={() => handlePropertyTypeToggle(type.value)}
                      />
                      <label
                        htmlFor={`type-${type.value}`}
                        className="text-sm font-light text-black cursor-pointer"
                      >
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-black/40" />
                  <Label className="text-base font-light">Équipements</Label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {amenities.map(amenity => (
                    <div key={amenity.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`amenity-${amenity.value}`}
                        checked={localFilters.amenities?.includes(amenity.value)}
                        onCheckedChange={() => handleAmenityToggle(amenity.value)}
                      />
                      <label
                        htmlFor={`amenity-${amenity.value}`}
                        className="text-sm font-light text-black cursor-pointer"
                      >
                        {amenity.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Distance to Beach */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-black/40" />
                  <Label className="text-base font-light">Distance à la Plage</Label>
                </div>
                <div className="space-y-3">
                  <Slider
                    min={0}
                    max={10}
                    step={0.5}
                    value={[localFilters.distanceToBeach || 10]}
                    onValueChange={handleDistanceChange}
                    className="w-full"
                  />
                  <div className="text-sm text-black/60">
                    Maximum: {localFilters.distanceToBeach || 10}km
                  </div>
                </div>
              </div>

              {/* Golden Visa */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="golden-visa"
                    checked={localFilters.goldenVisaEligible || false}
                    onCheckedChange={(checked) =>
                      setLocalFilters({ ...localFilters, goldenVisaEligible: checked as boolean })
                    }
                  />
                  <label htmlFor="golden-visa" className="flex items-center gap-2 cursor-pointer">
                    <Award className="w-5 h-5 text-black/40" />
                    <span className="text-base font-light text-black">
                      Éligible Golden Visa (≥€300K)
                    </span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-black/10">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="flex-1"
                >
                  Réinitialiser
                </Button>
                <Button
                  onClick={handleApply}
                  className="flex-1 bg-black text-white hover:bg-black/90"
                >
                  Appliquer les Filtres
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
