import { useState, lazy, Suspense, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSpring as useReactSpring, animated, config } from '@react-spring/web';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
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

// Interface for project interests
interface ProjectInterest {
  name: string;
  link: string;
  desc: string;
}

// Advanced 3D Carousel with Physics
const Advanced3DCarousel = ({ properties, interests, onInterestClick }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
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
      className="relative w-full h-[80vh] overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
      
      {/* Main Carousel Container */}
      <div className="relative w-full h-full flex items-center justify-center">
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
              className="absolute inset-0"
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
                  {/* Property Image */}
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
                    
                    {/* Overlay */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                    />
                    
                    {/* Property Info */}
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

                    {/* Action Buttons */}
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

                  {/* Interests Sidebar */}
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

const Home = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agenticQuery, setAgenticQuery] = useState('');
  const [consent, setConsent] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const isClient = useIsClient();
  
  // Refs for GSAP animations
  const heroRef = useRef<HTMLDivElement>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  
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

  // GSAP ScrollTrigger Animation Setup
  useGSAP(() => {
    if (!heroRef.current || !searchBoxRef.current || !backgroundRef.current) return;

    // Clear existing ScrollTriggers
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // Media query setup for responsive
    const mm = gsap.matchMedia();
    
    // Mobile breakpoint
    mm.add("(max-width: 768px)", () => {
      // Mobile timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "+=150vh", // Shorter on mobile
          scrub: 1,
          pin: false,
          anticipatePin: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            trackCustomEvent('scroll_interactions', { 
              progress: Math.round(progress * 100),
              device: 'mobile'
            });
          }
        }
      });

      // Background parallax (slower on mobile)
      tl.to(backgroundRef.current, {
        y: "30%",
        scale: 1.1,
        duration: 1
      }, 0);

      // Search box animation sequence
      tl.to(searchBoxRef.current, {
        y: "15vh",
        scale: 1.02,
        boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        duration: 0.3
      }, 0.1)
      .to(searchBoxRef.current, {
        y: "35vh",
        duration: 0.3
      }, 0.3)
      .to(searchBoxRef.current, {
        y: "50vh",
        opacity: 0.7,
        scale: 0.98,
        duration: 0.4
      }, 0.7);

      // Features reveal (mobile)
      if (featuresRef.current) {
        gsap.fromTo(".feature-card", 
          { y: 50, opacity: 0, scale: 0.9 },
          { 
            y: 0, 
            opacity: 1, 
            scale: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: "back.out(1.4)",
            scrollTrigger: {
              trigger: featuresRef.current,
              start: 'top 85%',
              end: 'bottom 30%',
            }
          }
        );
      }
    });

    // Desktop breakpoint
    mm.add("(min-width: 769px)", () => {
      // Desktop timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "+=200vh", // Longer pause on desktop
          scrub: 1,
          pin: false,
          anticipatePin: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            trackCustomEvent('scroll_interactions', { 
              progress: Math.round(progress * 100),
              device: 'desktop'
            });
          }
        }
      });

      // Background parallax
      tl.to(backgroundRef.current, {
        y: "50%",
        scale: 1.2,
        duration: 1
      }, 0);

      // Search box sophisticated animation
      tl.to(searchBoxRef.current, {
        y: "20%",
        scale: 1.05,
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        duration: 0.3,
        ease: "power2.out"
      }, 0.1)
      .to(searchBoxRef.current, {
        y: "50vh",
        duration: 0.2
      }, 0.3)
      .to(searchBoxRef.current, {
        // Pause phase with pinning effect
        duration: 0.3
      }, 0.5)
      .to(searchBoxRef.current, {
        y: "100vh",
        opacity: 0,
        scale: 0.95,
        duration: 0.2,
        ease: "power2.in"
      }, 0.8);

      // Features reveal with stagger
      if (featuresRef.current) {
        gsap.fromTo(".feature-card", 
          { y: 100, opacity: 0, scale: 0.8 },
          { 
            y: 0, 
            opacity: 1, 
            scale: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: featuresRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
            }
          }
        );
      }
    });

    // Refresh on resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      mm.revert();
    };
  }, { dependencies: [isClient], scope: heroRef });

  useEffect(() => {
    trackPageView('/', 'Accueil - ENKI-REALTY Immobilier Premium Chypre');
    trackCustomEvent('home_viewed', { user_authenticated: !!isAuthenticated });

    // Optimize for mobile performance
    if (searchBoxRef.current) {
      searchBoxRef.current.style.willChange = 'transform';
    }
    if (backgroundRef.current) {
      backgroundRef.current.style.willChange = 'transform';
    }

    return () => {
      // Clean up will-change
      if (searchBoxRef.current) {
        searchBoxRef.current.style.willChange = 'auto';
      }
      if (backgroundRef.current) {
        backgroundRef.current.style.willChange = 'auto';
      }
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
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Brain,
      title: 'Optimisation fiscale AI magnifique',
      description: 'Intelligence artificielle avancée Lexaia pour maximiser vos avantages fiscaux',
      badge: 'AI Powered',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Expertise locale',
      description: 'Connaissance approfondie du marché immobilier chypriote depuis plus de 15 ans',
      badge: 'Expert',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Award,
      title: 'Service premium',
      description: 'Accompagnement VIP personnalisé de A à Z dans votre projet d\'investissement exclusif',
      badge: 'Premium',
      gradient: 'from-orange-500 to-red-500'
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
        {/* Hero Section with Advanced Parallax */}
        <section 
          ref={heroRef}
          className="relative h-screen flex items-center justify-center overflow-hidden"
        >
          {/* Multi-layer Background */}
          <div 
            ref={backgroundRef}
            className="absolute inset-0 z-0"
          >
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${cyprusHero})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/50 to-accent/60" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Hero Title */}
            <motion.div
              ref={titleRef}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="space-y-8"
            >
              <motion.h1 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-8 leading-tight"
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1.05 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
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
                <br />
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
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-blue-100 max-w-4xl mx-auto leading-relaxed font-light"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                Votre partenaire de confiance pour investir dans l'immobilier premium 
                au cœur de la Méditerranée
              </motion.p>
            </motion.div>

            {/* Agentic Search Box */}
            <motion.div 
              ref={searchBoxRef}
              className="mt-16 p-6 sm:p-8 bg-white/90 backdrop-blur-xl rounded-xl sm:rounded-3xl border border-white/20 w-full sm:max-w-md lg:max-w-5xl mx-auto shadow-2xl"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 1.4, ease: "easeOut" }}
            >
              <motion.div 
                className="flex items-center justify-center space-x-3 text-gray-800 mb-6 sm:mb-8"
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
                  <Brain className="w-6 sm:w-8 h-6 sm:h-8 text-primary" />
                </motion.div>
                <span className="font-semibold text-lg sm:text-2xl">Recherche Agentique Immobilière</span>
                <Sparkles className="w-5 sm:w-6 h-5 sm:h-6 text-yellow-500" />
              </motion.div>
              
              <div className="space-y-6 sm:space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="agenticQuery" className="text-gray-800 text-base sm:text-lg font-medium text-left block">
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
                      className="min-h-[100px] sm:min-h-[140px] w-full bg-white text-gray-900 border-gray-300 placeholder-gray-500 resize-none focus:ring-4 focus:ring-primary/30 focus:border-primary/50 rounded-xl sm:rounded-2xl text-sm sm:text-lg p-4 sm:p-6 shadow-inner"
                      rows={3}
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
                      className="border-gray-400 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </motion.div>
                  <Label 
                    htmlFor="consent" 
                    className="text-xs sm:text-sm text-gray-700 cursor-pointer leading-relaxed"
                  >
                    J'accepte le traitement de mes données pour cette recherche immobilière personnalisée et la génération de recommandations fiscales via IA
                  </Label>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Button
                    onClick={handleAgenticSearch}
                    disabled={agenticSearchMutation.isPending}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {agenticSearchMutation.isPending ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Recherche en cours...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Search className="w-5 h-5" />
                        <span>Rechercher</span>
                      </div>
                    )}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section 
          ref={featuresRef}
          className="py-16 sm:py-20 bg-background"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
                Pourquoi Choisir ENKI-REALTY
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                Notre expertise unique au service de votre réussite immobilière
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    className="feature-card"
                    whileHover={{ 
                      scale: 1.05, 
                      rotateY: 5,
                      transition: { type: "spring", stiffness: 300 }
                    }}
                  >
                    <Card className="h-full bg-gradient-to-br from-background to-muted/20 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                      <CardContent className="p-6 sm:p-8 text-center">
                        <motion.div
                          className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center`}
                          whileHover={{ 
                            rotate: 360,
                            transition: { duration: 0.6 }
                          }}
                        >
                          <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                        </motion.div>
                        
                        <div className="mb-4">
                          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mb-3">
                            {feature.badge}
                          </span>
                          <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3">
                            {feature.title}
                          </h3>
                        </div>
                        
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Properties Section */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-muted/30 to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
                Projets Vedette
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                Découvrez notre sélection exclusive de propriétés d'exception à Chypre
              </p>
            </motion.div>

            {featuredProperties.length > 0 ? (
              <Advanced3DCarousel 
                properties={featuredProperties}
                interests={cyprusInterests}
                onInterestClick={handleInterestClick}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProperties.map((property, index) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    index={index}
                    onClick={() => {
                      setSelectedProperty(property);
                      setIsModalOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Latest Properties Section */}
        <section className="py-16 sm:py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
                Dernières Nouveautés
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                Les dernières opportunités immobilières ajoutées à notre portefeuille
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {latestProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <PropertyCard 
                    property={property} 
                    index={index}
                    onClick={() => {
                      setSelectedProperty(property);
                      setIsModalOpen(true);
                    }}
                  />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mt-12"
            >
              <Button asChild className="btn-premium">
                <Link to="/projects">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Voir Tous les Projets
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Explore Map Section */}
        <section className="py-16 sm:py-20 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
                Explorer la Carte
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                Découvrez la localisation de nos propriétés à travers Chypre
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-96 sm:h-[500px] rounded-2xl overflow-hidden shadow-2xl"
            >
              <ErrorBoundary fallback={
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground">Carte non disponible</p>
                </div>
              }>
                <Suspense fallback={
                  <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center">
                    <p className="text-muted-foreground">Chargement de la carte...</p>
                  </div>
                }>
                  {isClient && (
                    <GoogleMapComponent
                      center={{ lat: 35.1264, lng: 33.4299 }}
                      zoom={9}
                      properties={properties}
                      onPropertySelect={(property) => {
                        setSelectedProperty(property);
                        setIsModalOpen(true);
                      }}
                    />
                  )}
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

        {/* Agentic Search Results Modal */}
        <AnimatePresence>
          {showResultsModal && searchResults && (
            <Dialog open={showResultsModal} onOpenChange={setShowResultsModal}>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Brain className="w-6 h-6 text-primary" />
                    Résultats de la Recherche Agentique
                  </DialogTitle>
                  <DialogDescription>
                    Analyse personnalisée basée sur votre demande
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Properties found */}
                  {searchResults.properties && searchResults.properties.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Propriétés Recommandées ({searchResults.properties.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {searchResults.properties.slice(0, 4).map((property: Property) => (
                          <PropertyCard 
                            key={property.id} 
                            property={property}
                            className="h-full"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Lexaia Analysis */}
                  {searchResults.lexaia_analysis && (
                    <div className="bg-muted/50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        Analyse Fiscale AI
                      </h3>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-muted-foreground">
                          {searchResults.lexaia_analysis}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    {searchResults.pdf_url && (
                      <Button onClick={handleDownloadPDF} className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger le PDF
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      onClick={handleSaveDossier}
                      disabled={!isAuthenticated || saveDossierMutation.isPending}
                      className="flex-1"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saveDossierMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
                    </Button>
                  </div>

                  {!isAuthenticated && (
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Connectez-vous pour sauvegarder vos recherches
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/login">Se Connecter</Link>
                      </Button>
                    </div>
                  )}
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