import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/dainabase-ui';
import { AdminSidebarExecutive } from '@/components/admin/AdminSidebarExecutive';
import AdminFooter from '@/components/admin/AdminFooter';
import { useAuth } from '@/contexts/AuthContext';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

// Import direct pour AdminOverview pour éviter les problèmes
import { AdminOverview } from './AdminOverview';

// Lazy load admin pages avec gestion d'erreur simplifiée
const AdminDevelopers = lazy(() => import('./AdminDevelopers'));
const AdminProjects = lazy(() => import('./AdminProjects'));
const AdminBuildings = lazy(() => import('./AdminBuildings'));
const AdminProperties = lazy(() => import('./AdminProperties'));
const AdminProjectForm = lazy(() => import('./AdminProjectForm'));
const AdminProjectDetail = lazy(() => import('./AdminProjectDetail'));
const ProjectDashboard = lazy(() => import('./projects/[id]/dashboard'));
const AdminUnits = lazy(() => import('./AdminUnits'));
const AdminCommissions = lazy(() => 
  import('./AdminCommissions').then(module => ({
    default: module.AdminCommissions || module.default
  }))
);
const AdminSettings = lazy(() => import('./AdminSettings'));
const AdminAnalytics = lazy(() => import('./AdminAnalytics'));
const AdminPredictions = lazy(() => import('./AdminPredictions'));
const AdminSegmentation = lazy(() => import('./AdminSegmentation'));
const AdminPerformance = lazy(() => import('./AdminPerformance'));
const AdminDocumentation = lazy(() => import('./AdminDocumentation'));
const AdminContent = lazy(() => import('./AdminContent'));
const AdminLeads = lazy(() => import('./AdminLeads'));
const AdminPipeline = lazy(() => import('./AdminPipeline'));
const AdminReports = lazy(() => import('./AdminReports'));
const AdminTests = lazy(() => import('./AdminTests'));

const AdminHeader = () => (
  <div className="sticky top-0 z-50 h-32 px-6 flex items-center justify-between bg-white border-b border-slate-200">
    <div className="flex items-center gap-4">
      <a href="/" className="text-2xl font-bold text-slate-900 hover:text-slate-700 transition-colors uppercase">
        ENKI-REALTY
      </a>
      <span className="text-slate-400">|</span>
      <span className="text-lg text-slate-500">Admin Dashboard</span>
    </div>
    <div className="flex items-center gap-4">
      <a href="/" className="text-base text-slate-600 hover:text-slate-900 transition-colors">
        Retour au site
      </a>
    </div>
  </div>
);

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-64">
    <LoadingSpinner />
  </div>
);

const AdminDashboard = () => {
  const { profile } = useAuth();

  // Vérification des droits d'accès
  if (profile?.role === 'user') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <Card className="max-w-md mx-auto p-8">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Accès Restreint</h2>
            <p className="text-slate-600">
              Seuls les administrateurs peuvent accéder à cette section.
            </p>
            <a 
              href="/login" 
              className="mt-4 inline-block text-blue-600 hover:underline"
            >
              Se connecter
            </a>
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
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="developers" element={<AdminDevelopers />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="buildings" element={<AdminBuildings />} />
            <Route path="properties" element={<AdminProperties />} />
            <Route path="projects/new" element={<AdminProjectForm />} />
            <Route path="projects/:id" element={<AdminProjectDetail />} />
            <Route path="projects/:id/edit" element={<AdminProjectForm />} />
            <Route path="projects/:id/dashboard" element={<ProjectDashboard />} />
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
            <Route path="settings" element={<AdminSettings />} />
            {process.env.NODE_ENV === 'development' && (
              <Route path="tests" element={<AdminTests />} />
            )}
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </Suspense>
      </AppShell>
    </PrivateRoute>
  );
};

export default AdminDashboard;
