import { useState } from 'react';
import { Button, Card } from '@/components/dainabase-ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Building, 
  Euro, 
  TrendingUp, 
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Home,
  Target,
  Receipt,
  MapPin,
  Calendar,
  DollarSign,
  BarChart3,
  Filter
} from 'lucide-react';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { KPICard, KPIGrid } from '@/components/admin/dashboard/KPICards';
import { ModernBarChart, ModernZoneChart, ModernPerformanceChart } from '@/components/admin/dashboard/Charts';
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/dashboard/calculations';

export const AdminOverview = () => {
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [zone, setZone] = useState<'all' | 'limassol' | 'paphos' | 'larnaca' | 'nicosia'>('all');
  
  const { data: metrics, isLoading, error } = useDashboardMetrics({ period, zone });
  
  console.log('🎯 Dashboard State:', { metrics, isLoading, error, period, zone });

  // Sample performance data for charts
  const performanceData = [
    { month: 'Jan', sales: 12, revenue: 2400000, leads: 45 },
    { month: 'Fév', sales: 15, revenue: 3200000, leads: 52 },
    { month: 'Mar', sales: 18, revenue: 3800000, leads: 48 },
    { month: 'Avr', sales: 22, revenue: 4500000, leads: 61 },
    { month: 'Mai', sales: 19, revenue: 4100000, leads: 55 },
    { month: 'Juin', sales: 25, revenue: 5200000, leads: 68 }
  ];

  const commissionData = [
    { label: 'Limassol', value: metrics?.totalCommissions ? metrics.totalCommissions * 0.4 : 0 },
    { label: 'Paphos', value: metrics?.totalCommissions ? metrics.totalCommissions * 0.3 : 0 },
    { label: 'Larnaca', value: metrics?.totalCommissions ? metrics.totalCommissions * 0.2 : 0 },
    { label: 'Nicosia', value: metrics?.totalCommissions ? metrics.totalCommissions * 0.1 : 0 }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-600">Chargement du dashboard exécutif...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card variant="executive" padding="lg" className="mx-auto max-w-md">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <div className="text-red-600 font-semibold">Erreur lors du chargement des données</div>
        </div>
      </Card>
    );
  }

  if (!metrics) {
    return (
      <Card variant="executive" padding="lg" className="mx-auto max-w-md">
        <div className="text-center text-slate-600">Aucune donnée disponible</div>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Modern Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-8 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-light text-slate-900">Dashboard</h1>
              <p className="text-slate-600">Vue d'ensemble des performances Cyprus</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Filter className="w-4 h-4" />
                <span>Filtres</span>
              </div>
              <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
                <SelectTrigger className="w-32 h-10 bg-white border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Jour</SelectItem>
                  <SelectItem value="week">Semaine</SelectItem>
                  <SelectItem value="month">Mois</SelectItem>
                  <SelectItem value="year">Année</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={zone} onValueChange={(value: any) => setZone(value)}>
                <SelectTrigger className="w-40 h-10 bg-white border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes zones</SelectItem>
                  <SelectItem value="limassol">Limassol</SelectItem>
                  <SelectItem value="paphos">Paphos</SelectItem>
                  <SelectItem value="larnaca">Larnaca</SelectItem>
                  <SelectItem value="nicosia">Nicosia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-8 space-y-12">
        {/* KPIs Portfolio */}
        <div className="space-y-6">
          <h2 className="text-xl font-medium text-slate-900">Portfolio & Inventaire</h2>
          <KPIGrid columns={5}>
            <KPICard
              title="Total Propriétés"
              value={formatNumber(metrics.totalProperties)}
              subtitle="Dans le portfolio"
              icon={Building}
              variant="primary"
            />
            <KPICard
              title="Golden Visa"
              value={formatNumber(metrics.goldenVisaProperties)}
              subtitle={`${formatPercentage(metrics.goldenVisaPercentage)} du total`}
              icon={Award}
              variant="warning"
            />
            <KPICard
              title="Disponibles"
              value={formatNumber(metrics.availableProperties)}
              subtitle="Prêtes à vendre"
              icon={Home}
              variant="success"
            />
            <KPICard
              title="Vendues"
              value={formatNumber(metrics.soldProperties)}
              subtitle="Ce mois"
              icon={CheckCircle}
              variant="info"
            />
            <KPICard
              title="Conversion"
              value={formatPercentage(metrics.conversionRate)}
              subtitle="Lead vers client"
              icon={Target}
              variant="primary"
            />
          </KPIGrid>
        </div>

        {/* KPIs Financiers */}
        <div className="space-y-6">
          <h2 className="text-xl font-medium text-slate-900">Performance Financière</h2>
          <KPIGrid columns={4}>
            <KPICard
              title="Chiffre d'Affaires"
              value={formatCurrency(metrics.totalRevenue)}
              subtitle="Propriétés vendues"
              icon={Euro}
              variant="success"
              trend={12.5}
            />
            <KPICard
              title="Prix Moyen/m²"
              value={formatCurrency(metrics.averagePricePerSqm)}
              subtitle="Portfolio global"
              icon={BarChart3}
              variant="primary"
              trend={-2.3}
            />
            <KPICard
              title="Commissions"
              value={formatCurrency(metrics.totalCommissions)}
              subtitle={`Moyenne ${formatPercentage(metrics.averageCommissionRate)}`}
              icon={DollarSign}
              variant="info"
              trend={8.7}
            />
            <KPICard
              title="Temps de Vente"
              value={`${Math.round(metrics.averageDaysOnMarket)} jours`}
              subtitle="Délai moyen"
              icon={Clock}
              variant="warning"
              trend={-15.2}
            />
          </KPIGrid>
        </div>

        {/* Analytics et Graphiques */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <ModernZoneChart
            limassol={metrics.limassol}
            paphos={metrics.paphos}
            larnaca={metrics.larnaca}
            nicosia={metrics.nicosia}
          />
          
          <ModernBarChart
            title="Commissions par Zone"
            data={commissionData}
          />
        </div>

        {/* Performance Temporelle */}
        <ModernPerformanceChart data={performanceData} />

        {/* Actions Rapides */}
        <div className="bg-white rounded-xl border border-slate-200 p-8">
          <h3 className="text-xl font-medium text-slate-900 mb-6">Actions Rapides</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="clean" size="lg" className="h-20 flex-col gap-3" onClick={() => window.location.href = '/admin/projects'}>
              <Building className="w-6 h-6 text-slate-600" />
              <span className="text-sm font-medium">Gérer Propriétés</span>
            </Button>
            <Button variant="clean" size="lg" className="h-20 flex-col gap-3" onClick={() => window.location.href = '/admin/leads'}>
              <Users className="w-6 h-6 text-slate-600" />
              <span className="text-sm font-medium">Leads & Pipeline</span>
            </Button>
            <Button variant="clean" size="lg" className="h-20 flex-col gap-3" onClick={() => window.location.href = '/admin/commissions'}>
              <DollarSign className="w-6 h-6 text-slate-600" />
              <span className="text-sm font-medium">Commissions</span>
            </Button>
            <Button variant="clean" size="lg" className="h-20 flex-col gap-3" onClick={() => window.location.href = '/admin/analytics'}>
              <BarChart3 className="w-6 h-6 text-slate-600" />
              <span className="text-sm font-medium">Analytics</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};