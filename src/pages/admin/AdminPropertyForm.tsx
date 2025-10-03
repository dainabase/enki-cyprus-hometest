import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Save, CircleCheck as CheckCircle, ChevronLeft, Check, CircleAlert as AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { propertySchema, propertyFormSteps, PropertyFormData } from '@/schemas/property.schema';
import { createProperty, updateProperty } from '@/lib/api/properties';
import { PropertyFormSteps } from '@/components/admin/properties/PropertyFormSteps';

const GOLDEN_VISA_THRESHOLD = 300000;
const AUTO_SAVE_INTERVAL = 30000;

export default function AdminPropertyForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEdit = Boolean(id);
  const queryClient = useQueryClient();

  const projectFromUrl = searchParams.get('project');
  const buildingFromUrl = searchParams.get('building');

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<any>(null);
  const [inheritedData, setInheritedData] = useState<{
    vat_rate?: number;
    commission_rate?: number;
    energy_rating?: string;
  }>({});

  const currentStep = propertyFormSteps[currentStepIndex];

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    mode: 'onChange',
    defaultValues: {
      project_id: projectFromUrl || '',
      building_id: buildingFromUrl || null,
      unit_number: '',
      property_code: '',
      property_type: 'apartment',
      property_status: 'available',
      sale_type: 'sale',
      ownership_type: 'freehold',

      bedrooms_count: 0,
      bathrooms_count: 0,
      wc_count: 0,
      internal_area: 0,
      covered_verandas: 0,
      uncovered_verandas: 0,
      floor_number: 0,

      has_office: false,
      has_maid_room: false,
      has_dressing_room: false,
      has_playroom: false,
      has_wine_cellar: false,
      has_pantry: false,
      has_laundry_room: false,

      has_kitchen_appliances: false,
      appliances_list: [],
      smart_home_features: [],
      security_features: [],

      balcony_count: 0,
      terrace_count: 0,
      has_private_garden: false,
      has_private_pool: false,
      parking_spaces: 0,
      storage_spaces: 0,
      view_type: [],

      price_excluding_vat: 0,
      vat_rate: 5,
      commission_rate: 5,
      deposit_percentage: 30,
      reservation_fee: 5000,
      payment_plan_available: false,
      finance_available: false,

      title_deed_status: 'pending'
    }
  });

  // Fetch projects
  const { data: projectsData } = useQuery({
    queryKey: ['projects-for-property'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          title,
          city,
          vat_rate,
          project_code,
          developer:developers(id, name, commission_rate)
        `)
        .order('title');
      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    if (projectsData) {
      console.log('AdminPropertyForm - Projects loaded:', projectsData.length, projectsData);
      setProjects(projectsData);
    } else {
      console.log('AdminPropertyForm - No projects data yet');
    }
  }, [projectsData]);

  // Fetch buildings when project changes
  const selectedProjectId = form.watch('project_id');

  const { data: buildingsData } = useQuery({
    queryKey: ['buildings-for-property', selectedProjectId],
    queryFn: async () => {
      if (!selectedProjectId) return [];
      const { data, error } = await supabase
        .from('buildings')
        .select('id, building_name, building_code, energy_certificate, project_id')
        .eq('project_id', selectedProjectId)
        .order('building_name');
      if (error) throw error;
      return data;
    },
    enabled: !!selectedProjectId
  });

  useEffect(() => {
    if (buildingsData) {
      setBuildings(buildingsData);
    }
  }, [buildingsData]);

  // Fetch existing property (edit mode)
  const { data: existingProperty } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          building:buildings(id, building_name, energy_certificate, project_id),
          project:projects(id, title, vat_rate, developer:developers(commission_rate))
        `)
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  // Load existing property data
  useEffect(() => {
    if (existingProperty) {
      // Map database property to form data structure
      const formData: Partial<PropertyFormData> = {
        project_id: existingProperty.project_id || '',
        building_id: existingProperty.building_id || null,
        unit_number: existingProperty.unit_number || '',
        property_code: existingProperty.property_code || '',
        property_type: existingProperty.property_type as any,
        property_sub_type: existingProperty.property_sub_type || '',
        property_status: existingProperty.property_status as any || 'available',
        sale_type: 'sale',
        ownership_type: 'freehold',

        bedrooms_count: existingProperty.bedrooms_count || 0,
        bathrooms_count: existingProperty.bathrooms_count || 0,
        wc_count: existingProperty.wc_count || 0,
        internal_area: existingProperty.internal_area || 0,
        covered_verandas: existingProperty.covered_verandas || 0,
        uncovered_verandas: existingProperty.uncovered_verandas || 0,
        private_garden_area: existingProperty.private_garden_area || 0,
        roof_garden_area: existingProperty.roof_garden_area || 0,
        floor_number: existingProperty.floor_number,
        position_in_floor: existingProperty.position_in_floor || '',
        orientation: existingProperty.orientation as any,

        has_office: existingProperty.has_office || false,
        has_maid_room: existingProperty.has_maid_room || false,
        has_dressing_room: existingProperty.has_dressing_room || false,
        has_playroom: existingProperty.has_playroom || false,
        has_wine_cellar: existingProperty.has_wine_cellar || false,
        has_pantry: existingProperty.has_pantry || false,
        has_laundry_room: existingProperty.has_laundry_room || false,
        total_rooms: existingProperty.total_rooms,

        kitchen_type: existingProperty.kitchen_type as any,
        kitchen_brand: existingProperty.kitchen_brand || '',
        has_kitchen_appliances: existingProperty.has_kitchen_appliances || false,
        appliances_list: (existingProperty.appliances_list as any) || [],
        hvac_type: existingProperty.hvac_type as any,
        heating_type: existingProperty.heating_type as any,
        flooring_type: existingProperty.flooring_type as any,
        windows_type: existingProperty.windows_type as any,
        doors_type: existingProperty.doors_type as any,
        smart_home_features: (existingProperty.smart_home_features as any) || [],
        security_features: (existingProperty.security_features as any) || [],

        balcony_count: existingProperty.balcony_count || 0,
        balcony_area: existingProperty.balcony_area || 0,
        terrace_count: existingProperty.terrace_count || 0,
        terrace_area: existingProperty.terrace_area || 0,
        has_private_garden: existingProperty.has_private_garden || false,
        has_private_pool: existingProperty.has_private_pool || false,
        pool_type: existingProperty.pool_type as any,
        parking_spaces: existingProperty.parking_spaces || 0,
        parking_type: existingProperty.parking_type as any,
        storage_spaces: existingProperty.storage_spaces || 0,
        storage_area: existingProperty.storage_area || 0,
        view_type: (existingProperty.view_type as any) || [],

        price_excluding_vat: existingProperty.price_excluding_vat || 0,
        vat_rate: existingProperty.vat_rate || 5,
        commission_rate: existingProperty.commission_rate || 5,
        original_price: existingProperty.original_price,
        current_price: existingProperty.current_price,
        deposit_percentage: existingProperty.deposit_percentage || 30,
        reservation_fee: existingProperty.reservation_fee || 5000,
        payment_plan_available: existingProperty.payment_plan_available || false,
        payment_plan_details: existingProperty.payment_plan_details as any,
        finance_available: existingProperty.finance_available || false,
        minimum_cash_required: existingProperty.minimum_cash_required,
        annual_property_tax: existingProperty.annual_property_tax,
        communal_fees_monthly: existingProperty.communal_fees_monthly,
        maintenance_fee_monthly: existingProperty.maintenance_fee_monthly,

        title_deed_status: existingProperty.title_deed_status as any || 'pending',
        planning_permit_number: existingProperty.planning_permit_number || '',
        building_permit_number: existingProperty.building_permit_number || '',
        occupancy_certificate: existingProperty.occupancy_certificate || '',
        energy_certificate_number: existingProperty.energy_certificate_number || '',
        energy_rating: existingProperty.energy_rating as any,
        cadastral_reference: existingProperty.cadastral_reference || '',
        internal_notes: existingProperty.internal_notes || '',
        public_description: existingProperty.public_description || ''
      };
      
      form.reset(formData as PropertyFormData);
    }
  }, [existingProperty, form]);

  // Handle project selection (CASCADE)
  useEffect(() => {
    if (selectedProjectId && projects.length > 0) {
      const project = projects.find(p => p.id === selectedProjectId);
      if (project) {
        setSelectedProject(project);

        const inherited: any = {
          vat_rate: project.vat_rate || 5,
          commission_rate: project.developer?.commission_rate || 5
        };

        setInheritedData(inherited);

        if (!isEdit) {
          form.setValue('vat_rate', inherited.vat_rate);
          form.setValue('commission_rate', inherited.commission_rate);
        }
      }
    }
  }, [selectedProjectId, projects, isEdit]);

  // Handle building selection (CASCADE)
  const selectedBuildingId = form.watch('building_id');

  useEffect(() => {
    if (selectedBuildingId && buildings.length > 0) {
      const building = buildings.find(b => b.id === selectedBuildingId);
      if (building) {
        setSelectedBuilding(building);

        if (building.energy_certificate && !isEdit) {
          form.setValue('energy_rating', building.energy_certificate);
          setInheritedData(prev => ({
            ...prev,
            energy_rating: building.energy_certificate
          }));
        }
      }
    }
  }, [selectedBuildingId, buildings, isEdit]);

  // Auto-generate property_code
  useEffect(() => {
    const projectId = form.watch('project_id');
    const unitNumber = form.watch('unit_number');

    if (projectId && unitNumber && !form.getValues('property_code')) {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        const code = `${project.project_code || 'PROP'}-${unitNumber}`;
        form.setValue('property_code', code);
      }
    }
  }, [form.watch('project_id'), form.watch('unit_number'), projects]);

  // Real-time calculations
  const priceExcludingVat = form.watch('price_excluding_vat');
  const vatRate = form.watch('vat_rate');
  const commissionRate = form.watch('commission_rate');

  const calculations = React.useMemo(() => {
    const vat_amount = (priceExcludingVat * vatRate) / 100;
    const price_including_vat = priceExcludingVat + vat_amount;
    const commission_amount = (price_including_vat * commissionRate) / 100;
    const golden_visa_eligible = price_including_vat >= GOLDEN_VISA_THRESHOLD;

    return {
      vat_amount,
      price_including_vat,
      commission_amount,
      golden_visa_eligible
    };
  }, [priceExcludingVat, vatRate, commissionRate]);

  // Auto-save (IMPROVED: only in edit mode)
  useEffect(() => {
    if (!isEdit) return;

    const autoSaveInterval = setInterval(() => {
      if (form.formState.isDirty && !isAutoSaving) {
        handleAutoSave();
      }
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(autoSaveInterval);
  }, [isEdit, form.formState.isDirty, isAutoSaving]);

  const handleAutoSave = useCallback(async () => {
    if (!id) return;

    setIsAutoSaving(true);
    try {
      const values = form.getValues();
      await updateProperty(id, values);
      toast.success('Sauvegarde automatique réussie', { duration: 2000 });
    } catch (error) {
      console.error('[PropertyForm] Auto-save error:', error);
    } finally {
      setIsAutoSaving(false);
    }
  }, [id, form]);

  // Save draft mutation
  const saveDraftMutation = useMutation({
    mutationFn: async (data: PropertyFormData) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Non authentifié');

      return await supabase
        .from('property_drafts')
        .upsert({
          user_id: user.data.user.id,
          property_id: id || null,
          draft_data: data,
          updated_at: new Date().toISOString()
        });
    },
    onSuccess: () => {
      toast.success('Brouillon sauvegardé');
    }
  });

  // Create property mutation
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return await createProperty(data.project_id, data);
    },
    onSuccess: (newProperty) => {
      queryClient.invalidateQueries({ queryKey: ['all-properties'] });
      toast.success('Propriété créée avec succès');
      navigate(`/admin/properties/${newProperty.id}/edit`);
    },
    onError: (error: any) => {
      if (error.code === '23505') {
        toast.error('Une propriété avec ce code existe déjà');
      } else if (error.code === '23503') {
        toast.error('Projet ou bâtiment invalide');
      } else {
        toast.error('Erreur lors de la création');
      }
      console.error('[PropertyForm] Create error:', error);
    }
  });

  // Update property mutation
  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!id) throw new Error('ID manquant');
      return await updateProperty(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property', id] });
      queryClient.invalidateQueries({ queryKey: ['all-properties'] });
      toast.success('Propriété mise à jour avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la mise à jour');
      console.error('[PropertyForm] Update error:', error);
    }
  });

  // Navigation handlers
  const handleNext = async () => {
    const stepFields = getFieldsForStep(currentStep.id);
    const isStepValid = await form.trigger(stepFields as any);

    if (!isStepValid) {
      const errors = Object.keys(form.formState.errors)
        .filter(key => stepFields.includes(key));

      toast.error(`Veuillez corriger les ${errors.length} erreur(s)`, {
        description: 'Certains champs obligatoires sont manquants ou invalides'
      });
      return;
    }

    if (currentStepIndex < propertyFormSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleSaveDraft = () => {
    const values = form.getValues();
    saveDraftMutation.mutate(values);
  };

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      if (isEdit) {
        await updateMutation.mutateAsync(data);
      } else {
        await createMutation.mutateAsync(data);
      }
    } catch (error) {
      console.error('[PropertyForm] Submit error:', error);
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* HEADER STICKY */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Button
                variant="ghost"
                onClick={() => navigate('/admin/properties')}
                className="mb-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux propriétés
              </Button>
              <h1 className="text-2xl font-bold">
                {isEdit ? 'Modifier la propriété' : 'Nouvelle propriété'}
              </h1>
              {isAutoSaving && (
                <Badge variant="secondary" className="ml-2">
                  <Save className="h-3 w-3 mr-1 animate-pulse" />
                  Sauvegarde auto...
                </Badge>
              )}
            </div>

            <div className="flex gap-2">
              {!isEdit && (
                <Button variant="outline" onClick={handleSaveDraft}>
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer brouillon
                </Button>
              )}
              <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
                <CheckCircle className="h-4 w-4 mr-2" />
                {isEdit ? 'Mettre à jour' : 'Créer la propriété'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-6">
          {/* SIDEBAR GAUCHE - Navigation étapes */}
          <aside className="w-80 flex-shrink-0">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Progression</span>
                    <span className="text-slate-600">
                      {currentStepIndex + 1} / {propertyFormSteps.length}
                    </span>
                  </div>
                  <Progress
                    value={(currentStepIndex + 1) / propertyFormSteps.length * 100}
                  />
                </div>

                <nav className="space-y-2">
                  {propertyFormSteps.map((step, index) => (
                    <button
                      key={step.id}
                      onClick={() => setCurrentStepIndex(index)}
                      className={cn(
                        "w-full text-left p-3 rounded-lg transition-all",
                        index === currentStepIndex
                          ? "bg-gradient-to-r from-[hsl(199,63%,95%)] to-[hsl(199,63%,98%)] border-2 border-[hsl(199,63%,59%)]"
                          : index < currentStepIndex
                          ? "bg-green-50 border border-green-200"
                          : "bg-slate-50 border border-slate-200 hover:bg-slate-100"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                          index === currentStepIndex
                            ? "bg-[hsl(199,63%,59%)] text-white"
                            : index < currentStepIndex
                            ? "bg-green-500 text-white"
                            : "bg-slate-200 text-slate-500"
                        )}>
                          {index < currentStepIndex ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <span className="text-sm font-bold">{index + 1}</span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{step.title}</div>
                          <div className="text-xs text-slate-600 truncate">
                            {step.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* CONTENU PRINCIPAL */}
          <main className="flex-1">
            <Card>
              <CardHeader>
                <CardTitle>{currentStep.title}</CardTitle>
                <CardDescription>{currentStep.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <Form {...form}>
                  <form onSubmit={handleSubmit} onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
                      e.preventDefault();
                    }
                  }}>
                    <PropertyFormSteps
                      currentStep={currentStep.id}
                      form={form}
                      projects={projects}
                      buildings={buildings}
                      inheritedData={inheritedData}
                      calculations={calculations}
                    />

                    <div className="flex justify-between mt-8 pt-6 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentStepIndex === 0}
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Précédent
                      </Button>

                      {currentStepIndex < propertyFormSteps.length - 1 ? (
                        <Button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleNext();
                          }}
                        >
                          Suivant
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      ) : (
                        <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {isEdit ? 'Mettre à jour' : 'Créer'}
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}

// Helper function to get fields for each step
function getFieldsForStep(stepId: string): string[] {
  switch (stepId) {
    case 'identification':
      return ['project_id', 'unit_number', 'property_type'];
    case 'configuration':
      return ['bedrooms_count', 'bathrooms_count', 'internal_area'];
    case 'equipment':
      return [];
    case 'outdoor':
      return [];
    case 'financial':
      return ['price_excluding_vat'];
    case 'documentation':
      return [];
    default:
      return [];
  }
}
