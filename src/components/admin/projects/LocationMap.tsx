import { GoogleMap, LoadScript, Marker, Circle, InfoWindow } from '@react-google-maps/api';
import { useState, useCallback, memo } from 'react';

interface LocationMapProps {
  address: string;
  latitude: number;
  longitude: number;
  radius: number; // en km
  commodities: Array<{
    id: string;
    name: string;
    type: string;
    lat: number;
    lng: number;
    distance: number;
  }>;
  onRadiusChange?: (radius: number) => void;
}

const mapContainerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '8px'
};

const COMMODITY_COLORS: { [key: string]: string } = {
  hospital: '#EF4444',     // Rouge
  pharmacy: '#10B981',     // Vert
  school: '#3B82F6',       // Bleu
  supermarket: '#F59E0B',  // Orange
  restaurant: '#8B5CF6',   // Violet
  bank: '#6366F1',         // Indigo
  public_transport: '#14B8A6', // Cyan
  park: '#84CC16',         // Lime
  gym: '#EC4899',          // Rose
  default: '#6B7280'       // Gris par défaut
};

const COMMODITY_ICONS: { [key: string]: string } = {
  hospital: '🏥',
  pharmacy: '💊',
  school: '🎓',
  supermarket: '🛒',
  restaurant: '🍽️',
  bank: '🏦',
  public_transport: '🚌',
  park: '🌳',
  gym: '💪',
  default: '📍'
};

export const LocationMap = memo(({ 
  address, 
  latitude, 
  longitude, 
  radius, 
  commodities,
  onRadiusChange 
}: LocationMapProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedCommodity, setSelectedCommodity] = useState<any>(null);

  const center = {
    lat: latitude || 34.7072,  // Default: Limassol
    lng: longitude || 33.0226
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    
    // Auto-zoom pour inclure toutes les commodités
    if (commodities.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(center);
      commodities.forEach(c => {
        bounds.extend({ lat: c.lat, lng: c.lng });
      });
      map.fitBounds(bounds);
    }
  }, [center, commodities]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyBmFbbR7bD_4PSJGBU-_12ZL1VjGKRXKBU"
      libraries={['places']}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={14}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          zoomControl: true,
          styles: [
            {
              featureType: "poi.business",
              stylers: [{ visibility: "off" }]
            }
          ]
        }}
      >
        {/* Marqueur principal */}
        <Marker
          position={center}
          icon={{
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            scaledSize: new window.google.maps.Size(40, 40)
          }}
          title={address}
        />

        {/* Cercle de détection */}
        <Circle
          center={center}
          radius={radius * 1000} // Convertir km en mètres
          options={{
            fillColor: '#3B82F6',
            fillOpacity: 0.1,
            strokeColor: '#3B82F6',
            strokeOpacity: 0.3,
            strokeWeight: 2
          }}
        />

        {/* Marqueurs des commodités */}
        {commodities.map((commodity, index) => (
          <Marker
            key={`${commodity.id}-${index}`}
            position={{ lat: commodity.lat, lng: commodity.lng }}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: COMMODITY_COLORS[commodity.type] || COMMODITY_COLORS.default,
              fillOpacity: 0.9,
              strokeColor: '#FFFFFF',
              strokeWeight: 2,
              scale: 8
            }}
            title={commodity.name}
            onClick={() => setSelectedCommodity(commodity)}
          />
        ))}

        {/* InfoWindow pour la commodité sélectionnée */}
        {selectedCommodity && (
          <InfoWindow
            position={{ lat: selectedCommodity.lat, lng: selectedCommodity.lng }}
            onCloseClick={() => setSelectedCommodity(null)}
          >
            <div className="p-2">
              <div className="font-semibold flex items-center gap-2">
                <span>{COMMODITY_ICONS[selectedCommodity.type] || COMMODITY_ICONS.default}</span>
                {selectedCommodity.name}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Distance: {selectedCommodity.distance.toFixed(1)} km
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
});

LocationMap.displayName = 'LocationMap';