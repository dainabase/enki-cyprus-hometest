import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Home: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isClient = useIsClient();

  // Refs for GSAP animations
  const heroRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const whyRef = useRef<HTMLElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Debounced search
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Queries
  const { properties = [], loading: propertiesLoading } = useSupabaseProperties();
  const { data: interests = {} } = useQuery({
    queryKey: ['interests'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('fetch-interests');
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Agentic search mutation
  const agenticSearchMutation = useMutation({
    mutationFn: async (query: string) => {
      const { data, error } = await supabase.functions.invoke('agentic-search', {
        body: { query }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setSearchResults(data.results || []);
      setIsSearchModalOpen(true);
      trackCustomEvent('search_submitted', { query: debouncedSearchQuery });
      toast({
        title: "Recherche terminée",
        description: `${data.results?.length || 0} projets trouvés`,
      });
    },
    onError: (error) => {
      console.error('Search error:', error);
      toast({
        title: "Erreur de recherche",
        description: "Une erreur est survenue lors de la recherche",
        variant: "destructive",
      });
    }
  });

  // Handlers
  const debouncedHandleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!searchQuery.trim()) {
      toast({
        title: "Veuillez saisir une recherche",
        description: "Décrivez votre projet immobilier souhaité",
        variant: "destructive",
      });
      return;
    }
    agenticSearchMutation.mutate(searchQuery);
  }, [searchQuery, agenticSearchMutation, toast]);

  const handleInterestClick = useCallback((interest: any) => {
    if (interest.link) {
      window.open(interest.link, '_blank');
    }
  }, []);

  // GSAP ScrollTrigger animations
  useEffect(() => {
    if (!isClient || !heroRef.current || !titleRef.current || !searchRef.current || !badgesRef.current) return;

    // Track page view
    trackPageView('home_viewed');

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop/tablet version (640px+)
      mm.add("(min-width: 640px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "+=200vh", // Espace pour phases + pause longue
            scrub: 1, // Smooth suivi scroll (duration-based)
            pin: false, // Activer par phase
            invalidateOnRefresh: true, // Recalcule on resize
            markers: false // Dev only
          }
        });

        // Phase 0: Initial load - Titre fade-in
        tl.fromTo(titleRef.current, 
          { opacity: 0, y: 50 }, 
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
        );

        // Parallax background
        if (bgRef.current) {
          tl.to(bgRef.current, { y: "30%", ease: "none", duration: 2 }, 0);
        }
        if (overlayRef.current) {
          tl.to(overlayRef.current, { y: "10%", ease: "none", duration: 2 }, 0);
        }

        // Phase 1 (progress 0.1-0.3): Search s'avance relief sur scroll down
        tl.to(searchRef.current, {
          y: "20%",
          scale: 1.05,
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          duration: 0.3,
          ease: "power2.out"
        });

        // Phase 2 (0.3-0.5): Recolle sur blanc
        tl.to(searchRef.current, {
          y: "50vh",
          duration: 0.2,
          ease: "linear"
        }, ">");

        // Phase 3 (0.5-0.7): Pause pinning
        tl.add(() => {
          ScrollTrigger.create({
            trigger: searchRef.current,
            start: "top 20%",
            end: "+=100vh", // Pause longue desktop
            pin: true,
            pinSpacing: true,
            invalidateOnRefresh: true
          });
        });

        // Phase 4 (0.7+): Déblocage descente/disparition
        tl.to(searchRef.current, {
          y: "100vh",
          opacity: 0,
          scale: 0.95,
          duration: 0.5,
          ease: "power2.in"
        });

        // Reveal stagger Pourquoi (après déblocage)
        if (badgesRef.current?.children) {
          tl.fromTo(badgesRef.current.children,
            { opacity: 0, y: 50, stagger: 0.2 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
            ">"
          );
        }
      });

      // Mobile version (max-width: 639px) - Ajustements
      mm.add("(max-width: 639px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "+=100vh", // Espace plus court mobile
            scrub: 1,
            pin: false,
            invalidateOnRefresh: true,
            markers: false
          }
        });

        // Phase 0: Initial load - Titre fade-in
        tl.fromTo(titleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
        );

        // Parallax background (moins prononcé mobile)
        if (bgRef.current) {
          tl.to(bgRef.current, { y: "20%", ease: "none", duration: 2 }, 0);
        }
        if (overlayRef.current) {
          tl.to(overlayRef.current, { y: "5%", ease: "none", duration: 2 }, 0);
        }

        // Phase 1: Search s'avance relief (moins prononcé)
        tl.to(searchRef.current, {
          y: "10%",
          scale: 1.02,
          boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
          duration: 0.3,
          ease: "power2.out"
        });

        // Phase 2: Recolle sur blanc
        tl.to(searchRef.current, {
          y: "30vh",
          duration: 0.2,
          ease: "linear"
        }, ">");

        // Phase 3: Pause courte mobile
        tl.add(() => {
          ScrollTrigger.create({
            trigger: searchRef.current,
            start: "top 30%",
            end: "+=50vh", // Pause courte mobile
            pin: true,
            pinSpacing: true,
            invalidateOnRefresh: true
          });
        });

        // Phase 4: Déblocage
        tl.to(searchRef.current, {
          y: "80vh",
          opacity: 0,
          scale: 0.98,
          duration: 0.4,
          ease: "power2.in"
        });

        // Reveal stagger badges
        if (badgesRef.current?.children) {
          tl.fromTo(badgesRef.current.children,
            { opacity: 0, y: 30, stagger: 0.15 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
            ">"
          );
        }
      });

      return mm;
    });

    // Refresh on resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      ctx.revert();
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.killAll();
    };
  }, [isClient]);

  // Add willChange transform for performance
  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.style.willChange = 'transform';
    }
    if (bgRef.current) {
      bgRef.current.style.willChange = 'transform';
    }
    if (overlayRef.current) {
      overlayRef.current.style.willChange = 'transform';
    }
  }, []);

  const featuredProperties = properties.slice(0, 3);

  return (
    <>
      <SEOHead
        title="Découvrez les Meilleurs Projets Immobiliers à Chypre | ENKI-REALTY"
        description="Trouvez votre projet immobilier idéal à Chypre avec ENKI-REALTY. Commissions 5%, optimisation fiscale AI, expertise locale et service premium."
        keywords="immobilier Chypre, investissement Chypre, Limassol, Paphos, propriété Chypre, optimisation fiscale"
        image="/og-image.jpg"
      />

      <div className="relative min-h-screen bg-gray-100">
        {/* Hero section */}
        <section ref={heroRef} className="relative h-screen overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            ref={bgRef}
            style={{ backgroundImage: `url(${cyprusHero})` }}
          />
          <div 
            className="absolute inset-0 bg-gradient-to-b from-transparent to-white/50" 
            ref={overlayRef} 
          />
          
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 text-center z-10" ref={titleRef}>
            <h1 className="text-4xl md:text-6xl font-bold text-blue-900">
              Découvrez les Meilleurs Projets Immobiliers à Chypre
            </h1>
          </div>
          
          <div 
            ref={searchRef} 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 p-6 rounded-xl shadow-md max-w-md w-full mx-auto z-20 sm:max-w-sm"
          >
            <Textarea
              rows={3}
              placeholder="Ex: 'Suisse, 500K CHF de budget, investissement Chypre a Limassol et alentour environ 10km, options fiscales optimisées et scénarios possibles'"
              className="w-full border rounded p-2"
              onChange={debouncedHandleChange}
            />
            <Button
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:scale-105 transition"
              onClick={handleSubmit}
              disabled={agenticSearchMutation.isPending}
            >
              {agenticSearchMutation.isPending ? 'Recherche...' : 'Rechercher'}
            </Button>
          </div>
        </section>

        {/* Section blanche Pourquoi choisir */}
        <section className="py-12 bg-white" ref={whyRef}>
          <h2 className="text-3xl text-center mb-8">Pourquoi choisir ENKI-REALTY</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4" ref={badgesRef}>
            <div className="p-4 border rounded text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              Commissions 5%
            </div>
            <div className="p-4 border rounded text-center">
              <Brain className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              Optimisation fiscale AI magnifique
            </div>
            <div className="p-4 border rounded text-center">
              <Shield className="w-8 h-8 mx-auto mb-2 text-green-500" />
              Expertise locale
            </div>
            <div className="p-4 border rounded text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              Service premium
            </div>
          </div>
        </section>

        {/* Projets Vedette Section */}
        <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-blue-900 mb-4">Projets Vedette</h2>
              <p className="text-xl text-blue-700">Découvrez nos meilleures opportunités d'investissement</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer"
                  onClick={() => setSelectedProperty(property)}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Google Maps Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-blue-900 mb-4">Explorer la Carte</h2>
              <p className="text-xl text-blue-700">Localisez tous nos projets à Chypre</p>
            </motion.div>

            <ErrorBoundary fallback={<div className="text-center text-gray-500">Carte non disponible</div>}>
              <div className="h-96 rounded-xl overflow-hidden shadow-lg">
                {/* Google Map placeholder - vous pouvez intégrer votre composant GoogleMap ici */}
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                    <p className="text-gray-600">Carte Google Maps</p>
                    <p className="text-sm text-gray-500">Centrée sur Chypre (35.1264, 33.4299)</p>
                  </div>
                </div>
              </div>
            </ErrorBoundary>
          </div>
        </section>

        {/* Agentic Search Modal */}
        <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Résultats de recherche</DialogTitle>
              <DialogDescription>
                {searchResults.length} projet(s) trouvé(s) correspondant à votre recherche
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((result, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{result.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{result.location}</p>
                    <p className="text-lg font-bold text-blue-600">{result.price}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Property Modal */}
        <PropertyModal
          property={selectedProperty}
          isOpen={!!selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      </div>
    </>
  );
};

export default Home;