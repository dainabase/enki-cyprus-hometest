import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import SimpleImageUploader from '@/components/admin/common/SimpleImageUploader';
import { createProjectImage, fetchProjectImages, ProjectImage } from '@/lib/supabase/images';
import { useTranslation } from 'react-i18next';
import { ProjectAmenitiesSection } from './ProjectAmenitiesSection';
import { ProjectBuildingsSection } from './ProjectBuildingsSection';
import { ProjectMarketingSeoSection } from './ProjectMarketingSeoSection';
import type { ProjectAmenitiesExtension } from '@/types/project-amenities-extension';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Building, Settings, Euro, Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProjectFormProps {
  project?: any;
  developers: any[];
  onSave: () => void;
  onCancel: () => void;
}

interface ProjectFormData {
  title: string;
  subtitle: string;
  description: string;
  detailed_description: string;
  developer_id: string;
  cyprus_zone: string;
  status: string;
  property_types: string[];
  price: number;
  price_from: string;
  vat_rate: number;
  completion_date: string;
  golden_visa_eligible: boolean;
  units_available: number;
  total_units: number;
  location: {
    city: string;
    address: string;
    lat: number;
    lng: number;
  };
  // Amenities fields
  amenities: ProjectAmenitiesExtension;
  // SEO fields (only supported ones)
  meta_title?: string;
  meta_description?: string;
  url_slug?: string;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, developers, onSave, onCancel }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [existingImages, setExistingImages] = useState<ProjectImage[]>([]);
  const [projectBuildings, setProjectBuildings] = useState<any[]>([]);
  
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    subtitle: '',
    description: '',
    detailed_description: '',
    developer_id: '',
    cyprus_zone: 'Limassol',
    status: 'under_construction',
    property_types: [],
    price: 0,
    price_from: '',
    vat_rate: 5,
    completion_date: '',
    golden_visa_eligible: false,
    units_available: 0,
    total_units: 0,
    location: {
      city: '',
      address: '',
      lat: 34.7768,
      lng: 32.4245
    },
    // Initialize amenities
    amenities: {
      has_pool: false,
      has_gym: false,
      has_spa: false,
      has_playground: false,
      has_garden: false,
      has_security_system: false,
      has_cctv: false,
      has_concierge: false,
      has_generator: false,
      has_solar_panels: false,
      has_parking: false,
      parking_type: null,
      security_features: {},
      wellness_facilities: {},
      outdoor_facilities: {}
    },
    // Initialize SEO
    meta_title: '',
    meta_description: '',
    url_slug: ''
  });

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        subtitle: project.subtitle || '',
        description: project.description || '',
        detailed_description: project.detailed_description || '',
        developer_id: project.developer_id || '',
        cyprus_zone: project.cyprus_zone || 'Limassol',
        status: project.status || 'under_construction',
        property_types: project.property_types || [],
        price: project.price || 0,
        price_from: project.price_from || '',
        vat_rate: project.vat_rate || 5,
        completion_date: project.completion_date || '',
        golden_visa_eligible: project.golden_visa_eligible || false,
        units_available: project.units_available || 0,
        total_units: project.total_units || 0,
        location: {
          city: project.location?.city || project.city || '',
          address: project.location?.address || '',
          lat: project.location?.lat || 34.7768,
          lng: project.location?.lng || 32.4245
        },
        // Load existing amenities
        amenities: {
          has_pool: project.has_pool || false,
          has_gym: project.has_gym || false,
          has_spa: project.has_spa || false,
          has_playground: project.has_playground || false,
          has_garden: project.has_garden || false,
          has_security_system: project.has_security_system || false,
          has_cctv: project.has_cctv || false,
          has_concierge: project.has_concierge || false,
          has_generator: project.has_generator || false,
          has_solar_panels: project.has_solar_panels || false,
          has_parking: project.has_parking || false,
          parking_type: project.parking_type || null,
          security_features: project.security_features || {},
          wellness_facilities: project.wellness_facilities || {},
          outdoor_facilities: project.outdoor_facilities || {}
        },
        // Load SEO fields
        meta_title: project.meta_title || '',
        meta_description: project.meta_description || '',
        url_slug: project.url_slug || ''
      });
      
      // Load existing images
      loadExistingImages(project.id);
      // Load buildings for this project
      loadProjectBuildings(project.id);
    }
  }, [project]);

  const loadExistingImages = async (projectId: string) => {
    try {
      const images = await fetchProjectImages(projectId);
      setExistingImages(images);
    } catch (error) {
      console.error('Error loading images:', error);
    }
  };

  const loadProjectBuildings = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('buildings')
        .select('id, building_name, total_floors, total_units, construction_status')
        .eq('project_id', projectId)
        .order('building_name');
      
      if (error) throw error;
      const mappedData = data?.map(b => ({
        id: b.id,
        name: b.building_name || 'Unnamed Building',
        total_floors: b.total_floors,
        units: b.total_units,
        status: b.construction_status
      })) || [];
      setProjectBuildings(mappedData);
    } catch (error) {
      console.error('Error loading buildings:', error);
    }
  };

  // Auto-calculate Golden Visa eligibility when price changes
  useEffect(() => {
    const isEligible = formData.price >= 300000;
    if (isEligible !== formData.golden_visa_eligible) {
      setFormData(prev => ({ ...prev, golden_visa_eligible: isEligible }));
    }
  }, [formData.price]);

  const handleAmenitiesChange = (amenities: ProjectAmenitiesExtension) => {
    setFormData(prev => ({ ...prev, amenities }));
  };

  const handleSeoChange = (seo: { meta_title?: string; meta_description?: string; url_slug?: string }) => {
    setFormData(prev => ({ ...prev, ...seo }));
  };

  const handleAddBuilding = () => {
    // Navigate to buildings page with project filter
    navigate(`/admin/buildings?project=${project?.id}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const projectData = {
        title: formData.title,
        subtitle: formData.subtitle || null,
        description: formData.description,
        detailed_description: formData.detailed_description || null,
        developer_id: formData.developer_id || null,
        city: formData.location?.city || 'Limassol', 
        cyprus_zone: formData.cyprus_zone,
        status: formData.status,
        price: formData.price || null,
        price_from: parseFloat(formData.price_from) || null, 
        vat_rate: formData.vat_rate,
        completion_date: formData.completion_date || null,
        golden_visa_eligible: formData.golden_visa_eligible,
        units_available: formData.units_available,
        total_units: formData.total_units,
        // Include amenities fields
        has_pool: formData.amenities.has_pool,
        has_gym: formData.amenities.has_gym,
        has_spa: formData.amenities.has_spa,
        has_playground: formData.amenities.has_playground,
        has_garden: formData.amenities.has_garden,
        has_security_system: formData.amenities.has_security_system,
        has_cctv: formData.amenities.has_cctv,
        has_concierge: formData.amenities.has_concierge,
        has_generator: formData.amenities.has_generator,
        has_solar_panels: formData.amenities.has_solar_panels,
        has_parking: formData.amenities.has_parking,
        parking_type: formData.amenities.parking_type || null,
        security_features: formData.amenities.security_features || {},
        wellness_facilities: formData.amenities.wellness_facilities || {},
        outdoor_facilities: formData.amenities.outdoor_facilities || {},
        // Include SEO fields
        meta_title: formData.meta_title || null,
        meta_description: formData.meta_description || null,
        url_slug: formData.url_slug || null
      };

      if (project) {
        // Update existing project
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', project.id);
        
        if (error) throw error;
        
        toast.success(t('projectForm.projectUpdated'), {
          description: t('projectForm.projectUpdatedSuccessfully')
        });
      } else {
        // Create new project
        const { data, error } = await supabase
          .from('projects')
          .insert([projectData])
          .select()
          .single();
        
        if (error) throw error;
        
        toast.success(t('projectForm.projectCreated'), {
          description: t('projectForm.newProjectCreatedSuccessfully')
        });
      }

      onSave();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error(t('messages.error'), {
        description: (error as any)?.message || t('messages.error')
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* 1. INFORMATIONS DE BASE */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building className="h-5 w-5" />
            {t('projectForm.basicInformation') || 'Informations de base'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t('projectForm.projectName')} *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder={t('projectForm.projectName')}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">{t('projectForm.subtitle')}</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder={t('projectForm.subtitle')}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="developer">{t('projectForm.developer')}</Label>
              <Select
                value={formData.developer_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, developer_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('projectForm.selectDeveloper')} />
                </SelectTrigger>
                <SelectContent>
                  {developers.map((developer) => (
                    <SelectItem key={developer.id} value={developer.id}>
                      {developer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">{t('fields.status')} *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under_construction">{t('projectForm.underConstruction')}</SelectItem>
                  <SelectItem value="ready_to_move">{t('projectForm.readyToMove')}</SelectItem>
                  <SelectItem value="completed">{t('projectForm.completed')}</SelectItem>
                  <SelectItem value="sold_out">{t('projectForm.soldOut')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('projectForm.description')} *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder={t('projectForm.projectDescription')}
              rows={3}
              required
              sanitize={false}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="detailed_description">{t('projectForm.detailedDescription')}</Label>
            <Textarea
              id="detailed_description"
              value={formData.detailed_description}
              onChange={(e) => setFormData(prev => ({ ...prev, detailed_description: e.target.value }))}
              placeholder={t('projectForm.detailedProjectDescription')}
              rows={4}
              sanitize={false}
            />
          </div>
        </CardContent>
      </Card>

      {/* 2. LOCALISATION */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {t('projectForm.location') || 'Localisation'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zone">{t('fields.zone')} *</Label>
              <Select
                value={formData.cyprus_zone}
                onValueChange={(value) => setFormData(prev => ({ ...prev, cyprus_zone: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Limassol">{t('zones.limassol')}</SelectItem>
                  <SelectItem value="Paphos">{t('zones.paphos')}</SelectItem>
                  <SelectItem value="Larnaca">{t('zones.larnaca')}</SelectItem>
                  <SelectItem value="Nicosia">{t('zones.nicosia')}</SelectItem>
                  <SelectItem value="Famagusta">{t('zones.famagusta')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">{t('projectForm.city')}</Label>
              <Input
                id="city"
                value={formData.location.city}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  location: { ...prev.location, city: e.target.value }
                }))}
                placeholder={t('projectForm.city')}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">{t('projectForm.address')}</Label>
            <Input
              id="address"
              value={formData.location.address}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                location: { ...prev.location, address: e.target.value }
              }))}
              placeholder={t('projectForm.fullAddress')}
            />
          </div>
        </CardContent>
      </Card>

      {/* 3. SPÉCIFICATIONS */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t('projectForm.specifications') || 'Spécifications'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="property_types">{t('projectForm.propertyTypes')} *</Label>
            <div className="grid grid-cols-3 gap-3">
              {['apartment', 'villa', 'penthouse', 'commercial', 'land'].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={type}
                    checked={formData.property_types.includes(type)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData(prev => ({ 
                          ...prev, 
                          property_types: [...prev.property_types, type] 
                        }));
                      } else {
                        setFormData(prev => ({ 
                          ...prev, 
                          property_types: prev.property_types.filter(t => t !== type) 
                        }));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor={type} className="text-sm cursor-pointer">
                    {type === 'apartment' && t('projectForm.apartment')}
                    {type === 'villa' && t('projectForm.villa')}
                    {type === 'penthouse' && t('projectForm.penthouse')}
                    {type === 'commercial' && t('types.commercial')}
                    {type === 'land' && t('projectForm.land')}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="units_available">{t('projectForm.unitsAvailable')}</Label>
              <Input
                id="units_available"
                type="number"
                value={formData.units_available === 0 ? '' : formData.units_available}
                onFocus={(e) => { if (e.currentTarget.value === '0') e.currentTarget.value = ''; }}
                onChange={(e) => setFormData(prev => ({ ...prev, units_available: Number(e.target.value) || 0 }))}
                placeholder={t('projectForm.unitsAvailable')}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total_units">{t('projectForm.totalUnits')}</Label>
              <Input
                id="total_units"
                type="number"
                value={formData.total_units === 0 ? '' : formData.total_units}
                onFocus={(e) => { if (e.currentTarget.value === '0') e.currentTarget.value = ''; }}
                onChange={(e) => setFormData(prev => ({ ...prev, total_units: Number(e.target.value) || 0 }))}
                placeholder={t('projectForm.totalUnits')}
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="completion_date">{t('projectForm.completionDate')}</Label>
            <Input
              id="completion_date"
              type="date"
              value={formData.completion_date}
              onChange={(e) => setFormData(prev => ({ ...prev, completion_date: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* 4. ÉQUIPEMENTS EN COMMUN (Amenities) */}
      <ProjectAmenitiesSection
        amenities={formData.amenities}
        onChange={handleAmenitiesChange}
        t={t}
      />

      {/* 5. PRIX & DISPONIBILITÉ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Euro className="h-5 w-5" />
            {t('projectForm.pricing') || 'Prix & Disponibilité'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">{t('projectForm.minPrice')} *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price === 0 ? '' : formData.price}
                onFocus={(e) => { if (e.currentTarget.value === '0') e.currentTarget.value = ''; }}
                onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) || 0 }))}
                placeholder={t('projectForm.minPrice')}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price_from">{t('projectForm.priceFrom')}</Label>
              <Input
                id="price_from"
                type="text"
                value={formData.price_from}
                onChange={(e) => setFormData(prev => ({ ...prev, price_from: e.target.value }))}
                placeholder={t('projectForm.priceFrom')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vat_rate">{t('projectForm.vat')}</Label>
              <Select
                value={formData.vat_rate.toString()}
                onValueChange={(value) => setFormData(prev => ({ ...prev, vat_rate: Number(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5% ({t('projectForm.residential')})</SelectItem>
                  <SelectItem value="19">19% ({t('types.commercial')})</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="golden_visa"
              checked={formData.golden_visa_eligible}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, golden_visa_eligible: checked }))}
            />
            <Label htmlFor="golden_visa" className="cursor-pointer">
              {t('projectForm.goldenVisaEligible')} 
              {formData.price >= 300000 && (
                <span className="ml-2 text-green-600 text-sm">(✓ Éligible automatiquement)</span>
              )}
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* 6. PHOTOS & MÉDIAS */}
      {project && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Image className="h-5 w-5" />
              {t('projectForm.media') || 'Photos & Médias'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>{t('projectForm.projectImages')}</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('projectForm.uploadUpTo5Images')}
                </p>
              </div>
              <SimpleImageUploader
                bucket="projects"
                entityId={project.id}
                maxFiles={5}
                existingImages={existingImages.map(img => img.url)}
                onUploadComplete={async (urls) => {
                  try {
                    for (let i = 0; i < urls.length; i++) {
                      await createProjectImage({
                        project_id: project.id,
                        url: urls[i],
                        is_primary: existingImages.length === 0 && i === 0,
                        display_order: existingImages.length + i
                      });
                    }
                    await loadExistingImages(project.id);
                    toast.success(t('projectForm.imagesUploaded'), {
                      description: t('projectForm.imagesAddedSuccessfully', { count: urls.length })
                    });
                  } catch (error) {
                    toast.error(t('messages.error'), {
                      description: t('projectForm.errorSavingImages')
                    });
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* 7. BÂTIMENTS - NOUVELLE SECTION */}
      <ProjectBuildingsSection
        projectId={project?.id}
        buildings={projectBuildings}
        onAddBuilding={handleAddBuilding}
        t={t}
      />

      {/* 8. MARKETING & SEO - NOUVELLE SECTION */}
      <ProjectMarketingSeoSection
        data={{
          meta_title: formData.meta_title,
          meta_description: formData.meta_description,
          url_slug: formData.url_slug
        }}
        onChange={handleSeoChange}
        projectTitle={formData.title}
        t={t}
      />

      {/* Actions */}
      <div className="flex items-center justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('form.cancel')}
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? t('projectForm.saving') : t('form.save')}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;
