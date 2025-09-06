import { useState, useEffect, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Search, Filter, Waves, Trees, Dumbbell, Shield, ParkingCircle, ArrowRight } from 'lucide-react';
import { useSupabaseProperties } from '@/hooks/useSupabaseProperties';
import { Property } from '@/lib/supabase';
import ErrorBoundary from '@/components/ErrorBoundary';
import { SEOHead } from '@/components/SEOHead';
import { trackPageView, trackCustomEvent } from '@/lib/analytics';
import Layout from '@/components/layout/Layout';

const GoogleMapComponent = lazy(() => import('@/components/GoogleMap'));

// Header Component
const Header = () => (
  <motion.header 
    className="bg-background sticky top-0 z-50 shadow-md"
    initial={{ y: -100 }}
    animate={{ y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
      <Link to="/">
        <div className="text-2xl font-light tracking-tight text-primary">ENKI-REALTY</div>
      </Link>
      <nav className="hidden md:flex space-x-6">
        <Link to="/" className="text-base font-medium text-primary hover:text-primary-hover">Accueil</Link>
        <Link to="/projects" className="text-base font-medium text-primary hover:text-primary-hover">Projets</Link>
        <Link to="/search" className="text-base font-medium text-primary hover:text-primary-hover">Recherche IA</Link>
        <Link to="/lexaia" className="text-base font-medium text-primary hover:text-primary-hover">Conseil Fiscal IA</Link>
        <Link to="/blog" className="text-base font-medium text-primary hover:text-primary-hover">Blog</Link>
        <Link to="/about" className="text-base font-medium text-primary hover:text-primary-hover">À Propos</Link>
        <Link to="/contact" className="text-base font-medium text-primary hover:text-primary-hover">Contact</Link>
      </nav>
      <Link to="/login">
        <Button variant="outline" className="text-base font-medium">Connexion</Button>
      </Link>
    </div>
  </motion.header>
);

// Footer Component
const Footer = () => (
  <footer className="bg-background py-8 border-t border-border">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-primary">
      <p>&copy; 2025 ENKI-REALTY. Tous droits réservés.</p>
      <div className="mt-4 space-x-4">
        <Link to="/about" className="text-sm font-normal hover:text-primary-hover">À Propos</Link>
        <Link to="/contact" className="text-sm font-normal hover:text-primary-hover">Contact</Link>
        <Link to="/privacy" className="text-sm font-normal hover:text-primary-hover">Politique de Confidentialité</Link>
      </div>
    </div>
  </footer>
);

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const { properties, loading, error } = useSupabaseProperties();

  useEffect(() => {
    trackPageView('/projects', 'Projets - ENKI-REALTY Immobilier Premium Chypre');
  }, []);

  const filteredProperties = properties.filter((property: Property) => {
    const matchesQuery = property.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (typeof property.location === 'string' && property.location.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLocation = !selectedLocation || (typeof property.location === 'string' && property.location === selectedLocation);
    const matchesType = !selectedType || property.type === selectedType;
    const matchesBudget = !selectedBudget || (property.price && parseFloat(property.price.replace('€', '').replace(',', '')) <= parseFloat(selectedBudget));
    return matchesQuery && matchesLocation && matchesType && matchesBudget;
  });

  return (
    <>
      <SEOHead 
        title="Projets Immobiliers à Chypre | ENKI-REALTY"
        description="Découvrez notre sélection exclusive de projets immobiliers premium à Chypre. Résidences de luxe, villas et appartements dans les meilleurs emplacements."
        keywords="projets immobiliers Chypre, résidences premium, investissements Chypre, villas Limassol, appartements Paphos"
        url="https://enki-realty.com/projects"
        canonical="https://enki-realty.com/projects"
        image="/og-projects.jpg"
      />
      
      <Header />
      
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <motion.div 
            className="absolute inset-0 z-0"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            <video 
              className="w-full h-full object-cover"
              autoPlay 
              muted 
              loop 
              playsInline
              preload="metadata"
            >
              <source src="https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4" type="video/mp4" />
              <track kind="captions" src="/captions/projects-hero.vtt" srcLang="fr" label="French Captions" default />
              Votre navigateur ne supporte pas la vidéo.
            </video>
            <div className="absolute inset-0 bg-hero-gradient opacity-50" />
          </motion.div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1 
              className="text-6xl sm:text-7xl lg:text-8xl font-light tracking-tight text-white mb-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Discover Our Exclusive Projects in Cyprus
            </motion.h1>
            <motion.p 
              className="text-lg sm:text-xl md:text-2xl font-normal leading-relaxed text-white/90 max-w-4xl mx-auto mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Explore a curated selection of premium residences designed for sophisticated living
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Button 
                className="bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-4 text-base font-medium rounded-lg shadow-lg hover:shadow-premium hover:scale-105 transition-all"
                onClick={() => document.getElementById('projects-grid')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore Projects
              </Button>
            </motion.div>
          </div>
          
          <motion.div 
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <div className="w-7 h-11 border-2 border-white/70 rounded-full flex items-start justify-center backdrop-blur-sm">
              <motion.div 
                className="w-1.5 h-1.5 bg-white rounded-full mt-1.5"
                animate={{ y: [0, 12, 0], opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </section>

        {/* Search & Filter Section */}
        <section className="bg-secondary py-16 px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-primary text-center mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Find Your Perfect Project
            </motion.h2>
            <motion.p 
              className="text-lg sm:text-xl font-normal leading-relaxed text-muted-foreground max-w-3xl mx-auto text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Refine your search to discover projects that match your vision
            </motion.p>
            <motion.div 
              className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto"
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Search by location, type, or budget..."
                  className="pl-10 bg-transparent border-0 focus:ring-2 ring-ring text-primary text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Paphos">Paphos</SelectItem>
                  <SelectItem value="Limassol">Limassol</SelectItem>
                  <SelectItem value="Nicosia">Nicosia</SelectItem>
                  <SelectItem value="Larnaca">Larnaca</SelectItem>
                  <SelectItem value="Ayia Napa">Ayia Napa</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Apartment">Apartment</SelectItem>
                  <SelectItem value="Villa">Villa</SelectItem>
                  <SelectItem value="Penthouse">Penthouse</SelectItem>
                  <SelectItem value="Mixed-Use">Mixed-Use</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedBudget} onValueChange={setSelectedBudget}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="200000">Up to €200k</SelectItem>
                  <SelectItem value="500000">Up to €500k</SelectItem>
                  <SelectItem value="1000000">Up to €1M</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
                <Filter className="w-4 h-4 mr-2" />
                Apply
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Projects Grid Section */}
        <section id="projects-grid" className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight text-primary text-center mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Our Exclusive Projects
            </motion.h2>
            <motion.p 
              className="text-lg sm:text-xl font-normal leading-relaxed text-muted-foreground max-w-3xl mx-auto text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Discover a curated selection of premium residences designed for modern living
            </motion.p>
            {loading ? (
              <div className="text-center text-muted-foreground">Loading projects...</div>
            ) : error ? (
              <div className="text-center text-destructive">Error loading projects. Please try again.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProperties.map((property: Property, index: number) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <Card className="h-full overflow-hidden bg-card border-border/50 shadow-lg hover:shadow-premium transition-all duration-300">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={property.photos?.[0] || `https://picsum.photos/600/400?random=${property.id}`}
                          alt={`Image of ${property.title} in ${property.location}`}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                        <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                          {property.price}
                        </Badge>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-2xl font-medium tracking-tight text-primary mb-2">
                          {property.title}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center mb-4">
                          <MapPin className="w-4 h-4 mr-1" />
                          {property.location}
                        </p>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {property.description || 'A premium residence offering modern amenities and stunning views.'}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="secondary">Pool</Badge>
                          <Badge variant="secondary">Gym</Badge>
                          <Badge variant="secondary">Garden</Badge>
                        </div>
                        <Button 
                          asChild 
                          className="w-full bg-primary hover:bg-primary-hover text-primary-foreground hover:scale-105 transition-all"
                        >
                          <Link to={`/project/${property.id}`}>
                            View Details
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Interactive Map Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary relative">
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-primary text-center mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Explore by Location
            </motion.h2>
            <motion.div 
              className="h-64 md:h-96 rounded-xl overflow-hidden shadow-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Suspense fallback={<div className="h-full bg-muted animate-pulse" />}>
                <GoogleMapComponent properties={filteredProperties} />
              </Suspense>
            </motion.div>
          </div>
        </section>

        {/* Featured Amenities Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-primary text-center mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Premium Living, Redefined
            </motion.h2>
            <motion.p 
              className="text-lg sm:text-xl font-normal leading-relaxed text-muted-foreground max-w-3xl mx-auto text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Our projects offer world-class amenities for an elevated lifestyle
            </motion.p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[
                { icon: Waves, label: 'Infinity Pools' },
                { icon: Trees, label: 'Lush Gardens' },
                { icon: Dumbbell, label: 'State-of-the-Art Gym' },
                { icon: Shield, label: '24/7 Security' },
                { icon: ParkingCircle, label: 'Private Parking' },
                { icon: Waves, label: 'Sea Views' },
              ].map((amenity, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center p-4 bg-card border-border/50 rounded-xl shadow-md hover:shadow-premium transition-all"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <amenity.icon className="w-8 h-8 text-primary mb-2" />
                  <span className="text-sm font-medium text-center">{amenity.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-premium-gradient text-primary-foreground text-center">
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Start Your Journey Today
            </motion.h2>
            <motion.p 
              className="text-lg sm:text-xl font-normal leading-relaxed max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Let our AI-powered search find the perfect project for you
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button 
                className="bg-primary-foreground text-primary px-8 py-4 text-base font-medium rounded-lg shadow-lg hover:shadow-premium hover:scale-105 transition-all mr-4"
                onClick={() => trackCustomEvent('cta_search_clicked')}
              >
                Start Search
              </Button>
              <Button 
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                onClick={() => trackCustomEvent('cta_contact_clicked')}
              >
                Contact Us
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Projects;