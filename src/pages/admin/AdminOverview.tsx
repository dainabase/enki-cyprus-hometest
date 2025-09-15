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
  BarChart3
} from 'lucide-react';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { KPICard, KPIGrid } from '@/components/admin/dashboard/KPICards';
import { SimpleBarChart, ZoneDistributionChart, PerformanceChart } from '@/components/admin/dashboard/Charts';
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
    <div className="space-y-8">
      {/* Executive Header avec filtres */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Executive Dashboard</h1>
          <p className="text-slate-600 text-lg">Cyprus Real Estate Analytics</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
            <SelectTrigger className="w-40 h-12 bg-white border-slate-300">
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
            <SelectTrigger className="w-40 h-12 bg-white border-slate-300">
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

      {/* KPIs Inventaire Executive */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <Building className="w-7 h-7 text-blue-600" />
          Portfolio & Inventaire
        </h2>
        <KPIGrid columns={5}>
          <KPICard
            title="Total Propriétés"
            value={formatNumber(metrics.totalProperties)}
            subtitle="Dans le portfolio"
            icon={Building}
            color="blue"
          />
          <KPICard
            title="Golden Visa Eligible"
            value={formatNumber(metrics.goldenVisaProperties)}
            subtitle={`${formatPercentage(metrics.goldenVisaPercentage)} du total`}
            icon={Award}
            color="yellow"
          />
          <KPICard
            title="Disponibles"
            value={formatNumber(metrics.availableProperties)}
            subtitle="Prêtes à vendre"
            icon={Home}
            color="green"
          />
          <KPICard
            title="Vendues"
            value={formatNumber(metrics.soldProperties)}
            subtitle="Ce mois"
            icon={CheckCircle}
            color="purple"
          />
          <KPICard
            title="Taux de Conversion"
            value={formatPercentage(metrics.conversionRate)}
            subtitle="Lead vers client"
            icon={Target}
            color="blue"
          />
        </KPIGrid>
      </div>

      {/* KPIs Financiers Executive */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <Euro className="w-7 h-7 text-green-600" />
          Performance Financière
        </h2>
        <KPIGrid columns={5}>
          <KPICard
            title="Chiffre d'Affaires"
            value={formatCurrency(metrics.totalRevenue)}
            subtitle="Propriétés vendues"
            icon={Euro}
            color="green"
          />
          <KPICard
            title="Prix Moyen/m²"
            value={formatCurrency(metrics.averagePricePerSqm)}
            subtitle="Portfolio global"
            icon={BarChart3}
            color="blue"
          />
          <KPICard
            title="Commissions Totales"
            value={formatCurrency(metrics.totalCommissions)}
            subtitle={`Moyenne ${formatPercentage(metrics.averageCommissionRate)}`}
            icon={DollarSign}
            color="purple"
          />
          <KPICard
            title="Jours sur Marché"
            value={Math.round(metrics.averageDaysOnMarket)}
            subtitle="Temps moyen de vente"
            icon={Clock}
            color="yellow"
          />
          <KPICard
            title="Vendues ce Mois"
            value={formatNumber(metrics.propertiesSoldThisMonth)}
            subtitle="Performance mensuelle"
            icon={Calendar}
            color="green"
          />
        </KPIGrid>
      </div>

      {/* KPIs Cyprus Spécifiques Executive */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <MapPin className="w-7 h-7 text-red-600" />
          Réglementation Cyprus
        </h2>
        <KPIGrid columns={3}>
          <KPICard
            title="TVA Collectée 5%"
            value={formatCurrency(metrics.vatCollected5Percent)}
            subtitle="Résidentiel ≤200m²"
            icon={Receipt}
            color="green"
          />
          <KPICard
            title="TVA Collectée 19%"
            value={formatCurrency(metrics.vatCollected19Percent)}
            subtitle="Commercial & >200m²"
            icon={Receipt}
            color="red"
          />
          <KPICard
            title="Frais de Transfert"
            value={formatCurrency(metrics.transferFeesTotal)}
            subtitle="3-8% du prix de vente"
            icon={TrendingUp}
            color="blue"
          />
        </KPIGrid>
      </div>

      {/* Executive Analytics Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <ZoneDistributionChart
          limassol={metrics.limassol}
          paphos={metrics.paphos}
          larnaca={metrics.larnaca}
          nicosia={metrics.nicosia}
        />
        
        <SimpleBarChart
          title="Commissions par Zone"
          data={commissionData}
        />
      </div>

      {/* Performance Chart Executive */}
      <PerformanceChart data={performanceData} />

      {/* Executive Summary */}
      <Card variant="executive" padding="lg">
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Résumé Exécutif - Période: {period}
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                🏆 Points Forts
              </h4>
              <div className="space-y-3 text-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span><strong>{formatNumber(metrics.goldenVisaProperties)}</strong> propriétés Golden Visa disponibles</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span>Taux de conversion <strong>{formatPercentage(metrics.conversionRate)}</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span>Revenue moyen <strong>{formatCurrency(metrics.totalRevenue / Math.max(metrics.soldProperties, 1))}</strong> par vente</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span>Commission moyenne <strong>{formatPercentage(metrics.averageCommissionRate)}</strong></span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                📈 Objectifs Stratégiques
              </h4>
              <div className="space-y-3 text-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span>Maintenir un stock de {Math.max(100 - metrics.availableProperties, 0)} propriétés supplémentaires</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span>Cibler une conversion de <strong>15%</strong> minimum</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  <span>Optimiser le délai de vente (actuellement {Math.round(metrics.averageDaysOnMarket)} jours)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                  <span>Développer le portefeuille Golden Visa</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Executive Action Center */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Button variant="executive" size="lg" className="h-16" onClick={() => window.location.href = '/admin/projects'}>
          <div className="flex flex-col items-center gap-2">
            <Building className="w-6 h-6" />
            <span>Gérer Propriétés</span>
          </div>
        </Button>
        <Button variant="executive" size="lg" className="h-16" onClick={() => window.location.href = '/admin/leads'}>
          <div className="flex flex-col items-center gap-2">
            <Users className="w-6 h-6" />
            <span>Leads & Pipeline</span>
          </div>
        </Button>
        <Button variant="executive" size="lg" className="h-16" onClick={() => window.location.href = '/admin/commissions'}>
          <div className="flex flex-col items-center gap-2">
            <DollarSign className="w-6 h-6" />
            <span>Commissions</span>
          </div>
        </Button>
        <Button variant="executive" size="lg" className="h-16" onClick={() => window.location.href = '/admin/analytics'}>
          <div className="flex flex-col items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            <span>Analytics Avancés</span>
          </div>
        </Button>
      </div>
    </div>
  );
};