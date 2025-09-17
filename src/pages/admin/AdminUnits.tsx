import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Home, Search, Filter, Eye, Edit, Crown, MapPin, Euro, Plus, Download, TrendingUp, TrendingDown, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import PropertyWizard from '@/components/admin/properties/PropertyWizard';
import { convertToCSV, downloadCSV } from '@/utils/csvExport';

interface Property {
  id: string;
  unit_number: string;
  floor_number: number;
  property_type: string;
  bedrooms_count: number;
  bathrooms_count: number;
  internal_area: number;
  price_excluding_vat: number;
  price_including_vat: number;
  property_status: 'available' | 'reserved' | 'sold' | 'rented' | 'unavailable';
  golden_visa_eligible: boolean;
  view_type?: string[];
  orientation?: string;
  balcony_area?: number;
  parking_spaces?: number;
  has_sea_view?: boolean;
  vat_rate?: number;
  commission_rate?: number;
  created_at: string;
  project: {
    id: string;
    title: string;
    city: string;
    cyprus_zone?: string;
  } | null;
  building: {
    id: string;
    name: string;
    building_type: string;
  } | null;
  developer: {
    id: string;
    name: string;
  } | null;
}

const AdminUnits = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [zoneFilter, setZoneFilter] = useState<string>('all');
  const [developerFilter, setDeveloperFilter] = useState<string>('all');
  const [priceMin, setPriceMin] = useState<string>('');
  const [priceMax, setPriceMax] = useState<string>('');
  const [goldenVisaOnly, setGoldenVisaOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showWizard, setShowWizard] = useState(false);
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 25;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Load filters from localStorage
  useEffect(() => {
    const savedFilters = localStorage.getItem('admin-units-filters');
    if (savedFilters) {
      const filters = JSON.parse(savedFilters);
      setStatusFilter(filters.statusFilter || 'all');
      setTypeFilter(filters.typeFilter || 'all');
      setZoneFilter(filters.zoneFilter || 'all');
      setDeveloperFilter(filters.developerFilter || 'all');
      setPriceMin(filters.priceMin || '');
      setPriceMax(filters.priceMax || '');
      setGoldenVisaOnly(filters.goldenVisaOnly || false);
    }
  }, []);

  // Save filters to localStorage
  useEffect(() => {
    const filters = {
      statusFilter,
      typeFilter,
      zoneFilter,
      developerFilter,
      priceMin,
      priceMax,
      goldenVisaOnly
    };
    localStorage.setItem('admin-units-filters', JSON.stringify(filters));
  }, [statusFilter, typeFilter, zoneFilter, developerFilter, priceMin, priceMax, goldenVisaOnly]);

  // Fetch properties with enriched data
  const { data: units = [], isLoading } = useQuery({
    queryKey: ['admin-units'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          project:project_id(
            id,
            title,
            city,
            cyprus_zone
          ),
          building:building_id(
            id,
            name,
            building_type
          ),
          developer:developer_id(
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []) as any[];
    }
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('properties')
        .update({ property_status: status as 'available' | 'reserved' | 'sold' | 'rented' | 'unavailable' })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-units'] });
      toast({
        title: 'Statut modifié',
        description: 'Le statut de la propriété a été mis à jour'
      });
    }
  });

  // Filter units with enhanced logic
  const filteredUnits = units.filter(unit => {
    const matchesSearch = unit.unit_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         unit.project?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         unit.project?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || unit.property_status === statusFilter;
    const matchesType = typeFilter === 'all' || unit.property_type === typeFilter;
    const matchesZone = zoneFilter === 'all' || unit.project?.cyprus_zone === zoneFilter;
    const matchesDeveloper = developerFilter === 'all' || unit.developer?.id === developerFilter;
    const matchesGoldenVisaOnly = !goldenVisaOnly || unit.golden_visa_eligible;
    
    // Price filters
    const unitPrice = unit.price_excluding_vat || 0;
    const matchesPriceMin = !priceMin || unitPrice >= parseFloat(priceMin);
    const matchesPriceMax = !priceMax || unitPrice <= parseFloat(priceMax);
    
    return matchesSearch && matchesStatus && matchesType && matchesZone && 
           matchesDeveloper && matchesGoldenVisaOnly &&
           matchesPriceMin && matchesPriceMax;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUnits.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUnits = filteredUnits.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Enhanced statistics
  const stats = {
    total: units.length,
    available: units.filter(u => u.property_status === 'available').length,
    reserved: units.filter(u => u.property_status === 'reserved').length,
    sold: units.filter(u => u.property_status === 'sold').length,
    goldenVisa: units.filter(u => u.golden_visa_eligible).length,
    totalValue: units.reduce((acc, unit) => acc + (unit.price_excluding_vat || 0), 0),
    goldenVisaValue: units
      .filter(u => u.golden_visa_eligible)
      .reduce((acc, unit) => acc + (unit.price_excluding_vat || 0), 0)
  };

  const availablePercentage = stats.total > 0 ? Math.round((stats.available / stats.total) * 100) : 0;
  const reservedPercentage = stats.total > 0 ? Math.round((stats.reserved / stats.total) * 100) : 0;
  const soldPercentage = stats.total > 0 ? Math.round((stats.sold / stats.total) * 100) : 0;

  // Get unique developers for filter
  const developers = Array.from(new Set(units.map(u => u.developer).filter(Boolean)));

  // Export to CSV function
  const handleExportCSV = () => {
    const csvData = filteredUnits.map(unit => ({
      'Référence': unit.unit_number || '',
      'Projet': unit.project?.title || '',
      'Bâtiment': unit.building?.name || 'Villa individuelle',
      'Développeur': unit.developer?.name || '',
      'Type': unit.property_type || '',
      'Surface (m²)': unit.internal_area || '',
      'Chambres': unit.bedrooms_count || '',
      'Salles de bain': unit.bathrooms_count || '',
      'Étage': unit.floor_number || 0,
      'Orientation': unit.orientation || '',
      'Prix HT (€)': unit.price_excluding_vat || 0,
      'Prix TTC (€)': unit.price_including_vat || 0,
      'TVA (%)': unit.vat_rate || 5,
      'Statut': unit.property_status || '',
      'Golden Visa': unit.golden_visa_eligible ? 'Oui' : 'Non',
      'Ville': unit.project?.city || '',
      'Zone': unit.project?.cyprus_zone || '',
      'Places parking': unit.parking_spaces || 0,
      'Vue mer': unit.has_sea_view ? 'Oui' : 'Non',
      'Date création': new Date(unit.created_at).toLocaleDateString('fr-FR')
    }));

    const csv = convertToCSV(csvData);
    const filename = `proprietes_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csv, filename);
    
    toast({
      title: 'Export réussi',
      description: `${csvData.length} propriétés exportées vers ${filename}`
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Propriétés</h1>
          <p className="text-muted-foreground">Gérez toutes les propriétés de votre portefeuille</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowWizard(true)} variant="outline" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Créer en lot
          </Button>
          <Button onClick={handleExportCSV} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exporter CSV
          </Button>
          <Button onClick={() => {
            setEditingPropertyId(null);
            setShowPropertyForm(true);
          }} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle Propriété
          </Button>
        </div>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Propriétés</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Valeur totale: {formatPrice(stats.totalValue)}
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-xs text-green-600">{availablePercentage}%</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réservées</CardTitle>
            <div className="flex items-center gap-1">
              <TrendingDown className="h-4 w-4 text-yellow-600" />
              <span className="text-xs text-yellow-600">{reservedPercentage}%</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.reserved}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendues</CardTitle>
            <div className="flex items-center gap-1">
              <Home className="h-4 w-4 text-red-600" />
              <span className="text-xs text-red-600">{soldPercentage}%</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.sold}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Golden Visa</CardTitle>
            <Crown className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.goldenVisa}</div>
            <p className="text-xs text-muted-foreground">
              Valeur: {formatPrice(stats.goldenVisaValue)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtres avancés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="available">Disponible</SelectItem>
                <SelectItem value="reserved">Réservé</SelectItem>
                <SelectItem value="sold">Vendu</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="apartment">Appartement</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="penthouse">Penthouse</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
                <SelectItem value="townhouse">Maison de ville</SelectItem>
              </SelectContent>
            </Select>

            <Select value={zoneFilter} onValueChange={setZoneFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les zones</SelectItem>
                <SelectItem value="limassol">Limassol</SelectItem>
                <SelectItem value="paphos">Paphos</SelectItem>
                <SelectItem value="larnaca">Larnaca</SelectItem>
                <SelectItem value="nicosia">Nicosia</SelectItem>
                <SelectItem value="famagusta">Famagusta</SelectItem>
                <SelectItem value="kyrenia">Kyrenia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={developerFilter} onValueChange={setDeveloperFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Développeur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les développeurs</SelectItem>
                {developers.map(dev => (
                  <SelectItem key={dev.id} value={dev.id}>
                    {dev.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="Prix min"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
            />

            <Input
              type="number"
              placeholder="Prix max"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
            />

            <div className="flex items-center space-x-2">
              <Switch
                id="golden-visa-only"
                checked={goldenVisaOnly}
                onCheckedChange={setGoldenVisaOnly}
              />
              <Label htmlFor="golden-visa-only" className="text-sm">
                Golden Visa uniquement
              </Label>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setTypeFilter('all');
                setZoneFilter('all');
                setDeveloperFilter('all');
                setPriceMin('');
                setPriceMax('');
                setGoldenVisaOnly(false);
                setCurrentPage(1);
              }}
            >
              Réinitialiser les filtres
            </Button>
            
            <div className="text-sm text-muted-foreground">
              {filteredUnits.length} propriété(s) trouvée(s) sur {stats.total}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Properties Table */}
      <Card>
        <CardHeader>
          <CardTitle>Propriétés ({filteredUnits.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Propriété</TableHead>
                <TableHead>Développeur</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>TVA</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Golden Visa</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUnits.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{unit.unit_number}</div>
                      <div className="text-sm text-muted-foreground">
                        {unit.building?.name || 'Villa individuelle'} - Étage {unit.floor_number || 0}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {unit.project?.city}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{unit.developer?.name || unit.project?.title || '-'}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{unit.property_type}</Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      {unit.bedrooms_count}ch • {unit.bathrooms_count}sdb • {unit.internal_area}m²
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize">{unit.project?.cyprus_zone}</span>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{formatPrice(unit.price_excluding_vat)}</div>
                    <div className="text-xs text-muted-foreground">
                      TTC: {formatPrice(unit.price_including_vat)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{unit.vat_rate}%</span>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={unit.property_status}
                      onValueChange={(value) => updateStatusMutation.mutate({ id: unit.id, status: value })}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Disponible</SelectItem>
                        <SelectItem value="reserved">Réservé</SelectItem>
                        <SelectItem value="sold">Vendu</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {unit.golden_visa_eligible ? (
                      <Badge className="bg-amber-100 text-amber-800">
                        <Crown className="w-3 h-3 mr-1" />
                        Golden Visa
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setEditingPropertyId(unit.id);
                          setShowPropertyForm(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} sur {totalPages} ({filteredUnits.length} propriétés)
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* PropertyWizard Modal */}
      <PropertyWizard 
        open={showWizard}
        onClose={() => setShowWizard(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['admin-units'] });
        }}
      />

      {/* PropertyForm Modal - Simplified for now */}
      <Dialog open={showPropertyForm} onOpenChange={setShowPropertyForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingPropertyId ? 'Modifier la propriété' : 'Nouvelle propriété'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Le formulaire détaillé de propriété va s'ouvrir dans une nouvelle fenêtre.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  const url = `/admin/property-form${editingPropertyId ? `?id=${editingPropertyId}` : ''}`;
                  window.open(url, '_blank');
                  setShowPropertyForm(false);
                  setEditingPropertyId(null);
                }}
                className="flex-1"
              >
                Ouvrir le formulaire
              </Button>
              <Button variant="outline" onClick={() => setShowPropertyForm(false)}>
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUnits;