import React from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { useGoogleMapsContext } from '@/contexts/GoogleMapsContext';
import { Property } from '@/data/mockData';

interface MiniMapProps {
  property: Property;
}

const MiniMap: React.FC<MiniMapProps> = ({ property }) => {
  const { isLoaded, loadError } = useGoogleMapsContext();

  const mapContainerStyle = {
    width: '100%',
    height: '100%'
  };

  const center = {
    lat: property.lat,
    lng: property.lng
  };

  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    scrollwheel: false,
    draggable: false,
    clickableIcons: false,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  };

  if (!isLoaded && !loadError) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Chargement...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Erreur de chargement de la carte</p>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={15}
      options={mapOptions}
    >
      {/* Marker statique centré */}
      {isLoaded && window.google && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>
      )}
    </GoogleMap>
  );
};

export default MiniMap;