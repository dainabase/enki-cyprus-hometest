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

  const renderBasicsStep = () => (
    <div className="space-y-8">
      <Card className="border-2 border-slate-300 shadow-lg hover:shadow-xl transition-all duration-200">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-slate-200">
          <CardTitle className="text-xl font-semibold text-foreground">Informations de base</CardTitle>
          <CardDescription className="text-muted-foreground">Les détails de base de votre projet</CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-8"> {/* Augmenté le padding et l'espacement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> {/* Augmenté l'espacement */}
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

            {/* Property Sub Type - Multiple Selection */}
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

      <Card className="border-border/50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
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

  const renderLocationStep = () => (
    <div className="space-y-8">
      <Card className="border-border/50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="text-xl font-semibold text-foreground">Adresse & Localisation</CardTitle>
          <CardDescription className="text-muted-foreground">
            L'adresse complète remplit automatiquement tous les champs ci-dessous
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Smart Address Input - Improved version with auto-parsing */}
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
                    onChange={(e) => {
                      field.onChange(e);
                      // Auto-parse pour remplir les autres champs
                      const address = e.target.value.toLowerCase();
                      
                      // Parse city and set corresponding fields
                      if (address.includes('limassol')) {
                        form.setValue('city', 'Limassol');
                        form.setValue('region', 'Limassol District');
                        form.setValue('cyprus_zone', 'limassol');
                      } else if (address.includes('paphos')) {
                        form.setValue('city', 'Paphos');
                        form.setValue('region', 'Paphos District');
                        form.setValue('cyprus_zone', 'paphos');
                      } else if (address.includes('larnaca')) {
                        form.setValue('city', 'Larnaca');
                        form.setValue('region', 'Larnaca District');
                        form.setValue('cyprus_zone', 'larnaca');
                      } else if (address.includes('nicosia') || address.includes('lefkosia')) {
                        form.setValue('city', 'Nicosia');
                        form.setValue('region', 'Nicosia District');
                        form.setValue('cyprus_zone', 'nicosia');
                      } else if (address.includes('famagusta')) {
                        form.setValue('city', 'Famagusta');
                        form.setValue('region', 'Famagusta District');
                        form.setValue('cyprus_zone', 'famagusta');
                      }
                      
                      // Parse neighborhood from common patterns
                      if (address.includes('marina')) {
                        form.setValue('neighborhood', 'Marina');
                      } else if (address.includes('old town') || address.includes('old city')) {
                        form.setValue('neighborhood', 'Old Town');
                      } else if (address.includes('tourist area')) {
                        form.setValue('neighborhood', 'Tourist Area');
                      }
                    }}
                    className="text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Auto-filled fields */}
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

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 <strong>Astuce :</strong> Plus l'adresse est précise, plus les champs se remplissent automatiquement ! 
              Incluez le numéro, la rue, le quartier et la ville pour de meilleurs résultats.
            </p>
          </div>

          {/* Additional location details */}
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

      <Card className="border-border/50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
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

      {/* Commodités de proximité - CHAMP NORMAL DU FORMULAIRE */}
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

  const renderSpecificationsStep = () => (
    <div className="space-y-8">
      <Card className="border-border/50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
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

      <Card className="border-border/50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="text-xl font-semibold text-foreground">Unités & Logements</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="total_units_new"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total unités</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="24"
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
              name="units_available_new"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unités disponibles</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="18"
                      {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
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
                  <FormLabel>Nombre de chambres</FormLabel>
                  <FormControl>
                    <Input placeholder="1-4" {...field} />
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
                  <FormLabel>Nombre de salles de bain</FormLabel>
                  <FormControl>
                    <Input placeholder="1-3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="text-xl font-semibold text-foreground">Caractéristiques Techniques</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="energy_rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Classe énergétique</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                          <SelectItem value="D">D</SelectItem>
                          <SelectItem value="E">E</SelectItem>
                          <SelectItem value="F">F</SelectItem>
                          <SelectItem value="G">G</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <FormField
              control={form.control}
              name="construction_year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Année construction</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="2025"
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
              name="building_certification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certification bâtiment</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="LEED Gold, BREEAM..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="maintenance_fees_yearly"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frais maintenance/an (€)</FormLabel>
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

            <FormField
              control={form.control}
              name="property_tax_yearly"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taxe foncière/an (€)</FormLabel>
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

            <FormField
              control={form.control}
              name="hoa_fees_monthly"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Charges copropriété/mois (€)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="150"
                      {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
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
              name="internet_speed_mbps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vitesse internet (Mbps)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="100"
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
                name="pet_policy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Politique animaux</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="allowed">Autorisés</SelectItem>
                          <SelectItem value="restricted">Restrictions</SelectItem>
                          <SelectItem value="forbidden">Interdits</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="text-xl font-semibold text-foreground">Équipements</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="floors_total"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre d'étages</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="8"
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
              name="parking_spaces"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Places parking</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="30"
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
              name="storage_spaces"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Espaces stockage</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="24"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                    />
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

  const renderPricingStep = () => (
    <div className="space-y-8">
      <Card className="border-border/50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="text-xl font-semibold text-foreground">Prix & Tarifs</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix de base * (€)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="250000"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                      placeholder="180000"
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
                      placeholder="350000"
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
                  <FormLabel>Prix au m² (€)</FormLabel>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="vat_rate_new"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taux TVA (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      placeholder="5.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 5)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vat_included"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>TVA incluse</FormLabel>
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

      <Card className="border-border/50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="text-xl font-semibold text-foreground">Golden Visa & Investissement</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <FormField
            control={form.control}
            name="golden_visa_eligible_new"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Éligible Golden Visa</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Projet éligible au programme Golden Visa (≥ 300,000€)
                  </p>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="roi_estimate_percent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ROI estimé (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.1"
                      placeholder="8.5"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rental_yield_percent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rendement locatif (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.1"
                      placeholder="6.2"
                      {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="financing_available"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Financement disponible</FormLabel>
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
    </div>
  );

  const renderMediaStep = () => (
    <div className="space-y-8">
      <Card className="border-border/50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="text-xl font-semibold text-foreground">Photos du Projet</CardTitle>
          <CardDescription className="text-muted-foreground">
            Gérez vos photos par catégorie pour un affichage optimal
          </CardDescription>
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
                      value: Array.isArray(field.value) ? field.value.filter((photo: any) => photo && photo.url) as any : [],
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

      <Card className="border-border/50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="text-xl font-semibold text-foreground">Plans & Documentation</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <FormField
            control={form.control}
            name="floor_plan_urls"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <MediaUploader
                    field={field}
                    label="Plans d'étage"
                    accept="image/*,.pdf"
                    bucketName="projects"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="text-xl font-semibold text-foreground">Contenu Multimédia</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <FormField
            control={form.control}
            name="virtual_tour_url_new"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL visite virtuelle</FormLabel>
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

  const renderAmenitiesStep = () => (
    <Card className="border-border/50 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
        <CardTitle className="text-xl font-semibold text-foreground">Prestations & Équipements</CardTitle>
        <CardDescription className="text-muted-foreground">Sélectionnez les prestations disponibles dans le projet</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <AmenitiesSelector
          selectedAmenities={form.watch('amenities') || []}
          onChange={(amenities) => {
            form.setValue('amenities', amenities);
          }}
        />
      </CardContent>
    </Card>
  );

  const renderMarketingStep = () => (
    <div className="space-y-8">
      <Card className="border-border/50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="text-xl font-semibold text-foreground">SEO & Marketing</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <FormField
            control={form.control}
            name="meta_title_new"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titre SEO</FormLabel>
                <FormControl>
                  <Input placeholder="Appartements de luxe à Limassol – Vue mer, piscine, centre-ville | ENKI Realty" {...field} />
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
                    placeholder="Résidence premium à Limassol: appartements 2–4 pièces, vue mer, prestations 5★, proche écoles/commodités. Golden Visa, rentabilité jusqu’à 6%, prix dès 350 000€."
                    rows={3}
                    sanitize={false}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="project_narrative"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Récit marketing</FormLabel>
                <p className="text-xs text-muted-foreground">Texte narratif pour convaincre: bénéfices, style de vie, preuves sociales. Utilisé sur la fiche projet et pour le SEO long.</p>
                <FormControl>
                  <Textarea 
                    placeholder="Découvrez une adresse d’exception: architecture contemporaine, matériaux haut de gamme, espaces lumineux, terrasses panoramiques et services premium (conciergerie, fitness, spa). Un investissement sécurisé au cœur de Limassol, idéal pour résidence principale ou rendement locatif soutenu."
                    rows={4}
                    sanitize={false}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="text-xl font-semibold text-foreground">Statut & Visibilité</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <FormField
            control={form.control}
            name="status_project"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Statut du projet</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value || 'disponible'}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un statut" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white z-50">
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
            name="statut_commercial"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Statut commercial</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value || 'prelancement'}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un statut commercial" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="prelancement">Prélancement</SelectItem>
                    <SelectItem value="lancement_commercial">Lancement commercial</SelectItem>
                    <SelectItem value="en_commercialisation">En commercialisation</SelectItem>
                    <SelectItem value="derniere_opportunite">Dernière opportunité</SelectItem>
                    <SelectItem value="vendu">Vendu</SelectItem>
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
                  <FormLabel>Projet mis en avant</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Afficher ce projet dans les sélections spéciales
                  </p>
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
    </div>
  );

  // Main render switch
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