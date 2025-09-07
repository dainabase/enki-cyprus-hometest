import { useEffect } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, ArrowRight, Square, Bed, Bath, Car } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { SEOHead } from '@/components/SEOHead';
import { trackPageView } from '@/lib/analytics';
import Layout from '@/components/layout/Layout';

// Reusable card component to avoid calling hooks inside loops

type Section = { title: string; description: string; features: string[]; image: string };

const ScrollingCard = ({
  index,
  section,
  scrollYProgress,
}: {
  index: number;
  section: Section;
  scrollYProgress: MotionValue<number>;
}) => {
  const start = index / 3;
  const end = (index + 1) / 3;
  const progress = useTransform(scrollYProgress, [start, end], [0, 1]);
  const y = useTransform(progress, [0, 1], ['100vh', '0vh']);
  const opacity = useTransform(progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(progress, [0, 0.5, 1], [0.95, 1, 0.95]);
  const bgY = useTransform(progress, [0, 1], [0, -100]);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center p-8"
      style={{ y, opacity, scale }}
    >
      <div className="relative w-full max-w-4xl h-[80vh] rounded-3xl overflow-hidden shadow-2xl border border-border/50">
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${section.image})`,
            y: bgY,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
        </motion.div>

        <div className="relative z-10 h-full flex flex-col justify-end p-12 text-white">
          <motion.h3
            className="text-4xl font-light mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {section.title}
          </motion.h3>

          <motion.p
            className="mb-6 leading-relaxed text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {section.description}
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-2 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {section.features.map((feature: string, i: number) => (
              <Badge key={`feature-${index}-${i}`} className="bg-white/20 border-white/30 text-white">
                {feature}
              </Badge>
            ))}
          </motion.div>

          <Button asChild className="bg-white text-primary hover:bg-white/90 w-fit">
            <Link to="#contact">
              En Savoir Plus
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { scrollYProgress } = useScroll();

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

  if (isLoading) return (
    <Layout>
      <div className="text-center py-20 text-muted-foreground">Chargement du projet...</div>
    </Layout>
  );
  
  if (error || !project) return (
    <Layout>
      <div className="text-center py-20 text-destructive">Erreur de chargement du projet.</div>
    </Layout>
  );

  // Create 3 different views of the same project
  const projectSections = [
    {
      title: "Extérieur & Prestations",
      description: project.description || "Découvrez l'architecture moderne et les prestations exceptionnelles de ce projet unique.",
      features: project.features?.slice(0, 4) || ["Architecture moderne", "Matériaux premium", "Design contemporain", "Finitions haut de gamme"],
      image: project.photos?.[0] || `https://picsum.photos/1200/800?random=${project.id}1`
    },
    {
      title: "Équipements & Services",
      description: project.detailed_description || "Un ensemble d'équipements et services pensés pour votre confort au quotidien.",
      features: project.amenities?.slice(0, 4) || ["Parking sécurisé", "Espaces verts", "Salle de sport", "Concierge"],
      image: project.photos?.[1] || `https://picsum.photos/1200/800?random=${project.id}2`
    },
    {
      title: "Localisation & Environnement",
      description: `Idéalement situé ${typeof project.location === 'object' && project.location !== null ? (project.location as any).city || 'dans un cadre exceptionnel' : 'dans un cadre exceptionnel'}, ce projet offre un accès privilégié à tous les services.`,
      features: ["Transports à proximité", "Commerces", "Écoles", "Espaces de loisirs"],
      image: project.photos?.[2] || `https://picsum.photos/1200/800?random=${project.id}3`
    }
  ];

  const formatLocation = (location: any) => {
    if (typeof location === 'string') return location;
    if (typeof location === 'object' && location !== null) {
      return (location as any).city || (location as any).address || 'Localisation premium';
    }
    return 'Localisation premium';
  };

  return (
    <Layout>
      <SEOHead 
        title={`${project.title} | ENKI-REALTY`}
        description={project.description || 'Découvrez ce projet immobilier premium'}
        keywords={`projet immobilier ${project.title}, ${project.location}, investissement`}
        url={`https://enki-realty.com/project/${id}`}
        canonical={`https://enki-realty.com/project/${id}`}
        image={project.photos?.[0] || '/og-image.jpg'}
      />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${project.photos?.[0] || `https://picsum.photos/1920/1080?random=${project.id}`})`,
          }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60" />
        </motion.div>

        <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-4">
          <motion.p
            className="text-lg mb-4 opacity-90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {formatLocation(project.location)}
          </motion.p>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-light mb-8 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {project.title}
          </motion.h1>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Button className="bg-white text-black hover:bg-white/90 px-8 py-3">
              Découvrir Plus
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8 py-3">
              Nous Appeler
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Square, value: "3665", label: "Surface terrain", unit: "m²" },
              { icon: Bed, value: "8+", label: "Appartements", unit: "" },
              { icon: Bath, value: "4+", label: "Villas", unit: "" },
              { icon: Car, value: "2+", label: "Parkings", unit: "" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-card p-6 rounded-2xl text-center border border-border/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <stat.icon className="w-8 h-8 mx-auto mb-4 text-primary" />
                <div className="text-3xl font-light mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                {stat.unit && <div className="text-xs text-muted-foreground">{stat.unit}</div>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Scrolling Cards Section */}
      <section className="relative h-[300vh] bg-background">
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="absolute top-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-b border-border/50 text-center z-20">
            <h3 className="text-xl font-medium text-primary">Découverte du Projet</h3>
          </div>

          {projectSections.map((section, index) => (
            <ScrollingCard
              key={`section-${index}`}
              index={index}
              section={section}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </section>

      {/* Additional sections placeholder for later */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-light mb-8">Prochaines sections à venir</h2>
          <p className="text-muted-foreground">
            Plans, visite virtuelle, galerie 3D, vidéo de présentation, et formulaire de contact...
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default ProjectDetail;