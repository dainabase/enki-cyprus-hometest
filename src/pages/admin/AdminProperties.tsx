import React, { useState } from 'react';
import { Plus, Filter, Eye, Edit, Trash2, Building2, Home, CheckSquare, Grid3X3, List, Table, AlignJustify, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useViewPreference } from '@/hooks/useViewPreference';
import { AppShell } from '@/components/dainabase-ui';
import { AdminSidebarExecutive } from '@/components/admin/AdminSidebarExecutive';
import { 
  fetchProperties, 
  deleteProperty, 
  calculatePropertyStats,
  fetchProjectsForProperties,
  fetchBuildingsForProperties,
  PropertyFilters 
} from '@/lib/supabase/properties';

export type PropertyViewType = 'cards' | 'list' | 'table' | 'compact' | 'detailed';

interface PropertyViewSelectorProps {
  currentView: PropertyViewType;
  onViewChange: (view: PropertyViewType) => void;
}

const PropertyViewSelector = ({ currentView, onViewChange }: PropertyViewSelectorProps) => {
  const views = [
    { id: 'cards' as PropertyViewType, icon: Grid3X3, label: 'Cartes' },
    { id: 'list' as PropertyViewType, icon: List, label: 'Liste' },
    { id: 'table' as PropertyViewType, icon: Table, label: 'Tableau' },
    { id: 'compact' as PropertyViewType, icon: AlignJustify, label: 'Compact' },
    { id: 'detailed' as PropertyViewType, icon: FileText, label: 'Détaillé' }
  ];

  return (
    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl shadow-sm p-1">
      {views.map(({ id, icon: Icon, label }) => (
        <Button
          key={id}
          variant="ghost"
          size="sm"
          onClick={() => onViewChange(id)}
          className={`
            h-10 px-4 rounded-lg transition-all duration-200 
            ${currentView === id 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }
          `}
          title={label}
        >
          <Icon className="h-4 w-4 mr-2" />
          <span className="font-medium">{label}</span>
        </Button>
      ))}
    </div>
  );
};

const AdminProperties = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentView, changeView } = useViewPreference('properties-view', 'cards');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [filters, setFilters] = useState<PropertyFilters>({});

  // Fetch properties
  const { data: properties, isLoading, error, refetch } = useSupabaseQuery(
    ['admin-properties', filters],
    () => fetchProperties(filters),
    { staleTime: 0, refetchOnMount: 'always' }
  );

  // Fetch projects for filter dropdown
  const { data: projects } = useSupabaseQuery(
    ['projects-for-properties'],
    fetchProjectsForProperties
  );

  // Fetch buildings for filter dropdown
  const { data: buildings } = useSupabaseQuery(
    ['buildings-for-properties', filters.projectId],
    () => fetchBuildingsForProperties(filters.projectId)
  );

  React.useEffect(() => {
    if (error) {
      console.error('Erreur chargement propriétés:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur de chargement',
        description: (error as any).message || 'Impossible de charger les propriétés'
      });
    }
  }, [error, toast]);

  const handleDelete = async (id: string, unitCode: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la propriété ${unitCode} ?`)) {
      return;
    }

    try {
      await deleteProperty(id);
      toast({
        title: 'Propriété supprimée',
        description: `La propriété ${unitCode} a été supprimée avec succès`
      });
      refetch();
    } catch (error: any) {
      console.error('Error deleting property:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || 'Erreur lors de la suppression'
      });
    }
  };

  const stats = React.useMemo(() => {
    return properties ? calculatePropertyStats(properties) : {
      total: 0, available: 0, reserved: 0, sold: 0, goldenVisa: 0, averagePrice: 0, totalValue: 0
    };
  }, [properties]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      available: 'default',
      reserved: 'secondary', 
      sold: 'destructive'
    } as const;
    
    const labels = {
      available: 'Disponible',
      reserved: 'Réservé',
      sold: 'Vendu'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Chargement des propriétés...</p>
        </div>
      </div>
    );
  }

  const AdminHeader = () => (
    <div className="h-16 px-6 flex items-center justify-between bg-white border-b border-slate-200">
      <div className="flex items-center gap-4">
        <a href="/" className="text-2xl font-bold text-slate-900 hover:text-slate-700 transition-colors uppercase">
          ENKI-REALTY
        </a>
        <span className="text-slate-400">|</span>
        <span className="text-lg text-slate-500">Propriétés</span>
      </div>
      <div className="flex items-center gap-4">
        <PropertyViewSelector
          currentView={currentView}
          onViewChange={changeView}
        />
        
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2 border-slate-200 hover:bg-slate-50"
        >
          <Filter className="w-4 h-4" />
          Filtres & Tri
        </Button>
        
        <Button 
          onClick={() => navigate('/admin/properties/new')} 
          className="bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 gap-2"
          size="lg"
        >
          <Plus className="w-5 h-5" />
          Nouvelle Propriété
        </Button>
      </div>
    </div>
  );

  return (
    <AppShell
      variant="executive"
      header={<AdminHeader />}
      sidebar={<AdminSidebarExecutive />}
    >
      <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100 px-8 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total</CardTitle>
              <Home className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{stats.available}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Réservées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.reserved}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Vendues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.sold}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Golden Visa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.goldenVisa}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Prix Moyen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-slate-900">{formatPrice(stats.averagePrice)}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Valeur Totale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-slate-900">{formatPrice(stats.totalValue)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-900">Filtres</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Projet</label>
                  <Select 
                    value={filters.projectId || 'all'} 
                    onValueChange={(value) => setFilters({...filters, projectId: value === 'all' ? undefined : value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les projets" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les projets</SelectItem>
                      {projects?.map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Bâtiment</label>
                  <Select 
                    value={filters.buildingId || 'all'} 
                    onValueChange={(value) => setFilters({...filters, buildingId: value === 'all' ? undefined : value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les bâtiments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les bâtiments</SelectItem>
                      {buildings?.map(building => (
                        <SelectItem key={building.id} value={building.id}>
                          {building.building_code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Statut</label>
                  <Select 
                    value={filters.status || 'all'} 
                    onValueChange={(value) => setFilters({...filters, status: value === 'all' ? undefined : value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="available">Disponible</SelectItem>
                      <SelectItem value="reserved">Réservé</SelectItem>
                      <SelectItem value="sold">Vendu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select 
                    value={filters.propertyType || 'all'} 
                    onValueChange={(value) => setFilters({...filters, propertyType: value === 'all' ? undefined : value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les types" />
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
            </CardContent>
          </Card>
        )}

        {/* Global Actions Bar */}
        {selectedProperties.length > 0 && (
          <Card className="border-l-4 border-l-primary">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-primary" />
                    <span className="font-medium">
                      {selectedProperties.length} propriété(s) sélectionnée(s)
                    </span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedProperties([])}>
                    Tout désélectionner
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => {
                      if (confirm(`Supprimer ${selectedProperties.length} propriété(s) sélectionnée(s) ?`)) {
                        // Handle bulk delete
                        Promise.all(selectedProperties.map(id => deleteProperty(id)))
                          .then(() => {
                            toast({ title: `${selectedProperties.length} propriété(s) supprimée(s)` });
                            setSelectedProperties([]);
                            refetch();
                          })
                          .catch((error) => {
                            toast({
                              variant: 'destructive',
                              title: 'Erreur lors de la suppression',
                              description: error.message
                            });
                          });
                      }
                    }}
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

        {/* Properties List */}
        <div className="grid gap-4">
          {properties?.map(property => (
            <Card key={property.id} className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={selectedProperties.includes(property.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProperties([...selectedProperties, property.id]);
                        } else {
                          setSelectedProperties(selectedProperties.filter(id => id !== property.id));
                        }
                      }}
                      className="mt-2 rounded border-slate-300"
                    />
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Home className="w-6 h-6 text-primary" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">
                          {property.unit_code}
                        </h3>
                        {property.golden_visa_eligible && (
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            Golden Visa ✓
                          </Badge>
                        )}
                        {getStatusBadge(property.status)}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          <span>{property.project?.title}</span>
                        </div>
                        {property.building && (
                          <div className="flex items-center gap-1">
                            <span>Bâtiment {property.building.building_code}</span>
                          </div>
                        )}
                        <span>{property.property_type}</span>
                        {property.bedrooms && (
                          <span>{property.bedrooms} ch.</span>
                        )}
                        {property.internal_area_m2 && (
                          <span>{property.internal_area_m2} m²</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {property.price && (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">
                          {formatPrice(property.price)}
                        </div>
                        {property.internal_area_m2 && (
                          <div className="text-sm text-muted-foreground">
                            {formatPrice(Math.round(property.price / property.internal_area_m2))}/m²
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/properties/${property.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/properties/${property.id}/edit`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(property.id, property.unit_code)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {properties?.length === 0 && (
            <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
              <CardContent className="p-12 text-center">
                <Home className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune propriété trouvée</h3>
                <p className="text-muted-foreground mb-4">
                  Commencez par créer votre première propriété
                </p>
                <Button onClick={() => navigate('/admin/properties/new')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle Propriété
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
};

export default AdminProperties;