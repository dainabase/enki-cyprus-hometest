import { useState, useEffect } from 'react';
import { GoogleMap, Marker, Circle } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Map, Satellite } from 'lucide-react';
import { useGoogleMapsContext } from '@/contexts/GoogleMapsContext';

interface LocationMapProps {
  center: { lat: number; lng: number };
  markers?: Array<{ position: { lat: number; lng: number }; title: string; isSelected?: boolean }>;
  radius?: number;
  onMapClick?: (lat: number, lng: number) => void;
}

export function LocationMap({ center, markers = [], radius = 2, onMapClick }: LocationMapProps) {
  const { isLoaded } = useGoogleMapsContext();
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    if (map && mapType) {
      try {
        map.setMapTypeId(mapType);
      } catch (error) {
        console.error('Erreur changement type de carte:', error);
      }
    }
  }, [map, mapType]);

  if (!isLoaded) {
    return (
      <div className="h-[400px] w-full rounded-lg bg-gray-100 animate-pulse flex items-center justify-center">
        <span className="text-gray-500">Chargement de la carte...</span>
      </div>
    );
  }

  return (
    <div className="relative h-[400px] w-full rounded-lg overflow-hidden border">
      {/* Bouton de bascule vue - CORRIGÉ */}
      <div className="absolute top-2 right-2 z-10">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => {
            try {
              setMapType(prev => prev === 'roadmap' ? 'satellite' : 'roadmap');
            } catch (error) {
              console.error('Erreur toggle vue:', error);
            }
          }}
          className="shadow-lg bg-white"
        >
          {mapType === 'roadmap' ? (
            <>
              <Satellite className="h-4 w-4 mr-1" />
              Satellite
            </>
          ) : (
            <>
              <Map className="h-4 w-4 mr-1" />
              Carte
            </>
          )}
        </Button>
      </div>

      {/* Indicateur de rayon */}
      {radius && (
        <div className="absolute top-2 left-2 z-10 bg-white px-3 py-1 rounded-lg shadow-lg">
          <span className="text-sm font-medium">Rayon: {radius} km</span>
        </div>
      )}
      
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={14}
        onLoad={setMap}
        onClick={(e) => {
          if (onMapClick && e.latLng) {
            onMapClick(e.latLng.lat(), e.latLng.lng());
          }
        }}
        options={{
          mapTypeId: mapType,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        }}
      >
        {/* Marqueur principal */}
        <Marker position={center} />
        
        {/* Cercle de rayon */}
        {radius && (
          <Circle
            center={center}
            radius={radius * 1000}
            options={{
              fillColor: '#3B82F6',
              fillOpacity: 0.1,
              strokeColor: '#3B82F6',
              strokeOpacity: 0.3,
              strokeWeight: 2,
            }}
          />
        )}
        
        {/* Marqueurs des commodités */}
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            title={marker.title}
            icon={{
              url: marker.isSelected 
                ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
                : 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              scaledSize: new google.maps.Size(30, 30),
            }}
          />
        ))}
      </GoogleMap>
    </div>
  );
}