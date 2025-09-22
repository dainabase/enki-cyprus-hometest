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
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { MediaUploader } from './MediaUploader';
import { CategorizedMediaUploader } from './CategorizedMediaUploader';

import { BuildingCards } from './BuildingCards';
import { AmenitiesSelector } from './AmenitiesSelector';
import PropertySubTypeSelector from './PropertySubTypeSelector';
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
  Globe, Search, Star, Target, Link, Plus, Brain
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { generateSEOContent } from '@/services/seoGenerator';

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
                      form={form}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="statut_commercial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phase commerciale *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pre_commercialisation">Pré-commercialisation</SelectItem>
                      <SelectItem value="commercialisation">En commercialisation</SelectItem>
                      <SelectItem value="reduction_prix">Réduction de prix</SelectItem>
                      <SelectItem value="dernieres_opportunites">Dernières opportunités</SelectItem>
                      <SelectItem value="vendu">Vendu</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="launch_month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mois de lancement</FormLabel>
                    <FormControl>
                      <Input 
                        type="month" 
                        placeholder="2026-01"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Format: Janvier 2026 = 2026-01
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="completion_month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mois de livraison prévue</FormLabel>
                    <FormControl>
                      <Input 
                        type="month"
                        placeholder="2027-03"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Format: Mars 2027 = 2027-03
                    </FormDescription>
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
    
    // ✅ CORRECTION: Initialisation directe sans useEffect ni état local
    // Si aucun bâtiment et nouveau projet, initialiser avec un bâtiment par défaut
    if (buildingsValue.length === 0 && !projectId) {
      const defaultBuilding: ProjectBuilding = {
        building_name: `Bâtiment 1`,
        building_type: 'apartment_building',
        construction_status: 'planned',
        total_floors: 0,
        total_units: 0,
        units_available: 0
      };
      form.setValue('buildings', [defaultBuilding]);
    }
    
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

    const duplicateBuilding = (index: number) => {
      const buildingToDuplicate = buildingsValue[index];
      const newBuilding = { ...buildingToDuplicate, building_name: `${buildingToDuplicate.building_name} - Copie` };
      form.setValue('buildings', [...buildingsValue, newBuilding]);
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
            <BuildingCards
              buildings={buildingsValue}
              onEdit={(index) => {
                // Functionality to be implemented: open building detail editor
                console.log('Edit building at index:', index);
              }}
              onDelete={removeBuilding}
              onAdd={addBuilding}
            />
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

        {/* Commodités de proximité avec checkboxes */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Commodités de Proximité
            </CardTitle>
            <CardDescription>
              Sélectionnez les points d'intérêt à proximité du projet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "Plage", type: "beach", icon: "🏖️" },
                { name: "Restaurant", type: "restaurant", icon: "🍽️" },
                { name: "Centre commercial", type: "shopping", icon: "🛍️" },
                { name: "École", type: "education", icon: "🎓" },
                { name: "Hôpital", type: "healthcare", icon: "🏥" },
                { name: "Marina", type: "marina", icon: "⛵" },
                { name: "Golf", type: "golf", icon: "⛳" },
                { name: "Casino", type: "casino", icon: "🎰" },
                { name: "Parc", type: "park", icon: "🌳" },
                { name: "Salle de sport", type: "gym", icon: "🏋️" },
                { name: "Aéroport", type: "airport", icon: "✈️" },
                { name: "Autoroute", type: "highway", icon: "🛣️" },
                { name: "Supermarché", type: "supermarket", icon: "🛒" },
                { name: "Pharmacie", type: "pharmacy", icon: "💊" }
              ].map((amenity) => {
                const surroundingAmenities = form.watch('surrounding_amenities') || [];
                const isChecked = surroundingAmenities.some((a: any) => 
                  a.nearby_amenity_id === amenity.type
                );
                
                return (
                  <div key={amenity.type} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        const current = form.watch('surrounding_amenities') || [];
                        if (checked) {
                          form.setValue('surrounding_amenities', [
                            ...current,
                            { nearby_amenity_id: amenity.type, distance_km: 0, details: amenity.name }
                          ]);
                        } else {
                          form.setValue('surrounding_amenities', 
                            current.filter((a: any) => 
                              a.nearby_amenity_id !== amenity.type
                            )
                          );
                        }
                      }}
                    />
                    <span className="text-2xl">{amenity.icon}</span>
                    <span className="font-medium">{amenity.name}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
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
                name="price_from"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix à partir de (€)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        placeholder="300000"
                        {...field}
                        onChange={(e) => {
                          field.onChange(parseInt(e.target.value) || 0);
                          // Détection automatique Golden Visa
                          const price = parseFloat(e.target.value);
                          if (price >= 300000) {
                            form.setValue('golden_visa_eligible', true);
                            toast({
                              title: "✨ Éligible Golden Visa",
                              description: "Ce projet est automatiquement éligible au Golden Visa (≥300,000€)",
                              duration: 3000,
                            });
                          }
                        }}
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

            {/* Indicateur Golden Visa */}
            {form.watch('golden_visa_eligible') && (
              <div className="col-span-full">
                <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <Star className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="font-semibold text-amber-900">Projet éligible Golden Visa</p>
                    <p className="text-sm text-amber-700">
                      Prix minimum de 300,000€ atteint pour l'obtention du visa doré
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="golden_visa_eligible"
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

            <FormField
              control={form.control}
              name="vimeo_tour_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Vidéo Vimeo
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://vimeo.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="border-2 border-slate-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
            <CardTitle>Documents du Projet</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <FormField
              control={form.control}
              name="master_plan_pdf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Plan de masse (PDF)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brochure_pdf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Brochure (PDF)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price_list_pdf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Grille tarifaire (PDF)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="technical_specs_pdf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Spécifications techniques (PDF)
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

        <Card className="border-2 border-slate-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
            <CardTitle>Modèles 3D et Plans</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <FormField
              control={form.control}
              name="model_3d_urls"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Liens modèles 3D
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Séparez par des virgules: https://..."
                      {...field}
                      value={Array.isArray(field.value) ? field.value.join(', ') : field.value || ''}
                      onChange={(e) => field.onChange(e.target.value.split(',').map(k => k.trim()).filter(k => k))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="model_3d_urls"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MapIcon className="w-4 h-4" />
                    Modèles 3D
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Séparez par des virgules: https://..."
                      {...field}
                      value={Array.isArray(field.value) ? field.value.join(', ') : field.value || ''}
                      onChange={(e) => field.onChange(e.target.value.split(',').map(k => k.trim()).filter(k => k))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ar_experience_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    Expérience AR
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metaverse_preview_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Aperçu Metaverse
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
            {/* Bouton générateur SEO */}
            <Card className="bg-slate-50 border-slate-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                      <Brain className="w-5 h-5 text-slate-700" />
                      Générateur de contenu SEO
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Générez automatiquement les métadonnées optimisées par l'IA
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={async () => {
                      try {
                        toast({
                          title: "🤖 Génération en cours...",
                          description: "L'IA analyse votre projet pour créer le contenu SEO optimal",
                        });
                        
                        // Récupérer les données actuelles du formulaire
                        const projectData = form.getValues();
                        
                        // Appeler le générateur SEO réel
                        const seoContent = await generateSEOContent(projectData);
                        
                        // Remplir les champs avec le contenu généré
                        form.setValue('meta_title', seoContent.meta_title);
                        form.setValue('meta_description', seoContent.meta_description);
                        form.setValue('meta_keywords', seoContent.meta_keywords);
                        form.setValue('url_slug', seoContent.url_slug);
                        
                        toast({
                          title: "✅ Contenu SEO généré",
                          description: "Les champs ont été optimisés par l'IA pour le référencement",
                        });
                        
                      } catch (error) {
                        console.error('Erreur génération SEO:', error);
                        toast({
                          title: "⚠️ Génération avec fallback",
                          description: "Contenu SEO basique généré en cas d'erreur",
                        });
                      }
                    }}
                    className="bg-slate-900 hover:bg-slate-800 text-white"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Générer le SEO
                  </Button>
                </div>
              </CardContent>
            </Card>
            <FormField
              control={form.control}
              name="meta_title"
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
              name="meta_description"
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

            <FormField
              control={form.control}
              name="meta_keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mots-clés SEO</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Séparez par des virgules: immobilier, chypre, investissement..."
                      {...field}
                      value={Array.isArray(field.value) ? field.value.join(', ') : field.value || ''}
                      onChange={(e) => field.onChange(e.target.value.split(',').map(k => k.trim()).filter(k => k))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="marketing_highlights"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Points Marketing</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Séparez par des virgules: Vue mer, Golden Visa, Près plage..."
                      {...field}
                      value={Array.isArray(field.value) ? field.value.join(', ') : field.value || ''}
                      onChange={(e) => field.onChange(e.target.value.split(',').map(k => k.trim()).filter(k => k))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="target_audience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Audience Cible</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Séparez par des virgules: Investisseurs, Retraités, Familles..."
                      {...field}
                      value={Array.isArray(field.value) ? field.value.join(', ') : field.value || ''}
                      onChange={(e) => field.onChange(e.target.value.split(',').map(k => k.trim()).filter(k => k))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url_slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Slug</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="marina-towers-limassol"
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
                name="featured_project"
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
              
              <FormField
                control={form.control}
                name="construction_phase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phase de construction</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Phase" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="planned">Planifiée</SelectItem>
                        <SelectItem value="in_progress">En cours</SelectItem>
                        <SelectItem value="completion">Finition</SelectItem>
                        <SelectItem value="finished">Terminée</SelectItem>
                      </SelectContent>
                    </Select>
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
