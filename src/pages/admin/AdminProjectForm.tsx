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

      <div className="px-8 py-6">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-lg">
            <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <ProjectFormSteps 
                    currentStep={currentStep.id}
                    projectId={id}
                    form={form as any}
                  />
                  
                  {/* Navigation Buttons */}
                  <div className="mt-8 p-6 border rounded-lg bg-slate-50">
                    <div className="flex justify-between items-center">
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
                                setSaveType('draft');
                                form.handleSubmit(onSubmit)();
                              }}
                              disabled={saveProjectMutation.isPending}
                              className="flex items-center gap-2"
                            >
                              <Save className="h-4 w-4" />
                              {saveProjectMutation.isPending && saveType === 'draft' ? 'Sauvegarde...' : 'Sauvegarder en brouillon'}
                            </Button>
                            <Button
                              type="submit"
                              onClick={() => setSaveType('publish')}
                              disabled={saveProjectMutation.isPending}
                              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              <Eye className="h-4 w-4" />
                              {saveProjectMutation.isPending && saveType === 'publish' ? 'Publication...' : 'Publier le projet'}
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
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};