import React, { useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FilterProvider } from '@/contexts/FilterContext';
import { GoogleMapsProvider } from '@/contexts/GoogleMapsContext';
import AdvancedSearchForm from '@/components/AdvancedSearchForm';
const EnhancedMap = lazy(() => import('@/components/EnhancedMap'));
import PropertyModal from '@/components/PropertyModal';
import { Property } from '@/lib/supabase';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useAuth } from '@/contexts/AuthContext';

const Search = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

  return (
    <GoogleMapsProvider>
      <FilterProvider>
        <div className="min-h-screen pt-16 bg-background">
          {/* Header */}
          <section className="bg-gradient-hero py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center text-white"
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Recherche Avancée
                </h1>
                <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
                  Trouvez la propriété de vos rêves à Chypre avec nos filtres intelligents
                </p>
              </motion.div>
            </div>
          </section>

          {/* Contenu principal */}
          <section className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Formulaire de recherche avancée */}
              <AdvancedSearchForm />

              {/* Inscription CTA - Visible only for non-authenticated users */}
              {!isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="mt-6"
                >
                  <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
                    <CardContent className="p-6 text-center">
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Sauvegardez vos recherches
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Créez un compte pour sauvegarder vos critères de recherche 
                        et recevoir des alertes sur les nouvelles propriétés.
                      </p>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <Button asChild className="btn-premium">
                          <Link to="/register">
                            <UserPlus className="w-4 h-4 mr-2" />
                            S'inscrire pour sauvegarder
                          </Link>
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Carte interactive */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <MapPin className="w-6 h-6 text-primary" />
                      Carte Interactive - Propriétés à Chypre
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ErrorBoundary>
                      <Suspense 
                        fallback={
                          <div className="w-full h-[600px] flex items-center justify-center bg-muted rounded-b-lg">
                            <div className="text-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                              <p className="text-muted-foreground">Chargement de la carte...</p>
                            </div>
                          </div>
                        }
                      >
                        <EnhancedMap 
                          height="600px"
                          onPropertySelect={handlePropertySelect}
                        />
                      </Suspense>
                    </ErrorBoundary>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </section>

          {/* Modal des propriétés */}
          <PropertyModal 
            property={selectedProperty}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        </div>
      </FilterProvider>
    </GoogleMapsProvider>
  );
};

export default Search;