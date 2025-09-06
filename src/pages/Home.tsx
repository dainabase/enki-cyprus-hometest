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
        distort={0.3}
        speed={1.5}
        roughness={0}
      />
    </Sphere>
  </Float>
);
// Fallback testimonials to prevent reference errors when data is unavailable
const testimonials: any[] = [];
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
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
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
  useEffect(() => {
    if (typeof window !== 'undefined' && (('SpeechRecognition' in window) || ('webkitSpeechRecognition' in window))) {
      const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionCtor();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'fr-FR';
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setAgenticQuery(prev => prev + transcript);
      };
      recognitionRef.current.onend = () => setIsRecording(false);
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        toast({
          title: "Erreur de reconnaissance vocale",
          description: "Veuillez réessayer ou utiliser le clavier.",
          variant: "destructive",
        });
        setIsRecording(false);
      };
    } else {
      toast({
        title: "Reconnaissance vocale non supportée",
        description: "Votre navigateur ne supporte pas la reconnaissance vocale. Veuillez utiliser le clavier.",
        variant: "destructive",
      });
    }
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast]);
  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };
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
    toggleRecording();
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
              <motion.h1
                className="text-6xl sm:text-7xl lg:text-8xl font-light tracking-tight -0.02em text-white mb-8 leading-tight"
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
                  className="block text-white"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  Meilleurs Projets
                </motion.span>
                <motion.span
                  className="block text-white"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                >
                  Immobiliers à Chypre
                </motion.span>
              </motion.h1>
              <motion.p
                className="font-inter text-lg sm:text-xl md:text-2xl font-normal leading-relaxed -0.005em text-white/90 max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
              >
                La nouvelle expérience de l'investissement immobilier
              </motion.p>
              <motion.div
                className="flex justify-center items-center mt-16"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.6, ease: "easeOut" }}
              >
                <Button
                  className="bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-4 text-lg font-medium rounded-lg shadow-lg hover:shadow-premium transition-all duration-300 transform hover:scale-105"
                  onClick={() => document.getElementById('why-enki')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Découvrez Pourquoi Nous Choisir
                </Button>
              </motion.div>
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
        {/* Transition Spacer */}
        <motion.div
          className="h-20 bg-gradient-to-b from-secondary to-background"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
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
            <Advanced3DCarousel
              properties={featuredProperties}
              interests={interests || {}}
              onInterestClick={handleInterestClick}
            />
          </div>
        </section>
        {/* Transition Spacer */}
        <motion.div
          className="h-20 bg-gradient-to-b from-background to-muted/30"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
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
        {/* Transition Spacer */}
        <motion.div
          className="h-20 bg-gradient-to-b from-background to-muted/30"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        {/* Témoignages */}
        <section className="py-24 md:py-32 bg-muted/30 relative overflow-hidden">
          {/* Background Gradient Waves */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-30"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear", repeatType: "reverse" }}
            style={{
              background: 'linear-gradient(135deg, rgba(0,144,230,0.05) 0%, rgba(240,247,253,0.05) 100%)',
              backgroundSize: '200% 200%',
            }}
          />
         
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
                Ce Que Disent Nos Clients
              </motion.h2>
              <motion.p
                className="text-lg sm:text-xl font-normal leading-relaxed -0.005em text-muted-foreground max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Découvrez les expériences de ceux qui ont réalisé leur rêve immobilier avec ENKI Realty
              </motion.p>
            </motion.div>
           
            {/* 3D Testimonial Carousel */}
            <Advanced3DCarousel
              properties={testimonials.map(t => ({
                id: t.id,
                title: t.name,
                location: t.location,
                photos: [t.photo],
                type: t.rating + ' étoiles',
                price: t.comment,
                interests: [] // No interests for testimonials
              }))}
              interests={{}}
              onInterestClick={() => {}}
            />
          </div>
        </section>
        {/* Transition Spacer */}
        <motion.div
          className="h-20 bg-gradient-to-b from-muted/30 to-background"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        {/* New CTA Section */}
        <section className="py-24 md:py-32 relative overflow-hidden bg-gradient-to-br from-primary to-accent">
          {/* Animated Background Particles */}
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
                            <MeshDistortMaterial color="#FFFFFF" distort={0.3} speed={1.5} />
                          </Sphere>
                        </Float>
                      ))}
                    </group>
                  </Canvas>
                </ErrorBoundary>
              </div>
            )}
          </Suspense>
         
          {/* Glowing Overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
         
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.h2
              className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight text-white mb-8"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              Prêt à Transformer Votre Vision en Réalité?
            </motion.h2>
            <motion.p
              className="text-xl sm:text-2xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Explorez nos propriétés d'exception et bénéficiez d'une optimisation fiscale personnalisée via notre IA avancée.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 px-8 py-4 text-base font-medium rounded-lg shadow-premium hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-300"
                asChild
              >
                <Link to="/projects">
                  Découvrir Nos Projets
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-base font-medium rounded-lg transition-all duration-300 hover:scale-105"
                asChild
              >
                <Link to="/lexaia">
                  Optimiser Ma Fiscalité
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
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