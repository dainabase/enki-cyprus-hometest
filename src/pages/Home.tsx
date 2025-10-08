import { useState, lazy, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Property } from '@/lib/supabase';
import { useSupabaseProperties } from '@/hooks/useSupabaseProperties';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { SEOHead } from '@/components/SEOHead';
import { trackPageView, trackCustomEvent } from '@/lib/analytics';
import OptimizedPropertyCard from '@/components/ui/OptimizedPropertyCard';
import PropertyModal from '@/components/PropertyModal';
import FeaturedProjectsCarousel from '@/components/FeaturedProjectsCarousel';
import { useIsClient } from '@/hooks/useIsClient';
import TabsFeaturesAlt5Accordion from '@/components/TabsFeatures-Alternative5-Accordion';
import { CountUpStats } from '@/components/CountUpStats';
import Alternative3 from '@/components/hero/Alternative3';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import { ProjectInterest } from '@/types/project.types';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { ResultsPanel } from '@/components/search/ResultsPanel';
import { useSearchAnalysis } from '@/hooks/useSearchAnalysis';
import SmartTrustBar from '@/components/hero/SmartTrustBar';
const GoogleMapComponent = lazy(() => import('@/components/GoogleMap'));

const Home = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTrustBar, setShowTrustBar] = useState(true);
  const assistantTitleRef = useRef<HTMLHeadingElement>(null);

  const searchAnalysis = useSearchAnalysis();
  const { isAuthenticated } = useAuth();
  const isClient = useIsClient();
  const { properties, loading, error } = useSupabaseProperties();
  
  // Ensure properties is always an array
  const safeProperties = Array.isArray(properties) ? properties : [];
  
  // Dynamic interests fetch
  const { data: interests } = useQuery({
    queryKey: ['interests', safeProperties],
    queryFn: async () => {
      const uniqueLocations = Array.from(new Set(safeProperties.map((p: Property) =>
        typeof p.location === 'string' ? p.location.toLowerCase() : (p.location as any)?.city?.toLowerCase() || 'limassol'
      )));
      const interestsData: Record<string, ProjectInterest[]> = {};
      for (const location of uniqueLocations) {
        const { data } = await supabase.functions.invoke('fetch-interests', {
          body: { location }
        });
        interestsData[location] = Array.isArray(data) ? data : [];
      }
      return interestsData;
    },
    enabled: safeProperties.length > 0,
  });
  
  // Ensure interests is always an object
  const safeInterests = interests || {};
  
  const featuredProperties = useMemo(() => safeProperties.slice(0, 3), [safeProperties]);
  const latestProperties = useMemo(() => safeProperties.slice(3, 8), [safeProperties]);

  useEffect(() => {
    trackPageView('/', 'Accueil - ENKI-REALTY Immobilier Premium Chypre');
    trackCustomEvent('home_viewed', { user_authenticated: !!isAuthenticated });
  }, [isAuthenticated]);

  useEffect(() => {
    const searchClicked = localStorage.getItem('search-clicked') === 'true';
    if (searchClicked) {
      setShowTrustBar(true);
    }

    const handleSearchClicked = () => {
      setShowTrustBar(true);
    };

    window.addEventListener('search-clicked', handleSearchClicked);
    return () => window.removeEventListener('search-clicked', handleSearchClicked);
  }, []);

  const handlePropertyClick = useCallback((property: any) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  }, []);
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
     
      <div className="min-h-screen overflow-x-hidden bg-white">
        <div className="space-y-0">
          <Alternative3 />
        </div>

        <SmartTrustBar
          isVisible={showTrustBar}
          targetRef={assistantTitleRef}
        />

        {/* Interface Split-View : Chat + Panneau Résultats */}
        <section id="start-experience" className="py-24 md:py-32 px-4 min-h-screen bg-white">
          <div className="container mx-auto max-w-7xl">
            <h2
              ref={assistantTitleRef}
              className="swaarg-large-title text-center mb-8 text-primary"
            >
              Votre Assistant IA Immobilier
            </h2>

            {/* Container principal avec split view */}
            <div className="relative flex gap-0 h-[800px] border rounded-xl overflow-hidden bg-background shadow-xl">
              <ChatContainer
                messages={searchAnalysis.chatMessages.messages}
                agenticQuery={searchAnalysis.agenticQuery}
                consent={searchAnalysis.consent.consent}
                consentGiven={searchAnalysis.consent.consentGiven}
                shouldHighlightConsent={searchAnalysis.consent.shouldHighlightConsent}
                isAnalyzing={searchAnalysis.chatMessages.isAnalyzing}
                showResults={searchAnalysis.showResults}
                onQueryChange={searchAnalysis.setAgenticQuery}
                onConsentChange={searchAnalysis.handleConsentChange}
                onAnalysis={searchAnalysis.handleAnalysis}
              />

              <ResultsPanel
                showResults={searchAnalysis.showResults}
                properties={searchAnalysis.mockProperties}
                onPropertyClick={handlePropertyClick}
              />
            </div>
          </div>
        </section>

        {/* KPIs Marché Immobilier */}
        <CountUpStats />

        {/* Spacer between KPIs and Video */}
        <div className="py-16 bg-white"></div>

        {/* Premium Video Section */}
        <motion.section
          id="premium-video"
          className="py-0 bg-white w-full h-[45vh] relative overflow-hidden mt-24 md:mt-32"
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
              preload="metadata"
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
             className="absolute inset-0 flex items-center justify-center text-white swaarg-large-title text-center px-6"
             initial={{ opacity: 0, x: 100 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
           >
            Experience Timeless Elegance, Premium Living in your Dream Home
          </motion.div>
        </motion.section>

        {/* Spacer between Video and Why Enki */}
        <div className="py-16 bg-white"></div>

        <section
          id="why-enki"
          className="bg-background -mt-px px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto">
            <TabsFeaturesAlt5Accordion />
          </div>
        </section>
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
                className="swaarg-large-title text-primary mb-6"
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
              onPropertyClick={handlePropertyClick}
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
                className="swaarg-large-title text-primary mb-6"
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
              {latestProperties.map((property) => (
                <OptimizedPropertyCard
                  key={property.id}
                  property={property as any}
                  onSelect={() => {
                    trackCustomEvent('latest_property_clicked', {
                      property_id: property.id,
                      property_title: property.title,
                      property_location: property.location,
                    });
                    handlePropertyClick(property);
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <TestimonialsSection />
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