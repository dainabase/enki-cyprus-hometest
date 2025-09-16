import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import * as LucideIcons from 'lucide-react';

interface AmenitiesSelectorProps {
  selectedAmenities: string[];
  onChange: (amenities: string[]) => void;
}

export const AmenitiesSelector: React.FC<AmenitiesSelectorProps> = ({
  selectedAmenities,
  onChange
}) => {
  console.log('🏢 AmenitiesSelector - selectedAmenities reçues:', selectedAmenities);
  console.log('🏢 AmenitiesSelector - length:', selectedAmenities.length);
  console.log('🏢 AmenitiesSelector - sample:', selectedAmenities.slice(0, 5));
  const [searchTerm, setSearchTerm] = useState('');

  const { data: amenities, isLoading } = useQuery({
    queryKey: ['amenities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('amenities')
        .select('*')
        .order('category', { ascending: true })
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const filteredAmenities = amenities?.filter(amenity =>
    amenity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    amenity.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedAmenities = filteredAmenities?.reduce((acc, amenity) => {
    if (!acc[amenity.category]) acc[amenity.category] = [];
    acc[amenity.category].push(amenity);
    return acc;
  }, {} as Record<string, any[]>);

  const toggleAmenity = (amenityId: string) => {
    if (selectedAmenities.includes(amenityId)) {
      onChange(selectedAmenities.filter(id => id !== amenityId));
    } else {
      onChange([...selectedAmenities, amenityId]);
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
      outdoor: 'Extérieur'
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
      outdoor: 'Trees'
    };
    const IconComponent = LucideIcons[icons[category] || 'Circle'] as React.ComponentType<any>;
    return <IconComponent className="w-5 h-5" />;
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.ComponentType<any>;
    return IconComponent ? <IconComponent className="w-4 h-4" /> : <LucideIcons.Circle className="w-4 h-4" />;
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement des prestations...</div>;
  }

  return (
    <div className="space-y-6">
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
          <strong>{selectedAmenities.length}</strong> prestation(s) sélectionnée(s)
        </p>
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
                {items.map((amenity) => (
                  <label
                    key={amenity.id}
                    className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg border transition-colors hover:bg-accent ${
                      selectedAmenities.includes(amenity.id) 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border'
                    }`}
                  >
                    <Checkbox
                      checked={selectedAmenities.includes(amenity.id)}
                      onCheckedChange={() => toggleAmenity(amenity.id)}
                    />
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {renderIcon(amenity.icon)}
                      <span className="text-sm font-medium truncate">
                        {amenity.name}
                      </span>
                      {amenity.is_premium && (
                        <Star className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                      )}
                    </div>
                  </label>
                ))}
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