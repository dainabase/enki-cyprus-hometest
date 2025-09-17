import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Home, Search, Filter, Eye, Edit, Crown, MapPin, Euro, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import PropertyWizard from '@/components/admin/properties/PropertyWizard';

interface Property {
  id: string;
  unit_number: string;
  floor: number;
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
  const [goldenVisaFilter, setGoldenVisaFilter] = useState<string>('all');
  const [showWizard, setShowWizard] = useState(false);
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

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
        title: t('units.statusModified'),
        description: t('units.unitStatusUpdated')
      });
    }
  });

  // Filter units
  const filteredUnits = units.filter(unit => {
    const matchesSearch = unit.unit_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         unit.project?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         unit.project?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || unit.property_status === statusFilter;
    const matchesType = typeFilter === 'all' || unit.property_type === typeFilter;
    const matchesZone = zoneFilter === 'all' || unit.project?.cyprus_zone === zoneFilter;
    const matchesGoldenVisa = goldenVisaFilter === 'all' || 
                              (goldenVisaFilter === 'true' && unit.golden_visa_eligible) ||
                              (goldenVisaFilter === 'false' && !unit.golden_visa_eligible);
    
    return matchesSearch && matchesStatus && matchesType && matchesZone && matchesGoldenVisa;
  });

  const stats = {
    total: units.length,
    available: units.filter(u => u.property_status === 'available').length,
    reserved: units.filter(u => u.property_status === 'reserved').length,
    sold: units.filter(u => u.property_status === 'sold').length,
    goldenVisa: units.filter(u => u.golden_visa_eligible).length,
    totalValue: units.reduce((acc, unit) => acc + (unit.price_excluding_vat || 0), 0)
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'reserved': return 'bg-yellow-100 text-yellow-800';
      case 'sold': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'reserved': return 'Réservé';
      case 'sold': return 'Vendu';
      default: return status;
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t('units.title')}</h1>
          <p className="text-muted-foreground">{t('units.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowWizard(true)} variant="outline" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Créer en lot
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('units.totalUnits')}</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('units.available')}</CardTitle>
            <Home className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('units.reserved')}</CardTitle>
            <Home className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.reserved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('units.sold')}</CardTitle>
            <Home className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.sold}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('units.goldenVisa')}</CardTitle>
            <Crown className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.goldenVisa}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('units.totalValue')}</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{formatPrice(stats.totalValue)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            {t('units.filters')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('units.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('fields.status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('units.allStatuses')}</SelectItem>
                <SelectItem value="available">{t('units.available')}</SelectItem>
                <SelectItem value="reserved">{t('units.reserved')}</SelectItem>
                <SelectItem value="sold">{t('units.sold')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('fields.type')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('units.allTypes')}</SelectItem>
                <SelectItem value="apartment">{t('units.apartment')}</SelectItem>
                <SelectItem value="villa">{t('units.villa')}</SelectItem>
                <SelectItem value="penthouse">{t('units.penthouse')}</SelectItem>
                <SelectItem value="commercial">{t('units.commercial')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={zoneFilter} onValueChange={setZoneFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('fields.zone')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('units.allZones')}</SelectItem>
                <SelectItem value="limassol">{t('units.limassol')}</SelectItem>
                <SelectItem value="paphos">{t('units.paphos')}</SelectItem>
                <SelectItem value="larnaca">{t('units.larnaca')}</SelectItem>
                <SelectItem value="nicosia">{t('units.nicosia')}</SelectItem>
                <SelectItem value="famagusta">{t('units.famagusta')}</SelectItem>
                <SelectItem value="kyrenia">{t('units.kyrenia')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={goldenVisaFilter} onValueChange={setGoldenVisaFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('units.goldenVisa')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('units.all')}</SelectItem>
                <SelectItem value="true">{t('units.goldenVisa')}</SelectItem>
                <SelectItem value="false">{t('units.standard')}</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setTypeFilter('all');
                setZoneFilter('all');
                setGoldenVisaFilter('all');
              }}
            >
              {t('units.reset')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Units Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('fields.units')} ({filteredUnits.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('units.unit')}</TableHead>
                <TableHead>{t('units.developer')}</TableHead>
                <TableHead>{t('units.type')}</TableHead>
                <TableHead>{t('units.zone')}</TableHead>
                <TableHead>{t('units.price')}</TableHead>
                <TableHead>{t('units.vat')}</TableHead>
                <TableHead>{t('units.status')}</TableHead>
                <TableHead>{t('units.goldenVisa')}</TableHead>
                <TableHead>{t('units.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUnits.map((unit) => (
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
                    <span className="capitalize">{unit.project.cyprus_zone}</span>
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
                        <SelectItem value="available">{t('units.available')}</SelectItem>
                        <SelectItem value="reserved">{t('units.reserved')}</SelectItem>
                        <SelectItem value="sold">{t('units.sold')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {unit.golden_visa_eligible ? (
                      <Badge className="bg-amber-100 text-amber-800">
                        <Crown className="w-3 h-3 mr-1" />
                        {t('units.goldenVisa')}
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