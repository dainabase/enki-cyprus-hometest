import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, TrendingUp, Euro, Calendar, Search, Download, Phone, Mail, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Promoter {
  id: string;
  name: string;
  contact: any; // JSON field from Supabase
  projects: string[];
  commission_rate: number;
  created_at: string;
}

interface Commission {
  id: string;
  promoter_id: string;
  promoter?: Promoter;
  user_id: string | null;
  project_id: string;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  date: string;
  created_at: string;
}

interface PromoterStats {
  total_commissions: number;
  pending_amount: number;
  paid_amount: number;
  projects_count: number;
}

export function PromotersSection() {
  const [promoters, setPromoters] = useState<Promoter[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [stats, setStats] = useState<Record<string, PromoterStats>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('30');
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch promoters
      const { data: promotersData, error: promotersError } = await supabase
        .from('promoters')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (promotersError) throw promotersError;

      // Fetch commissions
      const { data: commissionsData, error: commissionsError } = await supabase
        .from('commissions')
        .select('*')
        .order('date', { ascending: false });
      
      if (commissionsError) throw commissionsError;

      setPromoters(promotersData || []);
      
      // Merge promoter data with commissions
      const commissionsWithPromoters = commissionsData?.map(commission => ({
        ...commission,
        status: commission.status as 'pending' | 'paid' | 'cancelled',
        promoter: promotersData?.find(p => p.id === commission.promoter_id)
      })) || [];
      
      setCommissions(commissionsWithPromoters as Commission[]);

      // Calculate stats
      const calculatedStats: Record<string, PromoterStats> = {};
      promotersData?.forEach(promoter => {
        const promoterCommissions = commissionsData?.filter(c => c.promoter_id === promoter.id) || [];
        
        calculatedStats[promoter.id] = {
          total_commissions: promoterCommissions.length,
          pending_amount: promoterCommissions
            .filter(c => c.status === 'pending')
            .reduce((sum, c) => sum + c.amount, 0),
          paid_amount: promoterCommissions
            .filter(c => c.status === 'paid')
            .reduce((sum, c) => sum + c.amount, 0),
          projects_count: promoter.projects.length
        };
      });
      
      setStats(calculatedStats);
    } catch (error) {
      console.error('Error fetching promoters data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données des promoteurs.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'default',
      paid: 'secondary',
      cancelled: 'destructive'
    } as const;
    
    const labels = {
      pending: 'En attente',
      paid: 'Payée',
      cancelled: 'Annulée'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'default'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const filteredCommissions = commissions.filter(commission => {
    const matchesSearch = commission.promoter?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || commission.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const daysAgo = parseInt(dateFilter);
      const filterDate = new Date();
      filterDate.setDate(filterDate.getDate() - daysAgo);
      matchesDate = new Date(commission.date) >= filterDate;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const exportCSV = () => {
    const csvContent = [
      ['Promoteur', 'Montant', 'Statut', 'Date', 'Projet'].join(','),
      ...filteredCommissions.map(commission => [
        commission.promoter?.name || 'N/A',
        commission.amount,
        commission.status,
        formatDate(commission.date),
        commission.project_id
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commissions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  const totalStats = {
    totalPromoters: promoters.length,
    totalPending: Object.values(stats).reduce((sum, s) => sum + s.pending_amount, 0),
    totalPaid: Object.values(stats).reduce((sum, s) => sum + s.paid_amount, 0),
    totalCommissions: Object.values(stats).reduce((sum, s) => sum + s.total_commissions, 0)
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">Promoteurs</p>
                  <p className="text-2xl font-bold">{totalStats.totalPromoters}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Euro className="h-4 w-4 text-muted-foreground" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">En attente</p>
                  <p className="text-2xl font-bold text-amber-600">{formatCurrency(totalStats.totalPending)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">Payées</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(totalStats.totalPaid)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">Total commissions</p>
                  <p className="text-2xl font-bold">{totalStats.totalCommissions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Top Promoters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Promoteurs</CardTitle>
            <CardDescription>Classement par volume de commissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {promoters
                .sort((a, b) => (stats[b.id]?.paid_amount || 0) - (stats[a.id]?.paid_amount || 0))
                .slice(0, 10)
                .map((promoter, index) => (
                  <motion.div
                    key={promoter.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{promoter.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {promoter.contact.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {promoter.contact.email}
                            </div>
                          )}
                          {promoter.contact.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {promoter.contact.phone}
                            </div>
                          )}
                          {promoter.contact.website && (
                            <div className="flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              {promoter.contact.website}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        {formatCurrency(stats[promoter.id]?.paid_amount || 0)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {stats[promoter.id]?.total_commissions || 0} commissions
                      </p>
                      <Badge variant="outline">{promoter.commission_rate * 100}%</Badge>
                    </div>
                  </motion.div>
                ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Commissions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Rapport des Commissions</CardTitle>
            <CardDescription>Historique détaillé des commissions</CardDescription>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un promoteur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="paid">Payées</SelectItem>
                  <SelectItem value="cancelled">Annulées</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 derniers jours</SelectItem>
                  <SelectItem value="30">30 derniers jours</SelectItem>
                  <SelectItem value="90">90 derniers jours</SelectItem>
                  <SelectItem value="all">Toutes les dates</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={exportCSV}>
                <Download className="h-4 w-4 mr-2" />
                Exporter CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Promoteur</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Projet</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCommissions.map((commission, index) => (
                  <motion.tr
                    key={commission.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    className="border-b"
                  >
                    <TableCell className="font-medium">
                      {commission.promoter?.name || 'N/A'}
                    </TableCell>
                    <TableCell className="font-bold">
                      {formatCurrency(commission.amount)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(commission.status)}
                    </TableCell>
                    <TableCell>{formatDate(commission.date)}</TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {commission.project_id.slice(0, 8)}...
                      </code>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
            
            {filteredCommissions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Aucune commission trouvée avec les filtres sélectionnés.
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}