import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/dainabase-ui';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useDebounceCallback } from '@/hooks/useDebounceCallback';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';

interface Property {
  id: string;
  unit_number?: string;
  property_sub_type?: string[];
  price?: number;
  status?: string;
  title?: string;
  developer_id?: string;
  building_id?: string;
  golden_visa_eligible?: boolean;
  vat_included?: boolean;
  created_at?: string;
  buildings?: {
    name?: string;
  };
  developers?: {
    name?: string;
  };
}

const AdminProperties = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priceRangeFilter, setPriceRangeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Debounced search
  const debouncedSearch = useDebounceCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, 300);

  // Fetch properties with joins
  const { data: properties = [], isLoading, error } = useQuery({
    queryKey: ['admin-properties', searchTerm, statusFilter, typeFilter, priceRangeFilter, currentPage],
    queryFn: async () => {
      let query = supabase
        .from('projects')
        .select(`
          id,
          unit_number,
          property_sub_type,
          price,
          status,
          title,
          developer_id,
          building_id,
          created_at,
          golden_visa_eligible,
          vat_included,
          buildings(name),
          developers(name)
        `);

      // Apply filters
      if (searchTerm) {
        query = query.or(`unit_number.ilike.%${searchTerm}%,title.ilike.%${searchTerm}%`);
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (typeFilter !== 'all') {
        query = query.contains('property_sub_type', [typeFilter]);
      }

      // Apply price range filter
      if (priceRangeFilter !== 'all') {
        const ranges = {
          '0-100000': [0, 100000],
          '100000-300000': [100000, 300000],
          '300000-500000': [300000, 500000],
          '500000+': [500000, 99999999]
        };
        const [min, max] = ranges[priceRangeFilter as keyof typeof ranges] || [0, 99999999];
        query = query.gte('price', min).lte('price', max);
      }

      // Pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      query = query.range(from, to);

      const { data, error } = await query;
      if (error) throw error;

      return data as Property[];
    },
  });

  // Delete property mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      toast({
        title: "Succès",
        description: "Propriété supprimée avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Erreur lors de la suppression: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Analytics event
  React.useEffect(() => {
    // GA4 event: admin_properties_viewed
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'admin_properties_viewed', {
        event_category: 'admin',
        event_label: 'properties_list'
      });
    }
  }, []);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'available':
      case 'under_construction':
        return 'bg-green-100 text-green-800';
      case 'sold':
        return 'bg-red-100 text-red-800';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'under_construction':
        return 'En construction';
      case 'sold':
        return 'Vendu';
      case 'reserved':
        return 'Réservé';
      default:
        return status || 'Non défini';
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'Non défini';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette propriété ?')) {
      deleteMutation.mutate(id);
    }
  };

  if (error) {
    throw error;
  }

  const totalPages = Math.ceil((properties?.length || 0) / itemsPerPage);

  return (
    <ErrorBoundary>
      <div className="space-y-6 p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Propriétés</h1>
            <p className="text-slate-600 mt-1">
              Gestion des propriétés individuelles et unités
            </p>
          </div>
          <Button
            className="bg-primary hover:bg-primary/90 text-white"
            onClick={() => {
              // Placeholder for add property modal
              toast({
                title: "Fonctionnalité à venir",
                description: "Le formulaire d'ajout de propriété sera disponible prochainement",
              });
            }}
            aria-label="Ajouter une nouvelle propriété"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une propriété
          </Button>
        </motion.div>

        {/* Filters */}
        <Card variant="executive" className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par numéro d'unité ou titre..."
                className="pl-10"
                onChange={(e) => debouncedSearch(e.target.value)}
                aria-label="Rechercher des propriétés"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="available">Disponible</SelectItem>
                <SelectItem value="under_construction">En construction</SelectItem>
                <SelectItem value="sold">Vendu</SelectItem>
                <SelectItem value="reserved">Réservé</SelectItem>
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
              </SelectContent>
            </Select>

            <Select value={priceRangeFilter} onValueChange={setPriceRangeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Gamme de prix" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les gammes</SelectItem>
                <SelectItem value="0-100000">0 - 100k €</SelectItem>
                <SelectItem value="100000-300000">100k - 300k €</SelectItem>
                <SelectItem value="300000-500000">300k - 500k €</SelectItem>
                <SelectItem value="500000+">500k+ €</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Properties Table */}
        <Card variant="executive" className="overflow-hidden">
          {isLoading ? (
            <div className="p-8">
              <LoadingSpinner text="Chargement des propriétés..." />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Numéro d'unité</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Projet</TableHead>
                    <TableHead>Bâtiment</TableHead>
                    <TableHead>Prix (TTC)</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Golden Visa</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((property) => (
                    <motion.tr
                      key={property.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-slate-50"
                    >
                      <TableCell className="font-medium">
                        {property.unit_number || 'Non défini'}
                      </TableCell>
                      <TableCell>
                        {property.property_sub_type?.[0] || 'Non défini'}
                      </TableCell>
                      <TableCell>{property.title || 'Non défini'}</TableCell>
                      <TableCell>
                        {(property as any).buildings?.name || 'Non assigné'}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatPrice(property.price)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getStatusColor(property.status)}
                          variant="secondary"
                        >
                          {getStatusLabel(property.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={property.golden_visa_eligible ? "default" : "secondary"}
                          className={property.golden_visa_eligible ? "bg-green-100 text-green-800" : ""}
                        >
                          {property.golden_visa_eligible ? 'Éligible' : 'Non éligible'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Placeholder for view property
                              toast({
                                title: "Fonctionnalité à venir",
                                description: "La vue détaillée sera disponible prochainement",
                              });
                            }}
                            aria-label="Voir la propriété"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Placeholder for edit property
                              toast({
                                title: "Fonctionnalité à venir",
                                description: "L'édition sera disponible prochainement",
                              });
                            }}
                            aria-label="Modifier la propriété"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(property.id)}
                            className="text-red-600 hover:text-red-700"
                            aria-label="Supprimer la propriété"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>

              {properties.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-slate-500">Aucune propriété trouvée</p>
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <p className="text-sm text-slate-600">
                Page {currentPage} sur {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </ErrorBoundary>
  );
};

export default AdminProperties;