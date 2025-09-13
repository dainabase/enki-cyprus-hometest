import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      <div className="p-6">
        <div className="text-center">Chargement du dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">Erreur lors du chargement des données</div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="p-6">
        <div className="text-center">Aucune donnée disponible</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header avec filtres */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Dashboard Analytics Cyprus</h1>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
            <SelectTrigger className="w-32">
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
            <SelectTrigger className="w-32">
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

      {/* KPIs Inventaire */}
      <div>
        <h2 className="text-xl font-semibold mb-4">📊 Inventaire & Portfolio</h2>
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

      {/* KPIs Financiers */}
      <div>
        <h2 className="text-xl font-semibold mb-4">💰 Métriques Financières</h2>
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

      {/* KPIs Cyprus Spécifiques */}
      <div>
        <h2 className="text-xl font-semibold mb-4">🇨🇾 Métriques Cyprus</h2>
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

      {/* Graphiques et Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

      {/* Performance Chart */}
      <PerformanceChart data={performanceData} />

      {/* Résumé Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Résumé Exécutif - Période: {period}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">🏆 Points Forts</h4>
              <ul className="space-y-2 text-sm">
                <li>• <strong>{formatNumber(metrics.goldenVisaProperties)}</strong> propriétés Golden Visa disponibles</li>
                <li>• Taux de conversion <strong>{formatPercentage(metrics.conversionRate)}</strong></li>
                <li>• Revenue moyen <strong>{formatCurrency(metrics.totalRevenue / Math.max(metrics.soldProperties, 1))}</strong> par vente</li>
                <li>• Commission moyenne <strong>{formatPercentage(metrics.averageCommissionRate)}</strong></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">📈 Objectifs</h4>
              <ul className="space-y-2 text-sm">
                <li>• Maintenir un stock de {Math.max(100 - metrics.availableProperties, 0)} propriétés supplémentaires</li>
                <li>• Cibler une conversion de <strong>15%</strong> minimum</li>
                <li>• Optimiser le délai de vente (actuellement {Math.round(metrics.averageDaysOnMarket)} jours)</li>
                <li>• Développer le portefeuille Golden Visa</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liens rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button variant="outline" className="w-full" asChild>
          <a href="/admin/projects">Gérer Propriétés</a>
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <a href="/admin/leads">Leads & Pipeline</a>
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <a href="/admin/commissions">Commissions</a>
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <a href="/admin/analytics">Analytics Avancés</a>
        </Button>
      </div>
    </div>
  );
};