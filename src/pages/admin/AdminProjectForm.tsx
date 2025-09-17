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
      latitude: null,
      longitude: null,
      land_area_m2: null,
      built_area_m2: null,
      total_units: null,
      bedrooms_min: null,
      bedrooms_max: null,
      bathrooms_min: null,
      bathrooms_max: null,
      price: 0,
      vat_rate: 19,
      photos: [],
      floor_plan_urls: [],
      virtual_tour_url_new: '',
      amenities: [],
      meta_title: '',
      meta_description: '',
      featured_new: false,
      status_project: 'active'
    }
  });

  // Fetch project data for editing
  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProject(id!),
    enabled: !!id && isEdit
  });

  // Load project data into form when editing
  useEffect(() => {
    if (project && isEdit) {
      console.log('📝 Loading project data into form:', project);
      
      // Reset form with project data
      const projectData = project;
      form.reset({
        // Basics
        title: projectData.title || '',
        project_code: projectData.project_code || '',
        developer_id: projectData.developer_id || '',
        property_category: projectData.property_category || 'residential',
        property_sub_type: projectData.property_sub_type || ['apartment'],
        project_phase: projectData.project_phase || 'off-plan',
        launch_date: projectData.launch_date || '',
        completion_date_new: projectData.completion_date_new || '',
        exclusive_commercialization: projectData.exclusive_commercialization || false,
        description: projectData.description || '',
        detailed_description: projectData.detailed_description || '',
        
        // Location
        full_address: projectData.full_address || '',
        city: projectData.city || '',
        region: projectData.region || '',
        neighborhood: projectData.neighborhood || '',
        latitude: projectData.gps_latitude || null,
        longitude: projectData.gps_longitude || null,
        
        // Specifications
        land_area_m2: projectData.land_area_m2 || null,
        built_area_m2: projectData.built_area_m2 || null,
        total_units: projectData.total_units_new || null,
        
        // Pricing
        price: projectData.price || 0,
        vat_rate: projectData.vat_rate_new || 19,
        
        // Media
        photos: projectData.photos || [],
        floor_plan_urls: projectData.floor_plan_urls || [],
        virtual_tour_url_new: projectData.virtual_tour_url_new || '',
        
        // Amenities
        amenities: projectData.amenities || [],
        
        // Marketing & SEO
        meta_title: projectData.meta_title_new || '',
        meta_description: projectData.meta_description_new || '',
        featured_new: projectData.featured_new || false,
        
        // Status
        status_project: projectData.status_project || 'active'
      });
      
      setFormKey(prev => prev + 1); // Force re-render of ProjectFormSteps
    }
  }, [project, isEdit, form]);

  // Simple submit handler
  const onSubmit = async (data: any) => {
    try {
      console.log('💾 Submitting project data:', data);
      
      if (isEdit) {
        const { error } = await supabase
          .from('projects')
          .update(data)
          .eq('id', id);
        
        if (error) throw error;
        toast.success('Projet mis à jour avec succès');
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([data]);
          
        if (error) throw error;
        toast.success('Projet créé avec succès');
      }
      
      navigate('/admin/projects');
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde');
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
      <div className="bg-white border-b-2 border-slate-200 sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/admin/projects')}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Retour projets
              </Button>
              <h1 className="text-2xl font-bold text-slate-900">
                {isEdit ? 'Modifier le projet' : 'Créer un nouveau projet'}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar fixe */}
        <div className="w-80 bg-white border-r-2 border-slate-200 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto">
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

        {/* Contenu principal avec scroll */}
        <div className="flex-1">
          <div className="p-8">
            <div className="max-w-6xl mx-auto">
              {/* Titre de l'étape */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {currentStep.title}
                </h2>
                <p className="text-slate-600">
                  Étape {currentStepIndex + 1} sur {projectFormSteps.length} - Complétez les informations demandées
                </p>
              </div>

              {/* Formulaire */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Contenu de l'étape */}
                  <div>
                    <ProjectFormSteps 
                      key={formKey}
                      currentStep={currentStep.id}
                      projectId={id}
                      form={form as any}
                    />
                  </div>
                  
                  {/* Boutons de navigation */}
                  <div className="flex justify-between items-center pt-6 border-t-2 border-slate-200 mt-12">
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
                    
                    <div className="flex items-center gap-3">
                      {currentStepIndex === projectFormSteps.length - 1 ? (
                        <>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              const formData = form.getValues();
                              const errors = validateProjectData(formData);
                              setValidationErrors(errors);
                              setSaveType('draft');
                              setShowConfirmDialog(true);
                            }}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Sauvegarder brouillon
                          </Button>
                          <Button
                            type="button"
                            onClick={() => {
                              const formData = form.getValues();
                              const errors = validateProjectData(formData);
                              setValidationErrors(errors);
                              setSaveType('publish');
                              setShowConfirmDialog(true);
                            }}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Publier le projet
                          </Button>
                        </>
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
        </div>
      </div>

      {/* Dialog de confirmation */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {saveType === 'publish' ? 'Publier le projet' : 'Sauvegarder comme brouillon'}
            </DialogTitle>
            <DialogDescription>
              {saveType === 'publish' 
                ? 'Le projet sera visible par le public après publication.' 
                : 'Le projet sera sauvegardé comme brouillon et ne sera pas visible publiquement.'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {validationErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 text-sm font-medium">
                  ⚠️ {validationErrors.length} erreur(s) détectée(s)
                </p>
                {validationErrors.map((error, index) => (
                  <p key={index} className="text-red-700 text-xs mt-1">
                    • {error.message}
                  </p>
                ))}
              </div>
            )}

            {validationErrors.length === 0 && saveType === 'publish' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-800 font-medium">✅ Projet prêt à être publié</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Annuler
            </Button>
            {validationErrors.length === 0 && (
              <Button
                onClick={() => {
                  const formData = form.getValues();
                  onSubmit(formData);
                  setShowConfirmDialog(false);
                }}
              >
                {saveType === 'publish' ? 'Publier' : 'Sauvegarder'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProjectForm;