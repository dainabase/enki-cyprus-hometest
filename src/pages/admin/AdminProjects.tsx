import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Filter, Trash2, SquareCheck as CheckSquare, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSupabaseQuery, getPaginationRange } from '@/hooks/useSupabaseQuery';
import { Pagination } from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ProjectsTable from '@/components/admin/projects/ProjectsTable';
import ProjectForm from '@/components/admin/projects/ProjectForm';
import CombinedFiltersAndSort from '@/components/admin/projects/CombinedFiltersAndSort';
import { ProjectViewSelector, ProjectViewType } from '@/components/admin/projects/ProjectViewSelector';
import { ProjectSorter, ProjectSortField, SortDirection } from '@/components/admin/projects/ProjectSorter';
import { ProjectCardView } from '@/components/admin/projects/ProjectCardView';
import { ProjectListView } from '@/components/admin/projects/ProjectListView';
import { ProjectCompactView } from '@/components/admin/projects/ProjectCompactView';
import { ProjectDetailedView } from '@/components/admin/projects/ProjectDetailedView';
import { ProjectTableView } from '@/components/admin/projects/ProjectTableView';
import { PDFExportButton } from '@/components/admin/properties/PDFExportButton';

const getDeveloper = (developer: unknown) => {
  if (!developer || typeof developer !== 'object') return null;
  return developer as { name?: string; [key: string]: unknown };
};

type AdminProjectRow = Record<string, unknown> & {
  id: string;
  title?: string | null;
  developer?: { name?: string | null } | null;
  developer_id?: string | null;
};

interface FilterState {
  developerId: string;
  zone: string;
  status: string;
  goldenVisaOnly: boolean;
}

const AdminProjects = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<AdminProjectRow | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<ProjectViewType>('table');
  const [sortField, setSortField] = useState<ProjectSortField>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 25,
  });
  const [filters, setFilters] = useState<FilterState>({
    developerId: 'all',
    zone: 'all',
    status: 'all',
    goldenVisaOnly: false
  });

  const { data: projectsResponse, isLoading, error, refetch } = useSupabaseQuery(
    ['admin-projects', filters, pagination, sortField, sortDirection],
    async () => {
      const { from, to } = getPaginationRange(pagination);
      
      let query = supabase
        .from('projects')
        .select(`
          *,
          developer:developers!projects_developer_id_fkey(
            id,
            name,
            logo,
            contact_info
          )
        `, { count: 'exact' })
        .range(from, to);

      // Apply sorting
      if (sortField === 'developer') {
        query = query.order('developer_id', { ascending: sortDirection === 'asc' });
      } else if (sortField === 'city') {
        query = query.order('city', { ascending: sortDirection === 'asc' });
      } else if (sortField === 'neighborhood') {
        query = query.order('neighborhood', { ascending: sortDirection === 'asc' });
      } else if (sortField === 'zone') {
        query = query.order('cyprus_zone', { ascending: sortDirection === 'asc' });
      } else {
        query = query.order(sortField, { ascending: sortDirection === 'asc' });
      }
      
      // Secondary sort by title for consistency
      if (sortField !== 'title') {
        query = query.order('title', { ascending: true });
      }

      // Apply filters
      if (filters.developerId && filters.developerId !== 'all') {
        query = query.eq('developer_id', filters.developerId);
      }
      if (filters.zone && filters.zone !== 'all') {
        query = query.eq('cyprus_zone', filters.zone);
      }
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters.goldenVisaOnly) {
        query = query.eq('golden_visa_eligible', true);
      }

      const { data, error, count } = await query;
      if (error) throw error;
      console.info('AdminProjects fetch', { totalCount: count, length: data?.length, first: data?.[0]?.id });
      return { data, count };
    },
    { staleTime: 0, refetchOnMount: 'always', refetchOnReconnect: 'always', refetchOnWindowFocus: true }
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
    },
    { staleTime: 0, refetchOnMount: 'always', refetchOnReconnect: 'always', refetchOnWindowFocus: true }
  );

  // Sort projects based on current sort settings
  const sortedProjects = useMemo(() => {
    if (!projectsData) return [];
    
    return [...projectsData].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'developer':
          aValue = (a as any).developers?.name || '';
          bValue = (b as any).developers?.name || '';
          break;
        case 'city':
          aValue = (a as any).city || '';
          bValue = (b as any).city || '';
          break;
        case 'neighborhood':
          aValue = (a as any).neighborhood || '';
          bValue = (b as any).neighborhood || '';
          break;
        case 'zone':
          aValue = (a as any).cyprus_zone || '';
          bValue = (b as any).cyprus_zone || '';
          break;
        case 'price':
          aValue = (a as any).price_from || 0;
          bValue = (b as any).price_from || 0;
          break;
        default:
          aValue = a[sortField] || '';
          bValue = b[sortField] || '';
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [projectsData, sortField, sortDirection]);

  // Group projects by developer for table view
  const groupedProjects = useMemo(() => {
    if (currentView !== 'table' || !sortedProjects) return {};
    
    return sortedProjects.reduce((acc, project) => {
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
    }, {} as Record<string, { developerName: string; projects: AdminProjectRow[] }>);
  }, [sortedProjects, currentView]);

  const openCreateModal = useCallback(() => {
    setEditingProject(null);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((project: AdminProjectRow) => {
    setEditingProject(project);
    setIsModalOpen(true);
  }, []);

  const handleProjectSaved = useCallback(() => {
    setIsModalOpen(false);
    setEditingProject(null);
    refetch();
    toast({
      title: editingProject ? 'Projet mis à jour' : 'Projet créé',
      description: editingProject
        ? 'Le projet a été mis à jour avec succès'
        : 'Le nouveau projet a été créé avec succès'
    });
  }, [editingProject, refetch, toast]);

  const handleSortChange = useCallback((field: ProjectSortField, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);
  }, []);

  const renderProjectView = () => {
    if (currentView === 'table') {
      return (
        <ProjectTableView
          projects={sortedProjects}
          onEdit={(project) => navigate(`/admin/projects/${project.id}/edit`)}
          selectedProjects={selectedProjects}
          onSelectionChange={setSelectedProjects}
        />
      );
    }

    const commonProps = {
      projects: sortedProjects || [],
      onEdit: (project: AdminProjectRow) => navigate(`/admin/projects/${project.id}/edit`),
      selectedProjects,
      onSelectionChange: setSelectedProjects
    };

    switch (currentView) {
      case 'cards':
        return <ProjectCardView {...commonProps} />;
      case 'list':
        return <ProjectListView {...commonProps} />;
      case 'compact':
        return <ProjectCompactView {...commonProps} />;
      case 'detailed':
        return <ProjectDetailedView {...commonProps} />;
      default:
        return <ProjectCardView {...commonProps} />;
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
        description: `${selectedProjects.length} projet(s) supprimé(s) avec succès`
      });
      
      setSelectedProjects([]);
      refetch();
    } catch (error) {
      console.error('Error deleting projects:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || 'Erreur lors de la suppression des projets'
      });
    }
  };

  const handleSelectAllProjects = () => {
    const allProjectIds = sortedProjects.map(project => project.id);
    setSelectedProjects(allProjectIds);
    toast({
      title: 'Tous les projets sélectionnés',
      description: `${allProjectIds.length} projet(s) sélectionné(s)`
    });
  };

  const clearSelection = () => {
    setSelectedProjects([]);
  };

  const stats = React.useMemo(() => {
    if (!sortedProjects) return { total: 0, available: 0, construction: 0, delivered: 0 };
    
    return {
      total: sortedProjects.length,
      available: sortedProjects.filter(p => p.status === 'available').length,
      construction: sortedProjects.filter(p => p.status === 'under_construction').length,
      delivered: sortedProjects.filter(p => p.status === 'delivered').length
    };
  }, [sortedProjects]);

  return (
    <div className="h-screen flex flex-col">
      {/* Header Section - STICKY */}
      <div className="sticky top-0 z-10 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[hsl(199,63%,59%)] to-[hsl(199,63%,65%)] bg-clip-text text-transparent">Projets</h1>
                <p className="text-slate-600">Gérez votre portfolio de projets immobiliers</p>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate('/admin/ai-import-unified')}
                className="bg-gradient-to-r from-[hsl(199,63%,59%)] to-[hsl(199,63%,65%)] hover:from-[hsl(199,63%,55%)] hover:to-[hsl(199,63%,60%)] text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 gap-2"
                size="sm"
              >
                <Brain className="w-4 h-4" />
                Import IA
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <ProjectViewSelector
                currentView={currentView}
                onViewChange={setCurrentView}
              />
              
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2 border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
              >
                <Filter className="w-4 h-4" />
                Filtres & Tri
              </Button>

              <Button
                onClick={() => navigate('/admin/projects/new')}
                className="bg-gradient-to-r from-[hsl(199,63%,59%)] to-[hsl(199,63%,65%)] hover:from-[hsl(199,63%,55%)] hover:to-[hsl(199,63%,60%)] text-white shadow-md hover:shadow-lg transition-all duration-200 gap-2"
                size="lg"
              >
                <Plus className="w-5 h-5" />
                Nouveau Projet
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100 px-8 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Projets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-700">Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-900">{stats.available}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">En Construction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900">{stats.construction}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Livrés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{stats.delivered}</div>
            </CardContent>
          </Card>
        </div>

        {/* Combined Filters and Sort */}
        {showFilters && (
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-slate-200 shadow-md">
            <CardHeader>
              <CardTitle className="text-slate-900 font-bold">Filtres et Tri</CardTitle>
            </CardHeader>
            <CardContent>
              <CombinedFiltersAndSort
                filters={filters}
                onFiltersChange={setFilters}
                developers={developers || []}
                sortField={sortField}
                sortDirection={sortDirection}
                onSortChange={handleSortChange}
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
                    Tout désélectionner
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <PDFExportButton 
                    selectedPropertyIds={selectedProjects}
                    variant="outline"
                    size="sm"
                  />
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
          {renderProjectView()}
          
          {sortedProjects.length > 0 && (
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