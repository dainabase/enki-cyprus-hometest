import { useState, useCallback, useMemo } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { motion, AnimatePresence } from 'framer-motion';
import { Property } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Home, Building, Building2, Store } from 'lucide-react';

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
      villa: '🏖️',
      apartment: '🏢',
      penthouse: '🏰',
      commercial: '🏪'
    };
    
    return {
      url: `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${iconSize}' height='${iconSize}' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='18' fill='%234A90E2' stroke='white' stroke-width='2'/%3E%3Ctext x='20' y='26' text-anchor='middle' font-size='16'%3E${icons[type]}%3C/text%3E%3C/svg%3E`,
      scaledSize: new google.maps.Size(iconSize, iconSize),
    };
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    
    // Add marker clustering
    const markers = properties.map(property => {
      const marker = new google.maps.Marker({
        position: { lat: property.lat, lng: property.lng },
        icon: getPropertyIcon(property.type),
        title: property.title,
      });

      marker.addListener('click', () => {
        setSelectedProperty(property);
        onPropertySelect?.(property);
      });

      return marker;
    });

    if (typeof MarkerClusterer !== 'undefined') {
      new MarkerClusterer({
        markers,
        map,
        renderer: {
          render: ({ count, position }) => {
            const color = '#4A90E2';
            const size = count < 10 ? 40 : count < 100 ? 50 : 60;
            
            return new google.maps.Marker({
              position,
              icon: {
                url: `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'%3E%3Ccircle cx='${size/2}' cy='${size/2}' r='${size/2-2}' fill='${color}' stroke='white' stroke-width='2'/%3E%3Ctext x='${size/2}' y='${size/2+6}' text-anchor='middle' font-size='14' fill='white' font-weight='bold'%3E${count}%3C/text%3E%3C/svg%3E`,
                scaledSize: new google.maps.Size(size, size),
              },
              label: {
                text: count.toString(),
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold'
              }
            });
          }
        }
      });
    }
  }, [properties, onPropertySelect]);

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
      <LoadScript 
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'your-api-key-here'}
        libraries={['places']}
        loadingElement={
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-muted-foreground">Chargement de la carte...</p>
            </div>
          </div>
        }
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={zoom}
          onLoad={onLoad}
          options={mapOptions}
        >
          {/* Animated Markers */}
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 260,
                damping: 20
              }}
            >
              <Marker
                position={{ lat: property.lat, lng: property.lng }}
                onClick={() => handleMarkerClick(property)}
                icon={getPropertyIcon(property.type)}
                animation={google.maps.Animation?.DROP}
              />
            </motion.div>
          ))}

          {/* Info Window */}
          {selectedProperty && showInfoWindow && (
            <InfoWindow
              position={{ lat: selectedProperty.lat, lng: selectedProperty.lng }}
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
      </LoadScript>
    </div>
  );
};

export default GoogleMapComponent;