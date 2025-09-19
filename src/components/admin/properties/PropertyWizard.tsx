import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Home, Package, FileSpreadsheet } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import BulkPropertyCreator from './BulkPropertyCreator';
import { CSVImporter } from './CSVImporter';
import { PropertyOCRImporter } from './PropertyOCRImporter';
import { toast } from 'sonner';

interface PropertyWizardProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type CreationMode = 'single' | 'bulk' | 'import' | 'template';

export default function PropertyWizard({ open, onClose, onSuccess }: PropertyWizardProps) {
  const [mode, setMode] = useState<CreationMode>('single');
  const [selectedDeveloper, setSelectedDeveloper] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('');

  // Charger les développeurs
  const { data: developers } = useQuery({
    queryKey: ['developers-select'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('developers')
        .select('id, name')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  // Charger les projets du développeur sélectionné
  const { data: projects } = useQuery({
    queryKey: ['projects-select', selectedDeveloper],
    queryFn: async () => {
      if (!selectedDeveloper) return [];
      const { data, error } = await supabase
        .from('projects')
        .select('id, title')
        .eq('developer_id', selectedDeveloper)
        .order('title');
      if (error) throw error;
      return data;
    },
    enabled: !!selectedDeveloper
  });

  // Charger les bâtiments du projet sélectionné
  const { data: buildings } = useQuery({
    queryKey: ['buildings-select', selectedProject],
    queryFn: async () => {
      if (!selectedProject) return [];
      const { data, error } = await supabase
        .from('buildings')
        .select('id, name')
        .eq('project_id', selectedProject)
        .order('name');
      if (error) throw error;
      return data;
    },
    enabled: !!selectedProject
  });

  const handleReset = () => {
    setSelectedDeveloper('');
    setSelectedProject('');
    setSelectedBuilding('');
    setMode('single');
  };

  const isContextReady = selectedDeveloper && selectedProject && selectedBuilding;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Home className="h-6 w-6" />
            Assistant de Création de Propriétés
          </DialogTitle>
        </DialogHeader>

        {/* Étape 1: Sélection du contexte */}
        <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
          <h3 className="font-semibold text-lg">Étape 1: Contexte de la propriété</h3>
          
          <div className="grid grid-cols-3 gap-4">
            {/* Sélection Développeur */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                Développeur
              </label>
              <Select value={selectedDeveloper || ""} onValueChange={(value) => {
                setSelectedDeveloper(value);
                setSelectedProject('');
                setSelectedBuilding('');
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un développeur" />
                </SelectTrigger>
                <SelectContent>
                  {developers?.map(dev => (
                    <SelectItem key={dev.id} value={dev.id}>
                      {dev.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sélection Projet */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                Programme Immobilier
              </label>
              <Select 
                value={selectedProject || ""}
                onValueChange={(value) => {
                  setSelectedProject(value);
                  setSelectedBuilding('');
                }}
                disabled={!selectedDeveloper}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un programme" />
                </SelectTrigger>
                <SelectContent>
                  {projects?.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sélection Bâtiment */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                Bâtiment
              </label>
              <Select 
                value={selectedBuilding || ""} 
                onValueChange={setSelectedBuilding}
                disabled={!selectedProject}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un bâtiment" />
                </SelectTrigger>
                <SelectContent>
                  {buildings?.map(building => (
                    <SelectItem key={building.id} value={building.id}>
                      {building.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isContextReady && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded">
              ✓ Contexte défini : Les propriétés seront créées dans ce bâtiment
            </div>
          )}
        </div>

        {/* Étape 2: Mode de création */}
        {isContextReady && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Étape 2: Mode de création</h3>
            
            <Tabs value={mode} onValueChange={(v) => setMode(v as CreationMode)}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="single">
                  <Home className="h-4 w-4 mr-2" />
                  Unique
                </TabsTrigger>
                <TabsTrigger value="bulk">
                  <Package className="h-4 w-4 mr-2" />
                  En Masse
                </TabsTrigger>
                <TabsTrigger value="import">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Import CSV
                </TabsTrigger>
                <TabsTrigger value="template">
                  <Building2 className="h-4 w-4 mr-2" />
                  OCR/IA
                </TabsTrigger>
              </TabsList>

              <TabsContent value="single" className="mt-4">
                <div className="text-center p-8">
                  <p className="text-muted-foreground">
                    Formulaire de création unique en cours de développement.
                  </p>
                  <Button
                    onClick={() => {
                      window.location.href = `/admin/property-form?project=${selectedProject}&building=${selectedBuilding}`;
                    }}
                    className="mt-4"
                  >
                    Aller au formulaire détaillé
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="bulk" className="mt-4">
                <BulkPropertyCreator
                  developerId={selectedDeveloper}
                  projectId={selectedProject}
                  buildingId={selectedBuilding}
                  onSuccess={(count) => {
                    toast.success(`${count} propriétés créées avec succès`);
                    onSuccess();
                    onClose();
                  }}
                />
              </TabsContent>

              <TabsContent value="import" className="mt-4">
                <CSVImporter
                  projectId={selectedProject}
                  buildingId={selectedBuilding}
                  onPropertiesImported={(count) => {
                    toast.success(`${count} propriétés importées avec succès`);
                    onSuccess();
                    onClose();
                  }}
                />
              </TabsContent>

              <TabsContent value="template" className="mt-4">
                <PropertyOCRImporter
                  projectId={selectedProject}
                  buildingId={selectedBuilding}
                  onPropertiesExtracted={(count) => {
                    toast.success(`${count} propriétés importées via OCR/IA !`);
                    onSuccess();
                    onClose();
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handleReset}>
            Réinitialiser
          </Button>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}