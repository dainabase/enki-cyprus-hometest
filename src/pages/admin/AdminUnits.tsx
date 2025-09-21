import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Download, Edit, Eye, Trash2, Building2, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, DataGrid } from '@/components/dainabase-ui';
import { useSupabaseQuery, getPaginationRange } from '@/hooks/useSupabaseQuery';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useViewPreference } from '@/hooks/useViewPreference';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PropertyWizard from '@/components/admin/properties/PropertyWizard';

type ViewType = 'cards' | 'list' | 'table' | 'compact' | 'detailed';

interface Property {
  id: string;
  unit_number: string;
  property_type: string;
  status: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  surface_area?: number;
  floor?: number;
  created_at: string;
  project_id: string;
  building_id: string;
  project?: {
    id: string;
    title: string;
    city?: string;
    cyprus_zone?: string;
  };
  building?: {
    id: string;
    name: string;
  };
}

interface FilterState {
  search: string;
  status: string;
  propertyType: string;
  developer: string;
  project: string;
  priceMin: string;
  priceMax: string;
}

const ViewSelector = ({ currentView, onViewChange }: { currentView: ViewType; onViewChange: (view: ViewType) => void }) => {
  const views = [
    { id: 'cards' as ViewType, icon: Building2, label: 'Cartes' },
    { id: 'list' as ViewType, icon: MapPin, label: 'Liste' },
    { id: 'table' as ViewType, icon: Filter, label: 'Tableau' },
    { id: 'compact' as ViewType, icon: Search, label: 'Compact' },
    { id: 'detailed' as ViewType, icon: Eye, label: 'Détaillé' }
  ];

  return (
    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl shadow-sm p-1">
      {views.map(({ id, icon: Icon, label }) => (
        <Button
          key={id}
          variant={currentView === id ? "executive" : "ghost"}
          size="sm"
          onClick={() => onViewChange(id)}
          className="h-10 px-4 rounded-lg transition-all duration-200"
        >
          <Icon className="h-4 w-4 mr-2" />
          <span className="font-medium">{label}</span>
        </Button>
      ))}
    </div>
  );
};

const AdminUnits = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentView, changeView } = useViewPreference('admin-units-view', 'table');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 25,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'all',
    propertyType: 'all',
    developer: 'all',
    project: 'all',
    priceMin: '',
    priceMax: ''
  });
  const [view, setView] = useState<'table' | 'cards' | 'list' | 'compact' | 'detailed'>('table');
  const [isNewPropertyOpen, setIsNewPropertyOpen] = useState(false);
  const [previewProperty, setPreviewProperty] = useState<Property | null>(null);

  // Fetch properties from properties_test table
  const { data: propertiesResponse, isLoading, error, refetch } = useSupabaseQuery(
    ['admin-properties-test', filters, pagination],
    async () => {
      const { from, to } = getPaginationRange(pagination);
      
      let query = supabase
        .from('properties_test')
        .select(`
          id, unit_number, property_type, status, price, bedrooms, bathrooms,
          surface_area, floor, created_at, project_id, building_id
        `, { count: 'exact' })
        .range(from, to)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.search) {
        query = query.ilike('unit_number', `%${filters.search}%`);
      }
      if (filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters.propertyType !== 'all') {
        query = query.eq('property_type', filters.propertyType);
      }
      if (filters.project !== 'all') {
        query = query.eq('project_id', filters.project);
      }

      const { data, error, count } = await query;
      if (error) {
        console.error('❌ AdminUnits query error:', error);
        throw error;
      }
      
      console.info('AdminUnits fetch success', { 
        totalCount: count, 
        length: data?.length, 
        firstItem: data?.[0] 
      });
      return { data, count };
    },
    { staleTime: 0, refetchOnMount: 'always' }
  );

  // Fetch projects for filter dropdown
  const { data: projectsList } = useSupabaseQuery(
    ['projects-list'],
    async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, title')
        .order('title');
      if (error) throw error;
      return data;
    }
  );

  // Fetch developers for filter dropdown  
  const { data: developersList } = useSupabaseQuery(
    ['developers-list'],
    async () => {
      const { data, error } = await supabase
        .from('developers')
        .select('id, name')
        .order('name');
      if (error) throw error;
      return data;
    }
  );

  const propertiesData = propertiesResponse?.data || [];
  const totalCount = propertiesResponse?.count || 0;

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      total: propertiesData.length,
      available: propertiesData.filter(p => p.status === 'available').length,
      reserved: propertiesData.filter(p => p.status === 'reserved').length,
      sold: propertiesData.filter(p => p.status === 'sold').length,
    };
  }, [propertiesData]);

  const formatPrice = (price?: number) => {
    if (!price) return 'Prix non défini';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      available: { label: 'Disponible', className: 'bg-green-50 text-green-700 border-green-200' },
      reserved: { label: 'Réservé', className: 'bg-orange-50 text-orange-700 border-orange-200' },
      sold: { label: 'Vendu', className: 'bg-blue-50 text-blue-700 border-blue-200' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || 
                   { label: status, className: 'bg-gray-50 text-gray-700 border-gray-200' };
    
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getPropertyTypeBadge = (type: string) => {
    const typeConfig = {
      apartment: { label: 'Appartement', className: 'bg-blue-50 text-blue-700' },
      penthouse: { label: 'Penthouse', className: 'bg-purple-50 text-purple-700' },
      villa: { label: 'Villa', className: 'bg-green-50 text-green-700' },
      studio: { label: 'Studio', className: 'bg-orange-50 text-orange-700' },
      office: { label: 'Bureau', className: 'bg-indigo-50 text-indigo-700' },
      commercial: { label: 'Commercial', className: 'bg-teal-50 text-teal-700' },
      retail: { label: 'Commerce', className: 'bg-emerald-50 text-emerald-700' },
      warehouse: { label: 'Entrepôt', className: 'bg-yellow-50 text-yellow-700' },
    };
    
    const config = typeConfig[type as keyof typeof typeConfig] || 
                   { label: type, className: 'bg-gray-50 text-gray-700' };
    
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
  };

  // DataGrid columns configuration
  const columns = [
    {
      key: 'unit_number',
      label: 'Référence',
      render: (value: string, row: Property) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900">{value || 'N/A'}</span>
          <span className="text-xs text-slate-500">{row.id.slice(0, 8)}...</span>
        </div>
      )
    },
    {
      key: 'project_id',
      label: 'Projet',
      render: (value: any, row: Property) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900">Projet</span>
          <span className="text-xs text-slate-500">{value?.slice(0, 8)}...</span>
        </div>
      )
    },
    {
      key: 'property_type',
      label: 'Type',
      render: (value: string) => getPropertyTypeBadge(value)
    },
    {
      key: 'status',
      label: 'Statut',
      render: (value: string) => getStatusBadge(value)
    },
    {
      key: 'price',
      label: 'Prix',
      render: (value: number) => (
        <span className="font-semibold text-slate-900">{formatPrice(value)}</span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, row: Property) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPreviewProperty(row)}
            className="h-8 w-8 p-0"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              console.log('Navigating to edit property:', row.id);
              navigate(`/admin/property-form/${row.id}`);
            }}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const renderContent = () => {
    if (isLoading) {
      return (
        <Card variant="executive" padding="lg" className="text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto"></div>
          </div>
        </Card>
      );
    }

    if (error) {
      console.error('❌ AdminUnits render error:', error);
      return (
        <Card variant="executive" padding="lg" className="text-center">
          <p className="text-red-600">Erreur lors du chargement des propriétés: {(error as any).message}</p>
        </Card>
      );
    }

    if (propertiesData.length === 0) {
      return (
        <Card variant="executive" padding="lg" className="text-center">
          <div className="py-12">
            <Building2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucune propriété trouvée</h3>
            <p className="text-slate-600 mb-6">Commencez par créer votre première propriété</p>
            <Button variant="executive" onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Propriété
            </Button>
          </div>
        </Card>
      );
    }

    switch (currentView) {
      case 'table':
        return (
          <DataGrid
            data={propertiesData}
            columns={columns}
            variant="executive"
            className="shadow-lg"
          />
        );
      case 'cards':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {propertiesData.map((property) => (
              <Card key={property.id} variant="executive" padding="lg" className="hover:shadow-xl transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">{property.unit_number || 'N/A'}</h3>
                      <p className="text-sm text-slate-600">Référence: {property.id.slice(0, 8)}...</p>
                    </div>
                    {getStatusBadge(property.status)}
                  </div>
                  <div className="space-y-2">
                    {getPropertyTypeBadge(property.property_type)}
                    <div className="text-sm text-slate-600">
                      <p>Prix: {formatPrice(property.price)}</p>
                      <p>Surface: {property.surface_area ? `${property.surface_area} m²` : 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                     <Button variant="ghost" size="sm" onClick={() => setPreviewProperty(property)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/property-form/${property.id}`)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );
      case 'list':
        return (
          <div className="space-y-4">
            {propertiesData.map((property) => (
              <Card key={property.id} variant="clean" padding="lg" className="hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-900">{property.unit_number || 'N/A'}</h3>
                      <p className="text-sm text-slate-600">Référence: {property.id.slice(0, 8)}...</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPropertyTypeBadge(property.property_type)}
                      {getStatusBadge(property.status)}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-slate-900">{formatPrice(property.price)}</span>
                    <div className="flex items-center gap-2">
                       <Button variant="ghost" size="sm" onClick={() => setPreviewProperty(property)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/property-form/${property.id}`)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );
      case 'compact':
        return (
          <div className="space-y-2">
            {propertiesData.map((property) => (
              <Card key={property.id} variant="clean" padding="sm" className="hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-slate-900">{property.unit_number || 'N/A'}</span>
                    {getPropertyTypeBadge(property.property_type)}
                    {getStatusBadge(property.status)}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-900">{formatPrice(property.price)}</span>
                    <div className="flex items-center gap-1">
                       <Button variant="ghost" size="sm" onClick={() => setPreviewProperty(property)} className="h-7 w-7 p-0">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/property-form/${property.id}`)} className="h-7 w-7 p-0">
                          <Edit className="h-3 w-3" />
                        </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );
      case 'detailed':
        return (
          <div className="space-y-6">
            {propertiesData.map((property) => (
              <Card key={property.id} variant="executive" padding="lg" className="hover:shadow-xl transition-shadow">
                <div className="space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-slate-900">{property.unit_number || 'N/A'}</h3>
                      <p className="text-sm text-slate-600">Référence: {property.id}</p>
                      <div className="flex items-center gap-2">
                        {getPropertyTypeBadge(property.property_type)}
                        {getStatusBadge(property.status)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-900">{formatPrice(property.price)}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Surface:</span>
                      <div className="font-medium">{property.surface_area ? `${property.surface_area} m²` : 'N/A'}</div>
                    </div>
                    <div>
                      <span className="text-slate-600">Chambres:</span>
                      <div className="font-medium">{property.bedrooms || 'N/A'}</div>
                    </div>
                    <div>
                      <span className="text-slate-600">Salles de bain:</span>
                      <div className="font-medium">{property.bathrooms || 'N/A'}</div>
                    </div>
                    <div>
                      <span className="text-slate-600">Étage:</span>
                      <div className="font-medium">{property.floor || 'N/A'}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div className="text-xs text-slate-500">
                      Créé le {new Date(property.created_at).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="flex items-center gap-2">
                       <Button variant="clean" size="sm" onClick={() => setPreviewProperty(property)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Voir détails
                        </Button>
                        <Button variant="executive" size="sm" onClick={() => navigate(`/admin/property-form/${property.id}`)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );
      default:
        return (
          <DataGrid
            data={propertiesData}
            columns={columns}
            variant="executive"
            className="shadow-lg"
          />
        );
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Gestion des Propriétés</h1>
                <p className="text-slate-600">Gérez votre inventaire de propriétés et unités</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ViewSelector currentView={currentView} onViewChange={changeView} />
              <Button
                variant="clean"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="w-4 h-4" />
                Filtres
              </Button>
              <Button variant="executive" onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-5 h-5 mr-2" />
                Nouvelle Propriété
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100 px-8 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card variant="executive" padding="md">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
              <div className="text-sm text-slate-600">Total Propriétés</div>
            </div>
          </Card>
          <Card variant="executive" padding="md">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.available}</div>
              <div className="text-sm text-slate-600">Disponibles</div>
            </div>
          </Card>
          <Card variant="executive" padding="md">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.reserved}</div>
              <div className="text-sm text-slate-600">Réservées</div>
            </div>
          </Card>
          <Card variant="executive" padding="md">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.sold}</div>
              <div className="text-sm text-slate-600">Vendues</div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card variant="executive" padding="lg">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Filtres de recherche</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Référence</label>
                  <Input
                    placeholder="Rechercher par référence..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Statut</label>
                  <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="available">Disponible</SelectItem>
                      <SelectItem value="reserved">Réservé</SelectItem>
                      <SelectItem value="sold">Vendu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                  <Select value={filters.propertyType} onValueChange={(value) => setFilters(prev => ({ ...prev, propertyType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                       <SelectItem value="all">Tous les types</SelectItem>
                       <SelectItem value="apartment">Appartement</SelectItem>
                       <SelectItem value="penthouse">Penthouse</SelectItem>
                       <SelectItem value="villa">Villa</SelectItem>
                       <SelectItem value="studio">Studio</SelectItem>
                       <SelectItem value="office">Bureau</SelectItem>
                       <SelectItem value="commercial">Commercial</SelectItem>
                       <SelectItem value="retail">Commerce</SelectItem>
                       <SelectItem value="warehouse">Entrepôt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Projet</label>
                  <Select value={filters.project} onValueChange={(value) => setFilters(prev => ({ ...prev, project: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les projets</SelectItem>
                      {projectsList?.map((project) => (
                        <SelectItem key={project.id} value={project.id}>{project.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Développeur</label>
                  <Select value={filters.developer} onValueChange={(value) => setFilters(prev => ({ ...prev, developer: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les développeurs</SelectItem>
                      {developersList?.map((developer) => (
                        <SelectItem key={developer.id} value={developer.id}>{developer.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Main Content */}
        {renderContent()}
      </div>

      {/* Property Wizard Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader className="pb-4">
            <DialogTitle>Nouvelle Propriété</DialogTitle>
            <DialogDescription>
              Créez une nouvelle propriété en suivant les étapes du formulaire
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            <PropertyWizard 
              open={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
              onSuccess={() => {
                setIsDialogOpen(false);
                refetch();
                toast({
                  title: "Propriété créée",
                  description: "La nouvelle propriété a été créée avec succès"
                });
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de preview de propriété */}
      <Dialog open={!!previewProperty} onOpenChange={() => setPreviewProperty(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Détails de la propriété {previewProperty?.unit_number}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            {previewProperty && (
              <div className="space-y-6 p-1">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Informations générales</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Référence:</span>
                        <span className="font-medium">{previewProperty.unit_number}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Type:</span>
                        <span className="font-medium">{previewProperty.property_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Statut:</span>
                        {getStatusBadge(previewProperty.status)}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Prix:</span>
                        <span className="font-medium text-lg">{formatPrice(previewProperty.price)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Configuration</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Chambres:</span>
                        <span className="font-medium">{previewProperty.bedrooms || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Salles de bain:</span>
                        <span className="font-medium">{previewProperty.bathrooms || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Surface:</span>
                        <span className="font-medium">{previewProperty.surface_area ? `${previewProperty.surface_area} m²` : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Surface intérieure:</span>
                        <span className="font-medium">{previewProperty.surface_area ? `${previewProperty.surface_area} m²` : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Identifiants</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Projet ID:</span>
                      <span className="font-mono text-sm">{previewProperty.project_id || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Bâtiment ID:</span>
                      <span className="font-mono text-sm">{previewProperty.building_id || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {previewProperty.unit_number && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Notes</h3>
                      <p className="text-slate-700">Propriété {previewProperty.unit_number}</p>
                    </div>
                  </>
                )}

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Dates</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Créé le:</span>
                      <span className="font-medium">{new Date(previewProperty.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Modifié le:</span>
                      <span className="font-medium">{new Date(previewProperty.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUnits;