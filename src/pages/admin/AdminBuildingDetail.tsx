import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Edit, Building2, Calendar, Users, Zap, MapPin, Star, X, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import HierarchyBreadcrumb from '@/components/admin/common/HierarchyBreadcrumb';
import { getHierarchyBreadcrumb } from '@/lib/supabase/integrity';
import { fetchBuildingImages, deleteBuildingImage, updateBuildingImagePrimary } from '@/lib/supabase/images';
import { deleteImage, getImagePath } from '@/lib/supabase/storage';
import { useToast } from '@/hooks/use-toast';

const AdminBuildingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch building details
  const { data: building, isLoading, error } = useQuery({
    queryKey: ['admin-building-detail', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('buildings')
        .select(`
          *,
          project:projects(
            id,
            title,
            cyprus_zone,
            developer:developers(name)
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  // Fetch breadcrumb data
  const { data: breadcrumbData } = useQuery({
    queryKey: ['building-breadcrumb', id],
    queryFn: () => getHierarchyBreadcrumb(undefined, id),
    enabled: !!id
  });

  // Fetch building images
  const { data: images = [], refetch: refetchImages } = useQuery({
    queryKey: ['building-images', id],
    queryFn: () => fetchBuildingImages(id!),
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !building) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Bâtiment non trouvé</p>
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin/buildings')}
                className="mt-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux bâtiments
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'planning': { label: 'Planification', color: 'bg-blue-100 text-blue-800' },
      'foundation': { label: 'Fondations', color: 'bg-yellow-100 text-yellow-800' },
      'structure': { label: 'Structure', color: 'bg-orange-100 text-orange-800' },
      'finishing': { label: 'Finitions', color: 'bg-purple-100 text-purple-800' },
      'completed': { label: 'Terminé', color: 'bg-green-100 text-green-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, color: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getProject = (project: any) => {
    if (!project || typeof project !== 'object') return null;
    return project as { title?: string; cyprus_zone?: string; developer?: any; [key: string]: any };
  };

  const getDeveloper = (developer: any) => {
    if (!developer || typeof developer !== 'object') return null;
    return developer as { name?: string; [key: string]: any };
  };

  const project = getProject(building.project);
  const developer = project ? getDeveloper(project.developer) : null;

  const handleDeleteImage = async (imageId: string, imageUrl: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return;
    
    try {
      // Delete from storage
      const imagePath = getImagePath(imageUrl);
      if (imagePath) {
        await deleteImage('buildings', imagePath);
      }
      
      // Delete from database
      await deleteBuildingImage(imageId);
      
      // Reload images
      refetchImages();
      
      toast({
        title: "Image supprimée",
        description: "L'image a été supprimée avec succès"
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer l'image"
      });
    }
  };

  const handleSetPrimaryImage = async (imageId: string) => {
    if (!id) return;
    
    try {
      await updateBuildingImagePrimary(imageId, id);
      refetchImages();
      
      toast({
        title: "Image principale",
        description: "L'image principale a été mise à jour"
      });
    } catch (error) {
      console.error('Error setting primary image:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de définir l'image principale"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <HierarchyBreadcrumb
          developer={breadcrumbData?.developer}
          project={breadcrumbData?.project}
          building={breadcrumbData?.building}
          currentPage="Détail du bâtiment"
        />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/buildings')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{building.building_name}</h1>
              <p className="text-muted-foreground mt-1">
                {project?.title || 'Projet non assigné'}
              </p>
            </div>
          </div>
          <Button className="gap-2">
            <Edit className="w-4 h-4" />
            Modifier
          </Button>
        </div>

        {/* Building Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Informations générales
              </CardTitle>
              <div className="flex items-center gap-2">
                {getStatusBadge(building.construction_status)}
                <Badge variant="outline" className="capitalize">
                  {building.building_type}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">PROJET PARENT</h4>
                <div className="space-y-1">
                  <p className="font-semibold">{project?.title || 'Non assigné'}</p>
                  {project?.cyprus_zone && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-1" />
                      {project.cyprus_zone.charAt(0).toUpperCase() + project.cyprus_zone.slice(1)}
                    </div>
                  )}
                  {developer?.name && (
                    <p className="text-sm text-muted-foreground">
                      Développeur: {developer.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  STRUCTURE
                </h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Étages:</span>
                    <span className="font-semibold">{building.total_floors}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Unités totales:</span>
                    <span className="font-semibold">{building.total_units}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  PERFORMANCE
                </h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Classe énergétique:</span>
                    <span className="font-semibold">
                      {building.energy_rating || 'Non définie'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Type:</span>
                    <span className="font-semibold capitalize">{building.building_type}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Timeline Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  PLANNING
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Créé le:</span>
                    <span className="font-semibold">
                      {new Date(building.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Mis à jour:</span>
                    <span className="font-semibold">
                      {new Date(building.updated_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  OCCUPANCY
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Unités disponibles:</span>
                    <span className="font-semibold text-green-600">
                      {Math.floor(building.total_units * 0.3)} {/* Simulation */}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Taux d'occupation:</span>
                    <span className="font-semibold">
                      70% {/* Simulation */}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images Gallery */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Image className="w-5 h-5" />
                Images du bâtiment
              </span>
              <Badge variant="outline">
                {images.length} image(s)
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt={image.caption || `Image du bâtiment ${building.building_name}`}
                      className="w-full h-32 object-cover rounded border"
                    />
                    
                    {/* Primary badge */}
                    {image.is_primary && (
                      <div className="absolute top-2 left-2">
                        <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                          <Star className="w-3 h-3 mr-1" />
                          Principal
                        </Badge>
                      </div>
                    )}
                    
                    {/* Actions */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      {!image.is_primary && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleSetPrimaryImage(image.id)}
                          className="h-6 w-6 p-0"
                          title="Définir comme image principale"
                        >
                          <Star className="w-3 h-3" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteImage(image.id, image.url)}
                        className="h-6 w-6 p-0"
                        title="Supprimer l'image"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    {/* Caption */}
                    {image.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 rounded-b">
                        {image.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aucune image pour ce bâtiment</p>
                <p className="text-sm">Utilisez le formulaire d'édition pour ajouter des images</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Units Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Unités du bâtiment
              </span>
              <Badge variant="outline">
                {building.total_units} unité(s)
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Gestion des unités à venir</p>
              <p className="text-sm mt-2">
                {building.total_units} unités configurées pour ce bâtiment
              </p>
              <Button variant="outline" className="mt-4">
                Configurer les unités
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminBuildingDetail;