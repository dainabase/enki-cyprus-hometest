import { Building2, Heart, GraduationCap, School, ShoppingCart, Store, Bus, Landmark, Dumbbell, Trees, Shield, Waves, Plane, Car, MapPin, Clock, Navigation } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Types
interface Amenity {
  nearby_amenity_id: string;
  distance_km: number;
  details?: string;
  lat?: number;
  lng?: number;
}

interface DistancesSectionProps {
  detectedAmenities: Amenity[];
  selectedAmenities: Set<string>;
  onToggleAmenity: (amenityId: string) => void;
  onSelectAll: () => void;
  proximitySeaKm?: number;
  proximityCityCenterKm?: number;
  proximityHighwayKm?: number;
  proximityAirportKm?: number;
  gpsLatitude?: number;
  gpsLongitude?: number;
}

// 13 COMMODITÉS VALIDÉES
const FIXED_AMENITIES = [
  { id: 'hospital', label: 'Hôpital', icon: Building2, category: 'Santé' },
  { id: 'pharmacy', label: 'Pharmacie', icon: Heart, category: 'Santé' },
  { id: 'school', label: 'École', icon: GraduationCap, category: 'Éducation' },
  { id: 'university', label: 'Université', icon: School, category: 'Éducation' },
  { id: 'supermarket', label: 'Supermarché', icon: ShoppingCart, category: 'Shopping' },
  { id: 'shopping_center', label: 'Centre commercial', icon: Store, category: 'Shopping' },
  { id: 'transport_public', label: 'Transport public', icon: Bus, category: 'Transport' },
  { id: 'bank', label: 'Banque', icon: Landmark, category: 'Services' },
  { id: 'gym', label: 'Salle de sport', icon: Dumbbell, category: 'Loisirs' },
  { id: 'park', label: 'Parc', icon: Trees, category: 'Loisirs' },
  { id: 'police', label: 'Police', icon: Shield, category: 'Sécurité' },
  { id: 'beach', label: 'Plage', icon: Waves, category: 'Stratégique' }
];

// Helper pour calculer distance
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 10) / 10;
};

export function ModernDistancesSection({
  detectedAmenities,
  selectedAmenities,
  onToggleAmenity,
  onSelectAll,
  proximitySeaKm,
  proximityCityCenterKm,
  proximityHighwayKm,
  proximityAirportKm,
  gpsLatitude,
  gpsLongitude
}: DistancesSectionProps) {

  // Calculer distances aéroports
  const larnacaDistance = gpsLatitude && gpsLongitude
    ? calculateDistance(gpsLatitude, gpsLongitude, 34.8751, 33.6248)
    : proximityAirportKm || null;

  const paphosDistance = gpsLatitude && gpsLongitude
    ? calculateDistance(gpsLatitude, gpsLongitude, 34.7180, 32.4857)
    : null;

  // Mapper les commodités détectées
  const amenitiesMap = new Map(
    detectedAmenities.map(a => [a.nearby_amenity_id, a])
  );

  return (
    <div className="space-y-6">
      {/* DISTANCES STRATÉGIQUES - VERSION COMPACTE */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Distances stratégiques</h3>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Waves className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-medium text-slate-600">Mer/Plage</span>
            </div>
            <p className="text-xl font-bold text-slate-900">
              {proximitySeaKm ? `${proximitySeaKm} km` : '—'}
            </p>
          </div>

          <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="h-4 w-4 text-slate-500" />
              <span className="text-xs font-medium text-slate-600">Centre-ville</span>
            </div>
            <p className="text-xl font-bold text-slate-900">
              {proximityCityCenterKm ? `${proximityCityCenterKm} km` : '—'}
            </p>
          </div>

          <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Car className="h-4 w-4 text-slate-500" />
              <span className="text-xs font-medium text-slate-600">Autoroute</span>
            </div>
            <p className="text-xl font-bold text-slate-900">
              {proximityHighwayKm ? `${proximityHighwayKm} km` : '—'}
            </p>
          </div>

          <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Plane className="h-4 w-4 text-slate-500" />
              <span className="text-xs font-medium text-slate-600">Larnaca</span>
            </div>
            <p className="text-xl font-bold text-slate-900">
              {larnacaDistance ? `${larnacaDistance} km` : '—'}
            </p>
          </div>

          <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Plane className="h-4 w-4 text-slate-500" />
              <span className="text-xs font-medium text-slate-600">Paphos</span>
            </div>
            <p className="text-xl font-bold text-slate-900">
              {paphosDistance ? `${paphosDistance} km` : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* 13 COMMODITÉS FIXES - TOUJOURS AFFICHÉES */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900">Commodités de proximité</h3>
          <button
            type="button"
            onClick={onSelectAll}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            {selectedAmenities.size === FIXED_AMENITIES.length ? 'Tout désélectionner' : 'Tout sélectionner'}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {FIXED_AMENITIES.map((amenity) => {
            const detected = amenitiesMap.get(amenity.id);
            const isSelected = selectedAmenities.has(amenity.id);
            const Icon = amenity.icon;

            return (
              <div
                key={amenity.id}
                onClick={() => detected && onToggleAmenity(amenity.id)}
                className={`
                  relative bg-white rounded-lg p-3 border transition-all
                  ${detected ? 'cursor-pointer hover:shadow-md border-slate-200' : 'border-slate-100 opacity-60'}
                  ${isSelected && detected ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                `}
              >
                {/* Checkbox */}
                {detected && (
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleAmenity(amenity.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-2 right-2 h-4 w-4 text-blue-600 rounded border-slate-300 cursor-pointer"
                  />
                )}

                {/* Contenu */}
                <div className="pr-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`h-4 w-4 ${detected ? 'text-slate-700' : 'text-slate-400'}`} />
                    <span className={`text-sm font-medium ${detected ? 'text-slate-900' : 'text-slate-400'}`}>
                      {amenity.label}
                    </span>
                  </div>

                  {detected ? (
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-slate-900">
                        {detected.distance_km} km
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="h-3 w-3" />
                        {detected.distance_km <= 0.5 && '5 min'}
                        {detected.distance_km > 0.5 && detected.distance_km <= 1 && '10 min'}
                        {detected.distance_km > 1 && detected.distance_km <= 2 && '20 min'}
                        {detected.distance_km > 2 && `~${Math.round(detected.distance_km * 2.5)} min`}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 italic">
                      Non détecté
                    </div>
                  )}
                </div>

                {/* Badge catégorie */}
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs py-0 px-1.5 border-slate-200 text-slate-600">
                    {amenity.category}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-slate-500 mt-3">
          {detectedAmenities.length} / {FIXED_AMENITIES.length} commodités détectées • {selectedAmenities.size} sélectionnées pour le site public
        </p>
      </div>
    </div>
  );
}
