import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  MapPin, GraduationCap, Bus, Hospital, ShoppingCart, 
  Coffee, Building, Trees, Save, RotateCcw 
} from 'lucide-react';

interface NearbyAmenity {
  id: string;
  category: string;
  name: string;
  icon: string;
  name_el?: string;
  name_ru?: string;
  description?: string;
  importance_level: number;
}

interface ProjectNearbyAmenity {
  id?: string;
  nearby_amenity_id: string;
  distance_km?: number;
  details?: string;
}

interface NearbyAmenitiesSelectorProps {
  projectId?: string;
  value: ProjectNearbyAmenity[];
  onChange: (amenities: ProjectNearbyAmenity[]) => void;
}

const categoryIcons = {
  education: GraduationCap,
  transport: Bus,
  health: Hospital,
  shopping: ShoppingCart,
  leisure: Trees,
  services: Building,
  dining: Coffee,
  nature: Trees
};

const categoryLabels = {
  education: '🎓 Éducation',
  transport: '🚌 Transport',
  health: '🏥 Santé',
  shopping: '🛒 Shopping',
  leisure: '🎭 Loisirs',
  services: '🏛️ Services',
  dining: '🍽️ Restauration',
  nature: '🌳 Nature'
};

export const NearbyAmenitiesSelector: React.FC<NearbyAmenitiesSelectorProps> = ({ 
  projectId, 
  value = [], 
  onChange 
}) => {
  const [selectedAmenities, setSelectedAmenities] = useState<ProjectNearbyAmenity[]>(value);
  const queryClient = useQueryClient();

  // Charger les commodités disponibles
  const { data: nearbyAmenities, isLoading } = useQuery({
    queryKey: ['nearby-amenities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nearby_amenities')
        .select('*')
        .order('category')
        .order('importance_level', { ascending: false })
        .order('sort_order');
      
      if (error) throw error;
      return data as NearbyAmenity[];
    }
  });

  // Charger les commodités déjà sélectionnées pour ce projet
  const { data: existingAmenities } = useQuery({
    queryKey: ['project-nearby-amenities', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const { data, error } = await supabase
        .from('project_nearby_amenities')
        .select('*')
        .eq('project_id', projectId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!projectId
  });

  // Synchroniser avec les données existantes
  useEffect(() => {
    if (existingAmenities && existingAmenities.length > 0) {
      const formattedAmenities = existingAmenities.map(item => ({
        id: item.id,
        nearby_amenity_id: item.nearby_amenity_id,
        distance_km: item.distance_km,
        details: item.details
      }));
      setSelectedAmenities(formattedAmenities);
      onChange(formattedAmenities);
    }
  }, [existingAmenities, onChange]);

  // Sauvegarder dans la base de données
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!projectId) return;

      // Supprimer les anciennes relations
      await supabase
        .from('project_nearby_amenities')
        .delete()
        .eq('project_id', projectId);

      // Insérer les nouvelles relations
      if (selectedAmenities.length > 0) {
        const insertData = selectedAmenities.map(amenity => ({
          project_id: projectId,
          nearby_amenity_id: amenity.nearby_amenity_id,
          distance_km: amenity.distance_km,
          details: amenity.details
        }));

        const { error } = await supabase
          .from('project_nearby_amenities')
          .insert(insertData);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Commodités sauvegardées",
        description: "Les commodités de proximité ont été mises à jour avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ['project-nearby-amenities', projectId] });
    },
    onError: (error) => {
      console.error('Erreur:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder les commodités.",
        variant: "destructive"
      });
    }
  });

  // Grouper par catégorie
  const groupedAmenities = nearbyAmenities?.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, NearbyAmenity[]>);

  const updateAmenity = (amenityId: string, updates: Partial<ProjectNearbyAmenity>) => {
    const updated = selectedAmenities.map(amenity =>
      amenity.nearby_amenity_id === amenityId
        ? { ...amenity, ...updates }
        : amenity
    );
    setSelectedAmenities(updated);
    onChange(updated);
  };

  const toggleAmenity = (amenityId: string, checked: boolean) => {
    if (checked) {
      const newAmenity = {
        nearby_amenity_id: amenityId,
        distance_km: undefined,
        details: ''
      };
      const updated = [...selectedAmenities, newAmenity];
      setSelectedAmenities(updated);
      onChange(updated);
    } else {
      const updated = selectedAmenities.filter(a => a.nearby_amenity_id !== amenityId);
      setSelectedAmenities(updated);
      onChange(updated);
    }
  };

  const resetAll = () => {
    setSelectedAmenities([]);
    onChange([]);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
            <span className="ml-2">Chargement des commodités...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <CardTitle>Commodités de proximité</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {selectedAmenities.length} sélectionnées
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetAll}
                disabled={selectedAmenities.length === 0}
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
              {projectId && (
                <Button 
                  size="sm" 
                  onClick={() => saveMutation.mutate()}
                  disabled={saveMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-1" />
                  {saveMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Sélection par catégorie */}
      {Object.entries(groupedAmenities || {}).map(([category, items]) => {
        const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons] || MapPin;
        
        return (
          <Card key={category}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CategoryIcon className="w-4 h-4" />
                {categoryLabels[category as keyof typeof categoryLabels] || category}
                <Badge variant="secondary" className="ml-auto">
                  {items.filter(item => selectedAmenities.some(s => s.nearby_amenity_id === item.id)).length} / {items.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((amenity) => {
                  const selected = selectedAmenities.find(s => s.nearby_amenity_id === amenity.id);
                  const isImportant = amenity.importance_level >= 8;
                  
                  return (
                    <div key={amenity.id} className="space-y-3">
                      {/* Checkbox et nom */}
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <Checkbox
                            checked={!!selected}
                            onCheckedChange={(checked) => toggleAmenity(amenity.id, !!checked)}
                          />
                          <div>
                            <span className="font-medium">{amenity.name}</span>
                            {isImportant && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                Important
                              </Badge>
                            )}
                            {amenity.description && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {amenity.description}
                              </p>
                            )}
                          </div>
                        </label>
                      </div>
                      
                      {/* Champs de distance/temps */}
                      {selected && (
                        <div className="ml-8 p-3 bg-muted/30 rounded-lg">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs">Distance (km)</Label>
                              <Input
                                type="number"
                                step="0.1"
                                placeholder="0.5"
                                value={selected.distance_km || ''}
                                onChange={(e) => updateAmenity(amenity.id, {
                                  distance_km: e.target.value ? parseFloat(e.target.value) : undefined
                                })}
                                className="h-8"
                              />
                            </div>
                            
                            <div>
                              <Label className="text-xs">Détails</Label>
                              <Input
                                placeholder="Nom spécifique, infos..."
                                value={selected.details || ''}
                                onChange={(e) => updateAmenity(amenity.id, {
                                  details: e.target.value
                                })}
                                className="h-8"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {category !== 'nature' && <Separator />}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Résumé */}
      {selectedAmenities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Résumé des commodités sélectionnées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(categoryLabels).map(([category, label]) => {
                const count = selectedAmenities.filter(selected => {
                  const amenity = nearbyAmenities?.find(a => a.id === selected.nearby_amenity_id);
                  return amenity?.category === category;
                }).length;
                
                return count > 0 ? (
                  <div key={category} className="text-center p-2 border rounded">
                    <div className="text-sm font-medium">{label}</div>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ) : null;
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};