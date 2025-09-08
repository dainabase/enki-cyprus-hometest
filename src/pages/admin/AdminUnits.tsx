import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Home, Search, Filter, Eye, Edit, Crown, MapPin, Euro } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface Unit {
  id: string;
  title: string;
  price: number;
  property_category: string;
  property_sub_type: string[];
  location: {
    city?: string;
    lat?: number;
    lng?: number;
  };
  reservation_status?: 'available' | 'reserved' | 'sold';
  golden_visa_eligible?: boolean;
  vat_rate?: number;
  commission_rate?: number;
  cyprus_zone?: string;
  photos?: string[];
  created_at: string;
}

const AdminUnits = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [zoneFilter, setZoneFilter] = useState<string>('all');
  const [goldenVisaFilter, setGoldenVisaFilter] = useState<string>('all');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch units with developer info
  const { data: units = [], isLoading } = useQuery({
    queryKey: ['admin-units'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []) as Unit[];
    }
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('projects')
        .update({ reservation_status: status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-units'] });
      toast({
        title: 'Statut modifié',
        description: 'Le statut de l\'unité a été mis à jour.'
      });
    }
  });

  // Filter units
  const filteredUnits = units.filter(unit => {
    const matchesSearch = unit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         unit.location.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || unit.reservation_status === statusFilter;
    const matchesType = typeFilter === 'all' || (unit.property_sub_type && unit.property_sub_type.includes(typeFilter));
    const matchesZone = zoneFilter === 'all' || unit.cyprus_zone === zoneFilter;
    const matchesGoldenVisa = goldenVisaFilter === 'all' || 
                              (goldenVisaFilter === 'true' && unit.golden_visa_eligible) ||
                              (goldenVisaFilter === 'false' && !unit.golden_visa_eligible);
    
    return matchesSearch && matchesStatus && matchesType && matchesZone && matchesGoldenVisa;
  });

  const stats = {
    total: units.length,
    available: units.filter(u => u.reservation_status === 'available').length,
    reserved: units.filter(u => u.reservation_status === 'reserved').length,
    sold: units.filter(u => u.reservation_status === 'sold').length,
    goldenVisa: units.filter(u => u.golden_visa_eligible).length,
    totalValue: units.reduce((acc, unit) => acc + (unit.price || 0), 0)
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
          <h1 className="text-3xl font-bold">Inventaire Unités</h1>
          <p className="text-muted-foreground">Gestion complète du portefeuille immobilier</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Unités</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
            <Home className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réservées</CardTitle>
            <Home className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.reserved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendues</CardTitle>
            <Home className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.sold}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Golden Visa</CardTitle>
            <Crown className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.goldenVisa}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valeur Totale</CardTitle>
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
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
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
                <SelectItem value="all">Tous statuts</SelectItem>
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
                <SelectItem value="all">Tous types</SelectItem>
                <SelectItem value="apartment">Appartement</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="penthouse">Penthouse</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>

            <Select value={zoneFilter} onValueChange={setZoneFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes zones</SelectItem>
                <SelectItem value="limassol">Limassol</SelectItem>
                <SelectItem value="paphos">Paphos</SelectItem>
                <SelectItem value="larnaca">Larnaca</SelectItem>
                <SelectItem value="nicosia">Nicosia</SelectItem>
                <SelectItem value="famagusta">Famagusta</SelectItem>
                <SelectItem value="kyrenia">Kyrenia</SelectItem>
              </SelectContent>
            </Select>

            <Select value={goldenVisaFilter} onValueChange={setGoldenVisaFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Golden Visa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="true">Golden Visa</SelectItem>
                <SelectItem value="false">Standard</SelectItem>
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
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Units Table */}
      <Card>
        <CardHeader>
          <CardTitle>Unités ({filteredUnits.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unité</TableHead>
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
              {filteredUnits.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{unit.title}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {unit.location.city}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">-</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{unit.property_category || 'Résidentiel'}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize">{unit.cyprus_zone}</span>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{formatPrice(unit.price)}</div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{unit.vat_rate}%</span>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={unit.reservation_status}
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
                      <Button variant="outline" size="sm">
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
    </div>
  );
};

export default AdminUnits;