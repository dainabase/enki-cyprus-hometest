import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import { ArrowLeft, ArrowRight, Save, CircleCheck as CheckCircle, ChevronLeft, Building } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { convertLegacyAmenities, convertPhotosToCategorized, CategorizedPhoto } from '@/utils/amenitiesMapper';

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
  
  const form = useForm<any>({
    mode: 'onSubmit',
    defaultValues: {
      // Basics
      title: '',
      project_code: '',
      developer_id: '',
      property_category: 'residential',
      property_sub_type: ['apartment'],
      project_phase: 'off-plan',
      launch_month: '',
      completion_month: '',
      exclusive_commercialization: false,
      description: '',
      detailed_description: '',
      
      // Location
      full_address: '',
      street_address: '', // ✅ AJOUTÉ
      postal_code: '', // ✅ AJOUTÉ
      district: '', // ✅ AJOUTÉ
      city: '',
      region: '',
      neighborhood: '',
      neighborhood_description: '',
      cyprus_zone: 'limassol',
      gps_latitude: null,
      gps_longitude: null,
      proximity_sea_km: null,
      proximity_airport_km: null,
      proximity_city_center_km: null,
      proximity_highway_km: null,
      
      // Specifications - FIXED: Empty string for Select fields instead of null
      land_area_m2: null,
      built_area_m2: null,
      total_units: null,
      units_available: null,
      parking_spaces: null,
      energy_efficiency_class: '', // FIX: Changed from null to ''
      construction_year: null,
      building_certification: '',
      maintenance_fees_yearly: null,
      property_tax_yearly: null,
      hoa_fees_monthly: null,
      internet_speed_mbps: null,
      pet_policy: '', // FIX: Changed from null to ''
      
      // Pricing
      price_from: null,
      price_to: null,
      price_per_m2: null,
      vat_rate: 5,
      vat_included: false,
      golden_visa_eligible: false,
      roi_estimate_percent: null,
      rental_yield_percent: null,
      financing_available: false,
      
      // Media - IMPORTANT: Initialized with empty array
      photos: [] as CategorizedPhoto[],
      photo_gallery_urls: [],
      video_tour_urls: [],
      virtual_tour_url: '',
      project_presentation_url: '',
      youtube_tour_url: '',
      vimeo_tour_url: '',
      drone_footage_urls: [],
      model_3d_urls: [],
      
      // Features & Amenities
      features: [],
      amenities: [],
      surrounding_amenities: [],
      
      // Marketing
      project_narrative: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: [],
      marketing_highlights: [],
      target_audience: [],
      featured_project: false,
      
      // Status
      status_project: 'disponible',
      statut_commercial: 'pre_commercialisation',
      
      // Buildings
      buildings: []
    }
  });

  // Fetch project data for editing
  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProject(id!),
    enabled: !!id && isEdit,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: true
  });

  // Load project data into form when editing
  useEffect(() => {
    const loadProjectData = async () => {
      if (!project || !isEdit) return;
      
      console.log('🔄 Loading project data:', project);
      
      try {
        // Charger les bâtiments
        const { data: buildingsData } = await supabase
          .from('buildings')
          .select('*')
          .eq('project_id', id)
          .order('display_order', { ascending: true });
        
        console.log('🏢 Buildings loaded:', buildingsData);
        
        // Cast en any pour éviter les erreurs TypeScript
        const projectData = project as any;
        
        // Convertir les amenities legacy en codes modernes
        const convertedAmenities = convertLegacyAmenities(projectData.amenities || []);
        console.log('🔄 Amenities converted:', { 
          original: projectData.amenities, 
          converted: convertedAmenities 
        });
        
        // Conversion sécurisée des photos vers le nouveau format
        console.log('📸 Converting photos from:', {
          photos: projectData.photos,
          categorized_photos: projectData.categorized_photos,
          type_photos: typeof projectData.photos,
          type_categorized: typeof projectData.categorized_photos
        });
        
        // Utiliser la fonction de conversion améliorée
        const convertedPhotos = convertPhotosToCategorized(
          projectData.categorized_photos || projectData.photos || []
        );
        
        console.log('📸 Photos converted to:', convertedPhotos);
        
        // Préparer TOUTES les données du formulaire
        const formData = {
          // BASICS
          title: projectData.title || '',
          subtitle: projectData.subtitle || '',
          project_code: projectData.project_code || '',
          developer_id: projectData.developer_id || '',
          property_category: projectData.property_category || 'residential',
          property_sub_type: projectData.property_sub_type || ['apartment'],
          project_phase: projectData.project_phase || 'off-plan',
          statut_commercial: projectData.statut_commercial || 'pre_commercialisation',
          launch_month: projectData.launch_month || '',
          completion_month: projectData.completion_month || '',
          exclusive_commercialization: projectData.exclusive_commercialization || false,
          description: projectData.description || '',
          detailed_description: projectData.detailed_description || '',
          unique_selling_points: projectData.unique_selling_points || [],
          
          // LOCATION
          full_address: projectData.full_address || '',
          street_address: projectData.street_address || '', // ✅ AJOUTÉ
          postal_code: projectData.postal_code || '', // ✅ AJOUTÉ
          district: projectData.district || '', // ✅ AJOUTÉ
          city: projectData.city || '',
          region: projectData.region || '',
          neighborhood: projectData.neighborhood || '',
          neighborhood_description: projectData.neighborhood_description || '',
          cyprus_zone: projectData.cyprus_zone || 'limassol',
          gps_latitude: projectData.gps_latitude || null,
          gps_longitude: projectData.gps_longitude || null,
          proximity_sea_km: projectData.proximity_sea_km || null,
          proximity_airport_km: projectData.proximity_airport_km || null,
          proximity_city_center_km: projectData.proximity_city_center_km || null,
          proximity_highway_km: projectData.proximity_highway_km || null,
          
          // SPECIFICATIONS - FIXED: Empty string for Select fields
          land_area_m2: projectData.land_area_m2 ? Number(projectData.land_area_m2) : null,
          built_area_m2: projectData.built_area_m2 ? Number(projectData.built_area_m2) : null,
          total_units: projectData.total_units ? Number(projectData.total_units) : null,
          units_available: projectData.units_available ? Number(projectData.units_available) : null,
          parking_spaces: projectData.parking_spaces ? Number(projectData.parking_spaces) : null,
          energy_efficiency_class: projectData.energy_efficiency_class || '', // FIX: Changed from null
          construction_year: projectData.construction_year ? Number(projectData.construction_year) : null,
          building_certification: projectData.building_certification || '',
          maintenance_fees_yearly: projectData.maintenance_fees_yearly ? Number(projectData.maintenance_fees_yearly) : null,
          property_tax_yearly: projectData.property_tax_yearly ? Number(projectData.property_tax_yearly) : null,
          hoa_fees_monthly: projectData.hoa_fees_monthly ? Number(projectData.hoa_fees_monthly) : null,
          internet_speed_mbps: projectData.internet_speed_mbps ? Number(projectData.internet_speed_mbps) : null,
          pet_policy: projectData.pet_policy || '', // FIX: Changed from null
          seismic_rating: projectData.seismic_rating || '', // FIX: Changed from null
          renovation_year: projectData.renovation_year ? Number(projectData.renovation_year) : null,
          architect_license_number: projectData.architect_license_number || '',
          units_sold: projectData.units_sold ? Number(projectData.units_sold) : null,
          bedrooms_range_min: projectData.bedrooms_range_min ? Number(projectData.bedrooms_range_min) : null,
          bedrooms_range_max: projectData.bedrooms_range_max ? Number(projectData.bedrooms_range_max) : null,
          square_meters_min: projectData.square_meters_min ? Number(projectData.square_meters_min) : null,
          square_meters_max: projectData.square_meters_max ? Number(projectData.square_meters_max) : null,
          smoking_policy: projectData.smoking_policy || '', // FIX: Changed from null
          
          // PRICING
          price_from: projectData.price_from ? Number(projectData.price_from) : null,
          price_to: projectData.price_to ? Number(projectData.price_to) : null,
          price_per_m2: projectData.price_per_m2 ? Number(projectData.price_per_m2) : null,
          vat_rate: projectData.vat_rate ? Number(projectData.vat_rate) : 5,
          vat_included: projectData.vat_included || false,
          golden_visa_eligible: projectData.golden_visa_eligible || false,
          roi_estimate_percent: projectData.roi_estimate_percent ? Number(projectData.roi_estimate_percent) : null,
          rental_yield_percent: projectData.rental_yield_percent ? Number(projectData.rental_yield_percent) : null,
          financing_available: projectData.financing_available || false,
          pricing_strategy_notes: projectData.pricing_strategy_notes || '',
          deposit_terms: projectData.deposit_terms || '',
          cancellation_policy: projectData.cancellation_policy || '',
          price_list: projectData.price_list || [],
          special_offers: projectData.special_offers || [],
          bank_partners: projectData.bank_partners || [],
          investment_highlights: projectData.investment_highlights || [],
          construction_warranty_details: projectData.construction_warranty_details || '',
          property_management_fee: projectData.property_management_fee ? Number(projectData.property_management_fee) : null,
          furniture_package_description: projectData.furniture_package_description || '',
          furniture_package_price: projectData.furniture_package_price ? Number(projectData.furniture_package_price) : null,
          furniture_package_available: projectData.furniture_package_available || false,
          payment_plans: projectData.payment_plans || [],
          plot_sizes_m2: projectData.plot_sizes_m2 || [],
          pool_maintenance_fee: projectData.pool_maintenance_fee ? Number(projectData.pool_maintenance_fee) : null,
          security_service_fee: projectData.security_service_fee ? Number(projectData.security_service_fee) : null,
          garden_maintenance_fee: projectData.garden_maintenance_fee ? Number(projectData.garden_maintenance_fee) : null,
          building_insurance: projectData.building_insurance ? Number(projectData.building_insurance) : null,
          financing_options: projectData.financing_options || {},
          payment_plan: projectData.payment_plan || {},
          incentives: projectData.incentives || [],
          transfer_fees_included: projectData.transfer_fees_included || false,
          rental_management_available: projectData.rental_management_available || false,
          rental_pool_option: projectData.rental_pool_option || false,
          guaranteed_rental_return: projectData.guaranteed_rental_return ? Number(projectData.guaranteed_rental_return) : null,
          concierge_service: projectData.concierge_service || false,
          property_management_company: projectData.property_management_company || '',
          early_bird_discount: projectData.early_bird_discount ? Number(projectData.early_bird_discount) : null,
          bulk_purchase_discount: projectData.bulk_purchase_discount ? Number(projectData.bulk_purchase_discount) : null,
          discount_percentage: projectData.discount_percentage ? Number(projectData.discount_percentage) : null,
          discount_valid_until: projectData.discount_valid_until || null,
          
          // CONSTRUCTION
          finishing_level: projectData.finishing_level || '', // FIX: Changed from null
          architect_name: projectData.architect_name || '',
          builder_name: projectData.builder_name || '',
          design_style: projectData.design_style || '',
          construction_materials: projectData.construction_materials || [],
          construction_start: projectData.construction_start || '',
          completion_date: projectData.completion_date || '',
          expected_completion: projectData.expected_completion || '',
          launch_date: projectData.launch_date || '',
          warranty_years: projectData.warranty_years ? Number(projectData.warranty_years) : null,
          after_sales_service: projectData.after_sales_service || '',
          
          // LEGAL & COMPLIANCE
          permits_obtained: projectData.permits_obtained || [],
          compliance_certifications: projectData.compliance_certifications || [],
          planning_permit_number: projectData.planning_permit_number || '',
          building_permit_number: projectData.building_permit_number || '',
          
          // UTILITIES & SERVICES
          gas_connection_available: projectData.gas_connection_available || false,
          fiber_optic_available: projectData.fiber_optic_available || false,
          
          // BUILDINGS
          buildings: buildingsData || [],
          
          // MEDIA - Using the converted photos
          photos: convertedPhotos,
          photo_gallery_urls: projectData.photo_gallery_urls || [],
          video_tour_urls: projectData.video_tour_urls || [],
          virtual_tour_url: projectData.virtual_tour_url || '',
          master_plan_url: projectData.master_plan_url || '',
          brochure_url: projectData.brochure_url || '',
          project_presentation_url: projectData.project_presentation_url || '',
          youtube_tour_url: projectData.youtube_tour_url || '',
          vimeo_tour_url: projectData.vimeo_tour_url || '',
          vr_tour_url: projectData.vr_tour_url || '',
          ar_experience_url: projectData.ar_experience_url || '',
          drone_footage_urls: projectData.drone_footage_urls || [],
          model_3d_urls: projectData.model_3d_urls || [],
          video_tour_url: projectData.video_tour_url || '',
          virtual_tour_3d_url: projectData.virtual_tour_3d_url || '',
          drone_footage_url: projectData.drone_footage_url || '',
          bim_model_url: projectData.bim_model_url || '',
          interactive_map_url: projectData.interactive_map_url || '',
          site_plan_url: projectData.site_plan_url || '',
          brochure_pdf: projectData.brochure_pdf || '',
          photo_count: projectData.photo_count || 0,
          categorized_photos: projectData.categorized_photos || {},
          
          // AMENITIES (convertis)
          amenities: convertedAmenities,
          surrounding_amenities: projectData.surrounding_amenities || [],
          
          // AMENITIES BOOLEAN
          has_pool: projectData.has_pool || false,
          has_gym: projectData.has_gym || false,
          has_spa: projectData.has_spa || false,
          has_playground: projectData.has_playground || false,
          has_garden: projectData.has_garden || false,
          has_security_system: projectData.has_security_system || false,
          has_cctv: projectData.has_cctv || false,
          has_concierge: projectData.has_concierge || false,
          has_generator: projectData.has_generator || false,
          has_solar_panels: projectData.has_solar_panels || false,
          has_parking: projectData.has_parking || false,
          parking_type: projectData.parking_type || '', // FIX: Changed from null
          has_security_24_7: projectData.has_security_24_7 || false,
          has_tennis_court: projectData.has_tennis_court || false,
          club_house: projectData.club_house || false,
          restaurant: projectData.restaurant || false,
          cafe: projectData.cafe || false,
          mini_market: projectData.mini_market || false,
          business_center: projectData.business_center || false,
          kids_club: projectData.kids_club || false,
          beach_access: projectData.beach_access || false,
          marina_access: projectData.marina_access || false,
          golf_course: projectData.golf_course || false,
          shuttle_service: projectData.shuttle_service || false,
          sports_facilities: projectData.sports_facilities || false,
          wellness_center: projectData.wellness_center || false,
          coworking_space: projectData.coworking_space || false,
          
          // AMENITIES JSONB
          security_features: projectData.security_features || {},
          wellness_facilities: projectData.wellness_facilities || {},
          outdoor_facilities: projectData.outdoor_facilities || {},
          lifestyle_amenities: projectData.lifestyle_amenities || [],
          community_features: projectData.community_features || [],
          seasonal_features: projectData.seasonal_features || [],
          smart_home_features: projectData.smart_home_features || [],
          accessibility_features: projectData.accessibility_features || [],
          
          // MARKETING & SEO
          project_narrative: projectData.project_narrative || '',
          meta_title: projectData.meta_title || '',
          meta_description: projectData.meta_description || '',
          meta_keywords: projectData.meta_keywords || [],
          marketing_highlights: projectData.marketing_highlights || [],
          target_audience: projectData.target_audience || [],
          url_slug: projectData.url_slug || '',
          og_image_url: projectData.og_image_url || '',
          featured_project: projectData.featured_project || false,
          construction_phase: projectData.construction_phase || 'planned',
          schema_markup: projectData.schema_markup || null,
          last_price_update: projectData.last_price_update || null,
          featured_until: projectData.featured_until || null,
          show_on_website: projectData.show_on_website !== false,
          hot_deal: projectData.hot_deal || false,
          featured_property: projectData.featured_property || false,
          
          // ANALYTICS
          view_count: projectData.view_count || 0,
          inquiry_count: projectData.inquiry_count || 0,
          favorite_count: projectData.favorite_count || 0,
          social_proof_stats: projectData.social_proof_stats || {},
          
          // AI
          ai_chatbot_enabled: projectData.ai_chatbot_enabled || false,
          ai_description: projectData.ai_description || '',
          ai_generated_content: projectData.ai_generated_content || {},
          ai_content_disclosure: projectData.ai_content_disclosure || '',
          ai_generated_at: projectData.ai_generated_at || null,
          
          // SUSTAINABILITY
          solar_panels_installed: projectData.solar_panels_installed || false,
          solar_capacity_kw: projectData.solar_capacity_kw ? Number(projectData.solar_capacity_kw) : null,
          photovoltaic_system: projectData.photovoltaic_system || false,
          geothermal_heating: projectData.geothermal_heating || false,
          green_building_certification: projectData.green_building_certification || '',
          ev_charging_stations: projectData.ev_charging_stations ? Number(projectData.ev_charging_stations) : 0,
          ev_charging_type: projectData.ev_charging_type || '', // FIX: Changed from null
          smart_grid_ready: projectData.smart_grid_ready || false,
          sustainability_certifications: projectData.sustainability_certifications || [],
          
          // PROJECT STATUS
          project_status: projectData.project_status || '',
          sold_percentage: projectData.sold_percentage ? Number(projectData.sold_percentage) : null,
          reserved_percentage: projectData.reserved_percentage ? Number(projectData.reserved_percentage) : null,
          available_units: projectData.available_units ? Number(projectData.available_units) : null,
          phase_current: projectData.phase_current ? Number(projectData.phase_current) : null,
          total_phases: projectData.total_phases ? Number(projectData.total_phases) : null,
          
          // STATUS
          status: projectData.status || 'active'
        };
        
        console.log('📝 Form data prepared:', formData);
        
        // Reset le formulaire avec les données
        form.reset(formData);
        
        // Forcer la mise à jour
        form.trigger();
        
        console.log('✅ Form updated successfully');
        
      } catch (error) {
        console.error('❌ Error loading data:', error);
        toast.error('Erreur lors du chargement des données');
      }
    };
    
    loadProjectData();
  }, [project, isEdit, form, id]);

  // Enhanced submit handler
  const onSubmit = async (data: any) => {
    try {
      console.log('📤 Submitting form data:', data);
      console.log('📸 Photos in form data:', {
        photosCount: data.photos?.length,
        photos: data.photos,
        firstPhoto: data.photos?.[0]
      });
      
      // Préparer les données pour la DB
      const dbData: any = {
        ...data
      };
      
      // Supprimer les champs qui n'existent pas dans la DB
      delete dbData.buildings; // Géré séparément
      delete dbData.metaverse_preview_url; // Champ supprimé de la DB
      
      // Convertir les chaînes vides en NULL pour les champs avec contraintes CHECK
      if (dbData.energy_efficiency_class === '') dbData.energy_efficiency_class = null;
      if (dbData.construction_phase === '') dbData.construction_phase = null;
      if (dbData.finishing_level === '') dbData.finishing_level = null;
      if (dbData.pet_policy === '') dbData.pet_policy = null;
      if (dbData.smoking_policy === '') dbData.smoking_policy = null;
      if (dbData.seismic_rating === '') dbData.seismic_rating = null;
      if (dbData.parking_type === '') dbData.parking_type = null;
      if (dbData.ev_charging_type === '') dbData.ev_charging_type = null;
      
      // Nettoyer les objets mal formés (cas où le formulaire crée des objets {_type, value})
      const cleanObjectFields = [
        'project_status', 'gas_connection_available', 'fiber_optic_available',
        'pool_maintenance_fee', 'security_service_fee', 'garden_maintenance_fee'
      ];
      
      cleanObjectFields.forEach(field => {
        if (dbData[field] && typeof dbData[field] === 'object' && '_type' in dbData[field]) {
          // Si c'est un objet avec _type et value, on prend la value
          const value = dbData[field].value;
          dbData[field] = (value === '' || value === 'undefined') ? null : value;
        }
      });
      
      // Convertir les nombres
      if (dbData.total_units) dbData.total_units = Number(dbData.total_units);
      if (dbData.units_available) dbData.units_available = Number(dbData.units_available);
      if (dbData.price_from) dbData.price_from = Number(dbData.price_from);
      if (dbData.price_to) dbData.price_to = Number(dbData.price_to);
      if (dbData.vat_rate) dbData.vat_rate = Number(dbData.vat_rate);
      
      // Assurer que les amenities sont au format code
      if (dbData.amenities && Array.isArray(dbData.amenities)) {
        dbData.amenities = dbData.amenities.filter(Boolean);
      }
      
      // 🔧 FIX CRITIQUE: Validation et logging des photos
      if (dbData.photos && Array.isArray(dbData.photos)) {
        dbData.photos = dbData.photos.filter((photo: any) => photo && photo.url);
        console.log('💾 AdminProjectForm onSubmit: Photos to save', {
          photosCount: dbData.photos.length,
          photos: dbData.photos,
          firstPhotoUrl: dbData.photos[0]?.url,
          allCategories: dbData.photos.map((p: any) => p.category)
        });
      } else {
        console.warn('⚠️ No photos to save or invalid photos array:', dbData.photos);
        dbData.photos = [];
      }
      
      // ⚠️ IMPORTANT: Supprimer categorized_photos (obsolète) pour éviter les conflits
      // Le champ photos est la seule source de vérité pour les images
      dbData.categorized_photos = null;
      
      // Convertir correctement les champs JSONB qui étaient des arrays
      if (dbData.meta_keywords && Array.isArray(dbData.meta_keywords)) {
        dbData.meta_keywords = dbData.meta_keywords.join(',');
      }
      
      if (dbData.target_audience && Array.isArray(dbData.target_audience)) {
        dbData.target_audience = dbData.target_audience.join(',');
      }
      
      // Supprimer les anciens champs SEO s'ils existent
      delete dbData.seo_title;
      delete dbData.seo_description;
      delete dbData.seo_keywords;
      delete dbData.project_slug;
      
      // Renommer les champs media si nécessaire
      if (dbData.master_plan_pdf) {
        dbData.master_plan_url = dbData.master_plan_pdf;
        delete dbData.master_plan_pdf;
      }
      
      if (dbData.brochure_pdf) {
        dbData.brochure_url = dbData.brochure_pdf;
        delete dbData.brochure_pdf;
      }
      
      console.log('💾 Data prepared for DB:', dbData);
      console.log('💾 Final photos to save:', {
        count: dbData.photos?.length,
        photos: dbData.photos
      });
      
      if (isEdit) {
        console.log('⏫ Updating project with ID:', id);
        const { data: updateResult, error } = await supabase
          .from('projects')
          .update(dbData)
          .eq('id', id)
          .select()
          .single();
        
        if (error) {
          console.error('❌ Update error:', error);
          throw error;
        }
        
        console.log('✅ Update successful:', updateResult);
        toast.success('Projet mis à jour avec succès');
        
        // Invalider et recharger
        await queryClient.invalidateQueries({ queryKey: ['project', id] });
        
      } else {
        // Création...
        const { data: insertData, error } = await supabase
          .from('projects')
          .insert([dbData])
          .select();
          
        if (error) {
          console.error('❌ Insert error:', error);
          throw error;
        }
        
        console.log('✅ Insert successful:', insertData);
        toast.success('Projet créé avec succès');
        
        // Rediriger vers le dashboard du projet nouvellement créé
        const projectId = insertData[0]?.id;
        if (projectId) {
          navigate(`/admin/projects/${projectId}/dashboard`);
        } else {
      navigate('/admin/projects');
      toast.success('Projet créé ! Vous pouvez maintenant ajouter des bâtiments depuis la section Bâtiments.');
        }
      }
    } catch (error: any) {
      console.error('❌ Save error:', error);
      toast.error(error.message || 'Erreur lors de la sauvegarde');
    }
  };

  const refreshFormData = async () => {
    if (isEdit && id) {
      try {
        console.log('🔄 Refreshing project data');
        const freshProject = await fetchProject(id);
        if (freshProject) {
          console.log('📊 Fresh data retrieved:', freshProject);
          
          // Récupérer les valeurs actuelles du formulaire
          const currentFormValues = form.getValues();
          
          // Convertir les amenities si nécessaire
          const convertedAmenities = convertLegacyAmenities((freshProject as any).amenities || []);
          
          // Convertir les photos au bon format
          const convertedPhotos = convertPhotosToCategorized(
            (freshProject as any).categorized_photos || (freshProject as any).photos || []
          );
          
          // Remettre à jour le formulaire avec les données fraîches de la base
          form.reset({
            ...currentFormValues,
            total_units: (freshProject as any).total_units ? Number((freshProject as any).total_units) : null,
            units_available: (freshProject as any).units_available ? Number((freshProject as any).units_available) : null,
            roi_estimate_percent: (freshProject as any).roi_estimate_percent ? Number((freshProject as any).roi_estimate_percent) : null,
            rental_yield_percent: (freshProject as any).rental_yield_percent ? Number((freshProject as any).rental_yield_percent) : null,
            amenities: convertedAmenities,
            photos: convertedPhotos
          });
          
          console.log('✅ Form refreshed with fresh data');
        }
      } catch (error) {
        console.error('❌ Error refreshing data:', error);
      }
    }
  };

  const nextStep = async () => {
    if (currentStepIndex < projectFormSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      // ❌ REMOVED: refreshFormData() can overwrite unsaved changes
      // await refreshFormData();
    }
  };

  const prevStep = async () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      // ❌ REMOVED: refreshFormData() can overwrite unsaved changes
      // await refreshFormData();
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
      <div className="h-32 bg-white border-b-2 border-slate-200 sticky top-0 z-10">
        <div className="h-full px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/admin/projects')}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Retour projets
            </Button>
            <span className="text-slate-400">|</span>
            <h1 className="text-2xl font-bold text-slate-900">
              {isEdit ? 'Modifier le projet' : 'Créer un nouveau projet'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {isEdit && id && (
              <Button 
                variant="outline"
                onClick={() => navigate(`/admin/projects/${id}/dashboard`)}
              >
                <Building className="w-4 h-4 mr-2" />
                Tableau de bord
              </Button>
            )}
            <a href="/admin" className="text-base text-slate-600 hover:text-slate-900 transition-colors">
              Retour au dashboard
            </a>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar fixe */}
        <div className="w-80 bg-white border-r-2 border-slate-200 sticky top-[128px] h-[calc(100vh-128px)] overflow-y-auto">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Étapes du projet</h2>
            <nav className="space-y-2">
              {projectFormSteps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={async () => {
                    setCurrentStepIndex(index);
                    // ❌ REMOVED: refreshFormData() écrase les changements non sauvegardés
                    // await refreshFormData();
                  }}
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

        {/* Contenu principal */}
        <div className="flex-1 p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div key={formKey}>
                <ProjectFormSteps 
                  form={form} 
                  currentStep={currentStep.id}
                  projectId={id}
                />
              </div>

              {/* Navigation controls */}
              <div className="flex justify-between items-center pt-8 border-t">
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

                <div className="flex items-center gap-4">
                  {currentStepIndex === projectFormSteps.length - 1 ? (
                    <Button type="submit" className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      {isEdit ? 'Mettre à jour' : 'Créer le projet'}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        await nextStep();
                      }}
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

      {/* Dialog de confirmation */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la publication</DialogTitle>
            <DialogDescription>
              Vous êtes sur le point de publier ce projet. Il sera visible par tous les utilisateurs.
            </DialogDescription>
          </DialogHeader>
          
          {validationErrors.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-destructive">Erreurs à corriger :</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error.message}</li>
                ))}
              </ul>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Annuler
            </Button>
            <Button 
              onClick={() => {
                setSaveType('publish');
                form.handleSubmit(onSubmit)();
                setShowConfirmDialog(false);
              }}
              disabled={validationErrors.length > 0}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Publier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProjectForm;
