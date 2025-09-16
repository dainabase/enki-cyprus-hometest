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
import { MediaUploader } from './MediaUploader';
import { CategorizedMediaUploader } from './CategorizedMediaUploader';
import { NearbyAmenitiesSelector } from './NearbyAmenitiesSelector';
import { AmenitiesSelector } from './AmenitiesSelector';
import PropertySubTypeSelector from './PropertySubTypeSelector';
import { ProjectFormData } from '@/schemas/projectSchema';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SimpleProjectFormStepsProps {
  form: UseFormReturn<ProjectFormData>;
  currentStep: string;
  projectId?: string;
}

export const SimpleProjectFormSteps: React.FC<SimpleProjectFormStepsProps> = ({ form, currentStep, projectId }) => {
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
        <CardContent className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Label className="text-sm font-semibold text-slate-700">Nom du projet *</Label>
              <Input 
                placeholder="Ex: Marina Towers" 
                {...form.register("title")} 
                className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm" 
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div>
              <Label className="text-sm font-semibold text-slate-700">Code du projet</Label>
              <Input 
                placeholder="Ex: MT-2025-001" 
                {...form.register("project_code")} 
                className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm" 
              />
              {form.formState.errors.project_code && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.project_code.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Catégorie *</Label>
              <Select onValueChange={(value) => form.setValue('property_category', value as 'residential' | 'commercial' | 'mixed' | 'industrial')} value={form.watch('property_category') || 'residential'}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez" />
                </SelectTrigger>
                <SelectContent>
                   <SelectItem value="residential">Résidentiel</SelectItem>
                   <SelectItem value="commercial">Commercial</SelectItem>
                   <SelectItem value="mixed">Mixte</SelectItem>
                   <SelectItem value="industrial">Industriel</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.property_category && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.property_category.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <PropertySubTypeSelector form={form} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Développeur *</Label>
              <Select onValueChange={(value) => form.setValue('developer_id', value)} value={form.watch('developer_id') || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un développeur" />
                </SelectTrigger>
                <SelectContent>
                  {developers?.map((dev) => (
                    <SelectItem key={dev.id} value={dev.id}>{dev.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.developer_id && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.developer_id.message}</p>
              )}
            </div>

            <div>
              <Label>Phase du projet</Label>
              <Select onValueChange={(value) => form.setValue('project_phase', value as 'off-plan' | 'under-construction' | 'completed' | 'ready-to-move')} value={form.watch('project_phase') || 'planned'}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planifié</SelectItem>
                  <SelectItem value="off-plan">Hors plan</SelectItem>
                  <SelectItem value="under-construction">En construction</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                  <SelectItem value="ready-to-move">Prêt à emménager</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Date de lancement</Label>
              <Input 
                type="date"
                {...form.register("launch_date")} 
                className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm" 
              />
            </div>

            <div>
              <Label>Date de livraison prévue</Label>
              <Input 
                type="date"
                {...form.register("completion_date_new")} 
                className="border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm" 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderLocationStep = () => (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Localisation</CardTitle>
          <CardDescription>Informations géographiques du projet</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Adresse complète *</Label>
            <Input 
              placeholder="123 Rue de la République, 75001 Paris"
              {...form.register("full_address")} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Ville *</Label>
              <Input 
                placeholder="Paris"
                {...form.register("city")} 
              />
            </div>
            <div>
              <Label>Région *</Label>
              <Input 
                placeholder="Île-de-France"
                {...form.register("region")} 
              />
            </div>
            <div>
              <Label>Zone de Chypre</Label>
              <Select onValueChange={(value) => form.setValue('cyprus_zone', value)} value={form.watch('cyprus_zone') || 'limassol'}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="limassol">Limassol</SelectItem>
                  <SelectItem value="paphos">Paphos</SelectItem>
                  <SelectItem value="larnaca">Larnaca</SelectItem>
                  <SelectItem value="nicosia">Nicosia</SelectItem>
                  <SelectItem value="famagusta">Famagusta</SelectItem>
                  <SelectItem value="kyrenia">Kyrenia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Latitude GPS</Label>
              <Input 
                type="number"
                step="any"
                placeholder="35.1856"
                {...form.register("gps_latitude", { valueAsNumber: true })} 
              />
            </div>
            <div>
              <Label>Longitude GPS</Label>
              <Input 
                type="number"
                step="any"
                placeholder="33.3823"
                {...form.register("gps_longitude", { valueAsNumber: true })} 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDescriptionStep = () => (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
          <CardDescription>Détails et descriptions du projet</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Description *</Label>
            <Textarea 
              placeholder="Décrivez votre projet..."
              className="min-h-[120px]"
              {...form.register("description")} 
            />
          </div>

          <div>
            <Label>Description détaillée</Label>
            <Textarea 
              placeholder="Description plus détaillée..."
              className="min-h-[200px]"
              {...form.register("detailed_description")} 
            />
          </div>

          <div>
            <Label>Récit du projet</Label>
            <Textarea 
              placeholder="L'histoire et la vision derrière ce projet..."
              className="min-h-[120px]"
              {...form.register("project_narrative")} 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPricingStep = () => (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Tarification</CardTitle>
          <CardDescription>Informations de prix et financières</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Prix de base *</Label>
              <Input 
                type="number"
                placeholder="300000"
                {...form.register("price", { valueAsNumber: true })} 
              />
            </div>
            <div>
              <Label>Prix à partir de</Label>
              <Input 
                type="number"
                placeholder="250000"
                {...form.register("price_from_new", { valueAsNumber: true })} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Prix jusqu'à</Label>
              <Input 
                type="number"
                placeholder="500000"
                {...form.register("price_to", { valueAsNumber: true })} 
              />
            </div>
            <div>
              <Label>Prix au m²</Label>
              <Input 
                type="number"
                placeholder="3000"
                {...form.register("price_per_m2", { valueAsNumber: true })} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Taux de TVA (%)</Label>
              <Input 
                type="number"
                step="0.01"
                placeholder="5.00"
                {...form.register("vat_rate_new", { valueAsNumber: true })} 
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                checked={form.watch('vat_included') || false}
                onCheckedChange={(value) => form.setValue('vat_included', value)}
              />
              <Label>TVA incluse</Label>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch 
              checked={form.watch('golden_visa_eligible_new') || false}
              onCheckedChange={(value) => form.setValue('golden_visa_eligible_new', value)}
            />
            <Label>Éligible Golden Visa</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderMediaStep = () => (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Médias</CardTitle>
          <CardDescription>Photos, vidéos et documents du projet</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>URL visite virtuelle</Label>
            <Input 
              placeholder="https://..."
              {...form.register("virtual_tour_url_new")} 
            />
          </div>

          <div>
            <Label>URL vidéo YouTube</Label>
            <Input 
              placeholder="https://youtube.com/..."
              {...form.register("youtube_tour_url")} 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  switch (currentStep) {
    case 'basics':
      return renderBasicsStep();
    case 'location':
      return renderLocationStep();
    case 'description':
      return renderDescriptionStep();
    case 'pricing':
      return renderPricingStep();
    case 'media':
      return renderMediaStep();
    default:
      return renderBasicsStep();
  }
};