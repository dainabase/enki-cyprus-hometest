import React, { useState } from 'react';
import { Plus, Filter, Trash2, CheckSquare } from 'lucide-react';
import { useSupabaseQuery, getPaginationRange } from '@/hooks/useSupabaseQuery';
import { Pagination } from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ProjectsTable from '@/components/admin/projects/ProjectsTable';
import ProjectForm from '@/components/admin/projects/ProjectForm';
import ProjectFilters from '@/components/admin/projects/ProjectFilters';

// Helper function to safely access developer data
const getDeveloper = (developer: any) => {
  if (!developer || typeof developer !== 'object') return null;
  return developer as { name?: string; [key: string]: any };
};

interface FilterState {
  developerId: string;
  zone: string;
  status: string;
  goldenVisaOnly: boolean;
}

const AdminProjects = () => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 25,
  });
  const [filters, setFilters] = useState<FilterState>({
    developerId: '',
    zone: '',
    status: '',
    goldenVisaOnly: false
  });

  const { data: projectsResponse, isLoading, error, refetch } = useSupabaseQuery(
    ['admin-projects', filters, pagination],
    async () => {
      const { from, to } = getPaginationRange(pagination);
      
      let query = supabase
        .from('projects')
        .select(`
          id, title, status, cyprus_zone, golden_visa_eligible, price, price_from,
          completion_date, units_available, units_sold, total_units, developer_id,
          developer:developers(id, name)
        `, { count: 'exact' })
        .order('developer_id', { ascending: true })
        .order('title', { ascending: true })
        .range(from, to);

      // Apply filters
      if (filters.developerId) {
        query = query.eq('developer_id', filters.developerId);
      }
      if (filters.zone) {
        query = query.eq('cyprus_zone', filters.zone);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.goldenVisaOnly) {
        query = query.eq('golden_visa_eligible', true);
      }

      const { data, error, count } = await query;
      if (error) throw error;
      console.info('🔎 AdminProjects fetch', { totalCount: count, length: data?.length, first: data?.[0]?.id });
      return { data, count };
    }
  );

  React.useEffect(() => {
    if (error) {
      console.error('Erreur chargement projets:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur de chargement',
        description: (error as any).message || 'Impossible de charger les projets'
      });
    }
  }, [error, toast]);

  const projectsData = projectsResponse?.data || [];
  const totalCount = projectsResponse?.count || 0;

  // Fetch developers for filter dropdown
  const { data: developers } = useSupabaseQuery(
    ['developers'],
    async () => {
      const { data, error } = await supabase
        .from('developers')
        .select('id, name')
        .eq('status', 'active')
        .order('name');
      if (error) throw error;
      return data;
    }
  );

  // Group projects by developer
  const groupedProjects = React.useMemo(() => {
    if (!projectsData) return {};
    
    return projectsData.reduce((acc, project) => {
      const developerId = project.developer_id || 'no-developer';
      const developer = getDeveloper(project.developer);
      const developerName = developer?.name || 'Sans développeur';
      
      if (!acc[developerId]) {
        acc[developerId] = {
          developerName,
          projects: []
        };
      }
      acc[developerId].projects.push(project);
      return acc;
    }, {} as Record<string, { developerName: string; projects: any[] }>);
  }, [projectsData]);

  const openCreateModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const openEditModal = (project: any) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleProjectSaved = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    refetch();
    toast({
      title: editingProject ? 'Projet mis à jour' : 'Projet créé',
      description: editingProject 
        ? 'Le projet a été mis à jour avec succès'
        : 'Le nouveau projet a été créé avec succès'
    });
  };

  // Debug helper: create a minimal test project and refetch
  const createTestProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{ 
          title: 'Projet Test (debug)',
          subtitle: 'Insertion manuelle',
          description: 'Projet de test pour validation admin',
          detailed_description: 'Créé automatiquement pour vérifier l’affichage dans la liste.',
          developer_id: null,
          cyprus_zone: 'limassol',
          status: 'under_construction',
          type: 'apartment',
          property_types: ['apartment'],
          price: 150000,
          price_from: null,
          vat_rate: 5,
          completion_date: null,
          golden_visa_eligible: false,
          units_available: 0,
          total_units: 0,
          location: { city: 'Limassol', address: 'Debug', lat: 34.7768, lng: 32.4245 },
          features: [],
          photos: []
        }])
        .select()
        .single();

      if (error) throw error;

      console.info('✅ Projet test créé:', data);
      toast({ title: 'Projet test créé', description: `ID: ${data?.id}` });
      refetch();
    } catch (e: any) {
      console.error('❌ Erreur création projet test:', e);
      toast({ variant: 'destructive', title: 'Erreur création test', description: e?.message || 'Insertion impossible' });
    }
  };

  // Actions globales
  const handleDeleteSelected = async () => {
    if (selectedProjects.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Aucune sélection',
        description: 'Veuillez sélectionner au moins un projet à supprimer.'
      });
      return;
    }

    const confirmMessage = `Êtes-vous sûr de vouloir supprimer ${selectedProjects.length} projet(s) sélectionné(s) ?\n\nCette action est irréversible.`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .in('id', selectedProjects);

      if (error) throw error;

      toast({
        title: 'Projets supprimés',
        description: `${selectedProjects.length} projet(s) ont été supprimés avec succès.`
      });
      
      setSelectedProjects([]);
      refetch();
    } catch (error: any) {
      console.error('Error deleting projects:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || 'Impossible de supprimer les projets'
      });
    }
  };

  const handleSelectAllProjects = () => {
    const allProjectIds = projectsData.map(project => project.id);
    setSelectedProjects(allProjectIds);
    toast({
      title: 'Tous les projets sélectionnés',
      description: `${allProjectIds.length} projet(s) sélectionné(s).`
    });
  };

  const clearSelection = () => {
    setSelectedProjects([]);
  };

  const stats = React.useMemo(() => {
    if (!projectsData) return { total: 0, available: 0, construction: 0, delivered: 0 };
    
    return {
      total: projectsData.length,
      available: projectsData.filter(p => p.status === 'available').length,
      construction: projectsData.filter(p => p.status === 'under_construction').length,
      delivered: projectsData.filter(p => p.status === 'delivered').length
    };
  }, [projectsData]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des Projets</h1>
            <p className="text-muted-foreground mt-2">Gérer les projets par développeur</p>
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
              Nouveau Projet
            </Button>
            <Button variant="secondary" className="gap-2" onClick={createTestProject}>
              Debug: Projet test
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.available}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Construction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.construction}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Livrés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.delivered}</div>
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
              <ProjectFilters
                filters={filters}
                onFiltersChange={setFilters}
                developers={developers || []}
              />
            </CardContent>
          </Card>
        )}

        {/* Barre d'actions globales */}
        {selectedProjects.length > 0 && (
          <Card className="border-l-4 border-l-primary">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-primary" />
                    <span className="font-medium">
                      {selectedProjects.length} projet(s) sélectionné(s)
                    </span>
                  </div>
                  <Button variant="outline" size="sm" onClick={clearSelection}>
                    Désélectionner tout
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSelectAllProjects}
                    className="gap-2"
                  >
                    <CheckSquare className="w-4 h-4" />
                    Tout sélectionner
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleDeleteSelected}
                    className="gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer la sélection
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        <div className="space-y-6">
          {Object.entries(groupedProjects).map(([developerId, group]) => (
            <Card key={developerId}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{group.developerName}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {group.projects.length} projet(s)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProjectsTable
                  projects={group.projects}
                  onEdit={openEditModal}
                  onRefetch={refetch}
                  selectedProjects={selectedProjects}
                  onSelectionChange={setSelectedProjects}
                />
              </CardContent>
            </Card>
          ))}
          
          {projectsData.length > 0 && (
            <Pagination
              pageIndex={pagination.pageIndex}
              pageSize={pagination.pageSize}
              totalCount={totalCount}
              onPageChange={(pageIndex) => setPagination(prev => ({ ...prev, pageIndex }))}
              onPageSizeChange={(pageSize) => setPagination({ pageIndex: 0, pageSize })}
            />
          )}
        </div>

        {/* Project Form Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? 'Modifier le Projet' : 'Nouveau Projet'}
              </DialogTitle>
              <DialogDescription>
                {editingProject 
                  ? 'Modifiez les informations du projet'
                  : 'Créez un nouveau projet immobilier'
                }
              </DialogDescription>
            </DialogHeader>
            <ProjectForm
              project={editingProject}
              developers={developers || []}
              onSave={handleProjectSaved}
              onCancel={() => setIsModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminProjects;