import React, { useState } from 'react';
import { Plus, Filter, Trash2, CheckSquare, Brain } from 'lucide-react';
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
import ProjectFilters from '@/components/admin/projects/ProjectFilters';
import { ProjectViewSelector, ProjectViewType } from '@/components/admin/projects/ProjectViewSelector';
import { ProjectSorter, ProjectSortField, SortDirection } from '@/components/admin/projects/ProjectSorter';
import { ProjectCardView } from '@/components/admin/projects/ProjectCardView';
import { ProjectListView } from '@/components/admin/projects/ProjectListView';
import { ProjectCompactView } from '@/components/admin/projects/ProjectCompactView';
import { ProjectDetailedView } from '@/components/admin/projects/ProjectDetailedView';

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
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
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
    developerId: '',
    zone: '',
    status: '',
    goldenVisaOnly: false
  });

  const { data: projectsResponse, isLoading, error, refetch } = useSupabaseQuery(
    ['admin-projects', filters, pagination, sortField, sortDirection],
    async () => {
      const { from, to } = getPaginationRange(pagination);
      
      let query = supabase
        .from('projects')
        .select(`
          id, title, status, cyprus_zone, golden_visa_eligible, price, price_from,
          completion_date, units_available, units_sold, total_units, developer_id,
          city, neighborhood, description, bedrooms_range, built_area_m2, 
          total_units_new, parking_spaces, energy_rating, created_at,
          developer:developers(id, name)
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
  const sortedProjects = React.useMemo(() => {
    if (!projectsData) return [];
    
    return [...projectsData].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'developer':
          aValue = getDeveloper(a.developer)?.name || '';
          bValue = getDeveloper(b.developer)?.name || '';
          break;
        case 'city':
          aValue = a.city || '';
          bValue = b.city || '';
          break;
        case 'neighborhood':
          aValue = a.neighborhood || '';
          bValue = b.neighborhood || '';
          break;
        case 'zone':
          aValue = a.cyprus_zone || '';
          bValue = b.cyprus_zone || '';
          break;
        case 'price':
          aValue = a.price || a.price_from || 0;
          bValue = b.price || b.price_from || 0;
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
  const groupedProjects = React.useMemo(() => {
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
    }, {} as Record<string, { developerName: string; projects: any[] }>);
  }, [sortedProjects, currentView]);

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

  const handleSortChange = (field: ProjectSortField, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);
  };

  const renderProjectView = () => {
    const projects = currentView === 'table' ? null : sortedProjects;
    
    if (currentView === 'table') {
      return (
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
                  onEdit={(project) => navigate(`/admin/projects/${project.id}/edit`)}
                  onRefetch={refetch}
                  selectedProjects={selectedProjects}
                  onSelectionChange={setSelectedProjects}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    const commonProps = {
      projects: projects || [],
      onEdit: (project: any) => navigate(`/admin/projects/${project.id}/edit`),
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
        title: t('admin.messages.projectsDeleted'),
        description: t('admin.messages.projectsDeletedDesc', { count: selectedProjects.length })
      });
      
      setSelectedProjects([]);
      refetch();
    } catch (error: any) {
      console.error('Error deleting projects:', error);
      toast({
        variant: 'destructive',
        title: t('admin.messages.error'),
        description: error.message || t('admin.messages.errorDeletingProjects')
      });
    }
  };

  const handleSelectAllProjects = () => {
    const allProjectIds = sortedProjects.map(project => project.id);
    setSelectedProjects(allProjectIds);
    toast({
      title: t('admin.messages.allProjectsSelected'),
      description: t('admin.messages.allProjectsSelectedDesc', { count: allProjectIds.length })
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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('admin.titles.projectManagement')}</h1>
            <p className="text-muted-foreground mt-2">{t('admin.titles.projectManagementSubtitle')}</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              {t('admin.buttons.filters')}
            </Button>
            
            <ProjectViewSelector
              currentView={currentView}
              onViewChange={setCurrentView}
            />
            
            <ProjectSorter
              sortField={sortField}
              sortDirection={sortDirection}
              onSortChange={handleSortChange}
            />
            
            <Button 
              variant="outline"
              onClick={() => navigate('/admin/projects/ai-import')} 
              className="gap-2"
            >
              <Brain className="w-4 h-4" />
              Import IA
            </Button>
            
            <Button onClick={() => navigate('/admin/projects/new')} className="gap-2">
              <Plus className="w-4 h-4" />
              {t('admin.buttons.newProject')}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('admin.status.totalProjects')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('admin.status.available')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.available}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('admin.status.underConstruction')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.construction}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('admin.status.delivered')}</CardTitle>
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