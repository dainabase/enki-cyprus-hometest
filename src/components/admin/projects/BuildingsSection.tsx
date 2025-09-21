import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Building2, Users, Calendar, AlertTriangle, Waves, Dumbbell, Sparkles, Car, Shield } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Building, BuildingFormData } from '@/types/building';
import { 
  fetchBuildingsByProject, 
  createBuilding, 
  updateBuilding, 
  deleteBuilding 
} from '@/lib/api/buildings';
import { BuildingModal } from './BuildingModal';

interface BuildingsSectionProps {
  projectId: string;
}

export function BuildingsSection({ projectId }: BuildingsSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  const [deletingBuildingId, setDeletingBuildingId] = useState<string | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch buildings
  const {
    data: buildings = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['buildings', projectId],
    queryFn: () => fetchBuildingsByProject(projectId),
    enabled: !!projectId,
  });

  // Create building mutation
  const createMutation = useMutation({
    mutationFn: (data: BuildingFormData) => createBuilding(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buildings', projectId] });
      setIsModalOpen(false);
      toast({
        title: 'Bâtiment créé',
        description: 'Le bâtiment a été créé avec succès.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: 'Impossible de créer le bâtiment. Veuillez réessayer.',
        variant: 'destructive',
      });
      console.error('Error creating building:', error);
    },
  });

  // Update building mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BuildingFormData> }) => 
      updateBuilding(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buildings', projectId] });
      toast({
        title: 'Succès',
        description: 'Le bâtiment a été modifié avec succès.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier le bâtiment. Veuillez réessayer.',
        variant: 'destructive',
      });
      console.error('Error updating building:', error);
    },
  });

  // Delete building mutation
  const deleteMutation = useMutation({
    mutationFn: deleteBuilding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buildings', projectId] });
      toast({
        title: 'Succès',
        description: 'Le bâtiment a été supprimé avec succès.',
      });
      setDeletingBuildingId(null);
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le bâtiment. Veuillez réessayer.',
        variant: 'destructive',
      });
      console.error('Error deleting building:', error);
      setDeletingBuildingId(null);
    },
  });

  const handleAddBuilding = () => {
    setEditingBuilding(null);
    setIsModalOpen(true);
  };

  const handleEditBuilding = (building: Building) => {
    setEditingBuilding(building);
    setIsModalOpen(true);
  };

  const handleSaveBuilding = async (data: BuildingFormData) => {
    if (editingBuilding) {
      await updateMutation.mutateAsync({ id: editingBuilding.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleDeleteBuilding = (buildingId: string) => {
    setDeletingBuildingId(buildingId);
  };

  const confirmDelete = () => {
    if (deletingBuildingId) {
      deleteMutation.mutate(deletingBuildingId);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      planned: { label: 'Planifié', variant: 'secondary' as const },
      construction: { label: 'En construction', variant: 'default' as const },
      delivered: { label: 'Livré', variant: 'secondary' as const },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.planned;
    return (
      <Badge variant={statusInfo.variant}>
        {statusInfo.label}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeMap = {
      apartment_building: 'Appartements',
      villa_complex: 'Villas',
      mixed_residence: 'Mixte',
      residential: 'Résidentiel',
    };
    
    return typeMap[type as keyof typeof typeMap] || type;
  };

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            <span>Erreur lors du chargement des bâtiments</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Bâtiments & Unités
          </h3>
          <p className="text-sm text-muted-foreground">
            Gérez les bâtiments de votre projet immobilier
          </p>
        </div>
      </div>

      {/* Buildings List */}
      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="h-5 bg-muted rounded w-32" />
                    <div className="h-4 bg-muted rounded w-48" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-8 bg-muted rounded" />
                    <div className="h-8 w-8 bg-muted rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : buildings.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">
              Aucun bâtiment
            </h4>
            <p className="text-muted-foreground mb-4">
              Ajoutez votre premier bâtiment pour structurer votre projet
            </p>
            <Button type="button" onClick={handleAddBuilding} className="gap-2">
              <Plus className="w-4 h-4" />
              Ajouter un bâtiment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {buildings.map((building) => (
            <Card key={building.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{building.building_name}</CardTitle>
                      {building.building_code && (
                        <Badge variant="outline" className="text-xs">
                          {building.building_code}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {getTypeBadge(building.building_type)}
                      </span>
                      {getStatusBadge(building.construction_status)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditBuilding(building)}
                      className="hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteBuilding(building.id)}
                      className="hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {building.total_floors !== undefined && (
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {building.total_floors}
                      </div>
                      <div className="text-xs text-blue-600">Étages</div>
                    </div>
                  )}
                  
                  {building.total_units !== undefined && (
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {building.total_units}
                      </div>
                      <div className="text-xs text-green-600">Unités totales</div>
                    </div>
                  )}
                  
                  {building.units_available !== undefined && (
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {building.units_available}
                      </div>
                      <div className="text-xs text-orange-600">Disponibles</div>
                    </div>
                  )}
                  
                  {building.elevator_count !== undefined && (
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {building.elevator_count}
                      </div>
                      <div className="text-xs text-purple-600">Ascenseurs</div>
                    </div>
                  )}
                </div>

                {/* Amenities */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {building.has_pool && (
                    <Badge variant="secondary" className="text-xs flex items-center gap-1">
                      <Waves className="w-3 h-3" />
                      Piscine
                    </Badge>
                  )}
                  {building.has_gym && (
                    <Badge variant="secondary" className="text-xs flex items-center gap-1">
                      <Dumbbell className="w-3 h-3" />
                      Gym
                    </Badge>
                  )}
                  {building.has_spa && (
                    <Badge variant="secondary" className="text-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Spa
                    </Badge>
                  )}
                  {building.has_parking && (
                    <Badge variant="secondary" className="text-xs flex items-center gap-1">
                      <Car className="w-3 h-3" />
                      Parking {building.parking_type && `(${building.parking_type})`}
                    </Badge>
                  )}
                  {building.has_security_system && (
                    <Badge variant="secondary" className="text-xs flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Sécurité
                    </Badge>
                  )}
                  {building.has_concierge && (
                    <Badge variant="secondary" className="text-xs flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      Concierge
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Building Modal */}
      <BuildingModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        building={editingBuilding}
        onSave={handleSaveBuilding}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!deletingBuildingId} 
        onOpenChange={() => setDeletingBuildingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce bâtiment ? Cette action est irréversible.
              Toutes les unités associées seront également supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}