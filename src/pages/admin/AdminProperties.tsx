import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Search, 
  MapPin, 
  Building2,
  Euro,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PropertyGlobalModal } from '@/components/admin/properties/PropertyGlobalModal';
import { Property, PropertyFormData } from '@/types/property';
import { createProperty, updateProperty, deleteProperty } from '@/lib/api/properties';
import { toast } from 'sonner';

const AdminProperties = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);

  // Fetch toutes les propriétés avec leurs bâtiments et projets
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['all-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          building:buildings(
            id, 
            building_name, 
            project:projects(id, title, city)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Property[];
    }
  });

  // Create property mutation
  const createMutation = useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: PropertyFormData }) => 
      createProperty(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-properties'] });
      toast.success('Propriété créée avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la création de la propriété');
      console.error(error);
    }
  });

  // Update property mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PropertyFormData> }) => 
      updateProperty(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-properties'] });
      toast.success('Propriété modifiée avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la modification de la propriété');
      console.error(error);
    }
  });

  // Delete property mutation
  const deleteMutation = useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-properties'] });
      toast.success('Propriété supprimée avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la suppression de la propriété');
      console.error(error);
    }
  });

  // Filtrer les propriétés
  const filteredProperties = properties.filter(property =>
    property.unit_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.property_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.building?.building_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.building?.project?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistiques
  const stats = {
    total: properties.length,
    available: properties.filter(p => p.sale_status === 'available').length,
    reserved: properties.filter(p => p.sale_status === 'reserved').length,
    sold: properties.filter(p => p.sale_status === 'sold').length,
    totalValue: properties.reduce((sum, p) => sum + (p.price_including_vat || 0), 0)
  };

  const handleSaveProperty = async (data: PropertyFormData) => {
    const projectId = properties.find(p => p.building_id === data.building_id)?.project_id;
    
    if (editingProperty) {
      await updateMutation.mutateAsync({ id: editingProperty.id, data });
    } else if (projectId) {
      await createMutation.mutateAsync({ projectId, data });
    }
    setEditingProperty(null);
  };

  const handleEditProperty = (property) => {
    setEditingProperty(property);
    setShowModal(true);
  };

  const handleDeleteProperty = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette propriété ?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'reserved': return 'bg-orange-100 text-orange-800';
      case 'sold': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'reserved': return 'Réservé';
      case 'sold': return 'Vendu';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Propriétés</h1>
          <p className="text-gray-500 mt-1">
            Gérez toutes les propriétés de votre portefeuille immobilier
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle propriété
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Home className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Disponibles</p>
                <p className="text-2xl font-bold">{stats.available}</p>
              </div>
              <Home className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Réservées</p>
                <p className="text-2xl font-bold">{stats.reserved}</p>
              </div>
              <Home className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Vendues</p>
                <p className="text-2xl font-bold">{stats.sold}</p>
              </div>
              <Home className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Valeur totale</p>
                <p className="text-lg font-bold">€{stats.totalValue.toLocaleString()}</p>
              </div>
              <Euro className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Rechercher par code, unité, bâtiment ou projet..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Properties Table */}
      {isLoading ? (
        <div className="text-center py-12">Chargement...</div>
      ) : filteredProperties.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune propriété trouvée
            </h3>
            <p className="text-gray-500">
              {searchTerm 
                ? "Aucun résultat pour votre recherche"
                : "Commencez par créer des bâtiments et y ajouter des propriétés"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-4 font-medium">Code</th>
                    <th className="text-left p-4 font-medium">Unité</th>
                    <th className="text-left p-4 font-medium">Bâtiment</th>
                    <th className="text-left p-4 font-medium">Projet</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Surface</th>
                    <th className="text-left p-4 font-medium">Prix TTC</th>
                    <th className="text-left p-4 font-medium">Statut</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProperties.map((property) => (
                    <tr key={property.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{property.property_code}</td>
                      <td className="p-4">{property.unit_number}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          {property.building?.building_name}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="font-medium">{property.building?.project?.title}</div>
                            <div className="text-sm text-gray-500">{property.building?.project?.city}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">
                          {property.property_type}
                        </Badge>
                      </td>
                      <td className="p-4">{property.internal_area}m²</td>
                      <td className="p-4">
                        <div className="font-medium">€{property.price_including_vat?.toLocaleString()}</div>
                        {property.golden_visa_eligible && (
                          <div className="text-xs text-green-600">Golden Visa</div>
                        )}
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusColor(property.sale_status)}>
                          {getStatusLabel(property.sale_status)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditProperty(property)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteProperty(property.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/admin/projects/${property.project_id}/dashboard?tab=properties`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Property Modal */}
      <PropertyGlobalModal
        open={showModal}
        onOpenChange={setShowModal}
        property={editingProperty}
        onSave={handleSaveProperty}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default AdminProperties;