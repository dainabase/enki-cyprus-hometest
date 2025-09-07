import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface DeveloperMetrics {
  developerId: string;
  developerName: string;
  totalProjects: number;
  totalProperties: number;
  propertiesSold: number;
  conversionRate: number;
  totalRevenue: number;
  totalCommissions: number;
  averageSalePrice: number;
  averageDaysToSell: number;
  goldenVisaSales: number;
  lastSaleDate: string | null;
}

interface Project {
  id: string;
  title: string;
  status: string;
  price: number;
  created_at: string;
}

interface Commission {
  id: string;
  amount: number;
  date: string;
  project_id: string;
}

export default function AdminPerformance() {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState<DeveloperMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('all');
  const [selectedDeveloper, setSelectedDeveloper] = useState<DeveloperMetrics | null>(null);
  const [developerProjects, setDeveloperProjects] = useState<Project[]>([]);
  const [developerCommissions, setDeveloperCommissions] = useState<Commission[]>([]);

  const periods = [
    { value: '7', label: t('performance.period.7days') },
    { value: '30', label: t('performance.period.30days') },
    { value: '90', label: t('performance.period.90days') },
    { value: 'all', label: t('performance.period.all') }
  ];

  useEffect(() => {
    loadPerformanceData();
  }, [period]);

  const loadPerformanceData = async () => {
    setLoading(true);
    
    try {
      // Calculate date filter
      let dateFilter = null;
      if (period !== 'all') {
        const days = parseInt(period);
        dateFilter = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
      }

      // Get all developers
      const { data: developers } = await supabase
        .from('developers')
        .select('*')
        .eq('status', 'active');

      if (!developers) {
        setMetrics([]);
        setLoading(false);
        return;
      }

      // Calculate metrics for each developer
      const metricsPromises = developers.map(async (developer) => {
        return await calculateDeveloperMetrics(developer, dateFilter);
      });

      const calculatedMetrics = await Promise.all(metricsPromises);
      
      // Sort by total revenue descending
      const sortedMetrics = calculatedMetrics.sort((a, b) => b.totalRevenue - a.totalRevenue);
      
      setMetrics(sortedMetrics);
    } catch (error) {
      console.error('Error loading performance data:', error);
      setMetrics([]);
    }
    
    setLoading(false);
  };

  const calculateDeveloperMetrics = async (developer: any, dateFilter: string | null): Promise<DeveloperMetrics> => {
    try {
      // Get projects for this developer
      let projectsQuery = supabase
        .from('projects')
        .select('*')
        .eq('developer_id', developer.id);

      if (dateFilter) {
        projectsQuery = projectsQuery.gte('created_at', dateFilter);
      }

      const { data: projects } = await projectsQuery;
      
      // Get commissions for this developer
      let commissionsQuery = supabase
        .from('commissions')
        .select('*')
        .eq('promoter_id', developer.id); // Assuming promoter_id links to developer

      if (dateFilter) {
        commissionsQuery = commissionsQuery.gte('date', dateFilter);
      }

      const { data: commissions } = await commissionsQuery;

      // Calculate metrics
      const totalProjects = projects?.length || 0;
      const totalCommissions = commissions?.reduce((sum, c) => sum + (c.amount || 0), 0) || 0;
      const commissionsCount = commissions?.length || 0;
      
      // For properties, we'll use projects as a proxy since we don't have direct property sales data
      const propertiesSold = commissionsCount; // Each commission represents a sale
      const totalProperties = totalProjects * 10; // Estimate 10 properties per project
      const conversionRate = totalProperties > 0 ? (propertiesSold / totalProperties) * 100 : 0;
      
      // Calculate revenue (assuming each commission corresponds to a sale)
      const totalRevenue = commissions?.reduce((sum, c) => {
        // Estimate sale price from commission (assuming 3% commission rate)
        const estimatedSalePrice = (c.amount || 0) / 0.03;
        return sum + estimatedSalePrice;
      }, 0) || 0;

      const averageSalePrice = propertiesSold > 0 ? totalRevenue / propertiesSold : 0;
      
      // Golden Visa sales (properties >= 300k€)
      const goldenVisaSales = commissions?.filter(c => {
        const estimatedSalePrice = (c.amount || 0) / 0.03;
        return estimatedSalePrice >= 300000;
      }).length || 0;

      // Average days to sell (simplified calculation)
      const averageDaysToSell = 45; // Default estimate

      // Last sale date
      const lastSaleDate = commissions && commissions.length > 0 
        ? commissions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date
        : null;

      return {
        developerId: developer.id,
        developerName: developer.name,
        totalProjects,
        totalProperties,
        propertiesSold,
        conversionRate,
        totalRevenue,
        totalCommissions,
        averageSalePrice,
        averageDaysToSell,
        goldenVisaSales,
        lastSaleDate
      };
    } catch (error) {
      console.error('Error calculating metrics for developer:', developer.id, error);
      return {
        developerId: developer.id,
        developerName: developer.name,
        totalProjects: 0,
        totalProperties: 0,
        propertiesSold: 0,
        conversionRate: 0,
        totalRevenue: 0,
        totalCommissions: 0,
        averageSalePrice: 0,
        averageDaysToSell: 0,
        goldenVisaSales: 0,
        lastSaleDate: null
      };
    }
  };

  const handleDeveloperClick = async (developer: DeveloperMetrics) => {
    setSelectedDeveloper(developer);
    
    // Load developer details
    const { data: projects } = await supabase
      .from('projects')
      .select('id, title, status, price, created_at')
      .eq('developer_id', developer.developerId)
      .order('created_at', { ascending: false })
      .limit(10);

    const { data: commissions } = await supabase
      .from('commissions')
      .select('id, amount, date, project_id')
      .eq('promoter_id', developer.developerId)
      .order('date', { ascending: false })
      .limit(10);

    setDeveloperProjects(projects || []);
    setDeveloperCommissions(commissions || []);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return '';
    }
  };

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 0: return 'bg-yellow-500 border-yellow-600';
      case 1: return 'bg-gray-400 border-gray-500';
      case 2: return 'bg-amber-600 border-amber-700';
      default: return 'bg-white border-gray-200';
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  const top3 = metrics.slice(0, 3);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t('performance.title')}</h1>
          <p className="text-gray-400 mt-1">{t('performance.subtitle')}</p>
        </div>
        
        {/* Period Filter */}
        <div className="flex gap-2">
          {periods.map((p) => (
            <Button
              key={p.value}
              variant={period === p.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod(p.value)}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Top 3 Performers */}
      {top3.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">{t('performance.topPerformers')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {top3.map((developer, index) => (
              <Card
                key={developer.developerId}
                className={`cursor-pointer hover:shadow-lg transition-shadow ${getMedalColor(index)}`}
                onClick={() => handleDeveloperClick(developer)}
              >
                <CardHeader className="text-center pb-2">
                  <div className="text-4xl mb-2">{getMedalIcon(index)}</div>
                  <CardTitle className="text-lg">{developer.developerName}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-2">
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(developer.totalRevenue)}
                      </p>
                      <p className="text-sm text-gray-500">{t('performance.totalRevenue')}</p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{t('performance.sales')}: {developer.propertiesSold}</span>
                      <span>{developer.conversionRate.toFixed(1)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('performance.allDevelopers')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('performance.table.rank')}</TableHead>
                <TableHead>{t('performance.table.developer')}</TableHead>
                <TableHead>{t('performance.table.projects')}</TableHead>
                <TableHead>{t('performance.table.properties')}</TableHead>
                <TableHead>{t('performance.table.sold')}</TableHead>
                <TableHead>{t('performance.table.conversion')}</TableHead>
                <TableHead>{t('performance.table.revenue')}</TableHead>
                <TableHead>{t('performance.table.commissions')}</TableHead>
                <TableHead>{t('performance.table.avgPrice')}</TableHead>
                <TableHead>{t('performance.table.goldenVisa')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.map((developer, index) => (
                <Dialog key={developer.developerId}>
                  <DialogTrigger asChild>
                    <TableRow 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleDeveloperClick(developer)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">#{index + 1}</span>
                          {index < 3 && <span className="text-xl">{getMedalIcon(index)}</span>}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{developer.developerName}</TableCell>
                      <TableCell>{developer.totalProjects}</TableCell>
                      <TableCell>{developer.totalProperties}</TableCell>
                      <TableCell>{developer.propertiesSold}</TableCell>
                      <TableCell>
                        <Badge variant={developer.conversionRate >= 10 ? "default" : "secondary"}>
                          {developer.conversionRate.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-green-600">
                        {formatCurrency(developer.totalRevenue)}
                      </TableCell>
                      <TableCell>{formatCurrency(developer.totalCommissions)}</TableCell>
                      <TableCell>{formatCurrency(developer.averageSalePrice)}</TableCell>
                      <TableCell>
                        <Badge variant={developer.goldenVisaSales > 0 ? "default" : "outline"}>
                          {developer.goldenVisaSales}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {t('performance.developerDetails', { name: developer.developerName })}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {/* Metrics Summary */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold">{developer.totalProjects}</p>
                          <p className="text-sm text-gray-500">{t('performance.projects')}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">{developer.propertiesSold}</p>
                          <p className="text-sm text-gray-500">{t('performance.propertiesSold')}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">{developer.conversionRate.toFixed(1)}%</p>
                          <p className="text-sm text-gray-500">{t('performance.conversionRate')}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">
                            {formatCurrency(developer.totalRevenue)}
                          </p>
                          <p className="text-sm text-gray-500">{t('performance.totalRevenue')}</p>
                        </div>
                      </div>

                      {/* Recent Projects */}
                      <div>
                        <h3 className="font-semibold mb-2">{t('performance.recentProjects')}</h3>
                        {developerProjects.length > 0 ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>{t('performance.projectName')}</TableHead>
                                <TableHead>{t('performance.status')}</TableHead>
                                <TableHead>{t('performance.price')}</TableHead>
                                <TableHead>{t('performance.created')}</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {developerProjects.map((project) => (
                                <TableRow key={project.id}>
                                  <TableCell>{project.title}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline">{project.status}</Badge>
                                  </TableCell>
                                  <TableCell>{formatCurrency(project.price || 0)}</TableCell>
                                  <TableCell>{formatDate(project.created_at)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <p className="text-gray-500">{t('performance.noProjects')}</p>
                        )}
                      </div>

                      {/* Recent Commissions */}
                      <div>
                        <h3 className="font-semibold mb-2">{t('performance.recentCommissions')}</h3>
                        {developerCommissions.length > 0 ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>{t('performance.amount')}</TableHead>
                                <TableHead>{t('performance.date')}</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {developerCommissions.map((commission) => (
                                <TableRow key={commission.id}>
                                  <TableCell className="font-semibold text-green-600">
                                    {formatCurrency(commission.amount)}
                                  </TableCell>
                                  <TableCell>{formatDate(commission.date)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <p className="text-gray-500">{t('performance.noCommissions')}</p>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}