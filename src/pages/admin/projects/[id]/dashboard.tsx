import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Building, 
  Home, 
  Settings, 
  BarChart3,
  MapPin,
  Calendar,
  Euro,
  Users,
  Target
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { BuildingsSection } from '@/components/admin/projects/BuildingsSection';
import { PropertiesSection } from '@/components/admin/properties/PropertiesSection';

export default function ProjectDashboard() {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch project data
  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });

  // Fetch buildings
  const { data: buildings = [], isLoading: buildingsLoading } = useQuery({
    queryKey: ['buildings', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('buildings')
        .select('*')
        .eq('project_id', projectId)
        .order('building_name');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!projectId,
  });

  // Fetch properties count
  const { data: propertiesStats } = useQuery({
    queryKey: ['properties-stats', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('sale_status, price_excluding_vat, golden_visa_eligible')
        .eq('project_id', projectId);
      
      if (error) throw error;
      
      const stats = {
        total: data.length,
        available: data.filter(p => p.sale_status === 'available').length,
        reserved: data.filter(p => p.sale_status === 'reserved').length,
        sold: data.filter(p => p.sale_status === 'sold').length,
        goldenVisa: data.filter(p => p.golden_visa_eligible).length,
        averagePrice: data.length > 0 
          ? data.reduce((sum, p) => sum + (p.price_excluding_vat || 0), 0) / data.length 
          : 0,
      };
      
      return stats;
    },
    enabled: !!projectId,
  });

  if (projectLoading || !project) {
    return <div className="flex items-center justify-center h-64">Chargement...</div>;
  }

  const getProjectStatusBadge = (status: string) => {
    const variants = {
      planning: 'bg-blue-100 text-blue-800',
      construction: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      sold_out: 'bg-red-100 text-red-800',
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      planning: 'Planification',
      construction: 'En construction',
      delivered: 'Livré',
      sold_out: 'Épuisé',
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/admin/projects')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux projets
        </Button>
        
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{project.title}</h1>
            <Badge className={getProjectStatusBadge(project.status)}>
              {getStatusLabel(project.status)}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {project.city}, {project.region}
            </span>
            {project.completion_date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Livraison: {new Date(project.completion_date).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <Button 
          variant="outline"
          onClick={() => navigate(`/admin/projects/${projectId}`)}
        >
          <Settings className="w-4 h-4 mr-2" />
          Modifier le projet
        </Button>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="buildings" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            Bâtiments ({buildings.length})
          </TabsTrigger>
          <TabsTrigger value="properties" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Propriétés ({propertiesStats?.total || 0})
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Paramètres
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Project Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bâtiments</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{buildings.length}</div>
                <p className="text-xs text-muted-foreground">
                  Structures du projet
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Propriétés totales</CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{propertiesStats?.total || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Unités dans le projet
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taux de vente</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {propertiesStats?.total ? 
                    Math.round((propertiesStats.sold / propertiesStats.total) * 100) : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {propertiesStats?.sold || 0} vendues / {propertiesStats?.total || 0} total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Prix moyen</CardTitle>
                <Euro className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {propertiesStats?.averagePrice ? 
                    `${Math.round(propertiesStats.averagePrice).toLocaleString()}€` : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Prix moyen HT
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sales Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Statut des ventes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    Disponibles
                  </span>
                  <span className="font-semibold">{propertiesStats?.available || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    Réservées
                  </span>
                  <span className="font-semibold">{propertiesStats?.reserved || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    Vendues
                  </span>
                  <span className="font-semibold">{propertiesStats?.sold || 0}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    Golden Visa
                  </span>
                  <span className="font-semibold">{propertiesStats?.goldenVisa || 0}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informations projet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {project.subtitle && (
                  <div>
                    <span className="text-sm text-muted-foreground">Sous-titre:</span>
                    <p className="font-medium">{project.subtitle}</p>
                  </div>
                )}
                
                <div>
                  <span className="text-sm text-muted-foreground">Développeur:</span>
                  <p className="font-medium">{project.developer_id || 'Non défini'}</p>
                </div>

                {project.launch_date && (
                  <div>
                    <span className="text-sm text-muted-foreground">Date de lancement:</span>
                    <p className="font-medium">
                      {new Date(project.launch_date).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {project.price_from && (
                  <div>
                    <span className="text-sm text-muted-foreground">Prix à partir de:</span>
                    <p className="font-medium">{project.price_from.toLocaleString()}€</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('buildings')}
                  className="h-auto p-4 flex-col gap-2"
                >
                  <Building className="w-6 h-6" />
                  <span>Gérer les bâtiments</span>
                  <span className="text-xs text-muted-foreground">
                    {buildings.length} bâtiment(s)
                  </span>
                </Button>

                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('properties')}
                  className="h-auto p-4 flex-col gap-2"
                >
                  <Home className="w-6 h-6" />
                  <span>Gérer les propriétés</span>
                  <span className="text-xs text-muted-foreground">
                    {propertiesStats?.total || 0} propriété(s)
                  </span>
                </Button>

                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/admin/projects/${projectId}`)}
                  className="h-auto p-4 flex-col gap-2"
                >
                  <Settings className="w-6 h-6" />
                  <span>Paramètres projet</span>
                  <span className="text-xs text-muted-foreground">
                    Configuration générale
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Buildings Tab */}
        <TabsContent value="buildings">
          <BuildingsSection projectId={projectId!} />
        </TabsContent>

        {/* Properties Tab */}
        <TabsContent value="properties">
          <PropertiesSection projectId={projectId!} buildings={buildings} />
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres du projet</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate(`/admin/projects/${projectId}`)}
              >
                Modifier les détails du projet
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}