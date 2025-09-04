import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SearchIcon, MapPin, Euro, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useFilters } from '@/contexts/FilterContext';

// Villes chypriotes pour l'autocomplete
const cyprusCities = [
  'Nicosia', 'Limassol', 'Paphos', 'Larnaca', 
  'Ayia Napa', 'Protaras', 'Famagouste', 'Kyrenia',
  'Pissouri', 'Coral Bay', 'Strovolos', 'Agios Athanasios'
];

const AdvancedSearchForm: React.FC = () => {
  const { state, dispatch } = useFilters();
  const [locationInput, setLocationInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Gestion de l'autocomplete pour les villes
  useEffect(() => {
    if (locationInput.length > 0) {
      const filtered = cyprusCities.filter(city =>
        city.toLowerCase().includes(locationInput.toLowerCase())
      );
      setFilteredCities(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [locationInput]);

  const handlePropertyTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: 'SET_PROPERTY_TYPE', payload: e.target.value });
  };

  const handleBudgetChange = (min: number, max: number) => {
    dispatch({ type: 'SET_BUDGET_RANGE', payload: { min, max } });
  };

  const handleLocationSelect = (city: string) => {
    setLocationInput(city);
    dispatch({ type: 'SET_LOCATION', payload: city });
    setShowSuggestions(false);
  };

  const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocationInput(value);
    dispatch({ type: 'SET_LOCATION', payload: value });
  };

  const handleResetFilters = () => {
    setLocationInput('');
    dispatch({ type: 'RESET_FILTERS' });
  };

  const formatPrice = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M €`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k €`;
    }
    return `${value} €`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full mb-8"
    >
      <Card className="bg-card shadow-elegant border border-border">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Filter className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Recherche Avancée</h2>
          </div>

          {/* Formulaire responsive */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            
            {/* Type de bien */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Type de bien
              </label>
              <select
                value={state.filters.propertyType}
                onChange={handlePropertyTypeChange}
                className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground transition-colors"
              >
                <option value="Tous">Tous</option>
                <option value="Appartements">Appartements</option>
                <option value="Maisons">Maisons</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            {/* Budget Slider */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Budget
              </label>
              <div className="relative">
                <div className="flex items-center gap-3">
                  <Euro className="w-4 h-4 text-primary" />
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max="1000000"
                      step="50000"
                      value={state.filters.budgetMin}
                      onChange={(e) => handleBudgetChange(parseInt(e.target.value), state.filters.budgetMax)}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider-thumb"
                    />
                    <input
                      type="range"
                      min="0"
                      max="1000000"
                      step="50000"
                      value={state.filters.budgetMax}
                      onChange={(e) => handleBudgetChange(state.filters.budgetMin, parseInt(e.target.value))}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider-thumb mt-1"
                    />
                  </div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{formatPrice(state.filters.budgetMin)}</span>
                  <span>{formatPrice(state.filters.budgetMax)}</span>
                </div>
              </div>
            </div>

            {/* Localisation avec autocomplete */}
            <div className="space-y-2 relative">
              <label className="text-sm font-medium text-muted-foreground">
                Localisation
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Ville à Chypre..."
                  value={locationInput}
                  onChange={handleLocationInputChange}
                  onFocus={() => locationInput.length > 0 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="pl-10 border-input focus:ring-primary focus:border-primary"
                />
                
                {/* Suggestions dropdown */}
                {showSuggestions && filteredCities.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto"
                  >
                    {filteredCities.map((city, index) => (
                      <motion.div
                        key={city}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleLocationSelect(city)}
                        className="px-4 py-2 hover:bg-accent cursor-pointer text-foreground border-b border-border/50 last:border-b-0"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-primary" />
                          {city}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Bouton d'application */}
            <div className="flex flex-col justify-end gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Button 
                  className="w-full bg-primary hover:bg-primary-hover text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  disabled={state.isLoading}
                >
                  {state.isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <SearchIcon className="w-4 h-4" />
                  )}
                  Appliquer Filtres
                </Button>
              </motion.div>
              
              <Button 
                variant="outline"
                onClick={handleResetFilters}
                className="w-full text-muted-foreground hover:text-foreground border-input hover:border-border"
              >
                Réinitialiser
              </Button>
            </div>
          </div>

          {/* Résumé des filtres actifs */}
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="text-muted-foreground">Résultats:</span>
            <span className="font-medium text-primary">
              {state.filteredProperties.length} bien{state.filteredProperties.length > 1 ? 's' : ''} trouvé{state.filteredProperties.length > 1 ? 's' : ''}
            </span>
            {state.filters.propertyType !== 'Tous' && (
              <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                {state.filters.propertyType}
              </span>
            )}
            {state.filters.location && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                📍 {state.filters.location}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Styles personnalisés pour les sliders */}
      <style dangerouslySetInnerHTML={{__html: `
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: hsl(var(--primary));
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider-thumb::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: hsl(var(--primary));
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}} />
    </motion.div>
  );
};

export default AdvancedSearchForm;