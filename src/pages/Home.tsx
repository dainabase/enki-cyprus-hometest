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

// Count-up Animation Component
const CountUpAnimation = ({ target, suffix = "", delay = 0 }: { target: number; suffix?: string; delay?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    const timer = setTimeout(() => {
      let start = 0;
      const increment = target / 60; // 60 frames for smooth animation
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16); // ~60fps

      return () => clearInterval(timer);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [isInView, target, delay]);

  return (
    <div ref={ref}>
      {count.toLocaleString()}{suffix}
    </div>
  );
};

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
  const { toast } = useToast();
  const { user } = useAuth();
  const { scrollY } = useScroll();
  
  // State management
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enable3D, setEnable3D] = useState(false);
  const [agenticQuery, setAgenticQuery] = useState('');
  const [consent, setConsent] = useState(false);
  const [isAgenticModalOpen, setIsAgenticModalOpen] = useState(false);
  const [agenticResults, setAgenticResults] = useState<any>(null);
  const [selectedInterest, setSelectedInterest] = useState<ProjectInterest | null>(null);
  const [isInterestModalOpen, setIsInterestModalOpen] = useState(false);

  // Fetch properties
  const { properties = [], loading } = useSupabaseProperties();

  // Featured and latest properties
  const featuredProperties = useMemo(() => 
    properties.filter(p => p.featured).slice(0, 6), 
    [properties]
  );
  
  const latestProperties = useMemo(() => 
    properties
      .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
      .slice(0, 6), 
    [properties]
  );

  // Cyprus interests data
  const cyprusInterests = useMemo(() => ({
    limassol: [
      { name: "Limassol Marina", link: "https://www.limassolmarina.com/", desc: "Marina de luxe avec yachts et restaurants" },
      { name: "Molos Promenade", link: "https://www.visitcyprus.com/", desc: "Promenade côtière moderne et animée" },
      { name: "Old Town", link: "https://www.visitcyprus.com/", desc: "Centre historique avec château médiéval" }
    ],
    paphos: [
      { name: "Paphos Archaeological Park", link: "https://www.visitcyprus.com/", desc: "Site UNESCO avec mosaïques antiques" },
      { name: "Tombs of Kings", link: "https://www.visitcyprus.com/", desc: "Tombes hellénistiques monumentales" },
      { name: "Paphos Harbour", link: "https://www.visitcyprus.com/", desc: "Port pittoresque avec fort médiéval" }
    ],
    larnaca: [
      { name: "Finikoudes Beach", link: "https://www.visitcyprus.com/", desc: "Plage urbaine avec palmiers" },
      { name: "Hala Sultan Tekke", link: "https://www.visitcyprus.com/", desc: "Mosquée historique au bord du lac salé" },
      { name: "St. Lazarus Church", link: "https://www.visitcyprus.com/", desc: "Église orthodoxe du 9ème siècle" }
    ]
  }), []);

  // Agentic search mutation
  const agenticSearchMutation = useMutation({
    mutationFn: async (query: string) => {
      const { data, error } = await supabase.functions.invoke('agentic-search', {
        body: { query, userId: user?.id }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setAgenticResults(data);
      setIsAgenticModalOpen(true);
      trackCustomEvent('agentic_search_completed', { 
        query: agenticQuery,
        results_count: data?.properties?.length || 0 
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la recherche. Veuillez réessayer.",
        variant: "destructive"
      });
      console.error('Agentic search error:', error);
    }
  });

  // Handlers
  const handlePropertyClick = useCallback((property: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
    trackCustomEvent('property_viewed', { property_id: property.id, property_title: property.title });
  }, []);

  const handleAgenticSearch = useCallback(() => {
    if (!agenticQuery.trim() || !consent) return;
    
    trackCustomEvent('agentic_search_started', { query: agenticQuery });
    agenticSearchMutation.mutate(agenticQuery);
  }, [agenticQuery, consent, agenticSearchMutation]);

  const handleInterestClick = useCallback((interest: ProjectInterest) => {
    setSelectedInterest(interest);
    setIsInterestModalOpen(true);
  }, []);

  // Analytics
  useEffect(() => {
    trackPageView('/');
  }, []);

  // Enable 3D after component mount for better performance
  useEffect(() => {
    const timer = setTimeout(() => setEnable3D(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ErrorBoundary>
      <SEOHead 
        title="ENKI Realty - Investissement Immobilier Premium à Chypre"
        description="Découvrez les meilleures opportunités d'investissement immobilier à Chypre avec ENKI Realty. Projets exclusifs, recherche IA, optimisation fiscale."
        keywords="investissement immobilier, Chypre, immobilier de luxe, propriétés premium"
        image="/og-image.jpg"
      />
      
      <div className="min-h-screen bg-background overflow-x-hidden">
        {/* Hero Section avec Parallax Premium */}
        <motion.section 
          className="relative h-screen flex items-center justify-center overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, hsl(200 100% 45%) 0%, hsl(190 85% 50%) 100%)'
          }}
        >
          {/* Parallax Background Image */}
          <motion.div
            className="absolute inset-0 z-0"
            style={{
              y: useTransform(scrollY, [0, 1000], [0, -200])
            }}
          >
            <img 
              src={cyprusHero}
              alt="Cyprus Real Estate"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>

          {/* Floating geometric shapes */}
          <motion.div
            className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-32 left-16 w-24 h-24 bg-primary/20 rounded-lg blur-lg"
            animate={{
              rotate: [0, 180, 360],
              y: [0, -15, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Hero Content */}
          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
            {/* Main Headline with Stagger Animation */}
            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.12,
                    delayChildren: 0.3
                  }
                }
              }}
            >
              {[
                { text: "Investissement", className: "block" },
                { text: "Premium", className: "block bg-gradient-to-r from-white via-blue-100 to-primary-foreground bg-clip-text text-transparent" },
                { text: "à Chypre", className: "block" }
              ].map((line, lineIndex) => (
                <motion.span
                  key={lineIndex}
                  className={line.className}
                  variants={{
                    hidden: { opacity: 0, y: 100, rotateX: -90 },
                    visible: { 
                      opacity: 1, 
                      y: 0, 
                      rotateX: 0,
                      transition: {
                        type: "spring",
                        damping: 20,
                        stiffness: 100
                      }
                    }
                  }}
                >
                  {line.text}
                </motion.span>
              ))}
            </motion.h1>

            {/* Subtitle with word-by-word reveal */}
            <motion.p 
              className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.08,
                    delayChildren: 1.2
                  }
                }
              }}
            >
              {["Découvrez", "des", "propriétés", "d'exception", "avec", "une", "approche", "innovante", "qui", "transforme", "votre", "vision", "en", "réalité."].map((word, index) => (
                <motion.span
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { 
                      opacity: 1, 
                      y: 0,
                      transition: {
                        type: "spring",
                        damping: 15
                      }
                    }
                  }}
                  className="inline-block mr-2"
                >
                  {word}
                </motion.span>
              ))}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.8, type: "spring", damping: 15 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="#exceptional-living"
                  className="inline-block px-8 py-4 bg-white text-primary font-semibold text-lg rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10">Découvrir l'Excellence</span>
                  <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="#start-experience"
                  className="inline-block px-8 py-4 border-2 border-white text-white font-semibold text-lg rounded-lg hover:bg-white hover:text-primary transition-all duration-300"
                >
                  Commencer ma Recherche
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.8 }}
            onClick={() => document.getElementById('exceptional-living')?.scrollIntoView({ behavior: 'smooth' })}
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
        </motion.section>

        {/* Exceptional Living Section */}
        <motion.section 
          id="exceptional-living"
          className="py-32 md:py-40 px-4 md:px-8 bg-background relative overflow-hidden"
        >
          {/* Background elements */}
          <motion.div 
            className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.span 
                className="text-sm text-primary font-semibold tracking-wider uppercase mb-4 block"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                EXCEPTIONNEL
              </motion.span>
              
              <motion.h2 
                className="text-4xl md:text-6xl font-bold text-foreground mb-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                {["L'Art", "du", "Vivre", "d'Exception"].map((word, index) => (
                  <motion.span
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 50 },
                      visible: { 
                        opacity: 1, 
                        y: 0,
                        transition: {
                          type: "spring",
                          damping: 20
                        }
                      }
                    }}
                    className="inline-block mr-4"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.h2>
            </motion.div>

            {/* Features Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.2
                  }
                }
              }}
            >
              {[
                {
                  icon: <Award className="w-16 h-16 text-primary" />,
                  title: "Expertise Premium",
                  description: "Sélection rigoureuse des projets les plus exclusifs avec une attention aux détails inégalée."
                },
                {
                  icon: <Brain className="w-16 h-16 text-primary" />,
                  title: "IA Personnalisée", 
                  description: "Technologie avancée qui comprend vos besoins et propose des solutions sur mesure."
                },
                {
                  icon: <MapPin className="w-16 h-16 text-primary" />,
                  title: "Locations Exclusives",
                  description: "Adresses prestigieuses offrant intimité, commodité et vues imprenables."
                },
                {
                  icon: <TrendingUp className="w-16 h-16 text-primary" />,
                  title: "Expérience Luxe",
                  description: "Un mélange harmonieux d'élégance, confort et services de classe mondiale."
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="text-center group cursor-pointer"
                  variants={{
                    hidden: { opacity: 0, y: 60 },
                    visible: { 
                      opacity: 1, 
                      y: 0,
                      transition: {
                        type: "spring",
                        damping: 20,
                        duration: 0.8
                      }
                    }
                  }}
                  whileHover={{ y: -10 }}
                >
                  <motion.div 
                    className="mb-6 flex justify-center"
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 5,
                      transition: { duration: 0.3 }
                    }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Stats Section avec Count-up */}
        <motion.section 
          className="py-24 bg-gradient-to-br from-primary/5 to-accent/10 relative overflow-hidden"
        >
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <motion.div 
              className="grid grid-cols-2 lg:grid-cols-4 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.2
                  }
                }
              }}
            >
              {[
                { number: 200, suffix: "+", label: "Projets Premium", sublabel: "Créés avec précision et élégance ultime" },
                { number: 15, suffix: "+", label: "Années d'Expertise", sublabel: "Décennies d'innovation et leadership" },
                { number: 2500, suffix: "", label: "Clients Satisfaits", sublabel: "Confiance, excellence et relations durables" },
                { number: 98, suffix: "%", label: "Taux de Satisfaction", sublabel: "Livrer la joie par l'excellence" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  variants={{
                    hidden: { opacity: 0, scale: 0.5 },
                    visible: { 
                      opacity: 1, 
                      scale: 1,
                      transition: {
                        type: "spring",
                        damping: 15,
                        duration: 0.8
                      }
                    }
                  }}
                >
                  <motion.div
                    className="text-5xl md:text-6xl font-bold text-primary mb-2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ 
                      delay: index * 0.2 + 0.5,
                      type: "spring",
                      damping: 15
                    }}
                    viewport={{ once: true }}
                  >
                    <CountUpAnimation 
                      target={stat.number} 
                      suffix={stat.suffix}
                      delay={index * 0.2 + 0.5}
                    />
                  </motion.div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">
                    {stat.label}
                  </h4>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
                    {stat.sublabel}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          className="py-32 bg-gradient-to-r from-primary to-primary-hover relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"
            animate={{
              background: [
                "linear-gradient(45deg, rgba(0,0,0,0.2) 0%, transparent 50%)",
                "linear-gradient(45deg, transparent 50%, rgba(0,0,0,0.2) 100%)",
                "linear-gradient(45deg, rgba(0,0,0,0.2) 0%, transparent 50%)"
              ]
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          
          <div className="max-w-4xl mx-auto text-center px-4 md:px-8 relative z-10">
            <motion.h2 
              className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Vivez l'Élégance Intemporelle dans Votre Maison de Rêve
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
              viewport={{ once: true }}
            >
              <Link 
                to="#start-experience"
                className="inline-block px-10 py-5 bg-white text-primary font-bold text-xl rounded-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 group"
              >
                Prendre Rendez-vous
                <motion.span
                  className="inline-block ml-3"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-6 h-6" />
                </motion.span>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* Start Experience Section */}
        <motion.section 
          id="start-experience"
          className="bg-secondary py-32 md:py-40 px-4 md:px-8 relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          viewport={{ once: false }}
        >
          {/* Premium background overlays */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/15"
            initial={{ opacity: 0, scale: 1.1 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2 }}
          />
          
          <div className="max-w-4xl mx-auto relative z-10">
            {/* Titre section avec parallax tilt */}
            <motion.h2 
              className="font-inter font-bold text-4xl md:text-6xl text-primary text-center mb-10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.08
                  }
                }
              }}
              style={{
                transformStyle: "preserve-3d",
              }}
              whileHover={{
                rotateX: 2,
                rotateY: 2,
                transition: { 
                  type: "spring",
                  damping: 20,
                  duration: 0.4
                }
              }}
            >
              {["Commencer", "Votre", "Parcours", "d'Exception"].map((word, index) => (
                <motion.span
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 30, rotateX: -90 },
                    visible: { 
                      opacity: 1, 
                      y: 0, 
                      rotateX: 0,
                      transition: {
                        type: "spring",
                        damping: 15
                      }
                    }
                  }}
                  className="inline-block mr-3"
                >
                  {word}
                </motion.span>
              ))}
            </motion.h2>

            {/* Texte intro avec révélation word-by-word */}
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground text-center mb-12 leading-loose"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.3
                  }
                }
              }}
            >
              {["Laissez", "notre", "intelligence", "artificielle", "révéler", "les", "propriétés", "parfaites", "pour", "votre", "vision."].map((word, index) => (
                <motion.span
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { 
                      opacity: 1, 
                      y: 0,
                      transition: {
                        type: "spring",
                        damping: 15
                      }
                    }
                  }}
                  className="inline-block mr-2"
                >
                  {word}
                </motion.span>
              ))}
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
                  className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
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
                    placeholder="Décrivez votre projet : ex. 'Investisseur français, budget 800k €, villa face mer à Chypre – recherche optimisation fiscale et plus-value à 5 ans'"
                    className="w-full p-8 rounded-2xl bg-input border-2 border-border focus:border-primary focus:ring-ring focus:ring-4 min-h-[160px] transition-all duration-300 text-lg leading-loose shadow-2xl hover:shadow-3xl resize-none"
                    style={{ 
                      fontStyle: agenticQuery ? 'normal' : 'italic',
                      background: 'linear-gradient(135deg, hsl(210 20% 94%) 0%, hsl(210 25% 96%) 100%)'
                    }}
                    sanitize={false}
                  />
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-4 justify-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Checkbox
                  id="consent-new"
                  checked={consent}
                  onCheckedChange={(checked) => setConsent(!!checked)}
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary scale-125"
                />
                <label 
                  htmlFor="consent-new" 
                  className="text-muted-foreground cursor-pointer leading-relaxed"
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
                  {/* Multiple glow layers */}
                  <motion.div
                    className="absolute -inset-2 bg-gradient-to-r from-primary via-primary/80 to-primary rounded-xl blur opacity-25 group-hover:opacity-60"
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
                    className="relative px-12 py-6 text-xl font-bold shadow-2xl transition-all duration-500 overflow-hidden group border-0"
                    style={{
                      borderRadius: agenticQuery.trim() && consent ? '1rem' : '3rem',
                      background: agenticQuery.trim() && consent ? 
                        'linear-gradient(135deg, hsl(200 100% 45%) 0%, hsl(210 85% 40%) 50%, hsl(190 80% 45%) 100%)' :
                        'linear-gradient(135deg, hsl(200 50% 60%) 0%, hsl(210 45% 55%) 100%)',
                      color: 'white'
                    }}
                  >
                    {/* Animated background patterns */}
                    <motion.div
                      className="absolute inset-0 opacity-30"
                      animate={{
                        background: [
                          "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)",
                          "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)",
                          "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)"
                        ]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                      animate={{
                        x: [-100, 400],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        repeatDelay: 3
                      }}
                    />
                    
                    <span className="relative z-10 flex items-center">
                      {agenticSearchMutation.isPending ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-7 h-7 border-3 border-white border-t-transparent rounded-full mr-4"
                          />
                          Recherche en cours...
                        </>
                      ) : (
                        <>
                          <Search className="w-7 h-7 mr-4" />
                          Lancer la Recherche Premium
                        </>
                      )}
                    </span>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Sections existantes... */}
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
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Dernières Propriétés
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Explorez nos nouvelles acquisitions et opportunités exclusives
              </p>
            </motion.div>

            {latestProperties.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestProperties.map((property, index) => (
                  <PropertyCard key={property.id} property={property} index={index} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Property Modal */}
      <PropertyModal 
        property={selectedProperty}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Agentic Search Results Modal */}
      <Dialog open={isAgenticModalOpen} onOpenChange={setIsAgenticModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-card border border-border">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary mb-2">
              Résultats de votre recherche
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              Voici les propriétés sélectionnées selon vos critères
            </DialogDescription>
          </DialogHeader>
          
          {agenticResults && (
            <motion.div 
              className="space-y-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.2
                  }
                }
              }}
            >
              {/* Properties Grid */}
              {agenticResults.properties && agenticResults.properties.length > 0 && (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    Propriétés recommandées ({agenticResults.properties.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {agenticResults.properties.map((property: any, index: number) => (
                      <motion.div
                        key={property.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <PropertyCard property={property} index={index} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Analysis */}
              {agenticResults.analysis && (
                <motion.div
                  className="bg-secondary/50 p-6 rounded-lg"
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Analyse personnalisée
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {agenticResults.analysis}
                  </p>
                </motion.div>
              )}

              {/* PDF Download */}
              {agenticResults.pdfUrl && (
                <motion.div
                  className="flex justify-center pt-4"
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 }
                  }}
                >
                  <Button
                    onClick={() => window.open(agenticResults.pdfUrl, '_blank')}
                    className="bg-success hover:bg-success/90 text-white px-6 py-3 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Télécharger le Rapport PDF
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </DialogContent>
      </Dialog>

      {/* Interest Modal */}
      <Dialog open={isInterestModalOpen} onOpenChange={setIsInterestModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-card border border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-primary">
              {selectedInterest?.name}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {selectedInterest?.desc}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <a 
              href={selectedInterest?.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              Voir plus d'informations
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </ErrorBoundary>
  );
};

export default Home;