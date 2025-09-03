import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import GoogleMapComponent from '@/components/GoogleMap';
import PropertyModal from '@/components/PropertyModal';
import { mockProperties, Property } from '@/data/mockData';
import { Search as SearchIcon, MapPin, Filter, SlidersHorizontal } from 'lucide-react';

const Search = () => {
  const [priceRange, setPriceRange] = useState([100000, 2000000]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedBedrooms, setSelectedBedrooms] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const locations = [
    'Limassol',
    'Nicosie',
    'Paphos',
    'Larnaca',
    'Ayia Napa',
    'Protaras',
    'Famagouste'
  ];

  const propertyTypes = [
    'Villa',
    'Appartement',
    'Penthouse',
    'Commercial',
    'Terrain'
  ];

  const features = [
    'Piscine',
    'Vue mer',
    'Jardin',
    'Garage',
    'Climatisation',
    'Meublé',
    'Sécurité 24h',
    'Accès plage'
  ];

  // Filter properties based on search criteria
  const filteredProperties = useMemo(() => {
    return mockProperties.filter(property => {
      const matchesLocation = selectedLocation === 'all' || 
        property.location.toLowerCase().includes(selectedLocation.toLowerCase());
      
      const matchesType = selectedType === 'all' || 
        property.type === selectedType.toLowerCase();
      
      const matchesBedrooms = selectedBedrooms === 'all' || 
        (property.bedrooms && property.bedrooms.toString() === selectedBedrooms) ||
        (selectedBedrooms === '5+' && property.bedrooms && property.bedrooms >= 5);
      
      const matchesPrice = property.priceValue >= priceRange[0] && 
        property.priceValue <= priceRange[1];
      
      const matchesFeatures = selectedFilters.length === 0 || 
        selectedFilters.some(filter => 
          property.features.some(feature => 
            feature.toLowerCase().includes(filter.toLowerCase())
          )
        );
      
      const matchesQuery = !searchQuery || 
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesLocation && matchesType && matchesBedrooms && 
             matchesPrice && matchesFeatures && matchesQuery;
    });
  }, [selectedLocation, selectedType, selectedBedrooms, priceRange, selectedFilters, searchQuery]);

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <section className="bg-gradient-hero py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Recherche avancée
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Trouvez la propriété de vos rêves à Chypre avec nos filtres intelligents
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search Interface */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Filters Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1 space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Filter className="w-5 h-5 mr-2 text-primary" />
                    Filtres de recherche
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location">Localisation</Label>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une ville" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        <SelectItem value="all">Toutes les villes</SelectItem>
                        {locations.map(location => (
                          <SelectItem key={location} value={location.toLowerCase()}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Property Type */}
                  <div className="space-y-2">
                    <Label htmlFor="type">Type de bien</Label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Type de propriété" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        <SelectItem value="all">Tous les types</SelectItem>
                        {propertyTypes.map(type => (
                          <SelectItem key={type} value={type.toLowerCase()}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Bedrooms */}
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Chambres</Label>
                    <Select value={selectedBedrooms} onValueChange={setSelectedBedrooms}>
                      <SelectTrigger>
                        <SelectValue placeholder="Nombre de chambres" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        <SelectItem value="all">Toutes</SelectItem>
                        <SelectItem value="1">1 chambre</SelectItem>
                        <SelectItem value="2">2 chambres</SelectItem>
                        <SelectItem value="3">3 chambres</SelectItem>
                        <SelectItem value="4">4 chambres</SelectItem>
                        <SelectItem value="5+">5+ chambres</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-4">
                    <Label>Budget (€)</Label>
                    <div className="px-2">
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={3000000}
                        min={50000}
                        step={50000}
                        className="w-full"
                      />
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>€{priceRange[0].toLocaleString()}</span>
                      <span>€{priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    <Label>Équipements</Label>
                    <div className="flex flex-wrap gap-2">
                      {features.map(feature => (
                        <Badge
                          key={feature}
                          variant={selectedFilters.includes(feature) ? "default" : "outline"}
                          className="cursor-pointer transition-all hover:scale-105"
                          onClick={() => toggleFilter(feature)}
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full btn-premium">
                    <SearchIcon className="w-4 h-4 mr-2" />
                    Rechercher
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Results Area */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-3 space-y-6"
            >
              
              {/* Quick Search Bar */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <Input 
                        placeholder="Rechercher par ville, quartier ou nom de projet..."
                        className="h-12 text-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button size="lg" className="btn-premium md:w-auto">
                      <SearchIcon className="w-5 h-5 mr-2" />
                      Rechercher
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Active Filters */}
              {selectedFilters.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-muted-foreground">Filtres actifs:</span>
                  {selectedFilters.map(filter => (
                    <Badge 
                      key={filter} 
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => toggleFilter(filter)}
                    >
                      {filter} ×
                    </Badge>
                  ))}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedFilters([])}
                  >
                    Effacer tout
                  </Button>
                </div>
              )}

              {/* Interactive Map with Filtered Results */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Carte interactive</span>
                    <Badge variant="outline" className="text-sm">
                      {filteredProperties.length} propriété{filteredProperties.length > 1 ? 's' : ''} trouvée{filteredProperties.length > 1 ? 's' : ''}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <GoogleMapComponent 
                    properties={filteredProperties}
                    onPropertySelect={handlePropertySelect}
                    height="500px"
                  />
                </CardContent>
              </Card>

              {/* Search Results Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Résultats de recherche ({filteredProperties.length})</span>
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Trier par</span>
                      <Select defaultValue="prix-asc">
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="prix-asc">Prix croissant</SelectItem>
                          <SelectItem value="prix-desc">Prix décroissant</SelectItem>
                          <SelectItem value="date">Plus récent</SelectItem>
                          <SelectItem value="superficie">Superficie</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredProperties.length > 0 ? (
                    <div className="space-y-4">
                      {filteredProperties.map((property) => (
                        <motion.div
                          key={property.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => handlePropertySelect(property)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground mb-1">
                                {property.title}
                              </h3>
                              <div className="flex items-center text-sm text-muted-foreground mb-2">
                                <MapPin className="w-3 h-3 mr-1" />
                                {property.location}
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {property.description}
                              </p>
                            </div>
                            <div className="text-right ml-4">
                              <div className="text-xl font-bold text-primary mb-2">
                                {property.price}
                              </div>
                              <Badge variant="outline" className="capitalize">
                                {property.type}
                              </Badge>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Aucune propriété trouvée
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Aucune propriété ne correspond à vos critères. 
                        Essayez d'ajuster vos filtres ou contactez nos experts.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button 
                          className="btn-premium"
                          onClick={() => {
                            setSelectedLocation('all');
                            setSelectedType('all');
                            setSelectedBedrooms('all');
                            setSelectedFilters([]);
                            setPriceRange([100000, 2000000]);
                            setSearchQuery('');
                          }}
                        >
                          Réinitialiser les filtres
                        </Button>
                        <Button variant="outline">
                          Contactez un expert
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Property Modal */}
      <PropertyModal 
        property={selectedProperty}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Search;