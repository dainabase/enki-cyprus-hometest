import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Check, Save, CheckCircle, ChevronLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PropertyFormSteps } from '@/components/admin/properties/PropertyFormSteps';
import { propertySchema, PropertyFormData, propertyFormSteps } from '@/schemas/property.schema';
import { useToast } from '@/hooks/use-toast';

export default function PropertyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = propertyFormSteps[currentStepIndex];

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      property_status: 'available',
      sale_type: 'sale',
      ownership_type: 'freehold',
      bedrooms_count: 1,
      bathrooms_count: 1,
      wc_count: 0,
      vat_rate: 5,
      commission_rate: 5,
      deposit_percentage: 30,
      reservation_fee: 5000,
      payment_plan_available: false,
      finance_available: false,
      title_deed_status: 'pending',
      has_office: false,
      has_maid_room: false,
      has_dressing_room: false,
      has_playroom: false,
      has_wine_cellar: false,
      has_pantry: false,
      has_laundry_room: false,
      has_private_garden: false,
      has_private_pool: false,
      balcony_count: 0,
      terrace_count: 0,
      parking_spaces: 0,
      storage_spaces: 0,
      appliances_list: [],
      smart_home_features: [],
      security_features: [],
      view_type: []
    },
  });

  // Fetch property data for editing
  const { data: property, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          project:projects(id, title, name),
          building:buildings(id, building_name, name)
        `)
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  // Load property data into form
  useEffect(() => {
    if (property && isEdit) {
      console.log('Property data loaded for editing:', property);
    }
  }, [property, isEdit, form]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: PropertyFormData) => {
      const propertyData = {
        ...data,
        project_id: data.project_id || '',
        property_type: data.property_type || 'apartment',
        unit_number: data.unit_number || ''
      };

      if (isEdit && id) {
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', id);
        if (error) throw error;
        return { id };
      } else {
        const { data: newProperty, error } = await supabase
          .from('properties')
          .insert(propertyData)
          .select()
          .single();
        if (error) throw error;
        return newProperty;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast({
        title: isEdit ? "Propriété mise à jour" : "Propriété créée",
        description: "Les modifications ont été sauvegardées avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Erreur lors de la sauvegarde: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleSave = (data: PropertyFormData) => {
    saveMutation.mutate(data);
  };

  const handleNext = async () => {
    const currentStepFields = getCurrentStepFields();
    const isValid = await form.trigger(currentStepFields);
    
    if (isValid && currentStepIndex < propertyFormSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStepIndex(stepIndex);
  };

  const getCurrentStepFields = (): (keyof PropertyFormData)[] => {
    switch (currentStep.id) {
      case 'identification':
        return ['project_id', 'unit_number', 'property_type', 'property_status'];
      case 'configuration':
        return ['bedrooms_count', 'bathrooms_count', 'internal_area'];
      case 'equipment':
        return [];
      case 'outdoor':
        return [];
      case 'financial':
        return ['price_excluding_vat', 'vat_rate'];
      case 'documentation':
        return [];
      default:
        return [];
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  const priceExcludingVat = form.watch('price_excluding_vat') || 0;
  const vatRate = form.watch('vat_rate') || 5;
  const priceIncludingVat = priceExcludingVat + (priceExcludingVat * vatRate / 100);
  const isGoldenVisa = priceIncludingVat >= 300000;


  return (
    <div className="h-screen flex flex-col">
      {/* Header Section - STICKY */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/admin/properties')}
                  className="p-2 hover:bg-slate-100"
                  size="sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    {isEdit ? 'Modifier la propriété' : 'Créer une nouvelle propriété'}
                  </h1>
                  <p className="text-slate-600">
                    Étape {currentStepIndex + 1} sur {propertyFormSteps.length}: {currentStep.title}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {saveMutation.isSuccess && (
                <div className="flex items-center text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Sauvegardé</span>
                </div>
              )}
              {/* Golden Visa Badge */}
              {isGoldenVisa && (
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                  ✨ Golden Visa Éligible
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 sticky top-32 h-[calc(100vh-8rem)] overflow-y-auto flex-shrink-0">
          <div className="p-6 space-y-6">
            {/* Steps navigation */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-500 mb-4">Étapes du formulaire</h3>
              {propertyFormSteps.map((step, index) => (
                <Button
                  key={step.id}
                  variant={index === currentStepIndex ? "default" : "ghost"}
                  onClick={() => handleStepClick(index)}
                  className={`w-full justify-start text-left h-auto p-3 ${
                    index === currentStepIndex 
                      ? 'bg-slate-900 text-white hover:bg-slate-800' 
                      : 'hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                        index < currentStepIndex
                          ? 'bg-emerald-500 text-white'
                          : index === currentStepIndex
                          ? 'bg-white text-slate-900'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {index < currentStepIndex ? <Check className="w-3 h-3" /> : index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm">{step.title}</div>
                      <div className={`text-xs truncate ${
                        index === currentStepIndex 
                          ? 'text-slate-300' 
                          : 'text-slate-500'
                      }`}>{step.description}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="p-8 space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-lg">
                  <CardContent className="p-8">
                    <PropertyFormSteps
                      form={form}
                      currentStep={currentStep.id}
                    />
                  </CardContent>
                </Card>

                {/* Navigation Buttons */}
                <div className="flex justify-between bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-6 shadow-lg">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStepIndex === 0}
                    className="gap-2 border-slate-200 hover:bg-slate-50"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Précédent
                  </Button>

                  <div className="flex gap-3">
                    {currentStepIndex === propertyFormSteps.length - 1 ? (
                      <Button 
                        type="submit" 
                        disabled={saveMutation.isPending}
                        className="bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 gap-2"
                        size="lg"
                      >
                        <Save className="w-4 h-4" />
                        {saveMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
                      </Button>
                    ) : (
                      <Button 
                        type="button" 
                        onClick={handleNext}
                        className="bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 gap-2"
                        size="lg"
                      >
                        Suivant
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </main>
      </div>
    </div>
  );
}