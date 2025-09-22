import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { MapPin, Building2, Heart, Plus, Stethoscope, Smile, PawPrint, ShoppingCart, Store, ShoppingBag, School, GraduationCap, Library, Globe2, Baby, BookOpen, Bus, Car, Plane, Anchor, Fuel, Mail, Trees, Flag, Dumbbell, Circle, Dice1, Film, Drama, UtensilsCrossed, Coffee, Wine, Pizza, Utensils, Music, Church, Building, Landmark, CreditCard, Shield, FileText, Waves } from 'lucide-react';

interface CommoditiesCheckboxesProps {
  value: Array<{
    nearby_amenity_id?: string;
    distance_km?: number;
    details?: string;
  }>;
  onChange: (amenities: Array<{
    nearby_amenity_id?: string;
    distance_km?: number;
    details?: string;
  }>) => void;
  onDetectWithMaps: () => Promise<void>;
}

export const CommoditiesCheckboxes: React.FC<CommoditiesCheckboxesProps> = ({
  value,
  onChange,
  onDetectWithMaps
}) => {
  const renderCommodityCheckbox = (amenity: any) => {
    const isChecked = value.some((a: any) => 
      a.nearby_amenity_id === amenity.type
    );
    const Icon = amenity.Icon;
    
    return (
      <div key={amenity.type} className="flex items-center space-x-3 p-2 rounded-lg border hover:bg-accent">
        <Checkbox
          checked={isChecked}
          onCheckedChange={(checked) => {
            if (checked) {
              onChange([
                ...value,
                { nearby_amenity_id: amenity.type, distance_km: 0, details: amenity.name }
              ]);
            } else {
              onChange(
                value.filter((a: any) => 
                  a.nearby_amenity_id !== amenity.type
                )
              );
            }
          }}
        />
        <Icon className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">{amenity.name}</span>
      </div>
    );
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Commodités de Proximité
        </CardTitle>
        <CardDescription>
          Sélectionnez tous les points d'intérêt situés à proximité du projet
        </CardDescription>
        <div className="pt-4">
          <Button
            type="button"
            onClick={onDetectWithMaps}
            variant="outline"
            className="w-full"
          >
            <MapPin className="w-4 h-4 mr-2" />
            Détecter commodités avec Google Maps
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Santé & Services */}
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-3">Santé & Services</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { name: "Hôpital", type: "hospital", Icon: Building2 },
                { name: "Clinique", type: "clinic", Icon: Heart },
                { name: "Pharmacie", type: "pharmacy", Icon: Plus },
                { name: "Médecin", type: "doctor", Icon: Stethoscope },
                { name: "Dentiste", type: "dentist", Icon: Smile },
                { name: "Vétérinaire", type: "veterinary", Icon: PawPrint }
              ].map(renderCommodityCheckbox)}
            </div>
          </div>

          {/* Commerce & Shopping */}
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-3">Commerce & Shopping</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { name: "Supermarché", type: "supermarket", Icon: ShoppingCart },
                { name: "Centre commercial", type: "mall", Icon: Store },
                { name: "Marché local", type: "market", Icon: ShoppingBag },
                { name: "Boulangerie", type: "bakery", Icon: ShoppingBag },
                { name: "Épicerie", type: "grocery", Icon: ShoppingBag },
                { name: "Boutiques", type: "shops", Icon: Store }
              ].map(renderCommodityCheckbox)}
            </div>
          </div>

          {/* Éducation */}
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-3">Éducation</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { name: "École primaire", type: "primary_school", Icon: School },
                { name: "Collège/Lycée", type: "high_school", Icon: GraduationCap },
                { name: "Université", type: "university", Icon: Library },
                { name: "École internationale", type: "intl_school", Icon: Globe2 },
                { name: "Crèche", type: "nursery", Icon: Baby },
                { name: "Centre de formation", type: "training_center", Icon: BookOpen }
              ].map(renderCommodityCheckbox)}
            </div>
          </div>

          {/* Transport */}
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-3">Transport</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { name: "Arrêt de bus", type: "bus_stop", Icon: Bus },
                { name: "Station de taxi", type: "taxi", Icon: Car },
                { name: "Aéroport", type: "airport", Icon: Plane },
                { name: "Port/Marina", type: "marina", Icon: Anchor },
                { name: "Station service", type: "gas_station", Icon: Fuel },
                { name: "Parking public", type: "parking", Icon: Car }
              ].map(renderCommodityCheckbox)}
            </div>
          </div>

          {/* Finance & Services */}
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-3">Finance & Services</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { name: "Banque", type: "bank", Icon: Landmark },
                { name: "Distributeur ATM", type: "atm", Icon: CreditCard },
                { name: "Bureau de poste", type: "post_office", Icon: Mail },
                { name: "Mairie", type: "city_hall", Icon: Building },
                { name: "Police", type: "police", Icon: Shield },
                { name: "Notaire", type: "notary", Icon: FileText }
              ].map(renderCommodityCheckbox)}
            </div>
          </div>

          {/* Loisirs & Nature */}
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-3">Loisirs & Nature</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { name: "Plage", type: "beach", Icon: Waves },
                { name: "Parc", type: "park", Icon: Trees },
                { name: "Terrain de golf", type: "golf", Icon: Flag },
                { name: "Centre sportif", type: "sports_center", Icon: Dumbbell },
                { name: "Piscine publique", type: "pool", Icon: Waves },
                { name: "Tennis", type: "tennis", Icon: Circle },
                { name: "Casino", type: "casino", Icon: Dice1 },
                { name: "Cinéma", type: "cinema", Icon: Film },
                { name: "Théâtre", type: "theater", Icon: Drama }
              ].map(renderCommodityCheckbox)}
            </div>
          </div>

          {/* Restauration */}
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-3">Restauration</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { name: "Restaurant", type: "restaurant", Icon: UtensilsCrossed },
                { name: "Café", type: "cafe", Icon: Coffee },
                { name: "Bar", type: "bar", Icon: Wine },
                { name: "Fast-food", type: "fastfood", Icon: Pizza },
                { name: "Taverne locale", type: "tavern", Icon: Utensils },
                { name: "Club/Discothèque", type: "nightclub", Icon: Music }
              ].map(renderCommodityCheckbox)}
            </div>
          </div>

          {/* Culte */}
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-3">Lieux de culte</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { name: "Église", type: "church", Icon: Church },
                { name: "Mosquée", type: "mosque", Icon: Building2 },
                { name: "Synagogue", type: "synagogue", Icon: Building },
                { name: "Temple", type: "temple", Icon: Landmark }
              ].map(renderCommodityCheckbox)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};