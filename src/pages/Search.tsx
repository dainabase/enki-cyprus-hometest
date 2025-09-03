import React, { useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FilterProvider } from '@/contexts/FilterContext';
import { GoogleMapsProvider } from '@/contexts/GoogleMapsContext';
import AdvancedSearchForm from '@/components/AdvancedSearchForm';
const EnhancedMap = lazy(() => import('@/components/EnhancedMap'));
import PropertyModal from '@/components/PropertyModal';
import { Property } from '@/lib/supabase';
import ErrorBoundary from '@/components/ErrorBoundary';

const Search = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <div className="min-h-screen pt-16 bg-gray-50">
          {/* Header */}
          <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
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
                <p className="text-xl text-blue-100 max-w-2xl mx-auto">
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

              {/* Carte interactive */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <MapPin className="w-6 h-6 text-blue-600" />
                      Carte Interactive - Propriétés à Chypre
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ErrorBoundary>
                      <Suspense 
                        fallback={
                          <div className="w-full h-[600px] flex items-center justify-center bg-gray-100 rounded-b-lg">
                            <div className="text-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                              <p className="text-gray-600">Chargement de la carte...</p>
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