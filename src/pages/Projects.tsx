import { motion } from 'framer-motion';
import PropertyCard from '@/components/ui/PropertyCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useFilters } from '@/contexts/FilterContext';
import { Building2, MapPin, Filter } from 'lucide-react';

const Projects = () => {
  const { state } = useFilters();
  const { filteredProperties: properties } = state;
  
  const categories = [
    { name: 'Tous', count: properties.length, active: true },
    { name: 'Villas', count: properties.filter(p => p.type === 'villa').length, active: false },
    { name: 'Appartements', count: properties.filter(p => p.type === 'apartment').length, active: false },
    { name: 'Penthouses', count: properties.filter(p => p.type === 'penthouse').length, active: false },
    { name: 'Commercial', count: properties.filter(p => p.type === 'commercial').length, active: false },
  ];

  const stats = [
    { value: '500+', label: 'Propriétés disponibles' },
    { value: '5', label: 'Villes couvertes' },
    { value: '10+', label: 'Partenaires développeurs' },
    { value: '95%', label: 'Satisfaction client' },
  ];

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
              Nos Projets Immobiliers
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Découvrez notre portfolio exclusif de propriétés premium à Chypre
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Filters and Properties */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Portfolio Immobilier
              </h2>
              <Button variant="outline" className="btn-outline-premium">
                <Filter className="w-4 h-4 mr-2" />
                Filtres avancés
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {categories.map(category => (
                <Badge
                  key={category.name}
                  variant={category.active ? "default" : "outline"}
                  className="px-4 py-2 cursor-pointer hover:scale-105 transition-transform"
                >
                  {category.name} ({category.count})
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {properties.map((property, index) => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                index={index}
              />
            ))}
          </div>

          {/* Load More */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Button size="lg" className="btn-premium">
              Charger plus de propriétés
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Featured Locations */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Nos Destinations Premium
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explorez nos propriétés dans les plus belles régions de Chypre
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Limassol Marina', count: '150+ propriétés', image: 'luxury-marina' },
              { name: 'Paphos', count: '80+ propriétés', image: 'coastal-paphos' },
              { name: 'Nicosie Centre', count: '120+ propriétés', image: 'modern-nicosia' },
              { name: 'Ayia Napa', count: '60+ propriétés', image: 'beach-ayia-napa' },
              { name: 'Larnaca', count: '90+ propriétés', image: 'historic-larnaca' },
              { name: 'Protaras', count: '45+ propriétés', image: 'resort-protaras' },
            ].map((location, index) => (
              <motion.div
                key={location.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden card-hover cursor-pointer">
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-accent relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="flex items-center mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm opacity-90">{location.count}</span>
                      </div>
                      <h3 className="text-xl font-semibold">{location.name}</h3>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Building2 className="w-12 h-12 text-white/30" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-white space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Vous ne trouvez pas ce que vous cherchez ?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Notre équipe d'experts peut vous aider à trouver la propriété parfaite 
              selon vos critères spécifiques.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-blue-50 px-8 py-4 text-lg font-semibold"
              >
                Recherche personnalisée
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold"
              >
                Alertes par email
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Projects;