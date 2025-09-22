import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Star, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { convertLegacyAmenities } from '@/utils/amenitiesMapper';
import * as LucideIcons from 'lucide-react';

interface AmenitiesSelectorProps {
  selectedAmenities: string[];
  onChange: (amenities: string[]) => void;
}

export const AmenitiesSelector: React.FC<AmenitiesSelectorProps> = ({
  selectedAmenities,
  onChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [convertedAmenities, setConvertedAmenities] = useState<string[]>([]);

  // Convertir les amenities legacy au chargement
  useEffect(() => {
    const converted = convertLegacyAmenities(selectedAmenities);
    setConvertedAmenities(converted);
    console.log('🔄 Amenities conversion:', { 
      original: selectedAmenities, 
      converted 
    });
  }, [selectedAmenities]);

  const { data: amenities, isLoading } = useQuery({
    queryKey: ['amenities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('amenities_reference')
        .select('*')
        .order('category', { ascending: true })
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      console.log('🏊 Amenities loaded from DB:', data);
      return data;
    }
  });

  const filteredAmenities = amenities?.filter(amenity =>
    amenity.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    amenity.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedAmenities = filteredAmenities?.reduce((acc, amenity) => {
    if (!acc[amenity.category]) acc[amenity.category] = [];
    acc[amenity.category].push(amenity);
    return acc;
  }, {} as Record<string, any[]>);

  const toggleAmenity = (amenityCode: string) => {
    console.log('🏊 Toggling amenity:', amenityCode, 'Current selection:', convertedAmenities);
    
    // Utiliser les amenities converties pour la comparaison
    if (convertedAmenities.includes(amenityCode)) {
      // Retirer de la liste convertie
      const newConverted = convertedAmenities.filter(code => code !== amenityCode);
      setConvertedAmenities(newConverted);
      onChange(newConverted); // Sauvegarder les codes anglais
    } else {
      // Ajouter à la liste convertie
      const newConverted = [...convertedAmenities, amenityCode];
      setConvertedAmenities(newConverted);
      onChange(newConverted); // Sauvegarder les codes anglais
    }
  };

  const getCategoryTitle = (category: string) => {
    const titles: Record<string, string> = {
      essential: 'Essentielles',
      recreation: 'Loisirs',
      wellness: 'Bien-être',
      security: 'Sécurité',
      business: 'Business',
      lifestyle: 'Lifestyle',
      connectivity: 'Connectivité',
      outdoor: 'Extérieur',
      community: 'Communauté',
      infrastructure: 'Infrastructure'
    };
    return titles[category] || category;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, keyof typeof LucideIcons> = {
      essential: 'Home',
      recreation: 'Gamepad2',
      wellness: 'Heart',
      security: 'Shield',
      business: 'Briefcase',
      lifestyle: 'Coffee',
      connectivity: 'Wifi',
      outdoor: 'Trees',
      community: 'Users',
      infrastructure: 'Building2'
    };
    const IconComponent = LucideIcons[icons[category] || 'Circle'] as React.ComponentType<any>;
    return <IconComponent className="w-5 h-5" />;
  };

  const renderIcon = (iconName: string) => {
    // Si pas d'icône définie, retourner null au lieu d'un cercle
    if (!iconName || iconName === 'Circle') {
      return null;
    }
    
    // Mapper certains noms d'icônes si nécessaire
    const iconMap: Record<string, string> = {
      'Pool': 'Waves',
      'Gym': 'Dumbbell',
      'Spa': 'Sparkles',
      'Restaurant': 'UtensilsCrossed',
      'Bar': 'Wine',
      'Cinema': 'Film',
      'Business': 'Briefcase',
      'Kids': 'Baby',
      'Tennis': 'CircleDot',
      'Beach': 'Umbrella',
      'Parking': 'Car',
      'Security': 'Shield',
      'Concierge': 'Bell'
    };
    
    const mappedIcon = iconMap[iconName] || iconName;
    const IconComponent = LucideIcons[mappedIcon as keyof typeof LucideIcons] as React.ComponentType<any>;
    
    // Si l'icône n'existe pas, ne rien afficher
    return IconComponent ? <IconComponent className="w-4 h-4" /> : null;
  };

  const getAmenityNameFr = (amenity: any) => {
    // Si une traduction française existe, l'utiliser
    if (amenity.name_fr) return amenity.name_fr;
    
    // Sinon, mapper les noms anglais courants
    const translations: Record<string, string> = {
      'Swimming Pool': 'Piscine',
      'Gym': 'Salle de sport',
      'Spa': 'Spa',
      'Sauna': 'Sauna',
      'Steam Room': 'Hammam',
      'Jacuzzi': 'Jacuzzi',
      'Parking': 'Parking',
      'Underground Parking': 'Parking souterrain',
      'Security 24/7': 'Sécurité 24/7',
      'Concierge': 'Conciergerie',
      'Restaurant': 'Restaurant',
      'Bar': 'Bar',
      'Clubhouse': 'Club-house',
      'Cinema Room': 'Salle de cinéma',
      'Business Center': 'Centre d\'affaires',
      'Kids Club': 'Club enfants',
      'Playground': 'Aire de jeux',
      'Tennis Court': 'Court de tennis',
      'Beach Access': 'Accès plage',
      'Garden': 'Jardin',
      'BBQ Area': 'Espace barbecue',
      'Helipad': 'Héliport'
    };
    
    return translations[amenity.name_en] || amenity.name_en;
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement des prestations...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm space-y-1">
              <p className="font-semibold text-blue-900">
                Équipements et Services Communs du Projet
              </p>
              <p className="text-blue-700">
                Sélectionnez uniquement les équipements disponibles pour TOUS les résidents du projet.
                Les équipements spécifiques aux propriétés individuelles (suite parentale, terrasse privée, etc.) 
                seront configurés lors de la création de chaque propriété.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Label>Rechercher des prestations</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom ou catégorie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="mb-4 p-3 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>{convertedAmenities.length}</strong> prestation(s) sélectionnée(s)
        </p>
        {convertedAmenities.length > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            Codes: {convertedAmenities.join(', ')}
          </p>
        )}
      </div>

      <div className="grid gap-6">
        {Object.entries(groupedAmenities || {}).map(([category, items]) => (
          <Card key={category}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                {getCategoryIcon(category)}
                {getCategoryTitle(category)}
                <Badge variant="outline" className="ml-auto">
                  {items.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((amenity) => {
                  const isSelected = convertedAmenities.includes(amenity.code);
                  
                  return (
                    <label
                      key={amenity.id}
                      className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg border transition-colors hover:bg-accent ${
                        isSelected
                          ? 'border-primary bg-primary/5' 
                          : 'border-border'
                      }`}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleAmenity(amenity.code)}
                      />
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {renderIcon(amenity.icon)}
                        <span className="text-sm font-medium truncate">
                          {getAmenityNameFr(amenity)}
                        </span>
                        {amenity.is_premium && (
                          <Star className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!groupedAmenities || Object.keys(groupedAmenities).length === 0) && (
        <div className="text-center py-8 text-muted-foreground">
          {searchTerm ? 'Aucune prestation trouvée' : 'Aucune prestation disponible'}
        </div>
      )}
    </div>
  );
};
