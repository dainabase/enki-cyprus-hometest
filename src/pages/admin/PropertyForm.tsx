import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Check, Save } from 'lucide-react';
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
      // TODO: Fix form data mapping for edit mode
      console.log('Property data loaded for editing:', property);
    }
  }, [property, isEdit, form]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: PropertyFormData) => {
      // Ensure required fields are present
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
      navigate('/admin/properties');
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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => navigate('/admin/properties')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux propriétés
          </Button>
          <h1 className="text-2xl font-bold mt-2">
            {isEdit ? 'Modifier la propriété' : 'Créer une nouvelle propriété'}
          </h1>
        </div>
        {isGoldenVisa && (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            ✨ Golden Visa Éligible
          </Badge>
        )}
      </div>

      {/* Steps Navigation */}
      <div className="flex items-center justify-between">
        {propertyFormSteps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index < currentStepIndex
                  ? 'bg-green-500 text-white'
                  : index === currentStepIndex
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {index < currentStepIndex ? <Check className="w-4 h-4" /> : index + 1}
            </div>
            <div className="ml-2 text-sm">
              <div className="font-medium">{step.title}</div>
              <div className="text-gray-500">{step.description}</div>
            </div>
            {index < propertyFormSteps.length - 1 && (
              <div className="w-16 h-px bg-gray-300 mx-4" />
            )}
          </div>
        ))}
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{currentStep.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <PropertyFormSteps
                form={form}
                currentStep={currentStep.id}
              />
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStepIndex === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Précédent
            </Button>

            <div className="flex gap-2">
              {currentStepIndex === propertyFormSteps.length - 1 ? (
                <Button type="submit" disabled={saveMutation.isPending}>
                  <Save className="w-4 h-4 mr-2" />
                  {saveMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
              ) : (
                <Button type="button" onClick={handleNext}>
                  Suivant
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}