import React, { useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Play, Loader, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface VirtualTourViewerProps {
  tourUrl: string;
  propertyTitle: string;
}

const VirtualTourViewer: React.FC<VirtualTourViewerProps> = ({
  tourUrl,
  propertyTitle
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isTourStarted, setIsTourStarted] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleStartTour = () => {
    setIsTourStarted(true);
    setIsLoading(true);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="w-full">
      {!isTourStarted ? (
        // Preview/Launch State
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="space-y-6"
              >
                {/* Icon */}
                <div className="w-20 h-20 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-4">
                  <Play className="w-10 h-10 text-white ml-1" />
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Visite Virtuelle 360°
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Explorez {propertyTitle} comme si vous y étiez. 
                    Naviguez librement dans chaque pièce en haute résolution.
                  </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 max-w-lg mx-auto">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    <span>Navigation 360°</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    <span>Haute résolution</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    <span>Mode plein écran</span>
                  </div>
                </div>

                {/* Launch Button */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Button
                    size="lg"
                    onClick={handleStartTour}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Lancer la Visite Virtuelle
                  </Button>
                </motion.div>

                {/* External link */}
                <p className="text-xs text-gray-500">
                  Vous pouvez aussi{' '}
                  <a 
                    href={tourUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 underline inline-flex items-center gap-1"
                  >
                    ouvrir dans un nouvel onglet
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        // Tour Active State
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {/* Header */}
              <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
                <h3 className="font-semibold">Visite Virtuelle 360° - {propertyTitle}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsTourStarted(false)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Fermer
                </Button>
              </div>

              {/* Loading Overlay */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10"
                >
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full mx-auto mb-3"
                    />
                    <p className="text-gray-600">Chargement de la visite virtuelle...</p>
                  </div>
                </motion.div>
              )}

              {/* Error State */}
              {hasError ? (
                <div className="h-96 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">
                      Impossible de charger la visite virtuelle
                    </p>
                    <Button
                      onClick={() => {
                        setHasError(false);
                        setIsLoading(true);
                      }}
                      variant="outline"
                    >
                      Réessayer
                    </Button>
                  </div>
                </div>
              ) : (
                // Iframe Container
                <div className="relative h-96 md:h-[600px]">
                  <Suspense fallback={
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Loader className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                  }>
                    <iframe
                      src={tourUrl}
                      title={`Visite virtuelle - ${propertyTitle}`}
                      className="w-full h-full border-0"
                      allowFullScreen
                      loading="lazy"
                      sandbox="allow-scripts allow-same-origin allow-presentation"
                      onLoad={handleIframeLoad}
                      onError={handleIframeError}
                    />
                  </Suspense>
                </div>
              )}

              {/* Instructions */}
              {!isLoading && !hasError && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-blue-50 p-4 border-t"
                >
                  <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      <span>Cliquez et glissez pour regarder autour</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      <span>Molette pour zoomer</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      <span>Cliquez sur les points pour naviguer</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default VirtualTourViewer;