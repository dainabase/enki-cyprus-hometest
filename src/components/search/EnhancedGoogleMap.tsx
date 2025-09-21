import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { GoogleMap, InfoWindow } from '@react-google-maps/api';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Home, Building, Building2, Store } from 'lucide-react';
import { useGoogleMapsContext } from '@/contexts/GoogleMapsContext';
import { useSearch } from '@/contexts/SearchContext';
import { Property } from '@/data/mockData';

interface EnhancedGoogleMapProps {
  height?: string;
  showInfoWindow?: boolean;
  className?: string;
}

const EnhancedGoogleMap: React.FC<EnhancedGoogleMapProps> = ({ 
  height = '500px',
  showInfoWindow = true,
  className = ''
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const { isLoaded, loadError } = useGoogleMapsContext();
  const { state, selectProperty } = useSearch();
  const { filteredProperties, selectedProperty, mapCenter, mapZoom } = state;

  const markersRef = useRef<google.maps.Marker[]>([]);
  const clustererRef = useRef<MarkerClusterer | null>(null);

  const mapContainerStyle = {
    width: '100%',
    height: height
  };

  const defaultCenter = { lat: 35.1264, lng: 33.4299 }; // Cyprus center
  const currentCenter = mapCenter || defaultCenter;

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
        stylers: [{ color: '#f5f5f5' }]
      },
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  }), []);

  const getPropertyIcon = (type: string, isSelected: boolean = false) => {
    const iconSize = isSelected ? 50 : 40;
    const icons: Record<string, string> = {
      villa: '🏠',
      apartment: '🏢',
      penthouse: '🏰',
      commercial: '🏪',
      maison: '🏠'
    };
    
    const bgColor = isSelected ? '#3B82F6' : '#4A90E2';
    const borderColor = isSelected ? '#FFFFFF' : '#FFFFFF';
    const borderWidth = isSelected ? 3 : 2;
    
    if (typeof google !== 'undefined' && google.maps) {
      return {
        url: `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${iconSize}' height='${iconSize}' viewBox='0 0 ${iconSize} ${iconSize}'%3E%3Ccircle cx='${iconSize/2}' cy='${iconSize/2}' r='${iconSize/2 - borderWidth}' fill='${bgColor}' stroke='${borderColor}' stroke-width='${borderWidth}'/%3E%3Ctext x='${iconSize/2}' y='${iconSize/2 + 6}' text-anchor='middle' font-size='${iconSize * 0.4}'%3E${icons[type] || '🏠'}%3C/text%3E%3C/svg%3E`,
        scaledSize: new google.maps.Size(iconSize, iconSize),
        anchor: new google.maps.Point(iconSize/2, iconSize/2)
      };
    }
    
    return undefined;
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    console.log('Enhanced Google Map loaded for search');
    setMap(map);
  }, []);

  // Update map center and zoom when selected property changes
  useEffect(() => {
    if (map && mapCenter) {
      console.log(`Centering map on selected property: ${mapCenter.lat}, ${mapCenter.lng} (zoom: ${mapZoom})`);
      map.panTo(mapCenter);
      map.setZoom(mapZoom);
    }
  }, [map, mapCenter, mapZoom]);

  // Create markers and clustering based on filtered properties
  useEffect(() => {
    if (!isLoaded || !map || !window.google) return;

    console.log(`Updating map with ${filteredProperties.length} filtered properties`);

    // Cleanup existing markers
    try {
      clustererRef.current?.clearMarkers();
    } catch {}
    try {
      markersRef.current.forEach((marker) => {
        marker.setMap(null);
      });
    } catch {}
    markersRef.current = [];

    // Create new markers
    try {
      const markers = filteredProperties.map((property) => {
        const isSelected = selectedProperty?.id === property.id;
        console.log(`📌 Creating marker for: ${property.title} at (${property.lat}, ${property.lng})${isSelected ? ' [SELECTED]' : ''}`);
        
        const marker = new google.maps.Marker({
          position: { lat: property.lat, lng: property.lng },
          map,
          title: property.title,
          icon: getPropertyIcon(property.property_sub_type[0] || 'apartment', isSelected),
        });

        marker.addListener('click', () => {
          console.log(`🏠 Property selected from map: ${property.title}`);
          selectProperty(property);
        });

        return marker;
      });

      markersRef.current = markers;

      // Create clusterer if we have markers
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

    // Cleanup function
    return () => {
      try { clustererRef.current?.clearMarkers(); } catch {}
      try {
        markersRef.current.forEach((marker) => {
          marker.setMap(null);
        });
      } catch {}
      markersRef.current = [];
    };
  }, [isLoaded, map, filteredProperties, selectedProperty, selectProperty]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'villa': return Home;
      case 'apartment': return Building;
      case 'penthouse': return Building2;
      case 'commercial': return Store;
      case 'maison': return Home;
      default: return MapPin;
    }
  };

  if (!isLoaded && !loadError) {
    return (
      <div className={`w-full flex items-center justify-center bg-muted rounded-lg ${className}`} style={{ height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={`w-full flex items-center justify-center bg-destructive/10 rounded-lg ${className}`} style={{ height }}>
        <div className="text-center">
          <p className="text-destructive font-medium">Erreur de chargement de la carte</p>
          <p className="text-sm text-muted-foreground">Vérifiez votre connexion internet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={currentCenter}
        zoom={mapZoom}
        onLoad={onLoad}
        options={mapOptions}
      >
        {/* Enhanced Info Window */}
        {selectedProperty && showInfoWindow && (
          <InfoWindow
            position={{ lat: selectedProperty.lat, lng: selectedProperty.lng }}
            onCloseClick={() => selectProperty(null)}
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
                      <Badge variant="secondary" className="ml-2">
                        {selectedProperty.property_sub_type.join(', ') || 'Résidentiel'}
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
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Statut:</span>
                        <Badge 
                          variant={selectedProperty.status === 'available' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {selectedProperty.status === 'available' ? 'Disponible' : 
                           selectedProperty.status === 'reserved' ? 'Réservé' : 'Vendu'}
                        </Badge>
                      </div>
                    </div>

                    <Button 
                      size="sm" 
                      className="w-full btn-premium"
                      onClick={() => {
                        console.log(`📋 View details clicked for: ${selectedProperty.title}`);
                        // Here you could trigger a modal or navigate to property details
                      }}
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

      {/* Map overlay with results count */}
      <div className="absolute top-4 right-4 z-10">
        <Card className="bg-card/95 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-medium">
                {filteredProperties.length} bien{filteredProperties.length > 1 ? 's' : ''}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedGoogleMap;