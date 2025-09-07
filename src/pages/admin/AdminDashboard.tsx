import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

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
const AdminContent = lazy(() => import('./AdminContent').then(module => ({ default: module.AdminContent })));
const AdminLeads = lazy(() => import('./AdminLeads'));
const AdminPipeline = lazy(() => import('./AdminPipeline'));
const AdminReports = lazy(() => import('./AdminReports'));
const AdminTests = lazy(() => import('./AdminTests'));

import { useAuth } from '@/contexts/AuthContext';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export const AdminDashboard = () => {
  const { profile } = useAuth();

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-primary mb-2">Accès Restreint</h2>
            <p className="text-secondary">
              Seuls les administrateurs peuvent accéder à cette section.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <PrivateRoute adminOnly>
      <div className="min-h-screen bg-muted/30 admin-theme">
        <SidebarProvider defaultOpen>
          <div className="flex min-h-screen w-full">
            <AdminSidebar />
            <main className="flex-1 pt-16">
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
                <Route path="reports" element={<AdminReports />} />
                <Route path="settings" element={<AdminContent />} />
                {process.env.NODE_ENV === 'development' && (
                  <Route path="tests" element={<AdminTests />} />
                )}
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Routes>
            </main>
          </div>
        </SidebarProvider>
      </div>
    </PrivateRoute>
  );
};