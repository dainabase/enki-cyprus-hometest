import { MapPin, Navigation, Clock } from 'lucide-react';
import type { PropertyData } from '@/types/expansion.types';
import { getPointsOfInterest } from '@/data/mockPointsOfInterest';

interface TabMapProps {
  property: PropertyData;
}

const categoryIcons: Record<string, string> = {
  beach: '🏖',
  airport: '✈',
  school: '🏫',
  hospital: '🏥',
  shopping: '🛍',
  restaurant: '🍽',
};

const categoryColors: Record<string, string> = {
  beach: 'bg-black/5',
  airport: 'bg-black/5',
  school: 'bg-black/5',
  hospital: 'bg-black/5',
  shopping: 'bg-black/5',
  restaurant: 'bg-black/5',
};

export const TabMap = ({ property }: TabMapProps) => {
  const pointsOfInterest = getPointsOfInterest(property.location);

  // Récupération de la clé API depuis les variables d'environnement
  const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;

  // Construction de l'URL avec la clé API
  const mapEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_KEY || ''}&q=${encodeURIComponent(
    property.location + ', Cyprus'
  )}`;

  return (
    <div className="space-y-6">
      <div className="relative w-full h-[400px] md:h-[500px] bg-black/5 border border-black/10 overflow-hidden">
        <iframe
          src={mapEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Map of ${property.location}`}
        />

        <div className="absolute top-4 left-4 bg-white border border-black/10 px-4 py-2 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-black" />
          <div>
            <p className="text-sm font-medium text-black">{property.title}</p>
            <p className="text-xs text-black/60 font-light">{property.location}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-medium text-black mb-4">Nearby Points of Interest</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pointsOfInterest.map((poi) => (
            <div
              key={poi.id}
              className="flex items-start gap-3 p-4 bg-white border border-black/10 hover:border-black/20 transition-colors"
            >
              <div className={`text-2xl flex-shrink-0 w-12 h-12 flex items-center justify-center ${categoryColors[poi.category]}`}>
                {categoryIcons[poi.category] || '📍'}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-black mb-1">{poi.name}</p>

                <div className="flex items-center gap-4 text-sm text-black/60 font-light">
                  <div className="flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{poi.distance} km</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{poi.duration} min</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-black/5 border border-black/10 p-6">
        <h4 className="font-medium text-black mb-2">Location Highlights</h4>
        <p className="text-black/70 font-light leading-relaxed">
          This property is ideally situated in {property.location}, one of Cyprus's most sought-after locations.
          The area offers excellent connectivity to major amenities, international schools, and leisure facilities.
        </p>
      </div>
    </div>
  );
};
