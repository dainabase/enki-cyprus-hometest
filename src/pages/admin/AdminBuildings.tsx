import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import BuildingsTable from '@/components/admin/buildings/BuildingsTable';
import BuildingForm from '@/components/admin/buildings/BuildingForm';
import BuildingFilters from '@/components/admin/buildings/BuildingFilters';

interface FilterState {
  projectId: string;
  constructionStatus: string;
  minFloors: string;
  maxFloors: string;
}

const AdminBuildings = () => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    projectId: '',
    constructionStatus: '',
    minFloors: '',
    maxFloors: ''
  });

  // Fetch buildings with project and properties data
  const { data: buildingsData, isLoading, refetch } = useQuery({
    queryKey: ['admin-buildings', filters],
    queryFn: async () => {
      let query = supabase
        .from('buildings')
        .select(`
          *,
          project:projects(id, title, cyprus_zone),
          properties:projects(properties(id, status))
        `)
        .order('project_id', { ascending: true })
        .order('name', { ascending: true });

      // Apply filters
      if (filters.projectId) {
        query = query.eq('project_id', filters.projectId);
      }
      if (filters.constructionStatus) {
        query = query.eq('construction_status', filters.constructionStatus);
      }
      if (filters.minFloors) {
        query = query.gte('total_floors', parseInt(filters.minFloors));
      }
      if (filters.maxFloors) {
        query = query.lte('total_floors', parseInt(filters.maxFloors));
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  // Fetch projects for filter dropdown
  const { data: projects } = useQuery({
    queryKey: ['projects-for-buildings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, title, cyprus_zone')
        .order('title');
      if (error) throw error;
      return data;
    }
  });

  const openCreateModal = () => {
    setEditingBuilding(null);
    setIsModalOpen(true);
  };

  const openEditModal = (building: any) => {
    setEditingBuilding(building);
    setIsModalOpen(true);
  };

  const handleBuildingSaved = () => {
    setIsModalOpen(false);
    setEditingBuilding(null);
    refetch();
    toast({
      title: editingBuilding ? 'Bâtiment mis à jour' : 'Bâtiment créé',
      description: editingBuilding 
        ? 'Le bâtiment a été mis à jour avec succès'
        : 'Le nouveau bâtiment a été créé avec succès'
    });
  };

  const stats = React.useMemo(() => {
    if (!buildingsData) return { total: 0, planning: 0, inProgress: 0, completed: 0 };
    
    return {
      total: buildingsData.length,
      planning: buildingsData.filter(b => b.construction_status === 'planning').length,
      inProgress: buildingsData.filter(b => ['foundation', 'structure', 'finishing'].includes(b.construction_status)).length,
      completed: buildingsData.filter(b => b.construction_status === 'completed').length
    };
  }, [buildingsData]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des Bâtiments</h1>
            <p className="text-muted-foreground mt-2">Gérer les bâtiments par projet</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtres
            </Button>
            <Button onClick={openCreateModal} className="gap-2">
              <Plus className="w-4 h-4" />
              Nouveau Bâtiment
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bâtiments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Planification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.planning}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Construction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.inProgress}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Terminés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card>
            <CardHeader>
              <CardTitle>Filtres</CardTitle>
            </CardHeader>
            <CardContent>
              <BuildingFilters
                filters={filters}
                onFiltersChange={setFilters}
                projects={projects || []}
              />
            </CardContent>
          </Card>
        )}

        {/* Buildings Table */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des Bâtiments</CardTitle>
            <CardDescription>Gérer tous les bâtiments du portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <BuildingsTable
              buildings={buildingsData || []}
              onEdit={openEditModal}
              onRefetch={refetch}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>

        {/* Building Form Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingBuilding ? 'Modifier le Bâtiment' : 'Nouveau Bâtiment'}
              </DialogTitle>
              <DialogDescription>
                {editingBuilding 
                  ? 'Modifiez les informations du bâtiment'
                  : 'Créez un nouveau bâtiment'
                }
              </DialogDescription>
            </DialogHeader>
            <BuildingForm
              building={editingBuilding}
              projects={projects || []}
              onSave={handleBuildingSaved}
              onCancel={() => setIsModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminBuildings;