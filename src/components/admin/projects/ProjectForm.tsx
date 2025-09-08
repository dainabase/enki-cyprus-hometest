import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import SimpleImageUploader from '@/components/admin/common/SimpleImageUploader';
import { createProjectImage, fetchProjectImages, ProjectImage } from '@/lib/supabase/images';

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
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, developers, onSave, onCancel }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [existingImages, setExistingImages] = useState<ProjectImage[]>([]);
  
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    subtitle: '',
    description: '',
    detailed_description: '',
    developer_id: '',
    cyprus_zone: 'limassol',
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
    }
  });

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        subtitle: project.subtitle || '',
        description: project.description || '',
        detailed_description: project.detailed_description || '',
        developer_id: project.developer_id || '',
        cyprus_zone: project.cyprus_zone || 'limassol',
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
          city: project.location?.city || '',
          address: project.location?.address || '',
          lat: project.location?.lat || 34.7768,
          lng: project.location?.lng || 32.4245
        }
      });
      
      // Load existing images
      loadExistingImages(project.id);
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

  // Auto-calculate Golden Visa eligibility when price changes
  useEffect(() => {
    const isEligible = formData.price >= 300000;
    if (isEligible !== formData.golden_visa_eligible) {
      setFormData(prev => ({ ...prev, golden_visa_eligible: isEligible }));
    }
  }, [formData.price]);

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
        cyprus_zone: formData.cyprus_zone,
        status: formData.status,
        type: formData.property_types.length > 0 ? formData.property_types[0] : 'apartment',
        property_types: formData.property_types,
        price: formData.price,
        price_from: formData.price_from || null,
        vat_rate: formData.vat_rate,
        completion_date: formData.completion_date || null,
        golden_visa_eligible: formData.golden_visa_eligible,
        units_available: formData.units_available,
        total_units: formData.total_units,
        location: formData.location,
        features: [],
        photos: []
      };

      if (project) {
        // Update existing project
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', project.id);
        
        if (error) throw error;
        
        toast({
          title: 'Projet mis à jour',
          description: 'Le projet a été mis à jour avec succès'
        });
      } else {
        // Create new project
        const { error } = await supabase
          .from('projects')
          .insert([projectData]);
        
        if (error) throw error;
        
        toast({
          title: 'Projet créé',
          description: 'Le nouveau projet a été créé avec succès'
        });
      }

      onSave();
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de sauvegarder le projet'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Nom du projet *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Nom du projet"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtitle">Sous-titre</Label>
          <Input
            id="subtitle"
            value={formData.subtitle}
            onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
            placeholder="Sous-titre du projet"
          />
        </div>
      </div>

      {/* Developer and Zone */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="developer">Développeur</Label>
          <Select
            value={formData.developer_id}
            onValueChange={(value) => setFormData(prev => ({ ...prev, developer_id: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un développeur" />
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
          <Label htmlFor="zone">Zone *</Label>
          <Select
            value={formData.cyprus_zone}
            onValueChange={(value) => setFormData(prev => ({ ...prev, cyprus_zone: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="limassol">Limassol</SelectItem>
              <SelectItem value="paphos">Paphos</SelectItem>
              <SelectItem value="larnaca">Larnaca</SelectItem>
              <SelectItem value="nicosia">Nicosia</SelectItem>
              <SelectItem value="famagusta">Famagusta</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Status and Type */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Statut *</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planning">Planification</SelectItem>
              <SelectItem value="under_construction">En construction</SelectItem>
              <SelectItem value="completed">Terminé</SelectItem>
              <SelectItem value="ready_to_move">Prêt à emménager</SelectItem>
              <SelectItem value="sold_out">Vendu</SelectItem>
              <SelectItem value="on_hold">En pause</SelectItem>
              <SelectItem value="delivered">Livré</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="property_types">Types de biens *</Label>
          <div className="space-y-2">
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
                <Label htmlFor={type} className="text-sm">
                  {type === 'apartment' && 'Appartement'}
                  {type === 'villa' && 'Villa'}
                  {type === 'penthouse' && 'Penthouse'}
                  {type === 'commercial' && 'Commercial'}
                  {type === 'land' && 'Terrain'}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Price Information */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Prix minimum (€) *</Label>
          <Input
            id="price"
            type="number"
            value={formData.price === 0 ? '' : formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) || 0 }))}
            placeholder="Prix minimum"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vat_rate">TVA (%)</Label>
          <Select
            value={formData.vat_rate.toString()}
            onValueChange={(value) => setFormData(prev => ({ ...prev, vat_rate: Number(value) }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5% (Résidentiel)</SelectItem>
              <SelectItem value="19">19% (Commercial)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="completion_date">Date de livraison</Label>
          <Input
            id="completion_date"
            type="date"
            value={formData.completion_date}
            onChange={(e) => setFormData(prev => ({ ...prev, completion_date: e.target.value }))}
          />
        </div>
      </div>

      {/* Units */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="units_available">Unités disponibles</Label>
          <Input
            id="units_available"
            type="number"
            value={formData.units_available === 0 ? '' : formData.units_available}
            onChange={(e) => setFormData(prev => ({ ...prev, units_available: Number(e.target.value) || 0 }))}
            placeholder="Nombre d'unités disponibles"
            min="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="total_units">Total unités</Label>
          <Input
            id="total_units"
            type="number"
            value={formData.total_units === 0 ? '' : formData.total_units}
            onChange={(e) => setFormData(prev => ({ ...prev, total_units: Number(e.target.value) || 0 }))}
            placeholder="Nombre total d'unités"
            min="0"
          />
        </div>
      </div>

      {/* Location */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">Ville</Label>
          <Input
            id="city"
            value={formData.location.city}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              location: { ...prev.location, city: e.target.value }
            }))}
            placeholder="Ville"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Adresse</Label>
          <Input
            id="address"
            value={formData.location.address}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              location: { ...prev.location, address: e.target.value }
            }))}
            placeholder="Adresse complète"
          />
        </div>
      </div>

      {/* Descriptions */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Description du projet"
            rows={3}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="detailed_description">Description détaillée</Label>
          <Textarea
            id="detailed_description"
            value={formData.detailed_description}
            onChange={(e) => setFormData(prev => ({ ...prev, detailed_description: e.target.value }))}
            placeholder="Description détaillée du projet"
            rows={4}
          />
        </div>
      </div>

      {/* Golden Visa */}
      <div className="flex items-center space-x-2">
        <Switch
          id="golden_visa"
          checked={formData.golden_visa_eligible}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, golden_visa_eligible: checked }))}
        />
        <Label htmlFor="golden_visa">Éligible Golden Visa (€300,000+)</Label>
      </div>

      {/* Images Upload Section */}
      {project && (
        <div className="space-y-4">
          <div>
            <Label>Images du projet (max 5)</Label>
            <p className="text-sm text-muted-foreground mb-4">
              Uploadez jusqu'à 5 images pour ce projet
            </p>
          </div>
          <SimpleImageUploader
            bucket="projects"
            entityId={project.id}
            maxFiles={5}
            existingImages={existingImages.map(img => img.url)}
            onUploadComplete={async (urls) => {
              try {
                // Save images to database
                for (let i = 0; i < urls.length; i++) {
                  await createProjectImage({
                    project_id: project.id,
                    url: urls[i],
                    is_primary: existingImages.length === 0 && i === 0,
                    display_order: existingImages.length + i
                  });
                }
                // Reload images
                await loadExistingImages(project.id);
                toast({
                  title: "Images uploadées",
                  description: `${urls.length} image(s) ajoutée(s) avec succès`
                });
              } catch (error) {
                toast({
                  variant: "destructive",
                  title: "Erreur",
                  description: "Impossible de sauvegarder les images"
                });
              }
            }}
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;