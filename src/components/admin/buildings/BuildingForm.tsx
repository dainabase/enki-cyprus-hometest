import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import SimpleImageUploader from '@/components/admin/common/SimpleImageUploader';
import { createBuildingImage, fetchBuildingImages, BuildingImage } from '@/lib/supabase/images';
import { useFormAutosave } from '@/hooks/useFormAutosave';
import { toast } from 'sonner';
import { BuildingFormData } from '@/types/building';

// Local interface for the form state
interface LocalBuildingFormData {
  building_name: string;
  building_code: string;
  project_id: string;
  total_floors: number;
  total_units: number;
  building_type: 'apartment_building' | 'villa_complex' | 'mixed_residence' | 'residential';
  construction_status: 'planned' | 'construction' | 'delivered';
  energy_rating: string;
  expected_completion: string;
}

interface BuildingFormProps {
  building?: any;
  onSave: (data: BuildingFormData) => Promise<void>;
  onCancel: () => void;
}

const BuildingForm: React.FC<BuildingFormProps> = ({ building, onSave, onCancel }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [existingImages, setExistingImages] = useState<BuildingImage[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  
  const [formData, setFormData] = useState<LocalBuildingFormData>({
    building_name: '',
    building_code: 'A',
    project_id: '',
    total_floors: 1,
    total_units: 1,
    building_type: 'residential',
    construction_status: 'planned',
    energy_rating: '',
    expected_completion: ''
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
        expected_completion: building.expected_completion || ''
      });
      
      // Load existing images
      if (building.id) {
        loadExistingImages(building.id);
      }
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
      // Map to BuildingFormData interface
      const buildingData: BuildingFormData = {
        project_id: formData.project_id,
        building_name: formData.building_name,
        building_code: formData.building_code,
        building_type: formData.building_type,
        total_floors: formData.total_floors,
        total_units: formData.total_units,
        construction_status: formData.construction_status,
        expected_completion: formData.expected_completion,
        energy_rating: formData.energy_rating
      };

      await onSave(buildingData);
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
    <form onSubmit={handleSubmit} className="space-y-8">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="structure">Structure</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {/* Project Selection */}
          <div className="space-y-2">
            <Label htmlFor="project_id">Projet *</Label>
            <Select
              value={formData.project_id}
              onValueChange={(value) => 
                setFormData(prev => ({ ...prev, project_id: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un projet" />
              </SelectTrigger>
              <SelectContent>
                {projects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="building_name">Nom du bâtiment *</Label>
              <Input
                id="building_name"
                value={formData.building_name}
                onChange={(e) => setFormData(prev => ({ ...prev, building_name: e.target.value }))}
                placeholder="Nom du bâtiment"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="building_code">Code du bâtiment</Label>
              <Input
                id="building_code"
                value={formData.building_code}
                onChange={(e) => setFormData(prev => ({ ...prev, building_code: e.target.value }))}
                placeholder="A, B, C..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="building_type">Type de bâtiment</Label>
              <Select
                value={formData.building_type}
                onValueChange={(value) => 
                  setFormData(prev => ({ 
                    ...prev, 
                    building_type: value as LocalBuildingFormData['building_type']
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Résidentiel</SelectItem>
                  <SelectItem value="apartment_building">Immeuble d'appartements</SelectItem>
                  <SelectItem value="villa_complex">Complexe de villas</SelectItem>
                  <SelectItem value="mixed_residence">Résidence mixte</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="construction_status">Statut de construction</Label>
              <Select
                value={formData.construction_status}
                onValueChange={(value) => 
                  setFormData(prev => ({ 
                    ...prev, 
                    construction_status: value as LocalBuildingFormData['construction_status']
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planifié</SelectItem>
                  <SelectItem value="construction">En construction</SelectItem>
                  <SelectItem value="delivered">Livré</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="structure" className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="total_floors">Nombre d'étages</Label>
              <Input
                id="total_floors"
                type="number"
                min="1"
                value={formData.total_floors}
                onChange={(e) => setFormData(prev => ({ ...prev, total_floors: parseInt(e.target.value) || 1 }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total_units">Nombre d'unités</Label>
              <Input
                id="total_units"
                type="number"
                min="1"
                value={formData.total_units}
                onChange={(e) => setFormData(prev => ({ ...prev, total_units: parseInt(e.target.value) || 1 }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="energy_rating">Classe énergétique</Label>
              <Input
                id="energy_rating"
                value={formData.energy_rating}
                onChange={(e) => setFormData(prev => ({ ...prev, energy_rating: e.target.value }))}
                placeholder="A+, A, B, C..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expected_completion">Date de livraison prévue</Label>
              <Input
                id="expected_completion"
                type="date"
                value={formData.expected_completion}
                onChange={(e) => setFormData(prev => ({ ...prev, expected_completion: e.target.value }))}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          {building?.id && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Images du bâtiment</h3>
              <SimpleImageUploader
                bucket="buildings"
                entityId={building.id}
                maxFiles={10}
                onUploadComplete={(urls) => {
                  console.log('Images uploaded:', urls);
                }}
                existingImages={existingImages.map(img => img.url)}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Sauvegarde...' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  );
};

export default BuildingForm;