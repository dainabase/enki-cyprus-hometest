import React, { useState, useMemo, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Filter, CheckSquare, Brain, Trash2, Eye, Edit, Grid3X3, List, Table, AlignJustify, FileText, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useViewPreference } from '@/hooks/useViewPreference';
import { PDFExportButton } from '@/components/admin/properties/PDFExportButton';

interface Property {
  id: string;
  unit_code: string;
  property_type: string;
  bedrooms_count?: number;
  bathrooms_count?: number;
  internal_area_m2?: number;
  price: number;
  price_per_m2?: number;
  golden_visa_eligible: boolean;
  status: string;
  floor_number?: number;
  balcony_area?: number;
  terrace_area?: number;
  parking_spaces?: number;
  has_sea_view?: boolean;
  has_mountain_view?: boolean;
  has_city_view?: boolean;
  is_furnished?: boolean;
  project_id: string;
  building_id?: string;
  created_at: string;
  updated_at: string;
  project?: any;
  building?: any;
}

interface PropertyFilters {
  search?: string;
  projectId?: string;
  buildingId?: string;
  propertyType?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  goldenVisaOnly?: boolean;
  hasView?: boolean;
  furnished?: boolean;
}

type ViewType = 'cards' | 'list' | 'table' | 'compact' | 'detailed';

const PropertyViewSelector = ({ currentView, onViewChange }: { currentView: ViewType; onViewChange: (view: ViewType) => void }) => {
  const views = [
    { id: 'cards' as ViewType, icon: Grid3X3, label: 'Cartes' },
    { id: 'list' as ViewType, icon: List, label: 'Liste' },
    { id: 'table' as ViewType, icon: Table, label: 'Tableau' },
    { id: 'compact' as ViewType, icon: AlignJustify, label: 'Compact' },
    { id: 'detailed' as ViewType, icon: FileText, label: 'Détaillé' }
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

const PropertyCard = ({ property, isSelected, onSelect, onEdit, onView }: { 
  property: Property; 
  isSelected: boolean; 
  onSelect: (id: string, checked: boolean) => void;
  onEdit: (property: Property) => void;
  onView: (property: Property) => void;
}) => {
  return (
    <Card className={`hover:shadow-lg transition-all duration-200 ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(property.id, e.target.checked)}
              className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <div>
              <CardTitle className="text-lg">{property.unit_code}</CardTitle>
              <CardDescription className="text-sm">
                {property.project?.title} {property.building?.building_code && `• ${property.building.building_code}`}
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={() => onView(property)}>
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => onEdit(property)}>
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-600">Type:</span>
            <p className="font-medium">{property.property_type}</p>
          </div>
          <div>
            <span className="text-slate-600">Prix:</span>
            <p className="font-medium text-primary">€{property.price?.toLocaleString()}</p>
          </div>
          {property.bedrooms_count && (
            <div>
              <span className="text-slate-600">Chambres:</span>
              <p className="font-medium">{property.bedrooms_count}</p>
            </div>
          )}
          {property.internal_area_m2 && (
            <div>
              <span className="text-slate-600">Surface:</span>
              <p className="font-medium">{property.internal_area_m2}m²</p>
            </div>
          )}
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Badge variant={property.status === 'available' ? 'default' : 'secondary'}>
            {property.status}
          </Badge>
          {property.golden_visa_eligible && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              Golden Visa
            </Badge>
          )}
          {property.has_sea_view && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Vue mer
            </Badge>
          )}
          {property.is_furnished && (
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              Meublé
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const PropertyListItem = ({ property, isSelected, onSelect, onEdit, onView }: { 
  property: Property; 
  isSelected: boolean; 
  onSelect: (id: string, checked: boolean) => void;
  onEdit: (property: Property) => void;
  onView: (property: Property) => void;
}) => {
  return (
    <div className={`flex items-center gap-4 p-4 bg-white rounded-lg border hover:shadow-md transition-all duration-200 ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={(e) => onSelect(property.id, e.target.checked)}
        className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
      />
      
      <div className="flex-1 grid grid-cols-6 gap-4 items-center">
        <div>
          <p className="font-medium">{property.unit_code}</p>
          <p className="text-sm text-slate-600">{property.property_type}</p>
        </div>
        
        <div>
          <p className="font-medium">{property.project?.title}</p>
          <p className="text-sm text-slate-600">{property.building?.building_code}</p>
        </div>
        
        <div>
          <p className="font-medium">€{property.price?.toLocaleString()}</p>
          {property.price_per_m2 && (
            <p className="text-sm text-slate-600">€{property.price_per_m2}/m²</p>
          )}
        </div>
        
        <div>
          {property.bedrooms_count && (
            <p className="text-sm">{property.bedrooms_count} ch.</p>
          )}
          {property.internal_area_m2 && (
            <p className="text-sm">{property.internal_area_m2}m²</p>
          )}
        </div>
        
        <div className="flex gap-1 flex-wrap">
          <Badge variant={property.status === 'available' ? 'default' : 'secondary'} className="text-xs">
            {property.status}
          </Badge>
          {property.golden_visa_eligible && (
            <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
              GV
            </Badge>
          )}
        </div>
        
        <div className="flex gap-1 justify-end">
          <Button variant="outline" size="sm" onClick={() => onView(property)}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEdit(property)}>
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const AdminProperties = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { currentView, changeView } = useViewPreference('properties-view', 'cards');
  
  // States
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [filters, setFilters] = useState<PropertyFilters>({});
  
  // State management
  const [properties, setProperties] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch properties
  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('properties_final')
        .select('*')
        .order('unit_code');
      
      if (error) throw error;
      
      // Simple properties without complex relations to avoid type issues
      setProperties(data || []);
    } catch (error: any) {
      console.error('Error fetching properties:', error);
      toast.error('Erreur lors du chargement des propriétés');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch projects for filter dropdown
  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects_clean')
        .select('id, title')
        .order('title');
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  // Fetch buildings for filter dropdown
  const fetchBuildings = async () => {
    try {
      let query = supabase
        .from('buildings_enhanced')
        .select('id, building_code, project_id')
        .order('building_code');
      
      if (filters.projectId) {
        query = query.eq('project_id', filters.projectId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      setBuildings(data || []);
    } catch (error) {
      console.error('Error fetching buildings:', error);
    }
  };

  // Effects
  useEffect(() => {
    fetchProperties();
  }, [filters]);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (filters.projectId) {
      fetchBuildings();
    } else {
      setBuildings([]);
    }
  }, [filters.projectId]);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (propertyIds: string[]) => {
      const { error } = await supabase
        .from('properties_final')
        .delete()
        .in('id', propertyIds);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      setSelectedProperties([]);
      toast.success('Propriété(s) supprimée(s) avec succès');
    },
    onError: (error: any) => {
      toast.error('Erreur lors de la suppression');
      console.error(error);
    }
  });

  // Handlers
  const handleSelectProperty = (propertyId: string, checked: boolean) => {
    setSelectedProperties(prev => 
      checked 
        ? [...prev, propertyId]
        : prev.filter(id => id !== propertyId)
    );
  };

  const handleSelectAll = () => {
    if (selectedProperties.length === properties.length) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(properties.map(p => p.id));
    }
  };

  const handleEditProperty = (property: Property) => {
    navigate(`/admin/properties/${property.id}/edit`);
  };

  const handleViewProperty = (property: Property) => {
    setSelectedProperty(property);
    setIsDetailModalOpen(true);
  };

  const handleDeleteSelected = () => {
    if (selectedProperties.length === 0) return;
    
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${selectedProperties.length} propriété(s) ?`)) {
      return;
    }

    deleteMutation.mutate(selectedProperties);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  // Statistics
  const stats = useMemo(() => {
    return {
      total: properties.length,
      available: properties.filter(p => p.status === 'available').length,
      sold: properties.filter(p => p.status === 'sold').length,
      reserved: properties.filter(p => p.status === 'reserved').length,
      goldenVisa: properties.filter(p => p.golden_visa_eligible).length,
      avgPrice: properties.length > 0 ? Math.round(properties.reduce((sum, p) => sum + (p.price || 0), 0) / properties.length) : 0
    };
  }, [properties]);

  const renderPropertyView = () => {
    if (currentView === 'cards') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isSelected={selectedProperties.includes(property.id)}
              onSelect={handleSelectProperty}
              onEdit={handleEditProperty}
              onView={handleViewProperty}
            />
          ))}
        </div>
      );
    }

    if (currentView === 'list') {
      return (
        <div className="space-y-2">
          {properties.map((property) => (
            <PropertyListItem
              key={property.id}
              property={property}
              isSelected={selectedProperties.includes(property.id)}
              onSelect={handleSelectProperty}
              onEdit={handleEditProperty}
              onView={handleViewProperty}
            />
          ))}
        </div>
      );
    }

    // Default to cards for other views for now
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            isSelected={selectedProperties.includes(property.id)}
            onSelect={handleSelectProperty}
            onEdit={handleEditProperty}
            onView={handleViewProperty}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex justify-center items-center">
        <div className="text-center space-y-4">
          <LoadingSpinner />
          <p className="text-slate-600">Chargement des propriétés...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header Section - STICKY */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Propriétés</h1>
                <p className="text-slate-600">Gérez votre inventaire de propriétés</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
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
                Filtres
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
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100 px-8 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total</CardTitle>
              <Home className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{stats.available}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Vendues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.sold}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Réservées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.reserved}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Golden Visa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.goldenVisa}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Prix Moyen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-purple-600">€{stats.avgPrice.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-900">Filtres</CardTitle>
                <Button variant="outline" size="sm" onClick={handleClearFilters}>
                  Effacer les filtres
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="search">Recherche</Label>
                  <Input
                    id="search"
                    placeholder="Code unité, type..."
                    value={filters.search || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="project">Projet</Label>
                  <Select 
                    value={filters.projectId || 'all'} 
                    onValueChange={(value) => setFilters(prev => ({ 
                      ...prev, 
                      projectId: value === 'all' ? undefined : value,
                      buildingId: undefined 
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les projets" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les projets</SelectItem>
                      {projects?.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Statut</Label>
                  <Select 
                    value={filters.status || 'all'} 
                    onValueChange={(value) => setFilters(prev => ({ ...prev, status: value === 'all' ? undefined : value }))}
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

                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="golden-visa"
                    checked={filters.goldenVisaOnly || false}
                    onCheckedChange={(checked) => setFilters(prev => ({ ...prev, goldenVisaOnly: checked }))}
                  />
                  <Label htmlFor="golden-visa">Golden Visa uniquement</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Barre d'actions globales */}
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
                  <PDFExportButton 
                    selectedPropertyIds={selectedProperties}
                    variant="outline"
                    size="sm"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDeleteSelected}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-slate-900">
                  {properties.length} propriété(s)
                </CardTitle>
                <CardDescription>
                  {selectedProperties.length > 0 && `${selectedProperties.length} sélectionnée(s)`}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {selectedProperties.length === properties.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {properties.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-600 mb-4">Aucune propriété trouvée</p>
                <Button onClick={() => navigate('/admin/properties/new')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Créer une propriété
                </Button>
              </div>
            ) : (
              renderPropertyView()
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Détails de la propriété</DialogTitle>
            <DialogDescription>
              Informations complètes de la propriété {selectedProperty?.unit_code}
            </DialogDescription>
          </DialogHeader>
          {selectedProperty && (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-slate-900">Informations générales</h4>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Code:</span>
                      <span className="font-medium">{selectedProperty.unit_code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Type:</span>
                      <span className="font-medium">{selectedProperty.property_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Statut:</span>
                      <Badge variant={selectedProperty.status === 'available' ? 'default' : 'secondary'}>
                        {selectedProperty.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-slate-900">Caractéristiques</h4>
                  <div className="mt-2 space-y-2 text-sm">
                    {selectedProperty.bedrooms_count && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Chambres:</span>
                        <span className="font-medium">{selectedProperty.bedrooms_count}</span>
                      </div>
                    )}
                    {selectedProperty.bathrooms_count && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Salles de bain:</span>
                        <span className="font-medium">{selectedProperty.bathrooms_count}</span>
                      </div>
                    )}
                    {selectedProperty.internal_area_m2 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Surface:</span>
                        <span className="font-medium">{selectedProperty.internal_area_m2}m²</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-slate-900">Prix et financement</h4>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Prix:</span>
                      <span className="font-medium text-primary">€{selectedProperty.price?.toLocaleString()}</span>
                    </div>
                    {selectedProperty.price_per_m2 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Prix/m²:</span>
                        <span className="font-medium">€{selectedProperty.price_per_m2}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-600">Golden Visa:</span>
                      <Badge variant={selectedProperty.golden_visa_eligible ? 'default' : 'secondary'}>
                        {selectedProperty.golden_visa_eligible ? 'Éligible' : 'Non éligible'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-slate-900">Localisation</h4>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Projet:</span>
                      <span className="font-medium">{selectedProperty.project?.title}</span>
                    </div>
                    {selectedProperty.building && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Bâtiment:</span>
                        <span className="font-medium">{selectedProperty.building.building_code}</span>
                      </div>
                    )}
                    {selectedProperty.floor_number && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Étage:</span>
                        <span className="font-medium">{selectedProperty.floor_number}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProperties;