import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { PropertyFormSteps } from '@/components/admin/properties/PropertyFormSteps';
import { supabase } from '@/integrations/supabase/client';
import { fetchProperty, createProperty, updateProperty, fetchProjectsForProperties, fetchBuildingsForProperties } from '@/lib/supabase/properties';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Save, CheckCircle, ChevronLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

const propertyFormSteps = [
  {
    id: 'identification',
    title: 'Identification',
    icon: 'Building',
    fields: ['unit_code', 'property_type', 'floor_number', 'project_id', 'building_id']
  },
  {
    id: 'configuration',
    title: 'Configuration',
    icon: 'Layout',
    fields: ['bedrooms', 'bathrooms', 'internal_area_m2', 'total_rooms', 'wc_count']
  },
  {
    id: 'equipment',
    title: 'Équipements',
    icon: 'Wifi',
    fields: ['appliances_list', 'smart_home_features', 'has_kitchen_appliances', 'has_smart_home']
  },
  {
    id: 'outdoor',
    title: 'Extérieur',
    icon: 'Trees',
    fields: ['balcony_area', 'terrace_area', 'has_balcony', 'has_terrace', 'has_private_garden']
  },
  {
    id: 'financial',
    title: 'Financier',
    icon: 'DollarSign',
    fields: ['price', 'vat_rate', 'golden_visa_eligible', 'deposit_amount']
  },
  {
    id: 'documentation',
    title: 'Documentation',
    icon: 'FileText',
    fields: ['public_description', 'internal_notes', 'title_deed_status']
  }
];

const AdminPropertyForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const queryClient = useQueryClient();
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [saveType, setSaveType] = useState<'draft' | 'publish'>('draft');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState<any[]>([]);

  const currentStep = propertyFormSteps[currentStepIndex];
  
  const form = useForm<any>({
    mode: 'onSubmit',
    defaultValues: {
      // Identification
      unit_number: '',
      property_type: 'apartment',
      floor_number: 1,
      project_id: '',
      building_id: '',
      
      // Configuration
      bedrooms_count: 1,
      bathrooms_count: 1,
      wc_count: 1,
      internal_area: 0,
      covered_verandas: 0,
      uncovered_verandas: 0,
      private_garden_area: 0,
      position_in_floor: '',
      orientation: 'south',
      has_office: false,
      has_maid_room: false,
      has_dressing_room: false,
      has_laundry_room: false,
      has_playroom: false,
      has_wine_cellar: false,
      has_pantry: false,
      
      // Equipment
      kitchen_type: 'modern',
      kitchen_brand: '',
      has_kitchen_appliances: false,
      appliances_list: [],
      hvac_type: 'split',
      heating_type: 'central',
      flooring_type: 'tiles',
      windows_type: 'aluminum',
      doors_type: 'security',
      smart_home_features: [],
      
      // Outdoor
      balcony_count: 0,
      balcony_area: 0,
      terrace_count: 0,
      terrace_area: 0,
      has_private_garden: false,
      has_private_pool: false,
      pool_type: 'private',
      parking_spaces: 0,
      parking_type: 'covered',
      storage_spaces: 0,
      storage_area: 0,
      view_type: [],
      
      // Financial
      price_excluding_vat: 0,
      vat_rate: 5,
      commission_rate: 3,
      original_price: 0,
      deposit_percentage: 10,
      reservation_fee: 0,
      payment_plan_available: false,
      finance_available: false,
      minimum_cash_required: 0,
      annual_property_tax: 0,
      communal_fees_monthly: 0,
      maintenance_fee_monthly: 0,
      
      // Documentation
      public_description: '',
      internal_notes: '',
      title_deed_status: 'ready',
      title_deed_number: '',
      cadastral_reference: '',
      occupancy_certificate: '',
      building_permit_number: '',
      planning_permit_number: '',
      
      // Technical Details
      ceiling_height: 2.7,
      bathroom_fixtures_brand: '',
      energy_rating: 'B',
      energy_certificate_number: '',
      
      // Additional Features
      has_disabled_access: false,
      has_private_elevator: false,
      distance_to_elevator: 0,
      distance_to_stairs: 0,
      entrance_type: 'private',
      facing: ['south'],
      
      // Luxury Features
      has_jacuzzi: false,
      has_sauna: false,
      has_home_cinema: false,
      has_wine_fridge: false,
      has_safe: false,
      has_bbq_area: false,
      has_pergola: false,
      has_outdoor_kitchen: false,
      has_automatic_irrigation: false,
      
      // Technology
      internet_ready: true,
      has_satellite_tv: false,
      has_fiber_optic: false,
      has_electric_shutters: false,
      has_electric_car_charger: false,
      has_central_vacuum: false,
      has_water_softener: false,
      has_solar_panels: false,
      
      // Security
      has_security_door: true,
      security_features: []
    }
  });

  // Fetch projects for dropdown
  const { data: projects } = useQuery({
    queryKey: ['projects-for-properties'],
    queryFn: fetchProjectsForProperties
  });

  // Fetch buildings for dropdown
  const selectedProjectId = form.watch('project_id');
  const { data: buildings } = useQuery({
    queryKey: ['buildings-for-properties', selectedProjectId],
    queryFn: () => fetchBuildingsForProperties(selectedProjectId),
    enabled: !!selectedProjectId
  });

  // Fetch property data for editing
  const { data: property, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => fetchProperty(id!),
    enabled: !!id && isEdit,
    staleTime: 0,
    refetchOnMount: true
  });

  // Load property data into form when editing
  useEffect(() => {
    if (property && isEdit) {
      console.log('📝 Loading property data into form:', property);
      
      // Map database fields correctly to form fields
      const mappedData = {
        // Identification (using exact DB names)
        unit_code: property.unit_code || '',
        property_type: property.property_type || 'apartment',
        floor_number: property.floor_number || 1,
        project_id: property.project_id || '',
        building_id: property.building_id || '',
        
        // Configuration (using exact DB names)
        bedrooms: property.bedrooms || 1,
        bathrooms: property.bathrooms || 1,
        internal_area_m2: property.internal_area_m2 || 0,
        covered_veranda_m2: property.covered_veranda_m2 || 0,
        uncovered_veranda_m2: property.uncovered_veranda_m2 || 0,
        garden_area_m2: property.garden_area_m2 || 0,
        orientation: property.orientation || 'south',
        
        // Equipment (using exact DB names)
        kitchen_type: property.kitchen_type || '',
        property_features: property.property_features || [],
        
        // Outdoor (using exact DB names)
        has_balcony: property.has_balcony || false,
        has_terrace: property.has_terrace || false,
        has_garden: property.has_garden || false,
        has_private_pool: property.has_private_pool || false,
        parking_spaces_count: property.parking_spaces_count || 0,
        storage_area_m2: property.storage_area_m2 || 0,
        roof_terrace_m2: property.roof_terrace_m2 || 0,
        
        // Financial (using exact DB names)
        price: property.price || 0,
        price_per_m2: property.price_per_m2 || 0,
        price_with_vat: property.price_with_vat || 0,
        down_payment_percent: property.down_payment_percent || 10,
        reservation_fee: property.reservation_fee || 0,
        financing_available: property.financing_available || false,
        common_expenses_monthly: property.common_expenses_monthly || 0,
        management_fee_monthly: property.management_fee_monthly || 0,
        golden_visa_eligible: property.golden_visa_eligible || false,
        
        // Documentation (using exact DB names)
        title_deed_status: property.title_deed_status || '',
        title_deed_number: property.title_deed_number || '',
        occupancy_certificate_number: property.occupancy_certificate_number || '',
        building_permit_number: property.building_permit_number || '',
        planning_permit_number: property.planning_permit_number || '',
        
        // Features (using exact DB names)
        has_jacuzzi: property.has_jacuzzi || false,
        has_fireplace: property.has_fireplace || false,
        has_storage_room: property.has_storage_room || false,
        has_maid_room: property.has_maid_room || false,
        has_parking_space: property.has_parking_space || false,
        
        // Status
        status: property.status || 'available',
        furniture_status: property.furniture_status || 'unfurnished'
      };
      
      console.log('📋 Mapped form data:', mappedData);
      form.reset(mappedData);
    }
  }, [property, isEdit, form]);

  // Enhanced submit handler
  const onSubmit = async (data: any) => {
    try {
      console.log('💾 Submitting property data:', data);
      
      // Prepare data for database
      const processedData = {
        ...data,
        // Map form arrays to property_features
        property_features: [
          ...(data.appliances_list || []),
          ...(data.smart_home_features || [])
        ],
        
        // Remove the original form fields that don't exist in DB
        appliances_list: undefined,
        smart_home_features: undefined,
        
        // Map form fields to actual DB columns
        unit_code: data.unit_number || data.unit_code,
        bedrooms_count: data.bedrooms ? Number(data.bedrooms) : 0,
        bathrooms_count: data.bathrooms ? Number(data.bathrooms) : 0,
        internal_area_m2: data.internal_area_m2 ? Number(data.internal_area_m2) : 0,
        floor_number: data.floor_number ? Number(data.floor_number) : null,
        
        // Map boolean fields correctly
        has_parking_space: data.parking_included || false,
        parking_spaces_count: data.parking_spaces ? Number(data.parking_spaces) : 0,
        
        // Financial fields
        price: data.price_excluding_vat ? Number(data.price_excluding_vat) : 0,
        price_with_vat: data.price_excluding_vat ? 
          Number(data.price_excluding_vat) * (1 + (Number(data.vat_rate) || 5) / 100) : 0,
        price_per_m2: data.price_excluding_vat && data.internal_area_m2 ? 
          Number(data.price_excluding_vat) / Number(data.internal_area_m2) : 0,
        
        // Golden Visa eligibility
        golden_visa_eligible: data.price_excluding_vat ? 
          (Number(data.price_excluding_vat) * (1 + (Number(data.vat_rate) || 5) / 100)) >= 300000 : false,
        
        // Outdoor areas
        covered_veranda_m2: data.balcony_area ? Number(data.balcony_area) : 0,
        uncovered_veranda_m2: data.terrace_area ? Number(data.terrace_area) : 0,
        garden_area_m2: data.private_garden_area ? Number(data.private_garden_area) : 0,
        storage_area_m2: data.storage_area ? Number(data.storage_area) : 0,
        
        // Remove fields that don't exist in the actual table
        unit_number: undefined,
        bedrooms: undefined,
        bathrooms: undefined,
        balcony_area: undefined,
        terrace_area: undefined,
        private_garden_area: undefined,
        storage_area: undefined,
        parking_included: undefined,
        parking_spaces: undefined,
        price_excluding_vat: undefined,
        price_including_vat: undefined,
        vat_rate: undefined,
        vat_amount: undefined,
        current_price: undefined,
        original_price: undefined,
        discount_amount: undefined,
        discount_percentage: undefined,
        minimum_investment_met: undefined,
        deposit_amount: undefined,
        deposit_percentage: undefined,
        total_rooms: undefined,
        wc_count: undefined,
        ceiling_height: undefined,
        distance_to_elevator: undefined,
        distance_to_stairs: undefined,
        annual_property_tax: undefined,
        balcony_count: undefined,
        
        // Set proper status
        status: data.status || 'available',
        
        // Set timestamps
        created_at: isEdit ? undefined : new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (isEdit) {
        await updateProperty(id!, processedData);
        toast.success('Propriété mise à jour avec succès');
      } else {
        await createProperty(processedData);
        toast.success('Propriété créée avec succès');
      }

      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      
      navigate('/admin/properties');
    } catch (error: any) {
      console.error('Error saving property:', error);
      toast.error(`Erreur: ${error.message}`);
    }
  };

  const nextStep = () => {
    if (currentStepIndex < propertyFormSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const validatePropertyData = (data: any) => {
    const errors = [];
    if (!data.unit_code) errors.push('Code unité requis');
    if (!data.project_id) errors.push('Projet requis');
    if (!data.building_id) errors.push('Bâtiment requis');
    if (!data.property_type) errors.push('Type de propriété requis');
    return errors;
  };

  const handlePublish = () => {
    const formData = form.getValues();
    const errors = validatePropertyData(formData);
    setValidationErrors(errors);
    
    if (errors.length > 0) {
      setShowConfirmDialog(true);
      return;
    }
    
    setSaveType('publish');
    form.handleSubmit(onSubmit)();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Chargement de la propriété...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex">
      {/* Sidebar - Steps Navigation */}
      <div className="w-80 bg-white border-r border-slate-200 flex-shrink-0">
        <div className="p-6 border-b border-slate-200">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/properties')}
            className="mb-4 -ml-2"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Retour aux propriétés
          </Button>
          <h2 className="text-xl font-semibold">
            {isEdit ? 'Modifier Propriété' : 'Nouvelle Propriété'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Étape {currentStepIndex + 1} sur {propertyFormSteps.length}
          </p>
        </div>
        
        <div className="p-4 space-y-2">
          {propertyFormSteps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setCurrentStepIndex(index)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                index === currentStepIndex
                  ? 'bg-primary text-primary-foreground'
                  : index < currentStepIndex
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'hover:bg-slate-50'
              }`}
            >
              <div className="font-medium">{step.title}</div>
              {index < currentStepIndex && (
                <div className="text-xs mt-1 flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Complété
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{currentStep.title}</h1>
              <p className="text-muted-foreground">
                Remplissez les informations de cette section
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStepIndex === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Précédent
              </Button>
              
              {currentStepIndex < propertyFormSteps.length - 1 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                >
                  Suivant
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setSaveType('draft');
                      form.handleSubmit(onSubmit)();
                    }}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </Button>
                  <Button
                    type="button"
                    onClick={handlePublish}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {isEdit ? 'Mettre à jour' : 'Publier'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <PropertyFormSteps 
                    form={form} 
                    currentStep={currentStep.id}
                    projects={projects}
                    buildings={buildings}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Erreurs de validation détectées</DialogTitle>
            <DialogDescription>
              Les erreurs suivantes ont été détectées. Voulez-vous continuer ?
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <ul className="list-disc list-inside space-y-1 text-sm text-red-600">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={() => {
                setShowConfirmDialog(false);
                setSaveType('publish');
                form.handleSubmit(onSubmit)();
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Continuer malgré les erreurs
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPropertyForm;