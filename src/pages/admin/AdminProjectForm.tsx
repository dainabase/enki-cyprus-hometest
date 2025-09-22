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
      launch_month: '',
      completion_month: '',
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
      total_units: null,
      units_available: null,
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
      price_from: null,
      price_to: null,
      price_per_m2: null,
      vat_rate: 5,
      vat_included: false,
      golden_visa_eligible: false,
      roi_estimate_percent: null,
      rental_yield_percent: null,
      financing_available: false,
      
      // Media
      photos: [],
      photo_gallery_urls: [],
      video_tour_urls: [],
      floor_plan_urls: [],
      virtual_tour_url: '',
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
      meta_title: '',
      meta_description: '',
      meta_keywords: [],
      marketing_highlights: [],
      target_audience: [],
      featured_project: false,
      
      // Status
      status_project: 'disponible',
      statut_commercial: 'pre_commercialisation',
      
      // Buildings
      buildings: []
    }
  });

  // Fetch project data for editing with stable cache configuration
  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProject(id!),
    enabled: !!id && isEdit,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: true
  });

  // Debug logs
  console.log('🔍 DEBUG - État du formulaire:', {
    id: id,
    isEdit: isEdit,
    projectLoaded: !!project,
    projectData: project,
    formValues: form.getValues()
  });

  // Load project data into form when editing with CORRECTED MAPPINGS
  useEffect(() => {
    const loadProjectData = async () => {
      if (!project || !isEdit) return;
      
      console.log('🔄 DÉBUT DU CHARGEMENT DES DONNÉES');
      console.log('📦 Données projet reçues:', project);
      
      try {
        // Charger les bâtiments
        const { data: buildingsData } = await supabase
          .from('buildings')
          .select('*')
          .eq('project_id', id)
          .order('display_order', { ascending: true });
        
        console.log('🏢 Bâtiments chargés:', buildingsData);
        
        // Cast en any pour éviter les erreurs TypeScript
        const projectData = project as any;
        
        // Préparer TOUTES les données du formulaire
        const formData = {
          // BASICS - Utilise les VRAIS noms de champs de la DB
          title: projectData.title || '',
          project_code: projectData.project_code || '',
          developer_id: projectData.developer_id || '',
          property_category: projectData.property_category || 'residential',
          property_sub_type: projectData.property_sub_type || ['apartment'],
          project_phase: projectData.project_phase || 'off-plan',
          statut_commercial: projectData.statut_commercial || 'pre_commercialisation',
          launch_month: projectData.launch_month || '',
          completion_month: projectData.completion_month || '',
          exclusive_commercialization: projectData.exclusive_commercialization || false,
          description: projectData.description || '',
          detailed_description: projectData.detailed_description || '',
          
          // LOCATION
          full_address: projectData.full_address || '',
          city: projectData.city || '',
          region: projectData.region || '',
          neighborhood: projectData.neighborhood || '',
          neighborhood_description: projectData.neighborhood_description || '',
          cyprus_zone: projectData.cyprus_zone || 'limassol',
          gps_latitude: projectData.gps_latitude || null,
          gps_longitude: projectData.gps_longitude || null,
          proximity_sea_km: projectData.proximity_sea_km || null,
          proximity_airport_km: projectData.proximity_airport_km || null,
          proximity_city_center_km: projectData.proximity_city_center_km || null,
          proximity_highway_km: projectData.proximity_highway_km || null,
          
          // SPECIFICATIONS
          land_area_m2: projectData.land_area_m2 ? Number(projectData.land_area_m2) : null,
          built_area_m2: projectData.built_area_m2 ? Number(projectData.built_area_m2) : null,
          total_units: projectData.total_units ? Number(projectData.total_units) : null,
          units_available: projectData.units_available ? Number(projectData.units_available) : null,
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
          
          // PRICING
          price: projectData.price ? Number(projectData.price) : 0,
          price_from: projectData.price_from ? Number(projectData.price_from) : null,
          price_to: projectData.price_to ? Number(projectData.price_to) : null,
          price_per_m2: projectData.price_per_m2 ? Number(projectData.price_per_m2) : null,
          vat_rate: projectData.vat_rate ? Number(projectData.vat_rate) : 5,
          vat_included: projectData.vat_included || false,
          golden_visa_eligible: projectData.golden_visa_eligible || false,
          roi_estimate_percent: projectData.roi_estimate_percent ? Number(projectData.roi_estimate_percent) : null,
          rental_yield_percent: projectData.rental_yield_percent ? Number(projectData.rental_yield_percent) : null,
          financing_available: projectData.financing_available || false,
          
          // BUILDINGS
          buildings: buildingsData || [],
          
          // MEDIA
          photos: projectData.categorized_photos || projectData.photos || [],
          photo_gallery_urls: projectData.photo_gallery_urls || [],
          video_tour_urls: projectData.video_tour_urls || [],
          virtual_tour_url: projectData.virtual_tour_url || '',
          master_plan_pdf: projectData.master_plan_url || '',
          brochure_pdf: projectData.brochure_url || '',
          project_presentation_url: projectData.project_presentation_url || '',
          youtube_tour_url: projectData.youtube_tour_url || '',
          vimeo_tour_url: projectData.vimeo_tour_url || '',
          drone_footage_urls: projectData.drone_footage_urls || [],
          model_3d_urls: projectData.model_3d_urls || [],
          floor_plan_urls: projectData.floor_plan_urls || [],
          
          // AMENITIES
          amenities: projectData.amenities || [],
          surrounding_amenities: projectData.surrounding_amenities || [],
          
          // MARKETING
          project_narrative: projectData.project_narrative || '',
          meta_title: projectData.meta_title || '',
          meta_description: projectData.meta_description || '',
          meta_keywords: projectData.meta_keywords || [],
          marketing_highlights: projectData.marketing_highlights || [],
          target_audience: projectData.target_audience || [],
          url_slug: projectData.url_slug || '',
          featured_project: projectData.featured_project || false,
          construction_phase: projectData.construction_phase || 'planned',
          
          // STATUS
          status: projectData.status || 'active'
        };
        
        console.log('📝 Données préparées pour le formulaire:', formData);
        
        // Reset le formulaire avec les données
        form.reset(formData);
        
        // Forcer la mise à jour
        form.trigger();
        
        console.log('✅ Formulaire mis à jour avec succès');
        console.log('🔍 Valeurs actuelles du formulaire:', form.getValues());
        
        // DEBUG EXTRÊME - Forçage des valeurs après 1 seconde
        setTimeout(() => {
          console.log('🔥 FORÇAGE DES VALEURS APRÈS 1 SECONDE');
          form.setValue('developer_id', projectData.developer_id);
          form.setValue('statut_commercial', projectData.statut_commercial);
          form.setValue('launch_month', projectData.launch_month);
          form.setValue('completion_month', projectData.completion_month);
          form.setValue('total_units', projectData.total_units);
          form.setValue('buildings', buildingsData || []);
          console.log('🔥 Valeurs forcées:', form.getValues());
        }, 1000);
        
      } catch (error) {
        console.error('❌ Erreur lors du chargement:', error);
        toast.error('Erreur lors du chargement des données');
      }
    };
    
    loadProjectData();
  }, [project, isEdit, form, id]);

  // Enhanced submit handler with CORRECTED MAPPINGS
  const onSubmit = async (data: any) => {
    try {
      console.log('📤 Données du formulaire à sauvegarder:', data);
      
      // Mapper directement les champs SANS transformation complexe
      const dbData = {
        ...data, // Prendre TOUTES les données du formulaire
        // Convertir les nombres si nécessaire
        total_units: data.total_units ? Number(data.total_units) : null,
        units_available: data.units_available ? Number(data.units_available) : null,
        price_from: data.price_from ? Number(data.price_from) : null,
        vat_rate: data.vat_rate ? Number(data.vat_rate) : 5,
      };
      
      console.log('💾 Données préparées pour la DB:', dbData);
      
      if (isEdit) {
        const { data: updateResult, error } = await supabase
          .from('projects')
          .update(dbData)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        
        console.log('✅ Mise à jour réussie:', updateResult);
        toast.success('Projet mis à jour avec succès');
        
        // Invalider et recharger
        await queryClient.invalidateQueries({ queryKey: ['project', id] });
        
      } else {
        // Création...
        const { data: insertData, error } = await supabase
          .from('projects')
          .insert([dbData])
          .select();
          
        if (error) throw error;
        console.log('✅ Insert success:', insertData);
        toast.success('Projet créé avec succès');
        
        navigate('/admin/projects');
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const refreshFormData = async () => {
    if (isEdit && id) {
      try {
        console.log('🔄 Rechargement des données du projet depuis la base');
        const freshProject = await fetchProject(id);
        if (freshProject) {
          console.log('📊 Données fraîches récupérées:', freshProject);
          
          // Récupérer les valeurs actuelles du formulaire
          const currentFormValues = form.getValues();
          
          // Remettre à jour le formulaire avec les données fraîches de la base
          form.reset({
            ...currentFormValues,
            total_units: freshProject.total_units ? Number(freshProject.total_units) : null,
            units_available: freshProject.units_available ? Number(freshProject.units_available) : null,
            roi_estimate_percent: freshProject.roi_estimate_percent ? Number(freshProject.roi_estimate_percent) : null,
            rental_yield_percent: freshProject.rental_yield_percent ? Number(freshProject.rental_yield_percent) : null,
            photos: (() => {
              if (freshProject.categorized_photos && Array.isArray(freshProject.categorized_photos)) {
                return freshProject.categorized_photos.filter((photo: any) => photo && typeof photo === 'object' && photo.url);
              }
              return [];
            })()
          });
          
          console.log('✅ Formulaire mis à jour avec les données fraîches');
        }
      } catch (error) {
        console.error('❌ Erreur lors du rechargement des données:', error);
      }
    }
  };

  const nextStep = async () => {
    if (currentStepIndex < projectFormSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      await refreshFormData();
    }
  };

  const prevStep = async () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      await refreshFormData();
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
                  onClick={async () => {
                    setCurrentStepIndex(index);
                    await refreshFormData();
                  }}
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
                      onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        await nextStep();
                      }}
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