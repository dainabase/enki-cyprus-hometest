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
    <div className="h-screen flex flex-col">
      {/* Header Section - STICKY */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
              <p className="text-slate-600 mt-2">Vue d'ensemble des performances de votre portfolio</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Filter className="w-4 h-4" />
                <span>Filtres</span>
              </div>
              <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
                <SelectTrigger className="w-28 h-9 bg-white border-slate-200 text-sm">
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
                <SelectTrigger className="w-36 h-9 bg-white border-slate-200 text-sm">
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

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto bg-slate-50 px-8 py-6 space-y-6">
        {/* Stats Cards - Following AdminProjects structure */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Propriétés</CardTitle>
              <Building className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{formatNumber(metrics.totalProperties)}</div>
              <p className="text-xs text-slate-500 mt-1">+12% ce mois</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Chiffre d'Affaires</CardTitle>
              <Euro className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{formatCurrency(metrics.totalRevenue)}</div>
              <p className="text-xs text-slate-500 mt-1">+23% ce mois</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Commissions</CardTitle>
              <DollarSign className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{formatCurrency(metrics.totalCommissions)}</div>
              <p className="text-xs text-slate-500 mt-1">+8% ce mois</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Conversion</CardTitle>
              <Target className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{formatPercentage(metrics.conversionRate)}</div>
              <p className="text-xs text-slate-500 mt-1">-2% ce mois</p>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="group hover:shadow-xl transition-all duration-300 border-2 border-slate-200 bg-white hover:border-slate-300 hover:-translate-y-1 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg border border-white shadow-sm">
                <Award className="w-4 h-4 text-slate-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{formatNumber(metrics.goldenVisaProperties)}</p>
            <p className="text-xs text-slate-500 font-medium">Golden Visa</p>
          </div>

          <div className="group hover:shadow-xl transition-all duration-300 border-2 border-slate-200 bg-white hover:border-slate-300 hover:-translate-y-1 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg border border-white shadow-sm">
                <Home className="w-4 h-4 text-slate-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{formatNumber(metrics.availableProperties)}</p>
            <p className="text-xs text-slate-500 font-medium">Disponibles</p>
          </div>

          <div className="group hover:shadow-xl transition-all duration-300 border-2 border-slate-200 bg-white hover:border-slate-300 hover:-translate-y-1 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg border border-white shadow-sm">
                <CheckCircle className="w-4 h-4 text-slate-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{formatNumber(metrics.soldProperties)}</p>
            <p className="text-xs text-slate-500 font-medium">Vendues</p>
          </div>

          <div className="group hover:shadow-xl transition-all duration-300 border-2 border-slate-200 bg-white hover:border-slate-300 hover:-translate-y-1 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg border border-white shadow-sm">
                <BarChart3 className="w-4 h-4 text-slate-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(metrics.averagePricePerSqm)}</p>
            <p className="text-xs text-slate-500 font-medium">Prix/m²</p>
          </div>

          <div className="group hover:shadow-xl transition-all duration-300 border-2 border-slate-200 bg-white hover:border-slate-300 hover:-translate-y-1 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg border border-white shadow-sm">
                <Clock className="w-4 h-4 text-slate-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{Math.round(metrics.averageDaysOnMarket)}</p>
            <p className="text-xs text-slate-500 font-medium">Jours/vente</p>
          </div>

          <div className="group hover:shadow-xl transition-all duration-300 border-2 border-slate-200 bg-white hover:border-slate-300 hover:-translate-y-1 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg border border-white shadow-sm">
                <Calendar className="w-4 h-4 text-slate-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{formatNumber(metrics.propertiesSoldThisMonth)}</p>
            <p className="text-xs text-slate-500 font-medium">Ce mois</p>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle className="text-primary font-bold">Répartition par Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <ModernZoneChart
                limassol={metrics.limassol}
                paphos={metrics.paphos}
                larnaca={metrics.larnaca}
                nicosia={metrics.nicosia}
              />
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle className="text-primary font-bold">Commissions par Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <ModernBarChart
                title=""
                data={commissionData}
              />
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart */}
        <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-primary font-bold">Performance Mensuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <ModernPerformanceChart data={performanceData} />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-primary font-bold">Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                variant="ghost" 
                className="h-16 flex-col gap-2 text-sm font-medium hover:bg-slate-50 border border-slate-200"
                onClick={() => window.location.href = '/admin/projects'}
              >
                <Building className="w-5 h-5 text-slate-600" />
                Propriétés
              </Button>
              <Button 
                variant="ghost" 
                className="h-16 flex-col gap-2 text-sm font-medium hover:bg-slate-50 border border-slate-200"
                onClick={() => window.location.href = '/admin/leads'}
              >
                <Users className="w-5 h-5 text-slate-600" />
                Prospects
              </Button>
              <Button 
                variant="ghost" 
                className="h-16 flex-col gap-2 text-sm font-medium hover:bg-slate-50 border border-slate-200"
                onClick={() => window.location.href = '/admin/commissions'}
              >
                <DollarSign className="w-5 h-5 text-slate-600" />
                Commissions
              </Button>
              <Button 
                variant="ghost" 
                className="h-16 flex-col gap-2 text-sm font-medium hover:bg-slate-50 border border-slate-200"
                onClick={() => window.location.href = '/admin/analytics'}
              >
                <BarChart3 className="w-5 h-5 text-slate-600" />
                Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};