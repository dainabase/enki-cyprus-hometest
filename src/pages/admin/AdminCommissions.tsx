import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  DollarSign,
  TrendingUp,
  FileText,
  Download,
  Calendar,
  User,
  Building,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface Commission {
  id: string;
  amount: number;
  status: string;
  date: string;
  project_id: string;
  promoter_id: string;
  created_at: string;
  updated_at: string;
  project?: any;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const AdminCommissions = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('this_month');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch commissions data
  const { data: commissions = [], isLoading } = useQuery({
    queryKey: ['admin-commissions', statusFilter, dateFilter],
    queryFn: async (): Promise<Commission[]> => {
      let query = supabase
        .from('commissions')
        .select(`
          *,
          project:projects(title, type, location)
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      // Date filtering logic would go here
      const { data, error } = await query;
      if (error) throw error;
      
      return (data || []) as unknown as Commission[];
    }
  });

  // Calculate statistics
  const stats = {
    totalCommissions: commissions.reduce((sum, c) => sum + c.amount, 0),
    pendingAmount: commissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0),
    paidAmount: commissions.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.amount, 0),
    overdueAmount: commissions.filter(c => c.status === 'overdue').reduce((sum, c) => sum + c.amount, 0),
    pendingCount: commissions.filter(c => c.status === 'pending').length,
    paidCount: commissions.filter(c => c.status === 'paid').length,
    overdueCount: commissions.filter(c => c.status === 'overdue').length
  };

  const filteredCommissions = commissions.filter(commission => {
    const matchesSearch = searchTerm === '' || 
      commission.project?.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const statusColors = {
    pending: { bg: 'bg-orange-100', text: 'text-orange-800', icon: Clock },
    paid: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
    overdue: { bg: 'bg-red-100', text: 'text-red-800', icon: AlertCircle }
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['ID', 'Montant', 'Statut', 'Date', 'Projet', 'Type'].join(','),
      ...filteredCommissions.map(c => [
        c.id,
        c.amount,
        c.status,
        new Date(c.date).toLocaleDateString('fr-FR'),
        c.project?.title || 'N/A',
        c.project?.type || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commissions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <LoadingSpinner size="lg" text="Chargement des commissions..." />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-light tracking-tight text-primary">
              Gestion des Commissions
            </h1>
            <p className="text-lg text-secondary mt-2">
              Suivi des paiements et facturation
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="w-4 h-4 mr-2" />
              Exporter CSV
            </Button>
            <Button className="btn-premium">
              <FileText className="w-4 h-4 mr-2" />
              Nouvelle Facture
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
      >
        {[
          {
            title: 'Total Commissions',
            value: `€${stats.totalCommissions.toLocaleString()}`,
            icon: DollarSign,
            description: 'Montant total',
            trend: '+12%'
          },
          {
            title: 'En Attente',
            value: `€${stats.pendingAmount.toLocaleString()}`,
            icon: Clock,
            description: `${stats.pendingCount} factures`,
            trend: `${stats.pendingCount} en cours`
          },
          {
            title: 'Payées',
            value: `€${stats.paidAmount.toLocaleString()}`,
            icon: CheckCircle,
            description: `${stats.paidCount} factures`,
            trend: `${stats.paidCount} réglées`
          },
          {
            title: 'En Retard',
            value: `€${stats.overdueAmount.toLocaleString()}`,
            icon: AlertCircle,
            description: `${stats.overdueCount} factures`,
            trend: `${stats.overdueCount} à relancer`
          }
        ].map((stat, index) => (
          <motion.div key={stat.title} variants={item}>
            <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-secondary">
                  {stat.title}
                </CardTitle>
                <div className="p-2 rounded-lg bg-primary/10">
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-light tracking-tight text-primary mb-1">
                  {stat.value}
                </div>
                <p className="text-xs text-secondary">
                  {stat.description}
                </p>
                <Badge variant="outline" className="text-xs mt-1">
                  {stat.trend}
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <Card className="shadow-md border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <DollarSign className="w-5 h-5" />
            Filtres et Recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Rechercher par projet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="paid">Payées</SelectItem>
                <SelectItem value="overdue">En retard</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this_month">Ce mois</SelectItem>
                <SelectItem value="last_month">Mois dernier</SelectItem>
                <SelectItem value="this_quarter">Ce trimestre</SelectItem>
                <SelectItem value="this_year">Cette année</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Commissions List */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <FileText className="w-5 h-5" />
            Liste des Commissions
          </CardTitle>
          <CardDescription>
            {filteredCommissions.length} commission(s) trouvée(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCommissions.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="w-12 h-12 text-secondary/50 mx-auto mb-4" />
                <p className="text-secondary">Aucune commission trouvée</p>
              </div>
            ) : (
              filteredCommissions.map((commission, index) => (
                <motion.div
                  key={commission.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg border bg-accent/30 hover:bg-accent/50 transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Building className="w-5 h-5 text-primary" />
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-primary">
                        {commission.project?.title || 'Projet non spécifié'}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-secondary">
                        <Calendar className="w-3 h-3" />
                        {new Date(commission.date).toLocaleDateString('fr-FR')}
                        <span className="text-xs">•</span>
                        <span className="capitalize">{commission.project?.type || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-semibold text-primary">
                        €{commission.amount.toLocaleString()}
                      </div>
                      <div className="text-xs text-secondary">
                        Commission 5%
                      </div>
                    </div>

                    <Badge 
                      className={`${statusColors[commission.status]?.bg} ${statusColors[commission.status]?.text} border-0`}
                    >
                      {React.createElement(statusColors[commission.status].icon, { className: "w-3 h-3 mr-1" })}
                      {commission.status === 'pending' && 'En attente'}
                      {commission.status === 'paid' && 'Payée'}
                      {commission.status === 'overdue' && 'En retard'}
                    </Badge>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};