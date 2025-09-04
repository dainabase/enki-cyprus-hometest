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

  // Real Cyprus interests data by city
  const cyprusInterests: Record<string, ProjectInterest[]> = {
    'limassol': [
      { name: 'Limassol Castle', link: 'https://en.wikipedia.org/wiki/Limassol_Castle', desc: 'Historical medieval castle' },
      { name: 'Limassol Marina', link: 'https://www.limassolmarina.com/', desc: 'Luxury yacht harbor' },
      { name: 'Molos Promenade', link: 'https://www.visitcyprus.com/index.php/en/discovercyprus/city/limassol/attractions-places-of-interest/308-molos-promenade-limassol', desc: 'Scenic seaside walk' },
      { name: 'Kolossi Castle', link: 'https://en.wikipedia.org/wiki/Kolossi_Castle', desc: 'Crusader fortress' },
      { name: 'Kourion', link: 'https://en.wikipedia.org/wiki/Kourion', desc: 'Ancient Greco-Roman site' }
    ],
    'paphos': [
      { name: 'Paphos Archaeological Park', link: 'https://www.visitpafos.org.cy/archaeological-park/', desc: 'UNESCO mosaics site' },
      { name: 'Tombs of the Kings', link: 'https://en.wikipedia.org/wiki/Tombs_of_the_Kings_(Paphos)', desc: 'Ancient necropolis' },
      { name: 'Paphos Harbour Castle', link: 'https://www.visitpafos.org.cy/paphos-castle/', desc: 'Byzantine fortress' },
      { name: 'Aphrodite\'s Rock', link: 'https://www.visitcyprus.com/index.php/en/discovercyprus/nature-3/sites-of-interest/102-aphrodite-s-rock-petra-tou-romiou', desc: 'Mythical birthplace' },
      { name: 'Coral Bay', link: 'https://www.visitpafos.org.cy/coral-bay/', desc: 'Sandy beach cove' }
    ],
    'nicosia': [
      { name: 'Ledra Street', link: 'https://en.wikipedia.org/wiki/Ledra_Street', desc: 'Divided crossing point' },
      { name: 'Büyük Han', link: 'https://en.wikipedia.org/wiki/B%C3%BCy%C3%BCk_Han', desc: 'Ottoman caravanserai' },
      { name: 'Cyprus Museum', link: 'https://en.wikipedia.org/wiki/Cyprus_Museum', desc: 'Archaeological treasures' },
      { name: 'Selimiye Camii', link: 'https://en.wikipedia.org/wiki/Selimiye_Mosque,_Nicosia', desc: 'Gothic mosque' },
      { name: 'Venetian Walls', link: 'https://en.wikipedia.org/wiki/Venetian_walls_of_Nicosia', desc: 'Historic fortifications' }
    ],
    'larnaca': [
      { name: 'Finikoudes Beach', link: 'https://www.visitcyprus.com/index.php/en/discovercyprus/city/larnaka/attractions-places-of-interest/307-finikoudes-beach-larnaka', desc: 'Promenade beach' },
      { name: 'Church of St. Lazarus', link: 'https://en.wikipedia.org/wiki/Church_of_Saint_Lazarus,_Larnaca', desc: 'Byzantine church' },
      { name: 'Larnaca Salt Lake', link: 'https://en.wikipedia.org/wiki/Larnaca_Salt_Lake', desc: 'Flamingo habitat' },
      { name: 'Mackenzie Beach', link: 'https://www.visitcyprus.com/index.php/en/discovercyprus/city/larnaka/attractions-places-of-interest/308-mackenzie-beach-larnaka', desc: 'Sandy shore' },
      { name: 'Zenobia Wreck', link: 'https://www.divezenobia.com/', desc: 'Famous dive site' }
    ],
    'ayia napa': [
      { name: 'Nissi Beach', link: 'https://www.visitcyprus.com/index.php/en/discovercyprus/city/ayia-napa/attractions-places-of-interest/309-nissi-beach-ayia-napa', desc: 'Iconic beach' },
      { name: 'WaterWorld', link: 'https://www.waterworldwaterpark.com/', desc: 'Themed waterpark' },
      { name: 'Konnos Bay', link: 'https://www.visitcyprus.com/index.php/en/discovercyprus/nature-3/sites-of-interest/103-konnos-bay', desc: 'Secluded cove' },
      { name: 'Ayia Napa Monastery', link: 'https://en.wikipedia.org/wiki/Ayia_Napa_Monastery', desc: 'Venetian site' },
      { name: 'Sea Caves', link: 'https://www.visitcyprus.com/index.php/en/discovercyprus/nature-3/sites-of-interest/104-sea-caves-ayia-napa', desc: 'Coastal formations' }
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
      title: 'Optimisation fiscale AI magnifique',
      description: 'Intelligence artificielle avancée Lexaia pour maximiser vos avantages fiscaux',
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
      description: 'Accompagnement VIP personnalisé de A à Z dans votre projet d\'investissement exclusif',
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
              className="w-8 h-14 border-3 border-white/50 rounded-full flex justify-center backdrop-blur-sm"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div 
                className="w-2 h-3 bg-white rounded-full mt-3"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </section>

        {/* Section "Pourquoi Choisir ENKI Realty ?" */}
        <motion.section 
          id="why-enki"
          className="bg-background py-32 md:py-40 px-4 md:px-8 relative overflow-hidden"
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
            {/* Titre section unique */}
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-primary text-center mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Pourquoi choisir ENKI Realty ?
            </motion.h2>

            {/* Texte intro unique */}
            <motion.p 
              className="text-lg text-muted-foreground max-w-3xl mx-auto text-center mb-16 leading-loose"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              ENKI Realty vous ouvre un accès privilégié aux projets les plus solides de l'île, avec une approche innovante qui simplifie la recherche et optimise immédiatement vos choix d'investissement.
            </motion.p>

            {/* Grille des trois blocs avec animations séquentielles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 max-w-5xl mx-auto">
              {[
                {
                  icon: <Globe className="w-12 h-12 text-primary" />,
                  title: "Sélection rigoureuse",
                  description: "Tous les projets des promoteurs les plus fiables réunis en un seul endroit, soigneusement sélectionnés pour leur qualité et leur sérieux.",
                  animation: { initial: { x: -100, opacity: 0 }, delay: 0 }
                },
                {
                  icon: <Lightbulb className="w-12 h-12 text-primary" />,
                  title: "Recherche intelligente",
                  description: "Une IA qui comprend vos besoins et vous propose les biens les plus adaptés, sans perte de temps ni recherche complexe.",
                  animation: { initial: { y: 100, opacity: 0 }, delay: 0.3 }
                },
                {
                  icon: <BarChart3 className="w-12 h-12 text-primary" />,
                  title: "Optimisation fiscale instantanée",
                  description: "En un clic, obtenez des scénarios personnalisés pour maximiser votre rentabilité et protéger votre patrimoine, avec des réponses immédiates et concrètes.",
                  animation: { initial: { x: 100, opacity: 0 }, delay: 0.6 }
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-card p-10 md:p-12 rounded-xl border border-border shadow-sm hover:shadow-lg hover:bg-accent transition-all duration-300 cursor-pointer"
                  initial={item.animation.initial}
                  whileInView={{ 
                    x: 0, 
                    y: 0, 
                    opacity: 1,
                    transition: {
                      duration: 0.8,
                      delay: item.animation.delay,
                      ease: 'easeOut'
                    }
                  }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.03,
                    transition: { 
                      type: "spring", 
                      damping: 15 
                    }
                  }}
                  drag
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  dragElastic={0.1}
                  whileDrag={{ scale: 0.98 }}
                >
                  <motion.div 
                    className="mb-6"
                    whileHover={{ 
                      rotate: 5,
                      transition: { 
                        type: "spring", 
                        damping: 15 
                      }
                    }}
                  >
                    {item.icon}
                  </motion.div>
                  <h3 className="font-bold text-2xl text-foreground mb-4 leading-relaxed">
                    {item.title}
                  </h3>
                  <p className="text-lg text-muted-foreground leading-loose mb-4">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Section "Commencer l'Expérience" */}
        <motion.section 
          id="start-experience"
          className="bg-secondary py-32 md:py-40 px-4 md:px-8 relative overflow-hidden"
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
            {/* Titre section unique */}
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-primary text-center mb-10"
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
                  className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={{ scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                />
                
                <motion.div
                  drag
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  dragElastic={0.1}
                  whileDrag={{ scale: 0.98 }}
                  className="relative"
                >
                  <Textarea
                    value={agenticQuery}
                    onChange={(e) => setAgenticQuery(e.target.value)}
                    placeholder="Décrivez votre projet : ex. 'Français, budget 500k €, appartement près de la mer à Chypre – options fiscales pour optimisation rentabilité ?'"
                    className="w-full max-w-3xl mx-auto p-8 rounded-2xl bg-input border border-border focus:border-primary focus:ring-ring focus:ring-2 min-h-[140px] transition-all duration-300 italic text-muted-foreground leading-loose shadow-lg hover:shadow-xl"
                    sanitize={false}
                  />
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-3 justify-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Checkbox
                  id="consent-new"
                  checked={consent}
                  onCheckedChange={(checked) => setConsent(!!checked)}
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label 
                  htmlFor="consent-new" 
                  className="text-muted-foreground text-sm cursor-pointer leading-relaxed"
                >
                  J'accepte que mes données soient utilisées pour générer des recommandations personnalisées
                </label>
              </motion.div>

              {/* Bouton submit avec morph effect */}
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: 1, 
                  duration: 0.6,
                  type: "spring",
                  damping: 15
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  {/* Pulse glow effect */}
                  <motion.div
                    className="absolute -inset-1 bg-gradient-to-r from-primary via-primary/80 to-primary rounded-lg blur opacity-25 group-hover:opacity-50"
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.25, 0.4, 0.25]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  <Button
                    onClick={handleAgenticSearch}
                    disabled={!agenticQuery.trim() || !consent || agenticSearchMutation.isPending}
                    className="relative w-full md:w-auto px-10 py-4 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-lg shadow-xl transition-all duration-300 overflow-hidden"
                    style={{
                      borderRadius: agenticQuery.trim() && consent ? '0.5rem' : '9999px',
                      background: agenticQuery.trim() && consent ? 
                        'linear-gradient(135deg, hsl(200 100% 45%) 0%, hsl(210 85% 40%) 50%, hsl(190 80% 45%) 100%)' :
                        undefined
                    }}
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{
                        x: [-100, 300],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        repeatDelay: 3
                      }}
                    />
                    
                    {agenticSearchMutation.isPending ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-6 h-6 border-3 border-white border-t-transparent rounded-full mr-3"
                        />
                        Recherche en cours...
                      </>
                    ) : (
                      <>
                        <Search className="w-6 h-6 mr-3" />
                        Lancer la Recherche
                      </>
                    )}
                  </Button>
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
                  number: "+5%",
                  title: "Croissance Annuelle des Prix",
                  subtitle: "Moyenne tout confondu projetée pour 2025.",
                  source: "Source: <a href='https://www.globalpropertyguide.com/europe/cyprus/price-history' target='_blank' class='text-sm text-muted-foreground hover:underline hover:text-primary'>Global Property Guide (2025)</a>"
                },
                {
                  number: "17 500", 
                  title: "Volume des Transactions",
                  subtitle: "Moyenne annuelle projetée.",
                  source: ""
                },
                {
                  number: "4,5%",
                  title: "Rendement Locatif Moyen", 
                  subtitle: "Moyenne tout confondu.",
                  source: ""
                },
                {
                  number: "95,89 Md USD",
                  title: "Valeur Totale du Marché Locations",
                  subtitle: "Marché résidentiel global.",
                  source: ""
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
            className="absolute inset-0 flex items-center justify-center text-primary-foreground text-4xl md:text-6xl font-bold text-center px-6"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            style={{ 
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)' 
            }}
          >
            Experience Timeless Elegance, Premium Living in your Dream Home
          </motion.div>
        </motion.section>

        {/* Section Projets Vedette */}
        <section className="py-32 md:py-40 bg-gradient-to-br from-muted/30 to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <motion.h2 
                className="text-3xl md:text-4xl font-bold text-primary mb-6"
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
                Découvrez notre sélection exclusive de propriétés d'exception, choisies pour leur emplacement privilégié, leur architecture remarquable et leur potentiel d'investissement.
              </motion.p>
            </motion.div>

            {enable3D && featuredProperties.length > 0 ? (
              <Advanced3DCarousel 
                properties={featuredProperties}
                interests={cyprusInterests}
                onInterestClick={handleInterestClick}
              />
            ) : (
              featuredProperties.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredProperties.map((p, i) => (
                    <PropertyCard key={p.id} property={p} index={i} />
                  ))}
                </div>
              )
            )}
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
                className="text-3xl md:text-4xl font-bold text-primary mb-6"
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
              {latestProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <PropertyCard 
                    property={property}
                    onClick={() => {
                      setSelectedProperty(property);
                      setIsModalOpen(true);
                    }}
                  />
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

        {/* Section Explorer la Carte */}
        <section className="py-32 md:py-40 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <motion.h2 
                className="text-3xl md:text-4xl font-bold text-primary mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Explorer la Carte
              </motion.h2>
              <motion.p 
                className="text-lg text-muted-foreground max-w-3xl mx-auto leading-loose"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Explorez visuellement les propriétés disponibles à travers Chypre avec notre carte interactive intuitive. Filtrez par zone, prix et type de bien pour trouver votre futur investissement.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="rounded-3xl overflow-hidden shadow-2xl border border-white/20"
            >
              <ErrorBoundary>
                <Suspense fallback={
                  <div className="h-96 bg-muted flex items-center justify-center">
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
                      />
                      <p className="text-muted-foreground">Chargement de la carte...</p>
                    </div>
                  </div>
                }>
                  <GoogleMapComponent 
                    properties={properties}
                    onPropertySelect={(property) => {
                      setSelectedProperty(property);
                      setIsModalOpen(true);
                    }}
                  />
                </Suspense>
              </ErrorBoundary>
            </motion.div>
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