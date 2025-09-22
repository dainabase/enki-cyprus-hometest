import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, X, Plus } from 'lucide-react';

// Types d'amenities de proximité
const AMENITY_TYPES = {
  beach: { label: 'Plage', icon: '🏖️' },
  restaurant: { label: 'Restaurant', icon: '🍽️' },
  shopping: { label: 'Shopping', icon: '🛍️' },
  education: { label: 'École', icon: '🎓' },
  healthcare: { label: 'Santé', icon: '🏥' },
  marina: { label: 'Marina', icon: '⛵' },
  golf: { label: 'Golf', icon: '⛳' },
  casino: { label: 'Casino', icon: '🎰' },
  park: { label: 'Parc', icon: '🌳' },
  gym: { label: 'Sport', icon: '🏋️' },
  bank: { label: 'Banque', icon: '🏦' },
  church: { label: 'Église', icon: '⛪' },
  mosque: { label: 'Mosquée', icon: '🕌' },
  transport: { label: 'Transport', icon: '🚌' },
  airport: { label: 'Aéroport', icon: '✈️' },
  highway: { label: 'Autoroute', icon: '🛣️' },
  supermarket: { label: 'Supermarché', icon: '🛒' },
  pharmacy: { label: 'Pharmacie', icon: '💊' },
  cafe: { label: 'Café', icon: '☕' },
  bar: { label: 'Bar', icon: '🍺' }
};

interface SurroundingAmenity {
  name: string;
  type: string;
  distance_km: number;
}

interface SimplifiedNearbyAmenitiesProps {
  value: SurroundingAmenity[];
  onChange: (amenities: SurroundingAmenity[]) => void;
}

export const SimplifiedNearbyAmenities: React.FC<SimplifiedNearbyAmenitiesProps> = ({ 
  value = [], 
  onChange 
}) => {
  const [amenities, setAmenities] = useState<SurroundingAmenity[]>(value);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Synchroniser avec la valeur prop
  useEffect(() => {
    console.log('📍 Surrounding amenities loaded:', value);
    if (Array.isArray(value) && value.length > 0) {
      setAmenities(value);
    }
  }, [value]);

  const addAmenity = () => {
    const newAmenity: SurroundingAmenity = {
      name: '',
      type: 'beach',
      distance_km: 0.5
    };
    const updated = [...amenities, newAmenity];
    setAmenities(updated);
    onChange(updated);
    setEditingIndex(amenities.length);
  };

  const updateAmenity = (index: number, updates: Partial<SurroundingAmenity>) => {
    const updated = amenities.map((amenity, i) => 
      i === index ? { ...amenity, ...updates } : amenity
    );
    setAmenities(updated);
    onChange(updated);
  };

  const removeAmenity = (index: number) => {
    const updated = amenities.filter((_, i) => i !== index);
    setAmenities(updated);
    onChange(updated);
  };

  const sortByDistance = () => {
    const sorted = [...amenities].sort((a, b) => a.distance_km - b.distance_km);
    setAmenities(sorted);
    onChange(sorted);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <CardTitle>Commodités de Proximité</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {amenities.length} commodité{amenities.length > 1 ? 's' : ''}
              </Badge>
              {amenities.length > 1 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={sortByDistance}
                >
                  Trier par distance
                </Button>
              )}
              <Button 
                size="sm"
                onClick={addAmenity}
              >
                <Plus className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Liste des amenities */}
      <div className="space-y-3">
        {amenities.map((amenity, index) => {
          const typeInfo = AMENITY_TYPES[amenity.type as keyof typeof AMENITY_TYPES] || { label: amenity.type, icon: '📍' };
          const isEditing = editingIndex === index;
          
          return (
            <Card key={index} className="relative">
              <CardContent className="pt-4">
                {isEditing ? (
                  // Mode édition
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">Nom</Label>
                        <Input
                          value={amenity.name}
                          onChange={(e) => updateAmenity(index, { name: e.target.value })}
                          placeholder="Ex: Dasoudi Beach"
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Type</Label>
                        <Select 
                          value={amenity.type}
                          onValueChange={(type) => updateAmenity(index, { type })}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(AMENITY_TYPES).map(([key, info]) => (
                              <SelectItem key={key} value={key}>
                                <span className="flex items-center gap-2">
                                  <span>{info.icon}</span>
                                  <span>{info.label}</span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Distance (km)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={amenity.distance_km}
                          onChange={(e) => updateAmenity(index, { 
                            distance_km: parseFloat(e.target.value) || 0 
                          })}
                          className="h-8"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setEditingIndex(null)}
                      >
                        Annuler
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => setEditingIndex(null)}
                        disabled={!amenity.name}
                      >
                        Valider
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Mode affichage
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{typeInfo.icon}</span>
                      <div>
                        <p className="font-medium text-sm">
                          {amenity.name || 'Sans nom'}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="secondary" className="text-xs">
                            {typeInfo.label}
                          </Badge>
                          <span>•</span>
                          <span>{amenity.distance_km} km</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingIndex(index)}
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAmenity(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Message vide */}
      {amenities.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center text-muted-foreground">
            <MapPin className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-sm">
              Aucune commodité de proximité définie
            </p>
            <p className="text-xs mt-1">
              Ajoutez des plages, restaurants, écoles et autres points d'intérêt
            </p>
          </CardContent>
        </Card>
      )}

      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="bg-gray-50">
          <CardContent className="pt-4">
            <p className="text-xs font-mono text-gray-600">
              Debug: {JSON.stringify(amenities, null, 2)}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
