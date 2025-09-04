import { useState, lazy, Suspense, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Property } from '@/lib/supabase';
import { useSupabaseProperties } from '@/hooks/useSupabaseProperties';
import { useDebounce } from '@/hooks/useDebounce';
import { 
  Search, MapPin, TrendingUp, Brain, UserPlus, Shield, Award, Users, 
  Star, Download, Save, Eye, Heart, ArrowRight, Building, Home as HomeIcon
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

const Home = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agenticQuery, setAgenticQuery] = useState('');
  const [consent, setConsent] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  
  // Debounce search query for performance
  const debouncedQuery = useDebounce(agenticQuery, 300);
  
  // Load properties from Supabase
  const { properties, loading, error } = useSupabaseProperties();
  
  // Memoized property selections for performance
  const { featuredProperties, latestProperties, premiumProperties } = useMemo(() => ({
    featuredProperties: properties.slice(0, 3),
    latestProperties: properties.slice(3, 8),
    premiumProperties: properties.slice(8, 12)
  }), [properties]);

  useEffect(() => {
    trackPageView('/', 'Accueil - ENKI-REALTY Immobilier Premium Chypre');
    trackCustomEvent('home_viewed', { user_authenticated: !!isAuthenticated });
  }, [isAuthenticated]);

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

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
        description: `${data.total_properties || 0} propriétés trouvées avec analyse fiscale`,
      });
      trackCustomEvent('agentic_search_completed', {
        query_length: agenticQuery.length,
        properties_found: data.total_properties || 0,
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

  const features = [
    {
      icon: TrendingUp,
      title: 'Commissions 5%',
      description: 'Commissions transparentes et compétitives pour tous nos services',
      badge: 'Commission'
    },
    {
      icon: Brain,
      title: 'Optimisation Fiscale AI',
      description: 'Intelligence artificielle pour optimiser votre fiscalité immobilière',
      badge: 'AI Powered'
    },
    {
      icon: Shield,
      title: 'Expertise Locale',
      description: 'Connaissance approfondie du marché immobilier chypriote',
      badge: 'Expert'
    },
    {
      icon: Award,
      title: 'Service Premium',
      description: 'Accompagnement personnalisé de A à Z dans votre projet',
      badge: 'Premium'
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
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Background Image with Parallax Effect */}
          <motion.div 
            className="absolute inset-0 z-0"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${cyprusHero})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-primary/40" />
          </motion.div>

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Main Heading avec fade-in */}
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

              {/* Subtitle avec reveal */}
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
                      placeholder="Ex: 'Suisse, 500k CHF budget investissement Chypre – options fiscales optimisées ?'"
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
                      className="w-full sm:w-auto px-12 py-4 text-lg font-semibold bg-primary hover:bg-primary-hover text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
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
                  className="text-center relative"
                >
                  {/* Badge */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white text-xs px-2 py-1 rounded-full font-semibold">
                      {feature.badge}
                    </span>
                  </div>
                  
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-premium rounded-full flex items-center justify-center mt-4">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
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

        {/* Projets Vedette Section */}
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
                Projets Vedette
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Nos programmes immobiliers les plus prisés, sélectionnés pour leur excellence 
                et leur potentiel d'investissement exceptionnel.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="cursor-pointer"
                  onClick={() => handlePropertySelect(property)}
                >
                  <PropertyCard 
                    property={property} 
                    index={index}
                  />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <Button size="lg" className="btn-premium" asChild>
                <Link to="/projects">
                  <Building className="w-5 h-5 mr-2" />
                  Voir tous nos projets
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Dernières Nouveautés Section */}
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
                Les propriétés les plus récentes de notre portefeuille, 
                avec des opportunités d'investissement uniques et exclusives.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
              {latestProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="cursor-pointer"
                  onClick={() => handlePropertySelect(property)}
                >
                  <PropertyCard 
                    property={property} 
                    index={index}
                  />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <Button size="lg" variant="outline" className="btn-outline-premium" asChild>
                <Link to="/search">
                  <Eye className="w-5 h-5 mr-2" />
                  Explorer toutes les nouveautés
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Explorer Carte Section */}
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
                Explorer Carte
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Découvrez l'emplacement exact de nos propriétés à travers Chypre. 
                Carte interactive avec clustering intelligent pour une exploration optimale.
              </p>
            </motion.div>

            {/* Interactive Google Maps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-xl overflow-hidden shadow-lg"
            >
              <ErrorBoundary>
                <Suspense fallback={
                  <div className="w-full h-[600px] flex items-center justify-center bg-muted rounded-xl">
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"
                      />
                      <p className="text-muted-foreground">Chargement de la carte Google Maps...</p>
                    </div>
                  </div>
                }>
                  {loading ? (
                    <div className="w-full h-[600px] flex items-center justify-center bg-muted rounded-xl">
                      <div className="text-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"
                        />
                        <p className="text-muted-foreground">Chargement des propriétés...</p>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="w-full h-[600px] flex items-center justify-center bg-destructive/10 rounded-xl text-destructive">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 mx-auto mb-4 text-destructive/50" />
                        <p>Erreur de chargement: {error}</p>
                      </div>
                    </div>
                  ) : (
                    <GoogleMapComponent 
                      properties={properties}
                      onPropertySelect={handlePropertySelect}
                      height="600px"
                      center={{ lat: 35.1264, lng: 33.4299 }}
                      zoom={9}
                    />
                  )}
                </Suspense>
              </ErrorBoundary>
            </motion.div>
          </div>
        </section>

        {/* Modal des Résultats de Recherche Agentique */}
        {showResultsModal && searchResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowResultsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-foreground">Résultats de Recherche</h3>
                  <Button variant="outline" onClick={() => setShowResultsModal(false)}>
                    Fermer
                  </Button>
                </div>

                {/* Propriétés Trouvées */}
                {searchResults.properties && (
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold mb-4">Propriétés Correspondantes ({searchResults.total_properties})</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {searchResults.properties.map((property: any, index: number) => (
                        <motion.div
                          key={property.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.02 }}
                          transition={{ delay: index * 0.1 }}
                          className="border rounded-lg p-4 cursor-pointer hover:shadow-lg"
                          onClick={() => handlePropertySelect(property)}
                        >
                          {property.photos?.[0] && (
                            <img 
                              src={property.photos[0]} 
                              alt={property.title}
                              className="w-full h-32 object-cover rounded mb-3"
                              loading="lazy"
                            />
                          )}
                          <h5 className="font-semibold text-sm mb-1">{property.title}</h5>
                          <p className="text-primary font-bold text-sm">{property.price?.toLocaleString()} €</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Analyse Fiscale */}
                {searchResults.fiscal_analysis && (
                  <div className="mb-8 p-4 bg-muted/30 rounded-lg">
                    <h4 className="text-lg font-semibold mb-3">Analyse Fiscale</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Économies fiscales estimées:</strong> {searchResults.fiscal_analysis.tax_saved?.toLocaleString()} €</p>
                      <p><strong>Taux effectif:</strong> {searchResults.fiscal_analysis.effective_rate}%</p>
                      {searchResults.fiscal_analysis.recommendations && (
                        <div>
                          <strong>Recommandations:</strong>
                          <ul className="list-disc pl-5 mt-1">
                            {searchResults.fiscal_analysis.recommendations.map((rec: string, idx: number) => (
                              <li key={idx}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {searchResults.pdf_url && (
                    <Button onClick={handleDownloadPDF} className="btn-premium">
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger PDF
                    </Button>
                  )}
                  {isAuthenticated && (
                    <Button 
                      onClick={handleSaveDossier} 
                      variant="outline"
                      disabled={saveDossierMutation.isPending}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Sauvegarder Dossier
                    </Button>
                  )}
                  {!isAuthenticated && (
                    <Button variant="outline" asChild>
                      <Link to="/register">
                        <UserPlus className="w-4 h-4 mr-2" />
                        S'inscrire pour sauvegarder
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Inscription CTA Section - Visible only for non-authenticated users */}
        {!isAuthenticated && (
          <section className="py-16 bg-accent/30">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Rejoignez ENKI-REALTY
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Créez votre compte pour sauvegarder vos recherches, recevoir des alertes personnalisées 
                  et accéder à nos propriétés exclusives.
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button 
                    size="lg" 
                    asChild
                    className="btn-premium"
                  >
                    <Link to="/register">
                      <UserPlus className="w-5 h-5 mr-2" />
                      S'inscrire gratuitement
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </section>
        )}

        {/* CTA Final Section */}
        <section className="py-20 bg-gradient-hero">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-white space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold">
                Prêt à investir à Chypre ?
              </h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Contactez nos experts pour une consultation personnalisée 
                et découvrez les meilleures opportunités d'investissement avec ENKI-REALTY.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button 
                    size="lg" 
                    className="bg-white text-primary hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-lg"
                    asChild
                  >
                    <Link to="/contact">
                      <Users className="w-5 h-5 mr-2" />
                      Consultation gratuite
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Télécharger la brochure
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Property Modal */}
        <PropertyModal 
          property={selectedProperty}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </>
  );
};

export default Home;