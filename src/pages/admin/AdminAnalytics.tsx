import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MonthlyData {
  month: string;
  value: number;
}

interface LeadStatusData {
  name: string;
  value: number;
}

interface ZoneData {
  zone: string;
  count: number;
}

interface TrendData {
  value: number;
  trend: number;
}

interface TrendsState {
  sales: TrendData;
  leads: TrendData;
  commissions: TrendData;
  conversion: TrendData;
}

export const AdminAnalytics = () => {
  const { t } = useTranslation();
  const [period, setPeriod] = useState(6); // 3, 6, 12 mois
  const [salesData, setSalesData] = useState<MonthlyData[]>([]);
  const [leadsData, setLeadsData] = useState<LeadStatusData[]>([]);
  const [commissionsData, setCommissionsData] = useState<MonthlyData[]>([]);
  const [zonesData, setZonesData] = useState<ZoneData[]>([]);
  const [trends, setTrends] = useState<TrendsState>({
    sales: { value: 0, trend: 0 },
    leads: { value: 0, trend: 0 },
    commissions: { value: 0, trend: 0 },
    conversion: { value: 0, trend: 0 }
  });
  const [loading, setLoading] = useState(true);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - period);
    
    try {
      // Fetch sales by month
      const { data: projects } = await supabase
        .from('projects')
        .select('created_at, price, status')
        .gte('created_at', startDate.toISOString())
        .order('created_at');
      
      if (projects) {
        const monthlyData = groupByMonth(projects, 'price');
        setSalesData(monthlyData);
      }
      
      // Fetch leads by status
      const { data: leads } = await supabase
        .from('leads')
        .select('status, created_at')
        .gte('created_at', startDate.toISOString());
      
      if (leads) {
        const statusCounts: Record<string, number> = {};
        leads.forEach(lead => {
          if (lead.status) {
            statusCounts[lead.status] = (statusCounts[lead.status] || 0) + 1;
          }
        });
        
        const pieData = Object.entries(statusCounts).map(([name, value]) => ({
          name: t(`leads.status.${name}`) || name,
          value
        }));
        setLeadsData(pieData);
      }
      
      // Fetch commissions over time
      const { data: commissions } = await supabase
        .from('commissions')
        .select('date, amount')
        .gte('date', startDate.toISOString())
        .order('date');
      
      if (commissions) {
        const monthlyCommissions = groupByMonth(commissions, 'amount', 'date');
        setCommissionsData(monthlyCommissions);
      }
      
      // Fetch top zones
      const { data: projectsByZone } = await supabase
        .from('projects')
        .select('cyprus_zone')
        .gte('created_at', startDate.toISOString());
      
      if (projectsByZone) {
        const zoneCounts: Record<string, number> = {};
        projectsByZone.forEach(project => {
          if (project.cyprus_zone) {
            zoneCounts[project.cyprus_zone] = (zoneCounts[project.cyprus_zone] || 0) + 1;
          }
        });
        
        const topZones = Object.entries(zoneCounts)
          .sort(([,a], [,b]) => (b as number) - (a as number))
          .slice(0, 5)
          .map(([zone, count]) => ({ zone, count: count as number }));
        
        setZonesData(topZones);
      }
      
      // Calculate trends
      calculateTrends(projects || [], leads || [], commissions || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
    
    setLoading(false);
  };

  const groupByMonth = (data: any[], valueField: string, dateField = 'created_at'): MonthlyData[] => {
    const months: Record<string, { month: string; value: number }> = {};
    
    data.forEach(item => {
      const date = new Date(item[dateField]);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!months[monthKey]) {
        months[monthKey] = {
          month: getMonthName(date.getMonth()),
          value: 0
        };
      }
      
      months[monthKey].value += Number(item[valueField]) || 0;
    });
    
    return Object.values(months);
  };

  const getMonthName = (monthIndex: number): string => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthIndex];
  };

  const calculateTrends = (projects: any[], leads: any[], commissions: any[]) => {
    // Calculer les tendances (comparaison avec période précédente)
    const midPoint = new Date();
    midPoint.setMonth(midPoint.getMonth() - period / 2);
    
    const recentProjects = projects.filter(p => new Date(p.created_at) > midPoint);
    const oldProjects = projects.filter(p => new Date(p.created_at) <= midPoint);
    
    const recentLeads = leads.filter(l => new Date(l.created_at) > midPoint);
    const oldLeads = leads.filter(l => new Date(l.created_at) <= midPoint);
    
    const recentValue = recentProjects.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
    const oldValue = oldProjects.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
    
    const salesTrend = oldValue > 0 ? ((recentValue - oldValue) / oldValue * 100) : 0;
    const leadsTrend = oldLeads.length > 0 ? ((recentLeads.length - oldLeads.length) / oldLeads.length * 100) : 0;
    
    const recentConverted = recentLeads.filter(l => l.status === 'converted').length;
    const recentConversion = recentLeads.length > 0 ? (recentConverted / recentLeads.length * 100) : 0;
    const oldConverted = oldLeads.filter(l => l.status === 'converted').length;
    const oldConversion = oldLeads.length > 0 ? (oldConverted / oldLeads.length * 100) : 0;
    
    const recentCommissions = commissions.filter(c => new Date(c.date) > midPoint);
    const commissionsValue = recentCommissions.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
    
    setTrends({
      sales: { value: recentValue, trend: salesTrend },
      leads: { value: recentLeads.length, trend: leadsTrend },
      commissions: { value: commissionsValue, trend: 5.2 }, // Placeholder
      conversion: { value: recentConversion, trend: recentConversion - oldConversion }
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const TrendCard = ({ title, value, trend, format = 'number' }: {
    title: string;
    value: number;
    trend: number;
    format?: 'number' | 'currency' | 'percent';
  }) => {
    const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
    const trendColor = trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-muted-foreground';
    
    const formatValue = (): string => {
      if (format === 'currency') return formatCurrency(value);
      if (format === 'percent') return `${value.toFixed(1)}%`;
      return value.toString();
    };
    
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-2xl font-bold">{formatValue()}</p>
            <div className={`flex items-center ${trendColor}`}>
              <TrendIcon size={20} />
              <span className="ml-1 text-sm">{Math.abs(trend).toFixed(1)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('analytics.title')}</h1>
        <div className="flex gap-2">
          <Button 
            variant={period === 3 ? 'default' : 'outline'}
            onClick={() => setPeriod(3)}
            size="sm"
          >
            3 {t('analytics.months')}
          </Button>
          <Button 
            variant={period === 6 ? 'default' : 'outline'}
            onClick={() => setPeriod(6)}
            size="sm"
          >
            6 {t('analytics.months')}
          </Button>
          <Button 
            variant={period === 12 ? 'default' : 'outline'}
            onClick={() => setPeriod(12)}
            size="sm"
          >
            12 {t('analytics.months')}
          </Button>
        </div>
      </div>

      {/* Trend Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <TrendCard 
          title={t('analytics.salesValue')} 
          value={trends.sales.value} 
          trend={trends.sales.trend}
          format="currency"
        />
        <TrendCard 
          title={t('analytics.newLeads')} 
          value={trends.leads.value} 
          trend={trends.leads.trend}
        />
        <TrendCard 
          title={t('analytics.conversionRate')} 
          value={trends.conversion.value} 
          trend={trends.conversion.trend}
          format="percent"
        />
        <TrendCard 
          title={t('analytics.avgDealSize')} 
          value={trends.sales.value / (salesData.length || 1)} 
          trend={trends.commissions.trend}
          format="currency"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sales by Month */}
        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.salesByMonth')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Leads by Status */}
        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.leadsByStatus')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={leadsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {leadsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Commissions Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.commissionsOverTime')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={commissionsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Zones */}
        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.topZones')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={zonesData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis type="category" dataKey="zone" stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Bar dataKey="count" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};