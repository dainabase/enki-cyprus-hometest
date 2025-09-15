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
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, Save, Eye } from 'lucide-react';

export const AdminProjectForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const isEditing = isEdit;
  const { toast } = useToast();
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [saveType, setSaveType] = useState<'draft' | 'publish'>('draft');

  const currentStep = projectFormSteps[currentStepIndex];

  const form = useForm({
    mode: 'onSubmit',
    defaultValues: {
      title: '',
      description: '',
      developer_id: '',
      city: '',
      full_address: '',
      region: '',
      neighborhood: '',
      photos: [] as string[],
      features: [] as string[],
      amenities: [] as string[],
      status: 'available' as const,
      vat_rate_new: 5,
      vat_included: false,
      golden_visa_eligible_new: false,
      financing_available: false,
      featured_new: false,
      cyprus_zone: 'limassol' as const,
      property_category: 'residential' as const,
      property_sub_type: ['apartment'] as const,
      exclusive_commercialization: false,
      project_phase: 'off-plan' as const,
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

  // Populate form when data is loaded
  React.useEffect(() => {
    if (projectData && isEdit) {
      Object.entries(projectData).forEach(([key, value]) => {
        if (value !== undefined && form.getValues(key as any) !== undefined) {
          form.setValue(key as any, value);
        }
      });
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
      toast({
        title: isEdit ? 'Projet mis à jour' : 'Projet créé',
        description: isEdit ? 'Le projet a été mis à jour avec succès' : 'Le nouveau projet a été créé avec succès'
      });
      navigate('/admin/projects');
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la sauvegarde',
        variant: 'destructive'
      });
    }
  });

  const onSubmit = (data: any) => {
    saveProjectMutation.mutate(data);
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
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : isCompleted
                        ? 'bg-green-50 text-green-700 hover:bg-green-100'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      isActive
                        ? 'bg-white text-primary'
                        : isCompleted
                        ? 'bg-green-500 text-white'
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
            <div className="max-w-4xl mx-auto">
              <Card className="bg-white border-2 border-slate-200 shadow-xl">
                <CardContent className="p-8">
                  <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">
                      {currentStep.title}
                    </h1>
                    <p className="text-slate-600">
                      Étape {currentStepIndex + 1} sur {projectFormSteps.length} - Complétez les informations demandées
                    </p>
                  </div>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-6">
                        <ProjectFormSteps 
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
                                  form.handleSubmit(onSubmit)();
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
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};