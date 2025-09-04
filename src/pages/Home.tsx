import { useState, lazy, Suspense, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
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
import { 
  Search, MapPin, TrendingUp, Brain, Shield, Award, 
  Star, Download, Save, Eye, Heart, ArrowRight, Building,
  Trophy, Briefcase, Target, ExternalLink, Clock, Sparkles, 
  ChevronLeft, ChevronRight, Play, Zap, Compass, Globe
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

    // GSAP Advanced Animations
    const tl = gsap.timeline();
    
    // Stagger animation for feature cards
    tl.fromTo('.feature-card', 
      { y: 100, opacity: 0, scale: 0.8 },
      { 
        y: 0, 
        opacity: 1, 
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: '.features-section',
          start: 'top 80%',
          end: 'bottom 20%',
        }
      }
    );

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
        {/* Advanced Multi-Layer Parallax Hero */}
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
            <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/50 to-accent/60" />
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
              className="space-y-8"
            >
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

              <motion.p 
                className="text-xl md:text-2xl lg:text-3xl text-blue-100 max-w-4xl mx-auto leading-relaxed font-light"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                Votre partenaire de confiance pour investir dans l'immobilier premium 
                au cœur de la Méditerranée
              </motion.p>

              {/* Advanced Agentic Search Form */}
              <motion.div 
                className="mt-24 p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 max-w-5xl mx-auto shadow-2xl relative z-20"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, delay: 1.4, ease: "easeOut" }}
                whileHover={{ scale: 1.02, y: -5 }}
                style={{ 
                  position: 'relative',
                  transform: 'translateZ(0)',
                  willChange: 'auto'
                }}
              >
                <motion.div 
                  className="flex items-center justify-center space-x-3 text-white mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6, duration: 0.8 }}
                >
                  <motion.div
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <Brain className="w-8 h-8 text-blue-200" />
                  </motion.div>
                  <span className="font-semibold text-2xl">Recherche Agentique Immobilière</span>
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                </motion.div>
                
                <div className="space-y-8">
                  <div className="space-y-3">
                    <Label htmlFor="agenticQuery" className="text-white text-lg font-medium text-left block">
                      Décrivez votre projet immobilier en détail
                    </Label>
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Textarea
                        id="agenticQuery"
                        value={agenticQuery}
                        onChange={(e) => setAgenticQuery(e.target.value)}
                        placeholder="Ex: 'Suisse, 500K CHF de budget, investissement Chypre a Limassol et alentour environ 10km, options fiscales optimisées et scénarios possibles'"
                        className="min-h-[140px] w-full bg-white/95 text-gray-900 border-white/30 placeholder-gray-500 resize-none focus:ring-4 focus:ring-primary/30 focus:border-primary/50 rounded-2xl text-lg p-6 shadow-inner"
                        rows={4}
                      />
                    </motion.div>
                  </div>

                  <motion.div 
                    className="flex items-start space-x-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.8 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Checkbox
                        id="consent"
                        checked={consent}
                        onCheckedChange={(checked) => setConsent(!!checked)}
                        className="mt-1 border-white/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary w-6 h-6"
                      />
                    </motion.div>
                    <Label 
                      htmlFor="consent" 
                      className="text-sm text-blue-100 leading-relaxed cursor-pointer flex-1"
                    >
                      J'accepte le traitement de mes données personnelles pour recevoir une recherche personnalisée 
                      et des recommandations immobilières adaptées (conforme RGPD)
                    </Label>
                  </motion.div>

                  <motion.div
                    className="flex justify-center"
                    whileHover={{ scale: agenticQuery.trim() && consent ? 1.05 : 1 }}
                    whileTap={{ scale: agenticQuery.trim() && consent ? 0.95 : 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button
                      onClick={handleAgenticSearch}
                      disabled={!agenticQuery.trim() || !consent || agenticSearchMutation.isPending}
                      size="lg"
                      className="px-16 py-6 text-xl font-semibold bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white shadow-2xl hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50 rounded-2xl border border-white/20"
                    >
                      {agenticSearchMutation.isPending ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-6 h-6 border-3 border-white border-t-transparent rounded-full mr-3"
                          />
                          Analyse en cours...
                        </>
                      ) : (
                        <>
                          <Search className="w-6 h-6 mr-3" />
                          Rechercher
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>
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

        {/* Advanced Features Section */}
        <section className="py-32 bg-gradient-to-br from-background via-muted/20 to-background features-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-luxury mb-6">
                Pourquoi Choisir ENKI-REALTY ?
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Excellence, innovation et expertise locale pour votre réussite immobilière à Chypre
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="feature-card group relative"
                  whileHover={{ 
                    y: -10,
                    rotateY: 5,
                    scale: 1.05
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300,
                    damping: 20 
                  }}
                >
                  <Card className="h-full overflow-hidden card-luxury group shimmer-gold glow-gold">
                    <CardContent className="p-8 h-full flex flex-col">
                      <motion.div
                        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold via-gold-hover to-primary mb-6 flex items-center justify-center shadow-lg group-hover:shadow-gold/50"
                        whileHover={{ 
                          scale: 1.15,
                          rotate: 5,
                          boxShadow: "0 20px 40px hsl(var(--gold) / 0.5)",
                          transition: { type: "spring", stiffness: 400, damping: 15 }
                        }}
                      >
                        <feature.icon className="w-10 h-10 text-white drop-shadow-lg" />
                      </motion.div>
                      
                      <motion.div 
                        className="mb-4"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                      >
                        <div className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-gold to-gold-hover text-gold-foreground mb-3 shadow-md">
                          {feature.badge}
                        </div>
                        <h3 className="text-xl font-bold text-luxury mb-3 group-hover:scale-105 transition-transform duration-300">
                          {feature.title}
                        </h3>
                      </motion.div>
                      
                      <motion.p 
                        className="text-muted-foreground leading-relaxed flex-1"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                      >
                        {feature.description}
                      </motion.p>
                      
                      <motion.div
                        className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ x: 5 }}
                      >
                        <ArrowRight className="w-5 h-5 text-gold" />
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Advanced 3D Carousel Section */}
        <section className="py-20 bg-gradient-to-br from-muted/30 to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Projets Vedette
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Découvrez notre sélection exclusive de propriétés d'exception à Chypre
              </p>
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

        {/* Latest Properties Section */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Dernières Nouveautés
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Les dernières propriétés ajoutées à notre catalogue premium
              </p>
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

        {/* Google Maps Section */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Explorer la Carte
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Découvrez l'emplacement de nos propriétés exclusives à travers Chypre
              </p>
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
                    <Button 
                      variant="gold" 
                      className="shimmer-gold glow-gold"
                      onClick={handleDownloadPDF} 
                      disabled={!searchResults.pdf_url}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger PDF
                    </Button>
                    <Button 
                      variant="gold" 
                      className="shimmer-gold glow-gold"
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