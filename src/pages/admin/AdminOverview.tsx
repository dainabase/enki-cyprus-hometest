import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Building, 
  Euro, 
  TrendingUp, 
  Award,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const AdminOverview = () => {
  const { t } = useTranslation();
  const [period, setPeriod] = useState(30); // 7, 30, 90 jours
  const [kpis, setKpis] = useState({
    totalLeads: 0,
    convertedLeads: 0,
    conversionRate: 0,
    totalProperties: 0,
    availableProperties: 0,
    totalPropertyValue: 0,
    totalCommissions: 0,
    pendingCommissions: 0,
    paidCommissions: 0,
    goldenVisaProperties: 0,
    goldenVisaLeads: 0,
    averageDaysToConvert: 0
  });
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKPIs();
    fetchRecentLeads();
  }, [period]);

  const fetchKPIs = async () => {
    setLoading(true);
    
    // Calculer la date de début selon la période
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);
    
    try {
      // Fetch leads stats
      const { data: leads } = await supabase
        .from('leads')
        .select('status, golden_visa_interest, created_at');
      
      // Fetch properties stats (using projects table)
      const { data: properties } = await supabase
        .from('projects')
        .select('price, reservation_status, golden_visa_eligible');
      
      // Fetch commissions stats
      const { data: commissions } = await supabase
        .from('commissions')
        .select('amount, status, created_at')
        .gte('created_at', startDate.toISOString());
      
      // Calculate KPIs
      if (leads && properties && commissions) {
        const recentLeads = leads.filter(l => new Date(l.created_at) >= startDate);
        const totalLeads = recentLeads.length;
        const convertedLeads = recentLeads.filter(l => l.status === 'converted').length;
        const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads * 100) : 0;
        
        const totalProperties = properties.length;
        const availableProperties = properties.filter(p => p.reservation_status === 'available').length;
        const totalPropertyValue = properties.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
        
        const goldenVisaProperties = properties.filter(p => p.golden_visa_eligible).length;
        const goldenVisaLeads = recentLeads.filter(l => l.golden_visa_interest).length;
        
        const totalCommissions = commissions.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
        const pendingCommissions = commissions
          .filter(c => c.status === 'pending')
          .reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
        const paidCommissions = commissions
          .filter(c => c.status === 'paid')
          .reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
        
        setKpis({
          totalLeads,
          convertedLeads,
          conversionRate,
          totalProperties,
          availableProperties,
          totalPropertyValue,
          totalCommissions,
          pendingCommissions,
          paidCommissions,
          goldenVisaProperties,
          goldenVisaLeads,
          averageDaysToConvert: 15 // Placeholder - calcul complexe
        });
      }
    } catch (error) {
      console.error('Error fetching KPIs:', error);
    }
    
    setLoading(false);
  };

  const fetchRecentLeads = async () => {
    try {
      const { data } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (data) setRecentLeads(data);
    } catch (error) {
      console.error('Error fetching recent leads:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const MetricCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => {
    const colorClasses = {
      blue: 'text-blue-500',
      green: 'text-green-500',
      yellow: 'text-yellow-500',
      purple: 'text-purple-500',
      red: 'text-red-500'
    };

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold mt-1">{value}</p>
              {subtitle && (
                <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <Icon className={`w-6 h-6 ${colorClasses[color]}`} />
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
      {/* Header avec filtres */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('dashboard.title')}</h1>
        <div className="flex gap-2">
          <Button 
            variant={period === 7 ? 'default' : 'outline'}
            onClick={() => setPeriod(7)}
            size="sm"
          >
            7 {t('dashboard.days')}
          </Button>
          <Button 
            variant={period === 30 ? 'default' : 'outline'}
            onClick={() => setPeriod(30)}
            size="sm"
          >
            30 {t('dashboard.days')}
          </Button>
          <Button 
            variant={period === 90 ? 'default' : 'outline'}
            onClick={() => setPeriod(90)}
            size="sm"
          >
            90 {t('dashboard.days')}
          </Button>
        </div>
      </div>

      {/* KPIs Leads */}
      <div>
        <h2 className="text-lg font-semibold mb-4">{t('dashboard.leads')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            icon={Users}
            title={t('dashboard.totalLeads')}
            value={kpis.totalLeads}
            subtitle={`${kpis.convertedLeads} ${t('dashboard.converted')}`}
            color="blue"
          />
          <MetricCard
            icon={TrendingUp}
            title={t('dashboard.conversionRate')}
            value={`${kpis.conversionRate.toFixed(1)}%`}
            subtitle={t('dashboard.leadToClient')}
            color="green"
          />
          <MetricCard
            icon={Award}
            title={t('dashboard.goldenVisaLeads')}
            value={kpis.goldenVisaLeads}
            subtitle={t('dashboard.interested')}
            color="yellow"
          />
          <MetricCard
            icon={Clock}
            title={t('dashboard.avgConversion')}
            value={`${kpis.averageDaysToConvert} ${t('dashboard.days')}`}
            subtitle={t('dashboard.toConvert')}
            color="purple"
          />
        </div>
      </div>

      {/* KPIs Propriétés */}
      <div>
        <h2 className="text-lg font-semibold mb-4">{t('dashboard.properties')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            icon={Building}
            title={t('dashboard.totalProperties')}
            value={kpis.totalProperties}
            subtitle={`${kpis.availableProperties} ${t('dashboard.available')}`}
            color="blue"
          />
          <MetricCard
            icon={Euro}
            title={t('dashboard.totalValue')}
            value={formatCurrency(kpis.totalPropertyValue)}
            subtitle={t('dashboard.portfolioValue')}
            color="green"
          />
          <MetricCard
            icon={Award}
            title={t('dashboard.goldenVisaEligible')}
            value={kpis.goldenVisaProperties}
            subtitle={t('dashboard.properties')}
            color="yellow"
          />
        </div>
      </div>

      {/* KPIs Commissions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">{t('dashboard.commissions')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            icon={Euro}
            title={t('dashboard.totalCommissions')}
            value={formatCurrency(kpis.totalCommissions)}
            subtitle={t('dashboard.period', { days: period })}
            color="green"
          />
          <MetricCard
            icon={AlertCircle}
            title={t('dashboard.pending')}
            value={formatCurrency(kpis.pendingCommissions)}
            subtitle={t('dashboard.toPay')}
            color="yellow"
          />
          <MetricCard
            icon={CheckCircle}
            title={t('dashboard.paid')}
            value={formatCurrency(kpis.paidCommissions)}
            subtitle={t('dashboard.completed')}
            color="blue"
          />
        </div>
      </div>

      {/* Activité récente */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentLeads.length > 0 ? (
              recentLeads.map(lead => (
                <div key={lead.id} className="flex items-center justify-between p-3 bg-muted rounded">
                  <div>
                    <p className="font-medium">
                      {lead.first_name} {lead.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {lead.email} • {t(`leads.status.${lead.status}`)}
                    </p>
                  </div>
                  <div className="text-right">
                    {lead.budget_max && (
                      <p className="font-medium">{formatCurrency(Number(lead.budget_max))}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                {t('dashboard.noRecentActivity')}
              </p>
            )}
          </div>
          <Link to="/admin/leads" className="block mt-4">
            <Button variant="outline" className="w-full">
              {t('dashboard.viewAllLeads')}
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Liens rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/admin/projects">
          <Button variant="outline" className="w-full">{t('nav.projects')}</Button>
        </Link>
        <Link to="/admin/leads">
          <Button variant="outline" className="w-full">{t('nav.leads')}</Button>
        </Link>
        <Link to="/admin/pipeline">
          <Button variant="outline" className="w-full">{t('nav.pipeline')}</Button>
        </Link>
        <Link to="/admin/commissions">
          <Button variant="outline" className="w-full">{t('nav.commissions')}</Button>
        </Link>
      </div>
    </div>
  );
};