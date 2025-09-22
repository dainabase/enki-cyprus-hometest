import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { MediaUploader } from './MediaUploader';
import { CategorizedMediaUploader } from './CategorizedMediaUploader';
import { NearbyAmenitiesSelector } from './NearbyAmenitiesSelector';
import { AmenitiesSelector } from './AmenitiesSelector';
import PropertySubTypeSelector from './PropertySubTypeSelector';
import { BuildingsSection } from './BuildingsSection';
import { BuildingSection } from './BuildingSection';
import { ProjectFormData } from '@/schemas/projectSchema';
import { ProjectBuilding } from '@/types/building.project';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Building, MapPin, Home, Zap, Landmark, Building2, Waves, Shield, 
  Sprout, Accessibility, Map as MapIcon, Palmtree, Users, Heart,
  HardHat, Palette, Sparkles, FileText, CreditCard, Gift, 
  PiggyBank, BarChart3, Youtube, Video, Headphones, Smartphone,
  Globe, Search, Star, Target, Link, Plus
} from 'lucide-react';

interface ProjectFormStepsProps {
  form: UseFormReturn<ProjectFormData>;
  currentStep: string;
  projectId?: string;
}

export const ProjectFormSteps: React.FC<ProjectFormStepsProps> = ({ form, currentStep, projectId }) => {
  const { t } = useTranslation();
  
  const { data: developers } = useQuery({
    queryKey: ['developers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('developers')
        .select('id, name')
        .eq('status', 'active')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  const renderBasicsStep = () => {
    return (
      <div className="space-y-8">
        <Card className="border-2 border-slate-300 shadow-lg hover:shadow-xl transition-all duration-200">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
            <CardTitle className="text-xl font-semibold text-foreground">Informations de base</CardTitle>
            <CardDescription className="text-muted-foreground">Les détails de base de votre projet</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-700">Nom du projet *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Marina Towers" {...field} className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="project_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-700">Code du projet</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: MT-2025-001" {...field} className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="property_category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || 'residential'}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="residential">Résidentiel</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="mixed">Mixte</SelectItem>
                        <SelectItem value="industrial">Industriel</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="developer_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Développeur *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un développeur" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {developers?.map((developer) => (
                          <SelectItem key={developer.id} value={developer.id}>
                            {developer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="project_phase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phase projet *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Phase" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="off-plan">Off-plan</SelectItem>
                        <SelectItem value="under-construction">En construction</SelectItem>
                        <SelectItem value="completed">Terminé</SelectItem>
                        <SelectItem value="ready-to-move">Prêt à emménager</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="property_sub_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Types de propriété *</FormLabel>
                  <FormControl>
                    <PropertySubTypeSelector
                      selectedTypes={field.value || []}
                      onChange={field.onChange}
                      category={form.watch('property_category') || 'residential'}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="launch_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de lancement</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="completion_date_new"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de livraison prévue</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description courte *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Description courte du projet pour les listes..."
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="detailed_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description détaillée</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Description complète du projet, de ses avantages, de son emplacement..."
                      rows={5}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderBuildingsStep = () => {
    const buildingsValue = form.watch('buildings') || [];
    
    const addBuilding = () => {
      const newBuilding: ProjectBuilding = {
        building_name: `Bâtiment ${buildingsValue.length + 1}`,
        building_type: 'apartment_building',
        construction_status: 'planned',
        total_floors: 0,
        total_units: 0,
        units_available: 0
      };
      form.setValue('buildings', [...buildingsValue, newBuilding]);
    };

    const updateBuilding = (index: number, building: ProjectBuilding) => {
      const newBuildings = [...buildingsValue];
      newBuildings[index] = building;
      form.setValue('buildings', newBuildings);
    };

    const removeBuilding = (index: number) => {
      const newBuildings = [...buildingsValue];
      newBuildings.splice(index, 1);
      form.setValue('buildings', newBuildings);
    };

    return (
      <div className="space-y-8">
        <Card className="border-2 border-slate-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-6 h-6" />
              Gestion des Bâtiments
            </CardTitle>
            <CardDescription>
              Configurez les bâtiments qui composent votre projet. Chaque bâtiment peut avoir ses propres caractéristiques et équipements.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {buildingsValue.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Building2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Aucun bâtiment configuré</p>
                  <p className="text-sm">Commencez par ajouter votre premier bâtiment</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {buildingsValue.map((building, index) => (
                    <BuildingSection
                      key={index}
                      building={building}
                      index={index}
                      form={form}
                      onChange={updateBuilding}
                      onRemove={removeBuilding}
                      canRemove={buildingsValue.length > 1}
                    />
                  ))}
                </div>
              )}
              
              <Button
                type="button"
                onClick={addBuilding}
                className="w-full border-2 border-dashed border-primary/30 hover:border-primary/50 bg-primary/5 hover:bg-primary/10"
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un bâtiment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderAmenitiesStep = () => {
    return (
      <div className="space-y-8">
        <Card className="border-2 border-slate-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
            <CardTitle>Prestations du Projet</CardTitle>
            <CardDescription>
              Commodités et services disponibles pour l'ensemble du projet (pas pour des propriétés individuelles)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <FormField
              control={form.control}
              name="project_amenities"
              render={({ field }) => {
                const predefinedProjectAmenities = [
                  // Amenities communes du PROJET (pas individuelles)
                  'Piscine commune',
                  'Parking visiteurs', 
                  'Espace vert commun',
                  'Hall d\'accueil',
                  'Sécurité 24h/24',
                  'Accès sécurisé',
                  'Vidéosurveillance périmètre',
                  'Gardien',
                  'Interphone général',
                  'Éclairage extérieur',
                  'Aménagement paysager',
                  'Allées piétonnes',
                  'Ramassage ordures'
                ];

                return (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Commodités communes du projet
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        {/* Boutons de sélection rapide */}
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-medium text-muted-foreground">Sélection rapide :</span>
                          <div className="space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => field.onChange([...predefinedProjectAmenities])}
                            >
                              Tout sélectionner
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => field.onChange([])}
                            >
                              Tout déselectionner
                            </Button>
                          </div>
                        </div>
                        
                        {/* Grille de checkboxes prédéfinies */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {predefinedProjectAmenities.map((amenity) => (
                            <label key={amenity} className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors">
                              <input
                                type="checkbox"
                                className="rounded border-border text-primary focus:ring-primary"
                                checked={field.value?.includes(amenity) || false}
                                onChange={(e) => {
                                  const current = field.value || [];
                                  if (e.target.checked) {
                                    field.onChange([...current, amenity]);
                                  } else {
                                    field.onChange(current.filter(f => f !== amenity));
                                  }
                                }}
                              />
                              <span className="text-sm font-medium">{amenity}</span>
                            </label>
                          ))}
                        </div>
                        
                        {/* Option pour ajouter des éléments personnalisés */}
                        <div className="pt-4 border-t">
                          <Input 
                            placeholder="Ajouter une commodité personnalisée..."
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const value = e.currentTarget.value;
                                if (value && !field.value?.includes(value)) {
                                  field.onChange([...(field.value || []), value]);
                                  e.currentTarget.value = '';
                                }
                              }
                            }}
                          />
                        </div>
                        
                        {/* Affichage des éléments sélectionnés */}
                        {field.value && field.value.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {field.value.map((amenity, index) => (
                              <Badge key={index} variant="default" className="gap-1">
                                {amenity}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newAmenities = [...field.value];
                                    newAmenities.splice(index, 1);
                                    field.onChange(newAmenities);
                                  }}
                                  className="ml-1 hover:text-destructive"
                                >
                                  ×
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="community_features"
              render={({ field }) => {
                const predefinedCommunityFeatures = [
                  'Salle de réunion',
                  'Espace coworking',
                  'Cinéma privé',
                  'Salle de réception',
                  'Business center',
                  'Lobby luxueux',
                  'Rooftop lounge',
                  'Bar/Lounge',
                  'Restaurant',
                  'Café',
                  'Bibliothèque commune',
                  'Kids club',
                  'Teen room',
                  'Salle de jeux',
                  'Billard',
                  'Bowling',
                  'Golf simulator',
                  'Wine cellar commune',
                  'Cuisine commune',
                  'BBQ area'
                ];

                return (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Espaces communs
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        {/* Boutons de sélection rapide */}
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-medium text-muted-foreground">Sélection rapide :</span>
                          <div className="space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => field.onChange([...predefinedCommunityFeatures])}
                            >
                              Tout sélectionner
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => field.onChange([])}
                            >
                              Tout déselectionner
                            </Button>
                          </div>
                        </div>
                        
                        {/* Grille de checkboxes prédéfinies */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {predefinedCommunityFeatures.map((feature) => (
                            <label key={feature} className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors">
                              <input
                                type="checkbox"
                                className="rounded border-border text-primary focus:ring-primary"
                                checked={field.value?.includes(feature) || false}
                                onChange={(e) => {
                                  const current = field.value || [];
                                  if (e.target.checked) {
                                    field.onChange([...current, feature]);
                                  } else {
                                    field.onChange(current.filter(f => f !== feature));
                                  }
                                }}
                              />
                              <span className="text-sm font-medium">{feature}</span>
                            </label>
                          ))}
                        </div>
                        
                        {/* Option pour ajouter des éléments personnalisés */}
                        <div className="pt-4 border-t">
                          <Input 
                            placeholder="Ajouter un espace commun personnalisé..."
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const value = e.currentTarget.value;
                                if (value && !field.value?.includes(value)) {
                                  field.onChange([...(field.value || []), value]);
                                  e.currentTarget.value = '';
                                }
                              }
                            }}
                          />
                        </div>
                        
                        {/* Affichage des éléments sélectionnés */}
                        {field.value && field.value.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {field.value.map((feature, index) => (
                              <Badge key={index} variant="outline" className="gap-1 border-orange-300">
                                {feature}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newFeatures = [...field.value];
                                    newFeatures.splice(index, 1);
                                    field.onChange(newFeatures);
                                  }}
                                  className="ml-1 hover:text-destructive"
                                >
                                  ×
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </CardContent>
        </Card>

        <FormField
          control={form.control}
          name="amenities"
          render={({ field }) => (
            <FormItem>
              <AmenitiesSelector
                selectedAmenities={field.value || []}
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  };

  // Render the rest of the steps from the original file
  const renderLocationStep = () => {
    return (
      <div className="space-y-8">
        <Card className="border-2 border-slate-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
            <CardTitle>Localisation</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Limassol" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cyprus_zone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zone de Chypre</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une zone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="limassol">Limassol</SelectItem>
                        <SelectItem value="nicosia">Nicosie</SelectItem>
                        <SelectItem value="paphos">Paphos</SelectItem>
                        <SelectItem value="larnaca">Larnaca</SelectItem>
                        <SelectItem value="famagusta">Famagouste</SelectItem>
                        <SelectItem value="kyrenia">Kyrenia</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="full_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse complète</FormLabel>
                  <FormControl>
                    <Input placeholder="Adresse du projet" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gps_latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude GPS</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="any"
                        placeholder="34.6851" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gps_longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude GPS</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="any"
                        placeholder="33.0280" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <FormField
          control={form.control}
          name="surrounding_amenities"
          render={({ field }) => (
            <FormItem>
              <NearbyAmenitiesSelector
                value={field.value || []}
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  };

  const renderSpecificationsStep = () => {
    return (
      <div className="space-y-8">
        <Card className="border-2 border-slate-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
            <CardTitle>Spécifications générales</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="land_area_m2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Surface terrain (m²)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        placeholder="2500"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="built_area_m2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Surface construite (m²)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        placeholder="1800"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="parking_spaces"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Places de parking</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        placeholder="50"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bedrooms_range"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gamme chambres</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 1-4 chambres" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bathrooms_range"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gamme salles de bain</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 1-3 salles de bain" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderPricingStep = () => {
    return (
      <div className="space-y-8">
        <Card className="border-2 border-slate-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
            <CardTitle>Prix et investissement</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix de base *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        placeholder="350000"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price_from_new"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix à partir de</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        placeholder="300000"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price_to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix jusqu'à</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        placeholder="800000"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="golden_visa_eligible_new"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Éligible Golden Visa</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Automatiquement activé si prix ≥ 300,000€
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="financing_available"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Financement disponible</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Possibilité de crédit bancaire
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderMediaStep = () => {
    return (
      <div className="space-y-8">
        <Card className="border-2 border-slate-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
            <CardTitle>Photos du projet</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="photos"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CategorizedMediaUploader
                      field={{
                        value: field.value as any || [],
                        onChange: field.onChange
                      }}
                      bucketName="projects"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="border-2 border-slate-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
            <CardTitle>Contenu Multimédia</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <FormField
              control={form.control}
              name="youtube_tour_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Youtube className="w-4 h-4" />
                    Vidéo YouTube
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://youtube.com/watch?v=..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vr_tour_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Headphones className="w-4 h-4" />
                    Visite VR 360°
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderMarketingStep = () => {
    return (
      <div className="space-y-8">
        <Card className="border-2 border-slate-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
            <CardTitle>Marketing & SEO</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <FormField
              control={form.control}
              name="meta_title_new"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre SEO</FormLabel>
                  <FormControl>
                    <Input placeholder="Titre optimisé pour les moteurs de recherche (60 caractères max)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="meta_description_new"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description SEO</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Description pour les moteurs de recherche (160 caractères max)"
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status_project"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut projet</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="disponible">Disponible</SelectItem>
                        <SelectItem value="en_construction">En construction</SelectItem>
                        <SelectItem value="livre">Livré</SelectItem>
                        <SelectItem value="pret_a_emmenager">Prêt à emménager</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="featured_new"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Projet en vedette</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Afficher en priorité
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Main switch based on current step
  switch (currentStep) {
    case 'basics':
      return renderBasicsStep();
    case 'location':
      return renderLocationStep();
    case 'specifications':
      return renderSpecificationsStep();
    case 'pricing':
      return renderPricingStep();
    case 'media':
      return renderMediaStep();
    case 'buildings':
      return renderBuildingsStep();
    case 'amenities':
      return renderAmenitiesStep();
    case 'marketing':
      return renderMarketingStep();
    default:
      return renderBasicsStep();
  }
};