import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Edit, MapPin, Building, Calendar, Euro, Users, ExternalLink, Star, X, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import HierarchyBreadcrumb from '@/components/admin/common/HierarchyBreadcrumb';
import { getHierarchyBreadcrumb } from '@/lib/supabase/integrity';
import { fetchProjectImages, deleteProjectImage, updateProjectImagePrimary } from '@/lib/supabase/images';
import { deleteImage, getImagePath } from '@/lib/supabase/storage';
import { useToast } from '@/hooks/use-toast';

// Helper function to safely access developer data
const getDeveloper = (developer: any) => {
  if (!developer || typeof developer !== 'object') return null;
  return developer as { name?: string; website?: string; [key: string]: any };
};

const AdminProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch project details with related data
  const { data: project, isLoading, error } = useQuery({
    queryKey: ['admin-project-detail', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          developer:developers(id, name, contact_info, logo, website),
          buildings!fk_buildings_project_id(
            id,
            name,
            total_floors,
            total_units,
            building_type,
            construction_status,
            energy_rating
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
    queryKey: ['project-breadcrumb', id],
    queryFn: () => getHierarchyBreadcrumb(id),
    enabled: !!id
  });

  // Fetch project images
  const { data: images = [], refetch: refetchImages } = useQuery({
    queryKey: ['project-images', id],
    queryFn: () => fetchProjectImages(id!),
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Projet non trouvé</p>
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin/projects')}
                className="mt-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux projets
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'planning': { label: 'Planification', variant: 'secondary' as const },
      'under_construction': { label: 'Construction', variant: 'default' as const },
      'delivered': { label: 'Livré', variant: 'outline' as const },
      'available': { label: 'Disponible', variant: 'secondary' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'secondary' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleDeleteImage = async (imageId: string, imageUrl: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return;
    
    try {
      // Delete from storage
      const imagePath = getImagePath(imageUrl);
      if (imagePath) {
        await deleteImage('projects', imagePath);
      }
      
      // Delete from database
      await deleteProjectImage(imageId);
      
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
      await updateProjectImagePrimary(imageId, id);
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
          currentPage="Détail du projet"
        />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/projects')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{project.title}</h1>
              {project.subtitle && (
                <p className="text-muted-foreground mt-1">{project.subtitle}</p>
              )}
            </div>
          </div>
          <Button className="gap-2" onClick={() => navigate(`/admin/projects/${id}/edit`)}>
            <Edit className="w-4 h-4" />
            Modifier
          </Button>
        </div>

        {/* Project Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Informations générales
              </CardTitle>
              <div className="flex items-center gap-2">
                {getStatusBadge(project.status)}
                {project.golden_visa_eligible && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    ✨ Golden Visa
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">DÉVELOPPEUR</h4>
                <div className="flex items-center gap-2">
                  {project.developer ? (
                  <div>
                      {(() => {
                        const dev = getDeveloper(project.developer);
                        return (
                          <>
                            <p className="font-semibold">
                              {dev?.name || 'Non assigné'}
                            </p>
                            {dev?.website && (
                              <a 
                                href={dev.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline"
                              >
                                {dev.website}
                              </a>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Non assigné</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">LOCALISATION</h4>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">{project.cyprus_zone?.charAt(0).toUpperCase() + project.cyprus_zone?.slice(1)}</p>
                    <p className="text-sm text-muted-foreground">
                      {typeof project.location === 'object' && project.location && 'city' in project.location 
                        ? String(project.location.city || '') 
                        : ''
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">TYPE</h4>
                <p className="font-semibold capitalize">{project.property_category || 'Résidentiel'}</p>
              </div>
            </div>

            <Separator />

            {/* Financial Info */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                  <Euro className="w-4 h-4" />
                  PRIX MINIMUM
                </h4>
                <p className="text-2xl font-bold text-primary">
                  €{project.price?.toLocaleString()}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">TVA</h4>
                <p className="font-semibold">{project.vat_rate}%</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  UNITÉS
                </h4>
                <p className="font-semibold">
                  {project.units_available}/{project.total_units}
                  <span className="text-sm text-muted-foreground ml-1">disponibles</span>
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  LIVRAISON
                </h4>
                <p className="font-semibold">
                  {project.completion_date 
                    ? new Date(project.completion_date).toLocaleDateString('fr-FR')
                    : 'Non définie'
                  }
                </p>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground">DESCRIPTION</h4>
              <p className="text-sm leading-relaxed">{project.description}</p>
              
              {project.detailed_description && (
                <>
                  <h4 className="font-medium text-sm text-muted-foreground mt-6">DESCRIPTION DÉTAILLÉE</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {project.detailed_description}
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Images Gallery */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Image className="w-5 h-5" />
                Images du projet
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
                      alt={image.caption || `Image du projet ${project.title}`}
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
                <p>Aucune image pour ce projet</p>
                <p className="text-sm">Utilisez le formulaire d'édition pour ajouter des images</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Buildings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Bâtiments associés
              </span>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {Array.isArray(project.buildings) ? project.buildings.length : 0} bâtiment(s)
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/admin/buildings?project=${project.id}`)}
                  className="gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Voir tous les bâtiments
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Array.isArray(project.buildings) && project.buildings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.buildings.map((building) => (
                  <Card key={building.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{building.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {building.building_type}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Étages:</span>
                            <span className="ml-1 font-medium">{building.total_floors}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Unités:</span>
                            <span className="ml-1 font-medium">{building.total_units}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <Badge 
                            variant="secondary" 
                            className={
                              building.construction_status === 'completed' 
                                ? 'bg-green-100 text-green-800'
                                : building.construction_status === 'in_progress'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-gray-100 text-gray-800'
                            }
                          >
                            {building.construction_status}
                          </Badge>
                          {building.energy_rating && (
                            <span className="text-muted-foreground">
                              Énergie: {building.energy_rating}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Building className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aucun bâtiment associé à ce projet</p>
                <Button variant="outline" className="mt-4">
                  Ajouter un bâtiment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminProjectDetail;