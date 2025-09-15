import { useState } from 'react';
import { Button } from '@/components/dainabase-ui';
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
  DollarSign,
  BarChart3,
  Calendar,
  Filter
} from 'lucide-react';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { MetricCard, KPIGrid } from '@/components/admin/dashboard/KPICards';
import { ModernBarChart, ModernZoneChart, ModernPerformanceChart } from '@/components/admin/dashboard/Charts';
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/dashboard/calculations';

export const AdminOverview = () => {
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [zone, setZone] = useState<'all' | 'limassol' | 'paphos' | 'larnaca' | 'nicosia'>('all');
  
  const { data: metrics, isLoading, error } = useDashboardMetrics({ period, zone });

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <p className="text-red-600 font-medium">Erreur lors du chargement des données</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header à la Apple */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light text-slate-900">Dashboard</h1>
              <p className="text-slate-500 mt-1">Vue d'ensemble des performances</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Filter className="w-4 h-4" />
                <span>Filtres</span>
              </div>
              <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
                <SelectTrigger className="w-28 h-9 bg-white/60 border-slate-200 text-sm">
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
                <SelectTrigger className="w-36 h-9 bg-white/60 border-slate-200 text-sm">
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

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-12">
        {/* Hero Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Propriétés"
            value={formatNumber(metrics.totalProperties)}
            change={{ value: 12, period: "mois dernier" }}
            icon={Building}
          />
          <MetricCard
            title="Chiffre d'Affaires"
            value={formatCurrency(metrics.totalRevenue)}
            change={{ value: 23, period: "mois dernier" }}
            icon={Euro}
          />
          <MetricCard
            title="Commissions"
            value={formatCurrency(metrics.totalCommissions)}
            change={{ value: 8, period: "mois dernier" }}
            icon={DollarSign}
          />
          <MetricCard
            title="Conversion"
            value={formatPercentage(metrics.conversionRate)}
            change={{ value: -2, period: "mois dernier" }}
            icon={Target}
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-slate-50 rounded-lg">
                <Award className="w-4 h-4 text-slate-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{formatNumber(metrics.goldenVisaProperties)}</p>
            <p className="text-xs text-slate-500">Golden Visa</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-slate-50 rounded-lg">
                <Home className="w-4 h-4 text-slate-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{formatNumber(metrics.availableProperties)}</p>
            <p className="text-xs text-slate-500">Disponibles</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-slate-50 rounded-lg">
                <CheckCircle className="w-4 h-4 text-slate-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{formatNumber(metrics.soldProperties)}</p>
            <p className="text-xs text-slate-500">Vendues</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-slate-50 rounded-lg">
                <BarChart3 className="w-4 h-4 text-slate-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(metrics.averagePricePerSqm)}</p>
            <p className="text-xs text-slate-500">Prix/m²</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-slate-50 rounded-lg">
                <Clock className="w-4 h-4 text-slate-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{Math.round(metrics.averageDaysOnMarket)}</p>
            <p className="text-xs text-slate-500">Jours/vente</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-slate-50 rounded-lg">
                <Calendar className="w-4 h-4 text-slate-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{formatNumber(metrics.propertiesSoldThisMonth)}</p>
            <p className="text-xs text-slate-500">Ce mois</p>
          </div>
        </div>

        {/* Analytics Section */}
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

        {/* Performance Chart */}
        <ModernPerformanceChart data={performanceData} />

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-8 border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Actions Rapides</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              variant="clean" 
              className="h-16 flex-col gap-2 text-sm font-medium hover:bg-slate-50"
              onClick={() => window.location.href = '/admin/projects'}
            >
              <Building className="w-5 h-5 text-slate-600" />
              Propriétés
            </Button>
            <Button 
              variant="clean" 
              className="h-16 flex-col gap-2 text-sm font-medium hover:bg-slate-50"
              onClick={() => window.location.href = '/admin/leads'}
            >
              <Users className="w-5 h-5 text-slate-600" />
              Prospects
            </Button>
            <Button 
              variant="clean" 
              className="h-16 flex-col gap-2 text-sm font-medium hover:bg-slate-50"
              onClick={() => window.location.href = '/admin/commissions'}
            >
              <DollarSign className="w-5 h-5 text-slate-600" />
              Commissions
            </Button>
            <Button 
              variant="clean" 
              className="h-16 flex-col gap-2 text-sm font-medium hover:bg-slate-50"
              onClick={() => window.location.href = '/admin/analytics'}
            >
              <BarChart3 className="w-5 h-5 text-slate-600" />
              Analytics
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};