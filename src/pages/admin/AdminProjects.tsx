import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Filter } from 'lucide-react';
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
  const [filters, setFilters] = useState<FilterState>({
    developerId: '',
    zone: '',
    status: '',
    goldenVisaOnly: false
  });

  // Fetch projects with developer data
  const { data: projectsData, isLoading, refetch } = useQuery({
    queryKey: ['admin-projects', filters],
    queryFn: async () => {
      let query = supabase
        .from('projects')
        .select(`
          *,
          developer:developers(id, name, contact_info),
          buildings(count)
        `)
        .order('developer_id', { ascending: true })
        .order('title', { ascending: true });

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

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  // Fetch developers for filter dropdown
  const { data: developers } = useQuery({
    queryKey: ['developers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('developers')
        .select('id, name')
        .eq('status', 'active')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

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

        {/* Projects by Developer */}
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
                />
              </CardContent>
            </Card>
          ))}
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