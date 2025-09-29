import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Search, 
  MapPin, 
  Home,
  Car,
  Layers,
  Calendar,
  ArrowRight,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { fetchAllBuildings, createBuildingGlobal, updateBuilding, deleteBuilding } from '@/lib/api/buildings';
import { BuildingFormData } from '@/types/building';
import { toast } from 'sonner';

const AdminBuildings = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch tous les bâtiments avec leurs projets
  const { data: buildings = [], isLoading } = useQuery({
    queryKey: ['all-buildings'],
    queryFn: async () => {
      const buildingsData = await fetchAllBuildings();
      
      // Calculer le nombre de propriétés pour chaque bâtiment
      const buildingsWithCount = await Promise.all(
        buildingsData.map(async (building) => {
          const { count } = await supabase
            .from('properties')
            .select('*', { count: 'exact', head: true })
            .eq('building_id', building.id);
          
          return {
            ...building,
            properties_count: count || 0
          };
        })
      );
      
      return buildingsWithCount;
    }
  });

  // Delete building mutation
  const deleteMutation = useMutation({
    mutationFn: deleteBuilding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-buildings'] });
      toast.success('Bâtiment supprimé avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la suppression du bâtiment');
      console.error(error);
    }
  });

  const handleEditBuilding = (building) => {
    navigate(`/admin/buildings/${building.id}/edit`);
  };

  const handleDeleteBuilding = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce bâtiment ?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  // Filtrer les bâtiments
  const filteredBuildings = buildings.filter(building =>
    building.building_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    building.project?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    building.building_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistiques
  const stats = {
    total: buildings.length,
    withProperties: buildings.filter(b => b.properties_count > 0).length,
    totalUnits: buildings.reduce((sum, b) => sum + (b.total_units || 0), 0),
    availableUnits: buildings.reduce((sum, b) => sum + (b.units_available || 0), 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bâtiments</h1>
          <p className="text-gray-500 mt-1">
            Gérez tous les bâtiments de vos projets immobiliers
          </p>
        </div>
        <Button onClick={() => navigate('/admin/buildings/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          Nouveau bâtiment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Bâtiments</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Building2 className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avec Propriétés</p>
                <p className="text-2xl font-bold">{stats.withProperties}</p>
              </div>
              <Home className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Unités</p>
                <p className="text-2xl font-bold">{stats.totalUnits}</p>
              </div>
              <Layers className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Disponibles</p>
                <p className="text-2xl font-bold">{stats.availableUnits}</p>
              </div>
              <Home className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Rechercher par nom, projet ou type..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Buildings Grid */}
      {isLoading ? (
        <div className="text-center py-12">Chargement...</div>
      ) : filteredBuildings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun bâtiment trouvé
            </h3>
            <p className="text-gray-500">
              {searchTerm 
                ? "Aucun résultat pour votre recherche"
                : "Commencez par créer un projet et y ajouter des bâtiments"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuildings.map((building) => (
            <Card key={building.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {building.building_name}
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      {building.project?.title}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {building.building_type || 'Résidentiel'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-gray-400" />
                    <span>{building.total_floors || 0} étages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-gray-400" />
                    <span>{building.properties_count} propriétés</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-gray-400" />
                    <span>Parking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{building.project?.cyprus_zone}</span>
                  </div>
                </div>

                {building.construction_status && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>Statut: {building.construction_status}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm">
                    <span className="font-medium">{building.units_available || 0}</span>
                    <span className="text-gray-500"> / {building.total_units || 0} disponibles</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditBuilding(building)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteBuilding(building.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/admin/projects/${building.project_id}/dashboard?tab=buildings`)}
                    >
                      Gérer
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBuildings;