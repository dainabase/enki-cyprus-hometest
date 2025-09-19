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
      bedrooms: 1,
      bathrooms: 1,
      internal_area_m2: 0,
      total_rooms: 1,
      wc_count: 1,
      has_office: false,
      has_maid_room: false,
      has_playroom: false,
      has_wine_cellar: false,
      has_dressing_room: false,
      has_guest_wc: false,
      
      // Equipment
      appliances_list: [],
      smart_home_features: [],
      has_kitchen_appliances: false,
      has_smart_home: false,
      has_fireplace: false,
      has_underfloor_heating: false,
      has_alarm_system: false,
      has_video_intercom: false,
      
      // Outdoor
      balcony_area: 0,
      terrace_area: 0,
      has_balcony: false,
      has_terrace: false,
      has_private_garden: false,
      has_roof_terrace: false,
      has_private_pool: false,
      private_garden_area: 0,
      
      // Views & Orientation
      has_sea_view: false,
      has_mountain_view: false,
      has_city_view: false,
      has_garden_view: false,
      has_pool_view: false,
      orientation: 'south',
      view_quality: 'partial',
      
      // Parking & Storage
      parking_included: false,
      parking_spaces: 0,
      parking_type: 'covered',
      has_storage_unit: false,
      storage_area: 0,
      
      // Financial
      price: 0,
      price_excluding_vat: 0,
      vat_rate: 5,
      price_including_vat: 0,
      price_per_sqm: 0,
      original_price: 0,
      current_price: 0,
      discount_amount: 0,
      discount_percentage: 0,
      golden_visa_eligible: false,
      minimum_investment_met: false,
      deposit_amount: 0,
      deposit_percentage: 10,
      payment_plan_available: false,
      payment_plan_details: {},
      
      // Status & Availability
      status: 'available',
      is_available: true,
      furniture_status: 'unfurnished',
      is_furnished: false,
      
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
      flooring_type: 'tiles',
      kitchen_type: 'modern',
      bathroom_fixtures_brand: '',
      windows_type: 'aluminum',
      doors_type: 'security',
      heating_type: 'central',
      hvac_type: 'split',
      energy_rating: 'B',
      energy_certificate_number: '',
      
      // Additional Features
      has_disabled_access: false,
      has_private_elevator: false,
      distance_to_elevator: 0,
      distance_to_stairs: 0,
      position_in_floor: 'corner',
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
      // Reset form with simple property mapping
      form.reset({
        ...property,
        // Ensure basic fields exist with fallbacks
        unit_number: property.unit_code || '',
        property_type: property.property_type || 'apartment',
        project_id: property.project_id || '',
        building_id: property.building_id || '',
        bedrooms: property.bedrooms || 1,
        bathrooms: property.bathrooms || 1,
        internal_area_m2: property.internal_area_m2 || 0,
        price: property.price || 0,
        status: property.status || 'available'
      });
    }
  }, [property, isEdit, form]);

  // Enhanced submit handler
  const onSubmit = async (data: any) => {
    try {
      console.log('💾 Submitting property data:', data);
      
      // Prepare data for database
      const processedData = {
        ...data,
        // Ensure numeric fields are properly converted
        bedrooms: data.bedrooms ? Number(data.bedrooms) : 0,
        bathrooms: data.bathrooms ? Number(data.bathrooms) : 0,
        internal_area_m2: data.internal_area_m2 ? Number(data.internal_area_m2) : 0,
        balcony_area: data.balcony_area ? Number(data.balcony_area) : 0,
        terrace_area: data.terrace_area ? Number(data.terrace_area) : 0,
        private_garden_area: data.private_garden_area ? Number(data.private_garden_area) : 0,
        storage_area: data.storage_area ? Number(data.storage_area) : 0,
        price_excluding_vat: data.price_excluding_vat ? Number(data.price_excluding_vat) : 0,
        vat_rate: data.vat_rate ? Number(data.vat_rate) : 5,
        deposit_amount: data.deposit_amount ? Number(data.deposit_amount) : 0,
        deposit_percentage: data.deposit_percentage ? Number(data.deposit_percentage) : 10,
        ceiling_height: data.ceiling_height ? Number(data.ceiling_height) : 2.7,
        parking_spaces: data.parking_spaces ? Number(data.parking_spaces) : 0,
        distance_to_elevator: data.distance_to_elevator ? Number(data.distance_to_elevator) : 0,
        distance_to_stairs: data.distance_to_stairs ? Number(data.distance_to_stairs) : 0,
        
        // Calculate derived fields
        price_including_vat: (data.price_excluding_vat || 0) * (1 + (data.vat_rate || 5) / 100),
        price_per_sqm: data.price_excluding_vat && data.internal_area_m2 ? 
          data.price_excluding_vat / data.internal_area_m2 : 0,
        golden_visa_eligible: (data.price_excluding_vat || 0) * (1 + (data.vat_rate || 5) / 100) >= 300000,
        
        // Set current price if not set
        current_price: data.current_price || data.price_excluding_vat,
        
        // Calculate total rooms
        total_rooms: (data.bedrooms || 0) + 
                    (data.has_office ? 1 : 0) + 
                    (data.has_maid_room ? 1 : 0) + 
                    (data.has_playroom ? 1 : 0) + 
                    (data.has_wine_cellar ? 1 : 0),
        
        // Ensure boolean fields
        is_available: data.status === 'available',
        is_furnished: data.furniture_status === 'furnished',
        minimum_investment_met: (data.price_excluding_vat || 0) * (1 + (data.vat_rate || 5) / 100) >= 300000,
        
        // Set status and metadata
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