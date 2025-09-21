import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { GoogleMap, InfoWindow } from '@react-google-maps/api';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { motion, AnimatePresence } from 'framer-motion';
import { Property } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Home, Building, Building2, Store } from 'lucide-react';
import { useGoogleMapsContext } from '@/contexts/GoogleMapsContext';
interface GoogleMapComponentProps {
  properties: Property[];
  onPropertySelect?: (property: Property) => void;
  height?: string;
  showInfoWindow?: boolean;
  center?: { lat: number; lng: number };
  zoom?: number;
}

const GoogleMapComponent = ({ 
  properties, 
  onPropertySelect,
  height = '500px',
  showInfoWindow = true,
  center = { lat: 35.1264, lng: 33.4299 },
  zoom = 9
}: GoogleMapComponentProps) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Use global Google Maps context instead of local useJsApiLoader
  const { isLoaded, loadError } = useGoogleMapsContext();

  const markersRef = useRef<google.maps.Marker[]>([]);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const mapContainerStyle = {
    width: '100%',
    height: height
  };

  const mapOptions = useMemo(() => ({
    disableDefaultUI: false,
    clickableIcons: false,
    scrollwheel: true,
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
      }
    ]
  }), []);

  const getPropertyIcon = (type: Property['type']) => {
    const iconSize = 40;
    const icons = {
      villa: '🏠',
      apartment: '🏢',
      penthouse: '🏢',
      commercial: '🏪'
    };
    
    // Only create Google Maps objects if the API is loaded
    if (typeof google !== 'undefined' && google.maps) {
      return {
        url: `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${iconSize}' height='${iconSize}' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='18' fill='%234A90E2' stroke='white' stroke-width='2'/%3E%3Ctext x='20' y='26' text-anchor='middle' font-size='16'%3E${icons[type]}%3C/text%3E%3C/svg%3E`,
        scaledSize: new google.maps.Size(iconSize, iconSize),
      };
    }
    
    // Fallback for when Google Maps API is not yet loaded
    return undefined;
  };

const onLoad = useCallback((map: google.maps.Map) => {
  console.log('Google Map loaded, centering on Cyprus...');
  if (!window.google) {
    console.error('❌ Google Maps API not loaded properly');
    return;
  }
  setMap(map);
  map.setCenter({ lat: 35.1264, lng: 33.4299 });
  map.setZoom(9);
  console.log('Map centered on Cyprus (35.1264, 33.4299) with zoom 9');
}, []);

// Create Advanced Markers and cluster when map and API are ready
useEffect(() => {
  if (!isLoaded) return;
  if (!window.google) {
    console.error('❌ API not loaded');
    return;
  }
  if (!map) return;

  // Cleanup previous markers/clusterer
  try {
    clustererRef.current?.clearMarkers();
  } catch {}
  try {
    markersRef.current.forEach((m) => {
      m.setMap(null);
    });
  } catch {}
  markersRef.current = [];

  try {
    const markers = properties.map((property) => {
      console.log(`📌 Creating marker for: ${property.title} at (${property.coordinates.lat}, ${property.coordinates.lng})`);
      // Use AdvancedMarkerElement instead of deprecated Marker
      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat: property.coordinates.lat, lng: property.coordinates.lng },
        map,
        title: property.title,
      });
      marker.addListener('click', () => {
        console.log(`Property clicked: ${property.title}`);
        setSelectedProperty(property);
        onPropertySelect?.(property);
      });
      return marker;
    });

    markersRef.current = markers as any;

    if (markers.length > 0) {
      clustererRef.current = new MarkerClusterer({ markers, map });
      console.log('Marker clustering initialized successfully');
    } else {
      console.warn('No markers to cluster');
    }
  } catch (error) {
    console.error('❌ Error initializing advanced markers/clusterer:', error);
  }

  return () => {
    try { clustererRef.current?.clearMarkers(); } catch {}
    try {
      markersRef.current.forEach((m) => {
        m.setMap(null);
      });
    } catch {}
    clustererRef.current = null;
    markersRef.current = [];
  };
}, [isLoaded, map, properties, onPropertySelect]);

  const handleMarkerClick = (property: Property) => {
    setSelectedProperty(property);
    onPropertySelect?.(property);
  };

  const getTypeIcon = (type: Property['type']) => {
    switch (type) {
      case 'villa': return Home;
      case 'apartment': return Building;
      case 'penthouse': return Building2;
      case 'commercial': return Store;
      default: return MapPin;
    }
  };

  return (
    <div className="relative">
      {!isLoaded && !loadError && (
        <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg" style={{ height }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground">Chargement de Google Maps...</p>
          </div>
        </div>
      )}

      {loadError && (
        <div className="w-full h-full flex items-center justify-center bg-destructive/10 rounded-lg" style={{ height }}>
          <div className="text-center">
            <p className="text-destructive font-medium">Erreur de chargement Google Maps</p>
            <p className="text-sm text-muted-foreground">Vérifiez VITE_GOOGLE_MAPS_API_KEY et les restrictions de domaine.</p>
          </div>
        </div>
      )}

      {isLoaded && (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={zoom}
          onLoad={onLoad}
          options={mapOptions}
        >
          {/* Info Window */}
          {selectedProperty && showInfoWindow && (
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
                        <Badge variant="secondary" className="ml-2">
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
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Type:</span>
                          <Badge variant="secondary" className="text-xs capitalize">
                            {selectedProperty.type}
                          </Badge>
                        </div>
                      </div>

                      <Button 
                        size="sm" 
                        className="w-full btn-premium"
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
      )}
    </div>
  );
};

export default GoogleMapComponent;