import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/layout/Layout';
import { ProjectFormSteps } from '@/components/admin/projects/ProjectFormSteps';
import { DocumentManager } from '@/components/admin/projects/DocumentManager';
import { projectSchema, ProjectFormData, projectFormSteps } from '@/schemas/projectSchema';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useDebounceCallback } from '@/hooks/useDebounceCallback';
import { ArrowLeft, ArrowRight, Save, Eye, CheckCircle, FileText, Brain, Building, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { extractPrefilledData, PrefilledFormData } from '@/lib/ai-import/mapper';
import * as LucideIcons from 'lucide-react';

export const AdminProjectForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEdit = Boolean(id);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [saveType, setSaveType] = useState<'draft' | 'publish'>('draft');
  const [prefilledData, setPrefilledData] = useState<PrefilledFormData>({});
const [showPrefilledBanner, setShowPrefilledBanner] = useState(false);

  // Draft autosave state
  const [draftId, setDraftId] = useState<string | null>(null);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const currentStep = projectFormSteps[currentStepIndex];

  // Extract prefilled data from URL params
  useEffect(() => {
    if (isEdit) return; // Do not override existing data when editing
    const extracted = extractPrefilledData(searchParams);
    if (Object.keys(extracted).length > 0) {
      setPrefilledData(extracted);
      setShowPrefilledBanner(true);
      
      // Pre-fill form with AI data
      Object.entries(extracted).forEach(([fieldName, fieldData]) => {
        form.setValue(fieldName as keyof ProjectFormData, fieldData.value);
      });
    }
}, [searchParams, isEdit]);

  // Load authenticated user id for drafts
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id ?? null);
    })();
  }, []);

  const form = useForm<ProjectFormData>({
    mode: 'onSubmit',
    defaultValues: {
      title: '',
      description: '',
      developer_id: '',
      city: '',
      full_address: '',
      region: '',
      neighborhood: '',
      photos: [],
      features: [],
      amenities: [],
      status: 'available',
      vat_rate_new: 5,
      vat_included: false,
      golden_visa_eligible_new: false,
      financing_available: false,
      featured_new: false,
      cyprus_zone: 'limassol',
      property_category: 'residential',
      property_sub_type: ['apartment'],
      exclusive_commercialization: false,
      project_phase: 'off-plan',
      price: 0,
      // Marketing defaults to ensure placeholders show and no weird values
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
        .select(`
          *,
          project_amenities(amenity_id),
          project_nearby_amenities(nearby_amenity_id, distance_km, distance_minutes_walk, distance_minutes_drive, quantity, details),
          project_images(url, caption, is_primary, display_order)
        `)
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
        // Transform data to match form structure
        const formData: Partial<ProjectFormData> = {
          title: projectData.title,
          description: projectData.description,
          detailed_description: projectData.detailed_description,
         developer_id: projectData.developer_id,
         status: projectData.status as ProjectFormData['status'],
        price: projectData.price,
         photos: (() => {
           const out: any[] = [];
           const cp = projectData.categorized_photos as any;
           // Map possible legacy/localized categories to our enum
            const mapCategory = (c: string): any => {
              const k = (c || '').toLowerCase();
              const dict: Record<string, any> = {
                'principale': 'hero',
                'principal': 'hero',
                'hero': 'hero',
                'exterieure': 'exterior_1',
                'exterieur': 'exterior_1',
                'exterior_1': 'exterior_1',
                'exterior_2': 'exterior_2',
                'interieure': 'interior_1',
                'interieur': 'interior_1',
                'interior_1': 'interior_1',
                'interior_2': 'interior_2',
                'cuisine': 'kitchen',
                'kitchen': 'kitchen',
                'chambre': 'bedroom',
                'bedroom': 'bedroom',
                'salle_de_bain': 'bathroom',
                'bathroom': 'bathroom',
                'balcon': 'balcony',
                'balcony': 'balcony',
                'jardin': 'garden',
                'garden': 'garden',
                'vue_panoramique': 'panoramic_view',
                'panoramic_view': 'panoramic_view',
                'vue_mer': 'sea_view',
                'sea_view': 'sea_view',
                'vue_montagne': 'mountain_view',
                'mountain_view': 'mountain_view',
                'prestations': 'amenities',
                'amenities': 'amenities',
                'plans': 'plans'
              };
              return dict[k] || 'interior_1';
            };
           if (Array.isArray(cp) && cp.length > 0) {
             cp.forEach((item: any) => {
               if (item?.url) out.push({ url: item.url, category: mapCategory(item.category), isPrimary: mapCategory(item.category) === 'hero', caption: item.caption || '' });
               else if (Array.isArray(item?.urls)) {
                 const cat = mapCategory(item.category);
                 item.urls.forEach((u: string, idx: number) => out.push({ url: u, category: cat, isPrimary: cat === 'hero' && idx === 0, caption: '' }));
               }
             });
           }
           if (out.length > 0) return out;
           if (Array.isArray(projectData.project_images) && projectData.project_images.length > 0) {
             return (projectData.project_images as any[])
               .sort((a,b)=> (a.display_order??0)-(b.display_order??0))
               .map((img:any, idx:number) => ({ url: img.url, category: img.is_primary ? 'hero' : 'interior_1', isPrimary: !!img.is_primary || idx===0, caption: img.caption || '' }));
           }
           if (Array.isArray(projectData.photos) && projectData.photos.length > 0) {
             return (projectData.photos as string[]).map((url: string, idx:number) => ({ url, category: idx===0 ? 'hero' : 'interior_1', isPrimary: idx===0, caption: '' }));
           }
           return [];
          })(),
          features: projectData.features || ['Vue mer panoramique', 'Spa privatif 800m²', 'Piscine à débordement', 'Concierge 24h/7j', 'Plage privée', 'Valet parking', 'Domotique intégrée', 'Cuisine équipée Miele'],
          amenities: Array.isArray(projectData.project_amenities) ? (projectData.project_amenities as any[]).map((pa:any) => pa.amenity_id).filter(Boolean) : (projectData.amenities || []),
          cyprus_zone: projectData.cyprus_zone || 'limassol',
        
          // New fields
          project_code: projectData.project_code || 'MBR-2025-001',
          property_category: (projectData.property_category as ProjectFormData['property_category']) || 'residential',
          property_sub_type: Array.isArray(projectData.property_sub_type) && projectData.property_sub_type.length > 0 ? projectData.property_sub_type as ProjectFormData['property_sub_type'] : ['apartment', 'penthouse'],
          project_phase: (projectData.project_phase as ProjectFormData['project_phase']) || 'under-construction',
        launch_date: projectData.launch_date ? String(projectData.launch_date).slice(0,7) : '2024-03',
        completion_date_new: projectData.completion_date_new ? String(projectData.completion_date_new).slice(0,7) : '2026-09',
        exclusive_commercialization: projectData.exclusive_commercialization ?? true,
        unique_selling_points: projectData.unique_selling_points || ['Tour la plus haute de Limassol', 'Vue mer à 360°', 'Spa privatif de 800m²', 'Concierge de luxe 24h/7j', 'Plage privée exclusive'],
        
        // Location
        full_address: projectData.full_address || '28 Amathountos Avenue, Marina District, 4532 Limassol, Cyprus',
        city: projectData.city || 'Limassol',
        region: projectData.region || 'Limassol District',
        neighborhood: projectData.neighborhood || 'Marina',
        neighborhood_description: projectData.neighborhood_description || 'Le quartier le plus prestigieux de Limassol, au cœur de la marina moderne avec restaurants étoilés, boutiques de luxe et yacht club exclusif.',
        gps_latitude: projectData.gps_latitude || 34.68510000,
        gps_longitude: projectData.gps_longitude || 33.03840000,
        proximity_sea_km: projectData.proximity_sea_km ?? 0.0,
        proximity_airport_km: projectData.proximity_airport_km || 65.5,
        proximity_city_center_km: projectData.proximity_city_center_km || 2.1,
        proximity_highway_km: projectData.proximity_highway_km || 1.8,
        
        // Specifications
        land_area_m2: projectData.land_area_m2 || 4500.00,
        built_area_m2: projectData.built_area_m2 || 28500.00,
        total_units_new: projectData.total_units_new || 186,
        units_available_new: projectData.units_available_new || 142,
        bedrooms_range: projectData.bedrooms_range || '1-4',
        bathrooms_range: projectData.bathrooms_range || '1-4',
        floors_total: projectData.floors_total || 42,
        parking_spaces: projectData.parking_spaces || 220,
        storage_spaces: projectData.storage_spaces || 186,
        
        // Pricing
        price_from_new: projectData.price_from_new || 350000.00,
        price_to: projectData.price_to || 2800000.00,
        price_per_m2: projectData.price_per_m2 || 7200.00,
        vat_rate_new: projectData.vat_rate_new || 5,
        vat_included: projectData.vat_included || false,
        golden_visa_eligible_new: projectData.golden_visa_eligible_new ?? true,
        roi_estimate_percent: projectData.roi_estimate_percent || 8.5,
        rental_yield_percent: projectData.rental_yield_percent || 6.2,
        financing_available: projectData.financing_available ?? true,
        financing_options: (typeof projectData.financing_options === 'object' && projectData.financing_options !== null) 
          ? projectData.financing_options as Record<string, any>
          : {
              max_term_years: 25,
              down_payment_min: 30,
              bank_partnerships: ['Bank of Cyprus', 'Hellenic Bank']
            },
        payment_plan: (typeof projectData.payment_plan === 'object' && projectData.payment_plan !== null)
          ? projectData.payment_plan as Record<string, any>
          : {
              reservation: 5000,
              contract: '30%',
              construction_milestones: '60%',
              completion: '10%'
            },
        incentives: projectData.incentives || ['Frais notaire offerts', 'Mobilier design inclus', 'Service concierge 1 an gratuit'],
        
        // Media
        photo_gallery_urls: projectData.photo_gallery_urls,
        video_tour_urls: projectData.video_tour_urls,
        floor_plan_urls: projectData.floor_plan_urls,
        virtual_tour_url_new: projectData.virtual_tour_url_new || 'https://virtualtour.marinabayresidences.com',
        project_presentation_url: projectData.project_presentation_url || 'https://brochure.marinabayresidences.com/fr',
        youtube_tour_url: projectData.youtube_tour_url || 'https://youtube.com/watch?v=marinabay-tour',
        vimeo_tour_url: projectData.vimeo_tour_url,
        drone_footage_urls: projectData.drone_footage_urls,
        model_3d_urls: projectData.model_3d_urls,
        
        // Construction
        construction_materials: projectData.construction_materials || ['Béton armé haute performance', 'Façade en verre double vitrage', 'Marbre de Carrare', 'Acier inoxydable marine'],
        finishing_level: (projectData.finishing_level as ProjectFormData['finishing_level']) || 'luxury',
        design_style: projectData.design_style || 'Contemporary Mediterranean',
        architect_name: projectData.architect_name || 'Foster + Partners',
        builder_name: projectData.builder_name || 'J&P AVAX Construction',
        energy_rating: (projectData.energy_rating as ProjectFormData['energy_rating']) || 'A+',
        sustainability_certifications: projectData.sustainability_certifications || ['LEED Gold', 'BREEAM Very Good'],
        warranty_years: projectData.warranty_years || 10,
        
        // Marketing
        project_narrative: typeof projectData.project_narrative === 'string' ? projectData.project_narrative : 'Marina Bay Residences incarne l\'excellence résidentielle méditerranéenne. Cette tour iconique de 42 étages redéfinit le skyline de Limassol en offrant un art de vivre inégalé.',
        meta_title_new: typeof projectData.meta_title_new === 'string' ? projectData.meta_title_new : 'Marina Bay Residences Limassol - Appartements de Luxe Vue Mer | Golden Visa | ENKI Realty',
        meta_description_new: typeof projectData.meta_description_new === 'string' ? projectData.meta_description_new : 'Découvrez Marina Bay Residences : 186 appartements et penthouses de luxe face à la mer à Limassol. Tour de 42 étages, spa privé, concierge 24h/7j. Dès 350 000€.',
        meta_keywords: projectData.meta_keywords || ['Marina Bay Residences', 'Appartement luxe Limassol', 'Golden Visa Chypre', 'Immobilier prestige Cyprus', 'Tour résidentielle mer'],
        marketing_highlights: projectData.marketing_highlights || ['Plus haute tour résidentielle de Limassol', 'Spa privatif 800m²', 'Plage privée exclusive', 'Concierge de palace', 'Rendement locatif 6,2%'],
        target_audience: projectData.target_audience || ['Investisseurs internationaux', 'Familles expatriées', 'Résidents Golden Visa', 'Amateurs de luxe'],
        featured_new: projectData.featured_new ?? true
      };

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined) {
          form.setValue(key as keyof ProjectFormData, value);
        }
      });
    }
  }, [projectData, isEdit, form]);

  // Ensure fresh photos when entering Media step
  useEffect(() => {
    if (!isEdit || !id) return;
    if (projectFormSteps[currentStepIndex]?.id !== 'media') return;
    (async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('categorized_photos, project_images(url, caption, is_primary, display_order), photos')
        .eq('id', id)
        .single();
      if (error || !data) return;

      const mapCategory = (c: string) => {
        const k = (c || '').toLowerCase();
        const dict: Record<string, string> = {
          'principale': 'hero', 'principal': 'hero', 'hero': 'hero',
          'exterieure': 'exterior_1','exterieur':'exterior_1','exterior_1':'exterior_1','exterior_2':'exterior_2',
          'interieure':'interior_1','interieur':'interior_1','interior_1':'interior_1','interior_2':'interior_2',
          'cuisine':'kitchen','kitchen':'kitchen',
          'chambre':'bedroom','bedroom':'bedroom','salle_de_bain':'bathroom','bathroom':'bathroom',
          'balcon':'balcony','balcony':'balcony','jardin':'garden','garden':'garden',
          'vue_panoramique':'panoramic_view','panoramic_view':'panoramic_view',
          'vue_mer':'sea_view','sea_view':'sea_view','vue_montagne':'mountain_view','mountain_view':'mountain_view',
          'prestations':'amenities','amenities':'amenities','plans':'plans'
        };
        return (dict[k] as any) || 'interior_1';
      };

      let out: any[] = [];
      const cp = (data as any).categorized_photos;
      if (Array.isArray(cp) && cp.length > 0) {
        cp.forEach((item: any) => {
          if (item?.url) out.push({ url: item.url, category: mapCategory(item.category), isPrimary: mapCategory(item.category) === 'hero', caption: item.caption || '' });
          else if (Array.isArray(item?.urls)) {
            const cat = mapCategory(item.category);
            item.urls.forEach((u: string, idx: number) => out.push({ url: u, category: cat, isPrimary: cat === 'hero' && idx === 0, caption: '' }));
          }
        });
      } else if (Array.isArray((data as any).project_images) && (data as any).project_images.length > 0) {
        out = ((data as any).project_images as any[])
          .sort((a:any,b:any)=> (a.display_order??0)-(b.display_order??0))
          .map((img:any, idx:number) => ({ url: img.url, category: img.is_primary ? 'hero' : 'interior_1', isPrimary: !!img.is_primary || idx===0, caption: img.caption || '' }));
      } else if (Array.isArray((data as any).photos) && (data as any).photos.length > 0) {
        out = ((data as any).photos as string[]).map((url: string, idx:number) => ({ url, category: idx===0 ? 'hero' : 'interior_1', isPrimary: idx===0, caption: '' }));
      }

      if (out.length > 0) {
        const seen = new Set<string>();
        const normalized = out.slice().reverse().filter((p) => {
          if (seen.has(p.category)) return false;
          seen.add(p.category);
          return true;
        }).reverse();
        form.setValue('photos', normalized, { shouldDirty: false, shouldTouch: false, shouldValidate: false });
      }
    })();
  }, [currentStepIndex, isEdit, id, form]);

  // Load existing draft (after project data to avoid overriding DB in edit)
  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      let query = supabase
        .from('project_drafts')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1);
      if (isEdit && id) {
        query = query.eq('project_id', id as string);
      } else {
        // drafts for new project (no project_id)
        // @ts-ignore - supabase-js supports .is for null
        query = query.is('project_id', null);
      }
      const { data, error } = await query;
      if (error) {
        console.error('Load draft error:', error);
        return;
      }
      const d = data?.[0];
      if (d) {
        try {
          // If editing, only apply draft if it's newer than DB record
          const projectUpdatedAt = (projectData as any)?.updated_at ? new Date((projectData as any).updated_at) : null;
          const draftUpdatedAt = d.updated_at ? new Date(d.updated_at) : null;
          const shouldApply = !isEdit || !projectUpdatedAt || (draftUpdatedAt && draftUpdatedAt > projectUpdatedAt);
          if (shouldApply) {
            const currentValues = form.getValues() as any;
            const draftValues = (d.form_data || {}) as any;
            form.reset({ ...currentValues, ...draftValues } as any);
            if (typeof d.step_index === 'number') setCurrentStepIndex(d.step_index);
          }
          setDraftId(d.id);
        } catch (e) {
          console.warn('Draft apply warning:', e);
        }
      }
    };
    load().finally(() => setDraftLoaded(true));
  }, [userId, isEdit, id, projectData, form]);

  // Normalize month inputs to first day ISO
  const toFirstOfMonth = (val: any) => {
    if (!val) return null as any;
    if (typeof val === 'string') {
      const m = val.match(/^\d{4}-\d{2}$/);
      if (m) return `${val}-01`;
      return val;
    }
    if (val instanceof Date) {
      const d = new Date(val.getFullYear(), val.getMonth(), 1);
      return d.toISOString().slice(0,10);
    }
    return val;
  };

  // Autosave draft (debounced)
  const debouncedSave = useDebounceCallback(async (values: ProjectFormData) => {
    if (!userId) return;
    try {
      const payload: any = {
        user_id: userId,
        project_id: isEdit ? id : null,
        form_data: values,
        current_step: projectFormSteps[currentStepIndex].id,
        step_index: currentStepIndex,
        auto_save_enabled: true
      };
      if (draftId) {
        await supabase.from('project_drafts').update(payload).eq('id', draftId);
      } else {
        const { data, error } = await supabase
          .from('project_drafts')
          .insert(payload)
          .select('id')
          .single();
        if (!error && data) setDraftId(data.id);
      }
    } catch (e) {
      console.warn('Autosave draft failed:', e);
    }
  }, 800);

  // Watch form changes to autosave
  useEffect(() => {
    const subscription = form.watch(() => {
      debouncedSave(form.getValues());
    });
    return () => subscription.unsubscribe();
  }, [form, debouncedSave]);

  // Save also on step change
  useEffect(() => {
    debouncedSave(form.getValues());
  }, [currentStepIndex]);

  // Save project mutation
  const saveProjectMutation = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      // Transform form data to database format
      // Generate marketing defaults if empty
      const featuresList = Array.isArray(data.features) ? data.features.slice(0, 3).join(', ') : '';
      const city = data.city || '';
      const baseTitle = data.title || 'Projet immobilier';
      const priceFrom = (typeof data.price_from_new === 'number' ? data.price_from_new : (typeof data.price === 'number' ? data.price : undefined));
      const defaultMetaTitle = `${baseTitle} à ${city}${featuresList ? ` – ${featuresList}` : ''}${priceFrom ? ` | Prix dès ${Math.round(Number(priceFrom)).toLocaleString('fr-FR')} €` : ''} | ENKI Realty`;
      const defaultMetaDescriptionRaw = `Découvrez ${baseTitle} à ${city}: prestations haut de gamme, ${featuresList || 'emplacement d’exception'}, éligible Golden Visa. Visite et brochure sur demande.`;
      const metaDescription = (data.meta_description_new?.trim() || defaultMetaDescriptionRaw).slice(0, 160);
      const narrativeDefault = `${baseTitle} propose une expérience de vie premium à ${city}. Architecture contemporaine, matériaux soignés et services exclusifs (sécurité, fitness, espaces extérieurs) en font une adresse idéale pour habiter ou investir. Contactez ENKI Realty pour un accompagnement personnalisé.`;

      // Legacy compatibility: maintain photos array for old code paths
      const legacyPhotos = Array.isArray(data.photos) ? data.photos.map(p => p.url).filter(Boolean) : [];

      const projectData = {
        title: data.title,
        description: data.description,
        detailed_description: data.detailed_description,
         developer_id: data.developer_id,
         status: data.status,
        price: data.price,
        categorized_photos: data.photos,
        photos: legacyPhotos, // Maintain legacy compatibility
        features: data.features,
        cyprus_zone: data.cyprus_zone,
        
        // New fields
        project_code: data.project_code,
        property_category: data.property_category,
        property_sub_type: data.property_sub_type,
        project_phase: data.project_phase,
        launch_date: toFirstOfMonth(data.launch_date),
        completion_date_new: toFirstOfMonth(data.completion_date_new),
        exclusive_commercialization: data.exclusive_commercialization,
        unique_selling_points: data.unique_selling_points,
        
        // Location
        full_address: data.full_address,
        city: data.city,
        region: data.region,
        neighborhood: data.neighborhood,
        neighborhood_description: data.neighborhood_description,
        gps_latitude: data.gps_latitude,
        gps_longitude: data.gps_longitude,
        proximity_sea_km: data.proximity_sea_km,
        proximity_airport_km: data.proximity_airport_km,
        proximity_city_center_km: data.proximity_city_center_km,
        proximity_highway_km: data.proximity_highway_km,
        
        // Specifications
        land_area_m2: data.land_area_m2,
        built_area_m2: data.built_area_m2,
        total_units_new: data.total_units_new,
        units_available_new: data.units_available_new,
        bedrooms_range: data.bedrooms_range,
        bathrooms_range: data.bathrooms_range,
        floors_total: data.floors_total,
        parking_spaces: data.parking_spaces,
        storage_spaces: data.storage_spaces,
        
        // Pricing
        price_from_new: data.price_from_new,
        price_to: data.price_to,
        price_per_m2: data.price_per_m2,
        vat_rate_new: data.vat_rate_new,
        vat_included: data.vat_included,
        golden_visa_eligible_new: data.golden_visa_eligible_new,
        roi_estimate_percent: data.roi_estimate_percent,
        rental_yield_percent: data.rental_yield_percent,
        financing_available: data.financing_available,
        financing_options: data.financing_options,
        payment_plan: data.payment_plan,
        incentives: data.incentives,
        
        // Media
        photo_gallery_urls: data.photo_gallery_urls,
        video_tour_urls: data.video_tour_urls,
        floor_plan_urls: data.floor_plan_urls,
        virtual_tour_url_new: data.virtual_tour_url_new,
        project_presentation_url: data.project_presentation_url,
        youtube_tour_url: data.youtube_tour_url,
        vimeo_tour_url: data.vimeo_tour_url,
        drone_footage_urls: data.drone_footage_urls,
        model_3d_urls: data.model_3d_urls,
        
        // Construction
        construction_materials: data.construction_materials,
        finishing_level: data.finishing_level,
        design_style: data.design_style,
        architect_name: data.architect_name,
        builder_name: data.builder_name,
        energy_rating: data.energy_rating,
        sustainability_certifications: data.sustainability_certifications,
        warranty_years: data.warranty_years,
        
        // Marketing
        project_narrative: (typeof data.project_narrative === 'string' && data.project_narrative.trim().length > 0) ? data.project_narrative : narrativeDefault,
        meta_title_new: (data.meta_title_new?.trim() || defaultMetaTitle),
        meta_description_new: metaDescription,
        meta_keywords: data.meta_keywords,
        marketing_highlights: data.marketing_highlights,
        target_audience: data.target_audience,
        featured_new: data.featured_new,
        
        // Legacy compatibility
        location: data.location || {
          city: data.city || '',
          address: data.full_address || '',
          lat: data.gps_latitude,
          lng: data.gps_longitude
        }
      };

      if (isEdit) {
        const { data: result, error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return result;
      } else {
        const { data: result, error } = await supabase
          .from('projects')
          .insert([projectData])
          .select()
          .single();
        
        if (error) throw error;
        return result;
      }
    },
  onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: isEdit ? "Projet mis à jour" : "Projet créé",
        description: `Le projet "${data.title}" a été ${isEdit ? 'mis à jour' : 'créé'} avec succès. Redirection...`,
      });
      setTimeout(() => {
        navigate('/admin/projects');
      }, 900);
    },
    onError: (error) => {
      console.error('Save error:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: error instanceof Error ? error.message : "Impossible de sauvegarder le projet. Vérifiez les champs requis.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: ProjectFormData) => {
    saveProjectMutation.mutate(data);
  };

  const nextStep = () => {
    if (currentStepIndex < projectFormSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToStep = (index: number) => {
    setCurrentStepIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.ComponentType<any>;
    return IconComponent ? <IconComponent className="w-4 h-4" /> : <LucideIcons.Circle className="w-4 h-4" />;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="text-center">Chargement...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* NOUVEAU DESIGN - INDICATEUR VISUEL IMPOSSIBLE A MANQUER */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 text-center font-bold text-2xl shadow-2xl border-8 border-yellow-300 animate-pulse">
        🚀 NOUVEAU FORMULAIRE PROJET REDESIGNÉ - VOUS VOYEZ MAINTENANT LE NOUVEAU DESIGN! 🚀
      </div>
      <div className="container mx-auto py-8 space-y-8 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/projects')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux projets
            </Button>
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {isEdit ? 'Modifier le projet' : 'Créer un nouveau projet'}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? 'Modifiez les informations de votre projet' : 'Ajoutez un nouveau projet immobilier à votre catalogue'}
          </p>
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <Card className="sticky top-4 border-border/50 shadow-lg bg-card">
              <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-accent/5 rounded-t-lg">
                <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Étapes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <nav className="space-y-2">
                  {projectFormSteps.map((step, index) => {
                    const isCompleted = index < currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    const StepIcon = (LucideIcons as any)[step.icon] as React.ComponentType<{ className?: string }>;
                    
                    return (
                      <button
                        key={step.id}
                        onClick={() => goToStep(index)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200 group",
                          isCurrent 
                            ? "bg-primary/10 text-primary border border-primary/20 shadow-sm" 
                            : isCompleted 
                              ? "text-emerald-600 hover:bg-emerald-50 border border-transparent" 
                              : "text-muted-foreground hover:bg-accent border border-transparent"
                        )}
                      >
                        <div className={cn(
                          "flex items-center justify-center w-7 h-7 rounded-lg text-xs font-semibold",
                          isCurrent 
                            ? "bg-primary text-primary-foreground shadow-sm" 
                            : isCompleted 
                              ? "bg-emerald-100 text-emerald-700" 
                              : "bg-muted text-muted-foreground group-hover:bg-accent-foreground/10"
                        )}>
                          {isCompleted ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <StepIcon className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={cn(
                            "text-sm font-semibold truncate",
                            isCurrent && "text-primary"
                          )}>
                            {step.title}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit, () => {
                toast({
                  title: "Champs requis manquants",
                  description: "Corrigez les erreurs du formulaire avant de publier.",
                  variant: "destructive"
                });
              })} className="space-y-8">
                <ProjectFormSteps 
                  key={currentStep.id}
                  form={form} 
                  currentStep={currentStep.id}
                  projectId={id}
                />
                
                {/* Navigation Buttons */}
                <Card className="border-border/50 shadow-sm">
                  <CardContent className="p-6">
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
                  </CardContent>
                </Card>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </Layout>
  );
};