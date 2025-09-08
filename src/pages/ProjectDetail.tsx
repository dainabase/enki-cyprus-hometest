import React, { Suspense, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { SEOHead } from '@/components/SEOHead';
import { trackPageView } from '@/lib/analytics';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import ZoomablePlans from '@/components/ui/ZoomablePlans';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  MapPin, 
  ArrowRight, 
  ExternalLink, 
  Calendar, 
  Home, 
  Euro, 
  Users,
  Car,
  Download,
  Heart,
  Share2,
  Play
} from 'lucide-react';
import Slider from 'react-slick';
import type { Settings } from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleHover = {
  whileHover: { 
    scale: 1.05, 
    transition: { duration: 0.2 } 
  }
};

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const heroRef = useRef<HTMLElement>(null);
  
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

  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 600], [0, -100]);
  const parallaxScale = useTransform(scrollY, [0, 600], [1, 1.1]);
  const parallaxOpacity = useTransform(scrollY, [0, 600], [1, 0.9]);
  
  const heroInView = useInView(heroRef, { once: true });

  useEffect(() => {
    if (project) {
      trackPageView(`/project/${id}`, `Projet ${project.title} - ENKI-REALTY`);
    }
  }, [project, id]);

  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  if (error || !project) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center p-8">
              <h2 className="text-2xl font-medium text-destructive mb-4">
                Projet introuvable
              </h2>
              <p className="text-muted-foreground mb-6">
                Le projet demandé n'existe pas ou a été supprimé.
              </p>
              <Button asChild>
                <Link to="/projects">Retour aux projets</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const sliderSettings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    lazyLoad: 'ondemand',
    fade: true,
    customPaging: () => (
      <div className="w-3 h-3 bg-white/50 hover:bg-white rounded-full transition-all duration-300" />
    ),
    dotsClass: "slick-dots !bottom-8"
  };

  const planSliderSettings: Settings = {
    ...sliderSettings,
    fade: false,
    adaptiveHeight: true,
  };

  // Process units data
  type Unit = {
    type?: string;
    price?: string | number;
    status?: string;
    image?: string;
    description?: string;
    surface?: string;
    rooms?: number;
  };
  
  const units: Unit[] = Array.isArray(project.units) ? (project.units as unknown as Unit[]) : [];
  
  // Process plans for ZoomablePlans component
  const planImages = (project.plans || []).map((plan: string, index: number) => ({
    url: plan,
    title: `Plan ${index + 1}`,
    type: (index === 0 ? 'floor_plan' : index === 1 ? 'site_plan' : '3d_view') as 'floor_plan' | 'site_plan' | '3d_view'
  }));

  // Location data
  const locationData = project.location as { ville?: string; adresse?: string; lat?: number; lng?: number };
  const fullAddress = [locationData?.adresse, locationData?.ville].filter(Boolean).join(', ');

  // Key stats for hero
  const keyStats = [
    { 
      label: "À partir de", 
      value: project.price_from || `€${project.price?.toLocaleString()}`,
      icon: Euro 
    },
    { 
      label: "Localisation", 
      value: locationData?.ville || "Chypre",
      icon: MapPin 
    },
    { 
      label: "Type", 
      value: project.property_category === 'residential' ? 'Résidentiel' : 
             project.property_category === 'commercial' ? 'Commercial' :
             project.property_category === 'mixed' ? 'Mixte' :
             project.property_category === 'industrial' ? 'Industriel' : 'Résidentiel',
      icon: Home 
    },
    { 
      label: "Livraison", 
      value: project.completion_date || "2025",
      icon: Calendar 
    },
  ];

  return (
    <ErrorBoundary>
      <Layout>
        <SEOHead 
          title={`${project.title} | ENKI-REALTY - Investissement Immobilier Premium`}
          description={project.description || 'Découvrez ce projet immobilier premium à Chypre avec ENKI-REALTY.'}
          keywords={`projet immobilier ${project.title}, ${locationData?.ville || 'Chypre'}, investissement immobilier, résidence premium`}
          url={`https://enki-realty.com/project/${id}`}
          canonical={`https://enki-realty.com/project/${id}`}
          image={project.photos?.[0] || '/og-image.jpg'}
        />
        
        <main className="bg-background min-h-screen">
          {/* Hero Section - 100vh immersive */}
          <motion.section 
            ref={heroRef}
            className="relative h-screen flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Parallax Background */}
            <motion.div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${project.photos?.[0] || project.video_url ? 'https://picsum.photos/1920/1080' : 'https://picsum.photos/1920/1080'})`,
                y: parallaxY,
                scale: parallaxScale,
                opacity: parallaxOpacity
              }}
            >
              {/* Hero Gradient Overlay */}
              <div 
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(135deg, hsl(200, 100%, 45%) 0%, hsl(190, 85%, 50%) 100%)",
                  opacity: 0.7
                }}
              />
            </motion.div>
            
            {/* Hero Content */}
            <div className="relative z-10 text-center text-primary-foreground space-y-6 px-4 max-w-6xl mx-auto">
              <motion.h1 
                className="text-6xl sm:text-7xl lg:text-8xl font-light tracking-tight"
                style={{ letterSpacing: "-0.02em" }}
                initial={{ y: 50, opacity: 0 }}
                animate={heroInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {project.title}
              </motion.h1>
              
              <motion.p 
                className="text-lg sm:text-xl md:text-2xl font-normal leading-relaxed max-w-3xl mx-auto"
                style={{ letterSpacing: "-0.005em" }}
                initial={{ y: 50, opacity: 0 }}
                animate={heroInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                {project.subtitle || project.description}
              </motion.p>

              {/* Key Project Info */}
              <motion.div 
                className="flex flex-wrap justify-center gap-4 mt-8"
                initial={{ y: 50, opacity: 0 }}
                animate={heroInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              >
                <Badge 
                  variant={project.status === 'available' ? 'default' : 'secondary'}
                  className="px-4 py-2 text-base font-medium"
                >
                  {project.status === 'available' ? 'Disponible' : 
                   project.status === 'under_construction' ? 'En Construction' : 
                   project.status === 'completed' ? 'Livré' : project.status}
                </Badge>
                <Badge variant="outline" className="px-4 py-2 text-base font-medium border-white/30 text-white">
                  {fullAddress}
                </Badge>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                className="pt-8"
                initial={{ y: 50, opacity: 0 }}
                animate={heroInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              >
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-4 text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-premium"
                  aria-label="Demander une visite du projet"
                >
                  Demander une Visite
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </div>
            
            {/* Key Stats - Bottom Glass Panel */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 z-20 backdrop-blur-xl border-t border-white/20"
              style={{
                background: "hsla(0, 0%, 100%, 0.1)"
              }}
              initial={{ y: 100, opacity: 0 }}
              animate={heroInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 max-w-7xl mx-auto">
                {keyStats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <motion.div 
                      key={index}
                      className="text-center p-4 rounded-lg backdrop-blur-sm border border-white/10"
                      style={{
                        background: "hsla(0, 0%, 100%, 0.1)"
                      }}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={heroInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 1 + index * 0.1, duration: 0.4 }}
                      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                    >
                      <IconComponent className="h-6 w-6 text-primary-foreground mx-auto mb-2" />
                      <p className="text-2xl lg:text-3xl font-light text-primary-foreground">{stat.value}</p>
                      <p className="text-sm text-primary-foreground/80">{stat.label}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.section>

          {/* Overview Section - 2 column */}
          <section className="py-16 bg-background">
            <div className="max-w-7xl mx-auto px-4">
              <motion.div 
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {/* Description */}
                <motion.div variants={fadeInUp} className="space-y-6">
                  <h2 className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight text-primary">
                    Aperçu
                  </h2>
                  <p className="text-lg leading-relaxed text-foreground">
                    {project.description}
                  </p>
                  {project.developer_id && (
                    <div className="pt-4">
                      <Button variant="outline" className="group">
                        Voir le Promoteur
                        <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  )}
                </motion.div>

                {/* Stats Grid */}
                <motion.div 
                  variants={fadeInUp} 
                  className="grid grid-cols-2 gap-6"
                >
                  <div className="p-6 bg-card rounded-lg border border-border/50 hover:border-primary/50 transition-all">
                    <Euro className="h-8 w-8 text-primary mb-4" />
                    <h3 className="text-2xl lg:text-3xl font-medium tracking-tight text-foreground">
                      {project.price?.toLocaleString() || 'Sur demande'}
                    </h3>
                    <p className="text-secondary text-sm">Prix moyen</p>
                  </div>
                  
                  <div className="p-6 bg-card rounded-lg border border-border/50 hover:border-primary/50 transition-all">
                    <Calendar className="h-8 w-8 text-primary mb-4" />
                    <h3 className="text-2xl lg:text-3xl font-medium tracking-tight text-foreground">
                      {project.completion_date || '2025'}
                    </h3>
                    <p className="text-secondary text-sm">Livraison</p>
                  </div>
                  
                  <div className="p-6 bg-card rounded-lg border border-border/50 hover:border-primary/50 transition-all">
                    <Home className="h-8 w-8 text-primary mb-4" />
                    <h3 className="text-2xl lg:text-3xl font-medium tracking-tight text-foreground">
                      {project.furniture_status || 'Meublé'}
                    </h3>
                    <p className="text-secondary text-sm">État</p>
                  </div>
                  
                  <div className="p-6 bg-card rounded-lg border border-border/50 hover:border-primary/50 transition-all">
                    <Users className="h-8 w-8 text-primary mb-4" />
                    <h3 className="text-2xl lg:text-3xl font-medium tracking-tight text-foreground">
                      {project.livability ? 'Oui' : 'Non'}
                    </h3>
                    <p className="text-secondary text-sm">Habitabilité</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Detailed Description */}
          <section className="py-16 bg-muted/30">
            <div className="max-w-4xl mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <h2 className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight text-primary">
                  Description Détaillée
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg leading-relaxed text-foreground">
                    {project.detailed_description || project.description}
                  </p>
                </div>
                <div className="pt-6">
                  <Button className="bg-primary hover:bg-primary-hover transition-all duration-300 hover:scale-105">
                    Personnaliser l'Optimisation Fiscale
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Features & Amenities */}
          <section className="py-16 bg-background">
            <div className="max-w-7xl mx-auto px-4">
              <motion.h2 
                className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight text-primary mb-12 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Équipements & Services
              </motion.h2>
              
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {[...(project.amenities || []), ...(project.features || []), ...(project.detailed_features || [])].map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="p-6 bg-card rounded-lg border border-border/50 hover:border-primary/50 transition-all hover:-translate-y-2 hover:shadow-lg"
                    {...scaleHover}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-success rounded-full flex-shrink-0" />
                      <h3 className="text-lg font-medium text-foreground">{feature}</h3>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Media Gallery */}
          <section className="py-16 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4">
              <motion.h2 
                className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight text-primary mb-12 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Galerie Média
              </motion.h2>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                {/* Photo Slider */}
                {project.photos && project.photos.length > 0 && (
                  <div className="relative">
                    <Slider {...sliderSettings}>
                      {project.photos.map((photo, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={photo}
                            alt={`Photo ${index + 1} du projet ${project.title}`}
                            className="w-full h-[70vh] object-cover rounded-lg"
                            loading={index === 0 ? "eager" : "lazy"}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
                        </div>
                      ))}
                    </Slider>
                  </div>
                )}

                {/* Video */}
                {project.video_url && (
                  <div className="relative">
                    <video 
                      className="w-full h-[60vh] rounded-lg object-cover"
                      controls
                      poster={project.photos?.[0]}
                      preload="metadata"
                    >
                      <source src={project.video_url} type="video/mp4" />
                      <track 
                        kind="captions" 
                        src="/captions.vtt" 
                        srcLang="fr" 
                        label="Français"
                      />
                      Votre navigateur ne supporte pas la lecture vidéo.
                    </video>
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-black/50 text-white border-white/30">
                        <Play className="w-4 h-4 mr-1" />
                        Présentation Vidéo
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Virtual Tour */}
                {project.virtual_tour_url && (
                  <div className="relative h-[60vh] rounded-lg overflow-hidden">
                    <Suspense fallback={<LoadingSpinner />}>
                      <iframe
                        src={project.virtual_tour_url}
                        className="w-full h-full border-0"
                        title={`Visite virtuelle du projet ${project.title}`}
                        loading="lazy"
                        aria-label={`Visite virtuelle interactive du projet ${project.title}`}
                      />
                    </Suspense>
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-black/50 text-white border-white/30">
                        Visite Virtuelle 360°
                      </Badge>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </section>

          {/* Plans & Units */}
          <section className="py-16 bg-background">
            <div className="max-w-7xl mx-auto px-4 space-y-16">
              {/* Zoomable Plans */}
              {planImages.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight text-primary mb-12 text-center">
                    Plans & Vues
                  </h2>
                  <ZoomablePlans 
                    plans={planImages}
                    className="max-w-6xl mx-auto"
                  />
                </motion.div>
              )}

              {/* Available Units */}
              {units.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight text-primary mb-12 text-center">
                    Unités Disponibles
                  </h2>
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                  >
                    {units.map((unit, index) => (
                      <motion.div
                        key={index}
                        variants={fadeInUp}
                        className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-premium transition-all duration-300"
                        {...scaleHover}
                      >
                        <div className="relative">
                          <img 
                            src={unit.image || 'https://picsum.photos/400/300'}
                            alt={`Unité ${unit.type} - Hero image of ${unit.type} in ${project.title}`}
                            className="w-full h-48 object-cover"
                            loading="lazy"
                          />
                          <div className="absolute top-4 right-4">
                            <Badge variant={unit.status === 'available' ? 'default' : 'destructive'}>
                              {unit.status === 'available' ? 'Disponible' : 
                               unit.status === 'sold' ? 'Vendu' : unit.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-6 space-y-4">
                          <div>
                            <h3 className="text-2xl lg:text-3xl font-medium tracking-tight text-foreground">
                              {unit.type}
                            </h3>
                            {unit.surface && (
                              <p className="text-secondary">{unit.surface}</p>
                            )}
                          </div>
                          
                          {unit.status !== 'sold' && (
                            <>
                              <p className="text-2xl font-medium text-success">
                                €{typeof unit.price === 'number' ? unit.price.toLocaleString() : unit.price}
                              </p>
                              
                              {unit.description && (
                                <p className="text-secondary">{unit.description}</p>
                              )}
                              
                              <Button className="w-full mt-4" variant="outline">
                                Voir les Détails
                              </Button>
                            </>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </div>
          </section>

          {/* Location & Interests */}
          <section className="py-16 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4">
              <motion.h2 
                className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight text-primary mb-12 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Localisation & Environs
              </motion.h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Map */}
                <motion.div
                  className="relative rounded-lg overflow-hidden shadow-lg"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <img 
                    src={project.map_image || 'https://picsum.photos/800/600'}
                    alt={`Carte de localisation du projet ${project.title}`}
                    className="w-full h-[400px] object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-black/50 text-white border-white/30">
                      <MapPin className="w-4 h-4 mr-1" />
                      {fullAddress}
                    </Badge>
                  </div>
                </motion.div>

                {/* Points of Interest */}
                <motion.div 
                  className="space-y-6"
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  <motion.h3
                    variants={fadeInUp}
                    className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-foreground"
                  >
                    Points d'Intérêt
                  </motion.h3>
                  
                  <div className="space-y-4">
                    {(project.interests || []).map((interest: any, index) => (
                      <motion.div
                        key={index}
                        variants={fadeInUp}
                        className="p-6 bg-card rounded-lg border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg group cursor-pointer"
                        onClick={() => interest.link && window.open(interest.link, '_blank')}
                        {...scaleHover}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="text-xl font-medium text-foreground group-hover:text-primary transition-colors">
                              {interest.name}
                            </h4>
                            <p className="text-secondary mt-1">{interest.desc}</p>
                            {interest.distance && (
                              <p className="text-sm text-primary mt-2">{interest.distance}</p>
                            )}
                          </div>
                          {interest.link && (
                            <ExternalLink className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section 
            className="py-16 text-primary-foreground relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, hsl(200, 100%, 45%) 0%, hsl(210, 85%, 40%) 50%, hsl(190, 80%, 45%) 100%)"
            }}
          >
            <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
              <motion.h2 
                className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Intéressé par ce projet ?
              </motion.h2>
              
              <motion.p
                className="text-xl leading-relaxed max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Contactez nos experts pour organiser une visite ou obtenir plus d'informations sur ce projet premium.
              </motion.p>

              <motion.div 
                className="flex flex-wrap justify-center gap-4 pt-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="bg-white text-primary hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-premium px-8 py-4"
                >
                  Réserver une Visite
                  <Calendar className="ml-2 h-5 w-5" />
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary transition-all duration-300 hover:scale-105 px-8 py-4"
                >
                  Télécharger la Brochure
                  <Download className="ml-2 h-5 w-5" />
                </Button>
                
                <Button 
                  size="lg" 
                  variant="ghost"
                  className="text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 px-8 py-4"
                >
                  Ajouter aux Favoris
                  <Heart className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>

              {/* RGPD Consent */}
              <motion.div
                className="pt-8 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <label className="flex items-start space-x-3 text-sm text-white/80 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="mt-0.5 rounded border-white/30 text-primary focus:ring-primary focus:ring-offset-0"
                    aria-label="Consentement RGPD pour le traitement des données personnelles"
                  />
                  <span>
                    J'accepte que mes données personnelles soient traitées pour être recontacté concernant ce projet immobilier, conformément à notre politique de confidentialité.
                  </span>
                </label>
              </motion.div>
            </div>
          </section>

          {/* Metadata */}
          <section className="py-8 bg-muted/50">
            <div className="max-w-7xl mx-auto px-4">
              <motion.p 
                className="text-center text-sm text-secondary"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Dernière mise à jour : {new Date(project.updated_at).toLocaleDateString('fr-FR')}
              </motion.p>
            </div>
          </section>
        </main>
      </Layout>
    </ErrorBoundary>
  );
};

export default ProjectDetail;