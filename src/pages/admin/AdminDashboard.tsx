import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/dainabase-ui';
import { AdminSidebarExecutive } from '@/components/admin/AdminSidebarExecutive';
import AdminFooter from '@/components/admin/AdminFooter';

// Lazy load admin pages for better performance
const AdminOverview = lazy(() => import('./AdminOverview').then(module => ({ default: module.AdminOverview })));
const AdminDevelopers = lazy(() => import('./AdminDevelopers'));
const AdminProjects = lazy(() => import('./AdminProjects'));
const AdminUnits = lazy(() => import('./AdminUnits'));
const AdminCommissions = lazy(() => import('./AdminCommissions').then(module => ({ default: module.AdminCommissions })));
const AdminUsers = lazy(() => import('./AdminUsers').then(module => ({ default: module.AdminUsers })));
const AdminAnalytics = lazy(() => import('./AdminAnalytics').then(module => ({ default: module.AdminAnalytics })));
const AdminPredictions = lazy(() => import('./AdminPredictions'));
const AdminSegmentation = lazy(() => import('./AdminSegmentation'));
const AdminPerformance = lazy(() => import('./AdminPerformance'));
const AdminDocumentation = lazy(() => import('./AdminDocumentation'));
const AdminContent = lazy(() => import('./AdminContent').then(module => ({ default: module.AdminContent })));
const AdminLeads = lazy(() => import('./AdminLeads'));
const AdminPipeline = lazy(() => import('./AdminPipeline'));
const AdminReports = lazy(() => import('./AdminReports'));
const AdminTests = lazy(() => import('./AdminTests'));

import { useAuth } from '@/contexts/AuthContext';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { Card } from '@/components/dainabase-ui';
import { AlertCircle } from 'lucide-react';

const AdminHeader = () => (
  <div className="h-32 px-6 flex items-center justify-between bg-card border-b border-border">
    <div className="flex items-center gap-4">
      <a href="/" className="text-2xl font-bold text-primary hover:text-primary-hover transition-colors uppercase">
        ENKI-REALTY
      </a>
      <span className="text-muted-foreground">|</span>
      <span className="text-lg text-muted-foreground">Admin Dashboard</span>
    </div>
    <div className="flex items-center gap-4">
      <a href="/" className="text-base text-muted-foreground hover:text-primary transition-colors">
        Retour au site
      </a>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { profile } = useAuth();

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card variant="executive" padding="lg" className="max-w-md mx-auto">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-primary mb-2">Accès Restreint</h2>
            <p className="text-muted-foreground">
              Seuls les administrateurs peuvent accéder à cette section.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <PrivateRoute adminOnly>
      <AppShell
        variant="executive"
        header={<AdminHeader />}
        sidebar={<AdminSidebarExecutive />}
      >
        <Routes>
          <Route path="" element={<AdminOverview />} />
          <Route path="developers" element={<AdminDevelopers />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="units" element={<AdminUnits />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="pipeline" element={<AdminPipeline />} />
          <Route path="commissions" element={<AdminCommissions />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="predictions" element={<AdminPredictions />} />
          <Route path="segmentation" element={<AdminSegmentation />} />
          <Route path="performance" element={<AdminPerformance />} />
          <Route path="documentation" element={<AdminDocumentation />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminContent />} />
          {process.env.NODE_ENV === 'development' && (
            <Route path="tests" element={<AdminTests />} />
          )}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AppShell>
    </PrivateRoute>
  );
};

export default AdminDashboard;