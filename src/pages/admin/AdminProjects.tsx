import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  MapPin,
  Image as ImageIcon,
  FileText,
  Eye,
  Users,
  Building,
  AlertCircle,
  CheckCircle,
  Clock
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
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { trackCustomEvent } from '@/lib/analytics';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface ProjectFormData {
  title: string;
  subtitle?: string;
  description: string;
  detailed_description?: string;
  type: string;
  price: number;
  price_from?: string;
  location: {
    lat: number;
    lng: number;
    city: string;
    address?: string;
  };
  features: string[];
  detailed_features: string[];
  amenities: string[];
  photos: string[];
  plans: string[];
  virtual_tour_url?: string;
  video_url?: string;
  status: string;
  completion_date?: string;
  furniture_status?: string;
  livability: boolean;
  developer_id?: string;
  units: Array<{
    type: string;
    status: 'available' | 'sold';
    price?: string;
    details?: string;
  }>;
  interests: Array<{
    name: string;
    link: string;
    description: string;
    distance?: string;
  }>;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const AdminProjects = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    subtitle: '',
    description: '',
    detailed_description: '',
    type: 'apartment',
    price: 0,
    price_from: '',
    location: { lat: 34.7768, lng: 32.4245, city: '', address: '' },
    features: [],
    detailed_features: [],
    amenities: [],
    photos: [],
    plans: [],
    virtual_tour_url: '',
    video_url: '',
    status: 'under_construction',
    completion_date: '',
    furniture_status: '',
    livability: false,
    developer_id: '',
    units: [],
    interests: []
  });

  // Fetch projects
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['admin-projects-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Create/Update project mutation  
  const saveProjectMutation = useMutation({
    mutationFn: async (projectData: ProjectFormData) => {
      const dataToSave = {
        ...projectData,
        features: Array.isArray(projectData.features) ? projectData.features : [],
        detailed_features: Array.isArray(projectData.detailed_features) ? projectData.detailed_features : [],
        amenities: Array.isArray(projectData.amenities) ? projectData.amenities : [],
        photos: Array.isArray(projectData.photos) ? projectData.photos : [],
        plans: Array.isArray(projectData.plans) ? projectData.plans : [],
        units: Array.isArray(projectData.units) ? projectData.units : [],
        interests: Array.isArray(projectData.interests) ? projectData.interests : []
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
      queryClient.invalidateQueries({ queryKey: ['admin-projects-list'] });
      
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
      queryClient.invalidateQueries({ queryKey: ['admin-projects-list'] });
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
      subtitle: project.subtitle || '',
      description: project.description || '',
      detailed_description: project.detailed_description || '',
      type: project.type || 'apartment',
      price: project.price || 0,
      price_from: project.price_from || '',
      location: project.location || { lat: 34.7768, lng: 32.4245, city: '', address: '' },
      features: project.features || [],
      detailed_features: project.detailed_features || [],
      amenities: project.amenities || [],
      photos: project.photos || [],
      plans: project.plans || [],
      virtual_tour_url: project.virtual_tour_url || '',
      video_url: project.video_url || '',
      status: project.status || 'under_construction',
      completion_date: project.completion_date || '',
      furniture_status: project.furniture_status || '',
      livability: project.livability || false,
      developer_id: project.developer_id || '',
      units: project.units || [],
      interests: project.interests || []
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      detailed_description: '',
      type: 'apartment',
      price: 0,
      price_from: '',
      location: { lat: 34.7768, lng: 32.4245, city: '', address: '' },
      features: [],
      detailed_features: [],
      amenities: [],
      photos: [],
      plans: [],
      virtual_tour_url: '',
      video_url: '',
      status: 'under_construction',
      completion_date: '',
      furniture_status: '',
      livability: false,
      developer_id: '',
      units: [],
      interests: []
    });
    setActiveTab('general');
  };

  const openCreateModal = () => {
    setEditingProject(null);
    resetForm();
    setIsModalOpen(true);
  };

  const addArrayItem = (field: keyof ProjectFormData, value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()]
      }));
    }
  };

  const removeArrayItem = (field: keyof ProjectFormData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <LoadingSpinner size="lg" text="Chargement des projets..." />
      </div>
    );
  }

  const statusColors = {
    'under_construction': { bg: 'bg-orange-100', text: 'text-orange-800', label: 'En construction' },
    'completed': { bg: 'bg-green-100', text: 'text-green-800', label: 'Terminé' },
    'available': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Disponible' },
    'sold': { bg: 'bg-red-100', text: 'text-red-800', label: 'Vendu' }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-light tracking-tight text-primary">
              Gestion des Projets
            </h1>
            <p className="text-lg text-secondary mt-2">
              Administrez vos propriétés immobilières
            </p>
          </div>
          <Button onClick={openCreateModal} className="btn-premium">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Projet
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {[
          { title: "Total Projets", value: projects.length, icon: Building, color: "primary" },
          { title: "Disponibles", value: projects.filter(p => p.status === 'available').length, icon: CheckCircle, color: "success" },
          { title: "En Construction", value: projects.filter(p => p.status === 'under_construction').length, icon: Clock, color: "orange" },
          { title: "Vendus", value: projects.filter(p => p.status === 'sold').length, icon: Users, color: "blue" }
        ].map((stat, index) => (
          <motion.div key={stat.title} variants={item}>
            <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-secondary">
                  {stat.title}
                </CardTitle>
                <div className="p-2 rounded-lg bg-primary/10">
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-light tracking-tight text-primary">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Projects Grid */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Building className="w-5 h-5" />
            Projets Immobiliers
          </CardTitle>
          <CardDescription>
            Gérez vos propriétés et leurs détails
          </CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  variants={item}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 h-full">
                    <CardContent className="p-0">
                      {/* Project Image */}
                      <div className="aspect-video relative overflow-hidden rounded-t-lg bg-accent">
                        {project.photos?.[0] ? (
                          <img
                            src={project.photos[0]}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-12 h-12 text-secondary/50" />
                          </div>
                        )}
                        
                        {/* Status Badge */}
                        <div className="absolute top-3 left-3">
                          <Badge 
                            className={`${statusColors[project.status as keyof typeof statusColors]?.bg} ${statusColors[project.status as keyof typeof statusColors]?.text} border-0`}
                          >
                            {statusColors[project.status as keyof typeof statusColors]?.label || project.status}
                          </Badge>
                        </div>

                        {/* Price */}
                        <div className="absolute bottom-3 right-3">
                          <Badge variant="secondary" className="bg-black/70 text-white border-0">
                            €{project.price?.toLocaleString()}
                          </Badge>
                        </div>
                      </div>

                      {/* Project Content */}
                      <div className="p-4 space-y-3">
                        <div>
                          <h3 className="font-semibold text-primary line-clamp-1">
                            {project.title}
                          </h3>
                          {project.subtitle && (
                            <p className="text-sm text-secondary line-clamp-1 mt-1">
                              {project.subtitle}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center text-sm text-secondary">
                          <MapPin className="w-4 h-4 mr-1" />
                          {project.location?.city || 'Non spécifié'}
                        </div>

                        <p className="text-sm text-secondary line-clamp-2">
                          {project.description}
                        </p>

                        {/* Type & Features */}
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {project.type}
                          </Badge>
                          {project.livability && (
                            <Badge variant="outline" className="text-xs text-success">
                              Habitable
                            </Badge>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2 text-xs text-secondary">
                            <Eye className="w-3 h-3" />
                            <span>{project.units?.length || 0} unités</span>
                          </div>
                          
                          <div className="flex gap-2">
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
        </CardContent>
      </Card>

      {/* Project Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-primary">
              {editingProject ? 'Modifier le Projet' : 'Nouveau Projet'}
            </DialogTitle>
            <DialogDescription>
              {editingProject ? 'Modifiez les informations du projet' : 'Créez un nouveau projet immobilier'}
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">Général</TabsTrigger>
              <TabsTrigger value="media">Médias</TabsTrigger>
              <TabsTrigger value="features">Caractéristiques</TabsTrigger>
              <TabsTrigger value="units">Unités</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 mt-6">
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
                  <Label htmlFor="subtitle">Sous-titre</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="Sous-titre du projet"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <Label htmlFor="status">Statut</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under_construction">En construction</SelectItem>
                      <SelectItem value="completed">Terminé</SelectItem>
                      <SelectItem value="available">Disponible</SelectItem>
                      <SelectItem value="sold">Vendu</SelectItem>
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
                  <Label htmlFor="price_from">À partir de</Label>
                  <Input
                    id="price_from"
                    value={formData.price_from}
                    onChange={(e) => setFormData(prev => ({ ...prev, price_from: e.target.value }))}
                    placeholder="ex: €450,000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    value={formData.location.address}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      location: { ...prev.location, address: e.target.value }
                    }))}
                    placeholder="Adresse complète"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description courte du projet"
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="completion_date">Date d'achèvement</Label>
                  <Input
                    id="completion_date"
                    value={formData.completion_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, completion_date: e.target.value }))}
                    placeholder="ex: Q2 2025"
                  />
                </div>
                <div>
                  <Label htmlFor="furniture_status">Statut mobilier</Label>
                  <Select value={formData.furniture_status} onValueChange={(value) => setFormData(prev => ({ ...prev, furniture_status: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="furnished">Meublé</SelectItem>
                      <SelectItem value="unfurnished">Non meublé</SelectItem>
                      <SelectItem value="semi-furnished">Semi-meublé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-4 mt-6">
              <div>
                <Label>Photos (URLs, une par ligne)</Label>
                <Textarea
                  value={formData.photos.join('\n')}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    photos: e.target.value.split('\n').filter(url => url.trim()) 
                  }))}
                  placeholder="https://exemple.com/photo1.jpg&#10;https://exemple.com/photo2.jpg"
                  rows={4}
                />
              </div>

              <div>
                <Label>Plans (URLs, une par ligne)</Label>
                <Textarea
                  value={formData.plans.join('\n')}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    plans: e.target.value.split('\n').filter(url => url.trim()) 
                  }))}
                  placeholder="https://exemple.com/plan1.jpg"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="virtual_tour_url">Visite virtuelle URL</Label>
                  <Input
                    id="virtual_tour_url"
                    value={formData.virtual_tour_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, virtual_tour_url: e.target.value }))}
                    placeholder="https://matterport.com/..."
                  />
                </div>
                <div>
                  <Label htmlFor="video_url">Vidéo URL</Label>
                  <Input
                    id="video_url"
                    value={formData.video_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-4 mt-6">
              <div>
                <Label>Caractéristiques principales</Label>
                <Textarea
                  value={formData.features.join('\n')}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    features: e.target.value.split('\n').filter(f => f.trim()) 
                  }))}
                  placeholder="Vue sur mer&#10;Balcon&#10;Parking"
                  rows={4}
                />
              </div>

              <div>
                <Label>Caractéristiques détaillées</Label>
                <Textarea
                  value={formData.detailed_features.join('\n')}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    detailed_features: e.target.value.split('\n').filter(f => f.trim()) 
                  }))}
                  placeholder="Cuisine équipée&#10;Climatisation&#10;Double vitrage"
                  rows={4}
                />
              </div>

              <div>
                <Label>Équipements et services</Label>
                <Textarea
                  value={formData.amenities.join('\n')}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    amenities: e.target.value.split('\n').filter(a => a.trim()) 
                  }))}
                  placeholder="Piscine&#10;Salle de sport&#10;Concierge"
                  rows={4}
                />
              </div>
            </TabsContent>

            <TabsContent value="units" className="space-y-4 mt-6">
              <div>
                <Label>Unités disponibles (JSON)</Label>
                <Textarea
                  value={JSON.stringify(formData.units, null, 2)}
                  onChange={(e) => {
                    try {
                      const units = JSON.parse(e.target.value);
                      setFormData(prev => ({ ...prev, units }));
                    } catch (err) {
                      // Invalid JSON, ignore
                    }
                  }}
                  placeholder='[{"type": "2BR", "status": "available", "price": "€450,000", "details": "85m²"}]'
                  rows={6}
                />
              </div>

              <div>
                <Label>Points d'intérêt (JSON)</Label>
                <Textarea
                  value={JSON.stringify(formData.interests, null, 2)}
                  onChange={(e) => {
                    try {
                      const interests = JSON.parse(e.target.value);
                      setFormData(prev => ({ ...prev, interests }));
                    } catch (err) {
                      // Invalid JSON, ignore
                    }
                  }}
                  placeholder='[{"name": "Plage", "link": "#", "description": "Plage de sable fin", "distance": "300m"}]'
                  rows={6}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              <X className="w-4 h-4 mr-2" />
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
                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
                  />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};