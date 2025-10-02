import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Property } from '@/data/mockData';

interface PropertySearchProps {
  properties: Property[];
  onFilteredProperties: (properties: Property[]) => void;
  onPropertySelect?: (property: Property) => void;
}

const PropertySearch = ({ properties, onFilteredProperties, onPropertySelect }: PropertySearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterProperties(term, typeFilter, priceRange);
  };

  const handleTypeFilter = (type: string) => {
    setTypeFilter(type);
    filterProperties(searchTerm, type, priceRange);
  };

  const handlePriceFilter = (range: string) => {
    setPriceRange(range);
    filterProperties(searchTerm, typeFilter, range);
  };

  const filterProperties = (term: string, type: string, price: string) => {
    console.log(`Filtering properties - Term: "${term}", Type: "${type}", Price: "${price}"`);
    
    let filtered = properties;

    // Filter by search term (location, title, description)
    if (term) {
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(term.toLowerCase()) ||
        ((property as any).city || property.location || '').toLowerCase().includes(term.toLowerCase()) ||
        property.description.toLowerCase().includes(term.toLowerCase())
      );
    }

    // Filter by type
    if (type !== 'all') {
      filtered = filtered.filter(property => {
        const subTypes = (property as any).property_sub_type;
        return Array.isArray(subTypes) && subTypes.includes(type.toLowerCase());
      });
    }

    // Filter by price range
    if (price !== 'all') {
      filtered = filtered.filter(property => {
        const priceValue = property.priceValue;
        switch (price) {
          case 'under-500k':
            return priceValue < 500000;
          case '500k-1m':
            return priceValue >= 500000 && priceValue < 1000000;
          case '1m-2m':
            return priceValue >= 1000000 && priceValue < 2000000;
          case 'over-2m':
            return priceValue >= 2000000;
          default:
            return true;
        }
      });
    }

    console.log(`Filtered results: ${filtered.length} properties`);
    onFilteredProperties(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setPriceRange('all');
    onFilteredProperties(properties);
    console.log('Filters cleared, showing all properties');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/95 backdrop-blur-sm border rounded-lg p-6 shadow-lg"
    >
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Rechercher des propriétés</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher par ville ou nom..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={typeFilter} onValueChange={handleTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Type de bien" />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="villa">Villa</SelectItem>
            <SelectItem value="apartment">Appartement</SelectItem>
            <SelectItem value="penthouse">Penthouse</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priceRange} onValueChange={handlePriceFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Gamme de prix" />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            <SelectItem value="all">Tous les prix</SelectItem>
            <SelectItem value="under-500k">Moins de 500k €</SelectItem>
            <SelectItem value="500k-1m">500k - 1M €</SelectItem>
            <SelectItem value="1m-2m">1M - 2M €</SelectItem>
            <SelectItem value="over-2m">Plus de 2M €</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="outline" 
          onClick={clearFilters}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Effacer
        </Button>
      </div>

      {/* Quick location buttons for testing */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleSearch('Paphos')}
          className="text-xs"
        >
          Paphos
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleSearch('Limassol')}
          className="text-xs"
        >
          Limassol
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleSearch('Nicosie')}
          className="text-xs"
        >
          Nicosie
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleSearch('Mersini')}
          className="text-xs bg-primary/10 text-primary"
        >
          Mersini Beach (Test)
        </Button>
      </div>
    </motion.div>
  );
};

export default PropertySearch;