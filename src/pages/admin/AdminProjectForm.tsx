import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { ProjectFormSteps } from '@/components/admin/projects/ProjectFormSteps';
import { projectFormSteps } from '@/schemas/projectSchema';
import { supabase } from '@/integrations/supabase/client';
import { fetchProject } from '@/lib/supabase/projects';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Save, CheckCircle, ChevronLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

const AdminProjectForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const queryClient = useQueryClient();
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [saveType, setSaveType] = useState<'draft' | 'publish'>('draft');
  const [formKey, setFormKey] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState<any[]>([]);

  const currentStep = projectFormSteps[currentStepIndex];
  
  const form = useForm<any>({
    mode: 'onSubmit',
    defaultValues: {
      // Basics
      title: '',
      project_code: '',
      developer_id: '',
      property_category: 'residential',
      property_sub_type: ['apartment'],
      project_phase: 'off-plan',
      launch_date: '',
      completion_date_new: '',
      exclusive_commercialization: false,
      description: '',
      detailed_description: '',
      
      // Location
      full_address: '',
      city: '',
      region: '',
      neighborhood: '',
      neighborhood_description: '',
      cyprus_zone: 'limassol',
      gps_latitude: null,
      gps_longitude: null,
      proximity_sea_km: null,
      proximity_airport_km: null,
      proximity_city_center_km: null,
      proximity_highway_km: null,
      
      // Specifications
      land_area_m2: null,
      built_area_m2: null,
      total_units_new: null,
      units_available_new: null,
      bedrooms_range: '',
      bathrooms_range: '',
      floors_total: null,
      parking_spaces: null,
      storage_spaces: null,
      energy_rating: '',
      construction_year: null,
      building_certification: '',
      maintenance_fees_yearly: null,
      property_tax_yearly: null,
      hoa_fees_monthly: null,
      internet_speed_mbps: null,
      pet_policy: '',
      
      // Pricing
      price: 0,
      price_from_new: null,
      price_to: null,
      price_per_m2: null,
      vat_rate_new: 19,
      vat_included: false,
      golden_visa_eligible_new: false,
      roi_estimate_percent: null,
      rental_yield_percent: null,
      financing_available: false,
      
      // Media
      photos: [],
      photo_gallery_urls: [],
      video_tour_urls: [],
      floor_plan_urls: [],
      virtual_tour_url_new: '',
      project_presentation_url: '',
      youtube_tour_url: '',
      vimeo_tour_url: '',
      drone_footage_urls: [],
      model_3d_urls: [],
      
      // Features & Amenities
      features: [],
      amenities: [],
      surrounding_amenities: [],
      
      // Marketing
      project_narrative: '',
      meta_title_new: '',
      meta_description_new: '',
      meta_keywords: [],
      marketing_highlights: [],
      target_audience: [],
      featured_new: false,
      
      // Status
      status_project: 'disponible',
      statut_commercial: 'prelancement'
    }
  });

  // Fetch project data for editing with stable cache configuration
  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProject(id!),
    enabled: !!id && isEdit,
    staleTime: 0, // Toujours considérer les données comme obsolètes
    gcTime: 0, // Ne pas garder en cache
    refetchOnWindowFocus: false,
    refetchOnMount: true
  });

  // Load project data into form when editing with improved data handling
  useEffect(() => {
    if (project && isEdit) {
      console.log('📝 Loading project data into form:', project);
      console.log('📊 Project data values:', {
        total_units_new: project.total_units_new,
        units_available_new: project.units_available_new,
        energy_rating: project.energy_rating,
        roi_estimate_percent: project.roi_estimate_percent,
        rental_yield_percent: project.rental_yield_percent,
        categorized_photos: project.categorized_photos
      });
      
      // Reset form with project data
      const projectData = project;
      // Helper function to safely access location data
      const getLocationValue = (field: string) => {
        if (typeof projectData.location === 'object' && projectData.location !== null) {
          return (projectData.location as any)[field];
        }
        return null;
      };

      form.reset({
        // Basics
        title: projectData.title || '',
        project_code: projectData.project_code || '',
        developer_id: projectData.developer_id || '',
        property_category: projectData.property_category || 'residential',
        property_sub_type: Array.isArray(projectData.property_sub_type) ? projectData.property_sub_type : 
                          Array.isArray(projectData.property_types) ? projectData.property_types : ['apartment'],
        project_phase: projectData.project_phase || 'off-plan',
        launch_date: projectData.launch_date ? String(projectData.launch_date).substring(0, 7) : '', // Convert YYYY-MM-DD to YYYY-MM
        completion_date_new: projectData.completion_date_new ? String(projectData.completion_date_new).substring(0, 7) : '',
        exclusive_commercialization: projectData.exclusive_commercialization || false,
        description: projectData.description || '',
        detailed_description: projectData.detailed_description || '',
        
        // Location
        full_address: projectData.full_address || getLocationValue('address') || '',
        city: projectData.city || getLocationValue('city') || '',
        region: projectData.region || '',
        neighborhood: projectData.neighborhood || '',
        neighborhood_description: projectData.neighborhood_description || '',
        cyprus_zone: projectData.cyprus_zone || 'limassol',
        gps_latitude: projectData.gps_latitude || getLocationValue('coordinates')?.lat || null,
        gps_longitude: projectData.gps_longitude || getLocationValue('coordinates')?.lng || null,
        proximity_sea_km: projectData.proximity_sea_km || null,
        proximity_airport_km: projectData.proximity_airport_km || null,
        proximity_city_center_km: projectData.proximity_city_center_km || null,
        proximity_highway_km: projectData.proximity_highway_km || null,
        
        // Specifications with proper number conversion
        land_area_m2: projectData.land_area_m2 ? Number(projectData.land_area_m2) : null,
        built_area_m2: projectData.built_area_m2 ? Number(projectData.built_area_m2) : null,
        total_units_new: projectData.total_units_new ? Number(projectData.total_units_new) : null,
        units_available_new: projectData.units_available_new ? Number(projectData.units_available_new) : null,
        bedrooms_range: projectData.bedrooms_range || '',
        bathrooms_range: projectData.bathrooms_range || '',
        floors_total: projectData.floors_total ? Number(projectData.floors_total) : null,
        parking_spaces: projectData.parking_spaces ? Number(projectData.parking_spaces) : null,
        storage_spaces: projectData.storage_spaces ? Number(projectData.storage_spaces) : null,
        energy_rating: projectData.energy_rating || '',
        construction_year: projectData.construction_year ? Number(projectData.construction_year) : null,
        building_certification: projectData.building_certification || '',
        maintenance_fees_yearly: projectData.maintenance_fees_yearly ? Number(projectData.maintenance_fees_yearly) : null,
        property_tax_yearly: projectData.property_tax_yearly ? Number(projectData.property_tax_yearly) : null,
        hoa_fees_monthly: projectData.hoa_fees_monthly ? Number(projectData.hoa_fees_monthly) : null,
        internet_speed_mbps: projectData.internet_speed_mbps ? Number(projectData.internet_speed_mbps) : null,
        pet_policy: projectData.pet_policy || '',
        
        // Pricing with proper number conversion
        price: projectData.price ? Number(projectData.price) : 0,
        price_from_new: projectData.price_from_new ? Number(projectData.price_from_new) : null,
        price_to: projectData.price_to ? Number(projectData.price_to) : null,
        price_per_m2: projectData.price_per_m2 ? Number(projectData.price_per_m2) : null,
        vat_rate_new: projectData.vat_rate_new ? Number(projectData.vat_rate_new) : projectData.vat_rate ? Number(projectData.vat_rate) : 5,
        vat_included: projectData.vat_included || false,
        golden_visa_eligible_new: projectData.golden_visa_eligible_new || projectData.golden_visa_eligible || false,
        roi_estimate_percent: projectData.roi_estimate_percent ? Number(projectData.roi_estimate_percent) : null,
        rental_yield_percent: projectData.rental_yield_percent ? Number(projectData.rental_yield_percent) : null,
        financing_available: projectData.financing_available || false,
        
        // Media - Parse photos from database (prioritize categorized_photos over photos)
        photos: (() => {
          console.log('📸 Processing photos from database');
          
          // First try categorized_photos which is the new format
          if (projectData.categorized_photos && Array.isArray(projectData.categorized_photos)) {
            console.log('📸 Using categorized_photos:', projectData.categorized_photos);
            return projectData.categorized_photos.filter((photo: any) => photo && typeof photo === 'object' && photo.url);
          }
          
          // Fallback to old photos field
          if (projectData.photos && Array.isArray(projectData.photos)) {
            console.log('📸 Using legacy photos field:', projectData.photos);
            const parsed = projectData.photos
              .filter((photo: any) => photo !== null && photo !== undefined)
              .map((photo: any, index: number) => {
                if (typeof photo === 'string') {
                  try {
                    const parsedPhoto = JSON.parse(photo);
                    console.log(`📸 Parsed photo ${index}:`, parsedPhoto);
                    return parsedPhoto;
                  } catch (e) {
                    console.error(`📸 Failed to parse photo ${index}:`, photo, e);
                    return { url: photo, category: 'hero', isPrimary: false, caption: '' };
                  }
                }
                
                if (typeof photo === 'object' && photo.url) {
                  console.log(`📸 Photo ${index} already object:`, photo);
                  return photo;
                }
                
                console.warn(`📸 Invalid photo format at index ${index}:`, photo);
                return null;
              })
              .filter((photo: any) => photo !== null);
            
            console.log('📸 Final parsed photos:', parsed);
            return parsed;
          }
          
          console.log('📸 No photos found in project data');
          return [];
        })(),
        photo_gallery_urls: Array.isArray(projectData.photo_gallery_urls) ? projectData.photo_gallery_urls : [],
        video_tour_urls: Array.isArray(projectData.video_tour_urls) ? projectData.video_tour_urls : [],
        floor_plan_urls: Array.isArray(projectData.floor_plan_urls) ? projectData.floor_plan_urls : [],
        virtual_tour_url_new: projectData.virtual_tour_url_new || projectData.virtual_tour_url || '',
        project_presentation_url: projectData.project_presentation_url || '',
        youtube_tour_url: projectData.youtube_tour_url || '',
        vimeo_tour_url: projectData.vimeo_tour_url || '',
        drone_footage_urls: Array.isArray(projectData.drone_footage_urls) ? projectData.drone_footage_urls : [],
        model_3d_urls: Array.isArray(projectData.model_3d_urls) ? projectData.model_3d_urls : [],
        
        // Features & Amenities
        features: Array.isArray(projectData.features) ? projectData.features : [],
        amenities: Array.isArray(projectData.amenities) ? projectData.amenities : [],
        surrounding_amenities: Array.isArray(projectData.surrounding_amenities) ? projectData.surrounding_amenities : [],
        
        // Marketing
        project_narrative: projectData.project_narrative || '',
        meta_title_new: projectData.meta_title_new || projectData.meta_title || '',
        meta_description_new: projectData.meta_description_new || projectData.meta_description || '',
        meta_keywords: Array.isArray(projectData.meta_keywords) ? projectData.meta_keywords : [],
        marketing_highlights: Array.isArray(projectData.marketing_highlights) ? projectData.marketing_highlights : [],
        target_audience: Array.isArray(projectData.target_audience) ? projectData.target_audience : [],
        featured_new: projectData.featured_new || projectData.featured_property || false,
        
        // Status
        status_project: projectData.status_project || 'disponible',
        statut_commercial: projectData.statut_commercial || 'prelancement'
      });
      
      // Ne PAS forcer le re-render ici car cela efface les données
      console.log('📝 Form data loaded successfully');
    }
  }, [project, isEdit, form]);

  // Enhanced submit handler with comprehensive data processing
  const onSubmit = async (data: any) => {
    try {
      console.log('💾 Submitting project data:', data);
      console.log('💾 Specific fields check:');
      console.log('💾 - title:', data.title);
      console.log('💾 - energy_rating:', data.energy_rating);
      console.log('💾 - pet_policy:', data.pet_policy);
      console.log('💾 - total_units_new:', data.total_units_new);
      console.log('💾 - land_area_m2:', data.land_area_m2);
      
      // Prepare data for database with proper types and fixes
      const processedData = {
        ...data,
        // Fix date formats - convert YYYY-MM to YYYY-MM-01 for database
        launch_date: data.launch_date ? `${data.launch_date}-01` : null,
        completion_date_new: data.completion_date_new ? `${data.completion_date_new}-01` : null,
        
        // Ensure numeric fields are properly converted
        total_units_new: data.total_units_new ? Number(data.total_units_new) : null,
        units_available_new: data.units_available_new ? Number(data.units_available_new) : null,
        land_area_m2: data.land_area_m2 ? Number(data.land_area_m2) : null,
        built_area_m2: data.built_area_m2 ? Number(data.built_area_m2) : null,
        floors_total: data.floors_total ? Number(data.floors_total) : null,
        parking_spaces: data.parking_spaces ? Number(data.parking_spaces) : null,
        storage_spaces: data.storage_spaces ? Number(data.storage_spaces) : null,
        construction_year: data.construction_year ? Number(data.construction_year) : null,
        maintenance_fees_yearly: data.maintenance_fees_yearly ? Number(data.maintenance_fees_yearly) : null,
        property_tax_yearly: data.property_tax_yearly ? Number(data.property_tax_yearly) : null,
        hoa_fees_monthly: data.hoa_fees_monthly ? Number(data.hoa_fees_monthly) : null,
        internet_speed_mbps: data.internet_speed_mbps ? Number(data.internet_speed_mbps) : null,
        price: data.price ? Number(data.price) : 0,
        price_from_new: data.price_from_new ? Number(data.price_from_new) : null,
        price_to: data.price_to ? Number(data.price_to) : null,
        price_per_m2: data.price_per_m2 ? Number(data.price_per_m2) : null,
        vat_rate_new: data.vat_rate_new ? Number(data.vat_rate_new) : 5,
        roi_estimate_percent: data.roi_estimate_percent ? Number(data.roi_estimate_percent) : null,
        rental_yield_percent: data.rental_yield_percent ? Number(data.rental_yield_percent) : null,
        gps_latitude: data.gps_latitude ? Number(data.gps_latitude) : null,
        gps_longitude: data.gps_longitude ? Number(data.gps_longitude) : null,
        proximity_sea_km: data.proximity_sea_km ? Number(data.proximity_sea_km) : null,
        proximity_airport_km: data.proximity_airport_km ? Number(data.proximity_airport_km) : null,
        proximity_city_center_km: data.proximity_city_center_km ? Number(data.proximity_city_center_km) : null,
        proximity_highway_km: data.proximity_highway_km ? Number(data.proximity_highway_km) : null,
        
        // Ensure boolean fields are properly set
        exclusive_commercialization: Boolean(data.exclusive_commercialization),
        vat_included: Boolean(data.vat_included),
        golden_visa_eligible_new: Boolean(data.golden_visa_eligible_new),
        financing_available: Boolean(data.financing_available),
        featured_new: Boolean(data.featured_new),
        
        // Store photos in the new categorized_photos field
        categorized_photos: data.photos || [],
        
        // Ensure text fields are not null/undefined
        energy_rating: data.energy_rating || null,
        pet_policy: data.pet_policy || null,
        building_certification: data.building_certification || null,
        bedrooms_range: data.bedrooms_range || null,
        bathrooms_range: data.bathrooms_range || null,
        project_narrative: data.project_narrative || null,
        meta_title_new: data.meta_title_new || null,
        meta_description_new: data.meta_description_new || null,
        virtual_tour_url_new: data.virtual_tour_url_new || null,
        project_presentation_url: data.project_presentation_url || null,
        youtube_tour_url: data.youtube_tour_url || null,
        vimeo_tour_url: data.vimeo_tour_url || null,
        
        // Ensure arrays are properly handled
        features: Array.isArray(data.features) ? data.features : [],
        amenities: Array.isArray(data.amenities) ? data.amenities : [],
        surrounding_amenities: Array.isArray(data.surrounding_amenities) ? data.surrounding_amenities : [],
        meta_keywords: Array.isArray(data.meta_keywords) ? data.meta_keywords : [],
        marketing_highlights: Array.isArray(data.marketing_highlights) ? data.marketing_highlights : [],
        target_audience: Array.isArray(data.target_audience) ? data.target_audience : [],
        property_sub_type: Array.isArray(data.property_sub_type) ? data.property_sub_type : ['apartment'],
        photo_gallery_urls: Array.isArray(data.photo_gallery_urls) ? data.photo_gallery_urls : [],
        video_tour_urls: Array.isArray(data.video_tour_urls) ? data.video_tour_urls : [],
        floor_plan_urls: Array.isArray(data.floor_plan_urls) ? data.floor_plan_urls : [],
        drone_footage_urls: Array.isArray(data.drone_footage_urls) ? data.drone_footage_urls : [],
        model_3d_urls: Array.isArray(data.model_3d_urls) ? data.model_3d_urls : []
      };
      
      console.log('💾 Processed data with fixed dates:', processedData);
      
      if (isEdit) {
        const { data: updateResult, error } = await supabase
          .from('projects')
          .update(processedData)
          .eq('id', id)
          .select();
        
        if (error) {
          console.error('❌ Update error:', error);
          throw error;
        }
        
        console.log('✅ Update success:', updateResult);
        
        toast.success('Projet mis à jour avec succès');
        
        // Invalider le cache pour forcer le rechargement des données
        await queryClient.invalidateQueries({ queryKey: ['project', id] });
        await queryClient.refetchQueries({ queryKey: ['project', id] });
        
        // Pas de setFormKey ici car cela efface les données affichées
        
      } else {
        const { data: insertData, error } = await supabase
          .from('projects')
          .insert([processedData])
          .select();
          
        if (error) {
          console.error('❌ Insert error:', error);
          throw error;
        }
        console.log('✅ Insert success:', insertData);
        toast.success('Projet créé avec succès');
        
        navigate('/admin/projects');
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      if (error.message) {
        toast.error(`Erreur: ${error.message}`);
      } else {
        toast.error('Erreur lors de la sauvegarde');
      }
    }
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

  const validateProjectData = (data: any) => {
    const errors: any[] = [];
    if (!data.title) errors.push({ field: 'title', message: 'Le titre est requis' });
    if (!data.description) errors.push({ field: 'description', message: 'La description est requise' });
    return errors;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fixe */}
      <div className="h-32 bg-white border-b-2 border-slate-200 sticky top-0 z-10">
        <div className="h-full px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/admin/projects')}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Retour projets
            </Button>
            <span className="text-slate-400">|</span>
            <h1 className="text-2xl font-bold text-slate-900">
              {isEdit ? 'Modifier le projet' : 'Créer un nouveau projet'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <a href="/admin" className="text-base text-slate-600 hover:text-slate-900 transition-colors">
              Retour au dashboard
            </a>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar fixe */}
        <div className="w-80 bg-white border-r-2 border-slate-200 sticky top-[128px] h-[calc(100vh-128px)] overflow-y-auto">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Étapes du projet</h2>
            <nav className="space-y-2">
              {projectFormSteps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStepIndex(index)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    currentStepIndex === index
                      ? 'bg-primary text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      currentStepIndex === index
                        ? 'bg-white text-primary'
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="font-medium">{step.title}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex-1 p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div key={formKey}>
                <ProjectFormSteps 
                  form={form} 
                  currentStep={currentStep.id}
                  projectId={id}
                />
              </div>

              {/* Navigation controls */}
              <div className="flex justify-between items-center pt-8 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStepIndex === 0}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Précédent
                </Button>

                <div className="flex items-center gap-4">
                  {currentStepIndex === projectFormSteps.length - 1 ? (
                    <Button type="submit" className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      {isEdit ? 'Mettre à jour' : 'Créer le projet'}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center gap-2"
                    >
                      Suivant
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>

      {/* Dialog de confirmation */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la publication</DialogTitle>
            <DialogDescription>
              Vous êtes sur le point de publier ce projet. Il sera visible par tous les utilisateurs.
            </DialogDescription>
          </DialogHeader>
          
          {validationErrors.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-destructive">Erreurs à corriger :</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error.message}</li>
                ))}
              </ul>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Annuler
            </Button>
            <Button 
              onClick={() => {
                setSaveType('publish');
                form.handleSubmit(onSubmit)();
                setShowConfirmDialog(false);
              }}
              disabled={validationErrors.length > 0}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Publier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProjectForm;