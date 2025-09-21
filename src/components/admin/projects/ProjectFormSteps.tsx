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
import { ProjectFormData } from '@/schemas/projectSchema';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
                          <SelectValue placeholder="Sélectionnez" />
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

              <div className="md:col-span-2">
                <PropertySubTypeSelector form={form} />
              </div>
            </div>

            <FormField
              control={form.control}
              name="developer_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Développeur *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un développeur" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="z-50 bg-background">
                      {developers?.map((dev) => (
                        <SelectItem key={dev.id} value={dev.id}>
                          {dev.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phase du projet */}
            <FormField
              control={form.control}
              name="project_phase"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phase du projet</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || 'off-plan'}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez la phase" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="off-plan">Sur plan</SelectItem>
                      <SelectItem value="under-construction">En construction</SelectItem>
                      <SelectItem value="completed">Achevé</SelectItem>
                      <SelectItem value="ready-to-move">Prêt à emménager</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Points de vente uniques */}
            <FormField
              control={form.control}
              name="unique_selling_points"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Points forts du projet</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input 
                        placeholder="Ex: Vue mer panoramique, Proche écoles internationales..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const value = e.currentTarget.value;
                            if (value) {
                              const current = field.value || [];
                              field.onChange([...current, value]);
                              e.currentTarget.value = '';
                            }
                          }
                        }}
                      />
                      <div className="flex flex-wrap gap-2">
                        {(field.value || []).map((point, index) => (
                          <Badge key={index} variant="secondary" className="gap-1">
                            {point}
                            <button
                              type="button"
                              onClick={() => {
                                const newPoints = [...(field.value || [])];
                                newPoints.splice(index, 1);
                                field.onChange(newPoints);
                              }}
                              className="ml-1 text-xs hover:text-destructive"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
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
                      <Input type="month" {...field} />
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
                    <FormLabel>Date de livraison</FormLabel>
                    <FormControl>
                      <Input type="month" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="exclusive_commercialization"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                   <FormLabel className="text-base font-medium">
                      Commercialisation exclusive
                   </FormLabel>
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
          </CardContent>
        </Card>

        <Card className="border-2 border-slate-300 shadow-lg hover:shadow-xl transition-all duration-200">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
            <CardTitle className="text-xl font-semibold text-foreground">Descriptions</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description courte *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Description courte pour les listes et aperçus"
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
                      placeholder="Description complète du projet"
                      rows={6}
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

  const renderLocationStep = () => {
    return (
      <div className="space-y-8">
        <Card className="border-2 border-slate-300 shadow-lg hover:shadow-xl transition-all duration-200">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
            <CardTitle className="text-xl font-semibold text-foreground">Adresse & Localisation</CardTitle>
            <CardDescription className="text-muted-foreground">
              L'adresse complète remplit automatiquement tous les champs ci-dessous
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <FormField
              control={form.control}
              name="full_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    📍 Adresse complète *
                    <span className="text-xs text-muted-foreground">(remplit automatiquement les champs ci-dessous)</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Tapez l'adresse complète à Chypre... Ex: 28 Amathountos Avenue, Marina, Limassol"
                      {...field}
                      className="text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville * 🏙️</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Auto-rempli" 
                        {...field}
                        className="bg-green-50 border-green-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Région 🗺️</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Auto-rempli" 
                        {...field}
                        className="bg-green-50 border-green-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="neighborhood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quartier 🏘️</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: Marina, Old Town..." 
                        {...field}
                      />
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
                    <FormLabel>Zone Chypre ⚡</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Auto-rempli" 
                        {...field}
                        className="bg-green-50 border-green-200"
                        readOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* District et Municipalité */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>District 🏛️</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: Germasogeia, Agios Athanasios..." 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="municipality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Municipalité 🏘️</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: Municipality of Limassol" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="neighborhood_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description du quartier</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Décrivez l'ambiance et les caractéristiques du quartier (optionnel)"
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="border-2 border-slate-300 shadow-lg hover:shadow-xl transition-all duration-200">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
            <CardTitle className="text-xl font-semibold text-foreground">Coordonnées GPS</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gps_latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="any"
                        placeholder="34.6856"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
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
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="any"
                        placeholder="33.0393"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Proximités (en km)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="proximity_sea_km"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mer</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1"
                        placeholder="0.5"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="proximity_airport_km"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aéroport</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1"
                        placeholder="15"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="proximity_city_center_km"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Centre-ville</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1"
                        placeholder="2"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="proximity_highway_km"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Autoroute</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1"
                        placeholder="1"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
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
                projectId={projectId}
                value={field.value as any || []}
                onChange={(amenities) => field.onChange(amenities)}
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
        <Card className="border-2 border-slate-300 shadow-lg hover:shadow-xl transition-all duration-200">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
            <CardTitle className="text-xl font-semibold text-foreground">Surfaces & Dimensions</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="land_area_m2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Surface terrain (m²)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="1500"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
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
                        placeholder="1200"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-slate-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
            <CardTitle>Construction & Architecture</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="architect_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Architecte 🏗️</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom du cabinet d'architecture" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="builder_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Constructeur 👷</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom de l'entreprise de construction" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="design_style"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Style architectural 🎨</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Moderne, Méditerranéen, Minimaliste..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="finishing_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Niveau de finition ✨</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="basic">Basique</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="luxury">Luxe</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="seismic_rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Norme sismique 🌊</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Eurocode 8" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="warranty_years"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Garantie (années) 🛡️</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="10"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="renovation_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Année rénovation (si applicable)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="2023"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="smoking_policy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Politique fumeurs 🚭</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="allowed">Autorisé</SelectItem>
                        <SelectItem value="restricted">Restrictions</SelectItem>
                        <SelectItem value="forbidden">Interdit</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Matériaux de construction */}
            <FormField
              control={form.control}
              name="construction_materials"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Matériaux de construction 🧱</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input 
                        placeholder="Tapez et appuyez sur Entrée (Ex: Béton armé, Pierre naturelle, Double vitrage...)"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const value = e.currentTarget.value;
                            if (value) {
                              field.onChange([...(field.value || []), value]);
                              e.currentTarget.value = '';
                            }
                          }
                        }}
                      />
                      <div className="flex flex-wrap gap-2">
                        {(field.value || []).map((material, index) => (
                          <Badge key={index} variant="outline">
                            {material}
                            <button
                              type="button"
                              onClick={() => {
                                const newMaterials = [...(field.value || [])];
                                newMaterials.splice(index, 1);
                                field.onChange(newMaterials);
                              }}
                              className="ml-1"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Certifications durabilité */}
            <FormField
              control={form.control}
              name="sustainability_certifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certifications écologiques 🌱</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input 
                        placeholder="Ex: LEED Gold, BREEAM Excellent, Energy Star..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const value = e.currentTarget.value;
                            if (value) {
                              field.onChange([...(field.value || []), value]);
                              e.currentTarget.value = '';
                            }
                          }
                        }}
                      />
                      <div className="flex flex-wrap gap-2">
                        {(field.value || []).map((cert, index) => (
                          <Badge key={index} variant="secondary" className="bg-green-100">
                            {cert}
                            <button
                              type="button"
                              onClick={() => {
                                const newCerts = [...(field.value || [])];
                                newCerts.splice(index, 1);
                                field.onChange(newCerts);
                              }}
                              className="ml-1"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Caractéristiques d'accessibilité */}
            <FormField
              control={form.control}
              name="accessibility_features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Accessibilité PMR ♿</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input 
                        placeholder="Ex: Ascenseur PMR, Rampes d'accès, Portes larges..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const value = e.currentTarget.value;
                            if (value) {
                              field.onChange([...(field.value || []), value]);
                              e.currentTarget.value = '';
                            }
                          }
                        }}
                      />
                      <div className="flex flex-wrap gap-2">
                        {(field.value || []).map((feature, index) => (
                          <Badge key={index} variant="outline" className="border-blue-300">
                            {feature}
                            <button
                              type="button"
                              onClick={() => {
                                const newFeatures = [...(field.value || [])];
                                newFeatures.splice(index, 1);
                                field.onChange(newFeatures);
                              }}
                              className="ml-1"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Assurance bâtiment */}
            <FormField
              control={form.control}
              name="building_insurance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assurance bâtiment 📋</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom de la compagnie d'assurance et détails" {...field} />
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

  const renderPricingStep = () => {
    return (
      <div className="space-y-8">
        <Card className="border-2 border-slate-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
            <CardTitle>Prix & Investissement</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="price_from_new"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix à partir de (€)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="300000"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
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
                    <FormLabel>Prix jusqu'à (€)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="800000"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price_per_m2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix par m² (€)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="2500"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-slate-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
            <CardTitle>Options de Financement & Paiement</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <FormField
              control={form.control}
              name="transfer_fee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frais de transfert (€) 📝</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="12000"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="payment_plan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan de paiement 💳</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Ex: 30% à la signature, 40% pendant construction, 30% à la livraison"
                      rows={3}
                      {...field}
                      value={typeof field.value === 'string' ? field.value : JSON.stringify(field.value || {})}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="incentives"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avantages & Promotions 🎁</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input 
                        placeholder="Ex: Frais de notaire offerts, Mobilier inclus, Remise early bird 5%..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const value = e.currentTarget.value;
                            if (value) {
                              field.onChange([...(field.value || []), value]);
                              e.currentTarget.value = '';
                            }
                          }
                        }}
                      />
                      <div className="flex flex-wrap gap-2">
                        {(field.value || []).map((incentive, index) => (
                          <Badge key={index} variant="default" className="bg-green-600">
                            {incentive}
                            <button
                              type="button"
                              onClick={() => {
                                const newIncentives = [...(field.value || [])];
                                newIncentives.splice(index, 1);
                                field.onChange(newIncentives);
                              }}
                              className="ml-1"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="financing_options"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Détails financement bancaire 🏦</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Ex: Partenariat avec Bank of Cyprus, taux à partir de 3.5%, LTV jusqu'à 70%..."
                      rows={3}
                      {...field}
                      value={typeof field.value === 'string' ? field.value : JSON.stringify(field.value || {})}
                      onChange={(e) => field.onChange(e.target.value)}
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
                      value={field.value || []}
                      onChange={field.onChange}
                      label="Télécharger photos"
                      accept="image/*"
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
              name="project_presentation_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL présentation projet 📊</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="youtube_tour_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vidéo YouTube 📹</FormLabel>
                  <FormControl>
                    <Input placeholder="https://youtube.com/watch?v=..." {...field} />
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
                  <FormLabel>Vidéo Vimeo 🎥</FormLabel>
                  <FormControl>
                    <Input placeholder="https://vimeo.com/..." {...field} />
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
                  <FormLabel>Visite VR 360° 🥽</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interactive_map_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carte interactive 🗺️</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
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
                  <FormLabel>Expérience AR 📱</FormLabel>
                  <FormControl>
                    <Input placeholder="URL de l'expérience en réalité augmentée" {...field} />
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
                  <FormLabel>Visite Metaverse 🌐</FormLabel>
                  <FormControl>
                    <Input placeholder="URL de l'espace metaverse" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="map_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image carte localisation 📍</FormLabel>
                  <FormControl>
                    <Input placeholder="URL de l'image de la carte" {...field} />
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

  const renderAmenitiesStep = () => {
    return (
      <div className="space-y-8">
        <Card className="border-2 border-slate-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
            <CardTitle>Caractéristiques détaillées</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Caractéristiques principales 🌟</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input 
                        placeholder="Ex: Piscine privée, Terrasse panoramique, Cave à vin..."
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
                      <div className="flex flex-wrap gap-2">
                        {(field.value || []).map((feature, index) => (
                          <Badge key={index} variant="default" className="gap-1">
                            {feature}
                            <button
                              type="button"
                              onClick={() => {
                                const newFeatures = [...(field.value || [])];
                                newFeatures.splice(index, 1);
                                field.onChange(newFeatures);
                              }}
                              className="ml-1"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="detailed_features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Équipements détaillés 📋</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input 
                        placeholder="Ex: Climatisation VRV, Chauffage au sol, Volets électriques..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const value = e.currentTarget.value;
                            if (value) {
                              field.onChange([...(field.value || []), value]);
                              e.currentTarget.value = '';
                            }
                          }
                        }}
                      />
                      <div className="flex flex-wrap gap-2">
                        {(field.value || []).map((feature, index) => (
                          <Badge key={index} variant="outline">
                            {feature}
                            <button
                              type="button"
                              onClick={() => {
                                const newFeatures = [...(field.value || [])];
                                newFeatures.splice(index, 1);
                                field.onChange(newFeatures);
                              }}
                              className="ml-1"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lifestyle_amenities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Services lifestyle 🏝️</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input 
                        placeholder="Ex: Conciergerie 24/7, Service voiturier, Chef privé..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const value = e.currentTarget.value;
                            if (value) {
                              field.onChange([...(field.value || []), value]);
                              e.currentTarget.value = '';
                            }
                          }
                        }}
                      />
                      <div className="flex flex-wrap gap-2">
                        {(field.value || []).map((amenity, index) => (
                          <Badge key={index} variant="secondary" className="bg-purple-100">
                            {amenity}
                            <button
                              type="button"
                              onClick={() => {
                                const newAmenities = [...(field.value || [])];
                                newAmenities.splice(index, 1);
                                field.onChange(newAmenities);
                              }}
                              className="ml-1"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="community_features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Espaces communs 👥</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input 
                        placeholder="Ex: Salle de réunion, Espace coworking, Cinéma privé..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const value = e.currentTarget.value;
                            if (value) {
                              field.onChange([...(field.value || []), value]);
                              e.currentTarget.value = '';
                            }
                          }
                        }}
                      />
                      <div className="flex flex-wrap gap-2">
                        {(field.value || []).map((feature, index) => (
                          <Badge key={index} variant="outline" className="border-orange-300">
                            {feature}
                            <button
                              type="button"
                              onClick={() => {
                                const newFeatures = [...(field.value || [])];
                                newFeatures.splice(index, 1);
                                field.onChange(newFeatures);
                              }}
                              className="ml-1"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="wellness_features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bien-être & Santé 🧘</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input 
                        placeholder="Ex: Spa, Hammam, Salle de yoga, Parcours santé..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const value = e.currentTarget.value;
                            if (value) {
                              field.onChange([...(field.value || []), value]);
                              e.currentTarget.value = '';
                            }
                          }
                        }}
                      />
                      <div className="flex flex-wrap gap-2">
                        {(field.value || []).map((feature, index) => (
                          <Badge key={index} variant="secondary" className="bg-green-100">
                            {feature}
                            <button
                              type="button"
                              onClick={() => {
                                const newFeatures = [...(field.value || [])];
                                newFeatures.splice(index, 1);
                                field.onChange(newFeatures);
                              }}
                              className="ml-1"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <FormField
          control={form.control}
          name="amenities"
          render={({ field }) => (
            <FormItem>
              <AmenitiesSelector
                amenities={field.value || []}
                onAmenitiesChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  };

  const renderMarketingStep = () => {
    return (
      <div className="space-y-8">
        <Card className="border-2 border-slate-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
            <CardTitle>SEO & Référencement</CardTitle>
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

            <FormField
              control={form.control}
              name="meta_keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mots-clés SEO 🔍</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input 
                        placeholder="Tapez un mot-clé et appuyez sur Entrée"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const value = e.currentTarget.value.trim();
                            if (value && !field.value?.includes(value)) {
                              field.onChange([...(field.value || []), value]);
                              e.currentTarget.value = '';
                            }
                          }
                        }}
                      />
                      <div className="flex flex-wrap gap-2">
                        {(field.value || []).map((keyword, index) => (
                          <Badge key={index} variant="secondary">
                            {keyword}
                            <button
                              type="button"
                              onClick={() => {
                                const newKeywords = [...(field.value || [])];
                                newKeywords.splice(index, 1);
                                field.onChange(newKeywords);
                              }}
                              className="ml-1"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
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
                  <FormLabel>Points marketing forts 💫</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input 
                        placeholder="Ex: Meilleur ROI de la région, Vendu à 60%, Prix de lancement..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const value = e.currentTarget.value;
                            if (value) {
                              field.onChange([...(field.value || []), value]);
                              e.currentTarget.value = '';
                            }
                          }
                        }}
                      />
                      <div className="flex flex-wrap gap-2">
                        {(field.value || []).map((highlight, index) => (
                          <Badge key={index} variant="default" className="bg-blue-600">
                            {highlight}
                            <button
                              type="button"
                              onClick={() => {
                                const newHighlights = [...(field.value || [])];
                                newHighlights.splice(index, 1);
                                field.onChange(newHighlights);
                              }}
                              className="ml-1"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
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
                  <FormLabel>Cibles clients 🎯</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input 
                        placeholder="Ex: Investisseurs Golden Visa, Familles expatriées, Retraités européens..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const value = e.currentTarget.value;
                            if (value) {
                              field.onChange([...(field.value || []), value]);
                              e.currentTarget.value = '';
                            }
                          }
                        }}
                      />
                      <div className="flex flex-wrap gap-2">
                        {(field.value || []).map((audience, index) => (
                          <Badge key={index} variant="outline">
                            {audience}
                            <button
                              type="button"
                              onClick={() => {
                                const newAudience = [...(field.value || [])];
                                newAudience.splice(index, 1);
                                field.onChange(newAudience);
                              }}
                              className="ml-1"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
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
                  <FormLabel>URL personnalisée (slug) 🔗</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="marina-towers-limassol"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, '-')
                          .replace(/-+/g, '-');
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    URL finale : https://enki-realty.com/projects/{field.value || 'url-slug'}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </div>
    );
  };

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
    case 'amenities':
      return renderAmenitiesStep();
    case 'marketing':
      return renderMarketingStep();
    default:
      return renderBasicsStep();
  }
};