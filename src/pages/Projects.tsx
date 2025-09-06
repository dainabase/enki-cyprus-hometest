import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';
import { Filter, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSupabaseProjects } from '@/hooks/useSupabaseProjects';
import { SEOHead } from '@/components/SEOHead';
import { trackCustomEvent } from '@/lib/analytics';
import cyprusHero from '@/assets/cyprus-hero.jpg';

// Innovative Project Presentation Section
const ProjectsPresentationSection = ({ filteredProjects, loading, error }: { filteredProjects: any[], loading: boolean, error: string | null }) => {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  if (loading) return <div className="text-center py-20 text-muted-foreground">Chargement des projets...</div>;
  if (error) return <div className="text-center py-20 text-destructive">Erreur de chargement des projets.</div>;

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    adaptiveHeight: true,
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight -0.015em text-primary text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Nos Programmes Immobiliers
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project: any, index: number) => {
            const isExpanded = expandedProject === project.id;
            return (
              <motion.div
                key={project.id}
                className={`relative overflow-hidden rounded-xl shadow-lg hover:shadow-premium transition-all duration-500 ${
                  isExpanded ? 'col-span-1 md:col-span-2 lg:col-span-3' : ''
                }`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setExpandedProject(isExpanded ? null : project.id)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
                <div className="relative z-10 p-6">
                  {/* Project Hero Image or Slideshow */}
                  <motion.div 
                    className="h-48 md:h-64 overflow-hidden rounded-lg mb-4"
                    animate={{ height: isExpanded ? '400px' : 'auto' }}
                    transition={{ duration: 0.5 }}
                  >
                    {isExpanded ? (
                      <Slider {...sliderSettings}>
                        {(project.images || [project.image_url]).map((photo: string, photoIndex: number) => (
                          <img 
                            key={photoIndex}
                            src={photo || `https://picsum.photos/800/400?random=${project.id}`}
                            alt={`Photo ${photoIndex + 1} of ${project.title}`}
                            className="w-full h-full object-cover"
                          />
                        ))}
                      </Slider>
                    ) : (
                      <img 
                        src={project.image_url || project.images?.[0] || `https://picsum.photos/800/400?random=${project.id}`}
                        alt={`Main photo of ${project.title}`}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    )}
                  </motion.div>

                  {/* Project Info */}
                  <h3 className="text-2xl font-medium tracking-tight -0.01em text-primary mb-2">{project.title}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">{project.location?.city || 'Non spécifié'}</span>
                  </div>
                  <Badge className="mb-4 bg-success text-white">À partir de {project.price_from || '€250,000'}</Badge>
                  
                  <motion.p 
                    className="text-sm text-muted-foreground mb-4 line-clamp-3"
                    animate={{ opacity: isExpanded ? 1 : 0.8, maxHeight: isExpanded ? 'none' : '4rem' }}
                    transition={{ duration: 0.3 }}
                  >
                    {project.description || 'Description du projet...'}
                  </motion.p>

                  {/* Features (expanded view) */}
                  <motion.div
                    className="grid grid-cols-2 gap-2 mb-4"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {(project.features || []).slice(0, 6).map((feature: string, featureIndex: number) => (
                      <Badge key={featureIndex} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </motion.div>

                  {/* CTA */}
                  <Link to={`/project/${project.id}`}>
                    <Button 
                      className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
                      onClick={() => trackCustomEvent('project_view_details', { project_id: project.id })}
                    >
                      Voir Détails <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const Projects = () => {
  const { projects, loading, error } = useSupabaseProjects();
  const [selectedType, setSelectedType] = useState<string>('Tous');
  const [selectedLocation, setSelectedLocation] = useState<string>('Toutes');
  const [selectedStatus, setSelectedStatus] = useState<string>('Tous');

  // Filter projects based on selected criteria
  const filteredProjects = projects.filter((project: any) => {
    const typeMatch = selectedType === 'Tous' || project.type === selectedType;
    const locationMatch = selectedLocation === 'Toutes' || project.location?.city === selectedLocation;
    const statusMatch = selectedStatus === 'Tous' || project.status === selectedStatus;
    
    return typeMatch && locationMatch && statusMatch;
  });

  useEffect(() => {
    trackCustomEvent('page_view', { page: 'projects' });
  }, []);

  return (
    <>
      <SEOHead 
        title="Programmes Immobiliers à Chypre | ENKI REALTY"
        description="Découvrez nos programmes immobiliers exclusifs à Chypre. Appartements, villas et projets premium dans les meilleures locations de l'île."
        canonical="/projects"
      />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative h-screen overflow-hidden">
          <motion.div 
            className="absolute inset-0"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <img
              src={cyprusHero}
              alt="Vue panoramique de Chypre avec architecture moderne et mer Méditerranée"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70" />
          </motion.div>
          
          <motion.div
            className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          />
          
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
              Découvrez une sélection de programmes premium conçus pour un art de vivre d'exception
            </motion.p>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30 relative">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="flex flex-col md:flex-row gap-4 items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full md:w-48 bg-background border-border">
                  <SelectValue placeholder="Type de projet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tous">Tous les types</SelectItem>
                  <SelectItem value="Apartment">Appartements</SelectItem>
                  <SelectItem value="Villa">Villas</SelectItem>
                  <SelectItem value="Penthouse">Penthouses</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full md:w-48 bg-background border-border">
                  <SelectValue placeholder="Localisation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Toutes">Toutes les villes</SelectItem>
                  <SelectItem value="Limassol">Limassol</SelectItem>
                  <SelectItem value="Paphos">Paphos</SelectItem>
                  <SelectItem value="Nicosia">Nicosie</SelectItem>
                  <SelectItem value="Larnaca">Larnaca</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full md:w-48 bg-background border-border">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tous">Tous les statuts</SelectItem>
                  <SelectItem value="pre_launch">Pré-lancement</SelectItem>
                  <SelectItem value="under_construction">En construction</SelectItem>
                  <SelectItem value="ready_to_move">Prêt à habiter</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
                <Filter className="w-4 h-4 mr-2" />
                Apply
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Innovative Project Presentation Section */}
        <ProjectsPresentationSection filteredProjects={filteredProjects} loading={loading} error={error} />

        {/* Interactive Map Section - placeholder for now */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary relative">
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-primary text-center mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Localisation Interactive
            </motion.h2>
            <motion.p 
              className="text-lg font-normal leading-relaxed text-muted-foreground max-w-3xl mx-auto text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Explorez l'emplacement de nos projets sur la carte interactive de Chypre
            </motion.p>
            <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Carte interactive à venir</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-accent text-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 
              className="text-4xl sm:text-5xl font-light tracking-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Prêt à Investir à Chypre ?
            </motion.h2>
            <motion.p 
              className="text-xl leading-relaxed mb-8 opacity-90"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Contactez nos experts immobiliers pour un accompagnement personnalisé
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button 
                asChild 
                size="lg" 
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all"
              >
                <Link to="/contact">
                  Nous Contacter
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Projects;