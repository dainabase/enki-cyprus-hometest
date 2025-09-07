import { useState, useEffect, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Trees, Dumbbell, Shield, ParkingCircle, Waves, ExternalLink, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import ErrorBoundary from '@/components/ErrorBoundary';
import { SEOHead } from '@/components/SEOHead';
import { trackPageView, trackCustomEvent } from '@/lib/analytics';
import Layout from '@/components/layout/Layout';

const Project = () => {
  const { id } = useParams<{ id: string }>();

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (project) {
      trackPageView(`/project/${id}`, `Projet ${project.title} - ENKI-REALTY`);
    }
  }, [project]);

  if (isLoading) return <div className="text-center py-20 text-muted-foreground">Chargement du projet...</div>;
  if (error || !project) return <div className="text-center py-20 text-destructive">Erreur de chargement du projet. Veuillez réessayer.</div>;

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  const formatPrice = (price: any): string => {
    const n = typeof price === 'number' ? price : Number(price);
    return isNaN(n) ? 'N/A' : `€${n.toLocaleString()}`;
  };

  const amenities = [
    { icon: Waves, title: 'Piscine', desc: 'Piscine infinity avec vue mer' },
    { icon: Trees, title: 'Jardins', desc: 'Jardins paysagers luxuriants' },
    { icon: Dumbbell, title: 'Salle de Gym', desc: 'Équipements modernes' },
    { icon: Shield, title: 'Sécurité', desc: 'Surveillance 24/7' },
    { icon: ParkingCircle, title: 'Parking', desc: 'Places privées sécurisées' },
    { icon: Waves, title: 'Vue Mer', desc: 'Accès direct à la plage' },
  ];

  return (
    <Layout>
      <SEOHead 
        title={`${project.title} | ENKI-REALTY`}
        description={project.description || 'Découvrez ce projet immobilier premium à Chypre.'}
        keywords={`projet immobilier ${project.title}, ${project.location}, investissement Chypre`}
        url={`https://enki-realty.com/project/${id}`}
        canonical={`https://enki-realty.com/project/${id}`}
        image={project.photos?.[0] || '/og-image.jpg'}
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
              <track kind="captions" src="/captions/project-hero.vtt" srcLang="fr" label="French Captions" default />
              Votre navigateur ne supporte pas la vidéo.
            </video>
            <div className="absolute inset-0 bg-hero-gradient opacity-50" />
          </motion.div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1 
              className="text-6xl sm:text-7xl lg:text-8xl font-light tracking-tight text-white mb-8"
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              {project.title}
            </motion.h1>
            <motion.p 
              className="text-lg sm:text-xl md:text-2xl font-normal leading-relaxed text-white/90 max-w-4xl mx-auto mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              A serene coastal retreat in the heart of Limassol
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Button 
                className="bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-4 text-base font-medium rounded-lg shadow-lg hover:shadow-premium hover:scale-105 transition-all"
                onClick={() => {
                  trackCustomEvent('project_inquire_clicked', { project_id: id });
                  // Link to contact form or inquiry section
                }}
              >
                Inquire Now
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

        {/* Project Overview Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background relative">
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight text-primary text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Project Overview
            </motion.h2>
            <motion.p 
              className="text-lg sm:text-xl font-normal leading-relaxed text-muted-foreground max-w-4xl mx-auto text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {project.description || 'Les Jardins d\'Eden combines modern architecture with lush greenery, offering a sanctuary of calm in Limassol\'s vibrant coast.'}
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: 'Location', desc: typeof (project as any).location === 'string' ? (project as any).location : ((project as any).location?.city || 'Limassol'), icon: MapPin },
                { title: 'Price From', desc: formatPrice((project as any).price), icon: Waves },
                { title: 'Type', desc: (project as any).type || 'Apartment', icon: ParkingCircle },
                { title: 'Status', desc: 'Available', icon: Shield },
              ].map((highlight, index) => (
                <motion.div
                  key={index}
                  className="bg-card border-border/50 shadow-lg hover:shadow-premium hover:translateY(-5px) hover:scale-102 transition-all duration-300 rounded-xl p-6"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.2 }}
                >
                  <highlight.icon className="w-6 h-6 text-primary mb-4" />
                  <h3 className="text-xl font-medium tracking-tight text-primary mb-2">{highlight.title}</h3>
                  <p className="text-sm font-normal leading-relaxed text-muted-foreground">{highlight.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Photo Slideshow Section */}
        <section className="relative h-[80vh] overflow-hidden bg-hero-gradient">
          <div className="absolute inset-0 opacity-30">
            {/* Optional 3D canvas fallback */}
            <div className="w-full h-full bg-gradient-to-br from-accent/20 to-primary/20" />
          </div>
          <Slider {...sliderSettings} className="w-full h-full">
            {(project.photos || []).map((photo, index) => (
              <div key={index} className="relative h-[80vh]">
                <img 
                  src={photo} 
                  alt={`Project image ${index + 1} of ${project.title}`} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <motion.div 
                  className="absolute bottom-8 left-8 text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <p className="text-lg font-normal leading-relaxed">Infinity pool overlooking the Mediterranean</p>
                </motion.div>
              </div>
            ))}
          </Slider>
        </section>

        {/* Project Details Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary relative">
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-primary text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Project Details
            </motion.h2>
            <motion.p 
              className="text-base font-normal leading-relaxed text-muted-foreground max-w-3xl mx-auto text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Discover the exceptional features and amenities that make {project.title} unique.
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {amenities.map((amenity, index) => (
                <motion.div
                  key={index}
                  className="p-6 bg-card border-border/50 rounded-xl shadow-lg hover:shadow-premium transition-all duration-300"
                  initial={{ opacity: 0, x: 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ rotate: 5, scale: 1.05 }}
                >
                  <amenity.icon className="w-6 h-6 text-primary mb-4" />
                  <h3 className="text-xl font-medium tracking-tight text-primary mb-2">{amenity.title}</h3>
                  <p className="text-sm font-normal leading-relaxed text-muted-foreground">{amenity.desc}</p>
                </motion.div>
              ))}
            </div>
            <ul className="space-y-4 max-w-3xl mx-auto">
              {(project.features || []).map((feature, index) => (
                <motion.li 
                  key={index}
                  className="text-base font-normal leading-relaxed text-primary"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  {feature}
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        {/* Available Units Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-primary text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Available Units
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Mock units for demonstration */}
              {[
                { type: 'Apartment', price: '€450,000', status: 'available', image: null },
                { type: 'Villa', price: '€750,000', status: 'available', image: null },
                { type: 'Penthouse', price: '€950,000', status: 'sold', image: null }
              ].map((unit, index) => (
                <motion.div
                  key={index}
                  className="bg-card border-border/50 shadow-lg hover:shadow-premium hover:translateY(-5px) hover:scale-102 transition-all duration-300 rounded-xl overflow-hidden"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.2 }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={unit.image || `https://picsum.photos/600/400?random=${index}`} 
                      alt={`Image of ${unit.type} unit in ${project.title}`}
                      className="w-full h-full object-cover hover:scale-105 transition-duration-400"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <Badge 
                      className={`absolute top-4 right-4 ${unit.status === 'available' ? 'bg-success' : 'bg-destructive'} text-white`}
                    >
                      {unit.status === 'available' ? 'Available' : 'Sold'}
                    </Badge>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-primary mb-2">{unit.type}</h3>
                    <p className="text-lg font-bold text-success mb-4">{unit.price}</p>
                    <Button 
                      className="w-full bg-primary hover:bg-primary-hover text-primary-foreground hover:scale-105 transition-all"
                      onClick={() => {
                        trackCustomEvent('unit_details_clicked', { project_id: id, unit_type: unit.type });
                        // Handle unit details view
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Virtual Tour Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30 relative">
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-primary text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Virtual Tour
            </motion.h2>
            <motion.div 
              className="relative h-96 rounded-xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <iframe 
                src={project.virtual_tour || 'https://my.matterport.com/show/?m=placeholder'} 
                className="w-full h-full"
                title="Virtual Tour of the Project"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center text-white text-lg sm:text-xl font-normal">
                Discover every detail of {project.title}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Location & Interests Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary relative">
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-primary text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Location & Interests
            </motion.h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div 
                className="h-64 rounded-xl overflow-hidden shadow-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <img 
                  src={`https://maps.googleapis.com/maps/api/staticmap?center=${project.location}&zoom=14&size=800x400&key=AIzaSyBmFbbR7bD_4PSJGBU-_12ZL1VjGKRXKBU`} 
                  alt={`Map of ${project.title} location in ${project.location}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
              <div className="space-y-4">
                {/* Mock interests for demonstration */}
                {[
                  { name: 'Beach Access', desc: '5 minutes walk to pristine beaches', link: '#' },
                  { name: 'Shopping Mall', desc: 'Modern shopping center nearby', link: '#' },
                  { name: 'International School', desc: 'Top-rated education facilities', link: '#' }
                ].map((interest, index) => (
                  <motion.div
                    key={index}
                    className="p-4 bg-gradient-to-r from-background/50 to-muted/30 backdrop-blur-sm border-border/50 rounded-xl hover:border-primary/50 hover:scale-102 shadow-lg transition-all duration-300"
                    initial={{ opacity: 0, x: 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-semibold text-primary mb-2">{interest.name}</h4>
                        <p className="text-xs text-muted-foreground">{interest.desc}</p>
                      </div>
                      <a href={interest.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 text-primary" />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
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
              Ready to Own Your Dream Home?
            </motion.h2>
            <motion.p 
              className="text-lg sm:text-xl font-normal leading-relaxed max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Contact us to learn more or explore tax optimization options.
            </motion.p>
            <motion.div
              className="flex justify-center gap-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button 
                className="bg-white text-primary px-8 py-4 text-base font-medium rounded-lg shadow-lg hover:shadow-premium hover:scale-105 transition-all"
                onClick={() => {
                  trackCustomEvent('cta_contact_clicked', { project_id: id });
                  // Link to contact form
                }}
              >
                Contact Us
              </Button>
              <Button 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-base font-medium rounded-lg transition-all"
                asChild
              >
                <Link to="/lexaia">
                  Explore Tax Optimization
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Project;