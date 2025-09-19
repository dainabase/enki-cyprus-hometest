import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { propertyDBSchema, PropertyDBData } from '@/schemas/property-db.schema';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { PropertyIdentificationStep } from '@/components/admin/properties/steps/PropertyIdentificationStep';
import { PropertyConfigurationStep } from '@/components/admin/properties/steps/PropertyConfigurationStep';
import { PropertyFinancialStep } from '@/components/admin/properties/steps/PropertyFinancialStep';

const AdminPropertyForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const isEdit = Boolean(id);

  const form = useForm<PropertyDBData>({
    resolver: zodResolver(propertyDBSchema),
    defaultValues: {
      status: 'available',
      currency: 'EUR',
      vat_rate: 5,
      financing_available: false,
      bank_loan_eligible: false,
      has_balcony: false,
      has_terrace: false,
      has_garden: false,
      has_private_pool: false,
      has_jacuzzi: false,
      has_fireplace: false,
      has_parking_space: false,
      parking_spaces_count: 0,
      has_storage_room: false,
      has_maid_room: false,
      property_features: [],
      is_resale: false,
      previous_owners_count: 0,
      title_deed_ready: false,
      wc_separate: false,
    }
  });

  // Charger les données si c'est une édition
  useEffect(() => {
    const loadProperty = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('properties_final')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        if (data) {
          // Réinitialiser le formulaire avec les vraies données de la DB (sans validation stricte)
          form.reset(data as any);
        }
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la propriété",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id, form, toast]);

  const onSubmit = async (data: PropertyDBData) => {
    setLoading(true);
    try {
      // Remove generated columns (database calculates them automatically)
      const { vat_amount, price_with_vat, golden_visa_eligible, price_per_m2, ...cleanData } = data;

      if (isEdit) {
        const { error } = await supabase
          .from('properties_final')
          .update(cleanData as any)
          .eq('id', id);
        
        if (error) throw error;
        
        toast({
          title: "Succès",
          description: "Propriété mise à jour avec succès",
        });
      } else {
        const { error } = await supabase
          .from('properties_final')
          .insert(cleanData as any);
        
        if (error) throw error;
        
        toast({
          title: "Succès", 
          description: "Propriété créée avec succès",
        });
      }
      
      navigate('/admin/properties');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 'identification', title: 'Identification', component: PropertyIdentificationStep },
    { id: 'configuration', title: 'Configuration', component: PropertyConfigurationStep },
    { id: 'financial', title: 'Prix', component: PropertyFinancialStep },
  ];

  const CurrentStepComponent = steps[currentStep].component;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>
              {isEdit ? 'Modifier la propriété' : 'Nouvelle propriété'}
            </CardTitle>
            
            {/* Indicateur d'étapes */}
            <div className="flex space-x-4 mt-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex-1 h-2 rounded ${
                    index <= currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            
            <p className="text-sm text-muted-foreground mt-2">
              Étape {currentStep + 1} sur {steps.length}: {steps[currentStep].title}
            </p>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Contenu de l'étape actuelle */}
                <CurrentStepComponent form={form} />
                
                {/* Navigation */}
                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                  >
                    Précédent
                  </Button>
                  
                  <div className="space-x-2">
                    {currentStep < steps.length - 1 ? (
                      <Button type="button" onClick={nextStep}>
                        Suivant
                      </Button>
                    ) : (
                      <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEdit ? 'Mettre à jour' : 'Créer'}
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
  );
};

export default AdminPropertyForm;