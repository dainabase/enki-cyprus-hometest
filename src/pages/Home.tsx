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
import FeaturedProjectsCarousel from '@/components/FeaturedProjectsCarousel';
import { useIsClient } from '@/hooks/useIsClient';
import TabsFeaturesAlt5Accordion from '@/components/TabsFeatures-Alternative5-Accordion';
import { CountUpStats } from '@/components/CountUpStats';
import { getHeroImage } from '@/utils/gallery';
import Alternative3 from '@/components/hero/Alternative3';
import ChatMessageComponent from '@/components/ChatMessage';
import PropertyResultCard from '@/components/ui/PropertyResultCard';
const GoogleMapComponent = lazy(() => import('@/components/GoogleMap'));
// Static background component to replace 3D elements (fixes runtime errors)
const StaticBackground = () => (
  <div className="absolute inset-0 bg-white opacity-50" />
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
      <div className="absolute inset-0 bg-white/20" />
     
      <StaticBackground />
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
              <Card className="mx-auto max-w-7xl h-[70vh] shadow-2xl overflow-hidden bg-white backdrop-blur-xl border border-border/20">
                <CardContent className="p-0 h-full flex flex-col lg:flex-row">
                  <motion.div
                    className="lg:w-2/3 relative overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                  <motion.img
                    src={getHeroImage(property) || `https://picsum.photos/1200x800?random=${property.id}`}
                    alt={`Image of ${property.title} in ${property.location}`} // Enhanced alt text
                    className="w-full h-64 lg:h-full object-cover"
                    loading="lazy"
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://picsum.photos/1200x800?random=${property.id}`;
                    }}
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
                        className="swaarg-card-title text-white mb-4"
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
                    className="lg:w-1/3 p-8 bg-white backdrop-blur-xl border-l border-border/10"
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
                          <div className="p-4 rounded-xl border border-border/50 hover:border-primary/50 bg-white/90 backdrop-blur-sm transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20">
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
// Interface pour les messages du chat
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  properties?: Property[];
  fiscalOptimization?: {
    preview: string;
    details?: any;
  };
}

const Home = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agenticQuery, setAgenticQuery] = useState('');
  const [consent, setConsent] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [shouldHighlightConsent, setShouldHighlightConsent] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [mockProperties, setMockProperties] = useState<any[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
 
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
  // Gestion du transfert depuis le Hero
  useEffect(() => {
    const handleTransfer = () => {
      const pendingSearch = localStorage.getItem('pending-search');
      
      if (pendingSearch) {
        // Mettre le texte dans le textarea du chat
        setAgenticQuery(pendingSearch);
        
        // Message d'accueil de l'IA
        setMessages([{
          role: 'assistant',
          content: `👋 Bonjour ! J'ai bien reçu votre recherche : "${pendingSearch}". Pour analyser vos besoins et vous proposer les meilleures options, j'ai besoin de votre consentement.`,
          timestamp: new Date()
        }]);
        
        // Mettre en évidence la checkbox RGPD
        setShouldHighlightConsent(true);
        
        // Nettoyer le localStorage
        localStorage.removeItem('pending-search');
      }
    };
    
    window.addEventListener('hero-search-transferred', handleTransfer);
    return () => window.removeEventListener('hero-search-transferred', handleTransfer);
  }, []);

  // Auto-scroll vers le dernier message
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

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

  // Gestion du consentement
  const handleConsentChange = (checked: boolean) => {
    setConsent(checked);
    setShouldHighlightConsent(false);
    
    if (checked) {
      // Message de l'IA
      setMessages(prev => [...prev, {
        role: 'assistant', 
        content: "✅ Merci pour votre consentement ! Cliquez sur 'Lancer l'Analyse IA' pour que je recherche les meilleures propriétés selon vos critères.",
        timestamp: new Date()
      }]);
    }
  };

  const handleSendMessage = async () => {
    if (!consent && !consentGiven) {
      setShouldHighlightConsent(true);
      toast({
        title: "Consentement requis",
        description: "Veuillez accepter le traitement de vos données",
        variant: "destructive",
      });
      return;
    }
    
    if (!agenticQuery.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez décrire votre projet immobilier",
        variant: "destructive",
      });
      return;
    }

    // Marquer le consentement comme donné
    if (consent) {
      setConsentGiven(true);
    }

    // Ajouter le message utilisateur
    const userMessage: ChatMessage = {
      role: 'user',
      content: agenticQuery,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);

    // Vider le champ
    const currentQuery = agenticQuery;
    setAgenticQuery('');
    
    // Afficher "IA en train d'analyser..."
    const typingMessage: ChatMessage = {
      role: 'assistant',
      content: 'Analyse en cours de votre demande...',
      isTyping: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, typingMessage]);
    setIsAnalyzing(true);

    try {
      trackCustomEvent('search_submitted', { query_length: currentQuery.length });
      
      const response = await agenticSearchMutation.mutateAsync({ 
        query: currentQuery, 
        consent: true 
      });

      // Remplacer le message "typing" par la vraie réponse
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: 'assistant',
          content: response.analysis || `J'ai trouvé ${response.properties?.length || 0} propriétés correspondant à votre recherche. Voici les recommandations :`,
          properties: response.properties,
          fiscalOptimization: response.taxInfo ? {
            preview: response.taxInfo.preview || "Analyse fiscale disponible - créez un compte pour plus de détails",
            details: response.taxInfo
          } : undefined,
          timestamp: new Date()
        };
        return newMessages;
      });

    } catch (error) {
      // Remplacer le message typing par un message d'erreur
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: 'assistant',
          content: "Désolé, une erreur s'est produite lors de l'analyse. Veuillez réessayer.",
          timestamp: new Date()
        };
        return newMessages;
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalysis = async () => {
    if (!consent || !agenticQuery.trim()) return;
    
    // Message utilisateur
    setMessages(prev => [...prev, {
      role: 'user',
      content: agenticQuery,
      timestamp: new Date()
    }]);
    
    // Message IA avec typing
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: 'Analyse en cours de vos critères...',
      isTyping: true,
      timestamp: new Date()
    }]);
    
    setIsAnalyzing(true);
    
    // Simuler l'analyse (2 secondes)
    setTimeout(() => {
      // Remplacer le message typing
      setMessages(prev => {
        const msgs = [...prev];
        msgs[msgs.length - 1] = {
          role: 'assistant',
          content: "J'ai trouvé 3 propriétés correspondant à vos critères. Les résultats s'affichent dans le panneau de droite.",
          timestamp: new Date()
        };
        return msgs;
      });
      
      // OUVRIR LE PANNEAU LATÉRAL (animation slide)
      setShowResults(true);
      
      // Charger les propriétés mock
      setMockProperties([
        {
          id: 1,
          title: "Appartement Vue Mer Limassol",
          image: "/lovable-uploads/marina-bay-hero.jpg",
          price: "245 000",
          location: "Limassol Marina",
          size: 85,
          description: "Magnifique T3 avec vue mer, résidence avec piscine, parking inclus",
          matching: 95,
          missingFeatures: ["Salle de sport"]
        },
        {
          id: 2,
          title: "Penthouse Moderne Paphos",
          image: "/lovable-uploads/marina-bay-interior-1.jpg",
          price: "255 000",
          location: "Paphos Centre", 
          size: 92,
          description: "Penthouse dernier étage, terrasse 30m², piscine et gym",
          matching: 100,
          missingFeatures: []
        },
        {
          id: 3,
          title: "Studio Investissement Larnaca",
          image: "/lovable-uploads/marina-bay-bedroom.jpg",
          price: "180 000",
          location: "Larnaca Beach",
          size: 45,
          description: "Studio front de mer, parfait pour location touristique",
          matching: 85,
          missingFeatures: ["2 chambres", "Parking privé"]
        }
      ]);
      
      setIsAnalyzing(false);
    }, 2000);
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
     
      <div className="min-h-screen overflow-x-hidden bg-gradient-ocean">
        <div className="space-y-0">
          <Alternative3 />
        </div>
        {/* Interface Split-View : Chat + Panneau Résultats */}
        <section id="start-experience" className="py-24 px-4 min-h-screen bg-white">
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-4xl font-bold text-center mb-8 text-primary">
              Votre Assistant IA Immobilier
            </h2>
            
            {/* Container principal avec split view */}
            <div className="relative flex gap-0 h-[800px] border rounded-xl overflow-hidden bg-background shadow-xl">
              
              {/* PANNEAU CHAT (gauche) */}
              <div className={`chat-panel transition-all duration-500 ease-in-out ${
                showResults ? 'w-1/2' : 'w-full'
              }`}>
                {/* Zone messages */}
                <div 
                  ref={messagesContainerRef}
                  className="messages-area h-[620px] overflow-y-auto p-6"
                >
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 pt-32">
                      <p className="text-lg mb-4">👋 Bonjour ! Je suis votre assistant IA immobilier</p>
                      <p className="text-sm">Décrivez votre recherche pour commencer l'analyse personnalisée</p>
                    </div>
                  ) : (
                    messages.map((message, index) => (
                      <ChatMessageComponent key={index} message={message} />
                    ))
                  )}
                </div>
                
                {/* Zone input en bas */}
                <div className="input-area border-t p-4">
                  {/* Consentement RGPD simple */}
                  {!consentGiven && (
                    <div className="consent-box mb-4 p-3 bg-amber-50 border border-amber-200 rounded">
                      <label className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          checked={consent} 
                          onChange={(e) => handleConsentChange(e.target.checked)} 
                        />
                        <span className="text-sm">
                          J'accepte le traitement de mes données pour des recommandations personnalisées
                        </span>
                      </label>
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <textarea 
                      value={agenticQuery}
                      onChange={(e) => setAgenticQuery(e.target.value)}
                      className="flex-1 p-3 border rounded-lg resize-none"
                      rows={2}
                      placeholder="Décrivez votre recherche immobilière idéale..."
                      disabled={!consentGiven && !consent}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAnalysis();
                        }
                      }}
                    />
                    <button 
                      onClick={handleAnalysis}
                      disabled={!consent || !agenticQuery.trim() || isAnalyzing}
                      className="px-6 py-3 bg-primary text-white rounded-lg disabled:opacity-50 font-medium"
                    >
                      {isAnalyzing ? 'Analyse...' : 'Analyser'}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* PANNEAU RÉSULTATS (droite) - Slide depuis la droite */}
              <div className={`results-panel border-l bg-gray-50 transition-all duration-500 ease-in-out overflow-hidden ${
                showResults ? 'w-1/2' : 'w-0'
              }`}>
                <div className="p-6 h-full overflow-y-auto">
                  <h3 className="text-2xl font-bold mb-6">Propriétés Correspondantes</h3>
                  
                  {/* Propriétés */}
                  <div className="space-y-4 mb-8">
                    {mockProperties.map((property, idx) => (
                      <PropertyResultCard 
                        key={idx} 
                        property={property}
                        onClick={() => {
                          setSelectedProperty(property as any);
                          setIsModalOpen(true);
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Optimisation Fiscale */}
                  <div className="fiscal-section bg-blue-50 p-6 rounded-lg">
                    <h4 className="text-lg font-bold mb-3">
                      📊 Scénario d'Optimisation Fiscale
                    </h4>
                    <p className="text-sm text-gray-700 mb-4">
                      Basé sur votre profil de résident fiscal français avec un budget de 250 000€...
                    </p>
                    <button className="text-blue-600 font-medium underline">
                      Créer un compte pour l'analyse complète →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* KPIs Marché Immobilier - masqués si chat actif */}
        {!showResults && <CountUpStats />}

        <section
          id="why-enki"
          className="bg-background -mt-px px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto">
            <TabsFeaturesAlt5Accordion />
          </div>
        </section>
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
             className="absolute inset-0 flex items-center justify-center text-white swaarg-section-title text-center px-6"
             initial={{ opacity: 0, x: 100 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
           >
            Experience Timeless Elegance, Premium Living in your Dream Home
          </motion.div>
        </motion.section>
        {/* Projets Vedette */}
        <section id="featured-projects" className="py-24 md:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <motion.h2
                className="swaarg-section-title text-primary mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Projets Vedette
              </motion.h2>
              <motion.p
                className="swaarg-body-large max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Découvrez notre sélection exclusive de programmes immobiliers d'exception, choisis pour leur emplacement privilégié, leur architecture remarquable et leur potentiel d'investissement.
              </motion.p>
            </motion.div>
            <FeaturedProjectsCarousel 
              properties={featuredProperties.slice(0, 3)}
              onPropertyClick={(property) => {
                setSelectedProperty(property as any);
                setIsModalOpen(true);
              }}
              onTrackEvent={trackCustomEvent}
            />
          </div>
        </section>
        
        {/* Dernières Nouveautés */}
        <section className="py-24 md:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <motion.h2
                className="swaarg-section-title text-primary mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Dernières Nouveautés
              </motion.h2>
              <motion.p
                className="swaarg-body-large max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Les dernières opportunités d'investissement ajoutées à notre portefeuille exclusif.
              </motion.p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestProperties.map((property, index) => (
                <OptimizedPropertyCard 
                  key={property.id} 
                  property={property as any}
                  onSelect={() => {
                    trackCustomEvent('latest_property_clicked', {
                      property_id: property.id,
                      property_title: property.title,
                      property_location: property.location,
                    });
                    setSelectedProperty(property as any);
                    setIsModalOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Property Modal */}
      <PropertyModal 
        property={selectedProperty} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

    </>
  );
};

export default Home;