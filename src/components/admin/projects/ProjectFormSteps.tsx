import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { MediaUploader } from './MediaUploader';
import { CategorizedMediaUploader } from './CategorizedMediaUploader';
import { AmenitiesSelector } from './AmenitiesSelector';
import PropertySubTypeSelector from './PropertySubTypeSelector';
import { ProjectFormData } from '@/schemas/projectSchema';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ProjectFormStepsProps {
  form: UseFormReturn<ProjectFormData>;
  currentStep: string;
}

export const ProjectFormSteps: React.FC<ProjectFormStepsProps> = ({ form, currentStep }) => {
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations principales</CardTitle>
          <CardDescription>Les détails de base de votre projet</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du projet *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Marina Towers" {...field} />
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
                  <FormLabel>Code projet</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: MT-2025-001" {...field} />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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

            <FormField
              control={form.control}
              name="project_phase"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phase du projet</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="off-plan">Sur plan</SelectItem>
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
            name="developer_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Développeur *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un développeur" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
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
                  <FormLabel>Date de livraison</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
          <CardTitle>Descriptions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Adresse & Localisation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="full_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse complète</FormLabel>
                <FormControl>
                  <Input placeholder="123 Avenue de la Mer, Limassol" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Région</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Limassol District" {...field} />
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
                  <FormLabel>Quartier</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Marina" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="cyprus_zone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zone de Chypre</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une zone" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="limassol">Limassol</SelectItem>
                    <SelectItem value="paphos">Paphos</SelectItem>
                    <SelectItem value="larnaca">Larnaca</SelectItem>
                    <SelectItem value="nicosia">Nicosia</SelectItem>
                    <SelectItem value="famagusta">Famagusta</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Coordonnées GPS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
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
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
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
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
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
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
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
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
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
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
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

  const renderSpecificationsStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Surfaces & Dimensions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
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
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
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
          <CardTitle>Unités & Logements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
                      onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
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
                      onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
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

      <Card>
        <CardHeader>
          <CardTitle>Équipements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
                      onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
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
                      onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
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
                      onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Prix & Tarifs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
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
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
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
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
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

      <Card>
        <CardHeader>
          <CardTitle>Golden Visa & Investissement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Photos du Projet</CardTitle>
          <CardDescription>
            Gérez vos photos par catégorie pour un affichage optimal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="photos"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <CategorizedMediaUploader
                    field={field}
                    bucketName="projects"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Plans & Documentation</CardTitle>
        </CardHeader>
        <CardContent>
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

      <Card>
        <CardHeader>
          <CardTitle>Contenu Multimédia</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
    <Card>
      <CardHeader>
        <CardTitle>Prestations & Équipements</CardTitle>
        <CardDescription>Sélectionnez les prestations disponibles dans le projet</CardDescription>
      </CardHeader>
      <CardContent>
        <AmenitiesSelector
          selectedAmenities={form.watch('amenities') || []}
          onChange={(amenities) => form.setValue('amenities', amenities)}
        />
      </CardContent>
    </Card>
  );

  const renderMarketingStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>SEO & Marketing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="meta_title_new"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titre SEO</FormLabel>
                <FormControl>
                  <Input placeholder="Titre optimisé pour les moteurs de recherche" {...field} />
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
                    placeholder="Description pour les moteurs de recherche (max 160 caractères)"
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
            name="project_narrative"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Récit marketing</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Histoire et positionnement marketing du projet"
                    rows={4}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statut & Visibilité</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Statut du projet</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un statut" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="available">Disponible</SelectItem>
                    <SelectItem value="under_construction">En construction</SelectItem>
                    <SelectItem value="delivered">Livré</SelectItem>
                    <SelectItem value="sold">Vendu</SelectItem>
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