import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  Building,
  Users,
  TrendingUp,
  DollarSign,
  Eye,
  Heart,
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  totalProjects: number;
  totalUsers: number;
  publishedProjects: number;
  draftProjects: number;
  totalViews: number;
  totalFavorites: number;
  totalDownloads: number;
  conversionRate: number;
  recentActivity: Array<{
    id: string;
    type: 'project_created' | 'user_registered' | 'favorite_added';
    title: string;
    timestamp: string;
  }>;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const AdminOverview = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      const [
        projectsResult,
        usersResult,
        analyticsResult
      ] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact' }),
        supabase.from('profiles').select('*', { count: 'exact' }),
        supabase.from('analytics_events').select('*').limit(100)
      ]);

      const publishedProjects = projectsResult.data?.filter(p => p.status === 'published').length || 0;
      const draftProjects = (projectsResult.count || 0) - publishedProjects;
      
      // Mock recent activity for now
      const recentActivity = [
        {
          id: '1',
          type: 'project_created' as const,
          title: 'Nouveau projet: Villa Luxueuse Paphos',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2', 
          type: 'user_registered' as const,
          title: 'Nouvel utilisateur inscrit',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          type: 'favorite_added' as const,
          title: 'Projet ajouté aux favoris',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        }
      ];

      return {
        totalProjects: projectsResult.count || 0,
        totalUsers: usersResult.count || 0,
        publishedProjects,
        draftProjects,
        totalViews: analyticsResult.data?.filter(e => e.event_name === 'page_view').length || 0,
        totalFavorites: 0, // Would come from favorites table
        totalDownloads: analyticsResult.data?.filter(e => e.event_name === 'pdf_download').length || 0,
        conversionRate: 4.2, // Mock data
        recentActivity
      };
    },
    refetchInterval: 30000 // Refresh every 30 seconds for real-time feel
  });

  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="p-8">
        <LoadingSpinner size="lg" text="Chargement du tableau de bord..." />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Projets',
      value: stats?.totalProjects || 0,
      icon: Building,
      description: `${stats?.publishedProjects || 0} publiés, ${stats?.draftProjects || 0} brouillons`,
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Utilisateurs Actifs',
      value: stats?.totalUsers || 0,
      icon: Users,
      description: 'Comptes enregistrés',
      trend: '+8%',
      trendUp: true
    },
    {
      title: 'Vues Totales',
      value: stats?.totalViews || 0,
      icon: Eye,
      description: 'Pages vues ce mois',
      trend: '+15%',
      trendUp: true
    },
    {
      title: 'Taux Conversion',
      value: `${stats?.conversionRate || 0}%`,
      icon: TrendingUp,
      description: 'Objectif: 5%',
      trend: '+0.8%',
      trendUp: true
    }
  ];

  const quickActions = [
    {
      title: 'Nouveau Projet',
      description: 'Ajouter une propriété',
      icon: Building,
      action: () => navigate('/admin/projects'),
      color: 'primary'
    },
    {
      title: 'Gérer Utilisateurs',
      description: 'Modération des comptes',
      icon: Users,
      action: () => navigate('/admin/users'),
      color: 'secondary'
    },
    {
      title: 'Voir Analytics',
      description: 'Rapports détaillés',
      icon: TrendingUp,
      action: () => navigate('/admin/analytics'),
      color: 'accent'
    }
  ];

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
              Tableau de Bord
            </h1>
            <p className="text-lg admin-text-secondary-override mt-2">
              Aperçu de votre plateforme ENKI-REALTY
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-3 py-1">
              <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
              Système en ligne
            </Badge>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exporter Rapport
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
        {statCards.map((stat, index) => (
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
                <div className="text-3xl font-light tracking-tight text-primary mb-1">
                  {stat.value}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-secondary">
                    {stat.description}
                  </p>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${stat.trendUp ? 'text-success' : 'text-destructive'}`}
                  >
                    {stat.trend}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <motion.div
          variants={item}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.4 }}
          className="xl:col-span-1"
        >
          <Card className="h-full shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Actions Rapides
              </CardTitle>
              <CardDescription>
                Accès direct aux fonctions principales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto p-4 hover:shadow-md transition-all duration-200"
                    onClick={action.action}
                  >
                    <action.icon className="w-5 h-5 mr-3 text-primary" />
                    <div className="text-left">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-xs text-secondary">{action.description}</div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          variants={item}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.6 }}
          className="xl:col-span-2"
        >
          <Card className="h-full shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Activité Récente
              </CardTitle>
              <CardDescription>
                Derniers événements sur la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors duration-200"
                  >
                    <div className="p-2 rounded-full bg-primary/10">
                      {activity.type === 'project_created' && <Building className="w-4 h-4 text-primary" />}
                      {activity.type === 'user_registered' && <Users className="w-4 h-4 text-primary" />}
                      {activity.type === 'favorite_added' && <Heart className="w-4 h-4 text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-primary truncate">
                        {activity.title}
                      </p>
                      <p className="text-xs text-secondary">
                        {new Date(activity.timestamp).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};