import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Building2, Search, MapPin, Chrome as Home, Car, Layers, Calendar, ArrowRight, Plus, CreditCard as Edit, Trash2 } from 'lucide-react';
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
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 -mx-6 -mt-6 px-6 pt-6 pb-4 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Bâtiments</h1>
            <p className="text-slate-600 mt-1">
              Gérez tous les bâtiments de vos projets immobiliers
            </p>
          </div>
          <Button onClick={() => navigate('/admin/buildings/new')} className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all">
            <Plus className="h-4 w-4" />
            Nouveau bâtiment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Bâtiments</p>
                <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                <Building2 className="h-6 w-6 text-slate-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-700">Avec Propriétés</p>
                <p className="text-3xl font-bold text-emerald-900">{stats.withProperties}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
                <Home className="h-6 w-6 text-emerald-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Unités</p>
                <p className="text-3xl font-bold text-blue-900">{stats.totalUnits}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                <Layers className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Disponibles</p>
                <p className="text-3xl font-bold text-orange-900">{stats.availableUnits}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                <Home className="h-6 w-6 text-orange-700" />
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
          placeholder="Rechercher par nom, projet ou type..."
          className="pl-10 border-2 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Buildings Grid */}
      {isLoading ? (
        <div className="text-center py-12">Chargement...</div>
      ) : filteredBuildings.length === 0 ? (
        <Card className="bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-8 w-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Aucun bâtiment trouvé
            </h3>
            <p className="text-slate-600">
              {searchTerm 
                ? "Aucun résultat pour votre recherche"
                : "Commencez par créer un projet et y ajouter des bâtiments"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuildings.map((building) => (
            <Card key={building.id} className="bg-white/90 backdrop-blur-sm border-2 border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="bg-gradient-to-br from-slate-50 to-blue-50/30">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-900">
                      {building.building_name}
                    </CardTitle>
                    <p className="text-sm text-slate-600 font-medium mt-1">
                      {building.project?.title}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 font-medium">
                    {building.building_type || 'Résidentiel'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Layers className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{building.total_floors || 0} étages</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Home className="h-4 w-4 text-emerald-500" />
                    <span className="font-medium">{building.properties_count} propriétés</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Car className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">Parking</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <MapPin className="h-4 w-4 text-red-500" />
                    <span className="font-medium">{building.project?.cyprus_zone}</span>
                  </div>
                </div>

                {building.construction_status && (
                  <div className="flex items-center gap-2 text-sm bg-slate-50 p-2 rounded-lg">
                    <Calendar className="h-4 w-4 text-slate-600" />
                    <span className="text-slate-700 font-medium">Statut: {building.construction_status}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                  <div className="text-sm">
                    <span className="font-bold text-slate-900">{building.units_available || 0}</span>
                    <span className="text-slate-600"> / {building.total_units || 0} disponibles</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-700 hover:text-blue-800 transition-all duration-200"
                      onClick={() => handleEditBuilding(building)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600 hover:text-red-700 transition-all duration-200"
                      onClick={() => handleDeleteBuilding(building.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
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