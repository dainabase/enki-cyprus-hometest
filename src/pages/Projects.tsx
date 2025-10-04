import { useState, useEffect, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Search, Filter, Waves, Trees, Dumbbell, Shield, ParkingCircle, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import ErrorBoundary from '@/components/ErrorBoundary';
import { SEOHead } from '@/components/SEOHead';
import { trackPageView, trackCustomEvent } from '@/lib/analytics';
import Layout from '@/components/layout/Layout';
import { getHeroImage, getGalleryUrls } from '@/utils/gallery';
const GoogleMapComponent = lazy(() => import('@/components/GoogleMap'));
const Projects = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  // Récupérer les projets immobiliers depuis la base de données
  const { data: projects = [], isLoading: loading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_images(url, caption, is_primary, display_order)
        `)
        .order('created_at', { ascending: false });
     
      if (error) throw error;
      return data;
    },
  });
  useEffect(() => {
    trackPageView('/projects', 'Projets - ENKI-REALTY Immobilier Premium Chypre');
  }, []);
  const uniqueTypes = Array.from(new Set(projects.map((p: any) => p.type).filter(Boolean)));
  const filteredProjects = projects.filter((project: any) => {
    const projectLocationStr = typeof project.location === 'string' ? project.location : (project.location?.city || project.location?.name || JSON.stringify(project.location));
    const matchesQuery = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         projectLocationStr.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = !selectedLocation || projectLocationStr.includes(selectedLocation);
    const matchesType = !selectedType || project.type === selectedType;
    const matchesBudget = !selectedBudget || (project.price_from && Number(project.price_from) <= parseFloat(selectedBudget));
    return matchesQuery && matchesLocation && matchesType && matchesBudget;
  });
  return (
    <Layout>
      <SEOHead
        title="Projets Immobiliers à Chypre | ENKI-REALTY"
        description="Découvrez notre sélection exclusive de projets immobiliers premium à Chypre. Résidences de luxe, villas et appartements dans les meilleurs emplacements."
        keywords="projets immobiliers Chypre, résidences premium, investissements Chypre, villas Limassol, appartements Paphos"
        url="https://enki-realty.com/projects"
        canonical="https://enki-realty.com/projects"
        image="/og-projects.jpg"
      />
     
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
              Découvrez nos Programmes Immobiliers à Chypre
            </motion.h1>
            <motion.p
              className="text-lg sm:text-xl md:text-2xl font-normal leading-relaxed text-white/90 max-w-4xl mx-auto mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Découvrez une sélection de programmes premium conçus pour un art de vivre d’exception
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
                Découvrir les projets
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
              Trouvez votre programme idéal
            </motion.h2>
            <motion.p
              className="text-lg sm:text-xl font-normal leading-relaxed text-muted-foreground max-w-3xl mx-auto text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Affinez votre recherche pour trouver le programme qui correspond à votre vision
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
                  placeholder="Rechercher par localisation, type de programme ou budget..."
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
                  <SelectValue placeholder="Type de programme" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueTypes.length > 0 ? (
                    uniqueTypes.map((t: string) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))
                  ) : (
                    <>
                      <SelectItem value="Residential">Residential</SelectItem>
                      <SelectItem value="Mixed-Use">Mixed-Use</SelectItem>
                    </>
                  )}
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
              Nos Programmes Immobiliers
            </motion.h2>
            <motion.p
              className="text-lg sm:text-xl font-normal leading-relaxed text-muted-foreground max-w-3xl mx-auto text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Découvrez une sélection de programmes premium conçus pour la vie moderne
            </motion.p>
            {loading ? (
              <div className="text-center text-muted-foreground">Chargement des projets...</div>
            ) : error ? (
              <div className="text-center text-destructive">Erreur de chargement des projets. Veuillez réessayer.</div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center text-muted-foreground">Aucun projet trouvé avec ces critères.</div>
            ) : (
              <div className="space-y-16">
                {filteredProjects.map((project: any, index: number) => (
                  <motion.div
                    key={project.id}
                    className="relative bg-card border-border/50 rounded-3xl shadow-premium overflow-hidden backdrop-blur-sm"
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.3, type: 'spring', stiffness: 50 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Background Parallax Image */}
                    <motion.div 
                      className="absolute inset-0 z-0"
                      style={{
                        backgroundImage: `url(${getHeroImage(project) || 'https://picsum.photos/1200/800?random=' + project.id})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                    </motion.div>
                    
                    {/* Glassmorphism Overlay */}
                    <div className="relative z-10 p-8 lg:p-12 flex flex-col lg:flex-row items-center gap-8 backdrop-blur-sm bg-background/30">
                      {/* Project Info Column */}
                      <motion.div 
                        className="lg:w-1/2 space-y-6"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      >
                        <h3 className="text-3xl lg:text-5xl font-light tracking-tight text-white">{project.title}</h3>
                        <div className="flex items-center gap-2 text-white/80">
                          <MapPin className="w-5 h-5" />
                          <span>{typeof project.location === 'string' ? project.location : (project.location?.city || project.location?.name || JSON.stringify(project.location))}</span>
                        </div>
                        <Badge className="bg-white/20 text-white border-white/30">
                          À partir de €{Number(project.price_from || project.price).toLocaleString()}
                        </Badge>
                        <p className="text-white/90 leading-relaxed">
                          {project.description || 'Un programme immobilier premium offrant des équipements modernes et des vues exceptionnelles.'}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(project.amenities || []).slice(0, 4).map((amenity: string, i: number) => (
                            <Badge key={i} className="bg-white/10 text-white border-white/20">{amenity}</Badge>
                          ))}
                        </div>
                        <Button 
                          asChild
                          className="bg-white text-primary hover:bg-white/90 mt-4"
                        >
                          <Link to={`/projects/${project.url_slug || project.id}`}>
                            Explorer le projet
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </motion.div>
                      
                      {/* Slideshow Column */}
                      <motion.div 
                        className="lg:w-1/2 h-64 lg:h-96 overflow-hidden rounded-2xl"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                      >
                        <Slider {...{
                          dots: true,
                          infinite: true,
                          speed: 500,
                          slidesToShow: 1,
                          slidesToScroll: 1,
                          autoplay: true,
                          autoplaySpeed: 3000,
                          arrows: false,
                          fade: true,
                        }}>
                          {getGalleryUrls(project).map((photo: string, photoIndex: number) => (
                            <motion.div 
                              key={photoIndex}
                              className="h-full"
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.5 }}
                            >
                              <img 
                                src={photo || 'https://picsum.photos/800/500?random=' + photoIndex}
                                alt={`Photo ${photoIndex + 1} du projet ${project.title}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = 'https://picsum.photos/800/500?random=' + photoIndex;
                                }}
                              />
                            </motion.div>
                          ))}
                        </Slider>
                      </motion.div>
                    </div>
                    
                    {/* Futuristic Glow Effect */}
                    <motion.div 
                      className="absolute inset-0 pointer-events-none"
                      animate={{
                        boxShadow: [
                          '0 0 20px rgba(0, 144, 230, 0.1)',
                          '0 0 40px rgba(0, 144, 230, 0.2)',
                          '0 0 20px rgba(0, 144, 230, 0.1)',
                        ],
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    />
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
              Explorer par localisation
            </motion.h2>
            <motion.div
              className="h-64 md:h-96 rounded-xl overflow-hidden shadow-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Suspense fallback={<div className="h-full bg-muted animate-pulse" />}>
                {/* Composant de carte simplifié pour les projets */}
                <div className="h-full bg-muted rounded-xl flex items-center justify-center text-muted-foreground">
                  Carte des projets - À implémenter
                </div>
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
              Un art de vivre premium, réinventé
            </motion.h2>
            <motion.p
              className="text-lg sm:text-xl font-normal leading-relaxed text-muted-foreground max-w-3xl mx-auto text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Découvrez un luxe inégalé au sein de programmes soigneusement conçus
            </motion.p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[
                { icon: Waves, label: 'Infinity Pools' },
                { icon: Trees, label: 'Lush Gardens' },
                { icon: Dumbbell, label: 'State-of-the-Art Gym' },
                { icon: Shield, label: '24/7 Security' },
                { icon: ParkingCircle, label: 'Underground Parking' },
                { icon: ArrowRight, label: 'Concierge Services' },
              ].map((amenity, index) => (
                <motion.div
                  key={amenity.label}
                  className="text-center p-6 rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <motion.div
                    className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-primary/10"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <amenity.icon className="w-6 h-6 text-primary" />
                  </motion.div>
                  <h3 className="text-sm font-medium text-primary">{amenity.label}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Ready to Make Cyprus Your Home?
            </motion.h2>
            <motion.p
              className="text-lg sm:text-xl font-normal leading-relaxed mb-12 opacity-90"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Connect with our expert team to discover your perfect property investment
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90 px-8 py-4 text-base font-medium rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                onClick={() => trackCustomEvent('cta_contact_clicked')}
              >
                <Link to="/contact">
                  Contact Us
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
    </Layout>
  );
};
export default Projects;