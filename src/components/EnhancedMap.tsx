import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { GoogleMap, InfoWindow } from '@react-google-maps/api';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Chrome as Home, Building, Building2, Store } from 'lucide-react';
import { useGoogleMapsContext } from '@/contexts/GoogleMapsContext';
import { useFilters } from '@/contexts/FilterContext';
import { Property } from '@/lib/supabase';

interface EnhancedMapProps {
  height?: string;
  onPropertySelect?: (property: Property) => void;
}

const EnhancedMap: React.FC<EnhancedMapProps> = ({ 
  height = '600px',
  onPropertySelect
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const { isLoaded, loadError } = useGoogleMapsContext();
  const { state } = useFilters();

  const markersRef = useRef<google.maps.Marker[]>([]);
  const clustererRef = useRef<MarkerClusterer | null>(null);

  const mapContainerStyle = {
    width: '100%',
    height: height
  };

  // Centre sur Chypre comme demandé
  const center = { lat: 35.1264, lng: 33.4299 };
  const zoom = 9;

  const mapOptions = useMemo(() => ({
    disableDefaultUI: false,
    clickableIcons: false,
    scrollwheel: true,
    gestureHandling: 'cooperative',
    styles: [
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#4A90E2' }]
      },
      {
        featureType: 'landscape',
        elementType: 'geometry',
        stylers: [{ color: '#f8f9fa' }]
      }
    ]
  }), []);

  const getPropertyIcon = (type: Property['type']) => {
    const iconSize = 40;
    const icons = {
      villa: '🏠',
      apartment: '🏢',
      penthouse: '🏢',
      commercial: '🏪',
      maison: '🏠'
    };
    
    if (typeof google !== 'undefined' && google.maps) {
      return {
        url: `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${iconSize}' height='${iconSize}' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='18' fill='%233B82F6' stroke='white' stroke-width='2'/%3E%3Ctext x='20' y='26' text-anchor='middle' font-size='16'%3E${icons[type] || '🏠'}%3C/text%3E%3C/svg%3E`,
        scaledSize: new google.maps.Size(iconSize, iconSize),
      };
    }
    
    return undefined;
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    console.log('Google Map loaded, centering on Cyprus');
    setMap(map);
  }, []);

  // Mise à jour des markers avec animation
  useEffect(() => {
    if (!isLoaded || !map || !window.google) return;

    console.log(`Updating markers with ${state.filteredProperties.length} filtered properties`);

    // Cleanup des markers existants
    try {
      clustererRef.current?.clearMarkers();
    } catch (error) {
      console.warn('Error clearing clusterer:', error);
    }
    try {
      markersRef.current.forEach((marker) => {
        marker.setMap(null);
      });
    } catch (error) {
      console.warn('Error clearing markers:', error);
    }
    markersRef.current = [];

    // Création des nouveaux markers avec animation
    if (state.filteredProperties.length > 0) {
      try {
        const markers = state.filteredProperties.map((property, index) => {
          console.log(`📌 Creating marker for: ${property.title} at (${property.coordinates.lat}, ${property.coordinates.lng})`);
          
          const marker = new google.maps.Marker({
            position: { lat: property.coordinates.lat, lng: property.coordinates.lng },
            map,
            title: `${property.title} - ${property.price}`,
        icon: getPropertyIcon(property.type),
            animation: google.maps.Animation.DROP, // Animation de drop
          });

          // Animation différée pour effet stagger
          setTimeout(() => {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(() => {
              marker.setAnimation(null);
            }, 1000);
          }, index * 200);

          marker.addListener('click', () => {
            console.log(`Property selected: ${property.title}`);
            setSelectedProperty(property);
            onPropertySelect?.(property);
            
            // Navigation vers la page de détails
            if (window.location.pathname !== '/project/' + property.id) {
              window.open(`/project/${property.id}`, '_blank');
            }
          });

          return marker;
        });

        markersRef.current = markers;

        // Clustering avec MarkerClusterer
        if (markers.length > 0) {
          clustererRef.current = new MarkerClusterer({ 
            markers, 
            map
          });
          console.log(`Marker clustering initialized with ${markers.length} markers`);
        }
      } catch (error) {
        console.error('❌ Error creating markers:', error);
      }
    }

    return () => {
      try {
        clustererRef.current?.clearMarkers();
      } catch (error) {
        console.warn('Cleanup error clearing clusterer:', error);
      }
      try {
        markersRef.current.forEach((marker) => {
          marker.setMap(null);
        });
      } catch (error) {
        console.warn('Cleanup error clearing markers:', error);
      }
      markersRef.current = [];
    };
  }, [isLoaded, map, state.filteredProperties, onPropertySelect]);

  if (!isLoaded && !loadError) {
    return (
      <div className="w-full flex items-center justify-center bg-muted rounded-lg" style={{ height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Chargement de Google Maps...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="w-full flex items-center justify-center bg-red-50 rounded-lg" style={{ height }}>
        <div className="text-center">
          <p className="text-red-600 font-medium">Erreur de chargement Google Maps</p>
          <p className="text-sm text-gray-500">Vérifiez votre clé API et la connexion internet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        options={mapOptions}
      >
        {/* Info Window avec animation */}
        {selectedProperty && (
          <InfoWindow
            position={{ lat: selectedProperty.coordinates.lat, lng: selectedProperty.coordinates.lng }}
            onCloseClick={() => setSelectedProperty(null)}
          >
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="max-w-sm"
              >
                <Card className="border-0 shadow-none">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {selectedProperty.title}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <MapPin className="w-3 h-3 mr-1" />
                          {selectedProperty.location}
                        </div>
                      </div>
        <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary">
                        {selectedProperty.type}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Prix:</span>
                        <span className="font-semibold text-primary">
                          {selectedProperty.price}
                        </span>
                      </div>
                      
                      {selectedProperty.bedrooms && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Chambres:</span>
                          <span className="text-sm">{selectedProperty.bedrooms}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Surface:</span>
                        <span className="text-sm">{selectedProperty.area}</span>
                      </div>
                    </div>

          <Button 
            size="sm" 
            className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
            onClick={() => onPropertySelect?.(selectedProperty)}
          >
                      Voir les détails
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Message "Aucun bien trouvé" */}
      {state.filteredProperties.length === 0 && !state.isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-lg"
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Aucun bien trouvé
            </h3>
            <p className="text-gray-600 max-w-xs">
              Aucune propriété ne correspond à vos critères de recherche.
            </p>
          </div>
        </motion.div>
      )}

      {/* Overlay avec nombre de résultats */}
      <div className="absolute top-4 right-4 z-10">
        <Card className="bg-white bg-opacity-95 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-gray-800">
                {state.filteredProperties.length} bien{state.filteredProperties.length > 1 ? 's' : ''}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedMap;