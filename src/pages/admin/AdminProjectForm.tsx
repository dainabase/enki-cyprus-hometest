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
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Save, Eye, ChevronLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

const AdminProjectForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const isEditing = isEdit;
  const queryClient = useQueryClient();
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [saveType, setSaveType] = useState<'draft' | 'publish'>('draft');
  const [formKey, setFormKey] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [originalData, setOriginalData] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState<any[]>([]);

  const currentStep = projectFormSteps[currentStepIndex];
  
  const form = useForm({
    mode: 'onSubmit',
    defaultValues: {
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
      full_address: '',
      city: '',
      region: '',
      neighborhood: '',
      cyprus_zone: 'limassol',
      photos: [],
      surrounding_amenities: [],
      features: [],
      amenities: [],
      status_project: 'disponible',
      statut_commercial: 'prelancement',
      vat_rate_new: 5,
      price: 0,
      meta_title_new: '',
      meta_description_new: '',
      project_narrative: ''
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


  // Populate form when data is loaded - AVEC PERSISTANCE DES DRAFTS!
  React.useEffect(() => {
    if (projectData && isEdit) {
      console.log('🔄 Loading project data for edit:', projectData.title);
      console.log('📅 Original launch_date:', projectData.launch_date);
      console.log('📅 Original completion_date_new:', projectData.completion_date_new);
      
      setOriginalData(projectData);
      
      // Convert dates from YYYY-MM-DD to YYYY-MM for month inputs
      const convertedLaunchDate = projectData.launch_date ? projectData.launch_date.substring(0, 7) : '';
      const convertedCompletionDate = projectData.completion_date_new ? projectData.completion_date_new.substring(0, 7) : '';
      
      console.log('📅 Converted launch_date:', convertedLaunchDate);
      console.log('📅 Converted completion_date_new:', convertedCompletionDate);
      
      // SOLUTION PERSISTANCE: Charger d'abord les données du projet, puis override avec les drafts
      const formData = {
        title: projectData.title || '',
        project_code: projectData.project_code || '',
        developer_id: projectData.developer_id || '',
        property_category: projectData.property_category || 'residential',
        property_sub_type: Array.isArray(projectData.property_sub_type) && projectData.property_sub_type.length > 0 
          ? projectData.property_sub_type 
          : ['apartment'],
        project_phase: projectData.project_phase || 'off-plan',
        launch_date: convertedLaunchDate,
        completion_date_new: convertedCompletionDate,
        exclusive_commercialization: Boolean(projectData.exclusive_commercialization),
        description: projectData.description || '',
        detailed_description: projectData.detailed_description || '',
        full_address: projectData.full_address || '',
        city: projectData.city || '',
        region: projectData.region || '',
        neighborhood: projectData.neighborhood || '',
        cyprus_zone: projectData.cyprus_zone || 'limassol',
        // Photos - priorité à categorized_photos, sinon photos classiques
        photos: (() => {
          const photos = Array.isArray(projectData.categorized_photos) && projectData.categorized_photos.length > 0
            ? projectData.categorized_photos
            : Array.isArray(projectData.photos) ? projectData.photos : [];
          console.log('🔍 PHOTOS LOADED FROM SUPABASE:', { 
            categorized_photos: projectData.categorized_photos,
            photos: projectData.photos,
            result: photos,
            count: photos.length
          });
          return photos;
        })(),
        amenities: Array.isArray(projectData.amenities) ? projectData.amenities : [],
        vat_rate_new: Number(projectData.vat_rate_new) || 5,
        vat_included: Boolean(projectData.vat_included),
        golden_visa_eligible_new: Boolean(projectData.golden_visa_eligible_new || projectData.golden_visa_eligible),
        financing_available: Boolean(projectData.financing_available),
        featured_new: Boolean(projectData.featured_new || projectData.featured_property),
        status_project: projectData.status_project || 'disponible',
        statut_commercial: projectData.statut_commercial || 'prelancement',
        price: Number(projectData.price) || 0,
        meta_title_new: projectData.meta_title_new || projectData.meta_title || '',
        meta_description_new: projectData.meta_description_new || projectData.meta_description || '',
        project_narrative: projectData.project_narrative || '',
        gps_latitude: projectData.gps_latitude || null,
        gps_longitude: projectData.gps_longitude || null,
        proximity_sea_km: projectData.proximity_sea_km || null,
        proximity_airport_km: projectData.proximity_airport_km || null,
        proximity_city_center_km: projectData.proximity_city_center_km || null,
        proximity_highway_km: projectData.proximity_highway_km || null,
        surrounding_amenities: Array.isArray(projectData.surrounding_amenities) ? projectData.surrounding_amenities : [],
        // Specifications fields
        land_area_m2: projectData.land_area_m2 || null,
        built_area_m2: projectData.built_area_m2 || null,
        total_units_new: projectData.total_units_new || null,
        units_available_new: projectData.units_available_new || null,
        bedrooms_range: projectData.bedrooms_range || '',
        bathrooms_range: projectData.bathrooms_range || '',
        energy_rating: projectData.energy_rating || '',
        construction_year: projectData.construction_year || null,
        building_certification: projectData.building_certification || '',
        maintenance_fees_yearly: projectData.maintenance_fees_yearly || null,
        property_tax_yearly: projectData.property_tax_yearly || null,
        hoa_fees_monthly: projectData.hoa_fees_monthly || null,
        internet_speed_mbps: projectData.internet_speed_mbps || null,
        pet_policy: projectData.pet_policy || '',
        floors_total: projectData.floors_total || null,
        parking_spaces: projectData.parking_spaces || null,
        storage_spaces: projectData.storage_spaces || null,
        // Pricing fields
        price_from_new: projectData.price_from_new || null,
        price_to: projectData.price_to || null,
        price_per_m2: projectData.price_per_m2 || null,
        roi_estimate_percent: projectData.roi_estimate_percent || '',
        rental_yield_percent: projectData.rental_yield_percent || '',
        // Media fields
        floor_plan_urls: Array.isArray(projectData.floor_plan_urls) ? projectData.floor_plan_urls : [],
        virtual_tour_url_new: projectData.virtual_tour_url_new || null,
        video_tour_urls: Array.isArray(projectData.video_tour_urls) ? projectData.video_tour_urls : [],
        photo_gallery_urls: Array.isArray(projectData.photo_gallery_urls) ? projectData.photo_gallery_urls : [],
        drone_footage_urls: Array.isArray(projectData.drone_footage_urls) ? projectData.drone_footage_urls : [],
        model_3d_urls: Array.isArray(projectData.model_3d_urls) ? projectData.model_3d_urls : [],
        floor_plan_3d_urls: Array.isArray(projectData.floor_plan_3d_urls) ? projectData.floor_plan_3d_urls : []
      };
      
      // Les données Supabase sont prioritaires, on ne charge PAS les drafts pour les statuts
      const loadDraftsAndApply = async () => {
        console.log('📊 DONNÉES SUPABASE CHARGÉES:', { 
          status_project: formData.status_project,
          statut_commercial: formData.statut_commercial,
          photos: formData.photos,
          photos_count: formData.photos?.length || 0
        });
        // On garde les données Supabase comme source de vérité
        
        console.log('📝 Final form data with drafts applied:', { 
          status_project: formData.status_project,
          statut_commercial: formData.statut_commercial,
          photos: formData.photos,
          photos_count: formData.photos?.length || 0
        });
        
        form.reset(formData);
        setFormKey(prev => prev + 1);
      };
      
      loadDraftsAndApply();
    }
  }, [projectData, isEdit, form, id]);

      // SAUVEGARDE AUTOMATIQUE SIMPLE ET EFFICACE
  const watchedFormData = form.watch();
  
  useEffect(() => {
    const saveDraft = async () => {
      if (!id || !watchedFormData) return;
      
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return;
      
      // Supprimer les anciennes drafts et créer une nouvelle
      await supabase
        .from('project_drafts')
        .delete()
        .eq('user_id', userId)
        .eq('project_id', id);
      
      const { error } = await supabase
        .from('project_drafts')
        .insert({
          user_id: userId,
          project_id: id,
          form_data: watchedFormData,
          current_step: 'marketing',
          step_index: 6,
          auto_save_enabled: true
        });
      
      if (!error) {
        // Console log simplifié
      }
    };

    const timer = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timer);
  }, [watchedFormData, id]);

  // Validation and form submission
  const validateCurrentStep = () => {
    const currentFormData = form.getValues();
    return validateRequiredFields(currentFormData);
  };

  // Function to validate required fields and dates
  const validateRequiredFields = (formData: any) => {
    const errors: any[] = [];
    
    // Validate required fields
    if (!formData.title || formData.title.length < 3) {
      errors.push({ field: 'title', label: 'Titre', message: 'Minimum 3 caractères requis' });
    }
    
    if (!formData.developer_id) {
      errors.push({ field: 'developer_id', label: 'Développeur', message: 'Sélection requise' });
    }
    
    if (!formData.city) {
      errors.push({ field: 'city', label: 'Ville', message: 'Ville requise' });
    }
    
    if (!formData.description || formData.description.length < 10) {
      errors.push({ field: 'description', label: 'Description', message: 'Description trop courte (min. 10 caractères)' });
    }
    
    if (!formData.price || formData.price <= 0) {
      errors.push({ field: 'price', label: 'Prix', message: 'Prix requis et supérieur à 0' });
    }
    
    if (!formData.property_sub_type || formData.property_sub_type.length === 0) {
      errors.push({ field: 'property_sub_type', label: 'Type de propriété', message: 'Au moins un type requis' });
    }
    
    // Validate dates format and logic
    if (formData.launch_date && formData.launch_date.length > 0) {
      if (!/^\d{4}-\d{2}(-\d{2})?$/.test(formData.launch_date)) {
        errors.push({ 
          field: 'launch_date', 
          label: 'Date de lancement', 
          message: `Format invalide "${formData.launch_date}" - Format requis: YYYY-MM ou YYYY-MM-DD (ex: 2025-10 ou 2025-12-31)` 
        });
      }
    }
    
    if (formData.completion_date_new && formData.completion_date_new.length > 0) {
      if (!/^\d{4}-\d{2}(-\d{2})?$/.test(formData.completion_date_new)) {
        errors.push({ 
          field: 'completion_date_new', 
          label: 'Date de completion', 
          message: `Format invalide "${formData.completion_date_new}" - Format requis: YYYY-MM ou YYYY-MM-DD (ex: 2025-10 ou 2025-12-31)` 
        });
      }
    }
    
    // Validate date logic: launch date must be before completion date
    if (formData.launch_date && formData.completion_date_new && 
        formData.launch_date.length > 0 && formData.completion_date_new.length > 0) {
      const launchDate = new Date(formData.launch_date + (formData.launch_date.length === 7 ? '-01' : ''));
      const completionDate = new Date(formData.completion_date_new + (formData.completion_date_new.length === 7 ? '-01' : ''));
      
      if (launchDate >= completionDate) {
        errors.push({
          field: 'completion_date_new',
          label: 'Date de livraison',
          message: 'La date de livraison doit être postérieure à la date de lancement'
        });
      }
    }
    
    // Golden Visa validation
    if (formData.golden_visa_eligible_new && formData.price < 300000) {
      errors.push({ field: 'golden_visa_eligible_new', label: 'Golden Visa', message: 'Prix minimum de 300,000€ requis' });
    }
    
    return errors;
  };

  // Navigation functions
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

  // Save project mutation
  const saveProjectMutation = useMutation({
    mutationFn: async (data: any) => {
      if (isEdit) {
        const { error } = await supabase
          .from('projects')
          .update(data)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('projects')
          .insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      // Invalider le cache pour forcer le rechargement des données
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      
      const actionMessage = saveType === 'publish' 
        ? 'Projet publié avec succès !' 
        : isEdit ? 'Projet mis à jour avec succès !' : 'Projet créé avec succès !';
      
      toast.success(actionMessage, {
        description: 'Toutes les modifications ont été sauvegardées.',
        duration: 5000
      });
      
      setTimeout(() => {
        navigate('/admin/projects');
      }, 2000);
    },
    onError: (error: any) => {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur de publication', {
        description: 'Impossible de sauvegarder le projet. Vérifiez tous les champs requis.',
        duration: 8000
      });
    }
  });

  const handleSubmitWithConfirmation = (data: any) => {
    console.log('=== VALIDATION START ===');
    console.log('Form data received:', data);
    
    // Always validate required fields first
    const errors = validateRequiredFields(data);
    console.log('Validation errors found:', errors);
    
    if (errors.length > 0) {
      console.log('❌ Validation failed - showing dialog with errors');
      setValidationErrors(errors);
      toast.error('Champs requis manquants', {
        description: `${errors.length} erreur(s) détectée(s). Vérifiez le dialogue pour plus de détails.`,
        duration: 8000
      });
      setShowConfirmDialog(true);
      return;
    }
    
    console.log('✅ Validation passed');
    setValidationErrors([]);
    setShowConfirmDialog(true);
  };

  const onSubmit = (data: any) => {
    console.log('🔥 === DÉBUT SUBMISSION DEBUG ===');
    console.log('📋 Form data BRUTE reçu:', data);
    console.log('🚨 CRITICAL STATUS CHECK:', { 
      status_project: data.status_project,
      statut_commercial: data.statut_commercial,
      types: {
        status_project: typeof data.status_project,
        statut_commercial: typeof data.statut_commercial
      }
    });
    
    // Clean and validate data before submission
    const cleanedData = {
      ...data,
      // Préserver les statuts exactement comme saisis (SANS fallback)
      status_project: data.status_project,
      statut_commercial: data.statut_commercial,
      // Ensure proper data types
      price: Number(data.price) || 0,
      vat_rate_new: Number(data.vat_rate_new) || 5,
      vat_included: Boolean(data.vat_included),
      golden_visa_eligible_new: Boolean(data.golden_visa_eligible_new),
      financing_available: Boolean(data.financing_available),
      featured_new: Boolean(data.featured_new),
      exclusive_commercialization: Boolean(data.exclusive_commercialization),
      // Clean numeric fields - convert undefined objects to null
      gps_latitude: data.gps_latitude && typeof data.gps_latitude === 'number' ? data.gps_latitude : null,
      gps_longitude: data.gps_longitude && typeof data.gps_longitude === 'number' ? data.gps_longitude : null,
      proximity_sea_km: data.proximity_sea_km && typeof data.proximity_sea_km === 'number' ? data.proximity_sea_km : null,
      proximity_airport_km: data.proximity_airport_km && typeof data.proximity_airport_km === 'number' ? data.proximity_airport_km : null,
      proximity_city_center_km: data.proximity_city_center_km && typeof data.proximity_city_center_km === 'number' ? data.proximity_city_center_km : null,
      proximity_highway_km: data.proximity_highway_km && typeof data.proximity_highway_km === 'number' ? data.proximity_highway_km : null,
      // CRITICAL: Validate energy_rating
      energy_rating: (() => {
        console.log('🔍 DEBUGGING energy_rating:', { 
          value: data.energy_rating, 
          type: typeof data.energy_rating 
        });
        const validRatings = ['A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];
        if (data.energy_rating && validRatings.includes(data.energy_rating)) {
          return data.energy_rating;
        }
        console.log('❌ Invalid energy_rating, setting to null:', data.energy_rating);
        return null;
      })(),
      // Ensure arrays are properly formatted - Gérer les photos avec le nouveau format categorized_photos
      photos: Array.isArray(data.photos) ? data.photos : [],
      categorized_photos: Array.isArray(data.photos) ? data.photos : [], // Sauvegarder dans les deux formats
      features: Array.isArray(data.features) ? data.features : [],
      amenities: Array.isArray(data.amenities) ? data.amenities : [],
      property_sub_type: Array.isArray(data.property_sub_type) ? data.property_sub_type : ['apartment'],
      // CRITICAL: Force all media URL fields to be arrays
      floor_plan_urls: (() => {
        console.log('🔍 DEBUGGING floor_plan_urls:', { 
          value: data.floor_plan_urls, 
          type: typeof data.floor_plan_urls,
          isArray: Array.isArray(data.floor_plan_urls) 
        });
        return Array.isArray(data.floor_plan_urls) ? data.floor_plan_urls : [];
      })(),
      video_tour_urls: Array.isArray(data.video_tour_urls) ? data.video_tour_urls : [],
      photo_gallery_urls: Array.isArray(data.photo_gallery_urls) ? data.photo_gallery_urls : [],
      drone_footage_urls: Array.isArray(data.drone_footage_urls) ? data.drone_footage_urls : [],
      model_3d_urls: Array.isArray(data.model_3d_urls) ? data.model_3d_urls : [],
      floor_plan_3d_urls: Array.isArray(data.floor_plan_3d_urls) ? data.floor_plan_3d_urls : [],
      // Fix date formats - convert YYYY-MM to YYYY-MM-01 for database
      launch_date: (() => {
        console.log('🔍 Processing launch_date:', data.launch_date);
        if (!data.launch_date) return null;
        if (/^\d{4}-\d{2}$/.test(data.launch_date)) {
          const converted = `${data.launch_date}-01`;
          console.log('✅ Converted launch_date:', data.launch_date, '->', converted);
          return converted;
        }
        if (/^\d{4}-\d{2}-\d{2}$/.test(data.launch_date)) {
          console.log('✅ Valid launch_date format:', data.launch_date);
          return data.launch_date;
        }
        console.log('❌ Invalid launch_date format:', data.launch_date);
        return null;
      })(),
      completion_date_new: (() => {
        console.log('🔍 Processing completion_date_new:', data.completion_date_new);
        if (!data.completion_date_new) return null;
        if (/^\d{4}-\d{2}$/.test(data.completion_date_new)) {
          const converted = `${data.completion_date_new}-01`;
          console.log('✅ Converted completion_date_new:', data.completion_date_new, '->', converted);
          return converted;
        }
        if (/^\d{4}-\d{2}-\d{2}$/.test(data.completion_date_new)) {
          console.log('✅ Valid completion_date_new format:', data.completion_date_new);
          return data.completion_date_new;
        }
        console.log('❌ Invalid completion_date_new format:', data.completion_date_new);
        return null;
      })(),
    };

    // Les commodités de proximité sont maintenant dans surrounding_amenities (champ normal)
    
    
    console.log('🧹 CLEANED data for submission:');
    console.log('📊 Status FINAL values:', { 
      status_project: cleanedData.status_project,
      statut_commercial: cleanedData.statut_commercial
    });
    console.log('📋 Complete cleaned data:', cleanedData);
    console.log('🔥 === FIN DEBUG - SENDING TO DB ===');
    saveProjectMutation.mutate(cleanedData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="container mx-auto py-8">
          <div className="text-center">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Modern Header - STICKY - Même taille que les autres pages admin */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="px-8 py-8">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/admin/projects')}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Retour aux projets
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    {isEditing ? 'Modifier le Projet' : 'Nouveau Projet'}
                  </h1>
                  <p className="text-slate-600">
                    {isEditing ? 'Modifiez les informations de votre projet' : 'Créez un nouveau projet immobilier'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation des Étapes - STICKY */}
        <div className="w-80 bg-white border-r border-slate-200 shadow-sm flex-shrink-0 sticky top-32 h-[calc(100vh-8rem)] overflow-y-auto">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Étapes du Projet</h2>
            <nav className="space-y-2">
              {projectFormSteps.map((step, index) => {
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;
                
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setCurrentStepIndex(index)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-white shadow-md'
                        : isCompleted
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                        : 'text-slate-600 hover:bg-slate-50 border border-slate-200'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      isActive
                        ? 'bg-white text-primary'
                        : isCompleted
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    <span className="font-medium">{step.title}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content - SCROLLABLE */}
        <div className="flex-1 overflow-y-auto h-screen">
          <div className="px-8 py-6">
            <div className="max-w-7xl mx-auto">
              <Card className="bg-white border-2 border-slate-200 shadow-xl">
                <CardContent className="p-10">
                  <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">
                      {currentStep.title}
                    </h1>
                    <p className="text-slate-600">
                      Étape {currentStepIndex + 1} sur {projectFormSteps.length} - Complétez les informations demandées
                    </p>
                  </div>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmitWithConfirmation)} className="space-y-10">
                      <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-8">
                        <ProjectFormSteps 
                          key={formKey}
                          currentStep={currentStep.id}
                          projectId={id}
                          form={form as any}
                        />
                      </div>
                      
                      {/* Navigation Buttons */}
                      <div className="flex justify-between items-center pt-6 border-t-2 border-slate-200">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={prevStep}
                          disabled={currentStepIndex === 0}
                          className="flex items-center gap-2 border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Précédent
                        </Button>
                        
                        <div className="flex items-center gap-3">
                          {currentStepIndex === projectFormSteps.length - 1 ? (
                            <>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setSaveType('draft');
                                  form.handleSubmit(handleSubmitWithConfirmation)();
                                }}
                                disabled={saveProjectMutation.isPending}
                                className="flex items-center gap-2 border-2 border-orange-300 text-orange-700 hover:bg-orange-50"
                              >
                                <Save className="h-4 w-4" />
                                {saveProjectMutation.isPending && saveType === 'draft' ? 'Sauvegarde...' : 'Sauvegarder en brouillon'}
                              </Button>
                              <Button
                                type="submit"
                                onClick={() => setSaveType('publish')}
                                disabled={saveProjectMutation.isPending}
                                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white border-2 border-emerald-600 shadow-lg"
                              >
                                <Eye className="h-4 w-4" />
                                {saveProjectMutation.isPending && saveType === 'publish' ? 'Publication...' : 'Publier le projet'}
                              </Button>
                            </>
                          ) : (
                            <Button
                              type="button"
                              onClick={nextStep}
                              className="flex items-center gap-2 bg-primary hover:bg-primary/90 border-2 border-primary shadow-lg"
                            >
                              Suivant
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </form>
                  </Form>

                  {/* Confirmation Dialog */}
                  <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          {validationErrors.length > 0 ? (
                            <>
                              <AlertTriangle className="h-5 w-5 text-red-600" />
                              Erreurs détectées
                            </>
                          ) : (
                            <>
                              <Eye className="h-5 w-5 text-green-600" />
                              {saveType === 'publish' ? 'Publier le projet' : 'Sauvegarder le projet'}
                            </>
                          )}
                        </DialogTitle>
                        <DialogDescription>
                          {validationErrors.length > 0 
                            ? 'Des erreurs ont été détectées et doivent être corrigées avant la publication.'
                            : `Voulez-vous ${saveType === 'publish' ? 'publier' : 'sauvegarder'} le projet "${form.getValues('title') || 'Nouveau projet'}" ?`
                          }
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-6">
                        <div className="bg-slate-50 rounded-lg p-4">
                          <h4 className="font-medium text-slate-900 mb-2">Projet concerné</h4>
                          <p className="text-slate-700">{form.getValues('title') || 'Nouveau projet'}</p>
                        </div>

                        {validationErrors.length > 0 && (
                          <div className="space-y-4">
                            <h4 className="font-medium text-red-700 flex items-center gap-2">
                              <AlertTriangle className="h-5 w-5" />
                              Erreurs à corriger ({validationErrors.length})
                            </h4>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                              {validationErrors.map((error, index) => (
                                <div key={index} className="border border-red-200 bg-red-50 rounded-lg p-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="destructive">❌ Erreur</Badge>
                                      <span className="font-medium text-sm text-red-800">{error.label}</span>
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-6 px-2 text-xs"
                                      onClick={() => {
                                        setShowConfirmDialog(false);
                                        // Find which step contains this field
                                        const stepIndex = projectFormSteps.findIndex(step => 
                                          step.fields && step.fields.includes(error.field)
                                        );
                                        if (stepIndex !== -1 && stepIndex !== currentStepIndex) {
                                          setCurrentStepIndex(stepIndex);
                                        }
                                        // Focus the field after a small delay
                                        setTimeout(() => {
                                          const field = document.querySelector(`[name="${error.field}"]`) as HTMLElement;
                                          if (field) {
                                            field.focus();
                                            field.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                          }
                                        }, 100);
                                      }}
                                    >
                                      Aller au champ
                                    </Button>
                                  </div>
                                  <p className="text-red-700 text-xs mt-1">{error.message}</p>
                                </div>
                              ))}
                            </div>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                              <p className="text-red-800 text-sm font-medium">
                                🚫 Impossible de publier le projet tant que ces erreurs ne sont pas corrigées.
                              </p>
                              <p className="text-red-700 text-xs mt-1">
                                Cliquez sur "Aller au champ" pour naviguer directement vers les champs à corriger.
                              </p>
                            </div>
                          </div>
                        )}

                        {validationErrors.length === 0 && saveType === 'publish' && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-green-800 font-medium">✅ Aucune erreur détectée</p>
                            <p className="text-green-700 text-sm">Le projet est prêt à être publié.</p>
                          </div>
                        )}
                      </div>

                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setShowConfirmDialog(false)}
                          disabled={saveProjectMutation.isPending}
                        >
                          {validationErrors.length > 0 ? 'Retour au formulaire' : 'Annuler'}
                        </Button>
                        {validationErrors.length === 0 && (
                          <Button
                            onClick={() => {
                              const formData = form.getValues();
                              onSubmit(formData);
                              setShowConfirmDialog(false);
                            }}
                            disabled={saveProjectMutation.isPending}
                            variant="default"
                          >
                            {saveProjectMutation.isPending ? 'En cours...' : (saveType === 'publish' ? 'Publier' : 'Sauvegarder')}
                          </Button>
                        )}
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProjectForm;