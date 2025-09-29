import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import SimpleImageUploader from '@/components/admin/common/SimpleImageUploader';
import { createBuildingImage, fetchBuildingImages, BuildingImage } from '@/lib/supabase/images';
import { useFormAutosave } from '@/hooks/useFormAutosave';
import { toast } from 'sonner';

interface BuildingFormProps {
  building?: any;
  onSave: (data: BuildingFormData) => Promise<void>;
  onCancel: () => void;
}

import { BuildingFormData } from '@/types/building';

const BuildingForm: React.FC<BuildingFormProps> = ({ building, onSave, onCancel }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [existingImages, setExistingImages] = useState<BuildingImage[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  
  const [formData, setFormData] = useState<BuildingFormData>({
    building_name: '',
    building_code: 'A',
    project_id: '',
    total_floors: 1,
    total_units: 1,
    building_type: 'residential',
    construction_status: 'planned',
    energy_rating: '',
    construction_start_date: '',
    expected_completion: '',
    address: '',
    description: ''
  });

  useEffect(() => {
    // Fetch projects
    const fetchProjects = async () => {
      const { data } = await supabase
        .from('projects')
        .select('id, title')
        .order('title');
      setProjects(data || []);
    };
    
    fetchProjects();
  }, []);

  useEffect(() => {
    if (building) {
      setFormData({
        building_name: building.building_name || '',
        building_code: building.building_code || 'A',
        project_id: building.project_id || '',
        total_floors: building.total_floors || 1,
        total_units: building.total_units || 1,
        building_type: building.building_type || 'residential',
        construction_status: building.construction_status || 'planned',
        energy_rating: building.energy_rating || '',
        construction_start_date: building.construction_start_date || '',
        expected_completion: building.expected_completion || '',
        address: building.address || '',
        description: building.description || ''
      });
      
      // Load existing images
      loadExistingImages(building.id);
    }
  }, [building]);

  const loadExistingImages = async (buildingId: string) => {
    try {
      const images = await fetchBuildingImages(buildingId);
      setExistingImages(images);
    } catch (error) {
      console.error('Error loading images:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const buildingData = {
        building_name: formData.building_name,
        building_code: formData.building_code || 'A',
        project_id: formData.project_id || null,
        total_floors: formData.total_floors,
        total_units: formData.total_units,
        building_type: formData.building_type,
        construction_status: formData.construction_status,
        energy_rating: formData.energy_rating || null
      };

      if (building) {
        // Update existing building
        const { error } = await supabase
          .from('buildings')
          .update(buildingData)
          .eq('id', building.id);
        
        if (error) throw error;
      } else {
        // Create new building
        const { error } = await supabase
          .from('buildings')
          .insert([buildingData]);
        
        if (error) throw error;
      }

      await onSave(formData);
    } catch (error) {
      console.error('Error saving building:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de sauvegarder le bâtiment'
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
          <Label htmlFor="name">Nom du bâtiment *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Nom du bâtiment"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="project">Projet *</Label>
          <Select
            value={formData.project_id}
            onValueChange={(value) => setFormData(prev => ({ ...prev, project_id: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un projet" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.title} ({project.cyprus_zone})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Building Details */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="total_floors">Nombre d'étages *</Label>
          <Input
            id="total_floors"
            type="number"
            value={formData.total_floors}
            onChange={(e) => setFormData(prev => ({ ...prev, total_floors: Number(e.target.value) }))}
            placeholder="Nombre d'étages"
            min="1"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="total_units">Unités totales *</Label>
          <Input
            id="total_units"
            type="number"
            value={formData.total_units}
            onChange={(e) => setFormData(prev => ({ ...prev, total_units: Number(e.target.value) }))}
            placeholder="Nombre total d'unités"
            min="1"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="building_type">Type de bâtiment</Label>
          <Select
            value={formData.building_type}
            onValueChange={(value) => setFormData(prev => ({ ...prev, building_type: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="residential">Résidentiel</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="mixed">Mixte</SelectItem>
              <SelectItem value="office">Bureau</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Construction Status and Rating */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="construction_status">Statut de construction *</Label>
          <Select
            value={formData.construction_status}
            onValueChange={(value) => setFormData(prev => ({ ...prev, construction_status: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planning">Planification</SelectItem>
              <SelectItem value="foundation">Fondations</SelectItem>
              <SelectItem value="structure">Structure</SelectItem>
              <SelectItem value="finishing">Finitions</SelectItem>
              <SelectItem value="completed">Terminé</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="energy_rating">Classe énergétique</Label>
          <Select
            value={formData.energy_rating}
            onValueChange={(value) => setFormData(prev => ({ ...prev, energy_rating: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une classe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Non définie</SelectItem>
              <SelectItem value="A+">A+</SelectItem>
              <SelectItem value="A">A</SelectItem>
              <SelectItem value="B">B</SelectItem>
              <SelectItem value="C">C</SelectItem>
              <SelectItem value="D">D</SelectItem>
              <SelectItem value="E">E</SelectItem>
              <SelectItem value="F">F</SelectItem>
              <SelectItem value="G">G</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="construction_start">Début de construction</Label>
          <Input
            id="construction_start"
            type="date"
            value={formData.construction_start_date}
            onChange={(e) => setFormData(prev => ({ ...prev, construction_start_date: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expected_completion">Livraison prévue</Label>
          <Input
            id="expected_completion"
            type="date"
            value={formData.expected_completion}
            onChange={(e) => setFormData(prev => ({ ...prev, expected_completion: e.target.value }))}
          />
        </div>
      </div>

      {/* Address and Description */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address">Adresse</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            placeholder="Adresse du bâtiment"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Description du bâtiment"
            rows={3}
          />
        </div>
      </div>

      {/* Images Upload Section */}
      {building && (
        <div className="space-y-4">
          <div>
            <Label>Images du bâtiment (max 5)</Label>
            <p className="text-sm text-muted-foreground mb-4">
              Uploadez jusqu'à 5 images pour ce bâtiment
            </p>
          </div>
          <SimpleImageUploader
            bucket="buildings"
            entityId={building.id}
            maxFiles={5}
            existingImages={existingImages.map(img => img.url)}
            onUploadComplete={async (urls) => {
              try {
                // Save images to database
                for (let i = 0; i < urls.length; i++) {
                  await createBuildingImage({
                    building_id: building.id,
                    url: urls[i],
                    is_primary: existingImages.length === 0 && i === 0,
                    display_order: existingImages.length + i
                  });
                }
                // Reload images
                await loadExistingImages(building.id);
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

export default BuildingForm;