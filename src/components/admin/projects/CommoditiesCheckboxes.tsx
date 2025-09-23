import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, Building2, Heart, Plus, ShoppingCart, Store,
  GraduationCap, Bus, Plane, Landmark, CreditCard, Shield,
  Waves, Trees, Coffee, Building, Navigation
} from 'lucide-react';

interface CommodityItem {
  name: string;
  type: string;
  Icon: any;
}

const COMMODITIES_DATA = {
  'Santé': [
    { name: 'Hôpital', type: 'hospital', Icon: Building2 },
    { name: 'Clinique', type: 'clinic', Icon: Heart },
    { name: 'Pharmacie', type: 'pharmacy', Icon: Plus },
    { name: 'Médecin', type: 'doctor', Icon: Heart },
    { name: 'Dentiste', type: 'dentist', Icon: Heart },
  ],
  'Commerce': [
    { name: 'Supermarché', type: 'supermarket', Icon: ShoppingCart },
    { name: 'Centre commercial', type: 'mall', Icon: Store },
    { name: 'Marché', type: 'market', Icon: Store },
    { name: 'Boulangerie', type: 'bakery', Icon: Store },
  ],
  'Éducation': [
    { name: 'École', type: 'school', Icon: GraduationCap },
    { name: 'Université', type: 'university', Icon: GraduationCap },
    { name: 'Crèche', type: 'nursery', Icon: Heart },
  ],
  'Transport': [
    { name: 'Bus', type: 'bus_stop', Icon: Bus },
    { name: 'Aéroport', type: 'airport', Icon: Plane },
    { name: 'Port', type: 'marina', Icon: Building2 },
  ],
  'Services': [
    { name: 'Banque', type: 'bank', Icon: Landmark },
    { name: 'ATM', type: 'atm', Icon: CreditCard },
    { name: 'Police', type: 'police', Icon: Shield },
  ],
  'Loisirs': [
    { name: 'Plage', type: 'beach', Icon: Waves },
    { name: 'Parc', type: 'park', Icon: Trees },
    { name: 'Restaurant', type: 'restaurant', Icon: Coffee },
    { name: 'Café', type: 'cafe', Icon: Coffee },
  ]
};

interface Props {
  value: any[];
  onChange: (value: any[]) => void;
  onDetectWithMaps?: () => void;
}

export const CommoditiesCheckboxes: React.FC<Props> = ({ 
  value = [], 
  onChange,
  onDetectWithMaps 
}) => {
  const isChecked = (type: string) => {
    return value.some(v => {
      if (typeof v === 'string') return v === type;
      // Vérifier les deux formats pour compatibilité
      return v.nearby_amenity_id === type || v.type === type;
    });
  };

  const toggleCommodity = (item: CommodityItem, checked: boolean) => {
    if (checked) {
      // Utiliser nearby_amenity_id au lieu de type
      onChange([...value, { 
        nearby_amenity_id: item.type,
        distance_km: 0,
        details: item.name
      }]);
    } else {
      onChange(value.filter(v => {
        if (typeof v === 'string') return v !== item.type;
        return v.nearby_amenity_id !== item.type && v.type !== item.type;
      }));
    }
  };

  return (
    <Card data-commodities-section>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Commodités de Proximité
            </CardTitle>
            <CardDescription>
              Points d'intérêt à proximité du projet
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">
              {value.length} sélectionnées
            </Badge>
            {onDetectWithMaps && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onDetectWithMaps}
              >
                <Navigation className="w-4 h-4 mr-2" />
                Détecter via Maps
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(COMMODITIES_DATA).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-semibold text-sm text-muted-foreground mb-3">
                {category}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {items.map(item => {
                  const Icon = item.Icon;
                  const checked = isChecked(item.type);
                  
                  return (
                    <label
                      key={item.type}
                      className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer hover:bg-accent ${
                        checked ? 'border-primary bg-primary/5' : ''
                      }`}
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(c) => toggleCommodity(item, !!c)}
                      />
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{item.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};