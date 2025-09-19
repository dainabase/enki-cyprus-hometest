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
      // Identification - PENTHOUSE COMPLET
      unit_number: 'PH-DELUXE-001',
      property_type: 'penthouse',
      floor_number: 25,
      project_id: '',
      building_id: '',
      
      // Configuration - GRAND PENTHOUSE
      bedrooms: 6,
      bathrooms: 5,
      internal_area_m2: 900,
      total_rooms: 12,
      wc_count: 3,
      has_office: true,
      has_maid_room: true,
      has_playroom: true,
      has_wine_cellar: true,
      has_dressing_room: true,
      has_guest_wc: true,
      
      // Equipment - TOUT ÉQUIPÉ
      appliances_list: [
        'Four', 'Réfrigérateur', 'Hotte aspirante', 'Congélateur', 'Micro-ondes', 
        'Machine à café', 'Lave-vaisselle', 'Plaque de cuisson', 'Cave à vin',
        'Machine à glaçons', 'Four vapeur', 'Tiroir chauffant', 'Lave-linge',
        'Sèche-linge', 'Aspirateur centralisé'
      ],
      smart_home_features: [
        'Thermostat intelligent', 'Système de sécurité', 'Alarme incendie',
        'Caméras surveillance', 'Interphone vidéo', 'Détecteurs fumée',
        'Contrôle éclairage', 'Domotique centralisée', 'Volets automatiques',
        'Système audio intégré', 'Contrôle température', 'Sécurité biométrique'
      ],
      has_kitchen_appliances: true,
      has_smart_home: true,
      has_fireplace: true,
      has_underfloor_heating: true,
      has_alarm_system: true,
      has_video_intercom: true,
      
      // Outdoor - ESPACES EXTÉRIEURS LUXUEUX
      balcony_area: 150,
      terrace_area: 300,
      has_balcony: true,
      has_terrace: true,
      has_private_garden: true,
      has_roof_terrace: true,
      has_private_pool: true,
      private_garden_area: 500,
      
      // Views & Orientation - VUES PANORAMIQUES
      has_sea_view: true,
      has_mountain_view: true,
      has_city_view: true,
      has_garden_view: true,
      has_pool_view: true,
      orientation: 'south',
      view_quality: 'panoramic',
      
      // Parking & Storage - ESPACES DE RANGEMENT
      parking_included: true,
      parking_spaces: 4,
      parking_type: 'covered',
      has_storage_unit: true,
      storage_area: 50,
      
      // Financial - 1.5M EUROS
      price: 0,
      price_excluding_vat: 1500000,
      vat_rate: 5,
      price_including_vat: 1575000,
      price_per_sqm: 1667,
      original_price: 1600000,
      current_price: 1500000,
      discount_amount: 100000,
      discount_percentage: 6.25,
      golden_visa_eligible: true,
      minimum_investment_met: true,
      deposit_amount: 150000,
      deposit_percentage: 10,
      payment_plan_available: true,
      payment_plan_details: {
        "installments": 24,
        "monthly_amount": 56250,
        "down_payment": 150000,
        "final_payment": 1350000
      },
      
      // Status & Availability
      status: 'available',
      is_available: true,
      furniture_status: 'fully_furnished',
      is_furnished: true,
      
      // Documentation - COMPLET
      public_description: 'Penthouse d\'exception de 900m² avec terrasses panoramiques, piscine privée et finitions de prestige. Vue mer et montagne à 360°. Équipements haut de gamme et domotique intégrée.',
      internal_notes: 'Propriété phare du projet - Client VIP uniquement. Visite sur RDV exclusivement. Négociation possible pour achat comptant.',
      title_deed_status: 'available',
      title_deed_number: 'TD-2024-PH-001',
      cadastral_reference: 'CAD-LIM-2024-PH-001',
      occupancy_certificate: 'OCC-2024-PH-DELUXE',
      building_permit_number: 'BP-2023-TOWER-ELITE',
      planning_permit_number: 'PP-2022-PENTHOUSE-001',
      
      // Technical Details - PRESTIGE
      ceiling_height: 4.2,
      flooring_type: 'marble',
      kitchen_type: 'luxury',
      bathroom_fixtures_brand: 'Villeroy & Boch',
      windows_type: 'triple_glazing',
      doors_type: 'smart_security',
      heating_type: 'underfloor',
      hvac_type: 'central_vrf',
      energy_rating: 'A+',
      energy_certificate_number: 'ENG-2024-PH-AAA-001',
      
      // Additional Features - TOUT INCLUS
      has_disabled_access: true,
      has_private_elevator: true,
      distance_to_elevator: 0,
      distance_to_stairs: 5,
      position_in_floor: 'entire_floor',
      entrance_type: 'private_elevator',
      facing: ['north', 'south', 'east', 'west'],
      
      // Luxury Features - ULTRA LUXE
      has_jacuzzi: true,
      has_sauna: true,
      has_home_cinema: true,
      has_wine_fridge: true,
      has_safe: true,
      has_bbq_area: true,
      has_pergola: true,
      has_outdoor_kitchen: true,
      has_automatic_irrigation: true,
      
      // Technology - DERNIÈRES TECHNOLOGIES
      internet_ready: true,
      has_satellite_tv: true,
      has_fiber_optic: true,
      has_electric_shutters: true,
      has_electric_car_charger: true,
      has_central_vacuum: true,
      has_water_softener: true,
      has_solar_panels: true,
      
      // Security - SÉCURITÉ MAXIMALE
      has_security_door: true,
      security_features: [
        'Caméras 360°', 'Détecteurs mouvement', 'Alarme périmétrique',
        'Contrôle accès biométrique', 'Surveillance 24h/24', 'Safe room',
        'Détecteurs bris de glace', 'Système anti-intrusion'
      ]
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