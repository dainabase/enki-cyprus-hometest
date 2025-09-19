import React, { useState, useMemo, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Filter, CheckSquare, Brain, Trash2, Eye, Edit, Grid3X3, List, Table, AlignJustify, FileText, Home, CheckCircle, XCircle, Clock, Star, Euro, Download } from 'lucide-react';
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
import { PropertyViewSelector, PropertyViewType } from '@/components/admin/properties/PropertyViewSelector';
import { AppShell } from '@/components/dainabase-ui/AppShell';
import { AdminSidebarExecutive } from '@/components/admin/AdminSidebarExecutive';

const AdminHeader = () => (
  <div className="h-32 px-6 flex items-center justify-between bg-white border-b border-slate-200">
    <div className="flex items-center gap-4">
      <a href="/" className="text-2xl font-bold text-slate-900 hover:text-slate-700 transition-colors uppercase">
        ENKI-REALTY
      </a>
      <span className="text-slate-400">|</span>
      <span className="text-lg text-slate-500">Admin Dashboard</span>
    </div>
    <div className="flex items-center gap-4">
      <a href="/" className="text-base text-slate-600 hover:text-slate-900 transition-colors">
        Retour au site
      </a>
    </div>
  </div>
);

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
  city?: string;
  projectId?: string;
  buildingId?: string;
  developerId?: string;
  propertyType?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: string;
  goldenVisa?: string;
  hasView?: boolean;
  furnished?: boolean;
}


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
  const [viewMode, setViewMode] = useState<'table' | 'gallery'>('gallery');
  const [filters, setFilters] = useState<PropertyFilters>({
    city: 'all',
    minPrice: 0,
    maxPrice: 999999999,
    goldenVisa: 'all',
    status: 'all',
    bedrooms: 'all',
    propertyType: 'all'
  });
  
  // State management
  const [properties, setProperties] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch properties with relations
  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('properties_final')
        .select(`
          *,
          projects_clean (
            id,
            title,
            city
          ),
          buildings_enhanced (
            id,
            building_code
          )
        `)
        .order('unit_code');
      
      if (error) throw error;
      
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
    setFilters({
      city: 'all',
      minPrice: 0,
      maxPrice: 999999999,
      goldenVisa: 'all',
      status: 'all',
      bedrooms: 'all',
      propertyType: 'all'
    });
  };

  // Filter properties based on criteria
  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      if (filters.city !== 'all' && p.projects_clean?.city !== filters.city) return false;
      if (p.price < (filters.minPrice || 0) || p.price > (filters.maxPrice || 999999999)) return false;
      if (filters.goldenVisa === 'eligible' && !p.golden_visa_eligible) return false;
      if (filters.goldenVisa === 'not-eligible' && p.golden_visa_eligible) return false;
      if (filters.status !== 'all' && p.status !== filters.status) return false;
      if (filters.bedrooms !== 'all') {
        if (filters.bedrooms === '4+' && (p.bedrooms || 0) < 4) return false;
        if (filters.bedrooms !== '4+' && (p.bedrooms || 0) !== Number(filters.bedrooms)) return false;
      }
      if (filters.propertyType !== 'all' && p.property_type !== filters.propertyType) return false;
      return true;
    });
  }, [properties, filters]);

  // Statistics based on filtered properties
  const stats = useMemo(() => {
    return {
      total: filteredProperties.length,
      available: filteredProperties.filter(p => p.status === 'available').length,
      sold: filteredProperties.filter(p => p.status === 'sold').length,
      reserved: filteredProperties.filter(p => p.status === 'reserved').length,
      goldenVisa: filteredProperties.filter(p => p.golden_visa_eligible).length,
      totalValue: filteredProperties.reduce((sum, p) => sum + (p.price || 0), 0),
      avgPrice: filteredProperties.length > 0 ? Math.round(filteredProperties.reduce((sum, p) => sum + (p.price || 0), 0) / filteredProperties.length) : 0
    };
  }, [filteredProperties]);

  // Export to Excel (CSV format)
  const exportToExcel = () => {
    const headers = [
      'Code Unité', 'Type', 'Projet', 'Bâtiment', 'Ville',
      'Prix', 'Golden Visa', 'Chambres', 'SDB', 'Surface m²',
      'Statut', 'Étage', 'Orientation', 'Vue'
    ];
    
    const rows = filteredProperties.map(p => [
      p.unit_code,
      p.property_type,
      p.projects_clean?.title || '',
      p.buildings_enhanced?.building_code || '',
      p.projects_clean?.city || '',
      p.price,
      p.golden_visa_eligible ? 'Oui' : 'Non',
      p.bedrooms || '',
      p.bathrooms || '',
      p.internal_area_m2 || '',
      p.status,
      p.floor_number || '',
      p.orientation || '',
      p.view_type || ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `properties_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const renderPropertyView = () => {
    if (viewMode === 'gallery') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Image placeholder */}
              <div className="h-48 bg-gray-200 relative">
                {property.golden_visa_eligible && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
                    Golden Visa
                  </div>
                )}
                <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold ${
                  property.status === 'available' ? 'bg-green-500 text-white' :
                  property.status === 'reserved' ? 'bg-yellow-500 text-white' :
                  property.status === 'sold' ? 'bg-red-500 text-white' :
                  'bg-blue-500 text-white'
                }`}>
                  {property.status}
                </div>
              </div>
              
              {/* Details */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{property.unit_code}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {property.projects_clean?.title} - {property.buildings_enhanced?.building_code}
                </p>
                <p className="text-2xl font-bold text-blue-600 mb-2">
                  €{property.price?.toLocaleString()}
                </p>
                <div className="flex gap-4 text-sm text-gray-600 mb-3">
                  <span>🛏️ {property.bedrooms || 0} ch</span>
                  <span>🚿 {property.bathrooms || 0} sdb</span>
                  <span>📐 {property.internal_area_m2 || 0} m²</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => navigate(`/admin/properties/${property.id}/edit`)}>
                    Éditer
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleViewProperty(property)}>
                    Voir
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Table view
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedProperties.length === filteredProperties.length && filteredProperties.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propriété</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projet</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Détails</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProperties.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedProperties.includes(property.id)}
                      onChange={(e) => handleSelectProperty(property.id, e.target.checked)}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{property.unit_code}</div>
                      <div className="text-sm text-gray-500">{property.property_type}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{property.projects_clean?.title}</div>
                      <div className="text-sm text-gray-500">{property.buildings_enhanced?.building_code}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">€{property.price?.toLocaleString()}</div>
                    {property.golden_visa_eligible && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Golden Visa
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {property.bedrooms || 0} ch • {property.bathrooms || 0} sdb • {property.internal_area_m2 || 0} m²
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      property.status === 'available' ? 'bg-green-100 text-green-800' :
                      property.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
                      property.status === 'sold' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {property.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => navigate(`/admin/properties/${property.id}/edit`)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleViewProperty(property)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <AppShell
        variant="executive"
        header={<AdminHeader />}
        sidebar={<AdminSidebarExecutive />}
      >
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex justify-center items-center">
          <div className="text-center space-y-4">
            <LoadingSpinner />
            <p className="text-slate-600">Chargement des propriétés...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      variant="executive"
      header={<AdminHeader />}
      sidebar={<AdminSidebarExecutive />}
    >
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100 px-8 py-6 space-y-6">
        {/* Page Title and Actions */}
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Propriétés</h1>
              <p className="text-slate-600">Gérez votre inventaire de propriétés immobilières</p>
            </div>
            <Button 
              variant="outline"
              onClick={() => navigate('/admin/ai-import-unified')} 
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 gap-2"
              size="sm"
            >
              <Brain className="w-4 h-4" />
              Import IA
            </Button>
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
        {/* Stats Cards - Single Row */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600">Total</p>
                  <p className="text-xl font-bold text-slate-900">{stats.total}</p>
                </div>
                <Home className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600">Disponible</p>
                  <p className="text-xl font-bold text-green-600">{stats.available}</p>
                </div>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600">Vendu</p>
                  <p className="text-xl font-bold text-red-600">{stats.sold}</p>
                </div>
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600">Réservé</p>
                  <p className="text-xl font-bold text-orange-600">{stats.reserved}</p>
                </div>
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600">Golden Visa</p>
                  <p className="text-xl font-bold text-yellow-600">{stats.goldenVisa}</p>
                </div>
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600">Prix moyen</p>
                  <p className="text-lg font-bold text-blue-600">€{stats.avgPrice.toLocaleString()}</p>
                </div>
                <Euro className="h-5 w-5 text-blue-600" />
              </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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

                <div>
                  <Label htmlFor="developer">Développeur</Label>
                  <Select 
                    value={filters.developerId || 'all'} 
                    onValueChange={(value) => setFilters(prev => ({ ...prev, developerId: value === 'all' ? undefined : value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les développeurs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les développeurs</SelectItem>
                      {/* Add developers from projects */}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-4 pt-6">
                  <Button variant="outline" size="sm" onClick={handleClearFilters}>
                    Effacer les filtres
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="golden-visa"
                      checked={filters.goldenVisa === 'eligible'}
                      onCheckedChange={(checked) => setFilters(prev => ({ ...prev, goldenVisa: checked ? 'eligible' : 'all' }))}
                    />
                    <Label htmlFor="golden-visa">Golden Visa</Label>
                  </div>
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
    </AppShell>
  );
};

export default AdminProperties;