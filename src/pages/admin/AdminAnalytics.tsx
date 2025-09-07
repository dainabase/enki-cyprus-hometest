import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  TrendingUp,
  Eye,
  Users,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  conversionRate: number;
  bounceRate: number;
  avgSessionDuration: number;
  topPages: Array<{
    page: string;
    views: number;
    percentage: number;
  }>;
  userEngagement: Array<{
    event: string;
    count: number;
  }>;
  timeSeriesData: Array<{
    date: string;
    views: number;
    users: number;
  }>;
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

export const AdminAnalytics = () => {
  const [dateRange, setDateRange] = useState('7days');

  // Fetch analytics data
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['admin-analytics', dateRange],
    queryFn: async (): Promise<AnalyticsData> => {
      // Get analytics events
      const { data: events, error } = await supabase
        .from('analytics_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000);

      if (error) throw error;

      // Process analytics data (mock calculations for now)
      const pageViews = events?.filter(e => e.event_name === 'page_view').length || 0;
      const uniqueUsers = new Set(events?.map(e => e.user_id).filter(Boolean)).size;
      
      return {
        pageViews,
        uniqueVisitors: uniqueUsers,
        conversionRate: 4.2,
        bounceRate: 28.5,
        avgSessionDuration: 185, // seconds
        topPages: [
          { page: '/projects', views: pageViews * 0.35, percentage: 35 },
          { page: '/project/:id', views: pageViews * 0.25, percentage: 25 },
          { page: '/', views: pageViews * 0.20, percentage: 20 },
          { page: '/search', views: pageViews * 0.15, percentage: 15 },
          { page: '/lexaia', views: pageViews * 0.05, percentage: 5 }
        ],
        userEngagement: [
          { event: 'project_viewed', count: events?.filter(e => e.event_name === 'project_viewed').length || 0 },
          { event: 'search_performed', count: events?.filter(e => e.event_name === 'search_performed').length || 0 },
          { event: 'pdf_downloaded', count: events?.filter(e => e.event_name === 'pdf_downloaded').length || 0 },
          { event: 'favorite_added', count: events?.filter(e => e.event_name === 'favorite_added').length || 0 }
        ],
        timeSeriesData: [] // Would be calculated based on date range
      };
    }
  });

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <LoadingSpinner size="lg" text="Chargement des analytics..." />
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
              Analytics & Insights
            </h1>
            <p className="text-lg text-secondary mt-2">
              Performances et comportement des utilisateurs
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">7 derniers jours</SelectItem>
                <SelectItem value="30days">30 derniers jours</SelectItem>
                <SelectItem value="90days">90 derniers jours</SelectItem>
                <SelectItem value="1year">Cette année</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exporter Rapport
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6"
      >
        {[
          {
            title: 'Pages Vues',
            value: analytics?.pageViews?.toLocaleString() || '0',
            icon: Eye,
            trend: '+15.2%',
            trendUp: true
          },
          {
            title: 'Visiteurs Uniques',
            value: analytics?.uniqueVisitors?.toLocaleString() || '0',
            icon: Users,
            trend: '+8.4%',
            trendUp: true
          },
          {
            title: 'Taux Conversion',
            value: `${analytics?.conversionRate || 0}%`,
            icon: Target,
            trend: '+0.8%',
            trendUp: true
          },
          {
            title: 'Taux Rebond',
            value: `${analytics?.bounceRate || 0}%`,
            icon: Activity,
            trend: '-2.1%',
            trendUp: true
          },
          {
            title: 'Durée Session',
            value: formatDuration(analytics?.avgSessionDuration || 0),
            icon: Calendar,
            trend: '+12s',
            trendUp: true
          }
        ].map((metric, index) => (
          <motion.div key={metric.title} variants={item}>
            <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-secondary">
                  {metric.title}
                </CardTitle>
                <div className="p-2 rounded-lg bg-primary/10">
                  <metric.icon className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-light tracking-tight text-primary mb-1">
                  {metric.value}
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${metric.trendUp ? 'text-success' : 'text-destructive'}`}
                >
                  {metric.trend}
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Top Pages */}
        <motion.div
          variants={item}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.4 }}
        >
          <Card className="h-full shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <BarChart3 className="w-5 h-5" />
                Pages Populaires
              </CardTitle>
              <CardDescription>
                Pages les plus visitées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.topPages.map((page, index) => (
                  <motion.div
                    key={page.page}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-primary">
                          {page.page}
                        </span>
                        <span className="text-sm text-secondary">
                          {page.views.toLocaleString()} vues
                        </span>
                      </div>
                      <div className="w-full bg-accent rounded-full h-2">
                        <motion.div
                          className="bg-primary h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${page.percentage}%` }}
                          transition={{ delay: 0.7 + index * 0.1, duration: 0.8 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* User Engagement */}
        <motion.div
          variants={item}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.6 }}
        >
          <Card className="h-full shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <PieChart className="w-5 h-5" />
                Engagement Utilisateurs
              </CardTitle>
              <CardDescription>
                Actions les plus fréquentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.userEngagement.map((event, index) => (
                  <motion.div
                    key={event.event}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-accent/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Activity className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-primary">
                          {event.event === 'project_viewed' && 'Projets vus'}
                          {event.event === 'search_performed' && 'Recherches'}
                          {event.event === 'pdf_downloaded' && 'PDF téléchargés'}
                          {event.event === 'favorite_added' && 'Favoris ajoutés'}
                        </p>
                        <p className="text-xs text-secondary">
                          Action utilisateur
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="font-semibold">
                      {event.count}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* AI Insights Card */}
      <motion.div
        variants={item}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.8 }}
      >
        <Card className="shadow-lg border-0 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <TrendingUp className="w-5 h-5" />
              Insights IA
            </CardTitle>
            <CardDescription>
              Recommandations basées sur les données
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-white/50 border border-primary/20">
                <h4 className="font-medium text-primary mb-2">Performance Excellente</h4>
                <p className="text-sm text-secondary">
                  Votre taux de conversion de 4.2% dépasse l'objectif de 5%. 
                  Continuez à optimiser l'expérience utilisateur.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-white/50 border border-orange-200">
                <h4 className="font-medium text-orange-800 mb-2">Optimisation Mobile</h4>
                <p className="text-sm text-orange-600">
                  65% du trafic provient du mobile. 
                  Considérez améliorer l'UX mobile pour augmenter les conversions.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-white/50 border border-success/20">
                <h4 className="font-medium text-success mb-2">Contenu Performant</h4>
                <p className="text-sm text-success/80">
                  Les pages projet génèrent 60% de l'engagement. 
                  Investissez dans plus de contenu visuel.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};