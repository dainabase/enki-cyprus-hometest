import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, useScroll, useTransform } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { SEOHead } from '@/components/SEOHead';
import { trackPageView } from '@/lib/analytics';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, ArrowRight, ExternalLink } from 'lucide-react';
import Slider from 'react-slick';
import type { Settings } from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProjectDetail = () => {
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
  }, [project, id]);

  // Framer Motion hooks declared before conditional returns
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 400], [0, -100]);

  if (isLoading) return <Layout><div className="text-center py-20 text-muted-foreground">Chargement du projet...</div></Layout>;
  if (error || !project) return <Layout><div className="text-center py-20 text-destructive">Erreur de chargement du projet. Veuillez réessayer.</div></Layout>;

  const sliderSettings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    lazyLoad: 'ondemand',
  };

  type Unit = {
    type?: string;
    price?: string | number;
    status?: string;
    image?: string;
    description?: string;
  };
  const units: Unit[] = Array.isArray(project.units) ? (project.units as unknown as Unit[]) : [];
  const fallbackStats = [
    { label: "Surface terrain", value: "3665 m²" },
    { label: "Appartements", value: units.filter(u => u.type === 'apartment').length || "8+" },
    { label: "Villas", value: units.filter(u => u.type === 'villa').length || "4+" },
    { label: "Parkings", value: "2+" },
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
      
      <main className="bg-background min-h-screen">
        {/* Hero Section with Parallax */}
        <motion.section 
          className="relative h-screen flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${project.photos?.[0] || 'https://picsum.photos/1920/1080'})`,
              y: parallaxY,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
          </motion.div>
          
          <div className="relative z-10 text-center text-white space-y-4">
            <motion.h1 
              className="text-6xl sm:text-7xl lg:text-8xl font-light tracking-tight"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {project.title}
            </motion.h1>
            <motion.p 
              className="text-xl sm:text-2xl font-normal"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {project.subtitle || 'A premium real estate project in Cyprus'}
            </motion.p>
          </div>
          
          {/* 4 Stats Blocks at Bottom */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 z-20 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-background/80 backdrop-blur-sm border-t border-border/50"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {fallbackStats.map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center p-4 rounded-lg bg-card border border-border/50"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <p className="text-3xl font-light text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Galerie Photos */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4">
            <motion.h2 
              className="text-4xl font-light text-primary mb-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Galerie
            </motion.h2>
            <Slider {...sliderSettings}>
              {(project.photos || []).map((photo, index) => (
                <div key={index}>
                  <img 
                    src={photo}
                    alt={`Photo ${index + 1} du projet ${project.title}`}
                    className="w-full h-[60vh] object-cover rounded-lg"
                    loading="lazy"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </section>

        {/* Description Détaillée */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4">
            <motion.h2 
              className="text-4xl font-light text-primary mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Description
            </motion.h2>
            <motion.p 
              className="text-lg leading-relaxed text-muted-foreground mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              {project.detailed_description || project.description}
            </motion.p>
          </div>
        </section>

        {/* Caractéristiques & Équipements */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4">
            <motion.h2 
              className="text-4xl font-light text-primary mb-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Caractéristiques
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(project.amenities || []).map((amenity, index) => (
                <motion.div
                  key={index}
                  className="p-6 bg-card rounded-lg border border-border/50 hover:border-primary/50 transition-all"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-xl font-medium mb-2">{amenity}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Unités Disponibles */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4">
            <motion.h2 
              className="text-4xl font-light text-primary mb-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Unités Disponibles
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {units.map((unit, index) => (
                <motion.div
                  key={index}
                  className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-premium transition-all"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <img 
                    src={unit.image || 'https://picsum.photos/400/300'}
                    alt={`Unité ${unit.type}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-medium mb-2">{unit.type}</h3>
                    <p className="text-success font-bold mb-2">{unit.price}</p>
                    <Badge variant={unit.status === 'available' ? 'secondary' : 'destructive'}>
                      {unit.status}
                    </Badge>
                    <p className="text-muted-foreground mt-4">{unit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Plans & Documents */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4">
            <motion.h2 
              className="text-4xl font-light text-primary mb-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Plans
            </motion.h2>
            <Slider {...sliderSettings}>
              {(project.plans || []).map((plan, index) => (
                <div key={index}>
                  <img 
                    src={plan}
                    alt={`Plan ${index + 1}`}
                    className="w-full h-[60vh] object-contain"
                    loading="lazy"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </section>

        {/* Visite Virtuelle */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4">
            <motion.h2 
              className="text-4xl font-light text-primary mb-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Visite Virtuelle
            </motion.h2>
            {project.virtual_tour_url ? (
              <iframe
                src={project.virtual_tour_url}
                className="w-full h-[60vh] rounded-lg"
                title="Visite virtuelle"
                loading="lazy"
              />
            ) : (
              <p className="text-center text-muted-foreground">Visite virtuelle non disponible pour ce projet.</p>
            )}
          </div>
        </section>

        {/* Vidéo de Présentation */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4">
            <motion.h2 
              className="text-4xl font-light text-primary mb-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Vidéo de Présentation
            </motion.h2>
            {project.video_url ? (
              <video 
                className="w-full h-[60vh] rounded-lg"
                controls
                poster={project.photos?.[0]}
              >
                <source src={project.video_url} type="video/mp4" />
                Votre navigateur ne supporte pas la vidéo.
              </video>
            ) : (
              <p className="text-center text-muted-foreground">Vidéo non disponible pour ce projet.</p>
            )}
          </div>
        </section>

        {/* Localisation & Points d'Intérêt */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4">
            <motion.h2 
              className="text-4xl font-light text-primary mb-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Localisation
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                className="rounded-lg overflow-hidden shadow-md"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <img 
                  src={project.map_image || 'https://picsum.photos/800/400'}
                  alt="Carte du projet"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
              <div className="space-y-4">
                <motion.h3
                  className="text-2xl font-medium"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  Points d'Intérêt
                </motion.h3>
                {(project.interests || []).map((interest: any, index) => (
                  <motion.div
                    key={index}
                    className="p-4 bg-card rounded-lg border border-border/50 hover:border-primary/50 transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="flex justify-between">
                      <span>{interest.name}</span>
                      <ExternalLink className="w-4 h-4 text-primary cursor-pointer" onClick={() => window.open(interest.link, '_blank')} />
                    </div>
                    <p className="text-sm text-muted-foreground">{interest.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Informations Techniques */}
        <section className="py-16 bg-background">
          <div className="max-w-4xl mx-auto px-4">
            <motion.h2 
              className="text-4xl font-light text-primary mb-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Informations Techniques
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                className="p-6 bg-card rounded-lg border border-border/50"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-xl font-medium mb-2">Type</h3>
                <p>{project.type}</p>
              </motion.div>
              <motion.div 
                className="p-6 bg-card rounded-lg border border-border/50"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h3 className="text-xl font-medium mb-2">Date de Livraison</h3>
                <p>{project.completion_date}</p>
              </motion.div>
              <motion.div 
                className="p-6 bg-card rounded-lg border border-border/50"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="text-xl font-medium mb-2">État Meublé</h3>
                <p>{project.furniture_status}</p>
              </motion.div>
              <motion.div 
                className="p-6 bg-card rounded-lg border border-border/50"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className="text-xl font-medium mb-2">Habitabilité</h3>
                <p>{project.livability ? 'Oui' : 'Non'}</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-primary text-primary-foreground text-center">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              className="text-4xl font-light mb-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Intéressé par ce projet ?
            </motion.h2>
            <Button
              variant="secondary"
              className="bg-background text-primary hover:bg-background/90"
              asChild
            >
              <Link to="/contact">
                Nous Contacter
                <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default ProjectDetail;