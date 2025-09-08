import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit, Trash2, Save, X, MapPin, Upload, Eye, Settings,
  Building, Users, TrendingUp, Star, Image as ImageIcon, FileText,
  AlertCircle, CheckCircle, Clock, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { trackCustomEvent } from '@/lib/analytics';
import ImageUploader from '@/components/admin/ImageUploader';

interface AdminStats {
  totalProjects: number;
  totalUsers: number;
  publishedProjects: number;
  draftProjects: number;
}

interface ProjectFormData {
  title: string;
  description: string;
  detailed_description: string;
  type: string;
  price: number;
  location: {
    lat: number;
    lng: number;
    city: string;
  };
  features: string[];
  detailed_features: string[];
  photos: string[];
  plans: string[];
  virtual_tour: string;
  status: 'draft' | 'published';
  interests?: Array<{
    name: string;
    link: string;
    desc: string;
  }>;
  units?: Array<{
    type: 'appart' | 'villa';
    status: 'available' | 'sold';
    price: string;
    details: string;
  }>;
}

const AdminProjects = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    detailed_description: '',
    type: 'apartment',
    price: 0,
    location: { lat: 34.7768, lng: 32.4245, city: '' },
    features: [],
    detailed_features: [],
    photos: [],
    plans: [],
    virtual_tour: '',
    status: 'draft'
  });
  const [newFeature, setNewFeature] = useState('');
  const [newDetailedFeature, setNewDetailedFeature] = useState('');
  const [newUnit, setNewUnit] = useState({
    type: 'appart' as 'appart' | 'villa',
    status: 'available' as 'available' | 'sold',
    price: '',
    details: ''
  });

  // Fetch admin stats
  const { data: stats = { totalProjects: 0, totalUsers: 0, publishedProjects: 0, draftProjects: 0 } } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [projectsCount, usersCount, projects] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact' }),
        supabase.from('profiles').select('*', { count: 'exact' }),
        supabase.from('projects').select('status')
      ]);

      const published = projects.data?.length || 0;
      const draft = 0;

      return {
        totalProjects: projectsCount.count || 0,
        totalUsers: usersCount.count || 0,
        publishedProjects: published,
        draftProjects: draft
      };
    },
    enabled: profile?.role === 'admin'
  });

  // Fetch projects
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: profile?.role === 'admin'
  });

  // Create/Update project mutation
  const saveProjectMutation = useMutation({
    mutationFn: async (projectData: ProjectFormData) => {
      const dataToSave = {
        ...projectData,
        features: Array.isArray(projectData.features) ? projectData.features : [],
        detailed_features: Array.isArray(projectData.detailed_features) ? projectData.detailed_features : [],
        photos: Array.isArray(projectData.photos) ? projectData.photos : [],
        plans: Array.isArray(projectData.plans) ? projectData.plans : []
      };

      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update(dataToSave)
          .eq('id', editingProject.id);
        if (error) throw error;
        return { action: 'updated', project: editingProject };
      } else {
        const { data, error } = await supabase
          .from('projects')
          .insert([dataToSave])
          .select()
          .single();
        if (error) throw error;
        
        // Trigger interests generation for new projects
        if (dataToSave.location?.city) {
          try {
            await supabase.functions.invoke('fetch-interests', {
              body: { 
                projectId: data.id, 
                location: dataToSave.location.city 
              }
            });
          } catch (err) {
            console.warn('Failed to generate interests:', err);
          }
        }
        
        return { action: 'created', project: data };
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      
      toast({
        title: result.action === 'created' ? "Projet créé" : "Projet mis à jour",
        description: result.action === 'created' 
          ? "Le nouveau projet a été créé avec succès"
          : "Le projet a été mis à jour avec succès"
      });
      
      trackCustomEvent('admin_project_saved', {
        action: result.action,
        project_type: formData.type,
        project_status: formData.status
      });
      
      setIsModalOpen(false);
      setEditingProject(null);
      resetForm();
    },
    onError: (error) => {
      console.error('Error saving project:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder le projet"
      });
    }
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast({
        title: "Projet supprimé",
        description: "Le projet a été supprimé avec succès"
      });
    },
    onError: (error) => {
      console.error('Error deleting project:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le projet"
      });
    }
  });

  // Ensure photos mutation
  const ensurePhotosMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('ensure-project-photos', {
        body: { minPhotos: 4 }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      toast({
        title: 'Photos assurées',
        description: `${data?.updated || 0} projet(s) mis à jour avec des photos`
      });
    },
    onError: (error) => {
      console.error('Ensure photos error:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: "Échec de l'opération de photos"
      });
    }
  });

  const handleSaveProject = () => {
    if (!formData.title || !formData.description || !formData.location.city) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires"
      });
      return;
    }

    saveProjectMutation.mutate(formData);
  };

  const handleDeleteProject = (projectId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;
    deleteProjectMutation.mutate(projectId);
  };

  const openEditModal = (project: any) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      detailed_description: project.detailed_description || '',
      type: project.type || 'apartment',
      price: project.price || 0,
      location: project.location || { lat: 34.7768, lng: 32.4245, city: '' },
      features: project.features || [],
      detailed_features: project.detailed_features || [],
      photos: project.photos || [],
      plans: project.plans || [],
      virtual_tour: project.virtual_tour || '',
      status: project.status || 'draft'
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      detailed_description: '',
      type: 'apartment',
      price: 0,
      location: { lat: 34.7768, lng: 32.4245, city: '' },
      features: [],
      detailed_features: [],
      photos: [],
      plans: [],
      virtual_tour: '',
      status: 'draft'
    });
  };

  const openCreateModal = () => {
    setEditingProject(null);
    resetForm();
    setIsModalOpen(true);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const addDetailedFeature = () => {
    if (newDetailedFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        detailed_features: [...prev.detailed_features, newDetailedFeature.trim()]
      }));
      setNewDetailedFeature('');
    }
  };

  const addUnit = () => {
    if (newUnit.price && newUnit.details) {
      setFormData(prev => ({
        ...prev,
        units: [...(prev.units || []), { ...newUnit }]
      }));
      setNewUnit({
        type: 'appart',
        status: 'available',
        price: '',
        details: ''
      });
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const removeDetailedFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      detailed_features: prev.detailed_features.filter((_, i) => i !== index)
    }));
  };

  const removeUnit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      units: (prev.units || []).filter((_, i) => i !== index)
    }));
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <p className="text-muted-foreground">Accès non autorisé. Seuls les administrateurs peuvent accéder à cette page.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 px-4 py-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Gestion des Projets</h1>
              <p className="text-muted-foreground mt-2">Administrez vos projets immobiliers</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => ensurePhotosMutation.mutate()} 
                variant="outline" 
                disabled={ensurePhotosMutation.isPending}
                className="hidden sm:flex"
              >
                {ensurePhotosMutation.isPending ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
                    />
                    Traitement...
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Assurer 4 photos/projet
                  </>
                )}
              </Button>
              <Button onClick={openCreateModal} className="btn-premium">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Projet
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { title: "Total Projets", value: stats.totalProjects, icon: Building, color: "primary" },
              { title: "Publiés", value: stats.publishedProjects, icon: CheckCircle, color: "green" },
              { title: "Brouillons", value: stats.draftProjects, icon: Clock, color: "orange" },
              { title: "Utilisateurs", value: stats.totalUsers, icon: Users, color: "blue" }
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <stat.icon className={`h-4 w-4 text-${stat.color}-500`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Projects Grid */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Projets Immobiliers
              </CardTitle>
              <CardDescription>Gérez vos propriétés et leurs détails</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-muted rounded-lg h-48" />
                  ))}
                </div>
              ) : (
                <motion.div
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: { staggerChildren: 0.1 }
                    }
                  }}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  <AnimatePresence>
                    {projects.map((project) => (
                      <motion.div
                        key={project.id}
                        layout
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          show: { opacity: 1, y: 0 }
                        }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
                      >
                        <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                          <CardContent className="p-0">
                            {/* Project Image */}
                            <div className="relative h-32 bg-muted">
                              {project.photos && project.photos.length > 0 ? (
                                <img
                                  src={project.photos[0]}
                                  alt={project.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                </div>
                              )}
                              <div className="absolute top-2 right-2">
                              <Badge variant="default">
                                Publié
                                </Badge>
                              </div>
                            </div>
                            
                            {/* Project Info */}
                            <div className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-sm truncate">{project.title}</h3>
                                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                                    <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                                    <span className="truncate">{typeof project.location === 'object' && project.location !== null ? (project.location as any).city : project.location}</span>
                                  </div>
                                </div>
                                <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
                                  {project.property_category || 'Résidentiel'}
                                </Badge>
                              </div>
                              
                              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                                {project.description}
                              </p>
                              
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-primary text-sm">
                                  €{project.price?.toLocaleString()}
                                </span>
                                <div className="flex gap-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openEditModal(project)}
                                    disabled={saveProjectMutation.isPending}
                                  >
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteProject(project.id)}
                                    disabled={deleteProjectMutation.isPending}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Project Modal */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {editingProject ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  {editingProject ? 'Modifier le Projet' : 'Nouveau Projet'}
                </DialogTitle>
                <DialogDescription>
                  {editingProject ? 'Modifiez les informations du projet' : 'Créez un nouveau projet immobilier'}
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Informations</TabsTrigger>
                  <TabsTrigger value="media">Médias</TabsTrigger>
                  <TabsTrigger value="features">Caractéristiques</TabsTrigger>
                  <TabsTrigger value="units">Unités</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Titre *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Titre du projet"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Type *</Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="apartment">Appartement</SelectItem>
                          <SelectItem value="villa">Villa</SelectItem>
                          <SelectItem value="penthouse">Penthouse</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                          <SelectItem value="maison">Maison</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Prix (€) *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                        placeholder="Prix"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">Ville *</Label>
                      <Input
                        id="city"
                        value={formData.location.city}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          location: { ...prev.location, city: e.target.value } 
                        }))}
                        placeholder="Ville"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Description courte"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="detailed_description">Description détaillée</Label>
                    <Textarea
                      id="detailed_description"
                      value={formData.detailed_description}
                      onChange={(e) => setFormData(prev => ({ ...prev, detailed_description: e.target.value }))}
                      placeholder="Description complète du projet"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="status">Statut</Label>
                    <Select value={formData.status} onValueChange={(value: 'draft' | 'published') => setFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Brouillon</SelectItem>
                        <SelectItem value="published">Publié</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="media" className="space-y-4">
                  <div>
                    <Label>Photos du projet</Label>
        <ImageUploader 
          value={formData.photos || []} 
          onChange={(urls) => setFormData(prev => ({ ...prev, photos: urls }))} 
        />
                    {formData.photos.length > 0 && (
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        {formData.photos.map((photo, index) => (
                          <div key={index} className="relative">
                            <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-20 object-cover rounded" />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 p-0"
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                photos: prev.photos.filter((_, i) => i !== index)
                              }))}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="virtual_tour">Visite virtuelle (URL)</Label>
                    <Input
                      id="virtual_tour"
                      value={formData.virtual_tour}
                      onChange={(e) => setFormData(prev => ({ ...prev, virtual_tour: e.target.value }))}
                      placeholder="URL de la visite virtuelle"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="features" className="space-y-4">
                  <div>
                    <Label>Caractéristiques principales</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        placeholder="Nouvelle caractéristique"
                        onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                      />
                      <Button onClick={addFeature} variant="outline">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {feature}
                          <X 
                            className="w-3 h-3 cursor-pointer" 
                            onClick={() => removeFeature(index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Caractéristiques détaillées</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newDetailedFeature}
                        onChange={(e) => setNewDetailedFeature(e.target.value)}
                        placeholder="Nouvelle caractéristique détaillée"
                        onKeyPress={(e) => e.key === 'Enter' && addDetailedFeature()}
                      />
                      <Button onClick={addDetailedFeature} variant="outline">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.detailed_features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          {feature}
                          <X 
                            className="w-3 h-3 cursor-pointer" 
                            onClick={() => removeDetailedFeature(index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="units" className="space-y-4">
                  <div>
                    <Label>Ajouter une unité</Label>
                    <div className="grid grid-cols-2 gap-4 p-4 border border-border rounded-lg">
                      <Select value={newUnit.type} onValueChange={(value: 'appart' | 'villa') => setNewUnit(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="appart">Appartement</SelectItem>
                          <SelectItem value="villa">Villa</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={newUnit.status} onValueChange={(value: 'available' | 'sold') => setNewUnit(prev => ({ ...prev, status: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Disponible</SelectItem>
                          <SelectItem value="sold">Vendu</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Input
                        value={newUnit.price}
                        onChange={(e) => setNewUnit(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="Prix (ex: €450,000)"
                      />
                      
                      <Input
                        value={newUnit.details}
                        onChange={(e) => setNewUnit(prev => ({ ...prev, details: e.target.value }))}
                        placeholder="Détails (ex: 3 chambres)"
                      />
                      
                      <div className="col-span-2">
                        <Button onClick={addUnit} className="w-full">
                          <Plus className="w-4 h-4 mr-2" />
                          Ajouter l'unité
                        </Button>
                      </div>
                    </div>
                  </div>

                  {formData.units && formData.units.length > 0 && (
                    <div>
                      <Label>Unités existantes</Label>
                      <div className="space-y-2">
                        {formData.units.map((unit, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                            <div>
                              <span className="font-medium">{unit.type === 'villa' ? 'Villa' : 'Appartement'}</span>
                              <span className="mx-2">•</span>
                              <span className="text-primary font-semibold">{unit.price}</span>
                              <span className="mx-2">•</span>
                              <Badge variant={unit.status === 'available' ? 'default' : 'destructive'}>
                                {unit.status === 'available' ? 'Disponible' : 'Vendu'}
                              </Badge>
                              <p className="text-sm text-muted-foreground mt-1">{unit.details}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeUnit(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Annuler
                </Button>
                <Button 
                  onClick={handleSaveProject} 
                  disabled={saveProjectMutation.isPending}
                  className="btn-premium"
                >
                  {saveProjectMutation.isPending ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {editingProject ? 'Mettre à jour' : 'Créer'}
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminProjects;