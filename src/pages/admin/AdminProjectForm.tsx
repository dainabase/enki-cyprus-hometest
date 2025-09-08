import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import Layout from '@/components/layout/Layout';
import { ProjectFormSteps } from '@/components/admin/projects/ProjectFormSteps';
import { projectSchema, ProjectFormData, projectFormSteps } from '@/schemas/projectSchema';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, Save, Eye, CheckCircle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export const AdminProjectForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const queryClient = useQueryClient();
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [saveType, setSaveType] = useState<'draft' | 'publish'>('draft');

  const currentStep = projectFormSteps[currentStepIndex];

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      city: '',
      full_address: '',
      region: '',
      neighborhood: '',
      photos: [],
      features: [],
      amenities: [],
      status: 'available',
      vat_rate_new: 5,
      vat_included: false,
      golden_visa_eligible_new: false,
      financing_available: false,
      featured_new: false,
      cyprus_zone: 'limassol',
      property_category: 'residential',
      property_sub_type: [],
      project_phase: 'off-plan',
      price: 0
    }
  });

  // Fetch project data for editing
  const { data: projectData, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: isEdit
  });

  // Populate form when data is loaded
  React.useEffect(() => {
    if (projectData && isEdit) {
        // Transform data to match form structure
        const formData: Partial<ProjectFormData> = {
          title: projectData.title,
          description: projectData.description,
          detailed_description: projectData.detailed_description,
         developer_id: projectData.developer_id,
         status: projectData.status as ProjectFormData['status'],
        price: projectData.price,
         photos: Array.isArray(projectData.categorized_photos) && projectData.categorized_photos.length > 0 
           ? projectData.categorized_photos as any[]
           : (projectData.photos || []).map((url: string) => ({
               url,
               category: 'hero' as const,
               isPrimary: false,
               caption: ''
             })),
        features: projectData.features || [],
        cyprus_zone: projectData.cyprus_zone || 'limassol',
        
          // New fields
          project_code: projectData.project_code,
          property_category: projectData.property_category as ProjectFormData['property_category'],
          property_sub_type: projectData.property_sub_type as ProjectFormData['property_sub_type'],
          project_phase: projectData.project_phase as ProjectFormData['project_phase'],
        launch_date: projectData.launch_date,
        completion_date_new: projectData.completion_date_new,
        
        // Location
        full_address: projectData.full_address,
        city: projectData.city,
        region: projectData.region,
        neighborhood: projectData.neighborhood,
        gps_latitude: projectData.gps_latitude,
        gps_longitude: projectData.gps_longitude,
        proximity_sea_km: projectData.proximity_sea_km,
        proximity_airport_km: projectData.proximity_airport_km,
        proximity_city_center_km: projectData.proximity_city_center_km,
        
        // Specifications
        land_area_m2: projectData.land_area_m2,
        built_area_m2: projectData.built_area_m2,
        total_units_new: projectData.total_units_new,
        units_available_new: projectData.units_available_new,
        bedrooms_range: projectData.bedrooms_range,
        bathrooms_range: projectData.bathrooms_range,
        floors_total: projectData.floors_total,
        parking_spaces: projectData.parking_spaces,
        storage_spaces: projectData.storage_spaces,
        
        // Pricing
        price_from_new: projectData.price_from_new,
        price_to: projectData.price_to,
        price_per_m2: projectData.price_per_m2,
        vat_rate_new: projectData.vat_rate_new || 5,
        vat_included: projectData.vat_included || false,
        golden_visa_eligible_new: projectData.golden_visa_eligible_new || false,
        roi_estimate_percent: projectData.roi_estimate_percent,
        rental_yield_percent: projectData.rental_yield_percent,
        financing_available: projectData.financing_available || false,
        
        // Media
        photo_gallery_urls: projectData.photo_gallery_urls,
        video_tour_urls: projectData.video_tour_urls,
        floor_plan_urls: projectData.floor_plan_urls,
        virtual_tour_url_new: projectData.virtual_tour_url_new,
        drone_footage_urls: projectData.drone_footage_urls,
        model_3d_urls: projectData.model_3d_urls,
        
        // Marketing
        project_narrative: projectData.project_narrative,
        meta_title_new: projectData.meta_title_new,
        meta_description_new: projectData.meta_description_new,
        featured_new: projectData.featured_new || false
      };

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined) {
          form.setValue(key as keyof ProjectFormData, value);
        }
      });
    }
  }, [projectData, isEdit, form]);

  // Save project mutation
  const saveProjectMutation = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      // Transform form data to database format
      const projectData = {
        title: data.title,
        description: data.description,
        detailed_description: data.detailed_description,
         developer_id: data.developer_id,
         status: data.status,
        price: data.price,
        photos: data.photos,
        features: data.features,
        cyprus_zone: data.cyprus_zone,
        
        // New fields
        project_code: data.project_code,
        property_category: data.property_category,
        property_sub_type: data.property_sub_type,
        project_phase: data.project_phase,
        launch_date: data.launch_date,
        completion_date_new: data.completion_date_new,
        unique_selling_points: data.unique_selling_points,
        
        // Location
        full_address: data.full_address,
        city: data.city,
        region: data.region,
        neighborhood: data.neighborhood,
        neighborhood_description: data.neighborhood_description,
        gps_latitude: data.gps_latitude,
        gps_longitude: data.gps_longitude,
        proximity_sea_km: data.proximity_sea_km,
        proximity_airport_km: data.proximity_airport_km,
        proximity_city_center_km: data.proximity_city_center_km,
        proximity_highway_km: data.proximity_highway_km,
        
        // Specifications
        land_area_m2: data.land_area_m2,
        built_area_m2: data.built_area_m2,
        total_units_new: data.total_units_new,
        units_available_new: data.units_available_new,
        bedrooms_range: data.bedrooms_range,
        bathrooms_range: data.bathrooms_range,
        floors_total: data.floors_total,
        parking_spaces: data.parking_spaces,
        storage_spaces: data.storage_spaces,
        
        // Pricing
        price_from_new: data.price_from_new,
        price_to: data.price_to,
        price_per_m2: data.price_per_m2,
        vat_rate_new: data.vat_rate_new,
        vat_included: data.vat_included,
        golden_visa_eligible_new: data.golden_visa_eligible_new,
        roi_estimate_percent: data.roi_estimate_percent,
        rental_yield_percent: data.rental_yield_percent,
        financing_available: data.financing_available,
        financing_options: data.financing_options,
        payment_plan: data.payment_plan,
        incentives: data.incentives,
        
        // Media
        categorized_photos: data.photos,
        photo_gallery_urls: data.photo_gallery_urls,
        video_tour_urls: data.video_tour_urls,
        floor_plan_urls: data.floor_plan_urls,
        virtual_tour_url_new: data.virtual_tour_url_new,
        project_presentation_url: data.project_presentation_url,
        youtube_tour_url: data.youtube_tour_url,
        vimeo_tour_url: data.vimeo_tour_url,
        drone_footage_urls: data.drone_footage_urls,
        model_3d_urls: data.model_3d_urls,
        
        // Construction
        construction_materials: data.construction_materials,
        finishing_level: data.finishing_level,
        design_style: data.design_style,
        architect_name: data.architect_name,
        builder_name: data.builder_name,
        energy_rating: data.energy_rating,
        sustainability_certifications: data.sustainability_certifications,
        warranty_years: data.warranty_years,
        
        // Marketing
        project_narrative: data.project_narrative,
        meta_title_new: data.meta_title_new,
        meta_description_new: data.meta_description_new,
        meta_keywords: data.meta_keywords,
        marketing_highlights: data.marketing_highlights,
        target_audience: data.target_audience,
        featured_new: data.featured_new,
        
        // Legacy compatibility
        location: data.location || {
          city: data.city || '',
          address: data.full_address || '',
          lat: data.gps_latitude,
          lng: data.gps_longitude
        }
      };

      if (isEdit) {
        const { data: result, error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return result;
      } else {
        const { data: result, error } = await supabase
          .from('projects')
          .insert([projectData])
          .select()
          .single();
        
        if (error) throw error;
        return result;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: isEdit ? "Projet mis à jour" : "Projet créé",
        description: `Le projet "${data.title}" a été ${isEdit ? 'mis à jour' : 'créé'} avec succès.`,
      });
      navigate('/admin/projects');
    },
    onError: (error) => {
      console.error('Save error:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder le projet. Vérifiez les champs requis.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: ProjectFormData) => {
    saveProjectMutation.mutate(data);
  };

  const nextStep = () => {
    if (currentStepIndex < projectFormSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const goToStep = (index: number) => {
    setCurrentStepIndex(index);
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.ComponentType<any>;
    return IconComponent ? <IconComponent className="w-4 h-4" /> : <LucideIcons.Circle className="w-4 h-4" />;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="text-center">Chargement...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/projects')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux projets
            </Button>
            <h1 className="text-3xl font-bold">
              {isEdit ? 'Modifier le projet' : 'Nouveau projet'}
            </h1>
            <p className="text-muted-foreground">
              {isEdit ? 'Modifiez les informations du projet' : 'Créez un nouveau projet immobilier'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Steps Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Étapes</CardTitle>
                <CardDescription>
                  {currentStepIndex + 1} / {projectFormSteps.length}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {projectFormSteps.map((step, index) => (
                  <Button
                    key={step.id}
                    variant={index === currentStepIndex ? 'default' : 'ghost'}
                    className="w-full justify-start h-auto p-3"
                    onClick={() => goToStep(index)}
                  >
                    <div className="flex items-center gap-3">
                      {renderIcon(step.icon)}
                      <div className="text-left">
                        <div className="font-medium text-sm">{step.title}</div>
                        {index < currentStepIndex && (
                          <CheckCircle className="w-3 h-3 text-green-500 mt-1" />
                        )}
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Form Content */}
          <div className="lg:col-span-3">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Current Step Content */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      {renderIcon(currentStep.icon)}
                      <div>
                        <CardTitle>{currentStep.title}</CardTitle>
                        <CardDescription>
                          Étape {currentStepIndex + 1} sur {projectFormSteps.length}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ProjectFormSteps 
                      form={form} 
                      currentStep={currentStep.id} 
                    />
                  </CardContent>
                </Card>

                {/* Navigation & Actions */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        disabled={currentStepIndex === 0}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Précédent
                      </Button>

                      <div className="flex items-center gap-3">
                        {currentStepIndex === projectFormSteps.length - 1 ? (
                          <div className="flex gap-2">
                            <Button
                              type="submit"
                              variant="outline"
                              disabled={saveProjectMutation.isPending}
                              onClick={() => setSaveType('draft')}
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Sauvegarder brouillon
                            </Button>
                            <Button
                              type="submit"
                              disabled={saveProjectMutation.isPending}
                              onClick={() => setSaveType('publish')}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              {isEdit ? 'Mettre à jour' : 'Publier'}
                            </Button>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            onClick={nextStep}
                            disabled={currentStepIndex === projectFormSteps.length - 1}
                          >
                            Suivant
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </Layout>
  );
};