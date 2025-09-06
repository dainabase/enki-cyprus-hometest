import { useState, lazy, Suspense, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import { useSpring as useReactSpring, animated, config } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Property } from '@/lib/supabase';
import { useSupabaseProperties } from '@/hooks/useSupabaseProperties';
import { useDebounce } from '@/hooks/useDebounce';
import { ScrollRevealText, ScrollRevealParagraph } from '@/components/ui/ScrollRevealText';
import { 
  Search, MapPin, TrendingUp, Brain, Shield, Award, 
  Star, Download, Save, Eye, Heart, ArrowRight, Building,
  Trophy, Briefcase, Target, ExternalLink, Clock, Sparkles, 
  ChevronLeft, ChevronRight, Play, Zap, Compass, Globe,
  FolderOpen, Cpu, ShieldCheck, Lightbulb, BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import cyprusHero from '@/assets/cyprus-hero.jpg';
import ErrorBoundary from '@/components/ErrorBoundary';
import { SEOHead } from '@/components/SEOHead';
import { trackPageView, trackCustomEvent } from '@/lib/analytics';
import PropertyCard from '@/components/ui/PropertyCard';
import PropertyModal from '@/components/PropertyModal';
import { useIsClient } from '@/hooks/useIsClient';

gsap.registerPlugin(ScrollTrigger);

const GoogleMapComponent = lazy(() => import('@/components/GoogleMap'));

// useIsClient moved to '@/hooks/useIsClient'
// 3D Background Sphere Component
const BackgroundSphere = () => (
  <Float speed={1.4} rotationIntensity={1} floatIntensity={2}>
    <Sphere args={[1, 100, 200]} scale={2.4}>
      <MeshDistortMaterial
        color="#1E3A8A"
        attach="material"
        distort={0.3}
        speed={1.5}
        roughness={0}
      />
    </Sphere>
  </Float>
);

// Physics-based 3D Carousel Component
const Advanced3DCarousel = ({ properties, interests, onInterestClick }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const background = useTransform(x, [-100, 0, 100], ['#ff008c', '#7700ff', '#1E3A8A']);
  
  const [springProps, springApi] = useReactSpring(() => ({
    rotation: 0,
    scale: 1,
    config: config.wobbly
  }));

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % properties.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [properties.length, isAutoPlaying]);

  const isClient = useIsClient();

  const bind = useDrag(({ down, movement: [mx], direction: [xDir], distance, cancel }) => {
    const distanceValue = Array.isArray(distance) ? Math.abs(distance[0]) : Math.abs(distance);
    if (distanceValue > 100) {
      setCurrentIndex(prev => 
        xDir > 0 ? (prev - 1 + properties.length) % properties.length 
                 : (prev + 1) % properties.length
      );
      cancel && cancel();
    }
    x.set(down ? mx : 0);
  });

  const handleSlideChange = (index: number) => {
    setCurrentIndex(index);
    springApi.start({ 
      rotation: (index - currentIndex) * 360,
      scale: 1.1,
      config: config.gentle
    });
    setTimeout(() => springApi.start({ scale: 1 }), 300);
  };

  if (!properties.length) return null;

  return (
    <motion.div 
      className="relative w-full h-[80vh] overflow-hidden perspective-2000"
      style={{ background }}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
      
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 opacity-30">
        <ErrorBoundary fallback={null}>
          {isClient && (
            <Canvas camera={{ position: [0, 0, 5] }}>
              <ambientLight intensity={0.4} />
              <pointLight position={[10, 10, 10]} />
              <BackgroundSphere />
              <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
          )}
        </ErrorBoundary>
      </div>

      {/* Main Carousel Container */}
      <div 
        ref={carouselRef}
        className="relative w-full h-full flex items-center justify-center transform-gpu preserve-3d"
      >
        {properties.map((property: Property, index: number) => {
          const offset = (index - currentIndex + properties.length) % properties.length;
          const isActive = index === currentIndex;
          const isAdjacent = offset === 1 || offset === properties.length - 1;
          
          if (!isActive && !isAdjacent) return null;

          const translateZ = isActive ? 0 : -200;
          const rotateY = isActive ? 0 : offset === 1 ? 45 : -45;
          const scale = isActive ? 1 : 0.8;
          const opacity = isActive ? 1 : 0.6;

          const locationKey = typeof property.location === 'string' 
            ? property.location.toLowerCase() 
            : (property.location as any)?.city?.toLowerCase() || 'limassol';
          const propertyInterests = interests[locationKey] || interests['limassol'] || [];

          return (
            <motion.div
              key={property.id}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
              initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
              animate={{ 
                opacity,
                scale,
                rotateY,
                z: translateZ,
                transition: { 
                  type: "spring", 
                  stiffness: 100, 
                  damping: 30,
                  duration: 0.8 
                }
              }}
              whileHover={{ 
                scale: isActive ? 1.02 : 0.82,
                transition: { duration: 0.3 }
              }}
              style={{ zIndex: isActive ? 10 : 5 }}
            >
              <Card className="mx-auto max-w-7xl h-[70vh] shadow-2xl overflow-hidden bg-gradient-to-br from-background/95 to-background/85 backdrop-blur-xl border border-white/20">
                <CardContent className="p-0 h-full flex flex-col lg:flex-row">
                  {/* Property Image with Parallax */}
                  <motion.div 
                    className="lg:w-2/3 relative overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <motion.img
                      src={property.photos?.[0] || `https://picsum.photos/1200x800?random=${property.id}`}
                      alt={property.title}
                      className="w-full h-64 lg:h-full object-cover"
                      loading="lazy"
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                    
                    {/* Animated Overlay Layers */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                    />
                    
                    {/* Floating Property Info */}
                    <motion.div
                      className="absolute bottom-8 left-8 text-white"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                    >
                      <motion.div
                        className="mb-4 inline-block"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <div className="px-4 py-2 bg-primary/90 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
                          {property.type}
                        </div>
                      </motion.div>
                      
                      <motion.h3 
                        className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                      >
                        {property.title}
                      </motion.h3>
                      
                      <motion.div 
                        className="flex items-center gap-3 mb-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1, duration: 0.6 }}
                      >
                        <MapPin className="w-5 h-5 text-blue-300" />
                        <span className="text-lg text-blue-100">
                          {typeof property.location === 'string' 
                            ? property.location 
                            : (property.location as any)?.city || property.location}
                        </span>
                      </motion.div>
                      
                      <motion.div 
                        className="text-3xl lg:text-4xl font-bold text-yellow-400"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.2, duration: 0.6, type: "spring" }}
                      >
                        {property.price}
                      </motion.div>
                    </motion.div>

                    {/* Floating Action Buttons */}
                    <motion.div
                      className="absolute top-6 right-6 flex gap-3"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.4, duration: 0.6, type: "spring" }}
                    >
                      <motion.button
                        className="p-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/20 text-white hover:bg-white/30 transition-all"
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Heart className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        className="p-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/20 text-white hover:bg-white/30 transition-all"
                        whileHover={{ scale: 1.1, rotate: -10 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Eye className="w-5 h-5" />
                      </motion.button>
                    </motion.div>
                  </motion.div>

                  {/* Interactive Interests Sidebar */}
                  <motion.div 
                    className="lg:w-1/3 p-8 bg-gradient-to-br from-background via-muted/20 to-background backdrop-blur-xl border-l border-white/10"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.6 }}
                    >
                      <h4 className="text-xl font-bold mb-6 flex items-center gap-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Compass className="w-6 h-6 text-primary" />
                        </motion.div>
                        Centres d'Intérêt
                      </h4>
                    </motion.div>
                    
                    <div className="space-y-4">
                      {propertyInterests.map((interest: any, idx: number) => (
                        <motion.button
                          key={idx}
                          onClick={() => {
                            onInterestClick(interest);
                            trackCustomEvent('interests_clicked', { 
                              name: interest.name, 
                              link: interest.link,
                              property_id: property.id 
                            });
                          }}
                          className="w-full group relative"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.9 + idx * 0.1, duration: 0.6 }}
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="p-4 rounded-xl border border-border/50 hover:border-primary/50 bg-gradient-to-r from-background/50 to-muted/30 backdrop-blur-sm transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 text-left">
                                <motion.h5 
                                  className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 1.1 + idx * 0.1 }}
                                >
                                  {interest.name}
                                </motion.h5>
                                <motion.p 
                                  className="text-xs text-muted-foreground line-clamp-2"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 1.2 + idx * 0.1 }}
                                >
                                  {interest.desc}
                                </motion.p>
                              </div>
                              <motion.div
                                className="flex-shrink-0"
                                whileHover={{ rotate: 45, scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 400 }}
                              >
                                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                              </motion.div>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-6">
        <motion.button
          onClick={() => handleSlideChange((currentIndex - 1 + properties.length) % properties.length)}
          className="p-4 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white hover:bg-white/20 transition-all"
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>

        <div className="flex gap-3">
          {properties.map((_: any, index: number) => (
            <motion.button
              key={index}
              onClick={() => handleSlideChange(index)}
              className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white border-white scale-125' 
                  : 'bg-transparent border-white/50 hover:border-white/80'
              }`}
              whileHover={{ scale: index === currentIndex ? 1.3 : 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        <motion.button
          onClick={() => handleSlideChange((currentIndex + 1) % properties.length)}
          className="p-4 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white hover:bg-white/20 transition-all"
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </div>
    </motion.div>
  );
};

// Interface for project interests
interface ProjectInterest {
  name: string;
  link: string;
  desc: string;
}

const Home = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agenticQuery, setAgenticQuery] = useState('');
  const [consent, setConsent] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const { scrollY } = useScroll();
  const isClient = useIsClient();
  const enable3D = false; // temporary: disable 3D to fix blank page
  
  // Advanced Parallax transforms (reduce shift, increase scale to prevent background gap)
  const heroY = useTransform(scrollY, [0, 600], [0, -120]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.85]);
  const heroScale = useTransform(scrollY, [0, 600], [1.1, 1.2]);
  
  // Debounce search query for performance
  const debouncedQuery = useDebounce(agenticQuery, 300);
  
  // Load properties from Supabase
  const { properties, loading, error } = useSupabaseProperties();
  
  // Memoized property selections for performance
  const { featuredProperties, latestProperties } = useMemo(() => ({
    featuredProperties: properties.slice(0, 3),
    latestProperties: properties.slice(3, 8)
  }), [properties]);

  // Simplified interests data - removed unused data
  const cyprusInterests: Record<string, ProjectInterest[]> = {
    'limassol': [
      { name: 'Limassol Marina', link: 'https://www.limassolmarina.com/', desc: 'Luxury yacht harbor' }
    ]
  };

  useEffect(() => {
    trackPageView('/', 'Accueil - ENKI-REALTY Immobilier Premium Chypre');
    trackCustomEvent('home_viewed', { user_authenticated: !!isAuthenticated });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [isAuthenticated]);

  // Agentic Search Mutation
  const agenticSearchMutation = useMutation({
    mutationFn: async ({ query, consent }: { query: string; consent: boolean }) => {
      const { data, error } = await supabase.functions.invoke('agentic-search', {
        body: { query, consent }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setSearchResults(data);
      setShowResultsModal(true);
      toast({
        title: "Recherche complétée",
        description: `${data.properties?.length || 0} propriétés trouvées avec analyse fiscale`,
      });
      trackCustomEvent('agentic_search_completed', {
        query_length: agenticQuery.length,
        properties_found: data.properties?.length || 0,
        has_auth: !!isAuthenticated
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la recherche. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  });

  // Save Dossier Mutation
  const saveDossierMutation = useMutation({
    mutationFn: async (dossierData: any) => {
      const { data, error } = await supabase
        .from('dossiers')
        .insert({
          user_id: user?.id,
          title: `Recherche - ${new Date().toLocaleDateString()}`,
          query: agenticQuery,
          lexaia_outputs: dossierData,
          biens: dossierData.properties?.map((p: any) => p.id) || []
        });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Dossier sauvegardé",
        description: "Votre recherche a été sauvegardée dans votre espace personnel",
      });
    }
  });

  const handleAgenticSearch = () => {
    if (!agenticQuery.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez décrire votre projet immobilier",
        variant: "destructive"
      });
      return;
    }

    if (!consent) {
      toast({
        title: "Consentement requis",
        description: "Veuillez accepter le traitement de vos données",
        variant: "destructive"
      });
      return;
    }

    trackCustomEvent('search_submitted', { query_length: agenticQuery.length });
    agenticSearchMutation.mutate({ query: agenticQuery, consent });
  };

  const handleDownloadPDF = () => {
    if (searchResults?.pdf_url) {
      window.open(searchResults.pdf_url, '_blank');
      trackCustomEvent('pdf_downloaded', { source: 'agentic_search' });
    }
  };

  const handleSaveDossier = () => {
    if (searchResults && isAuthenticated) {
      saveDossierMutation.mutate(searchResults);
    } else {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour sauvegarder votre recherche",
        variant: "destructive"
      });
    }
  };

  const handleInterestClick = (interest: ProjectInterest) => {
    trackCustomEvent('interests_clicked', { name: interest.name, link: interest.link });
    window.open(interest.link, '_blank');
  };

  const features = [
    {
      icon: TrendingUp,
      title: 'Commissions 5%',
      description: 'Commissions transparentes et compétitives pour tous nos services immobiliers premium',
      badge: 'Transparent',
      gradient: 'from-primary to-primary-hover'
    },
    {
      icon: Brain,
      title: 'Optimisation fiscale AI',
      description: 'Intelligence artificielle avancée pour maximiser vos avantages fiscaux',
      badge: 'AI Powered',
      gradient: 'from-primary to-primary-hover'
    },
    {
      icon: Shield,
      title: 'Expertise locale',
      description: 'Connaissance approfondie du marché immobilier chypriote depuis plus de 15 ans',
      badge: 'Expert',
      gradient: 'from-primary to-primary-hover'
    },
    {
      icon: Award,
      title: 'Service premium',
      description: 'Accompagnement VIP personnalisé de A à Z dans votre projet d\'investissement',
      badge: 'Premium',
      gradient: 'from-primary to-primary-hover'
    }
  ];

  return (
    <>
      <SEOHead 
        title="Découvrez les Meilleurs Projets Immobiliers à Chypre | ENKI-REALTY"
        description="Plateforme immobilière premium à Chypre. Recherche agentique, optimisation fiscale AI, propriétés d'exception. Investissement sécurisé avec ENKI-REALTY."
        keywords="immobilier chypre, investissement chypre, propriétés premium, recherche agentique, optimisation fiscale, appartements villas penthouses"
        url="https://enki-realty.com/"
        canonical="https://enki-realty.com/"
        image="/og-image.jpg"
      />
      
      <div className="min-h-screen overflow-x-hidden">
        {/* Hero Section - Updated selon spécifications */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Background Layers */}
          <motion.div 
            style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
            className="absolute inset-0 z-0"
          >
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat filter"
              style={{ backgroundImage: `url(${cyprusHero})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/50 via-primary/20 to-accent/30" />
          </motion.div>

          {/* 3D Particles Background */}
          {enable3D && (
            <div className="absolute inset-0 opacity-20">
            <ErrorBoundary fallback={null}>
              {isClient && (
                <Canvas camera={{ position: [0, 0, 5] }}>
                  <ambientLight intensity={0.4} />
                  <pointLight position={[10, 10, 10]} />
                  <Float speed={2} rotationIntensity={1} floatIntensity={2}>
                    <Sphere args={[0.1, 16, 16]} position={[-4, -2, -1]}>
                      <MeshDistortMaterial color="#ffffff" distort={0.2} speed={2} />
                    </Sphere>
                  </Float>
                  <Float speed={1.5} rotationIntensity={2} floatIntensity={1}>
                    <Sphere args={[0.15, 16, 16]} position={[4, 2, -2]}>
                      <MeshDistortMaterial color="#60A5FA" distort={0.3} speed={1.5} />
                    </Sphere>
                  </Float>
                  <Float speed={1.8} rotationIntensity={1.5} floatIntensity={3}>
                    <Sphere args={[0.08, 16, 16]} position={[0, 3, -1]}>
                      <MeshDistortMaterial color="#34D399" distort={0.4} speed={2.5} />
                    </Sphere>
                  </Float>
                </Canvas>
              )}
            </ErrorBoundary>
          </div>
          )}

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
              className="space-y-12"
            >
              {/* Titre principal - NE PAS TOUCHER */}
              <motion.h1 
                className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight"
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              >
                <motion.span
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  Découvrez les
                </motion.span>
                <br />
                <motion.span 
                  className="block text-transparent bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  Meilleurs Projets
                </motion.span>
                <motion.span
                  className="block text-transparent bg-gradient-to-r from-cyan-300 via-blue-300 to-white bg-clip-text"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                >
                  Immobiliers à Chypre
                </motion.span>
              </motion.h1>

              {/* Nouveau sous-titre selon spécifications */}
              <motion.p 
                className="font-inter font-medium text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
              >
                La nouvelle expérience de l'investissement immobilier
              </motion.p>

              {/* CTA subtil pour scroll vers section suivante */}
              <motion.div 
                className="flex justify-center items-center mt-16"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.6, ease: "easeOut" }}
              >
                <Button
                  className="bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => document.getElementById('why-enki')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Découvrez Pourquoi Nous Choisir
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
          >
            <motion.div 
              className="w-7 h-11 border-2 border-white/70 rounded-full flex items-start justify-center backdrop-blur-sm"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div 
                className="w-1.5 h-1.5 bg-white rounded-full mt-1.5"
                animate={{ y: [0, 12, 0], opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        </section>

        {/* Section "Pourquoi Choisir ENKI Realty ?" */}
        <motion.section 
          id="why-enki"
          className="bg-background py-40 md:py-50 px-4 md:px-8 relative overflow-hidden"
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          {/* Parallax background overlay */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"
            initial={{ y: -50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            viewport={{ once: true }}
          />
          
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Titre section amélioré */}
            <motion.h2 
              className="text-5xl md:text-7xl font-bold text-primary text-center mb-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              Pourquoi choisir ENKI Realty ?
            </motion.h2>

            {/* Texte intro premium */}
            <motion.p 
              className="text-xl text-muted-foreground max-w-4xl mx-auto text-center mb-20 leading-relaxed font-light"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Une expérience d'investissement immobilier redéfinie, alliant expertise, technologie de pointe et service d'excellence pour des résultats exceptionnels.
            </motion.p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto">
              {[
                {
                  icon: (
                    <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                  title: "Sélection rigoureuse",
                  description: "Tous les projets des promoteurs les plus fiables réunis en un seul endroit, soigneusement sélectionnés pour leur qualité et leur sérieux.",
                  gradient: "from-blue-500/10 to-indigo-500/10"
                },
                {
                  icon: (
                    <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  ),
                  title: "Recherche intelligente",
                  description: "Une IA qui comprend vos besoins et vous propose les biens les plus adaptés, sans perte de temps ni recherche complexe.",
                  gradient: "from-purple-500/10 to-pink-500/10"
                },
                {
                  icon: (
                    <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  ),
                  title: "Optimisation fiscale",
                  description: "En un clic, obtenez des scénarios personnalisés pour maximiser votre rentabilité et protéger votre patrimoine, avec des réponses immédiates et concrètes.",
                  gradient: "from-emerald-500/10 to-teal-500/10"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="relative group bg-secondary border border-border/50 rounded-3xl p-8 lg:p-10 hover:border-primary/30 transition-all duration-500 overflow-hidden cursor-pointer"
                  initial={{ 
                    opacity: 0, 
                    y: 60,
                    scale: 0.95 
                  }}
                  whileInView={{ 
                    opacity: 1, 
                    y: 0,
                    scale: 1,
                    transition: {
                      duration: 0.7,
                      delay: index * 0.2,
                      ease: [0.21, 0.47, 0.32, 0.98]
                    }
                  }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    y: -8,
                    scale: 1.02,
                    transition: { 
                      type: "spring", 
                      damping: 20,
                      stiffness: 300
                    }
                  }}
                  onClick={() => {
                    if (index === 0) {
                      // Sélection rigoureuse -> Projets Vedette
                      document.getElementById('featured-projects')?.scrollIntoView({ behavior: 'smooth' });
                    } else if (index === 1) {
                      // Recherche intelligente -> Commencer l'Expérience
                      document.getElementById('start-experience')?.scrollIntoView({ behavior: 'smooth' });
                    } else if (index === 2) {
                      // Optimisation fiscale -> Page LEXAIA
                      window.location.href = '/lexaia';
                    }
                  }}
                >
                  {/* Premium background overlays pour les blocs */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/15"
                    initial={{ opacity: 0, scale: 1.1 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 2 }}
                    viewport={{ once: true }}
                  />
                  <motion.div 
                    className="absolute top-1/4 right-1/4 w-32 h-32 bg-primary/5 rounded-full blur-2xl"
                    animate={{ 
                      x: [0, 20, -20, 0],
                      y: [0, -10, 10, 0],
                    }}
                    transition={{ 
                      duration: 15,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  {/* Effet de brillance au survol */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl z-10"></div>
                  
                  {/* Icône premium */}
                  <motion.div 
                    className="mb-8 flex justify-center lg:justify-start relative z-20"
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 5,
                      transition: { 
                        type: "spring", 
                        damping: 15 
                      }
                    }}
                  >
                    {item.icon}
                  </motion.div>
                  
                  {/* Titre */}
                  <h3 className="font-bold text-lg lg:text-xl xl:text-2xl text-primary mb-6 leading-tight text-center lg:text-left whitespace-nowrap relative z-20">
                    {item.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-lg text-muted-foreground leading-relaxed text-center lg:text-left font-light relative z-20">
                    {item.description}
                  </p>
                  
                  {/* Ligne décorative */}
                  <motion.div 
                    className="absolute bottom-0 left-8 right-8 h-0.5 bg-gradient-to-r from-primary/20 via-primary/60 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                  ></motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Section "Commencer l'Expérience" */}
        <motion.section 
          id="start-experience"
          className="bg-secondary py-40 md:py-50 px-4 md:px-8 relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          viewport={{ once: true }}
        >
          {/* Premium background overlays */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/15"
            initial={{ opacity: 0, scale: 1.1 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2 }}
            viewport={{ once: true }}
          />
          <motion.div 
            className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
            animate={{ 
              x: [0, 50, -50, 0],
              y: [0, -30, 30, 0],
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Titre section unique - même taille que "Pourquoi choisir ENKI Realty" */}
            <motion.h2 
              className="text-5xl md:text-7xl font-bold text-primary text-center mb-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Commencer l'Expérience
            </motion.h2>

            {/* Texte intro unique */}
            <motion.p 
              className="text-lg text-muted-foreground max-w-3xl mx-auto text-center mb-12 leading-loose"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Démarrez votre recherche personnalisée assistée par IA et découvrez les propriétés qui correspondent parfaitement à vos critères et vos rêves.
            </motion.p>

            {/* Recherche agentique avec animations époustouflantes */}
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1, 
                delay: 0.6, 
                type: "spring",
                damping: 15 
              }}
              viewport={{ once: true }}
            >
              {/* Textarea container avec hover glow */}
              <motion.div
                className="relative group"
                whileHover={{
                  scale: 1.02,
                  transition: { 
                    type: "spring", 
                    damping: 15 
                  }
                }}
              >
                {/* Glow effect on hover */}
                <motion.div
                  className="absolute -inset-2 z-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={{ scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                />
                
                
                <motion.div
                  className="relative z-10 bg-white rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden"
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Zone de saisie style chat */}
                  <div className="p-6">
                    <Textarea
                      value={agenticQuery}
                      onChange={(e) => setAgenticQuery(e.target.value)}
                      placeholder="Décrivez votre projet : ex. 'Français, budget 500k €, appartement près de la mer à Chypre – options fiscales pour optimisation rentabilité ?'"
                      className="w-full border-0 bg-transparent resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[120px] text-gray-800 placeholder:text-gray-500 text-lg leading-relaxed"
                      sanitize={false}
                    />
                    
                    {/* Barre d'actions en bas */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-100">
                        <label htmlFor="consent" className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                          <input
                            id="consent"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300"
                            checked={consent}
                            onChange={(e) => setConsent(e.currentTarget.checked)}
                          />
                          <span>J'accepte que mes données soient utilisées pour générer des recommandations personnalisées</span>
                        </label>
                        <motion.button
                          className="px-8 py-3 bg-primary text-white rounded-lg text-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!agenticQuery.trim() || !consent}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleAgenticSearch}
                        >
                          Lancer la Recherche
                        </motion.button>
                      </div>
                  </div>
                </motion.div>
              </motion.div>
              

            </motion.div>
          </div>
        </motion.section>

        {/* Section KPIs Marché Immobilier - Style Framer Template */}
        <motion.section 
          id="market-kpis"
          className="bg-background py-32 md:py-40 px-4 md:px-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto">
            {/* Grid des KPIs en style bubble comme Framer - SANS les cercles */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, staggerChildren: 0.2 }}
              viewport={{ once: true }}
            >
              {[
                {
                  number: "+6,5%",
                  title: "Appréciation annuelle des prix immobiliers",
                  subtitle: "",
                  source: "Sources : <a href='https://www.globalpropertyguide.com/Europe/Cyprus/Price-History' target='_blank' class='text-foreground/70 hover:text-primary hover:underline transition-colors'>Global Property Guide</a> · <a href='https://www.ceicdata.com/en/indicator/cyprus/house-prices-growth' target='_blank' class='text-foreground/70 hover:text-primary hover:underline transition-colors'>CEIC Data</a>"
                },
                {
                  number: "23,9K", 
                  title: "Transactions immobilières en 2024",
                  subtitle: "",
                  source: "Sources : <a href='https://www.pwc.com.cy/en/publications/cyprus-real-estate-market-review.html' target='_blank' class='text-foreground/70 hover:text-primary hover:underline transition-colors'>PwC Cyprus Real Estate Market Review</a> · <a href='https://cyprus-mail.com/' target='_blank' class='text-foreground/70 hover:text-primary hover:underline transition-colors'>Cyprus Mail</a>"
                },
                {
                  number: "70%",
                  title: "Taux d'occupation locative", 
                  subtitle: "",
                  source: "Sources : <a href='https://airbtics.com/' target='_blank' class='text-foreground/70 hover:text-primary hover:underline transition-colors'>Airbtics</a> · <a href='https://investropa.com/' target='_blank' class='text-foreground/70 hover:text-primary hover:underline transition-colors'>Investropa</a>"
                },
                {
                  number: "4,75%",
                  title: "Rendement locatif brut moyen",
                  subtitle: "",
                  source: "Sources : <a href='https://www.globalcitizensolutions.com/' target='_blank' class='text-foreground/70 hover:text-primary hover:underline transition-colors'>Global Citizens Solutions</a> · <a href='https://www.rics.org/cyprus/' target='_blank' class='text-foreground/70 hover:text-primary hover:underline transition-colors'>RICS Cyprus</a> · <a href='https://www.globalpropertyguide.com/Europe/Cyprus' target='_blank' class='text-foreground/70 hover:text-primary hover:underline transition-colors'>Global Property Guide</a>"
                }
              ].map((kpi, index) => (
                <motion.div
                  key={index}
                  className="text-center group"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.2,
                    type: "spring",
                    damping: 20
                  }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { 
                      type: "spring", 
                      damping: 15 
                    }
                  }}
                  onViewportEnter={() => {
                    trackCustomEvent('kpi_viewed', { 
                      title: kpi.title,
                      number: kpi.number,
                      index 
                    });
                  }}
                >
                  {/* Large number SANS cercle */}
                  <motion.div
                    className="text-6xl md:text-7xl font-bold text-primary mb-6"
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      duration: 1.5,
                      delay: index * 0.2 + 0.5,
                      ease: "easeOut",
                      type: "spring",
                      damping: 15
                    }}
                    viewport={{ once: true }}
                  >
                    {kpi.number}
                  </motion.div>
                  
                  {/* Title */}
                  <motion.h3 
                    className="text-xl md:text-2xl font-bold text-foreground mb-3"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.2 + 0.7
                    }}
                    viewport={{ once: true }}
                  >
                    {kpi.title}
                  </motion.h3>
                  
                  {/* Subtitle */}
                  <motion.p 
                    className="text-muted-foreground leading-relaxed max-w-xs mx-auto mb-3"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.2 + 0.9
                    }}
                    viewport={{ once: true }}
                  >
                    {kpi.subtitle}
                  </motion.p>

                  {/* Source si elle existe */}
                  {kpi.source && (
                    <motion.div 
                      className="text-xs"
                      dangerouslySetInnerHTML={{ __html: kpi.source }}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: index * 0.2 + 1.1
                      }}
                      viewport={{ once: true }}
                    />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Premium Video Section */}
        <motion.section 
          id="premium-video" 
          className="py-0 bg-secondary w-full h-[60vh] relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="w-full h-full relative"
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <video 
              className="w-full h-full object-cover absolute inset-0"
              autoPlay 
              muted 
              loop
              playsInline
              poster="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&fit=crop&auto=format"
              onLoadStart={() => {
                trackCustomEvent('video_viewed', { 
                  section: 'premium-video',
                  type: 'hero'
                });
              }}
            >
              <source src="https://videos.pexels.com/video-files/2507016/2507016-uhd_2560_1440_25fps.mp4" type="video/mp4" />
              <source src="https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
           
          <motion.div 
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
           
          <motion.div 
            className="absolute inset-0 flex items-center justify-center text-white text-4xl md:text-6xl font-bold text-center px-6"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          >
            Experience Timeless Elegance, Premium Living in your Dream Home
          </motion.div>
        </motion.section>

        {/* Section Projets Vedette */}
        <section id="featured-projects" className="py-32 md:py-40 bg-gradient-to-br from-muted/30 to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <motion.h2 
                className="text-5xl md:text-7xl font-bold text-primary mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Projets Vedette
              </motion.h2>
              <motion.p 
                className="text-lg text-muted-foreground max-w-3xl mx-auto leading-loose"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Découvrez notre sélection exclusive de programmes immobiliers d'exception, choisies pour leur emplacement privilégié, leur architecture remarquable et leur potentiel d'investissement.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  id: 1,
                  name: "Résidence Marina Bay",
                  image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop&auto=format",
                  priceFrom: "€250,000",
                  location: "Limassol Marina",
                  description: "Résidence de luxe en bord de mer avec vue panoramique sur la Marina. Architecture moderne et finitions haut de gamme.",
                  features: ["Vue mer", "Piscine privée", "Parking", "Centre-ville"]
                },
                {
                  id: 2,
                  name: "Les Jardins de Paphos",
                  image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop&auto=format",
                  priceFrom: "€180,000",
                  location: "Paphos",
                  description: "Programme résidentiel dans un cadre verdoyant, proche des sites historiques de Paphos. Idéal pour investissement locatif.",
                  features: ["Piscine commune", "Jardins paysagers", "Centre-ville", "Proche plages"]
                },
                {
                  id: 3,
                  name: "Cyprus Heights",
                  image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop&auto=format",
                  priceFrom: "€320,000",
                  location: "Larnaca",
                  description: "Tours résidentielles modernes avec services hôteliers. Vue imprenable sur la côte et l'aéroport international.",
                  features: ["Vue mer", "Services hôteliers", "Parking", "Proche aéroport"]
                }
              ].map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group"
                >
                  <Card className="overflow-hidden bg-card border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <p className="text-sm font-medium">{project.priceFrom}</p>
                        <p className="text-xs opacity-90">À partir de</p>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-primary mb-2">{project.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {project.location}
                      </p>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        {project.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.features.map((feature, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                      
                      <Button 
                        className="w-full bg-gradient-to-r from-primary to-primary-hover hover:from-primary/90 hover:to-primary-hover/90 text-white"
                        onClick={() => {
                          trackCustomEvent('featured_project_clicked', { 
                            project_name: project.name,
                            project_location: project.location
                          });
                        }}
                      >
                        En savoir plus
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                 </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section Dernières Nouveautés */}
        <section className="py-32 md:py-40 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <motion.h2 
                className="text-5xl md:text-7xl font-bold text-primary mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Dernières Nouveautés
              </motion.h2>
              <motion.p 
                className="text-lg text-muted-foreground max-w-3xl mx-auto leading-loose"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Restez informé des dernières tendances du marché immobilier chypriote, des nouvelles réglementations et des opportunités d'investissement émergentes.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  id: 1,
                  title: "Penthouse 3 chambres",
                  location: "Nicosia",
                  price: "€450,000",
                  image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop&auto=format",
                  features: ["Terrasse panoramique", "Climatisation"],
                  description: "Magnifique penthouse avec vue imprenable sur la ville de Nicosia."
                },
                {
                  id: 2,
                  title: "Appartement 2 chambres",
                  location: "Limassol",
                  price: "€280,000",
                  image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop&auto=format",
                  features: ["Rénové", "Meublé", "Wifi inclus"],
                  description: "Appartement moderne entièrement rénové dans le centre de Limassol."
                },
                {
                  id: 3,
                  title: "Villa 4 chambres",
                  location: "Paphos",
                  price: "€650,000",
                  image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop&auto=format",
                  features: ["Piscine privée", "Jardin", "Garage"],
                  description: "Villa familiale avec piscine et jardin paysager dans un quartier calme."
                },
                {
                  id: 4,
                  title: "Studio moderne",
                  location: "Larnaca",
                  price: "€120,000",
                  image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop&auto=format",
                  features: ["Proche aéroport", "Balcon", "Meublé"],
                  description: "Studio contemporain idéal pour investissement locatif près de l'aéroport."
                },
                {
                  id: 5,
                  title: "Maison 3 chambres",
                  location: "Ayia Napa",
                  price: "€380,000",
                  image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop&auto=format",
                  features: ["Vue mer", "Terrasse", "Proche plage"],
                  description: "Maison familiale avec vue mer à quelques minutes des plages d'Ayia Napa."
                },
                {
                  id: 6,
                  title: "Duplex 2 chambres",
                  location: "Protaras",
                  price: "€325,000",
                  image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&h=400&fit=crop&auto=format",
                  features: ["Duplex", "Piscine commune", "Parking"],
                  description: "Duplex moderne dans résidence sécurisée avec piscine commune."
                }
              ].map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="h-full"
                >
                  <Card className="h-full flex flex-col overflow-hidden bg-card border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                        {property.price}
                      </div>
                    </div>
                    
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-primary mb-2">{property.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {property.location}
                      </p>
                      
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">
                        {property.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {property.features.map((feature, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                      
                      <Button 
                        className="w-full mt-auto bg-gradient-to-r from-primary to-primary-hover hover:from-primary/90 hover:to-primary-hover/90 text-white"
                        onClick={() => {
                          trackCustomEvent('latest_property_clicked', { 
                            property_title: property.title,
                            property_location: property.location
                          });
                        }}
                      >
                        Voir les détails
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button 
                asChild 
                size="lg"
                className="bg-gradient-to-r from-primary to-primary-hover hover:from-primary/90 hover:to-primary-hover/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link to="/search">
                  <Eye className="w-5 h-5 mr-2" />
                  Voir Toutes les Propriétés
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Section Témoignages */}
        <section className="py-32 md:py-40 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <motion.h2 
                className="text-5xl md:text-7xl font-bold text-primary mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Témoignages
              </motion.h2>
              <motion.p 
                className="text-lg text-muted-foreground max-w-3xl mx-auto leading-loose"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Découvrez les témoignages de nos clients satisfaits qui ont trouvé leur propriété de rêve grâce à ENKI Realty.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  id: 1,
                  name: "Marie Dubois",
                  location: "France",
                  photo: "https://images.unsplash.com/photo-1494790108755-2616b612b193?w=100&h=100&fit=crop&auto=format",
                  rating: 5,
                  comment: "L'IA de recherche automatisée d'ENKI Realty a analysé mon profil et m'a proposé exactement le type de villa que je cherchais à Limassol. En 48h j'avais ma sélection parfaite !"
                },
                {
                  id: 2,
                  name: "Thomas Wagner",
                  location: "Allemagne",
                  photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&auto=format",
                  rating: 5,
                  comment: "Grâce à leur agent fiscal IA, j'ai pu optimiser mon montage d'entreprise à Chypre et réduire ma fiscalité de 40%. Un accompagnement sur-mesure exceptionnel."
                },
                {
                  id: 3,
                  name: "Sarah Johnson",
                  location: "Royaume-Uni",
                  photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&auto=format",
                  rating: 5,
                  comment: "L'obtention de ma résidence chypriote s'est faite en un temps record grâce à leur IA conseil. Toutes les démarches ont été automatisées et simplifiées."
                },
                {
                  id: 4,
                  name: "Marco Rossi",
                  location: "Italie",
                  photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format",
                  rating: 5,
                  comment: "La recherche automatisée a parfaitement cerné mon profil d'investisseur. Le montage fiscal proposé par leur IA m'a fait économiser des milliers d'euros."
                },
                {
                  id: 5,
                  name: "Anna Petrov",
                  location: "Russie",
                  photo: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&auto=format",
                  rating: 5,
                  comment: "Leur agent fiscal IA a structuré mon montage d'entreprise offshore de façon optimale. La recherche de propriétés s'est adaptée automatiquement à mes besoins."
                },
                {
                  id: 6,
                  name: "David Chen",
                  location: "Singapour",
                  photo: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&auto=format",
                  rating: 5,
                  comment: "L'IA d'ENKI Realty a analysé mon profil fiscal et m'a guidé vers la résidence parfaite avec un montage d'entreprise sur-mesure. Technologie impressionnante !"
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <Card className="h-full bg-card border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 p-6">
                    <CardContent className="p-0">
                      <div className="flex items-center mb-4">
                        <img
                          src={testimonial.photo}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full mr-4 object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-primary">{testimonial.name}</h3>
                          <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                        </div>
                      </div>
                      
                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      
                      <blockquote className="text-muted-foreground italic leading-relaxed">
                        "{testimonial.comment}"
                      </blockquote>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Property Modal */}
        <AnimatePresence>
          {selectedProperty && isModalOpen && (
            <PropertyModal
              property={selectedProperty}
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setSelectedProperty(null);
              }}
            />
          )}
        </AnimatePresence>

        {/* Search Results Modal */}
        <AnimatePresence>
          {showResultsModal && searchResults && (
            <Dialog open={showResultsModal} onOpenChange={setShowResultsModal}>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Résultats de Recherche Agentique</DialogTitle>
                  <DialogDescription>
                    Analyse personnalisée basée sur votre demande
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  {searchResults.properties && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Propriétés Recommandées</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {searchResults.properties.map((property: Property) => (
                          <PropertyCard 
                            key={property.id} 
                            property={property}
                            onClick={() => {}} 
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {searchResults.analysis && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Analyse Fiscale</h3>
                      <div className="p-4 bg-muted rounded-lg">
                        <pre className="whitespace-pre-wrap text-sm">
                          {JSON.stringify(searchResults.analysis, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-4">
                    <Button onClick={handleDownloadPDF} disabled={!searchResults.pdf_url}>
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger PDF
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleSaveDossier}
                      disabled={!isAuthenticated}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Sauvegarder Dossier
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Home;