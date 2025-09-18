import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Download, Edit, Eye, Trash2, Building2, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, DataGrid } from '@/components/dainabase-ui';
import { useSupabaseQuery, getPaginationRange } from '@/hooks/useSupabaseQuery';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useViewPreference } from '@/hooks/useViewPreference';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
  project: string;
  building: string;
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
    project: 'all',
    building: 'all',
    priceMin: '',
    priceMax: ''
  });

  // Fetch properties from properties_test table
  const { data: propertiesResponse, isLoading, error, refetch } = useSupabaseQuery(
    ['admin-properties-test', filters, pagination],
    async () => {
      const { from, to } = getPaginationRange(pagination);
      
      let query = supabase
        .from('properties_test')
        .select(`
          id, unit_number, property_type, status, price, bedrooms, bathrooms,
          surface_area, floor, created_at, project_id, building_id,
          project:projects(id, title, city, cyprus_zone),
          building:buildings(id, name)
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

      const { data, error, count } = await query;
      if (error) throw error;
      
      console.info('🏠 AdminUnits fetch', { totalCount: count, length: data?.length });
      return { data, count };
    },
    { staleTime: 0, refetchOnMount: 'always' }
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
    };
    
    const config = typeConfig[type as keyof typeof typeConfig] || 
                   { label: type, className: 'bg-gray-50 text-gray-700' };
    
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
  };

  // DataGrid columns configuration
  const columns = [
    {
      key: 'unit_number',
      label: 'Numéro d\'unité',
      render: (value: string, row: Property) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900">{value || 'N/A'}</span>
          <span className="text-xs text-slate-500">{row.id.slice(0, 8)}...</span>
        </div>
      )
    },
    {
      key: 'project',
      label: 'Projet',
      render: (value: any, row: Property) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900">{value?.title || 'Projet non lié'}</span>
          <span className="text-xs text-slate-500">{value?.city} - {value?.cyprus_zone}</span>
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
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
      return (
        <Card variant="executive" padding="lg" className="text-center">
          <p className="text-red-600">Erreur lors du chargement des propriétés</p>
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

    return (
      <DataGrid
        data={propertiesData}
        columns={columns}
        variant="executive"
        className="shadow-lg"
      />
    );
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
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Recherche</label>
                  <Input
                    placeholder="Numéro d'unité..."
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

      {/* Dialog placeholder */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle Propriété</DialogTitle>
            <DialogDescription>
              Formulaire de création d'une nouvelle propriété (à implémenter)
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUnits;