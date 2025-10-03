import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Building, Edit, Trash2, Eye, MapPin, Euro, Home } from 'lucide-react';
import { PropertyModal } from './PropertyModal';
import { Property, PropertyFormData } from '@/types/property';
import {
  fetchPropertiesByProject,
  fetchPropertiesByBuilding,
  createProperty,
  updateProperty,
  deleteProperty
} from '@/lib/api/properties';
import { useToast } from '@/hooks/use-toast';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PropertiesSectionProps {
  projectId: string;
  buildings: Array<{
    id: string;
    building_name: string;
    building_type: string;
    total_units?: number;
    units_available?: number;
  }>;
}

export function PropertiesSection({ projectId, buildings }: PropertiesSectionProps) {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch properties based on building selection
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['properties', projectId, selectedBuilding],
    queryFn: () => {
      if (selectedBuilding === 'all') {
        return fetchPropertiesByProject(projectId);
      } else {
        return fetchPropertiesByBuilding(selectedBuilding);
      }
    },
  });

  // Create property mutation
  const createMutation = useMutation({
    mutationFn: (data: PropertyFormData) => createProperty(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast({
        title: 'Propriété créée',
        description: 'La propriété a été créée avec succès.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Erreur lors de la création.',
        variant: 'destructive',
      });
    },
  });

  // Update property mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PropertyFormData> }) => 
      updateProperty(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast({
        title: 'Propriété mise à jour',
        description: 'La propriété a été mise à jour avec succès.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Erreur lors de la mise à jour.',
        variant: 'destructive',
      });
    },
  });

  // Delete property mutation
  const deleteMutation = useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast({
        title: 'Propriété supprimée',
        description: 'La propriété a été supprimée avec succès.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Erreur lors de la suppression.',
        variant: 'destructive',
      });
    },
  });

  const handleSave = async (data: PropertyFormData) => {
    try {
      if (selectedProperty) {
        await updateMutation.mutateAsync({ id: selectedProperty.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      // Fermer le modal et réinitialiser l'état seulement en cas de succès
      setModalOpen(false);
      setSelectedProperty(null);
    } catch (error) {
      // En cas d'erreur, on ne ferme pas le modal pour que l'utilisateur puisse corriger
      console.error('Error saving property:', error);
    }
  };

  const handleEdit = (property: Property) => {
    console.log('[PropertiesSection] Editing property:', property);
    console.log('[PropertiesSection] Property ID:', property?.id);
    if (!property?.id) {
      toast({
        title: 'Erreur',
        description: 'ID de propriété manquant',
        variant: 'destructive',
      });
      return;
    }
    const url = `/admin/properties/${property.id}/edit`;
    console.log('[PropertiesSection] Navigating to:', url);
    navigate(url);
  };

  const handleDelete = (property: Property) => {
    setPropertyToDelete(property);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (propertyToDelete) {
      await deleteMutation.mutateAsync(propertyToDelete.id);
      setDeleteDialogOpen(false);
      setPropertyToDelete(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      available: 'bg-green-100 text-green-800',
      reserved: 'bg-yellow-100 text-yellow-800',
      sold: 'bg-red-100 text-red-800',
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const selectedBuildingData = buildings.find(b => b.id === selectedBuilding);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Propriétés</h3>
          <p className="text-sm text-muted-foreground">
            Gestion des unités et appartements du projet
          </p>
        </div>
        <Button 
          onClick={() => {
            setSelectedProperty(null);
            setModalOpen(true);
          }}
          disabled={buildings.length === 0}
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une propriété
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Select value={selectedBuilding} onValueChange={setSelectedBuilding}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un bâtiment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les bâtiments</SelectItem>
              {buildings.map((building) => (
                <SelectItem key={building.id} value={building.id}>
                  {building.building_name} ({building.total_units || 0} unités)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Total</span>
            </div>
            <p className="text-2xl font-bold">{properties.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm font-medium">Disponibles</span>
            </div>
            <p className="text-2xl font-bold">
              {properties.filter(p => p.sale_status === 'available').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              <span className="text-sm font-medium">Réservées</span>
            </div>
            <p className="text-2xl font-bold">
              {properties.filter(p => p.sale_status === 'reserved').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="text-sm font-medium">Vendues</span>
            </div>
            <p className="text-2xl font-bold">
              {properties.filter(p => p.sale_status === 'sold').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Properties Grid */}
      {isLoading ? (
        <div className="text-center py-8">Chargement...</div>
      ) : properties.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {buildings.length === 0 
              ? 'Créez d\'abord des bâtiments avant d\'ajouter des propriétés.'
              : 'Aucune propriété trouvée.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((property) => {
            const building = buildings.find(b => b.id === property.building_id);
            return (
              <Card key={property.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">
                        {property.property_code || property.unit_number}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        {building?.building_name || 'Bâtiment inconnu'}
                      </p>
                    </div>
                    <Badge className={getStatusBadge(property.sale_status || 'available')}>
                      {property.sale_status === 'available' ? 'Disponible' :
                       property.sale_status === 'reserved' ? 'Réservé' : 'Vendu'}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <p className="font-medium capitalize">{property.property_type}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Étage:</span>
                      <p className="font-medium">{property.floor_number || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Chambres:</span>
                      <p className="font-medium">{property.bedrooms_count || 0}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Surface:</span>
                      <p className="font-medium">{property.internal_area}m²</p>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex items-center gap-1 text-lg font-semibold">
                      <Euro className="w-4 h-4" />
                      {property.price_excluding_vat?.toLocaleString()}
                      {property.golden_visa_eligible && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          Golden Visa
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {property.price_per_sqm?.toLocaleString()}€/m² • 
                      TVA {property.vat_rate || 5}%
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(property)}
                      className="flex-1"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Modifier
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(property)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Property Modal */}
      <PropertyModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        property={selectedProperty}
        buildingId={selectedBuilding !== 'all' ? selectedBuilding : buildings[0]?.id || ''}
        buildingName={selectedBuildingData?.building_name || buildings[0]?.building_name || ''}
        onSave={handleSave}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer la propriété "{propertyToDelete?.property_code}" ?
              Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}