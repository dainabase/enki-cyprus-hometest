import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Chrome as Home, Search, Euro, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Property } from '@/types/property';
import { deleteProperty } from '@/lib/api/properties';
import { toast } from 'sonner';
import { PropertyCardView } from '@/components/admin/properties/PropertyCardView';
import { PropertyListView } from '@/components/admin/properties/PropertyListView';
import { PropertyTableView } from '@/components/admin/properties/PropertyTableView';
import { PropertyCompactView } from '@/components/admin/properties/PropertyCompactView';
import { PropertyDetailedView } from '@/components/admin/properties/PropertyDetailedView';
import { PropertyViewSelector, PropertyViewType } from '@/components/admin/properties/PropertyViewSelector';

const AdminProperties = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState<PropertyViewType>('cards');
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);

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

  const handleEditProperty = (property) => {
    navigate(`/admin/properties/${property.id}/edit`);
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[hsl(199,63%,59%)] to-[hsl(199,63%,65%)] bg-clip-text text-transparent">Propriétés</h1>
            <p className="text-slate-600 mt-1">
              Gérez toutes les propriétés de votre portefeuille immobilier
            </p>
          </div>
          <Button onClick={() => navigate('/admin/properties/new')} className="gap-2 bg-gradient-to-r from-[hsl(199,63%,59%)] to-[hsl(199,63%,65%)] hover:from-[hsl(199,63%,55%)] hover:to-[hsl(199,63%,60%)] shadow-md hover:shadow-lg transition-all">
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

        <Card className="bg-gradient-to-br from-[hsl(199,63%,95%)] to-[hsl(199,63%,90%)] border-2 border-[hsl(199,63%,75%)] hover:border-[hsl(199,63%,65%)] hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[hsl(199,63%,40%)]">Valeur totale</p>
                <p className="text-xl font-bold text-[hsl(199,63%,30%)]">€{stats.totalValue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[hsl(199,63%,80%)] to-[hsl(199,63%,70%)] rounded-xl flex items-center justify-center">
                <Euro className="h-6 w-6 text-[hsl(199,63%,40%)]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and View Selector */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Rechercher par code, unité, bâtiment ou projet..."
            className="pl-10 border-2 border-slate-200 focus:border-[hsl(199,63%,59%)] focus:ring-[hsl(199,63%,59%)]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <PropertyViewSelector currentView={currentView} onViewChange={setCurrentView} />
      </div>

      {/* Properties Views */}
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
        <>
          {currentView === 'cards' && (
            <PropertyCardView
              properties={filteredProperties}
              onEdit={handleEditProperty}
              onDelete={handleDeleteProperty}
              selectedProperties={selectedProperties}
              onSelectionChange={setSelectedProperties}
              getStatusColor={getStatusColor}
              getStatusLabel={getStatusLabel}
            />
          )}
          {currentView === 'list' && (
            <PropertyListView
              properties={filteredProperties}
              onEdit={handleEditProperty}
              onDelete={handleDeleteProperty}
              selectedProperties={selectedProperties}
              onSelectionChange={setSelectedProperties}
              getStatusColor={getStatusColor}
              getStatusLabel={getStatusLabel}
            />
          )}
          {currentView === 'table' && (
            <PropertyTableView
              properties={filteredProperties}
              onEdit={handleEditProperty}
              onDelete={handleDeleteProperty}
              selectedProperties={selectedProperties}
              onSelectionChange={setSelectedProperties}
              getStatusColor={getStatusColor}
              getStatusLabel={getStatusLabel}
            />
          )}
          {currentView === 'compact' && (
            <PropertyCompactView
              properties={filteredProperties}
              onEdit={handleEditProperty}
              onDelete={handleDeleteProperty}
              selectedProperties={selectedProperties}
              onSelectionChange={setSelectedProperties}
              getStatusColor={getStatusColor}
              getStatusLabel={getStatusLabel}
            />
          )}
          {currentView === 'detailed' && (
            <PropertyDetailedView
              properties={filteredProperties}
              onEdit={handleEditProperty}
              onDelete={handleDeleteProperty}
              selectedProperties={selectedProperties}
              onSelectionChange={setSelectedProperties}
              getStatusColor={getStatusColor}
              getStatusLabel={getStatusLabel}
            />
          )}
        </>
      )}

    </div>
  );
};

export default AdminProperties;