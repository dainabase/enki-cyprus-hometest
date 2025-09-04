import { useState, lazy, Suspense, useEffect, useMemo, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
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
  Search, MapPin, TrendingUp, Brain, UserPlus, Shield, Award, Users, 
  Star, Download, Save, Eye, Heart, ArrowRight, Building, Home as HomeIcon,
  Trophy, Briefcase, Target, ExternalLink, Clock, Sparkles
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

const GoogleMapComponent = lazy(() => import('@/components/GoogleMap'));

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
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const { scrollY } = useScroll();
  
  // Parallax transforms
  const heroY = useTransform(scrollY, [0, 600], [0, -200]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.8]);
  
  // Debounce search query for performance
  const debouncedQuery = useDebounce(agenticQuery, 300);
  
  // Load properties from Supabase
  const { properties, loading, error } = useSupabaseProperties();
  
  // Memoized property selections for performance
  const { featuredProperties, latestProperties } = useMemo(() => ({
    featuredProperties: properties.slice(0, 3),
    latestProperties: properties.slice(3, 8)
  }), [properties]);

  useEffect(() => {
    trackPageView('/', 'Accueil - ENKI-REALTY Immobilier Premium Chypre');
    trackCustomEvent('home_viewed', { user_authenticated: !!isAuthenticated });
  }, [isAuthenticated]);

  // Auto-advance carousel
  useEffect(() => {
    if (featuredProperties.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % featuredProperties.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [featuredProperties.length]);

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
      console.error('Erreur recherche agentique:', error);
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
      description: 'Commissions transparentes et compétitives pour tous nos services immobiliers',
      badge: 'Commission'
    },
    {
      icon: Brain,
      title: 'Optimisation fiscale AI magnifique',
      description: 'Intelligence artificielle avancée pour maximiser vos avantages fiscaux',
      badge: 'AI Powered'
    },
    {
      icon: Shield,
      title: 'Expertise locale',
      description: 'Connaissance approfondie du marché immobilier chypriote depuis 15 ans',
      badge: 'Expert'
    },
    {
      icon: Award,
      title: 'Service premium',
      description: 'Accompagnement VIP personnalisé de A à Z dans votre projet d\'investissement',
      badge: 'Premium'
    }
  ];

  // Mock interests for each featured property (in real app, these would come from DB)
  const mockInterests: Record<string, ProjectInterest[]> = {
    'limassol': [
      { name: 'Limassol Castle', link: 'https://en.wikipedia.org/wiki/Limassol_Castle', desc: 'Historical medieval castle' },
      { name: 'Limassol Marina', link: 'https://www.limassolmarina.com/', desc: 'Luxury yacht harbor' },
      { name: 'Molos Promenade', link: 'https://www.visitcyprus.com/index.php/en/discovercyprus/city/limassol/attractions-places-of-interest/308-molos-promenade-limassol', desc: 'Scenic seaside walk' },
      { name: 'Kolossi Castle', link: 'https://en.wikipedia.org/wiki/Kolossi_Castle', desc: 'Crusader fortress' },
      { name: 'Kourion', link: 'https://en.wikipedia.org/wiki/Kourion', desc: 'Ancient Greco-Roman site' }
    ],
    'paphos': [
      { name: 'Paphos Archaeological Park', link: 'https://en.wikipedia.org/wiki/Paphos_Archaeological_Park', desc: 'UNESCO World Heritage site' },
      { name: 'Tombs of the Kings', link: 'https://en.wikipedia.org/wiki/Tombs_of_the_Kings_(Paphos)', desc: 'Ancient underground tombs' },
      { name: 'Paphos Castle', link: 'https://en.wikipedia.org/wiki/Paphos_Castle', desc: 'Medieval fortress by the sea' },
      { name: 'Coral Bay', link: 'https://www.visitcyprus.com/index.php/en/discovercyprus/beaches/130-coral-bay-beach', desc: 'Beautiful sandy beach' },
      { name: 'Akamas Peninsula', link: 'https://en.wikipedia.org/wiki/Akamas', desc: 'Protected natural area' }
    ],
    'nicosia': [
      { name: 'Cyprus Museum', link: 'https://en.wikipedia.org/wiki/Cyprus_Museum', desc: 'National archaeological museum' },
      { name: 'Selimiye Mosque', link: 'https://en.wikipedia.org/wiki/Selimiye_Mosque_(Nicosia)', desc: 'Historic Gothic cathedral' },
      { name: 'Ledra Street', link: 'https://en.wikipedia.org/wiki/Ledra_Street', desc: 'Main shopping thoroughfare' },
      { name: 'Venetian Walls', link: 'https://en.wikipedia.org/wiki/Venetian_Walls_of_Nicosia', desc: 'Historic city fortifications' },
      { name: 'Archbishop\'s Palace', link: 'https://en.wikipedia.org/wiki/Archbishop%27s_Palace_(Nicosia)', desc: 'Neo-Byzantine architecture' }
    ]
  };

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
      <div className="min-h-screen">
        {/* Hero Section with Parallax */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <motion.div 
            style={{ y: heroY, opacity: heroOpacity }}
            className="absolute inset-0 z-0"
          >
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${cyprusHero})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-primary/40" />
          </motion.div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <motion.h1 
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Découvrez les Meilleurs
                <span className="block text-transparent bg-gradient-to-r from-white to-blue-200 bg-clip-text">
                  Projets Immobiliers à Chypre
                </span>
              </motion.h1>

              <motion.p 
                className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Votre partenaire de confiance pour investir dans l'immobilier premium 
                au cœur de la Méditerranée
              </motion.p>

              {/* Recherche Agentique Form */}
              <motion.div 
                className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <div className="flex items-center justify-center space-x-2 text-white mb-6">
                  <Brain className="w-6 h-6 text-blue-200" />
                  <span className="font-medium text-lg">Recherche Agentique Immobilière</span>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="agenticQuery" className="text-white text-sm font-medium text-left block">
                      Décrivez votre projet immobilier en détail
                    </Label>
                    <Textarea
                      id="agenticQuery"
                      value={agenticQuery}
                      onChange={(e) => setAgenticQuery(e.target.value)}
                      placeholder="Ex: 'Suisse, 500K CHF de budget, investissement Chypre a Limassol et alentour environ 10km, options fiscales optimisées et scénarios possibles'"
                      className="min-h-[120px] w-full bg-white/90 text-gray-900 border-white/20 placeholder-gray-500 resize-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                      rows={3}
                    />
                  </div>

                  <motion.div 
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1 }}
                  >
                    <Checkbox
                      id="consent"
                      checked={consent}
                      onCheckedChange={(checked) => setConsent(!!checked)}
                      className="mt-1 border-white/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label 
                      htmlFor="consent" 
                      className="text-sm text-blue-100 leading-relaxed cursor-pointer"
                    >
                      J'accepte le traitement de mes données personnelles pour recevoir une recherche personnalisée 
                      et des recommandations immobilières adaptées (conforme RGPD)
                    </Label>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: agenticQuery.trim() && consent ? 1.05 : 1 }}
                    whileTap={{ scale: agenticQuery.trim() && consent ? 0.98 : 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button
                      onClick={handleAgenticSearch}
                      disabled={!agenticQuery.trim() || !consent || agenticSearchMutation.isPending}
                      size="lg"
                      className="w-full sm:w-auto px-12 py-4 text-lg font-semibold bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    >
                      {agenticSearchMutation.isPending ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                          />
                          Analyse en cours...
                        </>
                      ) : (
                        <>
                          <Search className="w-5 h-5 mr-2" />
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
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <motion.div 
              className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div 
                className="w-1 h-2 bg-white rounded-full mt-2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </section>

        {/* Pourquoi Choisir Section */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Pourquoi Choisir ENKI-REALTY ?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Excellence, innovation et expertise locale pour votre réussite immobilière à Chypre
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ 
                    y: -10,
                    transition: { type: "spring", stiffness: 300, damping: 20 }
                  }}
                  className="text-center relative group"
                >
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white text-xs px-2 py-1 rounded-full font-semibold">
                      {feature.badge}
                    </span>
                  </div>
                  
                  <motion.div 
                    className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mt-4 group-hover:scale-110 transition-all duration-300"
                    whileHover={{ scale: 1.2, rotateY: 180 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Projets Vedette 3D Carousel */}
        <section className="py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Projets Vedette
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Nos programmes immobiliers les plus prisés avec centres d'intérêt locaux
              </p>
            </motion.div>

            {/* 3D Carousel Container */}
            <div className="relative h-[600px] w-full mb-16">
              <AnimatePresence mode="wait">
                {featuredProperties.map((property, index) => {
                  const isActive = index === currentSlide;
                  const isNext = index === (currentSlide + 1) % featuredProperties.length;
                  const isPrev = index === (currentSlide - 1 + featuredProperties.length) % featuredProperties.length;
                  
                  if (!isActive && !isNext && !isPrev) return null;
                  
                  const locationKey = property.location?.city?.toLowerCase() || 'limassol';
                  const interests = mockInterests[locationKey] || mockInterests['limassol'];

                  return (
                    <motion.div
                      key={property.id}
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                      animate={{
                        opacity: isActive ? 1 : 0.6,
                        scale: isActive ? 1 : 0.8,
                        rotateY: isActive ? 0 : (isNext ? 30 : -30),
                        x: isActive ? 0 : (isNext ? 200 : -200),
                        z: isActive ? 0 : -100
                      }}
                      exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                      transition={{ 
                        duration: 0.8,
                        type: "spring",
                        stiffness: 100,
                        damping: 20
                      }}
                      style={{ perspective: 1000 }}
                    >
                      <div className="w-full max-w-4xl mx-auto flex flex-col lg:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">
                        {/* Main Image */}
                        <motion.div 
                          className="lg:w-2/3 relative"
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <img
                            src={property.photos?.[0] || `https://picsum.photos/800/600?random=${property.id}`}
                            alt={property.title}
                            className="w-full h-64 lg:h-96 object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          <div className="absolute bottom-4 left-4 text-white">
                            <h3 className="text-2xl font-bold mb-2">{property.title}</h3>
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="w-4 h-4" />
                              <span>{property.location?.city || property.location}</span>
                            </div>
                            <div className="text-xl font-semibold text-primary-foreground">
                              {property.price}
                            </div>
                          </div>
                        </motion.div>

                        {/* Sidebar with Interests */}
                        <div className="lg:w-1/3 p-6 bg-muted/20">
                          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" />
                            Centres d'intérêt
                          </h4>
                          <div className="space-y-3">
                            {interests.map((interest, idx) => (
                              <motion.button
                                key={idx}
                                onClick={() => handleInterestClick(interest)}
                                className="w-full text-left p-3 rounded-lg bg-white hover:bg-primary/10 border border-border transition-all duration-200 group"
                                whileHover={{ 
                                  scale: 1.02,
                                  transition: { type: "spring", stiffness: 400, damping: 10 }
                                }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h5 className="font-medium text-sm text-foreground mb-1 group-hover:text-primary transition-colors">
                                      {interest.name}
                                    </h5>
                                    <p className="text-xs text-muted-foreground">
                                      {interest.desc}
                                    </p>
                                  </div>
                                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0 ml-2" />
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Navigation Dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {featuredProperties.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'bg-primary' : 'bg-primary/30'
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Dernières Nouveautés */}
        <section className="py-20 bg-muted/30">
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
                Les nouveaux projets qui viennent d'arriver sur le marché
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {latestProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ 
                    y: -10,
                    transition: { type: "spring", stiffness: 300, damping: 20 }
                  }}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedProperty(property);
                    setIsModalOpen(true);
                  }}
                >
                  <PropertyCard 
                    property={property} 
                    index={index}
                    className="h-full"
                  />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mt-12"
            >
              <Button size="lg" asChild className="btn-premium">
                <Link to="/search">
                  <Eye className="w-5 h-5 mr-2" />
                  Voir tous les projets
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Explorer Carte */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Explorer par Région
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Découvrez nos propriétés géolocalisées à travers Chypre
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="rounded-2xl overflow-hidden shadow-2xl"
            >
              <ErrorBoundary>
                <Suspense fallback={
                  <div className="h-96 bg-muted flex items-center justify-center">
                    <div className="text-center">
                      <Map className="w-12 h-12 mx-auto mb-4 text-primary" />
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
                    className="h-96 w-full"
                  />
                </Suspense>
              </ErrorBoundary>
            </motion.div>
          </div>
        </section>

        {/* Agentic Search Results Modal */}
        <Dialog open={showResultsModal} onOpenChange={setShowResultsModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Brain className="w-6 h-6 text-primary" />
                Résultats de Recherche Agentique
              </DialogTitle>
              <DialogDescription>
                Analyse complète basée sur votre demande: "{agenticQuery}"
              </DialogDescription>
            </DialogHeader>
            
            {searchResults && (
              <div className="space-y-6">
                {/* Properties Found */}
                {searchResults.properties && searchResults.properties.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Propriétés Recommandées</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {searchResults.properties.map((property: any, index: number) => (
                        <motion.div
                          key={property.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          className="border border-border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all"
                          onClick={() => {
                            setSelectedProperty(property);
                            setShowResultsModal(false);
                            setIsModalOpen(true);
                          }}
                        >
                          <img
                            src={property.photos?.[0] || `https://picsum.photos/300/200?random=${property.id}`}
                            alt={property.title}
                            className="w-full h-32 object-cover rounded mb-3"
                            loading="lazy"
                          />
                          <h4 className="font-semibold">{property.title}</h4>
                          <p className="text-sm text-muted-foreground">{property.location}</p>
                          <p className="text-lg font-bold text-primary mt-2">{property.price}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lexaia Analysis */}
                {searchResults.lexaia_analysis && (
                  <div className="bg-muted/50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Analyse Fiscale Personnalisée</h3>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-muted-foreground">
                        {searchResults.lexaia_analysis.summary || "Analyse fiscale en cours de génération..."}
                      </p>
                      {searchResults.lexaia_analysis.tax_scenarios && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Scénarios d'optimisation:</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {searchResults.lexaia_analysis.tax_scenarios.map((scenario: string, index: number) => (
                              <li key={index} className="text-sm">{scenario}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {searchResults.pdf_url && (
                    <Button onClick={handleDownloadPDF} className="btn-premium">
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger le PDF
                    </Button>
                  )}
                  
                  {isAuthenticated && (
                    <Button 
                      onClick={handleSaveDossier}
                      variant="outline"
                      disabled={saveDossierMutation.isPending}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saveDossierMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder le dossier'}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Property Modal */}
        {selectedProperty && (
          <PropertyModal
            property={selectedProperty}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedProperty(null);
            }}
          />
        )}
      </div>
    </>
  );
};

export default Home;