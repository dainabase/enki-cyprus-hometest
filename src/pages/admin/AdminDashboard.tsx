import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/dainabase-ui';

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

// Sidebar simple pour l'AppShell
const AdminSidebarSimple = () => (
  <div className="p-4 text-white">
    <nav className="space-y-2">
      <a href="/admin" className="block px-3 py-2 rounded hover:bg-slate-800">Dashboard</a>
      <a href="/admin/projects" className="block px-3 py-2 rounded hover:bg-slate-800">Projets</a>
      <a href="/admin/analytics" className="block px-3 py-2 rounded hover:bg-slate-800">Analytics</a>
    </nav>
  </div>
);

const AdminHeader = () => (
  <div className="h-16 px-6 flex items-center justify-between bg-slate-900 text-white">
    <h1 className="text-xl font-semibold">Enki Realty - Admin Dashboard</h1>
    <div className="flex items-center gap-4">
      <span className="text-sm text-slate-300">Cyprus Real Estate Platform</span>
    </div>
  </div>
);

export const AdminDashboard = () => {
  const { profile } = useAuth();

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <Card variant="executive" padding="lg" className="max-w-md mx-auto">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Accès Restreint</h2>
            <p className="text-slate-600">
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
        sidebar={<AdminSidebarSimple />}
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