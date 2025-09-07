import { useState, lazy, Suspense, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Property } from '@/lib/supabase';
import { useSupabaseProperties } from '@/hooks/useSupabaseProperties';
import { useDebounce } from '@/hooks/useDebounce';
import { Search, MapPin, Star, Download, Save, Eye, Heart, ArrowRight, ChevronLeft, ChevronRight, ExternalLink, Compass, Mic } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import cyprusHero from '@/assets/cyprus-hero.jpg';
import ErrorBoundary from '@/components/ErrorBoundary';
import { SEOHead } from '@/components/SEOHead';
import { trackPageView, trackCustomEvent } from '@/lib/analytics';
import PropertyCard from '@/components/ui/PropertyCard';
import OptimizedPropertyCard from '@/components/ui/OptimizedPropertyCard';
import Carousel3D from '@/components/ui/Carousel3D';
import PropertyModal from '@/components/PropertyModal';
import { useIsClient } from '@/hooks/useIsClient';
const GoogleMapComponent = lazy(() => import('@/components/GoogleMap'));
// Lazy-load 3D components only when needed
const Canvas = lazy(() => import('@react-three/fiber').then(mod => ({ default: mod.Canvas })));
const OrbitControls = lazy(() => import('@react-three/drei').then(mod => ({ default: mod.OrbitControls })));
const Sphere = lazy(() => import('@react-three/drei').then(mod => ({ default: mod.Sphere })));
const MeshDistortMaterial = lazy(() => import('@react-three/drei').then(mod => ({ default: mod.MeshDistortMaterial })));
const Float = lazy(() => import('@react-three/drei').then(mod => ({ default: mod.Float })));
// BackgroundSphere Component
const BackgroundSphere = () => (
  <Float speed={1.4} rotationIntensity={1} floatIntensity={2}>
    <Sphere args={[1, 100, 200]} scale={2.4}>
      <MeshDistortMaterial
        color="#0090E6" // Aligned with primary color
        attach="material"
        distort={0.3}
        speed={1.5}
        roughness={0}
      />
    </Sphere>
  </Float>
);
// Advanced3DCarousel Component
const Advanced3DCarousel = ({ properties, interests, onInterestClick }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const background = useTransform(x, [-100, 0, 100], ['#F0F7FD', '#F4F6F8', '#0090E6']); // Aligned with palette
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % properties.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [properties.length, isAutoPlaying]);
  const isClient = useIsClient();
  const handleSlideChange = (index: number) => {
    setCurrentIndex(index);
  };
  if (!properties.length) return <div className="text-center text-muted-foreground">Aucune propriété disponible</div>;
  return (
    <motion.div
      className="relative w-full h-[80vh] overflow-hidden perspective-2000"
      style={{ background }}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
     
      <Suspense fallback={null}>
        {isClient && (
          <ErrorBoundary fallback={null}>
            <Canvas camera={{ position: [0, 0, 5] }}>
              <ambientLight intensity={0.4} />
              <pointLight position={[10, 10, 10]} />
              <BackgroundSphere />
              <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
          </ErrorBoundary>
        )}
      </Suspense>
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
          const propertyInterests = interests[locationKey] || [];
          return (
            <motion.div
              key={property.id}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
              animate={{
                opacity,
                scale,
                rotateY,
                z: translateZ,
                transition: { type: "spring", stiffness: 100, damping: 30, duration: 0.8 }
              }}
              whileHover={{ scale: isActive ? 1.02 : 0.82, transition: { duration: 0.3 } }}
              style={{ zIndex: isActive ? 10 : 5 }}
            >
              <Card className="mx-auto max-w-7xl h-[70vh] shadow-2xl overflow-hidden bg-gradient-to-br from-background/95 to-background/85 backdrop-blur-xl border border-border/20">
                <CardContent className="p-0 h-full flex flex-col lg:flex-row">
                  <motion.div
                    className="lg:w-2/3 relative overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <motion.img
                      src={property.photos?.[0] || `https://picsum.photos/1200x800?random=${property.id}`}
                      alt={`Image of ${property.title} in ${property.location}`} // Enhanced alt text
                      className="w-full h-64 lg:h-full object-cover"
                      loading="lazy"
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                    />
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
                        className="text-3xl lg:text-4xl font-medium tracking-tight -0.01em mb-4 bg-gradient-to-r from-white to-accent bg-clip-text text-transparent"
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
                        <MapPin className="w-5 h-5 text-accent" />
                        <span className="text-lg text-accent">
                          {typeof property.location === 'string' ? property.location : (property.location as any)?.city || property.location}
                        </span>
                      </motion.div>
                      <motion.div
                        className="text-3xl lg:text-4xl font-bold text-success"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.2, duration: 0.6, type: "spring" }}
                      >
                        {property.price}
                      </motion.div>
                    </motion.div>
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
                        aria-label="Add to favorites"
                      >
                        <Heart className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        className="p-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/20 text-white hover:bg-white/30 transition-all"
                        whileHover={{ scale: 1.1, rotate: -10 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="View property details"
                      >
                        <Eye className="w-5 h-5" />
                      </motion.button>
                    </motion.div>
                  </motion.div>
                  <motion.div
                    className="lg:w-1/3 p-8 bg-gradient-to-br from-background via-muted/20 to-background backdrop-blur-xl border-l border-border/10"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.6 }}
                    >
                      <h4 className="text-xl font-medium tracking-tight -0.01em mb-6 flex items-center gap-3">
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
                          aria-label={`Explore ${interest.name}`}
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
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-6">
        <motion.button
          onClick={() => handleSlideChange((currentIndex - 1 + properties.length) % properties.length)}
          className="p-4 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white hover:bg-white/20 transition-all"
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Previous slide"
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
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <motion.button
          onClick={() => handleSlideChange((currentIndex + 1) % properties.length)}
          className="p-4 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white hover:bg-white/20 transition-all"
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Next slide"
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
  // Parallax transforms
  const heroY = useTransform(scrollY, [0, 600], [0, -100]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.9]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 1.1]);

  // Precompute floating particles once to avoid runtime errors from changing random props
  const floatingParticles = useMemo(() => (
    Array.from({ length: 20 }, () => ({
      radius: 0.05 + Math.random() * 0.1,
      position: [Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 5 - 2.5] as [number, number, number],
      speed: 1 + Math.random() * 2,
    }))
  ), []);
  
  const debouncedQuery = useDebounce(agenticQuery, 300);
  const { properties, loading, error } = useSupabaseProperties();
  // Dynamic interests fetch
  const { data: interests } = useQuery({
    queryKey: ['interests', properties],
    queryFn: async () => {
      const uniqueLocations = Array.from(new Set(properties.map((p: Property) =>
        typeof p.location === 'string' ? p.location.toLowerCase() : (p.location as any)?.city?.toLowerCase() || 'limassol'
      )));
      const interestsData: Record<string, ProjectInterest[]> = {};
      for (const location of uniqueLocations) {
        const { data } = await supabase.functions.invoke('fetch-interests', {
          body: { location }
        });
        interestsData[location] = data || [];
      }
      return interestsData;
    },
    enabled: !!properties.length,
  });
  // Use dynamic properties instead of hardcoded
  const featuredProperties = useMemo(() => properties.slice(0, 3), [properties]);
  const latestProperties = useMemo(() => properties.slice(3, 8), [properties]);
  useEffect(() => {
    trackPageView('/', 'Accueil - ENKI-REALTY Immobilier Premium Chypre');
    trackCustomEvent('home_viewed', { user_authenticated: !!isAuthenticated });
  }, [isAuthenticated]);
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
        variant: "default",
      });
      trackCustomEvent('agentic_search_completed', {
        query_length: agenticQuery.length,
        properties_found: data.properties?.length || 0,
        has_auth: !!isAuthenticated,
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la recherche. Veuillez réessayer.",
        variant: "destructive",
      });
    },
  });
  const saveDossierMutation = useMutation({
    mutationFn: async (dossierData: any) => {
      const { data, error } = await supabase
        .from('dossiers')
        .insert({
          user_id: user?.id,
          title: `Recherche - ${new Date().toLocaleDateString()}`,
          query: agenticQuery,
          lexaia_outputs: dossierData,
          biens: dossierData.properties?.map((p: any) => p.id) || [],
        });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Dossier sauvegardé",
        description: "Votre recherche a été sauvegardée dans votre espace personnel",
        variant: "default",
      });
    },
  });

  const handleVoiceInput = useCallback(() => {
    // Voice input functionality placeholder
  }, []);

  const handleAgenticSearch = () => {
    if (!agenticQuery.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez décrire votre projet immobilier",
        variant: "destructive",
      });
      return;
    }
    if (!consent) {
      toast({
        title: "Consentement requis",
        description: "Veuillez accepter le traitement de vos données",
        variant: "destructive",
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
        variant: "destructive",
      });
    }
  };
  const handleInterestClick = (interest: ProjectInterest) => {
    trackCustomEvent('interests_clicked', { name: interest.name, link: interest.link });
    window.open(interest.link, '_blank');
  };
  return (
    <>
      <SEOHead
        title="Découvrez les Meilleurs Projets Immobiliers à Chypre | ENKI-REALTY"
        description="Plateforme immobilière premium à Chypre. Recherche agentique, optimisation fiscale AI, propriétés d'exception. Investissement sécurisé avec ENKI-REALTY."
        keywords="immobilier Chypre, investissement immobilier Chypre, propriétés premium, recherche agentique, optimisation fiscale, appartements villas penthouses, Chypre luxe"
        url="https://enki-realty.com/"
        canonical="https://enki-realty.com/"
        image="/og-image.jpg"
      />
     
      <div className="min-h-screen overflow-x-hidden bg-background">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <motion.div
            style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
            className="absolute inset-0 z-0"
          >
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${cyprusHero})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/50 via-primary/20 to-accent/30" />
          </motion.div>
          <Suspense fallback={null}>
            {isClient && (
              <div className="absolute inset-0 opacity-20">
                <ErrorBoundary fallback={<div className="bg-gradient-to-br from-accent/20 to-primary/20 h-full w-full" />}>
                  <Canvas camera={{ position: [0, 0, 5] }}>
                    <ambientLight intensity={0.4} />
                    <pointLight position={[10, 10, 10]} />
                    <Suspense fallback={null}>
                      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
                        <Sphere args={[0.1, 16, 16]} position={[-4, -2, -1]}>
                          <MeshDistortMaterial color="#F0F7FD" distort={0.2} speed={2} />
                        </Sphere>
                      </Float>
                      <Float speed={1.5} rotationIntensity={2} floatIntensity={1}>
                        <Sphere args={[0.15, 16, 16]} position={[4, 2, -2]}>
                          <MeshDistortMaterial color="#0090E6" distort={0.3} speed={1.5} />
                        </Sphere>
                      </Float>
                      <Float speed={1.8} rotationIntensity={1.5} floatIntensity={3}>
                        <Sphere args={[0.08, 16, 16]} position={[0, 3, -1]}>
                          <MeshDistortMaterial color="#20B256" distort={0.4} speed={2.5} />
                        </Sphere>
                      </Float>
                    </Suspense>
                  </Canvas>
                </ErrorBoundary>
              </div>
            )}
          </Suspense>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
              className="space-y-12"
            >
              {/* Animated Logo Assembly */}
              <motion.div
                className="relative flex flex-col items-center justify-center space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* ENKI REALTY arrives from extreme left - synchronized timing */}
                <motion.div
                  className="text-6xl sm:text-7xl lg:text-8xl font-light tracking-tight text-white flex items-start"
                  initial={{ opacity: 0, x: "-100vw" }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 2, 
                    delay: 0.5, 
                    ease: [0.23, 1, 0.32, 1], // More fluid easing
                    type: "tween"
                  }}
                >
                  ENKI REALTY
                  <motion.span
                    className="text-2xl sm:text-3xl lg:text-4xl font-normal ml-1 mt-2 text-white/90"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 2.8, ease: "easeOut" }}
                  >
                    AI
                  </motion.span>
                </motion.div>

                {/* Sharp separation line arrives from background (depth) */}
                <motion.div
                  className="relative w-48 h-0.5 bg-white"
                  initial={{ 
                    opacity: 0, 
                    scaleX: 0,
                    rotateX: 90
                  }}
                  animate={{ 
                    opacity: 1, 
                    scaleX: 1,
                    rotateX: 0
                  }}
                  transition={{ 
                    duration: 1.2, 
                    delay: 1.8, 
                    ease: [0.23, 1, 0.32, 1],
                    type: "tween"
                  }}
                  style={{
                    transformOrigin: "center",
                    perspective: "1000px"
                  }}
                />

                {/* Cyprus Properties arrives from extreme right - SAME timing as ENKI REALTY */}
                <motion.div
                  className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white/90"
                  initial={{ opacity: 0, x: "100vw" }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 2, 
                    delay: 0.5, // SAME delay as ENKI REALTY
                    ease: [0.23, 1, 0.32, 1], // Same fluid easing
                    type: "tween"
                  }}
                >
                  Cyprus Properties
                </motion.div>
              </motion.div>

              {/* Subtitle + CTA anchored near bottom for precise placement */}
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-full px-4">
                <motion.p
                  className="font-inter text-lg sm:text-xl md:text-2xl font-normal leading-relaxed -0.005em text-white/90 max-w-4xl mx-auto text-center mb-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 3.2, ease: "easeOut" }}
                >
                  La nouvelle expérience de l'investissement immobilier
                </motion.p>
                
                <motion.div
                  className="flex justify-center items-center"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 3.7, ease: "easeOut" }}
                >
                  <Button
                    className="bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-4 text-lg font-medium rounded-lg shadow-lg hover:shadow-premium transition-all duration-300 transform hover:scale-105"
                    onClick={() => document.getElementById('why-enki')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Découvrez Pourquoi Nous Choisir
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
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
        {/* Pourquoi Choisir ENKI Realty */}
        <motion.section
          id="why-enki"
          className="bg-background py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"
            initial={{ y: -50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            viewport={{ once: true }}
          />
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.h2
              className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight -0.015em text-primary text-center mb-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              Pourquoi choisir ENKI Realty ?
            </motion.h2>
            <motion.p
              className="text-lg sm:text-xl font-normal leading-relaxed -0.005em text-muted-foreground max-w-4xl mx-auto text-center mb-20"
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
                  gradient: "from-primary/10 to-accent/10",
                },
                {
                  icon: (
                    <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  ),
                  title: "Recherche intelligente",
                  description: "Une IA qui comprend vos besoins et vous propose les biens les plus adaptés, sans perte de temps ni recherche complexe.",
                  gradient: "from-primary/10 to-accent/10",
                },
                {
                  icon: (
                    <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  ),
                  title: "Optimisation fiscale",
                  description: "En un clic, obtenez des scénarios personnalisés pour maximiser votre rentabilité et protéger votre patrimoine, avec des réponses immédiates et concrètes.",
                  gradient: "from-primary/10 to-accent/10",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="relative group bg-card border border-border/50 rounded-3xl p-8 lg:p-10 hover:border-primary/30 transition-all duration-500 overflow-hidden cursor-pointer"
                  initial={{ opacity: 0, y: 60, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, delay: index * 0.2, ease: [0.21, 0.47, 0.32, 0.98] } }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.02, transition: { type: "spring", damping: 20, stiffness: 300 } }}
                  onClick={() => {
                    if (index === 0) document.getElementById('featured-projects')?.scrollIntoView({ behavior: 'smooth' });
                    else if (index === 1) document.getElementById('start-experience')?.scrollIntoView({ behavior: 'smooth' });
                    else window.location.href = '/lexaia';
                  }}
                >
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`}
                    initial={{ opacity: 0, scale: 1.1 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 2 }}
                    viewport={{ once: true }}
                  />
                  <motion.div
                    className="absolute top-1/4 right-1/4 w-32 h-32 bg-primary/5 rounded-full blur-2xl"
                    animate={{ x: [0, 20, -20, 0], y: [0, -10, 10, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl z-10"></div>
                  <motion.div
                    className="mb-8 flex justify-center lg:justify-start relative z-20"
                    whileHover={{ scale: 1.1, rotate: 5, transition: { type: "spring", damping: 15 } }}
                  >
                    {item.icon}
                  </motion.div>
                  <h3 className="font-medium text-lg lg:text-xl xl:text-2xl tracking-tight -0.01em text-primary mb-6 leading-tight text-center lg:text-left relative z-20">
                    {item.title}
                  </h3>
                  <p className="text-lg font-normal leading-relaxed -0.005em text-muted-foreground text-center lg:text-left relative z-20">
                    {item.description}
                  </p>
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
        {/* Premium Video Section */}
        <motion.section
          id="premium-video"
          className="py-0 bg-secondary w-full h-[45vh] relative overflow-hidden"
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
        {/* Commencer l'Expérience */}
        <motion.section
          id="start-experience"
          className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-secondary to-background/80 overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          viewport={{ once: true }}
        >
          {/* Background Effects */}
          <motion.div 
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: 'radial-gradient(circle at 50% 50%, rgba(0,144,230,0.1) 0%, transparent 70%)',
            }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", repeatType: "reverse" }}
          />
          
          {/* Floating Particles */}
          <Suspense fallback={null}>
            {isClient && (
              <div className="absolute inset-0 opacity-30">
                <ErrorBoundary fallback={null}>
                  <Canvas style={{ height: '100%', width: '100%' }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <group>
                      {floatingParticles.map((p, i) => (
                        <Float key={i} speed={p.speed} rotationIntensity={1} floatIntensity={2}>
                          <Sphere args={[p.radius, 16, 16]} position={p.position}>
                            <MeshDistortMaterial color="#0090E6" distort={0.3} speed={1.5} />
                          </Sphere>
                        </Float>
                      ))}
                    </group>
                  </Canvas>
                </ErrorBoundary>
              </div>
            )}
          </Suspense>
          
          <div className="max-w-3xl mx-auto relative z-10">
            <motion.h2
              className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight -0.015em text-primary text-center mb-12"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Commencer l'Expérience
            </motion.h2>
            
            <motion.p
              className="text-lg sm:text-xl font-normal leading-relaxed -0.005em text-muted-foreground text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Laissez l'IA transformer votre vision en réalité immobilière parfaite
            </motion.p>
            
            {/* Futuristic Input Container */}
            <motion.div 
              className="relative bg-card/50 backdrop-blur-xl border border-primary/20 rounded-3xl p-8 shadow-premium overflow-hidden"
              initial={{ opacity: 0, scale: 0.95, rotateX: -10 }}
              whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ duration: 1, type: 'spring', damping: 15 }}
              whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(0,144,230,0.2)' }}
            >
              {/* Glowing Border Effect */}
              <motion.div
                className="absolute inset-0 border-2 border-primary/0 rounded-3xl pointer-events-none"
                animate={{
                  borderColor: ['rgba(0,144,230,0)', 'rgba(0,144,230,0.3)', 'rgba(0,144,230,0)'],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              
              {/* AI Orb Indicator */}
              <motion.div 
                className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-primary/20 blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <motion.div 
                  className="absolute inset-4 rounded-full bg-primary shadow-[0_0_20px_rgba(0,144,230,0.5)]"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                />
              </motion.div>
              
              <Textarea
                value={agenticQuery}
                onChange={(e) => setAgenticQuery(e.target.value)}
                placeholder="Décrivez votre projet idéal... (ex: Appartement vue mer à Limassol, budget 500k€, optimisation fiscale)"
                className="w-full min-h-[120px] bg-transparent border-0 text-primary placeholder:text-muted-foreground/60 focus-visible:ring-0 resize-none text-lg"
              />
              
              <div className="flex items-center justify-between mt-4">
                <Label htmlFor="consent" className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                  <Checkbox id="consent" checked={consent} onCheckedChange={(checked) => setConsent(!!checked)} />
                  Accepter le traitement des données pour recommandations personnalisées
                </Label>
                
                <div className="flex gap-4">
                  <motion.button 
                    className="p-3 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleVoiceInput}
                    aria-label="Voice input"
                  >
                    <Mic className="w-5 h-5 text-primary" />
                  </motion.button>
                  
                  <Button 
                    onClick={handleAgenticSearch}
                    disabled={!agenticQuery.trim() || !consent}
                    className="bg-primary hover:bg-primary-hover"
                  >
                    Lancer l'Analyse IA
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>
        {/* KPIs Marché Immobilier */}
        <motion.section
          id="market-kpis"
          className="bg-background py-24 md:py-32 px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto">
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
                  source: "Sources : <a href='https://www.globalpropertyguide.com/Europe/Cyprus/Price-History' target='_blank' class='text-muted-foreground hover:text-primary hover:underline transition-colors'>Global Property Guide</a> · <a href='https://www.ceicdata.com/en/indicator/cyprus/house-prices-growth' target='_blank' class='text-muted-foreground hover:text-primary hover:underline transition-colors'>CEIC Data</a>",
                },
                {
                  number: "23,9K",
                  title: "Transactions immobilières en 2024",
                  subtitle: "",
                  source: "Sources : <a href='https://www.pwc.com.cy/en/publications/cyprus-real-estate-market-review.html' target='_blank' class='text-muted-foreground hover:text-primary hover:underline transition-colors'>PwC Cyprus Real Estate Market Review</a> · <a href='https://cyprus-mail.com/' target='_blank' class='text-muted-foreground hover:text-primary hover:underline transition-colors'>Cyprus Mail</a>",
                },
                {
                  number: "70%",
                  title: "Taux d'occupation locative",
                  subtitle: "",
                  source: "Sources : <a href='https://airbtics.com/' target='_blank' class='text-muted-foreground hover:text-primary hover:underline transition-colors'>Airbtics</a> · <a href='https://investropa.com/' target='_blank' class='text-muted-foreground hover:text-primary hover:underline transition-colors'>Investropa</a>",
                },
                {
                  number: "4,75%",
                  title: "Rendement locatif brut moyen",
                  subtitle: "",
                  source: "Sources : <a href='https://www.globalcitizensolutions.com/' target='_blank' class='text-muted-foreground hover:text-primary hover:underline transition-colors'>Global Citizens Solutions</a> · <a href='https://www.rics.org/cyprus/' target='_blank' class='text-muted-foreground hover:text-primary hover:underline transition-colors'>RICS Cyprus</a> · <a href='https://www.globalpropertyguide.com/Europe/Cyprus' target='_blank' class='text-muted-foreground hover:text-primary hover:underline transition-colors'>Global Property Guide</a>",
                },
              ].map((kpi, index) => (
                <motion.div
                  key={index}
                  className="text-center group"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2, type: "spring", damping: 20 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, transition: { type: "spring", damping: 15 } }}
                  onViewportEnter={() => {
                    trackCustomEvent('kpi_viewed', { title: kpi.title, number: kpi.number, index });
                  }}
                >
                  <motion.div
                    className="text-6xl sm:text-7xl font-light tracking-tight -0.015em text-primary mb-6"
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, delay: index * 0.2 + 0.5, ease: "easeOut", type: "spring", damping: 15 }}
                    viewport={{ once: true }}
                  >
                    {kpi.number}
                  </motion.div>
                  <motion.h3
                    className="text-xl sm:text-2xl font-medium tracking-tight -0.01em text-primary mb-3"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.7 }}
                    viewport={{ once: true }}
                  >
                    {kpi.title}
                  </motion.h3>
                  <motion.p
                    className="text-sm font-normal leading-relaxed -0.003em text-muted-foreground max-w-xs mx-auto mb-3"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.9 }}
                    viewport={{ once: true }}
                  >
                    {kpi.subtitle}
                  </motion.p>
                  {kpi.source && (
                    <motion.div
                      className="text-xs"
                      dangerouslySetInnerHTML={{ __html: kpi.source }}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.2 + 1.1 }}
                      viewport={{ once: true }}
                    />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>
        {/* Projets Vedette */}
        <section id="featured-projects" className="py-24 md:py-32 bg-gradient-to-br from-muted/30 to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <motion.h2
                className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight -0.015em text-primary mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Projets Vedette
              </motion.h2>
              <motion.p
                className="text-lg sm:text-xl font-normal leading-relaxed -0.005em text-muted-foreground max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Découvrez notre sélection exclusive de programmes immobiliers d'exception, choisis pour leur emplacement privilégié, leur architecture remarquable et leur potentiel d'investissement.
              </motion.p>
            </motion.div>
            <div className="space-y-16">
              {featuredProperties.slice(0, 3).map((property, index) => (
                <motion.div
                  key={property.id}
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
                      backgroundImage: `url(${property.photos?.[0] || 'https://picsum.photos/1200/800?random=' + property.id})`,
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
                    {/* Property Info Column */}
                    <motion.div 
                      className="lg:w-1/2 space-y-6"
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    >
                      <h3 className="text-3xl lg:text-5xl font-light tracking-tight text-white">{property.title}</h3>
                      <div className="flex items-center gap-2 text-white/80">
                        <MapPin className="w-5 h-5" />
                        <span>{property.location}</span>
                      </div>
                      <Badge className="bg-white/20 text-white border-white/30">
                        €{Number(property.priceValue || 0).toLocaleString()}
                      </Badge>
                      <p className="text-white/90 leading-relaxed">
                        {property.description || 'Une propriété premium offrant des équipements modernes et des vues exceptionnelles.'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(property.features || []).slice(0, 4).map((feature: string, i: number) => (
                          <Badge key={i} className="bg-white/10 text-white border-white/20">{feature}</Badge>
                        ))}
                      </div>
                      <Button 
                        onClick={() => {
                          trackCustomEvent('featured_property_clicked', {
                            property_id: property.id,
                            property_title: property.title,
                            property_location: property.location,
                            section: 'featured_projects'
                          });
                          setSelectedProperty(property);
                          setIsModalOpen(true);
                        }}
                        className="bg-white text-primary hover:bg-white/90 mt-4"
                      >
                        Explorer la propriété
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </motion.div>
                    
                    {/* Image Column */}
                    <motion.div 
                      className="lg:w-1/2 h-64 lg:h-96 overflow-hidden rounded-2xl"
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    >
                      <motion.img 
                        src={property.photos?.[0] || 'https://picsum.photos/800/500?random=' + property.id}
                        alt={`Photo de ${property.title}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.5 }}
                      />
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
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        {/* Dernières Nouveautés */}
        <section className="py-24 md:py-32 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <motion.h2
                className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight -0.015em text-primary mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Dernières Nouveautés
              </motion.h2>
              <motion.p
                className="text-lg sm:text-xl font-normal leading-relaxed -0.005em text-muted-foreground max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Restez informé des dernières tendances du marché immobilier chypriote, des nouvelles réglementations et des opportunités d'investissement émergentes.
              </motion.p>
            </motion.div>
            {loading ? (
              <div className="text-center text-muted-foreground">Chargement des propriétés...</div>
            ) : error ? (
              <div className="text-center text-destructive">Erreur de chargement des propriétés. Veuillez réessayer.</div>
            ) : latestProperties.length === 0 ? (
              <div className="text-center text-muted-foreground">Aucune propriété disponible pour le moment.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {latestProperties.map((property: Property, index: number) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="h-full"
                  >
                    <OptimizedPropertyCard
                      property={property as any}
                      onSelect={() => {
                        trackCustomEvent('latest_property_clicked', {
                          property_id: property.id,
                          property_title: property.title,
                          property_location: property.location,
                        });
                        setSelectedProperty(property);
                        setIsModalOpen(true);
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            )}
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
                className="bg-gradient-to-r from-primary to-primary-hover hover:from-primary/90 hover:to-primary-hover/90 text-primary-foreground shadow-lg hover:shadow-premium transition-all duration-300"
              >
                <Link to="/search">
                  <Eye className="w-5 h-5 mr-2" />
                  Voir Toutes les Propriétés
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
        {/* Témoignages */}
        <section className="py-24 md:py-32 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <motion.h2
                className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight -0.015em text-primary mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Témoignages
              </motion.h2>
              <motion.p
                className="text-lg sm:text-xl font-normal leading-relaxed -0.005em text-muted-foreground max-w-3xl mx-auto"
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
                  comment: "L'IA de recherche automatisée d'ENKI Realty a analysé mon profil et m'a proposé exactement le type de villa que je cherchais à Limassol. En 48h j'avais ma sélection parfaite !",
                },
                {
                  id: 2,
                  name: "Thomas Wagner",
                  location: "Allemagne",
                  photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&auto=format",
                  rating: 5,
                  comment: "Grâce à leur agent fiscal IA, j'ai pu optimiser mon montage d'entreprise à Chypre et réduire ma fiscalité de 40%. Un accompagnement sur-mesure exceptionnel.",
                },
                {
                  id: 3,
                  name: "Sarah Johnson",
                  location: "Royaume-Uni",
                  photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&auto=format",
                  rating: 5,
                  comment: "L'obtention de ma résidence chypriote s'est faite en un temps record grâce à leur IA conseil. Toutes les démarches ont été automatisées et simplifiées.",
                },
                {
                  id: 4,
                  name: "Marco Rossi",
                  location: "Italie",
                  photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format",
                  rating: 5,
                  comment: "La recherche automatisée a parfaitement cerné mon profil d'investisseur. Le montage fiscal proposé par leur IA m'a fait économiser des milliers d'euros.",
                },
                {
                  id: 5,
                  name: "Anna Petrov",
                  location: "Russie",
                  photo: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&auto=format",
                  rating: 5,
                  comment: "Leur agent fiscal IA a structuré mon montage d'entreprise offshore de façon optimale. La recherche de propriétés s'est adaptée automatiquement à mes besoins.",
                },
                {
                  id: 6,
                  name: "David Chen",
                  location: "Singapour",
                  photo: "https://images.unsplash.com/photo-1519345182560-3f2917c78026?w=100&h=100&fit=crop&auto=format",
                  rating: 5,
                  comment: "La technologie IA d'ENKI Realty a révolutionné ma recherche immobilière. Analyse précise, recommandations personnalisées et accompagnement fiscal d'excellence.",
                },
              ].map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: testimonial.id * 0.1 }}
                  className="bg-card rounded-2xl p-8 shadow-lg border border-border/50 hover:shadow-xl transition-all duration-500 hover:scale-105"
                >
                  <div className="flex items-center mb-6">
                    <img
                      src={testimonial.photo}
                      alt={`Photo de ${testimonial.name}`}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                      <p className="text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    "{testimonial.comment}"
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        {/* Call to Action */}
        <section className="py-24 md:py-32 bg-gradient-to-br from-primary via-primary/90 to-accent">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight text-white mb-8">
                Prêt à investir ?
              </h2>
              <p className="text-xl sm:text-2xl text-white/90 mb-12 leading-relaxed">
                Découvrez nos propriétés premium et bénéficiez de notre expertise fiscale IA
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="secondary"
                  className="px-12 py-6 text-lg bg-white text-primary hover:bg-white/90"
                  asChild
                >
                  <Link to="/projects">
                    Découvrir nos projets
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
      {/* Property Modal */}
      <PropertyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        property={selectedProperty}
      />
      {/* Agentic Search Results Modal */}
      <Dialog open={showResultsModal} onOpenChange={setShowResultsModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Résultats de Recherche IA</DialogTitle>
            <DialogDescription>
              Voici les propriétés qui correspondent le mieux à votre recherche personnalisée
            </DialogDescription>
          </DialogHeader>
          {searchResults && (
            <div className="space-y-6">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Votre recherche :</h3>
                <p className="text-muted-foreground">{searchResults.query}</p>
              </div>
              {searchResults.recommendations?.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2">
                  {searchResults.recommendations.map((property: Property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onClick={() => {
                        setSelectedProperty(property);
                        setIsModalOpen(true);
                        setShowResultsModal(false);
                      }}
                    />
                  ))}
                </div>
              )}
              {searchResults.analysis && (
                <div className="bg-accent/10 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Analyse IA :</h3>
                  <p className="text-sm leading-relaxed">{searchResults.analysis}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
export default Home;