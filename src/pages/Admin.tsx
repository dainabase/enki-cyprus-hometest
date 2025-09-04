import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Building, 
  Upload,
  Save,
  X,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Property } from '@/lib/supabase';
import ImageUploader from '@/components/admin/ImageUploader';

interface AdminStats {
  totalProjects: number;
  totalUsers: number;
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
}

const Admin = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<AdminStats>({ totalProjects: 0, totalUsers: 0 });
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
    virtual_tour: ''
  });

  // Load data on component mount
  useEffect(() => {
    if (profile?.role === 'admin') {
      loadAdminData();
    }
  }, [profile]);

  const [isBackfilling, setIsBackfilling] = useState(false);
  const [isEnsuring, setIsEnsuring] = useState(false);

  const handleBackfillPhotos = async () => {
    try {
      setIsBackfilling(true);
      const { data, error } = await supabase.functions.invoke('backfill-project-images', {
        body: { minPhotos: 3, onlyMissing: true },
      });
      if (error) throw error;
      toast({ title: 'Photos uploadées', description: `${data?.processed || 0} projets traités` });
      await loadAdminData();
    } catch (e: any) {
      console.error('Backfill error', e);
      toast({ variant: 'destructive', title: 'Erreur', description: e?.message || "Échec de l'upload des photos" });
    } finally {
      setIsBackfilling(false);
    }
  };

  const handleEnsurePhotos = async () => {
    try {
      setIsEnsuring(true);
      const { data, error } = await supabase.functions.invoke('ensure-project-photos', {
        body: { minPhotos: 4 },
      });
      if (error) throw error;
      toast({ title: 'Photos assurées', description: `${data?.updated || 0} projet(s) mis à jour` });
      await loadAdminData();
    } catch (e: any) {
      console.error('Ensure photos error', e);
      toast({ variant: 'destructive', title: 'Erreur', description: e?.message || "Échec de l'opération" });
    } finally {
      setIsEnsuring(false);
    }
  };

  const loadAdminData = async () => {
    try {
      setIsLoading(true);
      
      // Load stats
      const [projectsCount, usersCount, projectsList] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact' }),
        supabase.from('profiles').select('*', { count: 'exact' }),
        supabase.from('projects').select('*').order('created_at', { ascending: false })
      ]);

      setStats({
        totalProjects: projectsCount.count || 0,
        totalUsers: usersCount.count || 0
      });

      setProjects(projectsList.data || []);
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les données"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProject = async () => {
    try {
      const projectData = {
        ...formData,
        features: Array.isArray(formData.features) ? formData.features : String(formData.features).split(',').map(f => f.trim()),
        detailed_features: Array.isArray(formData.detailed_features) ? formData.detailed_features : String(formData.detailed_features).split(',').map(f => f.trim()),
        photos: Array.isArray(formData.photos) ? formData.photos : String(formData.photos).split(',').map(f => f.trim()),
        plans: Array.isArray(formData.plans) ? formData.plans : String(formData.plans).split(',').map(f => f.trim())
      };

      if (editingProject) {
        // Update existing project
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingProject.id);

        if (error) throw error;

        toast({
          title: "Projet mis à jour",
          description: "Le projet a été mis à jour avec succès"
        });
      } else {
        // Create new project
        const { error } = await supabase
          .from('projects')
          .insert([projectData]);

        if (error) throw error;

        toast({
          title: "Projet créé",
          description: "Le nouveau projet a été créé avec succès"
        });
      }

      setIsModalOpen(false);
      setEditingProject(null);
      resetForm();
      loadAdminData();
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder le projet"
      });
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: "Projet supprimé",
        description: "Le projet a été supprimé avec succès"
      });

      loadAdminData();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le projet"
      });
    }
  };

  const openEditModal = (project: any) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      detailed_description: project.detailed_description || '',
      type: project.type,
      price: project.price,
      location: project.location,
      features: project.features || [],
      detailed_features: project.detailed_features || [],
      photos: project.photos || [],
      plans: project.plans || [],
      virtual_tour: project.virtual_tour || ''
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
      virtual_tour: ''
    });
  };

  const openCreateModal = () => {
    setEditingProject(null);
    resetForm();
    setIsModalOpen(true);
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Accès non autorisé. Seuls les administrateurs peuvent accéder à cette page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Administration ENKI-REALTY</h1>
              <p className="text-muted-foreground mt-2">Gestion des projets et des utilisateurs</p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleBackfillPhotos} variant="outline" disabled={isBackfilling}>
                {isBackfilling ? (
                  <>Upload en cours…</>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Uploader les photos (3+/bien)
                  </>
                )}
              </Button>
              <Button onClick={handleEnsurePhotos} variant="outline" disabled={isEnsuring}>
                {isEnsuring ? (
                  <>Traitement…</>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Assurer 4 photos/bien
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Projets</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProjects}</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Projects List */}
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Projets</CardTitle>
              <CardDescription>Liste des projets immobiliers</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-muted rounded-lg h-32" />
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
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {projects.map((project) => (
                    <motion.div
                      key={project.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        show: { opacity: 1, y: 0 }
                      }}
                    >
                      <Card className="card-hover">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm truncate">{project.title}</h3>
                              <div className="flex items-center text-xs text-muted-foreground mt-1">
                                <MapPin className="w-3 h-3 mr-1" />
                                {project.location?.city}
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {project.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                            {project.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-primary">
                              €{project.price?.toLocaleString()}
                            </span>
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditModal(project)}
                                disabled={isBackfilling}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteProject(project.id)}
                                disabled={isBackfilling}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Project Modal */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProject ? 'Modifier le Projet' : 'Nouveau Projet'}
                </DialogTitle>
                <DialogDescription>
                  {editingProject ? 'Modifiez les informations du projet' : 'Créez un nouveau projet immobilier'}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Titre</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Titre du projet"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Type</label>
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
                    <label className="text-sm font-medium">Prix (€)</label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                      placeholder="Prix"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Ville</label>
                    <Input
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
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Description courte"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Description détaillée</label>
                  <Textarea
                    value={formData.detailed_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, detailed_description: e.target.value }))}
                    placeholder="Description détaillée"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Caractéristiques (séparées par des virgules)</label>
                  <Textarea
                    value={Array.isArray(formData.features) ? formData.features.join(', ') : formData.features}
                    onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value.split(',').map(f => f.trim()) }))}
                    placeholder="Vue mer, Piscine, Garage..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Photos</label>
                  <ImageUploader
                    value={Array.isArray(formData.photos) ? formData.photos : []}
                    onChange={(urls) => setFormData((prev) => ({ ...prev, photos: urls }))}
                  />
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Ou collez des URLs (séparées par des virgules)</label>
                    <Textarea
                      value={Array.isArray(formData.photos) ? formData.photos.join(', ') : formData.photos}
                      onChange={(e) => setFormData(prev => ({ ...prev, photos: e.target.value.split(',').map(f => f.trim()).filter(Boolean) }))}
                      placeholder="https://.../image1.jpg, https://.../image2.jpg"
                      rows={2}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Plans (URLs séparées par des virgules)</label>
                  <Textarea
                    value={Array.isArray(formData.plans) ? formData.plans.join(', ') : formData.plans}
                    onChange={(e) => setFormData(prev => ({ ...prev, plans: e.target.value.split(',').map(f => f.trim()) }))}
                    placeholder="URL des plans..."
                    rows={2}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Visite virtuelle (URL)</label>
                  <Input
                    value={formData.virtual_tour}
                    onChange={(e) => setFormData(prev => ({ ...prev, virtual_tour: e.target.value }))}
                    placeholder="URL de la visite virtuelle"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                    <X className="w-4 h-4 mr-2" />
                    Annuler
                  </Button>
                  <Button onClick={handleSaveProject}>
                    <Save className="w-4 h-4 mr-2" />
                    {editingProject ? 'Mettre à jour' : 'Créer'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;