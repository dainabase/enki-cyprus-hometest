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
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 -mx-6 -mt-6 px-6 pt-6 pb-4 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Propriétés</h1>
            <p className="text-slate-600 mt-1">
              Gérez toutes les propriétés de votre portefeuille immobilier
            </p>
          </div>
          <Button onClick={() => setShowModal(true)} className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all">
            <Plus className="h-4 w-4" />
            Nouvelle propriété
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total</p>
                <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                <Home className="h-6 w-6 text-slate-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-700">Disponibles</p>
                <p className="text-3xl font-bold text-emerald-900">{stats.available}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
                <Home className="h-6 w-6 text-emerald-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Réservées</p>
                <p className="text-3xl font-bold text-orange-900">{stats.reserved}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                <Home className="h-6 w-6 text-orange-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 hover:border-red-300 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Vendues</p>
                <p className="text-3xl font-bold text-red-900">{stats.sold}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center">
                <Home className="h-6 w-6 text-red-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Valeur totale</p>
                <p className="text-xl font-bold text-blue-900">€{stats.totalValue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                <Euro className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Rechercher par code, unité, bâtiment ou projet..."
          className="pl-10 border-2 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Properties Table */}
      {isLoading ? (
        <div className="text-center py-12">Chargement...</div>
      ) : filteredProperties.length === 0 ? (
        <Card className="bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Home className="h-8 w-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Aucune propriété trouvée
            </h3>
            <p className="text-slate-600">
              {searchTerm 
                ? "Aucun résultat pour votre recherche"
                : "Commencez par créer des bâtiments et y ajouter des propriétés"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white/80 backdrop-blur-sm border-2 border-slate-200 shadow-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-blue-700 border-0">
                    <th className="text-left p-4 font-bold text-white">Code</th>
                    <th className="text-left p-4 font-bold text-white">Unité</th>
                    <th className="text-left p-4 font-bold text-white">Bâtiment</th>
                    <th className="text-left p-4 font-bold text-white">Projet</th>
                    <th className="text-left p-4 font-bold text-white">Type</th>
                    <th className="text-left p-4 font-bold text-white">Surface</th>
                    <th className="text-left p-4 font-bold text-white">Prix TTC</th>
                    <th className="text-left p-4 font-bold text-white">Statut</th>
                    <th className="text-left p-4 font-bold text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProperties.map((property, index) => (
                    <tr key={property.id} className={`border-b hover:bg-blue-50/30 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                    }`}>
                      <td className="p-4 font-bold text-slate-900">{property.property_code}</td>
                      <td className="p-4 font-medium text-slate-700">{property.unit_number}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-slate-500" />
                          <span className="font-medium text-slate-700">{property.building?.building_name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-blue-500" />
                          <div>
                            <div className="font-medium text-slate-900">{property.building?.project?.title}</div>
                            <div className="text-sm text-slate-500">{property.building?.project?.city}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">
                          {property.property_type}
                        </Badge>
                      </td>
                      <td className="p-4 font-medium text-slate-700">{property.internal_area}m²</td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900">€{property.price_including_vat?.toLocaleString()}</div>
                        {property.golden_visa_eligible && (
                          <div className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">Golden Visa</div>
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
                            className="border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                            onClick={() => navigate(`/admin/projects/${property.project_id}/dashboard?tab=properties`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-700 hover:text-blue-800 transition-all duration-200"
                            onClick={() => handleEditProperty(property)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600 hover:text-red-700 transition-all duration-200"
                            onClick={() => handleDeleteProperty(property.id)}
                          >
                            <Trash2 className="h-4 w-4" />
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