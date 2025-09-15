import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { ProjectFormSteps } from '@/components/admin/projects/ProjectFormSteps';
import { projectFormSteps } from '@/schemas/projectSchema';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Save, Eye, ChevronLeft } from 'lucide-react';
import { ProjectActionDialog } from '@/components/admin/ProjectActionDialog';

export const AdminProjectForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const isEditing = isEdit;
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [saveType, setSaveType] = useState<'draft' | 'publish'>('draft');
  const [formKey, setFormKey] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [originalData, setOriginalData] = useState<any>(null);

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
      features: [],
      amenities: [],
      status: 'available',
      vat_rate_new: 5,
      vat_included: false,
      golden_visa_eligible_new: false,
      financing_available: false,
      featured_new: false,
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
      console.log('Project data loaded:', data);
      return data;
    },
    enabled: isEdit
  });

  // Populate form when data is loaded
  React.useEffect(() => {
    if (projectData && isEdit) {
      setOriginalData(projectData); // Store original data for comparison
      console.log('Setting form values with project data:', projectData);
      
      // Create the form data object with proper mapping and strict defaults
      const formData = {
        title: projectData.title || '',
        project_code: projectData.project_code || '',
        developer_id: projectData.developer_id || '',
        property_category: projectData.property_category || 'residential',
        property_sub_type: Array.isArray(projectData.property_sub_type) && projectData.property_sub_type.length > 0 
          ? projectData.property_sub_type 
          : ['apartment'],
        project_phase: projectData.project_phase || 'off-plan',
        launch_date: projectData.launch_date || '',
        completion_date_new: projectData.completion_date_new || '',
        exclusive_commercialization: Boolean(projectData.exclusive_commercialization),
        description: projectData.description || '',
        detailed_description: projectData.detailed_description || '',
        full_address: projectData.full_address || '',
        city: projectData.city || '',
        region: projectData.region || '',
        neighborhood: projectData.neighborhood || '',
        cyprus_zone: projectData.cyprus_zone || 'limassol',
        photos: Array.isArray(projectData.photos) ? projectData.photos : [],
        features: Array.isArray(projectData.features) ? projectData.features : [],
        amenities: Array.isArray(projectData.amenities) ? projectData.amenities : [],
        status: projectData.status || 'available',
        vat_rate_new: Number(projectData.vat_rate_new) || 5,
        vat_included: Boolean(projectData.vat_included),
        golden_visa_eligible_new: Boolean(projectData.golden_visa_eligible_new || projectData.golden_visa_eligible),
        financing_available: Boolean(projectData.financing_available),
        featured_new: Boolean(projectData.featured_new || projectData.featured_property),
        price: Number(projectData.price) || 0,
        meta_title_new: projectData.meta_title_new || '',
        meta_description_new: projectData.meta_description_new || '',
        project_narrative: projectData.project_narrative || ''
      };
      
      console.log('Form data to set:', formData);
      
      // Reset the form with the mapped data
      form.reset(formData);
      
      // Force re-render of the form component
      setFormKey(prev => prev + 1);
      
      setTimeout(() => {
        console.log('Form values after reset:', form.getValues());
      }, 100);
    }
  }, [projectData, isEdit, form]);

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
      const actionMessage = saveType === 'publish' 
        ? 'Projet publié avec succès !' 
        : isEdit ? 'Projet mis à jour avec succès !' : 'Projet créé avec succès !';
      
      const description = saveType === 'publish' 
        ? 'Votre projet est maintenant visible publiquement. Toutes les modifications ont été prises en compte.'
        : isEdit ? 'Toutes les modifications ont été sauvegardées.' : 'Le nouveau projet a été créé.';
      
      toast.success(actionMessage, {
        description,
        duration: 5000
      });
      
      setTimeout(() => {
        navigate('/admin/projects');
      }, 2000);
    },
    onError: (error: any) => {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur de publication', {
        description: `Impossible de ${saveType === 'publish' ? 'publier' : 'sauvegarder'} le projet. Vérifiez tous les champs requis.`,
        duration: 8000
      });
    }
  });

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
    
    // Validate dates format
    if (formData.launch_date && formData.launch_date.length > 0) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.launch_date)) {
        errors.push({ field: 'launch_date', label: 'Date de lancement', message: 'Format invalide (YYYY-MM-DD requis)' });
      }
    }
    
    if (formData.completion_date_new && formData.completion_date_new.length > 0) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.completion_date_new)) {
        errors.push({ field: 'completion_date_new', label: 'Date de completion', message: 'Format invalide (YYYY-MM-DD requis)' });
      }
    }
    
    // Golden Visa validation
    if (formData.golden_visa_eligible_new && formData.price < 300000) {
      errors.push({ field: 'golden_visa_eligible_new', label: 'Golden Visa', message: 'Prix minimum de 300,000€ requis' });
    }
    
    // Price range validation
    if (formData.price_to && formData.price_from_new && formData.price_to < formData.price_from_new) {
      errors.push({ field: 'price_to', label: 'Prix maximum', message: 'Ne peut être inférieur au prix minimum' });
    }
    
    return errors;
  };

  // Function to detect modifications
  const getModifications = (formData: any) => {
    if (!originalData) return [];
    
    const modifications: any[] = [];
    const fieldsToCheck = [
      { key: 'title', label: 'Titre' },
      { key: 'description', label: 'Description' },
      { key: 'price', label: 'Prix' },
      { key: 'status', label: 'Statut' },
      { key: 'features', label: 'Caractéristiques' },
      { key: 'amenities', label: 'Équipements' },
      { key: 'photos', label: 'Photos' }
    ];

    fieldsToCheck.forEach(field => {
      const oldValue = originalData[field.key];
      const newValue = formData[field.key];
      
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        modifications.push({
          field: field.key,
          label: field.label,
          oldValue,
          newValue,
          type: !oldValue ? 'added' : !newValue ? 'removed' : 'modified'
        });
      }
    });

    return modifications;
  };

  const handleSubmitWithConfirmation = (data: any) => {
    // Always validate required fields first
    const validationErrors = validateRequiredFields(data);
    
    if (validationErrors.length > 0) {
      toast.error('Champs requis manquants', {
        description: `${validationErrors.length} erreur(s) détectée(s). Vérifiez le pop-up pour plus de détails.`,
        duration: 8000
      });
      setShowConfirmDialog(true);
      return;
    }
    
    const modifications = getModifications(data);
    
    if (modifications.length > 0 || saveType === 'publish') {
      setShowConfirmDialog(true);
    } else {
      // No changes, submit directly
      onSubmit(data);
    }
  };

  const onSubmit = (data: any) => {
    console.log('Submitting form data:', data);
    
    // Clean and validate data before submission
    const cleanedData = {
      ...data,
      // Ensure proper data types
      price: Number(data.price) || 0,
      vat_rate_new: Number(data.vat_rate_new) || 5,
      vat_included: Boolean(data.vat_included),
      golden_visa_eligible_new: Boolean(data.golden_visa_eligible_new),
      financing_available: Boolean(data.financing_available),
      featured_new: Boolean(data.featured_new),
      exclusive_commercialization: Boolean(data.exclusive_commercialization),
      // Ensure arrays are properly formatted
      photos: Array.isArray(data.photos) ? data.photos : [],
      features: Array.isArray(data.features) ? data.features : [],
      amenities: Array.isArray(data.amenities) ? data.amenities : [],
      property_sub_type: Array.isArray(data.property_sub_type) ? data.property_sub_type : ['apartment'],
      // Set proper status
      status: saveType === 'publish' ? 'available' : 'draft'
    };
    
    console.log('Cleaned form data for submission:', cleanedData);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Modern Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="px-8 py-6">
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

      <div className="flex min-h-screen bg-slate-50">
        {/* Sidebar Navigation des Étapes */}
        <div className="w-80 bg-white border-r border-slate-200 shadow-sm">
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

        {/* Main Content */}
        <div className="flex-1">
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
                  <ProjectActionDialog
                    isOpen={showConfirmDialog}
                    onClose={() => setShowConfirmDialog(false)}
                    onConfirm={() => {
                      const formData = form.getValues();
                      const validationErrors = validateRequiredFields(formData);
                      
                      if (validationErrors.length > 0) {
                        toast.error('Impossible de continuer', {
                          description: 'Corrigez les erreurs affichées dans le dialogue.',
                          duration: 5000
                        });
                        return;
                      }
                      
                      onSubmit(formData);
                    }}
                    action={saveType === 'publish' ? 'publish' : 'save'}
                    projectTitle={form.getValues('title') || 'Nouveau projet'}
                    modifications={originalData ? getModifications(form.getValues()) : []}
                    validationErrors={validateRequiredFields(form.getValues())}
                    isLoading={saveProjectMutation.isPending}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};