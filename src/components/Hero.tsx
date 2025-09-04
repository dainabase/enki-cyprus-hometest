import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Search, MapPin, TrendingUp, Brain, UserPlus } from 'lucide-react';
import cyprusHero from '@/assets/cyprus-hero.jpg';
import { useABTestVariant } from '@/hooks/useABTest';
import { trackCustomEvent } from '@/lib/analytics';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AgenticSearchModal from '@/components/AgenticSearchModal';


const Hero = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [agenticQuery, setAgenticQuery] = useState('');
  const [consent, setConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { value: ctaText, variant } = useABTestVariant(
    'hero_cta_button',
    'Découvrez Projets',
    'Trouvez Votre Bien'
  );

  const handleAgenticSearch = async () => {
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

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('agentic-search', {
        body: { 
          query: agenticQuery, 
          consent: consent 
        }
      });

      if (error) throw error;

      setSearchResults(data);
      setShowModal(true);
      
      toast({
        title: "Recherche complétée",
        description: `${data.total_properties} propriétés trouvées avec analyse fiscale`,
      });

      trackCustomEvent('agentic_search_completed', {
        query_length: agenticQuery.length,
        properties_found: data.total_properties,
        has_auth: isAuthenticated
      });

    } catch (error) {
      console.error('Erreur recherche agentique:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la recherche. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCTAClick = () => {
    trackCustomEvent('hero_cta_clicked', {
      variant: variant,
      button_text: ctaText
    });
  };

  const examplePlaceholder = "Exemple : 'Je suis un homme habitant en Suisse avec un budget de 500 000 CHF pour un bien d'investissement à Chypre. Proposez-moi des options optimisées fiscalement avec règles d'achat et création société si nécessaire.'";

  const isFormValid = agenticQuery.trim() && consent;

  return (
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
          {/* Main Heading */}
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Découvrez l'immobilier
            <span className="block text-transparent bg-gradient-to-r from-white to-blue-200 bg-clip-text">
              premium à Chypre
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Votre partenaire de confiance pour acquérir des propriétés d'exception 
            dans le paradis méditerranéen de Chypre
          </motion.p>

          {/* Stats */}
          <motion.div 
            className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 my-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="flex items-center space-x-2 text-white">
              <MapPin className="w-5 h-5 text-blue-200" />
              <span className="text-lg font-medium">5+ villes couvertes</span>
            </div>
            <div className="flex items-center space-x-2 text-white">
              <TrendingUp className="w-5 h-5 text-blue-200" />
              <span className="text-lg font-medium">500+ propriétés</span>
            </div>
            <div className="flex items-center space-x-2 text-white">
              <Search className="w-5 h-5 text-blue-200" />
              <span className="text-lg font-medium">Recherche intelligente</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={handleCTAClick}
            >
              <Search className="w-5 h-5 mr-2" />
              {ctaText}
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold transition-all duration-300"
            >
              Découvrir nos projets
            </Button>
          </motion.div>

          {/* Formulaire de Recherche Agentique */}
          <motion.div 
            className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div className="flex items-center justify-center space-x-2 text-white mb-6">
              <Brain className="w-6 h-6 text-blue-200" />
              <span className="font-medium text-lg">Faire une recherche agentique pour mon projet immobilier</span>
            </div>
            
            <div className="bg-white/5 rounded-lg border border-white/10 p-6">
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {/* Textarea principale */}
                <div className="space-y-2">
                  <Label htmlFor="agenticQuery" className="text-white text-sm font-medium">
                    Décrivez votre projet immobilier en détail
                  </Label>
                  <Textarea
                    id="agenticQuery"
                    value={agenticQuery}
                    onChange={(e) => setAgenticQuery(e.target.value)}
                    placeholder={examplePlaceholder}
                    className="min-h-[120px] bg-white/90 text-gray-900 border-white/20 placeholder-gray-500 resize-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                    rows={5}
                  />
                </div>

                {/* Consent checkbox */}
                <motion.div 
                  className="flex items-start space-x-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
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

                {/* Search Button */}
                <motion.div 
                  className="text-center space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <motion.div
                    whileHover={{ scale: isFormValid ? 1.05 : 1 }}
                    whileTap={{ scale: isFormValid ? 0.98 : 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button
                      onClick={handleAgenticSearch}
                      disabled={!isFormValid || isLoading}
                      size="lg"
                      className="px-12 py-4 text-lg font-semibold bg-primary hover:bg-primary-hover text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    >
                      {isLoading ? (
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
                          <Brain className="w-5 h-5 mr-2" />
                          Lancer Recherche Agentique
                        </>
                      )}
                    </Button>
                  </motion.div>

                  {/* CTA Inscription */}
                  {!isAuthenticated && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.9 }}
                      className="pt-4 border-t border-white/20"
                    >
                      <p className="text-sm text-blue-100 mb-3">
                        Créez un compte pour sauvegarder vos recherches et recevoir des alertes
                      </p>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <Button
                          variant="outline"
                          asChild
                          className="border-white/30 text-white bg-white/10 hover:bg-white/20"
                        >
                          <Link to="/register">
                            <UserPlus className="w-4 h-4 mr-2" />
                            S'inscrire pour personnaliser
                          </Link>
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Modal des résultats */}
          <AgenticSearchModal 
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            results={searchResults}
          />
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
  );
};

export default Hero;